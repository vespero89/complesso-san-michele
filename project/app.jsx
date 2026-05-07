// Complesso San Michele — App root + router
// Components loaded from components/ via HTML script tags

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "merlettaieOpacity": 0.10,
  "merlettaieContrast": 0.7,
  "veilStrength": 0.55,
  "veilDark": 0.75
} /*EDITMODE-END*/;

function App() {
  const [lang, setLang] = React.useState(localStorage.getItem("csm-lang") || "it");
  const [page, setPage] = React.useState(window.location.hash.replace("#", "") || "home");
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => { localStorage.setItem("csm-lang", lang); }, [lang]);

  function navigate(p) {
    if (p === "missione" || p === "contatti") {
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

  React.useEffect(() => {
    function onHash() {
      const p = window.location.hash.replace("#", "") || "home";
      setPage(p);
      window.scrollTo({ top: 0 });
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  let content;
  if (page === "chiesa") content = <SubPage lang={lang}><Chiesa lang={lang} /></SubPage>;
  else if (page === "laboratorio") content = <SubPage lang={lang}><Laboratorio lang={lang} /></SubPage>;
  else if (page === "dimora") content = <SubPage lang={lang}><Dimora lang={lang} /></SubPage>;
  else content = <Home lang={lang} navigate={navigate} />;

  return (
    <div className="app" data-screen-label={`Page: ${page}`}>
      <SlotsProvider>
        <LightboxProvider>
          <Header lang={lang} setLang={setLang} current={page} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          <main key={page}>{content}</main>
        </LightboxProvider>
      </SlotsProvider>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
