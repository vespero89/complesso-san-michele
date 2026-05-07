// Complesso San Michele — Laboratorio component

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
    { it: "Disegno e bottega", en: "Drawing studio" },
  ];

  return (
    <div className="page page-section">
      <SectionHero
        kicker={t.lab_kicker}
        title={t.lab_title}
        lead={t.lab_lead}
        slotId="lab-hero"
        slotLabel={`${t.drop_image} — Laboratorio`}
      />

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
                  index={i}
                />
                <figcaption>{lang === "it" ? it.it : it.en}</figcaption>
              </figure>
            );
          })}
        </div>
      </section>
    </div>
  );
}
window.Laboratorio = Laboratorio;
