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

function loadRecaptcha(siteKey) {
  return new Promise((resolve) => {
    if (window.grecaptcha) { resolve(); return; }
    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

function Newsletter({ lang }) {
  const t = T[lang];
  const empty = { NomeCognome: "", Email: "", Cellulare: "", Citta: "", Professione: "", Privacy: false };
  const [form, setForm] = React.useState(empty);
  const [status, setStatus] = React.useState("idle"); // idle | sending | ok | err | spam | required

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.NomeCognome.trim() || !form.Email.trim() || !form.Privacy) {
      setStatus("required"); return;
    }
    setStatus("sending");

    function doSubmit(token) {
      const fd = new FormData();
      fd.append("NomeCognome", form.NomeCognome.trim());
      fd.append("Email", form.Email.trim());
      fd.append("Cellulare", form.Cellulare.trim());
      fd.append("Citta", form.Citta.trim());
      fd.append("Professione", form.Professione.trim());
      fd.append("Privacy", "1");
      if (token) fd.append("recaptcha_token", token);
      fetch("/api/newsletter", { method: "POST", body: fd })
        .then((r) => r.json())
        .then((d) => setStatus(d.status === "mail_sent" ? "ok" : d.status === "spam" ? "spam" : "err"))
        .catch(() => setStatus("err"));
    }

    const siteKey = window.RECAPTCHA_SITE_KEY;
    if (siteKey) {
      loadRecaptcha(siteKey).then(() => {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action: "newsletter" })
            .then((token) => doSubmit(token))
            .catch(() => doSubmit(""));
        });
      });
    } else {
      doSubmit("");
    }
  }

  const sending = status === "sending";

  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <div className="nl-head">
          <h3>{t.newsletter_title}</h3>
          <p>{t.newsletter_sub}</p>
        </div>
        {status === "ok"
          ? <p className="nl-feedback nl-ok">{t.nl_ok}</p>
          : <form className="nl-form" onSubmit={handleSubmit} noValidate>
              <div className="nl-row">
                <input className="nl-input" type="text" placeholder={t.nl_name}
                  value={form.NomeCognome} onChange={(e) => set("NomeCognome", e.target.value)} disabled={sending} />
                <input className="nl-input" type="email" placeholder={t.nl_email}
                  value={form.Email} onChange={(e) => set("Email", e.target.value)} disabled={sending} />
                <input className="nl-input" type="tel" placeholder={t.nl_phone}
                  value={form.Cellulare} onChange={(e) => set("Cellulare", e.target.value)} disabled={sending} />
                <input className="nl-input" type="text" placeholder={t.nl_city}
                  value={form.Citta} onChange={(e) => set("Citta", e.target.value)} disabled={sending} />
                <input className="nl-input nl-full" type="text" placeholder={t.nl_job}
                  value={form.Professione} onChange={(e) => set("Professione", e.target.value)} disabled={sending} />
              </div>
              <label className="nl-privacy-row">
                <input type="checkbox" checked={form.Privacy}
                  onChange={(e) => set("Privacy", e.target.checked)} disabled={sending} />
                <span>
                  {t.nl_privacy_pre}
                  <a href={t.nl_privacy_url} target="_blank" rel="noopener noreferrer" className="nl-privacy-link">
                    {t.nl_privacy_link_text}
                  </a>
                  {t.nl_privacy_post}
                </span>
              </label>
              {(status === "err" || status === "spam" || status === "required") &&
                <p className="nl-feedback nl-err">
                  {status === "required" ? t.nl_required : status === "spam" ? t.nl_err_spam : t.nl_err}
                </p>
              }
              <button type="submit" className="nl-submit" disabled={sending}>
                {sending ? t.nl_sending : t.nl_send}
              </button>
            </form>
        }
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
