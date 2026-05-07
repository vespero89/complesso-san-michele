// Complesso San Michele — Home, Missione, Newsletter, Contatti, SubPage

function Home({ lang, navigate }) {
  const t = T[lang];
  return (
    <div className="page page-home">
      <section className="hero">
        <div className="hero-merlettaie" aria-hidden="true" style={{backgroundImage:'url("assets/merlettaie.jpeg")'}}></div>
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

      <section className="doors">
        {[
          { key: "chiesa", prefix: "slot-chiesa-ev-", k: t.door_chiesa_kicker, ti: t.door_chiesa_title, d: t.door_chiesa_desc, num: "I" },
          { key: "laboratorio", prefix: "slot-lab-", k: t.door_lab_kicker, ti: t.door_lab_title, d: t.door_lab_desc, num: "II" },
          { key: "dimora", prefix: "slot-room-", k: t.door_dimora_kicker, ti: t.door_dimora_title, d: t.door_dimora_desc, num: "III" },
        ].map((d) =>
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
    </div>
  );
}
window.Home = Home;

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
    </section>
  );
}
window.Missione = Missione;

function Newsletter({ lang }) {
  const t = T[lang];
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);
  function submit(e) {
    e.preventDefault();
    if (!email) return;
    fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});
    setDone(true);
    setTimeout(() => { setDone(false); setEmail(""); }, 3000);
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
            required
          />
          <button type="submit">{done ? "✓" : t.subscribe}</button>
        </form>
      </div>
    </section>
  );
}
window.Newsletter = Newsletter;

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
    </section>
  );
}
window.Contatti = Contatti;

function SubPage({ children, lang }) {
  return (
    <React.Fragment>
      {children}
      <Newsletter lang={lang} />
      <Contatti lang={lang} />
    </React.Fragment>
  );
}
window.SubPage = SubPage;
