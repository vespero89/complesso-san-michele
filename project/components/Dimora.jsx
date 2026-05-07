// Complesso San Michele — Dimora component

function Dimora({ lang }) {
  const t = T[lang];
  return (
    <div className="page page-section">
      <SectionHero
        kicker={t.dimora_kicker}
        title={t.dimora_title}
        lead={t.dimora_lead}
        slotId="dimora-hero"
        slotLabel={`${t.drop_image} — Dimora`}
      />

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
                { slotId: "room-single", caption: t.room_single },
              ]}
              index={0}
            />
            <div className="room-body">
              <div className="room-num">01</div>
              <h4>{t.room_double}</h4>
              <p>{t.room_double_desc}</p>
              <ul className="room-feats">
                <li>2 {lang === "it" ? "ospiti" : "guests"}</li>
                <li>{lang === "it" ? "Bagno privato" : "Private bath"}</li>
                <li>Wi-Fi</li>
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
                { slotId: "room-single", caption: t.room_single },
              ]}
              index={1}
            />
            <div className="room-body">
              <div className="room-num">02</div>
              <h4>{t.room_single}</h4>
              <p>{t.room_single_desc}</p>
              <ul className="room-feats">
                <li>1 {lang === "it" ? "ospite" : "guest"}</li>
                <li>{lang === "it" ? "Bagno privato" : "Private bath"}</li>
                <li>Wi-Fi</li>
                <li>{lang === "it" ? "Colazione" : "Breakfast"}</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <BookingSection lang={lang} />
    </div>
  );
}
window.Dimora = Dimora;
