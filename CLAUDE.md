# Hinweise für Claude

- Antworten auf Deutsch. Robert nutzt Android-Smartphone und Chrome unter Windows.
- Maße von Robert haben Vorrang vor Schätzungen aus Fotos; Geschätztes immer als geschätzt kennzeichnen.
  Gesammelte Maße: `docs/uebergabe.md` und Maßregister `src/masse/*.js` (gemessen/geschätzt/unbekannt,
  Ablauf in `docs/masse.md`). Neue Maße von Robert dort eintragen, nicht nur im Code.
- Speicherlogik (`docs/speicherlogik.md`): Status quo des Hauses fest in `src/config/` (Baumaße `masse.js`, Raummaße `raeume.js`,
  Möbelkorrekturen `bestand.js`; schreibbar nur über `python server.py`), Designideen im Browser.
  Raummaße in `raeume.js` (im Code `rm('<raum>','breite'|'tiefe',Rückfallwert)`). Neue Baumaße über
  `KONST.<Name>` bzw. `rm(...)` anbinden statt als feste Zahl.
- Nach Umbauten prüfen: `python tools/pruefen.py` (Fingerabdruck + Funktionstest, braucht laufenden `server.py`).
  Offene Punkte und Stand: `docs/uebergabe.md`.
- Gearbeitet wird in `src/`. `dist/` ist generiert (`python build.py`) und nicht im Repo.
- **Aktuelle Aufgabe: Einrichtungsmodus → `docs/aufgabe-einrichtungsmodus.md`.**
- Nach jeder größeren Änderung: Commit mit aussagekräftiger Nachricht und push, `python build.py vNN_Kurzname`.
  Die Ein-Datei-Version aus `dist/` gehört ins Artifact https://claude.ai/artifact/FohmSLB5zU4L9VUaXLkvSj
  (seit v89 auch aus VS Code mit dem Artifact-Werkzeug: `dist/haus-3d-modell.html` mit dieser URL veröffentlichen;
  die Fähigkeiten `db` und `user` für die Synchronisierung bleiben erhalten, wenn `capabilities` weggelassen wird).
  Versionsnummern laufen ab v83 weiter (v30–v82 liegen in `Dokumente\Grundriss-Versionen`).
- Modellskripte (klassische Skripte mit gemeinsamem Gültigkeitsbereich, Ladereihenfolge fest, siehe README):
  `basis.js`, `eg.js`, `eg-bedienung.js`, `eingang.js`, `keller.js`, `vorbau.js`, `og.js`, `aussen.js`, `dg.js`,
  `schalter.js`, `ansichten.js`, `navigation.js`, `start.js`. Neue Datei: in `index.html` und `SCRIPTS`
  (`build.py`) eintragen. Namen sind global – keine Namen wie `top`, `name`, `parent`, `open` auf oberster Ebene.
  Die Reihenfolge des Codes bestimmt die Zufallsfolge (`rnd()`); nicht umsortieren, ohne zu vergleichen.
- Hilfsfunktionen (`basis.js`, `eg.js`, `eg-bedienung.js`): `B(x0,x1,y0,y1,z0,z1,mat,parent)` (Quader), `cyl`, `blob`,
  `M(hex,rough,extra)` (Material, gecacht; `Mu` ungecacht), `canvasTex`, `win`, `sash`, `openWin`,
  `swing`, `tog`, `anim`, `clickable`, `deco`, `label`.
- Sichtbarkeitsgruppen: `gCel` (Keller-Einrichtung), `gCelF` (Keller-Rohbau, auch in Außenansichten sichtbar), `gRoof` (Außen/Fassade), `gOG`, `gDG`; Steuerung in `loop()` (`start.js`).
- Ansichten (`ansichten.js`): `VIEWS{key:{p,t,fl,facade}}` + `<option>` in `index.html`; Etagen `setLevel(-1..2)`.
  Doppelklick-Räume in `ROOMS`, Treppen in `FLIGHTS` (`navigation.js`).
- Performance: statische Teile werden in `start.js` zu wenigen Meshes zusammengefasst.
  Neue bewegliche oder verschiebbare Teile müssen per `clickable`/`anim`/`doors`/`sashes` registriert
  sein (bzw. vom Zusammenfassen ausgenommen werden), sonst sind sie danach nicht mehr einzeln greifbar.
- Einrichtungsmodus: `src/einrichten.js` (nutzt `window.HAUS` aus `start.js`). Möbelkatalog mit
  Quellen: `src/katalog.js` (`window.KATALOG`). Performance-Plan: `docs/plan-performance.md`.
- Laufmodus (Knopf „Laufen“): `src/laufen.js`, lädt nach `einrichten.js`. Hindernisse und Boden werden beim Start aus
  den sichtbaren Flächen berechnet (Möbel aus `furnList` nur als Hindernis, Deko gar nicht, bewegliche Teile aus
  `HAUS.fixed`). Test: `python tools/pruefen.py laufen`. Stand und offene Punkte: `docs/uebergabe.md`.
- Bilder: Datei nach `src/assets/art/`, Eintrag in `src/art.js`, im Code `window.ART.<schlüssel>`.
