// Dimora San Michele — Landing page dedicata B&B
// Condivide le API Flask con il sito principale

const { useState, useEffect, useMemo } = React;

// ============== I18N ==============
const T = {
  it: {
    brand: "Dimora San Michele",
    book_cta: "Prenota",
    eyebrow: "Offida — Marche",
    hero_title: "Dimora\nSan Michele",
    hero_sub: "Due camere nel cuore di un borgo antico. Colazione inclusa, bagno privato, ritmo lento.",
    cta_rooms: "Scopri le camere",
    cta_book: "Prenota ora",
    gallery_kicker: "Gli spazi",
    gallery_sub: "Luce, silenzio e materiali che raccontano il tempo.",
    rooms_kicker: "Le camere",
    room1_name: "Camera Matrimoniale",
    room1_desc: "Letto matrimoniale con vista sul borgo, travi a vista, bagno privato con doccia. Atmosfera raccolta, luce naturale del pomeriggio.",
    room2_name: "Camera Singola",
    room2_desc: "Letto singolo, bagno privato, finestra sul cortile interno. Ideale per chi cerca il ritmo lento di un borgo antico.",
    feat_2guests: "2 ospiti",
    feat_1guest: "1 ospite",
    feat_bath: "Bagno privato",
    feat_wifi: "Wi-Fi",
    feat_breakfast: "Colazione inclusa",
    feat_beams: "Travi a vista",
    feat_view: "Vista borgo",
    feat_courtyard: "Vista cortile",
    price_note: "Tariffe su richiesta — risposta entro 24h",
    book_room: "Prenota questa camera",
    book_kicker: "Verifica disponibilità",
    book_sub: "Seleziona le date e invia la richiesta. Confermiamo entro 24 ore.",
    checkin: "Check-in",
    checkout: "Check-out",
    night: "notte",
    nights: "notti",
    room: "Camera",
    room_double: "Matrimoniale",
    room_single: "Singola",
    guests: "Ospiti",
    name_label: "Nome e cognome",
    email_label: "Email",
    notes_label: "Note (opzionale)",
    select_dates: "Seleziona le date di soggiorno",
    request_book: "Invia richiesta",
    legend_avail: "Disponibile",
    legend_busy: "Occupato",
    legend_sel: "Selezionato",
    sent_title: "Richiesta inviata",
    sent_desc: "Grazie! Ti risponderemo via email entro 24 ore con conferma e tariffe.",
    new_request: "Nuova richiesta",
    info_kicker: "Informazioni pratiche",
    ci_label: "Check-in", ci_val: "15:00 – 19:00",
    co_label: "Check-out", co_val: "entro le 11:00",
    lang_label: "Lingue", lang_val: "Italiano, Inglese",
    pets_label: "Animali", pets_val: "Non ammessi",
    park_label: "Parcheggio", park_val: "Pubblico a 200 m",
    cancel_label: "Cancellazione", cancel_val: "Gratuita fino a 48h prima",
    addr: "Via San Michele — 63073 Offida (AP), Marche, Italia",
    email: "info@complessosanmichele-offida.it",
    phone: "+39 3292182011",
    footer_copy: "Dimora San Michele — Offida (AP). Parte del Complesso San Michele.",
    visit_full: "Scopri il Complesso San Michele",
    months: ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],
    days: ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"],
    drop: "Trascina foto qui"
  },
  en: {
    brand: "Dimora San Michele",
    book_cta: "Book",
    eyebrow: "Offida — Marche, Italy",
    hero_title: "Dimora\nSan Michele",
    hero_sub: "Two rooms in the heart of an ancient village. Breakfast included, private bathroom, slow pace.",
    cta_rooms: "Explore rooms",
    cta_book: "Book now",
    gallery_kicker: "The spaces",
    gallery_sub: "Light, silence and materials that tell the passage of time.",
    rooms_kicker: "The rooms",
    room1_name: "Double Room",
    room1_desc: "Double bed with village view, exposed beams, private shower room. Warm atmosphere, soft afternoon light.",
    room2_name: "Single Room",
    room2_desc: "Single bed, private bathroom, window onto the inner courtyard. For solo travellers seeking a quiet pause.",
    feat_2guests: "2 guests",
    feat_1guest: "1 guest",
    feat_bath: "Private bath",
    feat_wifi: "Wi-Fi",
    feat_breakfast: "Breakfast included",
    feat_beams: "Exposed beams",
    feat_view: "Village view",
    feat_courtyard: "Courtyard view",
    price_note: "Rates on request — reply within 24h",
    book_room: "Book this room",
    book_kicker: "Check availability",
    book_sub: "Select your dates and send a request. We confirm within 24 hours.",
    checkin: "Check-in",
    checkout: "Check-out",
    night: "night",
    nights: "nights",
    room: "Room",
    room_double: "Double",
    room_single: "Single",
    guests: "Guests",
    name_label: "Full name",
    email_label: "Email",
    notes_label: "Notes (optional)",
    select_dates: "Select your stay dates",
    request_book: "Send request",
    legend_avail: "Available",
    legend_busy: "Booked",
    legend_sel: "Selected",
    sent_title: "Request sent",
    sent_desc: "Thank you! We'll reply by email within 24 hours with confirmation and rates.",
    new_request: "New request",
    info_kicker: "Practical information",
    ci_label: "Check-in", ci_val: "3:00 pm – 7:00 pm",
    co_label: "Check-out", co_val: "by 11:00 am",
    lang_label: "Languages", lang_val: "Italian, English",
    pets_label: "Pets", pets_val: "Not allowed",
    park_label: "Parking", park_val: "Public parking 200 m",
    cancel_label: "Cancellation", cancel_val: "Free up to 48h before",
    addr: "Via San Michele — 63073 Offida (AP), Marche, Italy",
    email: "info@complessosanmichele-offida.it",
    phone: "+39 3292182011",
    footer_copy: "Dimora San Michele — Offida (AP), Italy. Part of Complesso San Michele.",
    visit_full: "Discover Complesso San Michele",
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    drop: "Drop photo here"
  }
};

// ============== Shared: ImageSlot ==============
function ImageSlot({ id, label, aspect = "4/3", style = {}, className = "" }) {
  return (
    <div className={`img-slot-wrap ${className}`} style={{ aspectRatio: aspect, ...style }}>
      <image-slot
        id={`slot-${id}`}
        placeholder={label}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}

// ============== Shared: SlotsProvider ==============
const SlotsCtx = React.createContext({});

function SlotsProvider({ children }) {
  const [slots, setSlots] = useState({});
  useEffect(() => {
    let alive = true;
    function tick() {
      fetch(".image-slots.state.json", { cache: "no-store" })
        .then(r => r.ok ? r.json() : null)
        .then(j => { if (alive && j) setSlots(j.slots || j); })
        .catch(() => {});
    }
    tick();
    const iv = setInterval(tick, 3000);
    return () => { alive = false; clearInterval(iv); };
  }, []);
  return <SlotsCtx.Provider value={slots}>{children}</SlotsCtx.Provider>;
}

function useUrlForSlot(id) {
  const all = React.useContext(SlotsCtx);
  const v = all[`slot-${id}`] || all[id];
  return !v ? null : typeof v === "string" ? v : v.u;
}

// ============== RoomCarousel ==============
function RoomCarousel({ images }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const iv = setInterval(() => setIdx(i => (i + 1) % images.length), 4000);
    return () => clearInterval(iv);
  }, [paused, images.length]);

  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <div
      className="d-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className={`d-carousel-img${i === idx ? " active" : ""}`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
      <button className="d-car-btn d-car-prev" onClick={prev} aria-label="precedente">‹</button>
      <button className="d-car-btn d-car-next" onClick={next} aria-label="successiva">›</button>
      <div className="d-carousel-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`d-dot${i === idx ? " active" : ""}`}
            onClick={() => setIdx(i)}
            aria-label={`foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ============== Shared: fmtDate ==============
function fmtDate(d, lang) {
  const m = T[lang].months[d.getMonth()];
  return `${d.getDate()} ${m.substring(0, 3).toLowerCase()} ${d.getFullYear()}`;
}

// ============== DHeader ==============
function DHeader({ lang, setLang, scrollToBooking }) {
  const t = T[lang];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <header className={`d-header ${scrolled ? "d-header--scrolled" : ""}`}>
      <div className="d-header-inner">
        <div className="d-brand">
          <span style={{ color: "var(--ocra)", fontSize: 16 }}>✦</span>
          <span>{t.brand}</span>
        </div>
        <div className="d-header-right">
          <div className="lang-switch">
            <button className={lang === "it" ? "on" : ""} onClick={() => setLang("it")}>IT</button>
            <span>/</span>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <button className="d-book-btn" onClick={scrollToBooking}>{t.book_cta}</button>
        </div>
      </div>
    </header>
  );
}

// ============== DHero ==============
function DHero({ lang, scrollToRooms, scrollToBooking }) {
  const t = T[lang];
  const url = useUrlForSlot("dimora-hero");
  return (
    <section className="d-hero">
      <div className="d-hero-bg">
        {url
          ? <img src={url} alt="Dimora San Michele" />
          : <ImageSlot id="dimora-hero" label={`${t.drop} — hero`} aspect="auto" style={{ height: "100%" }} />
        }
      </div>
      <div className="d-hero-veil" />
      <div className="d-hero-content">
        <div className="d-hero-eyebrow">
          <span className="d-line" />
          <span>{t.eyebrow}</span>
        </div>
        <h1 className="d-hero-title">{t.hero_title}</h1>
        <p className="d-hero-sub">{t.hero_sub}</p>
        <div className="d-hero-actions">
          <button className="d-btn-outline" onClick={scrollToRooms}>{t.cta_rooms}</button>
          <button className="d-btn-primary" onClick={scrollToBooking}>{t.cta_book}</button>
        </div>
      </div>
      <div className="d-hero-scroll">↓</div>
    </section>
  );
}

// ============== DRooms ==============
// Immagini placeholder (picsum.photos, seed fisso = stesso risultato ogni volta)
const ROOM_IMAGES = {
  double: [
    "https://picsum.photos/seed/offida-d1/900/600",
    "https://picsum.photos/seed/offida-d2/900/600",
    "https://picsum.photos/seed/offida-d3/900/600",
    "https://picsum.photos/seed/offida-d4/900/600",
  ],
  single: [
    "https://picsum.photos/seed/offida-s1/900/600",
    "https://picsum.photos/seed/offida-s2/900/600",
    "https://picsum.photos/seed/offida-s3/900/600",
    "https://picsum.photos/seed/offida-s4/900/600",
  ],
};

function DRooms({ lang, scrollToBooking, setPreselected }) {
  const t = T[lang];
  const rooms = [
    {
      id: "double",
      name: t.room1_name,
      desc: t.room1_desc,
      feats: [t.feat_2guests, t.feat_bath, t.feat_wifi, t.feat_breakfast, t.feat_beams, t.feat_view],
      num: "01",
    },
    {
      id: "single",
      name: t.room2_name,
      desc: t.room2_desc,
      feats: [t.feat_1guest, t.feat_bath, t.feat_wifi, t.feat_breakfast, t.feat_courtyard],
      num: "02",
    },
  ];
  return (
    <section className="d-rooms" id="rooms">
      <div className="d-section-inner">
        <div className="d-section-head">
          <span className="kicker">{t.rooms_kicker}</span>
        </div>
        {rooms.map((room, ri) => (
          <div key={room.id} className={`d-room${ri % 2 === 1 ? " d-room--reverse" : ""}`}>
            <div className="d-room-media">
              <RoomCarousel images={ROOM_IMAGES[room.id]} />
            </div>
            <div className="d-room-body">
              <div className="d-room-num">{room.num}</div>
              <h2 className="d-room-title">{room.name}</h2>
              <p className="d-room-desc">{room.desc}</p>
              <div className="d-room-divider" />
              <ul className="d-room-feats">
                {room.feats.map(f => <li key={f}>{f}</li>)}
              </ul>
              <p className="d-room-price-note">{t.price_note}</p>
              <button
                className="d-btn-primary"
                onClick={() => { setPreselected(room.id); scrollToBooking(); }}
              >
                {t.book_room} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============== DBooking ==============
function DBooking({ lang, preselected }) {
  const t = T[lang];
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [checkIn, setCheckIn]     = useState(null);
  const [checkOut, setCheckOut]   = useState(null);
  const [room, setRoom]           = useState(preselected || "double");
  const [guests, setGuests]       = useState(2);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [notes, setNotes]         = useState("");
  const [sent, setSent]           = useState(false);
  const [busy, setBusy]           = useState(new Set());

  useEffect(() => { setRoom(preselected || "double"); }, [preselected]);

  useEffect(() => {
    const from = ymd(today);
    const to   = new Date(today.getFullYear(), today.getMonth() + 12, 1);
    fetch(`/api/unavailable?room=${room}&from=${from}&to=${ymd(to)}`)
      .then(r => r.ok ? r.json() : [])
      .then(dates => setBusy(new Set(dates)))
      .catch(() => {});
  }, [room]); // eslint-disable-line react-hooks/exhaustive-deps

  function ymd(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  function isPast(d) {
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
  function inRange(d) {
    return checkIn && checkOut && d > checkIn && d < checkOut;
  }
  function sameDay(a, b) { return a && b && a.getTime() === b.getTime(); }

  function clickDay(d) {
    if (isPast(d) || busy.has(ymd(d))) return;
    if (!checkIn || (checkIn && checkOut)) { setCheckIn(d); setCheckOut(null); return; }
    if (d <= checkIn) { setCheckIn(d); return; }
    const cur = new Date(checkIn); cur.setDate(cur.getDate() + 1);
    while (cur < d) {
      if (busy.has(ymd(cur))) { setCheckIn(d); setCheckOut(null); return; }
      cur.setDate(cur.getDate() + 1);
    }
    setCheckOut(d);
  }

  function nights() {
    return checkIn && checkOut ? Math.round((checkOut - checkIn) / 86400000) : 0;
  }

  function buildDays(monthDate) {
    const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const startDay = (first.getDay() + 6) % 7;
    const dim = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= dim; d++) cells.push(new Date(first.getFullYear(), first.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  function reset() {
    setCheckIn(null); setCheckOut(null);
    setName(""); setEmail(""); setNotes("");
    setSent(false);
  }

  function submit(e) {
    e.preventDefault();
    if (!checkIn || !checkOut || !name || !email) return;
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, room, guests, notes, check_in: ymd(checkIn), check_out: ymd(checkOut) }),
    })
      .then(r => { if (r.ok) setSent(true); else r.json().then(d => alert(d.error || "Errore")); })
      .catch(() => setSent(true));
  }

  const months = [viewMonth, new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)];

  return (
    <section className="d-booking" id="booking">
      <div className="d-section-inner">
        <div className="d-section-head" style={{ marginBottom: 40 }}>
          <span className="kicker" style={{ color: "var(--ocra-2)" }}>{t.book_kicker}</span>
          <p style={{ color: "rgba(250,246,236,.72)", marginTop: 8 }}>{t.book_sub}</p>
        </div>

        {sent ? (
          <div className="booking-confirm">
            <div className="confirm-mark">✓</div>
            <h4>{t.sent_title}</h4>
            <p>{t.sent_desc}</p>
            <div className="confirm-detail">
              <div><span>{t.checkin}</span><strong>{checkIn && fmtDate(checkIn, lang)}</strong></div>
              <div><span>{t.checkout}</span><strong>{checkOut && fmtDate(checkOut, lang)}</strong></div>
              <div><span>{t.room}</span><strong>{room === "double" ? t.room_double : t.room_single}</strong></div>
            </div>
            <button className="btn-ghost" onClick={reset}>{t.new_request}</button>
          </div>
        ) : (
          <div className="booking-grid">
            <div className="cal-wrap">
              <div className="cal-nav">
                <button onClick={() => { const nd = new Date(viewMonth); nd.setMonth(nd.getMonth()-1); setViewMonth(nd); }} aria-label="mese precedente">‹</button>
                <button onClick={() => { const nd = new Date(viewMonth); nd.setMonth(nd.getMonth()+1); setViewMonth(nd); }} aria-label="mese successivo">›</button>
              </div>
              <div className="cal-months">
                {months.map((m, mi) => (
                  <div className="cal-month" key={mi}>
                    <div className="cal-title">{t.months[m.getMonth()]} {m.getFullYear()}</div>
                    <div className="cal-grid">
                      {t.days.map(d => <div key={d} className="cal-dow">{d}</div>)}
                      {buildDays(m).map((d, di) => {
                        if (!d) return <div key={di} className="cal-day empty" />;
                        const k = ymd(d);
                        const past = isPast(d), isBusy = busy.has(k);
                        const isIn = sameDay(d, checkIn), isOut = sameDay(d, checkOut);
                        let cls = "cal-day";
                        if (past) cls += " past";
                        else if (isBusy) cls += " busy";
                        else cls += " avail";
                        if (isIn) cls += " sel-in";
                        if (isOut) cls += " sel-out";
                        if (inRange(d)) cls += " sel-mid";
                        return (
                          <button key={di} className={cls} onClick={() => clickDay(d)} disabled={past || isBusy}>
                            {d.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="cal-legend">
                <span><i className="lg avail" />{t.legend_avail}</span>
                <span><i className="lg busy" />{t.legend_busy}</span>
                <span><i className="lg sel" />{t.legend_sel}</span>
              </div>
            </div>

            <form className="booking-form" onSubmit={submit}>
              <div className="form-summary">
                {checkIn && checkOut ? (
                  <React.Fragment>
                    <div className="sum-row">
                      <div><span>{t.checkin}</span><strong>{fmtDate(checkIn, lang)}</strong></div>
                      <div><span>{t.checkout}</span><strong>{fmtDate(checkOut, lang)}</strong></div>
                    </div>
                    <div className="sum-nights">{nights()} {nights() === 1 ? t.night : t.nights}</div>
                  </React.Fragment>
                ) : (
                  <div className="sum-empty">{t.select_dates}</div>
                )}
              </div>
              <label>
                <span>{t.room}</span>
                <select value={room} onChange={e => setRoom(e.target.value)}>
                  <option value="double">{t.room_double}</option>
                  <option value="single">{t.room_single}</option>
                </select>
              </label>
              <label>
                <span>{t.guests}</span>
                <select value={guests} onChange={e => setGuests(+e.target.value)}>
                  {[1,2].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <label>
                <span>{t.name_label}</span>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
              </label>
              <label>
                <span>{t.email_label}</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </label>
              <label>
                <span>{t.notes_label}</span>
                <textarea rows="3" value={notes} onChange={e => setNotes(e.target.value)} />
              </label>
              <button type="submit" className="btn-primary" disabled={!checkIn || !checkOut}>
                {t.request_book}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

// ============== DInfo ==============
function DInfo({ lang }) {
  const t = T[lang];
  const rows = [
    { label: t.ci_label,     val: t.ci_val,     icon: "→" },
    { label: t.co_label,     val: t.co_val,     icon: "←" },
    { label: t.lang_label,   val: t.lang_val,   icon: "◈" },
    { label: t.pets_label,   val: t.pets_val,   icon: "○" },
    { label: t.park_label,   val: t.park_val,   icon: "◎" },
    { label: t.cancel_label, val: t.cancel_val, icon: "◇" },
  ];
  return (
    <section className="d-info" id="info">
      <div className="d-section-inner">
        <div className="d-section-head">
          <span className="kicker">{t.info_kicker}</span>
        </div>
        <div className="d-info-grid">
          {rows.map(r => (
            <div key={r.label} className="d-info-card">
              <div className="d-info-icon">{r.icon}</div>
              <div>
                <span className="d-info-label">{r.label}</span>
                <div className="d-info-val">{r.val}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="d-contact-row">
          <div className="d-contact-item">
            <span className="d-info-label">Indirizzo</span>
            <span className="d-info-val">{t.addr}</span>
          </div>
          <div className="d-contact-item">
            <span className="d-info-label">Email</span>
            <a href={`mailto:${t.email}`} className="d-info-val">{t.email}</a>
          </div>
          <div className="d-contact-item">
            <span className="d-info-label">Tel</span>
            <a href={`tel:${t.phone.replace(/\s/g,"")}`} className="d-info-val">{t.phone}</a>
          </div>
        </div>
        <a
          className="map-placeholder"
          href="https://maps.app.goo.gl/vLARUgdp2fcCyFEn8"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Apri in Google Maps"
        >
          <iframe
            title="Mappa Dimora San Michele"
            src="https://www.google.com/maps?q=Via+San+Michele+Offida+AP&hl=it&z=16&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="map-overlay">
            <span>Via San Michele — Offida (AP)</span>
            <span className="map-cta">{lang === "it" ? "Apri in Maps ↗" : "Open in Maps ↗"}</span>
          </div>
        </a>
      </div>
    </section>
  );
}

// ============== DFooter ==============
function DFooter({ lang }) {
  const t = T[lang];
  return (
    <footer className="d-footer">
      <div className="d-footer-inner">
        <div className="d-footer-brand">
          <span style={{ color: "var(--ocra)" }}>✦</span>
          <span>Dimora San Michele</span>
        </div>
        <p className="d-footer-copy">{t.footer_copy}</p>
        <a href="Complesso San Michele.html" className="d-footer-link">{t.visit_full} →</a>
      </div>
      <div className="d-footer-bar">
        <span>Complesso San Michele — Offida (AP)</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

// ============== App ==============
function App() {
  const [lang, setLang]           = useState(localStorage.getItem("csm-lang") || "it");
  const [preselected, setPreselected] = useState("double");

  useEffect(() => { localStorage.setItem("csm-lang", lang); }, [lang]);

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <SlotsProvider>
      <DHeader lang={lang} setLang={setLang} scrollToBooking={() => scrollTo("booking")} />
      <DHero
        lang={lang}
        scrollToRooms={() => scrollTo("rooms")}
        scrollToBooking={() => scrollTo("booking")}
      />
      <DRooms
        lang={lang}
        scrollToBooking={() => scrollTo("booking")}
        setPreselected={setPreselected}
      />
      <DBooking lang={lang} preselected={preselected} />
      <DInfo lang={lang} />
      <DFooter lang={lang} />
    </SlotsProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
