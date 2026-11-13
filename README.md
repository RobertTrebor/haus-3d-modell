# Haus Mühlstr. 46 – 3D-Modell

Interaktives 3D-Modell des Hauses in Walluf (Keller, EG, OG, DG, Fassade, Hof, Garten).
Three.js r128 + OrbitControls, kein Framework, kein npm nötig.

## Aufbau

```
src/
  index.html      Oberfläche (Menüs, Knöpfe, Ansichten-Liste)
  style.css       Gestaltung
  config/         fester Status quo: masse.js (Baumaße), raeume.js (Raummaße), bestand.js (Möbelkorrekturen)
  basis.js        Renderer, Szene, Kamera, Materialien, Hilfsfunktionen, Bau- und Raummaße
  eg.js           Erdgeschoss: Wohnzimmer, Esszimmer, Flur, Küche, Bad, Schlafzimmer
  eg-bedienung.js bewegliche Teile: Fensterflügel, Rollläden, Türen, Geräte, Küchenschränke
  eingang.js      Eingangstreppe, Windfang, Garderobe, Kellertreppe
  keller.js       Bogenzimmer, Kellerbüro, Waschküche, WC, Vorratsraum, Kriechkeller
  vorbau.js       Hauseingang außen, Podest, Vorbau-Obergeschoss
  og.js           Obergeschoss
  aussen.js       Dach, Fassaden, Garage, Hof, Vorgarten
  dg.js           Dachgeschoss
  schalter.js     Deko aus / Möbel aus / Wände aus
  ansichten.js    Kamerastandpunkte (VIEWS), Etagenwahl, Ansichts-Menü
  navigation.js   Umsehen und Zoomen im Raum, Doppelklick, Räume (ROOMS), Treppen (FLIGHTS)
  start.js        Zeichenschleife, Zusammenfassen (Performance), Schnittstelle window.HAUS
  einrichten.js   Einrichtungsmodus; katalog.js Möbelkatalog; masse/ Maßregister
  art.js          Liste der Bilder (Schlüssel -> Datei)
  assets/art/     Fotos/Bilder, die im Modell hängen
build.py          baut dist/haus-3d-modell.html (eine Datei, alles eingebettet)
server.py         lokaler Server; speichert feste Änderungen in src/config/
docs/             Übergabe, Maße, offene Punkte
```

Die Modellskripte von `basis.js` bis `start.js` sind klassische Skripte ohne Module: Sie teilen sich einen
Gültigkeitsbereich und müssen in genau dieser Reihenfolge laden (siehe `index.html` und `SCRIPTS` in `build.py`).
Die Reihenfolge bestimmt auch die Zufallsfolge für Bücher, Pflanzen usw. – Code deshalb nicht zwischen den
Dateien umsortieren, ohne das Ergebnis zu vergleichen.

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
