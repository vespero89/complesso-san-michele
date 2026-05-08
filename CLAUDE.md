# Complesso San Michele — Offida

Sito vetrina + backend prenotazioni B&B. Flask SPA.

## Stack
- **Frontend**: React 18 (CDN) + Babel standalone, CSS custom, no build step
- **Backend**: Flask 3 + SQLAlchemy + SQLite
- **Auth admin**: Flask-Login, sessione server-side, credenziali da .env
- **Pagamenti**: Stripe (STRIPE_ENABLED=false di default, già integrato)
- **Deploy**: Docker Compose + Nginx Proxy Manager + Let's Encrypt

## Struttura chiave
- `app.py` — tutto il backend (modelli, API, admin, Stripe, rate limiting)
- `project/app.jsx` — entry point SPA React (carica i componenti)
- `project/components/` — componenti React: Header, Home, Chiesa, Laboratorio, Dimora, Booking, shared
- `project/styles/` — CSS suddiviso per area (layout, hero, content, booking, ecc.)
- `project/styles.css` — import aggregato del design system (palette: --ink #2b2620, --ocra #b8923d, --bg #f5efe2)
- `templates/admin.html` — dashboard admin (Jinja2)
- `templates/login.html` — login admin

## Modelli DB
- `Booking`: prenotazioni (room: double/single, status: pending/confirmed/rejected/cancelled)
- `RoomRate`: tariffe dinamiche per camera e periodo (fallback a .env se nessuna tariffa)

## API pubbliche
- `GET  /api/unavailable?room=double&from=YYYY-MM-DD&to=YYYY-MM-DD`
- `POST /api/bookings` — crea prenotazione (→ email admin con link conferma/rifiuta)
- `GET  /api/price?room=double&check_in=...&check_out=...` — stima prezzo
- `POST /api/newsletter` — proxy al form di lavoroperlapersona.it/contatti/
- `GET  /config.js` — inietta `window.RECAPTCHA_SITE_KEY` al frontend

## Admin
- URL: `/gestione` (non /admin — oscurato)
- Sezioni: Prenotazioni / Tariffe
- Rate limiting: 5 tentativi login/minuto per IP
- `GET /gestione/action?token=...` — conferma/rifiuta da email (no login, token HMAC)

## Email automatiche
- Nuova prenotazione → email admin con pulsanti [Conferma] [Rifiuta] (token firmato HMAC, valido 7gg)
- Admin conferma/rifiuta (da email o dashboard) → email ospite con esito
- Config: `MAIL_ENABLED=true` + credenziali SMTP nel `.env` (consigliato: Brevo)
- Con `MAIL_ENABLED=false` (default): log su console, nessuna email

## Avvio locale
```bash
cp .env.example .env
# Genera l'hash della password admin e incollalo in ADMIN_PASSWORD_HASH:
python -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('la-tua-password'))"
docker compose up -d --build
# oppure: python app.py
```

## Strumenti dev
```bash
# Genera HTML standalone (preview per il committente) → dist/
python build_standalone.py            # sito principale
python build_standalone.py --page dimora
python build_standalone.py --all
```

## reCAPTCHA v3
- Attivo su form prenotazione e newsletter
- `RECAPTCHA_ENABLED=false` (default): verifica saltata, nessuna chiave necessaria
- Per attivare: registra dominio su https://www.google.com/recaptcha/admin/create (tipo v3), poi imposta `RECAPTCHA_ENABLED=true`, `RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY` nel `.env`
- La chiave pubblica viene servita al frontend via `/config.js`

## Newsletter
La sezione newsletter del sito rimanda al form di `lavoroperlapersona.it/contatti/` (link in nuovo tab). Non c'è gestione newsletter interna.

## TODO / sviluppi futuri noti
- [ ] Sostituire image-slot con img statici (foto reali da caricare in project/assets/)
- [ ] Upload immagini dall'admin (POST /gestione/upload)
- [x] Email automatica al proprietario su nuova prenotazione (con link conferma/rifiuta)
- [x] Email di conferma/rifiuto all'ospite
- [ ] Attivare Stripe (STRIPE_ENABLED=true nel .env)
- [ ] Attivare email (MAIL_ENABLED=true + credenziali Brevo nel .env)
