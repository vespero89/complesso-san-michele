// Complesso San Michele — shared: i18n, slots, lightbox, common components

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
window.T = T;

// ============== ImageSlot wrapper ==============
function ImageSlot({ id, label, aspect = "4/3", style = {}, shape = "rect", className = "" }) {
  return (
    <div className={`img-slot-wrap ${className}`} style={{ aspectRatio: aspect, ...style }}>
      <image-slot
        id={`slot-${id}`}
        shape={shape}
        placeholder={label}
        style={{ width: "100%", height: "100%", display: "block" }}>
      </image-slot>
    </div>
  );
}
window.ImageSlot = ImageSlot;

// ============== Slots context + provider ==============
const SlotsCtx = React.createContext({});
window.SlotsCtx = SlotsCtx;

function useSlotImages(prefix) {
  const all = React.useContext(SlotsCtx);
  return React.useMemo(() => {
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
window.useSlotImages = useSlotImages;

function useUrlForSlot(slotId) {
  const all = React.useContext(SlotsCtx);
  const v = all[`slot-${slotId}`] || all[slotId];
  if (!v) return null;
  return typeof v === "string" ? v : v && v.u;
}
window.useUrlForSlot = useUrlForSlot;

function SlotsProvider({ children }) {
  const [slots, setSlots] = React.useState({});
  React.useEffect(() => {
    let alive = true;
    function tick() {
      fetch(".image-slots.state.json", { cache: "no-store" })
        .then((r) => r.ok ? r.json() : null)
        .then((j) => { if (!alive || !j) return; setSlots(j.slots || j); })
        .catch(() => {});
    }
    tick();
    const iv = setInterval(tick, 3000);
    return () => { alive = false; clearInterval(iv); };
  }, []);
  return <SlotsCtx.Provider value={slots}>{children}</SlotsCtx.Provider>;
}
window.SlotsProvider = SlotsProvider;

// ============== Lightbox ==============
const LightboxCtx = React.createContext(() => {});
window.LightboxCtx = LightboxCtx;

function LightboxProvider({ children }) {
  const [state, setState] = React.useState(null);
  const open = (items, idx = 0) => setState({ items, idx });
  const close = () => setState(null);
  function nav(delta) {
    setState((s) => s ? { ...s, idx: (s.idx + delta + s.items.length) % s.items.length } : s);
  }
  React.useEffect(() => {
    if (!state) return;
    function onKey(e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") nav(1);
      else if (e.key === "ArrowLeft") nav(-1);
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
            <button className="lb-nav prev" onClick={(e) => { e.stopPropagation(); nav(-1); }} aria-label="prev">‹</button>
          }
          <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
            <img src={state.items[state.idx].url} alt="" />
            {state.items[state.idx].caption &&
              <div className="lb-caption">{state.items[state.idx].caption}</div>
            }
          </div>
          {state.items.length > 1 &&
            <button className="lb-nav next" onClick={(e) => { e.stopPropagation(); nav(1); }} aria-label="next">›</button>
          }
          {state.items.length > 1 &&
            <div className="lb-counter">{state.idx + 1} / {state.items.length}</div>
          }
        </div>
      }
    </LightboxCtx.Provider>
  );
}
window.LightboxProvider = LightboxProvider;

function useLightbox() {
  return React.useContext(LightboxCtx);
}
window.useLightbox = useLightbox;

// ============== GallerySlot (slot + lightbox trigger) ==============
function GallerySlot({ slotId, label, aspect, items, index, className = "" }) {
  const slots = React.useContext(SlotsCtx);
  const open = useLightbox();
  const url = (() => {
    const v = slots[`slot-${slotId}`];
    if (!v) return null;
    return typeof v === "string" ? v : v.u;
  })();
  function handleClick(e) {
    if (!url) return;
    e.preventDefault();
    e.stopPropagation();
    const filled = items
      .map((it) => {
        const v = slots[`slot-${it.slotId}`];
        const u = !v ? null : typeof v === "string" ? v : v.u;
        return u ? { url: u, caption: it.caption, slotId: it.slotId } : null;
      })
      .filter(Boolean);
    if (!filled.length) return;
    const startIdx = Math.max(0, filled.findIndex((f) => f.slotId === slotId));
    open(filled, startIdx);
  }
  return (
    <div className={`gallery-slot ${url ? "filled" : ""} ${className}`} onClick={handleClick}>
      <ImageSlot id={slotId} label={label} aspect={aspect} />
      {url && <div className="zoom-hint" aria-hidden="true">⤢</div>}
    </div>
  );
}
window.GallerySlot = GallerySlot;

// ============== DoorImage (rotating slot images) ==============
function DoorImage({ slotPrefix, fallbackId, fallbackLabel }) {
  const imgs = useSlotImages(slotPrefix);
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
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
          style={{ backgroundImage: `url("${it.url}")`, opacity: i === idx ? 1 : 0 }}
        />
      )}
    </div>
  );
}
window.DoorImage = DoorImage;

// ============== SectionHero ==============
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
    </section>
  );
}
window.SectionHero = SectionHero;

// ============== fmtDate ==============
function fmtDate(d, lang) {
  const m = T[lang].months[d.getMonth()];
  return `${d.getDate()} ${m.substring(0, 3).toLowerCase()} ${d.getFullYear()}`;
}
window.fmtDate = fmtDate;
