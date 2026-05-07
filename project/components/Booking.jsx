// Complesso San Michele — BookingSection component

function BookingSection({ lang }) {
  const t = T[lang];
  const today = new Date();
  const [viewMonth, setViewMonth] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [checkIn, setCheckIn] = React.useState(null);
  const [checkOut, setCheckOut] = React.useState(null);
  const [room, setRoom] = React.useState("double");
  const [guests, setGuests] = React.useState(2);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(new Set());

  React.useEffect(() => {
    const from = ymd(today);
    const to = new Date(today.getFullYear(), today.getMonth() + 12, 1);
    fetch(`/api/unavailable?room=${room}&from=${from}&to=${ymd(to)}`)
      .then((r) => r.ok ? r.json() : [])
      .then((dates) => setBusy(new Set(dates)))
      .catch(() => {});
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
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(d); setCheckOut(null); return;
    }
    if (d <= checkIn) { setCheckIn(d); return; }
    const cur = new Date(checkIn);
    cur.setDate(cur.getDate() + 1);
    while (cur < d) {
      if (busy.has(ymd(cur))) { setCheckIn(d); setCheckOut(null); return; }
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
    const startDay = (first.getDay() + 6) % 7;
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
      body: JSON.stringify({ name, email, room, guests, notes, check_in: ymd(checkIn), check_out: ymd(checkOut) }),
    })
      .then((r) => {
        if (r.ok) { setSent(true); }
        else { return r.json().then((d) => { alert(d.error || "Errore durante l'invio. Riprova."); }); }
      })
      .catch(() => { setSent(true); });
  }

  function reset() {
    setCheckIn(null); setCheckOut(null);
    setName(""); setEmail(""); setNotes("");
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
        </div>
        :
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
                      if (past) cls += " past";
                      else if (isBusy) cls += " busy";
                      else cls += " avail";
                      if (isIn) cls += " sel-in";
                      if (isOut) cls += " sel-out";
                      if (inR) cls += " sel-mid";
                      return (
                        <button key={di} className={cls} onClick={() => clickDay(d)} disabled={past || isBusy}>
                          {d.getDate()}
                        </button>
                      );
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
                </React.Fragment>
                :
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
    </section>
  );
}
window.BookingSection = BookingSection;
