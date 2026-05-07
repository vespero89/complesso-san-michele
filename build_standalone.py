#!/usr/bin/env python3
"""
Genera file HTML standalone da condividere con il committente.
Tutto il CSS, JS e le immagini vengono inline nel file HTML.

Uso:
    python build_standalone.py                  # sito principale
    python build_standalone.py --page dimora    # landing B&B
    python build_standalone.py --all            # entrambi
    python build_standalone.py --output "Anteprima.html"

Output: dist/
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


def make_fetch_patch(state_file: Path) -> str:
    """Monkey-patch window.fetch so image-slot.js finds the state JSON
    without hitting the filesystem (file:// CORS policy blocks it)."""
    if not state_file.exists():
        return ""
    state_json = state_file.read_text(encoding="utf-8")
    return (
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


def build_main(output_name: str):
    DIST.mkdir(exist_ok=True)
    html = (PROJECT / "Complesso San Michele.html").read_text(encoding="utf-8")

    css_raw = (PROJECT / "styles.css").read_text(encoding="utf-8")
    html = html.replace(
        '<link rel="stylesheet" href="styles.css" />',
        f"<style>\n{inline_css(css_raw)}\n</style>",
    )

    state_file = PROJECT / ".image-slots.state.json"
    fetch_patch = make_fetch_patch(state_file)

    image_slot = (PROJECT / "image-slot.js").read_text(encoding="utf-8")
    html = html.replace(
        '<script src="image-slot.js"></script>',
        f"{fetch_patch}<script>\n{image_slot}\n</script>",
    )

    jsx_raw = (PROJECT / "app.jsx").read_text(encoding="utf-8")
    html = html.replace(
        '<script type="text/babel" src="app.jsx"></script>',
        f'<script type="text/babel">\n{inline_jsx(jsx_raw)}\n</script>',
    )

    out = DIST / output_name
    out.write_text(html, encoding="utf-8")
    slot_count = len(json.loads(state_file.read_text())) if state_file.exists() else 0
    print(f"✓ {out}  ({out.stat().st_size / 1024:.0f} KB)")
    if slot_count:
        print(f"  Immagini slot: {slot_count}")


def build_dimora(output_name: str):
    DIST.mkdir(exist_ok=True)
    html = (PROJECT / "dimora.html").read_text(encoding="utf-8")

    # Inline styles.css
    css_raw = (PROJECT / "styles.css").read_text(encoding="utf-8")
    html = html.replace(
        '<link rel="stylesheet" href="styles.css" />',
        f"<style>\n{inline_css(css_raw)}\n</style>",
    )

    # Inline dimora.css
    dimora_css_raw = (PROJECT / "dimora.css").read_text(encoding="utf-8")
    html = html.replace(
        '<link rel="stylesheet" href="dimora.css" />',
        f"<style>\n{inline_css(dimora_css_raw)}\n</style>",
    )

    state_file = PROJECT / ".image-slots.state.json"
    fetch_patch = make_fetch_patch(state_file)

    image_slot = (PROJECT / "image-slot.js").read_text(encoding="utf-8")
    html = html.replace(
        '<script src="image-slot.js"></script>',
        f"{fetch_patch}<script>\n{image_slot}\n</script>",
    )

    jsx_raw = (PROJECT / "dimora.jsx").read_text(encoding="utf-8")
    html = html.replace(
        '<script type="text/babel" src="dimora.jsx"></script>',
        f'<script type="text/babel">\n{inline_jsx(jsx_raw)}\n</script>',
    )

    out = DIST / output_name
    out.write_text(html, encoding="utf-8")
    slot_count = len(json.loads(state_file.read_text())) if state_file.exists() else 0
    print(f"✓ {out}  ({out.stat().st_size / 1024:.0f} KB)")
    if slot_count:
        print(f"  Immagini slot: {slot_count}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Genera HTML standalone per anteprima.")
    parser.add_argument("--page", choices=["main", "dimora"], default="main",
                        help="Pagina da generare (default: main)")
    parser.add_argument("--all", action="store_true",
                        help="Genera entrambe le pagine")
    parser.add_argument("--output", default=None,
                        help="Nome file di output personalizzato")
    args = parser.parse_args()

    note = (
        "  Nota: richiede connessione internet per React, Babel e Google Fonts (CDN).\n"
        "  Le API di prenotazione non funzionano senza il backend Flask."
    )

    if args.all:
        build_main(args.output or "Complesso San Michele.html")
        build_dimora(args.output or "Dimora San Michele.html")
        print(note)
    elif args.page == "dimora":
        build_dimora(args.output or "Dimora San Michele.html")
        print(note)
    else:
        build_main(args.output or "Complesso San Michele.html")
        print(note)
