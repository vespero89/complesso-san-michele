# Complesso San Michele — Offida

Sito vetrina + backend prenotazioni per il Complesso San Michele di Offida (AP).  
Tre sezioni: **Chiesa** (centro polifunzionale), **Laboratorio** (studio di arte e lavoro), **Dimora** (affittacamere, 2 camere).

---

## Indice

1. [Struttura del progetto](#struttura-del-progetto)
2. [Come testare in locale](#come-testare-in-locale)
3. [Deploy in produzione](#deploy-in-produzione)
4. [Gestione admin](#gestione-admin)
5. [Attivare i pagamenti Stripe](#attivare-i-pagamenti-stripe)
6. [Aggiungere le foto](#aggiungere-le-foto)
7. [Raccomandazioni di sicurezza](#raccomandazioni-di-sicurezza)
8. [Sviluppi futuri](#sviluppi-futuri)

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
│   └── admin.html          # Dashboard prenotazioni + newsletter
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
  ├── GET /                → Flask serve project/Complesso San Michele.html
  ├── GET /styles.css      → Flask serve project/styles.css
  ├── GET /app.jsx         → Flask serve project/app.jsx  (idem altri file statici)
  │
  ├── GET  /api/unavailable   → date occupate (calendario Dimora)
  ├── POST /api/bookings      → nuova richiesta prenotazione
  ├── POST /api/newsletter    → iscrizione newsletter
  │
  ├── POST /api/bookings/{id}/checkout  → sessione Stripe (se abilitato)
  ├── POST /api/webhooks/stripe          → webhook pagamento Stripe
  │
  └── /gestione/*          → pannello admin (Flask-Login richiesto)
```

---

## Come testare in locale

### Prerequisiti

- Python 3.10+
- pip

### 1. Clona il repo e crea l'ambiente virtuale

```bash
git clone https://github.com/TUO-UTENTE/complesso-san-michele.git
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

---

## Deploy in produzione

Stack consigliato: **VPS (Hetzner CX11 ~€4/mese) + Nginx + Gunicorn + Let's Encrypt**

### 1. Prepara il server (Ubuntu 22.04)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv nginx certbot python3-certbot-nginx -y
```

### 2. Carica il progetto

```bash
# Dal tuo computer
scp -r . user@IP-VPS:/var/www/csm/

# Sul server
cd /var/www/csm
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

### 3. Configura le variabili d'ambiente

```bash
cp .env.example .env
nano .env
```

**Genera l'hash della password admin** (eseguilo sul server):

```bash
python3 -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('LA-TUA-PASSWORD'))"
```

Incolla l'output in `ADMIN_PASSWORD_HASH` nel `.env`. Rimuovi `ADMIN_PASSWORD` dal file.

Impostazioni minime per produzione:

```env
SECRET_KEY=stringa-casuale-lunga-almeno-32-caratteri
DATABASE_URL=sqlite:////var/www/csm/csm.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=pbkdf2:sha256:...  # hash generato sopra
SITE_URL=https://www.complessosanmichele-offida.it
FLASK_ENV=production
```

### 4. Crea il servizio systemd

```bash
sudo nano /etc/systemd/system/csm.service
```

```ini
[Unit]
Description=Complesso San Michele Flask App
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/csm
Environment="PATH=/var/www/csm/venv/bin"
EnvironmentFile=/var/www/csm/.env
ExecStart=/var/www/csm/venv/bin/gunicorn --workers 2 --bind 127.0.0.1:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable csm
sudo systemctl start csm
sudo systemctl status csm   # verifica che sia running
```

### 5. Configura Nginx

```bash
sudo nano /etc/nginx/sites-available/csm
```

```nginx
server {
    listen 80;
    server_name complessosanmichele-offida.it www.complessosanmichele-offida.it;

    # File statici serviti direttamente da Nginx (più veloce di Flask)
    location /project/ {
        alias /var/www/csm/project/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Tutto il resto passa a Gunicorn
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/csm /etc/nginx/sites-enabled/
sudo nginx -t            # verifica configurazione
sudo systemctl reload nginx
```

### 6. HTTPS con Let's Encrypt

```bash
sudo certbot --nginx -d complessosanmichele-offida.it -d www.complessosanmichele-offida.it
```

Certbot aggiorna automaticamente la configurazione Nginx e imposta il rinnovo automatico.

### 7. Verifica finale

```bash
curl https://www.complessosanmichele-offida.it/api/unavailable
# deve rispondere con []
```

### Aggiornare il sito dopo modifiche

```bash
# Sul server, nella cartella del progetto
git pull                          # se usi git per il deploy
sudo systemctl restart csm        # riavvia Gunicorn
```

---

## Gestione admin

Il pannello admin è accessibile all'URL **`/gestione`** (non `/admin`, per ridurre i bot automatici).

### Rotte

| URL | Funzione |
|-----|----------|
| `/gestione/login` | Pagina di login |
| `/gestione` | Dashboard prenotazioni |
| `/gestione/newsletter` | Lista iscritti newsletter |
| `/gestione/logout` | Logout |

### Gestione prenotazioni

1. Accedi con username e password
2. Nella tabella vedi tutte le richieste con stato **In attesa / Confermata / Rifiutata / Annullata**
3. Usa il menu a tendina + "Salva" per cambiare lo stato
4. Usa i filtri in alto per vedere solo le prenotazioni di uno stato specifico

### Cambiare la password admin

```bash
# Genera nuovo hash
python3 -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('NUOVA-PASSWORD'))"

# Aggiorna il .env sul server
nano /var/www/csm/.env
# → aggiorna ADMIN_PASSWORD_HASH

# Riavvia il servizio
sudo systemctl restart csm
```

---

## Attivare i pagamenti Stripe

Stripe è già integrato nel codice, disabilitato di default.

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

### Passo 4 — Imposta i prezzi

Nel `.env`, imposta il prezzo per notte in **centesimi di euro**:

```env
STRIPE_PRICE_DOUBLE_CENTS=8000   # €80,00 per notte — matrimoniale
STRIPE_PRICE_SINGLE_CENTS=6000   # €60,00 per notte — singola
```

### Passo 5 — Abilita

```env
STRIPE_ENABLED=true
```

Riavvia il servizio. Da questo momento, dopo ogni prenotazione il frontend riceve l'URL del checkout Stripe. Il webhook conferma il pagamento e aggiorna automaticamente lo stato della prenotazione a `confirmed`.

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
scp project/.image-slots.state.json user@IP-VPS:/var/www/csm/project/
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
- [ ] **`csm.db` fuori dal web root** — il path di default è nella root del progetto, non servita da Nginx

### Fortemente consigliate

- [ ] **Backup automatico del database** — crontab giornaliero su `csm.db`:
  ```bash
  0 3 * * * cp /var/www/csm/csm.db /var/backups/csm/csm-$(date +\%Y\%m\%d).db
  ```
- [ ] **Limitare accesso admin per IP** — se hai un IP fisso, in Nginx:
  ```nginx
  location /gestione {
      allow TUO.IP.FISSO.QUI;
      deny all;
      proxy_pass http://127.0.0.1:5000;
  }
  ```
- [ ] **Fail2ban** — protegge da brute force a livello di server
- [ ] **Rate limiting già attivo** — Flask-Limiter blocca 5 tentativi di login al minuto per IP

### Non necessarie per questa scala

- JWT, OAuth2, 2FA, database utenti multipli — overengineering per un B&B con un solo admin.

---

## Sviluppi futuri

Il codice è strutturato per aggiungere funzionalità senza riscrivere nulla.

### Email di conferma automatica

Quando una prenotazione viene confermata (manualmente o via Stripe), inviare un'email all'ospite.

Stack consigliato: **Brevo** (ex Sendinblue) — gratuito fino a 300 email/giorno, API semplice.

```python
# In app.py, dopo booking.status = "confirmed":
import requests
requests.post("https://api.brevo.com/v3/smtp/email", headers={...}, json={
    "to": [{"email": booking.email, "name": booking.name}],
    "subject": "Prenotazione confermata — Complesso San Michele",
    "htmlContent": f"<p>Ciao {booking.name}, la tua prenotazione è confermata...</p>"
})
```

### Notifica email al proprietario per nuove richieste

Stesso meccanismo: al `POST /api/bookings`, invia un'email a `info@complessosanmichele-offida.it` con i dettagli della nuova richiesta.

### Più operatori / ruoli

Se in futuro serviranno più account (es. receptionist), aggiungere una tabella `users` con campo `role` e sostituire il singleton `AdminUser` con Flask-Login completo. Il resto dell'architettura non cambia.

### Prezzi dinamici per camera

Aggiungere una tabella `RoomRate` (camera, data_inizio, data_fine, prezzo_per_notte) e usarla nel calcolo del checkout Stripe al posto delle variabili d'ambiente fisse.

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
