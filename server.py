#!/usr/bin/env python3
"""Lokaler Server für das Hausmodell: liefert src/ aus und speichert feste Änderungen in src/config/.

Aufruf:  python server.py [Port]      -> http://localhost:8000

Anders als `python -m http.server` kann dieser Server schreiben:
  POST /api/masse    -> src/config/masse.js    (Baumaße, Nachmessungen)
  POST /api/raeume   -> src/config/raeume.js   (Raummaße)
  POST /api/bestand  -> src/config/bestand.js  (fest übernommene Möbelkorrekturen)
Er lauscht nur auf dem eigenen Rechner (127.0.0.1) und schickt Dateien ohne Browser-Cache.
"""
import json, os, re, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
TARGETS = {"/api/masse": ("masse.js", "HAUS_MASSE", ("konst", "register")),
           "/api/raeume": ("raeume.js", "HAUS_RAEUME", ("raeume",)),
           "/api/bestand": ("bestand.js", "HAUS_BESTAND", ("pieces", "items"))}


def write_config(name, var, data):
    path = SRC / "config" / name
    old = path.read_text(encoding="utf-8") if path.exists() else ""
    head = "".join(l + "\n" for l in old.splitlines() if l.startswith("//"))
    tmp = path.with_suffix(".tmp")
    tmp.write_text(f"{head}window.{var}={json.dumps(data, ensure_ascii=False, indent=1)};\n", encoding="utf-8", newline="\n")
    os.replace(tmp, path)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(SRC), **k)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def reply(self, code, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.split("?")[0] == "/api/info":
            return self.reply(200, {"schreibbar": True})
        super().do_GET()

    def do_POST(self):
        target = TARGETS.get(self.path)
        if not target:
            return self.reply(404, {"fehler": "unbekannt"})
        # nur Anfragen der eigenen Seite annehmen (keine fremden Webseiten)
        origin = self.headers.get("Origin")
        if origin and not re.fullmatch(r"https?://(localhost|127\.0\.0\.1)(:\d+)?", origin):
            return self.reply(403, {"fehler": "fremde Herkunft"})
        if self.headers.get("Content-Type", "").split(";")[0].strip() != "application/json":
            return self.reply(415, {"fehler": "JSON erwartet"})
        n = int(self.headers.get("Content-Length") or 0)
        if not 0 < n < 2_000_000:
            return self.reply(413, {"fehler": "Größe"})
        try:
            data = json.loads(self.rfile.read(n).decode("utf-8"))
            name, var, keys = target
            if not isinstance(data, dict) or set(data) != set(keys):
                raise ValueError("Aufbau")
            if var == "HAUS_MASSE" and not all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in data["konst"].values()):
                raise ValueError("konst")
            write_config(name, var, data)
        except (ValueError, AttributeError, TypeError) as e:
            return self.reply(400, {"fehler": str(e)})
        self.reply(200, {"ok": True, "datei": f"src/config/{name}"})

    def log_message(self, fmt, *args):
        if self.command == "POST":
            super().log_message(fmt, *args)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"Hausmodell: http://localhost:{port}  (Strg+C beendet)")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
