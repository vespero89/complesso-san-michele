// Complesso San Michele — Header component

function Header({ lang, setLang, current, navigate, menuOpen, setMenuOpen }) {
  const t = T[lang];
  const items = [
    ["home", t.nav_home],
    ["chiesa", t.nav_chiesa],
    ["laboratorio", t.nav_laboratorio],
    ["dimora", t.nav_dimora],
    ["missione", t.nav_missione],
    ["contatti", t.nav_contatti],
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" onClick={() => navigate("home")}>
          <span className="brand-mark">✦</span>
          <span className="brand-text">Complesso San Michele</span>
        </a>
        <nav className="nav-desktop">
          {items.map(([k, l]) =>
            <a key={k} onClick={() => navigate(k)} className={current === k ? "active" : ""}>{l}</a>
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
            <a key={k} onClick={() => { navigate(k); setMenuOpen(false); }}>{l}</a>
          )}
        </div>
      }
    </header>
  );
}
window.Header = Header;
