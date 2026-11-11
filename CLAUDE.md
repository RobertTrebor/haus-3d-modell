# Hinweise für Claude

- Antworten auf Deutsch. Robert nutzt Android-Smartphone und Chrome unter Windows.
- Maße von Robert haben Vorrang vor Schätzungen aus Fotos; Geschätztes immer als geschätzt kennzeichnen.
  Gesammelte Maße: `docs/uebergabe.md` und Maßregister `src/masse/*.js` (gemessen/geschätzt/unbekannt,
  Ablauf in `docs/masse.md`). Neue Maße von Robert dort eintragen, nicht nur im Code.
- Gearbeitet wird in `src/`. `dist/` ist generiert (`python build.py`) und nicht im Repo.
- **Aktuelle Aufgabe: Einrichtungsmodus → `docs/aufgabe-einrichtungsmodus.md`.**
- Nach jeder größeren Änderung: Commit mit aussagekräftiger Nachricht und push, `python build.py vNN_Kurzname`.
  Die Ein-Datei-Version aus `dist/` gehört ins Artifact https://claude.ai/artifact/FohmSLB5zU4L9VUaXLkvSj
  (geht nur aus claude.ai heraus; in VS Code Robert darauf hinweisen).
  Versionsnummern laufen ab v83 weiter (v30–v82 liegen in `Dokumente\Grundriss-Versionen`).
- `main.js` ist eine IIFE. Hilfsfunktionen: `B(x0,x1,y0,y1,z0,z1,mat,parent)` (Quader), `cyl`, `blob`,
  `M(hex,rough,extra)` (Material, gecacht; `Mu` ungecacht), `canvasTex`, `win`, `sash`, `openWin`,
  `swing`, `tog`, `anim`, `clickable`, `deco`, `label`.
- Sichtbarkeitsgruppen: `gCel` (Keller), `gRoof` (Außen/Fassade), `gOG`, `gDG`; Steuerung in `loop()`.
- Ansichten: `VIEWS{key:{p,t,fl,facade}}` + `<option>` in `index.html`; Doppelklick-Räume in `ROOMS`,
  Treppen in `FLIGHTS`; Etagen `setLevel(-1..2)`.
- Performance: statische Teile werden am Ende von `main.js` zu wenigen Meshes zusammengefasst.
  Neue bewegliche oder verschiebbare Teile müssen per `clickable`/`anim`/`doors`/`sashes` registriert
  sein (bzw. vom Zusammenfassen ausgenommen werden), sonst sind sie danach nicht mehr einzeln greifbar.
- Einrichtungsmodus: `src/einrichten.js` (nutzt `window.HAUS` vom Ende von `main.js`). Möbelkatalog mit
  Quellen: `src/katalog.js` (`window.KATALOG`). Performance-Plan: `docs/plan-performance.md`.
- Bilder: Datei nach `src/assets/art/`, Eintrag in `src/art.js`, im Code `window.ART.<schlüssel>`.
