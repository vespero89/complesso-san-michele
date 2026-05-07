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
- `project/app.jsx` — tutta la SPA React (Home, Chiesa, Laboratorio, Dimora, Booking)
- `project/styles.css` — design system (palette: --ink #2b2620, --ocra #b8923d, --bg #f5efe2)
- `templates/admin.html` — dashboard admin (Jinja2)
- `templates/login.html` — login admin

## Modelli DB
- `Booking`: prenotazioni (room: double/single, status: pending/confirmed/rejected/cancelled)
- `NewsletterSubscriber`: iscritti newsletter
- `RoomRate`: tariffe dinamiche per camera e periodo (fallback a .env se nessuna tariffa)

## API pubbliche
- `GET  /api/unavailable?room=double&from=YYYY-MM-DD&to=YYYY-MM-DD`
- `POST /api/bookings` — crea prenotazione (→ email admin con link conferma/rifiuta)
- `POST /api/newsletter` — iscrizione
- `GET  /api/price?room=double&check_in=...&check_out=...` — stima prezzo

## Admin
- URL: `/gestione` (non /admin — oscurato)
- Sezioni: Prenotazioni / Tariffe / Newsletter
- Rate limiting: 5 tentativi login/minuto per IP
- `GET /gestione/action?token=...` — conferma/rifiuta da email (no login, token HMAC)

## Email automatiche
- Nuova prenotazione → email admin con pulsanti [Conferma] [Rifiuta] (token firmato HMAC, valido 7gg)
- Admin conferma/rifiuta (da email o dashboard) → email ospite con esito
- Config: `MAIL_ENABLED=true` + credenziali SMTP nel `.env` (consigliato: Brevo)
- Con `MAIL_ENABLED=false` (default): log su console, nessuna email

## Avvio locale
```bash
cp .env.example .env   # imposta SECRET_KEY e ADMIN_PASSWORD
docker compose up -d --build
# oppure: python app.py
```

## TODO / sviluppi futuri noti
- [ ] Sostituire image-slot con img statici (foto reali da caricare in project/assets/)
- [ ] Upload immagini dall'admin (POST /gestione/upload)
- [x] Email automatica al proprietario su nuova prenotazione (con link conferma/rifiuta)
- [x] Email di conferma/rifiuto all'ospite
- [ ] Attivare Stripe (STRIPE_ENABLED=true nel .env)
- [ ] Attivare email (MAIL_ENABLED=true + credenziali Brevo nel .env)
