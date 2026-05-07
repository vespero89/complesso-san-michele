// Complesso San Michele - Offida
// SPA: Landing + Chiesa + Laboratorio + Dimora

const { useState, useEffect, useRef, useMemo } = React;

// ============== I18N ==============
const T = {
  it: {
    nav_home: "Home",
    nav_chiesa: "Chiesa",
    nav_laboratorio: "Laboratorio",
    nav_dimora: "Dimora",
    nav_missione: "Missione",
    nav_contatti: "Contatti",
    section_welcome: "Benvenuti",
    hero_title: "Complesso San Michele",
    hero_place: "Offida — Marche",
    hero_sub: "Un luogo, tre vocazioni. Spiritualità, mestiere e ospitalità intrecciati nel cuore di un borgo delle Marche.",
    enter: "Entra",
    door_chiesa_kicker: "Spazio polifunzionale",
    door_chiesa_title: "Chiesa di San Michele",
    door_chiesa_desc: "Mostre, concerti, incontri. Un luogo storico aperto alla creatività contemporanea.",
    door_lab_kicker: "Studio di arte e lavoro",
    door_lab_title: "Laboratorio",
    door_lab_desc: "Spazio di artigianato, ricerca e formazione. Dove le mani imparano a pensare.",
    door_dimora_kicker: "Affittacamere",
    door_dimora_title: "Dimora",
    door_dimora_desc: "Due camere, una pausa lenta. Soggiornare nel borgo, dentro al progetto.",
    discover: "Scopri",
    chiesa_kicker: "01 — Centro polifunzionale",
    chiesa_title: "Chiesa di San Michele",
    chiesa_lead: "Antica chiesa restaurata, oggi spazio aperto a mostre, residenze artistiche, concerti, conferenze e attività multidisciplinari. Curata in collaborazione con la Fondazione Lavoro per la Persona.",
    chiesa_gallery_title: "Eventi e mostre",
    chiesa_gallery_sub: "Una selezione delle attività ospitate negli ultimi anni.",
    chiesa_partner_title: "In collaborazione con",
    chiesa_partner_desc: "Le attività culturali del Complesso sono curate insieme a Lavoro per la Persona, fondazione che coltiva l'umano nell'economia e nel lavoro.",
    visit_site: "Visita lavoroperlapersona.it",
    lab_kicker: "02 — Studio di arte e lavoro",
    lab_title: "Laboratorio",
    lab_lead: "Un luogo dove l'artigianato incontra la ricerca. Workshop, residenze, produzione: il Laboratorio è uno studio aperto in cui il lavoro manuale diventa pratica di pensiero.",
    lab_gallery_title: "Dal laboratorio",
    lab_gallery_sub: "Materiali, processi, opere in lavorazione.",
    dimora_kicker: "03 — Affittacamere",
    dimora_title: "Dimora",
    dimora_lead: "Due camere essenziali e curate, ricavate negli spazi del Complesso. Una scelta per chi cerca un soggiorno lento, immerso nel borgo e nel progetto culturale.",
    dimora_rooms_title: "Le camere",
    room_double: "Camera matrimoniale",
    room_double_desc: "Letto matrimoniale, bagno privato, vista sul borgo. Travi a vista e arredi essenziali.",
    room_single: "Camera singola",
    room_single_desc: "Letto singolo, bagno privato. Atmosfera raccolta, luce naturale del mattino.",
    dimora_book_title: "Verifica disponibilità",
    dimora_book_sub: "Seleziona le date e invia una richiesta. Confermeremo entro 24 ore.",
    legend_avail: "Disponibile",
    legend_busy: "Occupato",
    legend_selected: "Selezionato",
    checkin: "Check-in",
    checkout: "Check-out",
    nights: "notti",
    night: "notte",
    guests: "Ospiti",
    room: "Camera",
    request_book: "Invia richiesta",
    name_label: "Nome e cognome",
    email_label: "Email",
    notes_label: "Note (opzionale)",
    select_dates: "Seleziona check-in e check-out",
    booking_sent_title: "Richiesta inviata",
    booking_sent_desc: "Grazie. Ti risponderemo via email entro 24 ore con la conferma.",
    new_request: "Nuova richiesta",
    missione_kicker: "La nostra missione",
    missione_title: "Coltivare l'umano",
    missione_text: "Il Complesso San Michele nasce da un'idea di rigenerazione: trasformare uno spazio antico in un luogo vivo, dove cultura, artigianato e ospitalità si incontrano. La Chiesa di San Michele è il cuore polifunzionale del progetto: ospita mostre, concerti, residenze artistiche e momenti di confronto curati con la Fondazione Lavoro per la Persona. Il Laboratorio è uno studio di arte e lavoro, in cui il fare manuale diventa ricerca, pensiero e formazione. La Dimora accoglie viaggiatori che desiderano abitare il borgo con lentezza, partecipando alla vita del progetto. Crediamo che restituire valore ai luoghi significhi soprattutto restituire tempo e attenzione alle persone: alle relazioni, alle storie, ai mestieri che ogni borgo custodisce. Per questo il Complesso non è un contenitore di funzioni, ma un sistema vivo in cui ogni elemento sostiene gli altri. Offida — paese di merletto, vino e tradizioni — è il contesto naturale di questa ricerca: un luogo piccolo che continua a porre grandi domande sul senso del lavoro, dell'arte e della cura. Vi aspettiamo, per visitare, lavorare, riposare, immaginare insieme.",
    newsletter_title: "Iscriviti alla newsletter",
    newsletter_sub: "Resta aggiornato su mostre, residenze e iniziative del Complesso e di Lavoro per la Persona.",
    newsletter_placeholder: "la-tua-email@esempio.it",
    subscribe: "Iscriviti",
    contact_title: "Vieni a trovarci",
    address_label: "Indirizzo",
    email_lbl: "Email",
    phone_label: "Telefono",
    follow: "Seguici",
    footer_credits: "Complesso San Michele — Offida (AP). Un progetto in collaborazione con Lavoro per la Persona.",
    months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
    days: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
    drop_image: "Trascina foto qui"
  },
  en: {
    nav_home: "Home",
    nav_chiesa: "Church",
    nav_laboratorio: "Workshop",
    nav_dimora: "Stay",
    nav_missione: "Mission",
    nav_contatti: "Contact",
    section_welcome: "Welcome",
    hero_title: "Complesso San Michele",
    hero_place: "Offida — Marche, Italy",
    hero_sub: "One place, three callings. Spirituality, craft and hospitality interwoven in the heart of an Italian medieval village.",
    enter: "Enter",
    door_chiesa_kicker: "Cultural venue",
    door_chiesa_title: "San Michele Church",
    door_chiesa_desc: "Exhibitions, concerts, conversations. A historic site open to contemporary creativity.",
    door_lab_kicker: "Art and work studio",
    door_lab_title: "Workshop",
    door_lab_desc: "A space of craft, research and learning. Where hands learn to think.",
    door_dimora_kicker: "Guesthouse",
    door_dimora_title: "Stay",
    door_dimora_desc: "Two rooms, a slow pause. Live in the village, inside the project.",
    discover: "Discover",
    chiesa_kicker: "01 — Cultural venue",
    chiesa_title: "San Michele Church",
    chiesa_lead: "A restored ancient church, today an open space for exhibitions, residencies, concerts, talks and multidisciplinary activities. Curated in partnership with Fondazione Lavoro per la Persona.",
    chiesa_gallery_title: "Events & exhibitions",
    chiesa_gallery_sub: "A selection of recent activities held inside the church.",
    chiesa_partner_title: "In partnership with",
    chiesa_partner_desc: "The cultural programme of the Complesso is curated together with Lavoro per la Persona, a foundation that cultivates the human dimension of economy and labour.",
    visit_site: "Visit lavoroperlapersona.it",
    lab_kicker: "02 — Art and work studio",
    lab_title: "Workshop",
    lab_lead: "A place where craft meets research. Workshops, residencies, production: an open studio where manual work becomes a way of thinking.",
    lab_gallery_title: "From the workshop",
    lab_gallery_sub: "Materials, processes, works in progress.",
    dimora_kicker: "03 — Guesthouse",
    dimora_title: "Stay",
    dimora_lead: "Two essential, carefully designed rooms within the Complesso. For travellers seeking a slow stay, immersed in the village and in the project.",
    dimora_rooms_title: "The rooms",
    room_double: "Double room",
    room_double_desc: "Double bed, private bathroom, view over the village. Exposed beams and essential furnishings.",
    room_single: "Single room",
    room_single_desc: "Single bed, private bathroom. Quiet atmosphere, soft morning light.",
    dimora_book_title: "Check availability",
    dimora_book_sub: "Pick your dates and send a request. We will confirm within 24 hours.",
    legend_avail: "Available",
    legend_busy: "Booked",
    legend_selected: "Selected",
    checkin: "Check-in",
    checkout: "Check-out",
    nights: "nights",
    night: "night",
    guests: "Guests",
    room: "Room",
    request_book: "Send request",
    name_label: "Full name",
    email_label: "Email",
    notes_label: "Notes (optional)",
    select_dates: "Select check-in and check-out",
    booking_sent_title: "Request sent",
    booking_sent_desc: "Thank you. We will reply by email within 24 hours with confirmation.",
    new_request: "New request",
    missione_kicker: "Our mission",
    missione_title: "Cultivating the human",
    missione_text: "Complesso San Michele was born from an idea of regeneration: turning an ancient site into a living place where culture, craft and hospitality meet. The Church of San Michele is the multifunctional heart of the project: it hosts exhibitions, concerts, artistic residencies and gatherings curated with Fondazione Lavoro per la Persona. The Workshop is a studio of art and work, where the act of making becomes research, thought and learning. The Stay welcomes travellers who wish to inhabit the village slowly, taking part in the life of the project. We believe that giving value back to places means giving time and attention back to people — to relationships, to stories, to the crafts every village preserves. The Complesso is not a container of services but a living system in which each element supports the others. Offida — town of lace, wine and quiet traditions — is the natural context for this research: a small place that keeps asking large questions about the meaning of work, art and care. We look forward to welcoming you, to visit, work, rest and imagine together.",
    newsletter_title: "Subscribe to the newsletter",
    newsletter_sub: "Stay updated on exhibitions, residencies and events at the Complesso and Lavoro per la Persona.",
    newsletter_placeholder: "your-email@example.com",
    subscribe: "Subscribe",
    contact_title: "Come visit",
    address_label: "Address",
    email_lbl: "Email",
    phone_label: "Phone",
    follow: "Follow",
    footer_credits: "Complesso San Michele — Offida (AP), Italy. A project in collaboration with Lavoro per la Persona.",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    drop_image: "Drop photo here"
  }
};

// ============== ImageSlot wrapper ==============
function ImageSlot({ id, label, aspect = "4/3", style = {}, shape = "rect", className = "" }) {
  // Render the <image-slot> custom element. The component handles its own state.
  return (
    <div className={`img-slot-wrap ${className}`} style={{ aspectRatio: aspect, ...style }}>
      <image-slot
        id={`slot-${id}`}
        shape={shape}
        placeholder={label}
        style={{ width: "100%", height: "100%", display: "block" }}>
      </image-slot>
    </div>);

}

// ============== Header ==============
function Header({ lang, setLang, current, navigate, menuOpen, setMenuOpen }) {
  const t = T[lang];
  const items = [
  ["home", t.nav_home],
  ["chiesa", t.nav_chiesa],
  ["laboratorio", t.nav_laboratorio],
  ["dimora", t.nav_dimora],
  ["missione", t.nav_missione],
  ["contatti", t.nav_contatti]];

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" onClick={() => navigate("home")}>
          <span className="brand-mark">✦</span>
          <span className="brand-text">Complesso San Michele</span>
        </a>
        <nav className="nav-desktop">
          {items.map(([k, l]) =>
          <a key={k} onClick={() => navigate(k)} className={current === k ? "active" : ""}>
              {l}
            </a>
          )}
        </nav>
        <div className="header-right">
          <div className="lang-switch">
            <button className={lang === "it" ? "on" : ""} onClick={() => setLang("it")}>IT</button>
            <span>/</span>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      {menuOpen &&
      <div className="nav-mobile">
          {items.map(([k, l]) =>
        <a key={k} onClick={() => {navigate(k);setMenuOpen(false);}}>{l}</a>
        )}
        </div>
      }
    </header>);

}

// ============== Hook: read images from image-slots sidecar ==============
const SlotsCtx = React.createContext({});

function useSlotImages(prefix) {
  const all = React.useContext(SlotsCtx);
  return useMemo(() => {
    const out = [];
    Object.keys(all).forEach((k) => {
      if (!k.startsWith(prefix)) return;
      const v = all[k];
      const u = typeof v === "string" ? v : v && v.u;
      if (u) out.push({ id: k, url: u });
    });
    return out;
  }, [all, prefix]);
}

function useUrlForSlot(slotId) {
  const all = React.useContext(SlotsCtx);
  const v = all[`slot-${slotId}`] || all[slotId];
  if (!v) return null;
  return typeof v === "string" ? v : v && v.u;
}

function SlotsProvider({ children }) {
  const [slots, setSlots] = useState({});
  useEffect(() => {
    let alive = true;
    function tick() {
      fetch(".image-slots.state.json", { cache: "no-store" }).
      then((r) => r.ok ? r.json() : null).
      then((j) => {
        if (!alive || !j) return;
        setSlots(j.slots || j);
      }).
      catch(() => {});
    }
    tick();
    const iv = setInterval(tick, 3000);
    return () => {alive = false;clearInterval(iv);};
  }, []);
  return <SlotsCtx.Provider value={slots}>{children}</SlotsCtx.Provider>;
}

// ============== Lightbox ==============
const LightboxCtx = React.createContext(() => {});

function LightboxProvider({ children }) {
  const [state, setState] = useState(null); // { items: [{url,caption}], idx }
  const open = (items, idx = 0) => setState({ items, idx });
  const close = () => setState(null);
  function nav(delta) {
    setState((s) => s ? { ...s, idx: (s.idx + delta + s.items.length) % s.items.length } : s);
  }
  useEffect(() => {
    if (!state) return;
    function onKey(e) {
      if (e.key === "Escape") close();else
      if (e.key === "ArrowRight") nav(1);else
      if (e.key === "ArrowLeft") nav(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state]);
  return (
    <LightboxCtx.Provider value={open}>
      {children}
      {state &&
      <div className="lightbox" onClick={close}>
          <button className="lb-close" onClick={close} aria-label="close">×</button>
          {state.items.length > 1 &&
        <button className="lb-nav prev" onClick={(e) => {e.stopPropagation();nav(-1);}} aria-label="prev">‹</button>
        }
          <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
            <img src={state.items[state.idx].url} alt="" />
            {state.items[state.idx].caption &&
          <div className="lb-caption">{state.items[state.idx].caption}</div>
          }
          </div>
          {state.items.length > 1 &&
        <button className="lb-nav next" onClick={(e) => {e.stopPropagation();nav(1);}} aria-label="next">›</button>
        }
          {state.items.length > 1 &&
        <div className="lb-counter">{state.idx + 1} / {state.items.length}</div>
        }
        </div>
      }
    </LightboxCtx.Provider>);

}

function useLightbox() {
  return React.useContext(LightboxCtx);
}

// ============== Clickable gallery image (slot + lightbox trigger) ==============
function GallerySlot({ slotId, label, aspect, items, index, className = "" }) {
  // items: array of { slotId, caption } for the lightbox group
  // index: position of this slot inside that group
  const slots = React.useContext(SlotsCtx);
  const open = useLightbox();
  const url = (() => {
    const v = slots[`slot-${slotId}`];
    if (!v) return null;
    return typeof v === "string" ? v : v.u;
  })();
  function handleClick(e) {
    if (!url) return; // empty slot: let drag/drop work
    e.preventDefault();
    e.stopPropagation();
    const filled = items.
    map((it) => {
      const v = slots[`slot-${it.slotId}`];
      const u = !v ? null : typeof v === "string" ? v : v.u;
      return u ? { url: u, caption: it.caption, slotId: it.slotId } : null;
    }).
    filter(Boolean);
    if (!filled.length) return;
    const startIdx = Math.max(0, filled.findIndex((f) => f.slotId === slotId));
    open(filled, startIdx);
  }
  return (
    <div className={`gallery-slot ${url ? "filled" : ""} ${className}`} onClick={handleClick}>
      <ImageSlot id={slotId} label={label} aspect={aspect} />
      {url && <div className="zoom-hint" aria-hidden="true">⤢</div>}
    </div>);

}

// ============== Rotating door image ==============
function DoorImage({ slotPrefix, fallbackId, fallbackLabel }) {
  const imgs = useSlotImages(slotPrefix);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (imgs.length < 2) return;
    const iv = setInterval(() => setIdx((i) => (i + 1) % imgs.length), 4500);
    return () => clearInterval(iv);
  }, [imgs.length]);
  if (imgs.length === 0) {
    return <ImageSlot id={fallbackId} label={fallbackLabel} aspect="auto" style={{ height: "100%" }} />;
  }
  return (
    <div className="door-rotator">
      {imgs.map((it, i) =>
      <div
        key={it.id}
        className="door-frame"
        style={{
          backgroundImage: `url("${it.url}")`,
          opacity: i === idx ? 1 : 0
        }} />

      )}
    </div>);

}

// ============== Landing / Home ==============
function Home({ lang, navigate }) {
  const t = T[lang];
  return (
    <div className="page page-home">
      <section className="hero">
        <div className="hero-merlettaie" aria-hidden="true"></div>
        <div className="hero-veil"></div>
        <div className="hero-content" style={{ opacity: "1" }}>
          <div className="hero-eyebrow">
            <span className="line"></span>
            <span>{t.hero_place}</span>
            <span className="line"></span>
          </div>
          <h1 className="hero-title">{t.hero_title}</h1>
          <p className="hero-sub">{t.hero_sub}</p>
          <div className="hero-scroll">
            <span>{t.section_welcome}</span>
            <span className="arrow">↓</span>
          </div>
        </div>
      </section>

      {/* Three doors */}
      <section className="doors">
        {[
        { key: "chiesa", prefix: "slot-chiesa-ev-", k: t.door_chiesa_kicker, ti: t.door_chiesa_title, d: t.door_chiesa_desc, num: "I" },
        { key: "laboratorio", prefix: "slot-lab-", k: t.door_lab_kicker, ti: t.door_lab_title, d: t.door_lab_desc, num: "II" },
        { key: "dimora", prefix: "slot-room-", k: t.door_dimora_kicker, ti: t.door_dimora_title, d: t.door_dimora_desc, num: "III" }].
        map((d) =>
        <a key={d.key} className="door" onClick={() => navigate(d.key)}>
            <div className="door-img">
              <DoorImage slotPrefix={d.prefix} fallbackId={`door-${d.key}`} fallbackLabel={`${t.drop_image} — ${d.ti}`} />
              <div className="door-veil"></div>
            </div>
            <div className="door-content">
              <div className="door-num">{d.num}</div>
              <div className="door-kicker">{d.k}</div>
              <h2 className="door-title">{d.ti}</h2>
              <p className="door-desc">{d.d}</p>
              <div className="door-cta">
                <span>{t.discover}</span>
                <span className="arrow">→</span>
              </div>
            </div>
          </a>
        )}
      </section>

      <Missione lang={lang} />
      <Newsletter lang={lang} />
      <Contatti lang={lang} />
    </div>);

}

// ============== Chiesa ==============
function Chiesa({ lang }) {
  const t = T[lang];
  const events = [
  { y: "2025", titIt: "Residenza: Mani che pensano", titEn: "Residency: Thinking hands" },
  { y: "2024", titIt: "Mostra: Geografie del lavoro", titEn: "Exhibition: Geographies of work" },
  { y: "2024", titIt: "Concerto: Polifonie d'autunno", titEn: "Concert: Autumn polyphonies" },
  { y: "2023", titIt: "Convegno: Coltivare l'umano", titEn: "Symposium: Cultivating the human" },
  { y: "2023", titIt: "Mostra fotografica: Borgo", titEn: "Photo exhibition: Village" },
  { y: "2022", titIt: "Letture: La cura dei luoghi", titEn: "Readings: The care of places" }];

  return (
    <div className="page page-section">
      <SectionHero
        kicker={t.chiesa_kicker}
        title={t.chiesa_title}
        lead={t.chiesa_lead}
        slotId="chiesa-hero"
        slotLabel={`${t.drop_image} — Chiesa interno`} />
      

      <section className="gallery-section">
        <div className="section-head">
          <h3>{t.chiesa_gallery_title}</h3>
          <p>{t.chiesa_gallery_sub}</p>
        </div>
        <div className="gallery-grid">
          {events.map((e, i) => {
            const caption = `${e.y} — ${lang === "it" ? e.titIt : e.titEn}`;
            const items = events.map((ev, j) => ({
              slotId: `chiesa-ev-${j}`,
              caption: `${ev.y} — ${lang === "it" ? ev.titIt : ev.titEn}`
            }));
            return (
              <figure key={i} className="event-card">
                <GallerySlot
                  slotId={`chiesa-ev-${i}`}
                  label={`${t.drop_image} — evento`}
                  aspect="4/5"
                  items={items}
                  index={i} />
                
                <figcaption>
                  <span className="ev-year">{e.y}</span>
                  <span className="ev-title">{lang === "it" ? e.titIt : e.titEn}</span>
                </figcaption>
              </figure>);

          })}
        </div>
      </section>

      <section className="partner">
        <div className="partner-inner">
          <div className="partner-text">
            <div className="kicker">{t.chiesa_partner_title}</div>
            <h3>Lavoro per la Persona</h3>
            <p>{t.chiesa_partner_desc}</p>
            <a href="https://www.lavoroperlapersona.it/" target="_blank" rel="noopener noreferrer" className="link-arrow">
              {t.visit_site} <span>↗</span>
            </a>
          </div>
          <div className="partner-mark">
            <a href="https://www.lavoroperlapersona.it/" target="_blank" rel="noopener noreferrer" className="lpp-logo">
              <img src="assets/lpp-logo.jpg" alt="Lavoro per la Persona" />
            </a>
          </div>
        </div>
      </section>
    </div>);

}

// ============== Laboratorio ==============
function Laboratorio({ lang }) {
  const t = T[lang];
  const items = [
  { it: "Cere e pigmenti", en: "Waxes & pigments" },
  { it: "Legno e intaglio", en: "Wood & carving" },
  { it: "Carta fatta a mano", en: "Handmade paper" },
  { it: "Ceramica", en: "Ceramics" },
  { it: "Tessitura", en: "Weaving" },
  { it: "Stampa tipografica", en: "Letterpress" },
  { it: "Restauro", en: "Restoration" },
  { it: "Disegno e bottega", en: "Drawing studio" }];

  return (
    <div className="page page-section">
      <SectionHero
        kicker={t.lab_kicker}
        title={t.lab_title}
        lead={t.lab_lead}
        slotId="lab-hero"
        slotLabel={`${t.drop_image} — Laboratorio`} />
      

      <section className="gallery-section">
        <div className="section-head">
          <h3>{t.lab_gallery_title}</h3>
          <p>{t.lab_gallery_sub}</p>
        </div>
        <div className="lab-grid">
          {items.map((it, i) => {
            const groupItems = items.map((g, j) => ({
              slotId: `lab-${j}`,
              caption: lang === "it" ? g.it : g.en
            }));
            return (
              <figure key={i} className={`lab-card lab-card-${i % 4}`}>
                <GallerySlot
                  slotId={`lab-${i}`}
                  label={`${t.drop_image} — ${it.it}`}
                  aspect="1/1"
                  items={groupItems}
                  index={i} />
                
                <figcaption>{lang === "it" ? it.it : it.en}</figcaption>
              </figure>);

          })}
        </div>
      </section>
    </div>);

}

// ============== Dimora ==============
function Dimora({ lang }) {
  const t = T[lang];
  return (
    <div className="page page-section">
      <SectionHero
        kicker={t.dimora_kicker}
        title={t.dimora_title}
        lead={t.dimora_lead}
        slotId="dimora-hero"
        slotLabel={`${t.drop_image} — Dimora`} />
      

      <section className="rooms">
        <div className="section-head">
          <h3>{t.dimora_rooms_title}</h3>
        </div>
        <div className="rooms-grid">
          <article className="room-card">
            <GallerySlot
              slotId="room-double"
              label={`${t.drop_image} — Matrimoniale`}
              aspect="3/2"
              items={[
              { slotId: "room-double", caption: t.room_double },
              { slotId: "room-single", caption: t.room_single }]
              }
              index={0} />
            
            <div className="room-body">
              <div className="room-num">01</div>
              <h4>{t.room_double}</h4>
              <p>{t.room_double_desc}</p>
              <ul className="room-feats">
                <li>2 {lang === "it" ? "ospiti" : "guests"}</li>
                <li>{lang === "it" ? "Bagno privato" : "Private bath"}</li>
                <li>{lang === "it" ? "Wi-Fi" : "Wi-Fi"}</li>
                <li>{lang === "it" ? "Colazione" : "Breakfast"}</li>
              </ul>
            </div>
          </article>
          <article className="room-card">
            <GallerySlot
              slotId="room-single"
              label={`${t.drop_image} — Singola`}
              aspect="3/2"
              items={[
              { slotId: "room-double", caption: t.room_double },
              { slotId: "room-single", caption: t.room_single }]
              }
              index={1} />
            
            <div className="room-body">
              <div className="room-num">02</div>
              <h4>{t.room_single}</h4>
              <p>{t.room_single_desc}</p>
              <ul className="room-feats">
                <li>1 {lang === "it" ? "ospite" : "guest"}</li>
                <li>{lang === "it" ? "Bagno privato" : "Private bath"}</li>
                <li>{lang === "it" ? "Wi-Fi" : "Wi-Fi"}</li>
                <li>{lang === "it" ? "Colazione" : "Breakfast"}</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <BookingSection lang={lang} />
    </div>);

}

// ============== Section Hero ==============
function SectionHero({ kicker, title, lead, slotId, slotLabel }) {
  return (
    <section className="section-hero">
      <div className="section-hero-text">
        <div className="kicker">{kicker}</div>
        <h2>{title}</h2>
        <p className="lead">{lead}</p>
      </div>
      <div className="section-hero-img">
        <ImageSlot id={slotId} label={slotLabel} aspect="4/5" />
      </div>
    </section>);

}

// ============== Booking Calendar ==============
function BookingSection({ lang }) {
  const t = T[lang];
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [room, setRoom] = useState("double");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  // Date occupate: caricate dall'API, con fallback a set vuoto
  const [busy, setBusy] = useState(new Set());

  useEffect(() => {
    const from = ymd(today);
    const to = new Date(today.getFullYear(), today.getMonth() + 12, 1);
    const toStr = ymd(to);
    fetch(`/api/unavailable?room=${room}&from=${from}&to=${toStr}`)
      .then((r) => r.ok ? r.json() : [])
      .then((dates) => setBusy(new Set(dates)))
      .catch(() => {}); // Se il backend non è disponibile, nessuna data bloccata
  }, [room]); // eslint-disable-line react-hooks/exhaustive-deps

  function ymd(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  function isPast(d) {
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t0;
  }
  function inRange(d) {
    if (!checkIn || !checkOut) return false;
    return d > checkIn && d < checkOut;
  }
  function sameDay(a, b) {
    return a && b && a.getTime() === b.getTime();
  }

  function clickDay(d) {
    if (isPast(d) || busy.has(ymd(d))) return;
    if (!checkIn || checkIn && checkOut) {
      setCheckIn(d);
      setCheckOut(null);
      return;
    }
    if (d <= checkIn) {
      setCheckIn(d);
      return;
    }
    // Check no busy day between
    const cur = new Date(checkIn);
    cur.setDate(cur.getDate() + 1);
    while (cur < d) {
      if (busy.has(ymd(cur))) {
        setCheckIn(d);
        setCheckOut(null);
        return;
      }
      cur.setDate(cur.getDate() + 1);
    }
    setCheckOut(d);
  }

  function nights() {
    if (!checkIn || !checkOut) return 0;
    return Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  }

  function shiftMonth(delta) {
    const nd = new Date(viewMonth);
    nd.setMonth(nd.getMonth() + delta);
    setViewMonth(nd);
  }

  function buildDays(monthDate) {
    const first = new Date(monthDate);
    first.setDate(1);
    const startDay = (first.getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(first.getFullYear(), first.getMonth(), d));
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  function submit(e) {
    e.preventDefault();
    if (!checkIn || !checkOut || !name || !email) return;

    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        room,
        guests,
        notes,
        check_in: ymd(checkIn),
        check_out: ymd(checkOut),
      }),
    })
      .then((r) => {
        if (r.ok) {
          setSent(true);
        } else {
          return r.json().then((d) => {
            alert(d.error || "Errore durante l'invio. Riprova.");
          });
        }
      })
      .catch(() => {
        // Backend non raggiungibile: mostra conferma comunque (UX graceful)
        setSent(true);
      });
  }

  function reset() {
    setCheckIn(null);setCheckOut(null);
    setName("");setEmail("");setNotes("");
    setSent(false);
  }

  const months = [viewMonth, new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)];

  return (
    <section className="booking">
      <div className="section-head">
        <h3>{t.dimora_book_title}</h3>
        <p>{t.dimora_book_sub}</p>
      </div>

      {sent ?
      <div className="booking-confirm">
          <div className="confirm-mark">✓</div>
          <h4>{t.booking_sent_title}</h4>
          <p>{t.booking_sent_desc}</p>
          <div className="confirm-detail">
            <div><span>{t.checkin}</span><strong>{checkIn && fmtDate(checkIn, lang)}</strong></div>
            <div><span>{t.checkout}</span><strong>{checkOut && fmtDate(checkOut, lang)}</strong></div>
            <div><span>{t.room}</span><strong>{room === "double" ? t.room_double : t.room_single}</strong></div>
          </div>
          <button className="btn-ghost" onClick={reset}>{t.new_request}</button>
        </div> :

      <div className="booking-grid">
          <div className="cal-wrap">
            <div className="cal-nav">
              <button onClick={() => shiftMonth(-1)} aria-label="prev">‹</button>
              <button onClick={() => shiftMonth(1)} aria-label="next">›</button>
            </div>
            <div className="cal-months">
              {months.map((m, mi) =>
            <div className="cal-month" key={mi}>
                  <div className="cal-title">{t.months[m.getMonth()]} {m.getFullYear()}</div>
                  <div className="cal-grid">
                    {t.days.map((d) => <div key={d} className="cal-dow">{d}</div>)}
                    {buildDays(m).map((d, di) => {
                  if (!d) return <div key={di} className="cal-day empty"></div>;
                  const k = ymd(d);
                  const past = isPast(d);
                  const isBusy = busy.has(k);
                  const isIn = sameDay(d, checkIn);
                  const isOut = sameDay(d, checkOut);
                  const inR = inRange(d);
                  let cls = "cal-day";
                  if (past) cls += " past";else
                  if (isBusy) cls += " busy";else
                  cls += " avail";
                  if (isIn) cls += " sel-in";
                  if (isOut) cls += " sel-out";
                  if (inR) cls += " sel-mid";
                  return (
                    <button key={di} className={cls} onClick={() => clickDay(d)} disabled={past || isBusy}>
                          {d.getDate()}
                        </button>);

                })}
                  </div>
                </div>
            )}
            </div>
            <div className="cal-legend">
              <span><i className="lg avail"></i>{t.legend_avail}</span>
              <span><i className="lg busy"></i>{t.legend_busy}</span>
              <span><i className="lg sel"></i>{t.legend_selected}</span>
            </div>
          </div>

          <form className="booking-form" onSubmit={submit}>
            <div className="form-summary">
              {checkIn && checkOut ?
            <React.Fragment>
                  <div className="sum-row">
                    <div><span>{t.checkin}</span><strong>{fmtDate(checkIn, lang)}</strong></div>
                    <div><span>{t.checkout}</span><strong>{fmtDate(checkOut, lang)}</strong></div>
                  </div>
                  <div className="sum-nights">{nights()} {nights() === 1 ? t.night : t.nights}</div>
                </React.Fragment> :

            <div className="sum-empty">{t.select_dates}</div>
            }
            </div>

            <label>
              <span>{t.room}</span>
              <select value={room} onChange={(e) => setRoom(e.target.value)}>
                <option value="double">{t.room_double}</option>
                <option value="single">{t.room_single}</option>
              </select>
            </label>

            <label>
              <span>{t.guests}</span>
              <select value={guests} onChange={(e) => setGuests(+e.target.value)}>
                {[1, 2].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>

            <label>
              <span>{t.name_label}</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <label>
              <span>{t.email_label}</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>

            <label>
              <span>{t.notes_label}</span>
              <textarea rows="3" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
            </label>

            <button type="submit" className="btn-primary" disabled={!checkIn || !checkOut}>
              {t.request_book}
            </button>
          </form>
        </div>
      }
    </section>);

}

function fmtDate(d, lang) {
  const m = T[lang].months[d.getMonth()];
  return `${d.getDate()} ${m.substring(0, 3).toLowerCase()} ${d.getFullYear()}`;
}

// ============== Missione ==============
function Missione({ lang }) {
  const t = T[lang];
  return (
    <section className="missione" id="missione-anchor">
      <div className="missione-inner">
        <div className="missione-side">
          <div className="kicker">{t.missione_kicker}</div>
          <div className="missione-mark">✦</div>
        </div>
        <div className="missione-main">
          <h2>{t.missione_title}</h2>
          <p>{t.missione_text}</p>
        </div>
      </div>
    </section>);

}

// ============== Newsletter ==============
function Newsletter({ lang }) {
  const t = T[lang];
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  function submit(e) {
    e.preventDefault();
    if (!email) return;
    fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});
    setDone(true);
    setTimeout(() => {setDone(false);setEmail("");}, 3000);
  }
  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <div>
          <h3>{t.newsletter_title}</h3>
          <p>{t.newsletter_sub}</p>
        </div>
        <form onSubmit={submit} className="nl-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.newsletter_placeholder}
            required />
          
          <button type="submit">{done ? "✓" : t.subscribe}</button>
        </form>
      </div>
    </section>);

}

// ============== Contatti ==============
function Contatti({ lang }) {
  const t = T[lang];
  return (
    <section className="contatti" id="contatti-anchor">
      <div className="contatti-inner">
        <div className="contatti-head">
          <div className="kicker">{t.nav_contatti}</div>
          <h2>{t.contact_title}</h2>
        </div>
        <div className="contatti-grid">
          <div className="c-block">
            <div className="c-label">{t.address_label}</div>
            <div className="c-val">
              Via San Michele<br />
              63073 Offida (AP)<br />
              {lang === "it" ? "Marche, Italia" : "Marche, Italy"}
            </div>
          </div>
          <div className="c-block">
            <div className="c-label">{t.email_lbl}</div>
            <div className="c-val">
              <a href="mailto:info@complessosanmichele-offida.it">info@complessosanmichele-offida.it</a>
            </div>
          </div>
          <div className="c-block">
            <div className="c-label">{t.phone_label}</div>
            <div className="c-val">+39 3292182011</div>
          </div>
          <div className="c-block">
            <div className="c-label">{t.follow}</div>
            <div className="c-val">
              <a href="#">Instagram</a> · <a href="#">Facebook</a>
            </div>
          </div>
        </div>
        <a
          className="map-placeholder"
          href="https://maps.app.goo.gl/vLARUgdp2fcCyFEn8"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Apri in Google Maps">
          
          <iframe
            title="Mappa Complesso San Michele"
            src="https://www.google.com/maps?q=Via+San+Michele+Offida+AP&hl=it&z=16&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
          <div className="map-overlay">
            <span className="pin">◉</span>
            <span>Via San Michele — Offida (AP)</span>
            <span className="map-cta">{lang === "it" ? "Apri in Maps ↗" : "Open in Maps ↗"}</span>
          </div>
        </a>
      </div>
      <footer className="footer">
        <div>{t.footer_credits}</div>
        <div>© {new Date().getFullYear()}</div>
      </footer>
    </section>);

}

// ============== Sub-page wrapper with footer blocks ==============
function SubPage({ children, lang }) {
  return (
    <React.Fragment>
      {children}
      <Newsletter lang={lang} />
      <Contatti lang={lang} />
    </React.Fragment>);

}

// ============== App ==============
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "merlettaieOpacity": 0.10,
  "merlettaieContrast": 0.7,
  "veilStrength": 0.55,
  "veilDark": 0.75
} /*EDITMODE-END*/;

function App() {
  const [lang, setLang] = useState(localStorage.getItem("csm-lang") || "it");
  const [page, setPage] = useState(window.location.hash.replace("#", "") || "home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {localStorage.setItem("csm-lang", lang);}, [lang]);

  function navigate(p) {
    if (p === "missione" || p === "contatti") {
      // Scroll to anchor in current page (or home)
      if (page !== "home") {
        setPage("home");
        setTimeout(() => {
          const el = document.getElementById(`${p}-anchor`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      } else {
        const el = document.getElementById(`${p}-anchor`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    setPage(p);
    window.location.hash = p;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  useEffect(() => {
    function onHash() {
      const p = window.location.hash.replace("#", "") || "home";
      setPage(p);
      window.scrollTo({ top: 0 });
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  let content;
  if (page === "chiesa") content = <SubPage lang={lang}><Chiesa lang={lang} /></SubPage>;else
  if (page === "laboratorio") content = <SubPage lang={lang}><Laboratorio lang={lang} /></SubPage>;else
  if (page === "dimora") content = <SubPage lang={lang}><Dimora lang={lang} /></SubPage>;else
  content = <Home lang={lang} navigate={navigate} />;

  return (
    <div className="app" data-screen-label={`Page: ${page}`}>
      <SlotsProvider>
        <LightboxProvider>
          <Header lang={lang} setLang={setLang} current={page} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          <main key={page}>{content}</main>
        </LightboxProvider>
      </SlotsProvider>
    </div>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);