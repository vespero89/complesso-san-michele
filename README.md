# Complesso San Michele — Offida

Sito vetrina + backend prenotazioni per il Complesso San Michele di Offida (AP).  
Tre sezioni: **Chiesa** (centro polifunzionale), **Laboratorio** (studio di arte e lavoro), **Dimora** (affittacamere, 2 camere).

---

## Indice

1. [Struttura del progetto](#struttura-del-progetto)
2. [Come testare in locale](#come-testare-in-locale)
3. [Deploy in produzione (Docker)](#deploy-in-produzione-docker)
4. [Gestione admin](#gestione-admin)
5. [Flusso di prenotazione](#flusso-di-prenotazione)
6. [Email automatiche](#email-automatiche)
7. [Tariffe dinamiche](#tariffe-dinamiche)
8. [Attivare i pagamenti Stripe](#attivare-i-pagamenti-stripe)
9. [Aggiungere le foto](#aggiungere-le-foto)
10. [Raccomandazioni di sicurezza](#raccomandazioni-di-sicurezza)
11. [Sviluppi futuri](#sviluppi-futuri)

---

## Struttura del progetto

```
complesso-san-michele/
│
├── app.py                  # Flask: API REST + admin + serving frontend
├── requirements.txt        # Dipendenze Python
├── .env.example            # Template variabili d'ambiente (copiare in .env)
├── .gitignore
│
├── templates/              # Template Jinja2 (solo pannello admin)
│   ├── login.html          # Pagina di login admin
│   ├── admin.html          # Dashboard prenotazioni + tariffe + newsletter
│   └── action_result.html  # Risposta a conferma/rifiuto via email
│
└── project/                # Frontend statico (React SPA)
    ├── Complesso San Michele.html   # Entry point del sito
    ├── app.jsx             # Tutta la logica React (SPA)
    ├── styles.css          # Stili globali
    ├── image-slot.js       # Componente web per placeholder foto
    └── assets/
        ├── lpp-logo.jpg    # Logo Lavoro per la Persona
        └── merlettaie.jpeg # Immagine di sfondo hero
```

### Architettura

```
Browser
  │
  ├── GET /                     → Flask serve project/Complesso San Michele.html
  ├── GET /styles.css           → Flask serve project/styles.css
  ├── GET /app.jsx              → Flask serve project/app.jsx
  │
  ├── GET  /api/unavailable     → date occupate (calendario Dimora)
  ├── GET  /api/price           → stima prezzo soggiorno
  ├── POST /api/bookings        → nuova richiesta prenotazione → email admin
  ├── POST /api/newsletter      → iscrizione newsletter
  │
  ├── POST /api/bookings/{id}/checkout  → sessione Stripe (se abilitato)
  ├── POST /api/webhooks/stripe          → webhook pagamento Stripe
  │
  ├── GET  /gestione/action     → conferma/rifiuta da email (token HMAC, no login)
  └── /gestione/*               → pannello admin (Flask-Login richiesto)
```

---

## Come testare in locale

### Prerequisiti

- Python 3.10+
- pip

### 1. Clona il repo e crea l'ambiente virtuale

```bash
git clone https://github.com/vespero89/complesso-san-michele.git
cd complesso-san-michele

python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configura le variabili d'ambiente

```bash
cp .env.example .env
```

Apri `.env` e imposta almeno:

```env
SECRET_KEY=una-stringa-casuale-lunga-qualsiasi
ADMIN_USERNAME=admin
ADMIN_PASSWORD=la-tua-password-di-sviluppo   # solo per locale, vedi sotto per produzione
```

> In sviluppo puoi usare `ADMIN_PASSWORD` (plaintext). In produzione usa **sempre** `ADMIN_PASSWORD_HASH`.

### 3. Avvia il server

```bash
python app.py
```

Il sito è disponibile su **http://localhost:5000**  
Il pannello admin su **http://localhost:5000/gestione**

### 4. Verifica rapida

| URL | Cosa aspettarsi |
|-----|----------------|
| `http://localhost:5000` | Sito completo (React SPA) |
| `http://localhost:5000/gestione` | Redirect al login |
| `http://localhost:5000/gestione/login` | Pagina di login |
| `http://localhost:5000/api/unavailable?room=double` | JSON con date occupate |
| `http://localhost:5000/api/price?room=double&check_in=2025-08-01&check_out=2025-08-05` | Stima prezzo |

---

## Deploy in produzione (Docker)

Stack: **VPS (Hetzner CX11 ~€4/mese) + Docker + Nginx Proxy Manager**  
Nginx Proxy Manager gestisce HTTPS/Let's Encrypt con interfaccia grafica — nessuna configurazione Nginx manuale.

### Prerequisiti sul VPS

```bash
# Docker + Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # poi rilogga
```

Se non hai ancora Nginx Proxy Manager, avvialo una volta sola:

```bash
mkdir ~/npm && cd ~/npm
cat > docker-compose.yml << 'EOF'
services:
  app:
    image: jc21/nginx-proxy-manager:latest
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "81:81"    # interfaccia admin NPM
    volumes:
      - npm_data:/data
      - npm_letsencrypt:/etc/letsencrypt
volumes:
  npm_data:
  npm_letsencrypt:
EOF
docker compose up -d
```

Interfaccia NPM: `http://IP-VPS:81` — credenziali default `admin@example.com` / `changeme`.

---

### 1. Clona il repo sul VPS

```bash
git clone https://github.com/vespero89/complesso-san-michele.git /srv/csm
cd /srv/csm
```

### 2. Configura le variabili d'ambiente

```bash
cp .env.example .env
nano .env
```

**Genera l'hash della password admin:**

```bash
docker run --rm python:3.11-slim python3 -c \
  "from werkzeug.security import generate_password_hash; print(generate_password_hash('LA-TUA-PASSWORD'))"
```

Impostazioni minime nel `.env`:

```env
SECRET_KEY=stringa-casuale-lunga-almeno-32-caratteri
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=pbkdf2:sha256:...   # hash generato sopra
SITE_URL=https://www.complessosanmichele-offida.it
FLASK_ENV=production
```

> `DATABASE_URL` non serve: `docker-compose.yml` la imposta già a `/app/data/csm.db` nel volume persistente.

### 3. Avvia il container

```bash
docker compose up -d --build
```

Verifica che giri:

```bash
docker compose logs -f          # log in tempo reale
curl http://localhost:5000       # deve rispondere con l'HTML del sito
```

### 4. Configura Nginx Proxy Manager

1. Apri `http://IP-VPS:81` → **Proxy Hosts → Add Proxy Host**
2. Compila:
   - **Domain Names**: `complessosanmichele-offida.it` e `www.complessosanmichele-offida.it`
   - **Scheme**: `http`
   - **Forward Hostname/IP**: `IP-VPS` (o `host.docker.internal` se NPM è sullo stesso host)
   - **Forward Port**: `5000`
3. Tab **SSL** → *Request a new SSL Certificate* → spunta *Force SSL* → salva

NPM ottiene automaticamente il certificato Let's Encrypt e lo rinnova. Finito.

### 5. Verifica finale

```bash
curl https://www.complessosanmichele-offida.it/api/unavailable
# deve rispondere: []
```

---

### Aggiornare il sito dopo modifiche

**Cambi al frontend** (CSS, JSX, HTML) — nessun rebuild:
```bash
git pull   # i file project/ sono bind-mounted, visibili subito
```

**Cambi al backend** (app.py, requirements.txt) — rebuild necessario:
```bash
git pull
docker compose up -d --build
```

### Comandi utili

```bash
docker compose logs -f           # log in tempo reale
docker compose restart           # riavvia senza rebuild
docker compose down              # ferma e rimuove container (dati salvi nel volume)
docker compose down -v           # ⚠ ferma E cancella anche i dati (database!)
docker exec -it csm-web bash     # shell dentro il container
```

### Backup del database

Il database SQLite è in un volume Docker. Per fare backup:

```bash
docker cp csm-web:/app/data/csm.db ~/backup-csm-$(date +%Y%m%d).db
```

Crontab giornaliero consigliato:

```bash
0 3 * * * docker cp csm-web:/app/data/csm.db ~/backups/csm-$(date +\%Y\%m\%d).db
```

---

## Gestione admin

Il pannello admin è accessibile all'URL **`/gestione`** (non `/admin`, per ridurre i bot automatici).

### Rotte

| URL | Funzione |
|-----|----------|
| `/gestione/login` | Pagina di login (rate-limited: 5 tentativi/min per IP) |
| `/gestione` | Dashboard prenotazioni |
| `/gestione/rates` | Gestione tariffe dinamiche |
| `/gestione/newsletter` | Lista iscritti newsletter |
| `/gestione/action?token=…` | Conferma/rifiuta da link email (no login, token HMAC) |
| `/gestione/logout` | Logout |

### Gestione prenotazioni

1. Accedi con username e password
2. Nella tabella vedi tutte le richieste con stato **In attesa / Confermata / Rifiutata / Annullata**
3. Usa il menu a tendina + "Salva" per cambiare lo stato manualmente
4. Usa i filtri in alto per vedere solo le prenotazioni di uno stato specifico
5. Ogni cambio di stato invia automaticamente un'email all'ospite (se `MAIL_ENABLED=true`)

### Cambiare la password admin

```bash
# Genera nuovo hash
python3 -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('NUOVA-PASSWORD'))"

# Aggiorna il .env sul server
nano /srv/csm/.env
# → aggiorna ADMIN_PASSWORD_HASH

# Riavvia il container
cd /srv/csm && docker compose restart
```

---

## Flusso di prenotazione

### Flusso attuale (senza pagamento online)

```
Ospite compila il form Dimora
        │
        ▼
POST /api/bookings
  → Prenotazione salvata con status = "pending"
  → Email all'admin con dettagli e due pulsanti:
        [✓ Conferma]   [✕ Rifiuta]
        │
        ▼ (admin clicca da email, nessun login richiesto)
GET /gestione/action?token=<HMAC-firmato>
  → Token verificato (HMAC-SHA256, valido 7 giorni)
  → Status aggiornato a "confirmed" o "rejected"
  → Email all'ospite con l'esito
  → Pagina di conferma all'admin con dettagli prenotazione
```

I token d'azione sono **firmati con HMAC-SHA256** usando `SECRET_KEY` e contengono un timestamp: scadono dopo 7 giorni e non possono essere falsificati. Cliccare più volte lo stesso link è sicuro: la pagina mostrerà "già elaborata" senza modificare nulla.

In alternativa all'email, l'admin può gestire tutto dal pannello `/gestione` (cambio stato manuale con menu a tendina).

### Flusso futuro (con pagamento online Stripe)

> Attivabile impostando `STRIPE_ENABLED=true` nel `.env`. Il codice è già integrato.

```
Ospite compila il form Dimora
        │
        ▼
POST /api/bookings
  → Prenotazione salvata con status = "pending"
  → Email all'admin (solo notifica, nessun pulsante conferma/rifiuta)
        │
        ▼ (l'admin accetta la prenotazione dal pannello)
POST /api/bookings/{id}/checkout
  → Stripe crea una sessione di pagamento
  → Ospite viene reindirizzato alla pagina di pagamento Stripe
        │
        ▼ (ospite completa il pagamento)
POST /api/webhooks/stripe  ← Stripe notifica il server
  → payment_status aggiornato a "paid"
  → status aggiornato a "confirmed"
  → Email di conferma all'ospite
```

Nel flusso Stripe il prezzo è calcolato notte per notte usando le **tariffe dinamiche** (vedi sezione apposita), con fallback ai prezzi fissi in `.env`.

---

## Email automatiche

Le email sono gestite internamente con `smtplib` (STARTTLS). Provider consigliato: **Brevo** (ex Sendinblue), gratuito fino a 300 email/giorno.

### Abilitare le email

Nel `.env`:

```env
MAIL_ENABLED=true
MAIL_FROM=info@complessosanmichele-offida.it
ADMIN_EMAIL=info@complessosanmichele-offida.it

# Credenziali Brevo (registrati su brevo.com → SMTP & API)
MAIL_SMTP_HOST=smtp.brevo.com
MAIL_SMTP_PORT=587
MAIL_USERNAME=la-tua-email@esempio.it
MAIL_PASSWORD=la-tua-smtp-key-brevo
```

Con `MAIL_ENABLED=false` (default), le email vengono solo stampate nei log del container — utile in sviluppo per vedere il contenuto senza configurare un server SMTP.

### Cosa viene inviato e quando

| Evento | Destinatario | Contenuto |
|--------|-------------|-----------|
| Nuova prenotazione ricevuta | Admin | Dettagli ospite + camera + date + pulsanti [Conferma] [Rifiuta] con link firmati |
| Prenotazione confermata | Ospite | Conferma con dettagli soggiorno e invito a contattare per info |
| Prenotazione rifiutata | Ospite | Comunicazione con invito a ricontattare per alternative |

### Configurazione alternativa con Gmail

```env
MAIL_SMTP_HOST=smtp.gmail.com
MAIL_SMTP_PORT=587
MAIL_USERNAME=tuoemail@gmail.com
MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx   # App Password (non la password Google)
```

Per generare un'App Password Gmail: `account.google.com → Sicurezza → Verifica in due passaggi → Password per le app`.  
Gmail è meno consigliato per produzione per via dei limiti di invio e delle policy anti-spam.

---

## Tariffe dinamiche

I prezzi per notte non sono fissi: si possono configurare per camera e periodo dall'interfaccia admin in `/gestione/rates`.

### Come funziona

Le tariffe sono salvate nel modello `RoomRate` (tabella nel database) con questi campi:

| Campo | Descrizione |
|-------|-------------|
| `room` | `double` \| `single` \| `both` (entrambe le camere) |
| `date_from` / `date_to` | Periodo di validità |
| `price_cents` | Prezzo per notte in centesimi (es. `9500` = €95,00) |
| `label` | Etichetta descrittiva (es. "Alta stagione luglio-agosto") |

**Priorità**: se più tariffe coprono la stessa notte, vince quella con `date_from` più recente (cioè la più specifica). Se non c'è nessuna tariffa per una notte, si usa il fallback da `.env` (`STRIPE_PRICE_DOUBLE_CENTS` / `STRIPE_PRICE_SINGLE_CENTS`).

### Gestione dall'admin

Dalla sezione **Tariffe** del pannello `/gestione/rates`:
- Aggiungi una nuova tariffa con camera, periodo, prezzo e label
- Visualizza tutte le tariffe attive ordinate per data
- Elimina una tariffa (la notte tornerà al prezzo di fallback)

### Prezzi di fallback

Nel `.env`, configurano il prezzo per notte quando non c'è nessuna `RoomRate` che copre quella data:

```env
STRIPE_PRICE_DOUBLE_CENTS=8000   # €80,00 per notte — matrimoniale
STRIPE_PRICE_SINGLE_CENTS=6000   # €60,00 per notte — singola
```

Questi valori sono usati anche per la stima prezzo (`/api/price`) e per il checkout Stripe.

---

## Attivare i pagamenti Stripe

Stripe è già integrato nel codice. Con `STRIPE_ENABLED=false` (default), il flusso di prenotazione usa la conferma manuale via email (vedi [Flusso di prenotazione](#flusso-di-prenotazione)). Attivando Stripe, il pagamento online diventa parte del flusso di conferma.

### Passo 1 — Crea un account Stripe

Vai su [stripe.com](https://stripe.com) e completa la verifica del commerciante.

### Passo 2 — Ottieni le chiavi API

Dalla dashboard Stripe:
- `Developers → API keys → Secret key` → copia in `STRIPE_SECRET_KEY`

### Passo 3 — Configura il webhook

- `Developers → Webhooks → Add endpoint`
- URL: `https://www.complessosanmichele-offida.it/api/webhooks/stripe`
- Evento da ascoltare: `checkout.session.completed`
- Copia il **Signing secret** in `STRIPE_WEBHOOK_SECRET`

### Passo 4 — Imposta i prezzi di fallback

Nel `.env`, imposta il prezzo per notte in **centesimi di euro** (usato quando non ci sono tariffe dinamiche):

```env
STRIPE_PRICE_DOUBLE_CENTS=8000   # €80,00 per notte — matrimoniale
STRIPE_PRICE_SINGLE_CENTS=6000   # €60,00 per notte — singola
```

### Passo 5 — Abilita

```env
STRIPE_ENABLED=true
```

Riavvia il servizio (`docker compose up -d --build`). Da questo momento, dopo ogni prenotazione il frontend può avviare il checkout Stripe. Il webhook conferma il pagamento e aggiorna automaticamente lo stato a `confirmed`.

### Test in locale con Stripe CLI

```bash
# Installa Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# In un altro terminale, simula un pagamento completato:
stripe trigger checkout.session.completed
```

---

## Aggiungere le foto

Le foto del sito sono gestite tramite **drag & drop** direttamente nel browser (componente `image-slot`):

1. Apri il sito
2. Trascina una foto sopra qualsiasi riquadro grigio
3. La foto viene salvata localmente (nel file `.image-slots.state.json`)

Per renderle permanenti sul server, copia il file stato sul VPS:

```bash
scp project/.image-slots.state.json user@IP-VPS:/srv/csm/project/
```

### Sostituire le foto di sfondo hardcoded

| Immagine | File da sostituire |
|----------|-------------------|
| Merlettaie (hero background) | `project/assets/merlettaie.jpeg` |
| Logo LpP (pagina Chiesa) | `project/assets/lpp-logo.jpg` |

Per cambiare opacità e contrasto delle merlettaie, edita `project/styles.css`:

```css
.hero-merlettaie {
  opacity: 0.36;                    /* 0 = invisibile, 1 = piena */
  filter: contrast(1) sepia(0.3);   /* contrasto e tonalità */
}
```

---

## Raccomandazioni di sicurezza

### Obbligatorie prima del go-live

- [ ] **HTTPS attivo** (Let's Encrypt, vedi sopra) — obbligatorio per sessioni sicure e Stripe
- [ ] **`SECRET_KEY` lunga e casuale** — genera con `python3 -c "import secrets; print(secrets.token_hex(32))"`
- [ ] **`ADMIN_PASSWORD_HASH`** — mai usare `ADMIN_PASSWORD` in produzione
- [ ] **`.env` fuori dal repo** — verificare che `.gitignore` includa `.env`
- [ ] **`csm.db` nel volume Docker** — `docker-compose.yml` già lo posiziona in `/app/data/`, non nella web root

### Fortemente consigliate

- [ ] **Backup automatico del database** — crontab giornaliero (vedi [Backup del database](#backup-del-database))
- [ ] **Limitare accesso admin per IP** — se hai un IP fisso, configura in NPM una regola di accesso per `/gestione`
- [ ] **Fail2ban** — protegge da brute force a livello di sistema operativo (complementare al rate limiting Flask)
- [ ] **Rate limiting già attivo** — Flask-Limiter blocca 5 tentativi di login al minuto per IP

### Non necessarie per questa scala

- JWT, OAuth2, 2FA, database utenti multipli — overengineering per un B&B con un solo admin.

---

## Sviluppi futuri

Il codice è strutturato per aggiungere funzionalità senza riscrivere nulla.

### Upload immagini dall'admin

Aggiungere `POST /gestione/upload` per caricare le foto direttamente dal pannello admin, senza usare drag & drop o SCP manuale. Le immagini verrebbero salvate in `project/assets/` e referenziate nel frontend.

### Più operatori / ruoli

Se in futuro serviranno più account (es. receptionist), aggiungere una tabella `users` con campo `role` e sostituire il singleton `AdminUser` con Flask-Login completo. Il resto dell'architettura non cambia.

### Migrazione da SQLite a PostgreSQL

Il codice usa SQLAlchemy: basta cambiare `DATABASE_URL` nel `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost/csm
```

e installare `psycopg2-binary`. Nessuna modifica al codice.

### SEO e performance

Il sito usa React via CDN con transpilazione Babel nel browser (ritardo ~1-2s al primo caricamento). Per migliorare:
1. Pre-compilare `app.jsx` con Babel CLI → `app.js` (bundle statico)
2. Nginx serve il bundle compilato direttamente (nessuna richiesta a Flask per i file statici)

Quando il traffico lo giustificherà, migrare a **Vite + React** per bundle ottimizzati, code splitting e lazy loading.

---

## Contatti progetto

**Complesso San Michele**  
Via San Michele, 63073 Offida (AP) — Marche, Italia  
info@complessosanmichele-offida.it  

In collaborazione con [Lavoro per la Persona](https://www.lavoroperlapersona.it/)
