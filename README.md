# Haus Mühlstr. 46 – 3D-Modell

Interaktives 3D-Modell des Hauses in Walluf (Keller, EG, OG, DG, Fassade, Hof, Garten).
Three.js r128 + OrbitControls, kein Framework, kein npm nötig.

## Aufbau

```
src/
  index.html      Oberfläche (Menüs, Knöpfe, Ansichten-Liste)
  style.css       Gestaltung
  main.js         das gesamte 3D-Modell (Geometrie, Ansichten, Interaktion)
  art.js          Liste der Bilder (Schlüssel -> Datei)
  assets/art/     Fotos/Bilder, die im Modell hängen
build.py          baut dist/haus-3d-modell.html (eine Datei, alles eingebettet)
docs/             Übergabe, Maße, offene Punkte
```

## In VS Code ansehen

Die Seite muss über einen kleinen lokalen Server laufen (nicht per Doppelklick als Datei),
sonst blockiert der Browser die Bilder als Texturen.

- Erweiterung **Live Server** installieren (VS Code schlägt sie vor) → unten rechts **Go Live**
  → öffnet `src/index.html` im Browser und lädt bei jedem Speichern neu.
- Empfohlen im Terminal: `python server.py` → http://localhost:8000. Nur dieser Server kann feste Änderungen
  (Baumaße, Möbelkorrekturen) in `src/config/` speichern, siehe `docs/speicherlogik.md`.

## Ein-Datei-Version bauen (für das Artifact / Versionskopien)

```
python build.py                 # -> dist/haus-3d-modell.html
python build.py v83_Kurzname    # zusätzlich dist/v83_Kurzname.html
```

Live-Modell: https://claude.ai/artifact/FohmSLB5zU4L9VUaXLkvSj
