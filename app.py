"""
Complesso San Michele — Offida
Flask backend: prenotazioni Dimora + admin + Stripe

Avvio rapido:
    pip install -r requirements.txt
    cp .env.example .env
    # Genera hash password:
    # python -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('tuapassword'))"
    # Incolla il risultato in ADMIN_PASSWORD_HASH nel .env
    python app.py
    # Pannello admin: http://localhost:5000/gestione
"""

import base64
import hashlib
import hmac
import os
import secrets
import smtplib
import time
from datetime import date, datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from functools import wraps

import stripe
from dotenv import load_dotenv
from flask import (
    Flask,
    abort,
    flash,
    jsonify,
    redirect,
    render_template,
    request,
    send_from_directory,
    session,
    url_for,
)
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_login import (
    LoginManager,
    UserMixin,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

load_dotenv()

# ─── Configurazione ────────────────────────────────────────────────────────────

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_DIR = os.path.join(BASE_DIR, "project")

app = Flask(__name__, template_folder="templates")
app.config.update(
    SECRET_KEY=os.getenv("SECRET_KEY", secrets.token_hex(32)),
    SQLALCHEMY_DATABASE_URI=os.getenv(
        "DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'csm.db')}"
    ),
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    # Cookie sicuri (attivi in produzione con HTTPS)
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.getenv("FLASK_ENV") == "production",
)

CORS(app, resources={r"/api/*": {"origins": "*"}})
db = SQLAlchemy(app)

# ─── Flask-Login ───────────────────────────────────────────────────────────────

login_manager = LoginManager(app)
login_manager.login_view = "admin_login"
login_manager.login_message = "Accesso richiesto."

# Admin unico: credenziali da .env (nessuna tabella DB necessaria)
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")

_hash_from_env = os.getenv("ADMIN_PASSWORD_HASH", "")
_pass_from_env = os.getenv("ADMIN_PASSWORD", "")
if _hash_from_env:
    ADMIN_PASSWORD_HASH = _hash_from_env
elif _pass_from_env:
    # Fallback per sviluppo: genera hash al volo (non usare in produzione)
    ADMIN_PASSWORD_HASH = generate_password_hash(_pass_from_env)
else:
    # Nessuna password configurata: login disabilitato
    ADMIN_PASSWORD_HASH = generate_password_hash(secrets.token_hex(32))


class AdminUser(UserMixin):
    """Utente admin singleton (non persiste su DB)."""
    id = "admin"


@login_manager.user_loader
def load_user(user_id):
    if user_id == "admin":
        return AdminUser()
    return None


# ─── Rate limiting ─────────────────────────────────────────────────────────────

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[],          # nessun limite globale di default
    storage_uri="memory://",
)

# ─── Stripe ────────────────────────────────────────────────────────────────────

STRIPE_ENABLED = os.getenv("STRIPE_ENABLED", "false").lower() == "true"
SITE_URL = os.getenv("SITE_URL", "http://localhost:5000")

if STRIPE_ENABLED:
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")

STRIPE_PRICE_DOUBLE = int(os.getenv("STRIPE_PRICE_DOUBLE_CENTS", "8000"))
STRIPE_PRICE_SINGLE = int(os.getenv("STRIPE_PRICE_SINGLE_CENTS", "6000"))

# ─── Email ─────────────────────────────────────────────────────────────────────

MAIL_ENABLED   = os.getenv("MAIL_ENABLED", "false").lower() == "true"
MAIL_FROM      = os.getenv("MAIL_FROM", "noreply@complessosanmichele-offida.it")
MAIL_SMTP_HOST = os.getenv("MAIL_SMTP_HOST", "smtp.brevo.com")
MAIL_SMTP_PORT = int(os.getenv("MAIL_SMTP_PORT", "587"))
MAIL_USERNAME  = os.getenv("MAIL_USERNAME", "")
MAIL_PASSWORD  = os.getenv("MAIL_PASSWORD", "")
ADMIN_EMAIL    = os.getenv("ADMIN_EMAIL", "info@complessosanmichele-offida.it")

ACTION_TOKEN_TTL = 7 * 24 * 3600  # link validi 7 giorni

# ─── Modelli ───────────────────────────────────────────────────────────────────


class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(50))
    room = db.Column(db.String(20), nullable=False)       # 'double' | 'single'
    check_in = db.Column(db.Date, nullable=False)
    check_out = db.Column(db.Date, nullable=False)
    guests = db.Column(db.Integer, default=1)
    notes = db.Column(db.Text)
    # pending | confirmed | rejected | cancelled
    status = db.Column(db.String(20), default="pending", nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Stripe (usati solo quando STRIPE_ENABLED=true)
    payment_status = db.Column(db.String(20))             # None | 'pending' | 'paid' | 'failed'
    stripe_session_id = db.Column(db.String(200))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "room": self.room,
            "check_in": self.check_in.isoformat(),
            "check_out": self.check_out.isoformat(),
            "guests": self.guests,
            "notes": self.notes,
            "status": self.status,
            "payment_status": self.payment_status,
            "created_at": self.created_at.isoformat(),
        }

    @property
    def nights(self):
        return (self.check_out - self.check_in).days

    @property
    def room_label(self):
        return "Matrimoniale" if self.room == "double" else "Singola"

    @property
    def status_label(self):
        return {
            "pending": "In attesa",
            "confirmed": "Confermata",
            "rejected": "Rifiutata",
            "cancelled": "Annullata",
        }.get(self.status, self.status)

    @property
    def payment_label(self):
        return {
            "pending": "In attesa pagamento",
            "paid": "Pagato",
            "failed": "Fallito",
        }.get(self.payment_status or "", "—")


class RoomRate(db.Model):
    """
    Tariffa per camera in un periodo.
    Più tariffe possono sovrapporsi; vince quella con date_from più recente.
    Se nessuna tariffa copre una notte, si usa il fallback da .env.
    """
    __tablename__ = "room_rates"

    id = db.Column(db.Integer, primary_key=True)
    room = db.Column(db.String(20), nullable=False)   # 'double' | 'single' | 'both'
    date_from = db.Column(db.Date, nullable=False)
    date_to = db.Column(db.Date, nullable=False)       # escluso (come check_out)
    price_cents = db.Column(db.Integer, nullable=False)  # prezzo per notte in centesimi
    label = db.Column(db.String(100))                  # es. "Estate 2025", "Natale"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @property
    def room_label(self):
        return {"double": "Matrimoniale", "single": "Singola", "both": "Entrambe"}.get(
            self.room, self.room
        )

    @property
    def price_eur(self):
        return f"€{self.price_cents / 100:.2f}"


# ─── Helper: statistiche e prezzi ─────────────────────────────────────────────


def get_stats():
    return {
        "total": Booking.query.count(),
        "pending": Booking.query.filter_by(status="pending").count(),
        "confirmed": Booking.query.filter_by(status="confirmed").count(),
        "rejected": Booking.query.filter_by(status="rejected").count(),
    }


def calculate_booking_price(booking):
    """
    Calcola il totale in centesimi per una prenotazione.
    Per ogni notte cerca la tariffa più specifica (date_from più recente).
    Fallback: STRIPE_PRICE_DOUBLE / STRIPE_PRICE_SINGLE da .env.
    """
    default = STRIPE_PRICE_DOUBLE if booking.room == "double" else STRIPE_PRICE_SINGLE
    total = 0
    cur = booking.check_in
    while cur < booking.check_out:
        rate = (
            RoomRate.query.filter(
                RoomRate.room.in_([booking.room, "both"]),
                RoomRate.date_from <= cur,
                RoomRate.date_to > cur,
            )
            .order_by(RoomRate.date_from.desc())
            .first()
        )
        total += rate.price_cents if rate else default
        cur += timedelta(days=1)
    return total


# ─── Action token (conferma/rifiuta da email) ─────────────────────────────────


def _token_sign(payload: str) -> str:
    return hmac.new(
        app.config["SECRET_KEY"].encode(), payload.encode(), hashlib.sha256
    ).hexdigest()


def make_action_token(booking_id: int, action: str) -> str:
    """Crea un token firmato HMAC valido ACTION_TOKEN_TTL secondi."""
    ts = str(int(time.time()))
    payload = f"{booking_id}:{action}:{ts}"
    token = f"{payload}:{_token_sign(payload)[:24]}"
    return base64.urlsafe_b64encode(token.encode()).decode().rstrip("=")


def verify_action_token(token: str):
    """
    Verifica il token e restituisce (booking_id, action).
    Solleva ValueError se invalido o scaduto.
    """
    try:
        padded = token + "=" * (-len(token) % 4)
        raw = base64.urlsafe_b64decode(padded.encode()).decode()
        bid_s, action, ts_s, sig = raw.split(":", 3)
        booking_id, ts = int(bid_s), int(ts_s)
    except Exception:
        raise ValueError("Link non valido.")
    payload = f"{booking_id}:{action}:{ts_s}"
    if not hmac.compare_digest(_token_sign(payload)[:24], sig):
        raise ValueError("Link non valido.")
    if time.time() - ts > ACTION_TOKEN_TTL:
        raise ValueError("Link scaduto (valido 7 giorni).")
    if action not in ("confirm", "reject"):
        raise ValueError("Azione non valida.")
    return booking_id, action


# ─── Email helpers ─────────────────────────────────────────────────────────────


def send_email(to: str, subject: str, html: str) -> None:
    if not MAIL_ENABLED:
        app.logger.info(f"[MAIL disabled] → {to} | {subject}")
        return
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = MAIL_FROM
        msg["To"]      = to
        msg.attach(MIMEText(html, "html", "utf-8"))
        with smtplib.SMTP(MAIL_SMTP_HOST, MAIL_SMTP_PORT, timeout=10) as srv:
            srv.ehlo()
            srv.starttls()
            srv.login(MAIL_USERNAME, MAIL_PASSWORD)
            srv.sendmail(MAIL_FROM, [to], msg.as_string())
    except Exception as exc:
        app.logger.error(f"Email send failed → {to}: {exc}")


def _email_wrap(title: str, body: str) -> str:
    return f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px;background:#f5efe2;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;">
  <div style="background:#2b2620;padding:20px 28px;">
    <span style="font-family:Georgia,serif;font-size:20px;color:#faf6ec;">
      ✦ Complesso San Michele — Offida
    </span>
  </div>
  <div style="background:#faf6ec;border:1px solid rgba(43,38,32,.12);
              border-top:none;padding:32px 28px;">
    <h2 style="font-family:Georgia,serif;font-size:26px;color:#2b2620;margin:0 0 20px;">
      {title}
    </h2>
    {body}
  </div>
  <div style="padding:14px 0;font-size:11px;color:#6b6253;text-align:center;">
    Complesso San Michele — Via San Michele, 63073 Offida (AP) —
    <a href="mailto:{ADMIN_EMAIL}" style="color:#b8923d;">{ADMIN_EMAIL}</a>
  </div>
</div></body></html>"""


def _booking_rows(b) -> str:
    rows = [
        ("Ospite",    f"{b.name} &lt;{b.email}&gt;"),
        ("Camera",    b.room_label),
        ("Check-in",  b.check_in.strftime("%d/%m/%Y")),
        ("Check-out", b.check_out.strftime("%d/%m/%Y")),
        ("Notti",     str(b.nights)),
        ("Ospiti",    str(b.guests)),
    ]
    if b.phone:
        rows.insert(1, ("Telefono", b.phone))
    if b.notes:
        rows.append(("Note", b.notes))
    cells = "".join(
        f'<tr>'
        f'<td style="padding:8px 12px;color:#6b6253;font-size:13px;'
        f'background:#ebe3d0;border-bottom:1px solid rgba(43,38,32,.08);">{k}</td>'
        f'<td style="padding:8px 12px;color:#2b2620;font-size:13px;font-weight:600;'
        f'border-bottom:1px solid rgba(43,38,32,.08);">{v}</td>'
        f'</tr>'
        for k, v in rows
    )
    return f'<table style="width:100%;border-collapse:collapse;margin:0 0 24px;">{cells}</table>'


def _btn(url: str, label: str, bg: str, color: str) -> str:
    return (
        f'<a href="{url}" style="display:inline-block;padding:14px 28px;'
        f'background:{bg};color:{color};font-size:13px;font-weight:600;'
        f'letter-spacing:.08em;text-transform:uppercase;text-decoration:none;'
        f'margin-right:12px;">{label}</a>'
    )


def notify_admin_new_booking(booking) -> None:
    """Email all'admin con pulsanti conferma/rifiuta firmati."""
    confirm_url = f"{SITE_URL}/gestione/action?token={make_action_token(booking.id, 'confirm')}"
    reject_url  = f"{SITE_URL}/gestione/action?token={make_action_token(booking.id, 'reject')}"

    body = (
        f"{_booking_rows(booking)}"
        f'<p style="margin:0 0 20px;font-size:14px;color:#4a4135;">'
        f'Rispondi direttamente da questa email oppure usa i pulsanti:</p>'
        f'{_btn(confirm_url, "✅ Conferma", "#27623e", "#ffffff")}'
        f'{_btn(reject_url,  "❌ Rifiuta",  "#c0392b", "#ffffff")}'
        f'<p style="margin:20px 0 0;font-size:11px;color:#6b6253;">'
        f'Link valido 7 giorni. Puoi anche gestire la prenotazione dal '
        f'<a href="{SITE_URL}/gestione" style="color:#b8923d;">pannello admin</a>.</p>'
    )
    send_email(
        ADMIN_EMAIL,
        f"[CSM] Nuova richiesta — {booking.name} · {booking.check_in.strftime('%d/%m')}–{booking.check_out.strftime('%d/%m')}",
        _email_wrap("Nuova richiesta di prenotazione", body),
    )


def notify_guest_status_change(booking) -> None:
    """Email all'ospite quando la prenotazione viene confermata o rifiutata."""
    if booking.status == "confirmed":
        title = "Prenotazione confermata"
        intro = (
            f'<p style="font-size:16px;color:#2b2620;margin:0 0 20px;">'
            f'Gentile <strong>{booking.name}</strong>, '
            f'la tua prenotazione è <strong style="color:#27623e;">confermata</strong>. '
            f'Ti aspettiamo!</p>'
        )
        closing = (
            f'<p style="font-size:14px;color:#4a4135;margin:20px 0 0;">'
            f'Per qualsiasi necessità scrivi a '
            f'<a href="mailto:{ADMIN_EMAIL}" style="color:#b8923d;">{ADMIN_EMAIL}</a>.</p>'
        )
    elif booking.status == "rejected":
        title = "Aggiornamento sulla tua richiesta"
        intro = (
            f'<p style="font-size:16px;color:#2b2620;margin:0 0 20px;">'
            f'Gentile <strong>{booking.name}</strong>, ci dispiace: '
            f'le date richieste non sono al momento disponibili.</p>'
        )
        closing = (
            f'<p style="font-size:14px;color:#4a4135;margin:20px 0 0;">'
            f'Scrivici a <a href="mailto:{ADMIN_EMAIL}" style="color:#b8923d;">{ADMIN_EMAIL}</a> '
            f'per verificare date alternative — saremo felici di aiutarti.</p>'
        )
    else:
        return  # non inviare email per altri stati

    body = intro + _booking_rows(booking) + closing
    send_email(
        booking.email,
        f"{'Prenotazione confermata' if booking.status == 'confirmed' else 'Aggiornamento prenotazione'} — Complesso San Michele",
        _email_wrap(title, body),
    )


# ─── Serve frontend statico ────────────────────────────────────────────────────


@app.route("/")
def index():
    return send_from_directory(PROJECT_DIR, "Complesso San Michele.html")


@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(PROJECT_DIR, filename)


# ─── API pubblica: date non disponibili ───────────────────────────────────────


@app.route("/api/unavailable")
def unavailable_dates():
    """
    Restituisce le date occupate per una camera in un intervallo.

    Query params:
        room   — 'double' | 'single' | (assente = entrambe)
        from   — YYYY-MM-DD  (default: oggi)
        to     — YYYY-MM-DD  (default: +12 mesi)
    """
    room = request.args.get("room")
    from_str = request.args.get("from")
    to_str = request.args.get("to")

    try:
        from_date = date.fromisoformat(from_str) if from_str else date.today()
        to_date = (
            date.fromisoformat(to_str)
            if to_str
            else date.today() + timedelta(days=365)
        )
    except ValueError:
        return jsonify({"error": "Formato data non valido. Usa YYYY-MM-DD."}), 400

    query = Booking.query.filter(
        Booking.status.in_(["pending", "confirmed"]),
        Booking.check_out > from_date,
        Booking.check_in < to_date,
    )
    if room in ("double", "single"):
        query = query.filter(Booking.room == room)

    booked = set()
    for b in query.all():
        cur = b.check_in
        while cur < b.check_out:
            if from_date <= cur <= to_date:
                booked.add(cur.isoformat())
            cur = cur + timedelta(days=1)

    return jsonify(sorted(booked))


# ─── API pubblica: crea prenotazione ──────────────────────────────────────────


@app.route("/api/bookings", methods=["POST"])
@limiter.limit("10 per minute")
def create_booking():
    """Crea una nuova richiesta di prenotazione (status: pending)."""
    data = request.get_json(silent=True) or {}

    required = ("name", "email", "room", "check_in", "check_out")
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Campi obbligatori: {', '.join(missing)}"}), 400

    try:
        check_in = date.fromisoformat(data["check_in"])
        check_out = date.fromisoformat(data["check_out"])
    except ValueError:
        return jsonify({"error": "Formato data non valido. Usa YYYY-MM-DD."}), 400

    if check_out <= check_in:
        return jsonify({"error": "Il check-out deve essere successivo al check-in."}), 400

    if data["room"] not in ("double", "single"):
        return jsonify({"error": "room deve essere 'double' o 'single'."}), 400

    # Verifica disponibilità
    conflict = Booking.query.filter(
        Booking.room == data["room"],
        Booking.status.in_(["pending", "confirmed"]),
        Booking.check_in < check_out,
        Booking.check_out > check_in,
    ).first()
    if conflict:
        return jsonify({"error": "Le date selezionate non sono disponibili."}), 409

    booking = Booking(
        name=data["name"].strip(),
        email=data["email"].strip().lower(),
        phone=(data.get("phone") or "").strip() or None,
        room=data["room"],
        check_in=check_in,
        check_out=check_out,
        guests=max(1, int(data.get("guests", 1))),
        notes=(data.get("notes") or "").strip() or None,
        payment_status="pending" if STRIPE_ENABLED else None,
    )
    db.session.add(booking)
    db.session.commit()

    notify_admin_new_booking(booking)   # email admin con link conferma/rifiuta

    response = booking.to_dict()
    response["stripe_enabled"] = STRIPE_ENABLED
    return jsonify(response), 201


# ─── API Stripe: crea sessione di pagamento ───────────────────────────────────


@app.route("/api/bookings/<int:booking_id>/checkout", methods=["POST"])
def create_checkout_session(booking_id):
    """
    Crea una Stripe Checkout Session per la prenotazione indicata.
    Attivo solo se STRIPE_ENABLED=true.
    """
    if not STRIPE_ENABLED:
        return jsonify({"error": "I pagamenti online non sono attivi."}), 503

    booking = Booking.query.get_or_404(booking_id)
    if booking.payment_status == "paid":
        return jsonify({"error": "Questa prenotazione è già stata pagata."}), 400

    total_cents = calculate_booking_price(booking)

    try:
        checkout = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[
                {
                    "price_data": {
                        "currency": "eur",
                        "unit_amount": total_cents,   # totale già calcolato (tariffe dinamiche)
                        "product_data": {
                            "name": f"Complesso San Michele — {booking.room_label}",
                            "description": (
                                f"{booking.check_in.strftime('%d/%m/%Y')} → "
                                f"{booking.check_out.strftime('%d/%m/%Y')} "
                                f"({booking.nights} notti)"
                            ),
                        },
                    },
                    "quantity": 1,
                }
            ],
            customer_email=booking.email,
            metadata={"booking_id": str(booking.id)},
            success_url=f"{SITE_URL}/#dimora?payment=success",
            cancel_url=f"{SITE_URL}/#dimora?payment=cancelled",
        )
    except stripe.error.StripeError as e:
        return jsonify({"error": str(e)}), 502

    booking.stripe_session_id = checkout.id
    db.session.commit()

    return jsonify({"checkout_url": checkout.url})


# ─── Webhook Stripe ───────────────────────────────────────────────────────────


@app.route("/api/webhooks/stripe", methods=["POST"])
def stripe_webhook():
    """
    Riceve eventi da Stripe. Configura l'endpoint su dashboard.stripe.com
    e imposta STRIPE_WEBHOOK_SECRET nel .env.
    """
    payload = request.get_data()
    sig_header = request.headers.get("Stripe-Signature", "")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except (ValueError, stripe.error.SignatureVerificationError):
        return jsonify({"error": "Invalid signature"}), 400

    if event["type"] == "checkout.session.completed":
        session_obj = event["data"]["object"]
        booking_id = int(session_obj.get("metadata", {}).get("booking_id", 0))
        booking = Booking.query.get(booking_id)
        if booking:
            booking.payment_status = "paid"
            booking.status = "confirmed"
            db.session.commit()

    return jsonify({"received": True})


# ─── Azione da email (token firmato, no login) ───────────────────────────────


@app.route("/gestione/action")
def booking_action():
    """
    Conferma o rifiuta una prenotazione tramite link firmato ricevuto via email.
    Non richiede login: il token HMAC è l'autenticazione.
    """
    token = request.args.get("token", "")
    try:
        booking_id, action = verify_action_token(token)
    except ValueError as exc:
        return render_template("action_result.html", success=False, message=str(exc))

    booking = Booking.query.get_or_404(booking_id)

    # Idempotente: se già gestita mostra solo lo stato attuale
    if booking.status in ("confirmed", "rejected", "cancelled"):
        return render_template(
            "action_result.html",
            success=True,
            already_done=True,
            booking=booking,
            action=action,
        )

    booking.status = "confirmed" if action == "confirm" else "rejected"
    db.session.commit()
    notify_guest_status_change(booking)  # email di conferma/rifiuto all'ospite

    return render_template(
        "action_result.html",
        success=True,
        already_done=False,
        booking=booking,
        action=action,
    )


# ─── Admin: login / logout ────────────────────────────────────────────────────


@app.route("/gestione/login", methods=["GET", "POST"])
@limiter.limit("5 per minute", methods=["POST"])   # brute-force protection
def admin_login():
    if current_user.is_authenticated:
        return redirect(url_for("admin_dashboard"))

    error = None
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        if (
            username == ADMIN_USERNAME
            and check_password_hash(ADMIN_PASSWORD_HASH, password)
        ):
            login_user(AdminUser(), remember=False)
            next_page = request.args.get("next") or url_for("admin_dashboard")
            # Impedisce open redirect verso URL esterni
            if not next_page.startswith("/"):
                next_page = url_for("admin_dashboard")
            return redirect(next_page)
        error = "Credenziali non valide."

    return render_template("login.html", error=error)


@app.route("/gestione/logout")
@login_required
def admin_logout():
    logout_user()
    return redirect(url_for("admin_login"))


# ─── Admin: dashboard prenotazioni ────────────────────────────────────────────


@app.route("/gestione")
@login_required
def admin_dashboard():
    status_filter = request.args.get("status", "")
    query = Booking.query.order_by(Booking.created_at.desc())
    if status_filter:
        query = query.filter_by(status=status_filter)
    return render_template(
        "admin.html",
        bookings=query.all(),
        stats=get_stats(),
        status_filter=status_filter,
        stripe_enabled=STRIPE_ENABLED,
    )


@app.route("/gestione/bookings/<int:booking_id>/status", methods=["POST"])
@login_required
def update_booking_status(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    new_status = request.form.get("status")
    if new_status not in ("pending", "confirmed", "rejected", "cancelled"):
        abort(400)
    booking.status = new_status
    db.session.commit()
    notify_guest_status_change(booking)  # email ospite se confirmed/rejected
    return redirect(url_for("admin_dashboard", status=request.args.get("status", "")))


# ─── Admin: tariffe ───────────────────────────────────────────────────────────


@app.route("/gestione/rates")
@login_required
def admin_rates():
    rates = RoomRate.query.order_by(RoomRate.date_from.asc()).all()
    return render_template(
        "admin.html",
        bookings=[],
        stats=get_stats(),
        rates=rates,
        status_filter="",
        stripe_enabled=STRIPE_ENABLED,
        default_double=STRIPE_PRICE_DOUBLE,
        default_single=STRIPE_PRICE_SINGLE,
    )


@app.route("/gestione/rates/add", methods=["POST"])
@login_required
def admin_add_rate():
    try:
        room = request.form.get("room")
        if room not in ("double", "single", "both"):
            abort(400)
        date_from = date.fromisoformat(request.form.get("date_from", ""))
        date_to = date.fromisoformat(request.form.get("date_to", ""))
        if date_to <= date_from:
            abort(400)
        price_cents = round(float(request.form.get("price_eur", "0").replace(",", ".")) * 100)
        label = (request.form.get("label") or "").strip() or None
    except (ValueError, TypeError):
        abort(400)

    db.session.add(
        RoomRate(room=room, date_from=date_from, date_to=date_to,
                 price_cents=price_cents, label=label)
    )
    db.session.commit()
    return redirect(url_for("admin_rates"))


@app.route("/gestione/rates/<int:rate_id>/delete", methods=["POST"])
@login_required
def admin_delete_rate(rate_id):
    rate = RoomRate.query.get_or_404(rate_id)
    db.session.delete(rate)
    db.session.commit()
    return redirect(url_for("admin_rates"))


# ─── API pubblica: prezzo stimato ─────────────────────────────────────────────


@app.route("/api/price")
def get_price():
    """
    Restituisce il prezzo totale stimato per una camera e un periodo.
    Usato dal frontend per mostrare il totale prima di inviare la richiesta.

    Query params: room, check_in (YYYY-MM-DD), check_out (YYYY-MM-DD)
    """
    room = request.args.get("room")
    if room not in ("double", "single"):
        return jsonify({"error": "room non valida"}), 400
    try:
        check_in = date.fromisoformat(request.args.get("check_in", ""))
        check_out = date.fromisoformat(request.args.get("check_out", ""))
    except ValueError:
        return jsonify({"error": "Date non valide"}), 400
    if check_out <= check_in:
        return jsonify({"error": "check_out deve essere dopo check_in"}), 400

    # Oggetto temporaneo per riutilizzare calculate_booking_price
    class _FakeBooking:
        pass
    b = _FakeBooking()
    b.room, b.check_in, b.check_out = room, check_in, check_out
    b.nights = (check_out - check_in).days

    total_cents = calculate_booking_price(b)
    return jsonify({
        "total_cents": total_cents,
        "total_eur": f"€{total_cents / 100:.2f}",
        "nights": b.nights,
    })


# ─── Init DB ──────────────────────────────────────────────────────────────────

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
