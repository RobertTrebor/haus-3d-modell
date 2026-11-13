#!/usr/bin/env python3
"""Baut aus src/ eine einzelne HTML-Datei (dist/haus-3d-modell.html) mit eingebetteten
CSS, JS und Bildern – so wie sie als Artifact veröffentlicht wird.

Aufruf:  python build.py            -> dist/haus-3d-modell.html
         python build.py v83_Name   -> zusätzlich dist/v83_Name.html (Versionskopie)
"""
import base64, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC, DIST = ROOT / "src", ROOT / "dist"
SCRIPTS = ["config/masse.js", "config/raeume.js", "config/bestand.js", "main.js", "masse/masse.js", "masse/innenwaende.js", "masse/aussenwaende.js", "masse/tueren.js",
           "masse/moebel.js", "katalog.js", "einrichten.js"]
MIME = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}


def read(name):
    return (SRC / name).read_text(encoding="utf-8")


def art_script():
    # art.js listet Schlüssel -> Pfad; hier werden die Dateien als Base64 eingebettet.
    pairs = re.findall(r'^\s*([A-Za-z0-9_]+)\s*:\s*"([^"]+)"', read("art.js"), re.M)
    parts = []
    for key, rel in pairs:
        f = SRC / rel
        data = base64.b64encode(f.read_bytes()).decode("ascii")
        parts.append(f'{key}:"data:{MIME[f.suffix.lower()]};base64,{data}"')
    return "<script>window.ART={" + ",".join(parts) + "};</script>"


def build():
    html = read("index.html")
    html = html.replace('<link rel="stylesheet" href="style.css">', "<style>\n" + read("style.css") + "</style>")
    html = html.replace('<script src="art.js"></script>', art_script())
    # Skripte einbetten (Reihenfolge wie in index.html); keines darf "</script>" enthalten
    for name in SCRIPTS:
        js = read(name)
        assert "</script" not in js.lower(), f"{name} enthält </script>"
        tag = f'<script src="{name}"></script>'
        assert tag in html, f"Tag fehlt in index.html: {tag}"
        html = html.replace(tag, "<script>\n" + js + "</script>")
    for tag in ('href="style.css"', 'src="art.js"') + tuple(f'src="{n}"' for n in SCRIPTS):
        assert tag not in html, f"nicht ersetzt: {tag}"
    return html


if __name__ == "__main__":
    DIST.mkdir(exist_ok=True)
    out = build()
    targets = [DIST / "haus-3d-modell.html"]
    if len(sys.argv) > 1:
        targets.append(DIST / f"{sys.argv[1]}.html")
    for t in targets:
        t.write_text(out, encoding="utf-8")
        print(f"{t.relative_to(ROOT)}  ({len(out.encode('utf-8'))/1e6:.2f} MB)")
