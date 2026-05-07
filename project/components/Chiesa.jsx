// Complesso San Michele — Chiesa component

function Chiesa({ lang }) {
  const t = T[lang];
  const events = [
    { y: "2025", titIt: "Residenza: Mani che pensano", titEn: "Residency: Thinking hands" },
    { y: "2024", titIt: "Mostra: Geografie del lavoro", titEn: "Exhibition: Geographies of work" },
    { y: "2024", titIt: "Concerto: Polifonie d'autunno", titEn: "Concert: Autumn polyphonies" },
    { y: "2023", titIt: "Convegno: Coltivare l'umano", titEn: "Symposium: Cultivating the human" },
    { y: "2023", titIt: "Mostra fotografica: Borgo", titEn: "Photo exhibition: Village" },
    { y: "2022", titIt: "Letture: La cura dei luoghi", titEn: "Readings: The care of places" },
  ];

  return (
    <div className="page page-section">
      <SectionHero
        kicker={t.chiesa_kicker}
        title={t.chiesa_title}
        lead={t.chiesa_lead}
        slotId="chiesa-hero"
        slotLabel={`${t.drop_image} — Chiesa interno`}
      />

      <section className="gallery-section">
        <div className="section-head">
          <h3>{t.chiesa_gallery_title}</h3>
          <p>{t.chiesa_gallery_sub}</p>
        </div>
        <div className="gallery-grid">
          {events.map((e, i) => {
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
                  index={i}
                />
                <figcaption>
                  <span className="ev-year">{e.y}</span>
                  <span className="ev-title">{lang === "it" ? e.titIt : e.titEn}</span>
                </figcaption>
              </figure>
            );
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
    </div>
  );
}
window.Chiesa = Chiesa;
