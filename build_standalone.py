#!/usr/bin/env python3
"""
Genera un singolo file HTML standalone da condividere con il committente.
Tutto il CSS, JS e le immagini vengono inline nel file HTML.

Uso:
    python build_standalone.py
    # oppure con nome file personalizzato:
    python build_standalone.py --output "Anteprima San Michele.html"

Output: dist/Complesso San Michele.html
"""

import argparse
import base64
import json
import mimetypes
import re
from pathlib import Path

PROJECT = Path(__file__).parent / "project"
DIST = Path(__file__).parent / "dist"


def b64_data_uri(path: Path) -> str:
    mime, _ = mimetypes.guess_type(str(path))
    if not mime:
        mime = "application/octet-stream"
    data = base64.b64encode(path.read_bytes()).decode()
    return f"data:{mime};base64,{data}"


def inline_css(css: str) -> str:
    def replace_url(m):
        ref = m.group(1).strip("\"'")
        asset = PROJECT / ref
        if asset.exists():
            return f"url({b64_data_uri(asset)})"
        return m.group(0)

    return re.sub(r"url\(([^)]+)\)", replace_url, css)


def inline_jsx(jsx: str) -> str:
    def replace_src(m):
        ref = m.group(1)
        asset = PROJECT / ref
        if asset.exists():
            return f'"{b64_data_uri(asset)}"'
        return m.group(0)

    return re.sub(r'"(assets/[^"]+)"', replace_src, jsx)


def build(output_name: str):
    DIST.mkdir(exist_ok=True)

    html = (PROJECT / "Complesso San Michele.html").read_text(encoding="utf-8")

    # Inline styles.css
    css_raw = (PROJECT / "styles.css").read_text(encoding="utf-8")
    css_inlined = inline_css(css_raw)
    html = html.replace(
        '<link rel="stylesheet" href="styles.css" />',
        f"<style>\n{css_inlined}\n</style>",
    )

    # Inject image-slot state (monkey-patch fetch so image-slot.js finds the data
    # without needing to load .image-slots.state.json from the filesystem —
    # file:// fetch is blocked by Chrome's CORS policy for local files)
    state_file = PROJECT / ".image-slots.state.json"
    if state_file.exists():
        state_json = state_file.read_text(encoding="utf-8")
        fetch_patch = (
            "<script>\n"
            "(function(){\n"
            f"  const __slots = {state_json};\n"
            "  const _fetch = window.fetch.bind(window);\n"
            "  window.fetch = function(url, ...a) {\n"
            "    if (typeof url === 'string' && url.includes('.image-slots.state.json'))\n"
            "      return Promise.resolve(new Response(JSON.stringify(__slots), {status:200}));\n"
            "    return _fetch(url, ...a);\n"
            "  };\n"
            "})();\n"
            "</script>\n"
        )
    else:
        fetch_patch = ""

    # Inline image-slot.js
    image_slot = (PROJECT / "image-slot.js").read_text(encoding="utf-8")
    html = html.replace(
        '<script src="image-slot.js"></script>',
        f"{fetch_patch}<script>\n{image_slot}\n</script>",
    )

    # Inline app.jsx (keep type="text/babel" so Babel CDN can transpile it)
    jsx_raw = (PROJECT / "app.jsx").read_text(encoding="utf-8")
    jsx_inlined = inline_jsx(jsx_raw)
    html = html.replace(
        '<script type="text/babel" src="app.jsx"></script>',
        f'<script type="text/babel">\n{jsx_inlined}\n</script>',
    )

    out = DIST / output_name
    out.write_text(html, encoding="utf-8")
    size_kb = out.stat().st_size / 1024
    slot_count = len(json.loads(state_file.read_text())) if state_file.exists() else 0
    print(f"✓ Generato: {out}  ({size_kb:.0f} KB)")
    if slot_count:
        print(f"  Immagini iniettate dagli slot: {slot_count}")
    print("  Nota: richiede connessione internet per React, Babel e Google Fonts (CDN).")
    print("  Le API di prenotazione non funzionano senza il backend Flask.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Genera HTML standalone per anteprima.")
    parser.add_argument(
        "--output",
        default="Complesso San Michele.html",
        help="Nome del file di output (default: 'Complesso San Michele.html')",
    )
    args = parser.parse_args()
    build(args.output)
