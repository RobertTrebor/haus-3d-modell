# Übergabe an den Agenten: Einrichtungsmodus

> **Stand v84 (11.11.2026): Katalog mit Quellen, Türen-Design, Flügeltor vor der Garage** – siehe
> „Umsetzung v84“. Performance: `docs/plan-performance.md`. v83 (09.11.2026): die fünf Grundfunktionen.

Stand: 09.11.2026. Bitte zuerst `CLAUDE.md` und `docs/uebergabe.md` lesen.

## Worum es geht

Robert hat ein interaktives 3D-Modell seines Hauses in Walluf (Mühlstr. 46, Altbau von 1940) gebaut.
Es zeigt Keller, EG, OG, DG, Fassade, Hof und Garten. Ansehen kann man es auf Android-Smartphone und
in Chrome unter Windows. Bisher wurde es in vielen Chat-Runden als eine einzige HTML-Datei
weiterentwickelt (v30–v82). Seit v82 liegt es in diesem Repository, aufgeteilt in `src/`, und wird in
VS Code weiterbearbeitet.

**Roberts Ziel:** Er will das Modell nutzen, um die Räume **einzurichten und umzugestalten**: Farben
ausprobieren, Möbel umstellen, Varianten vergleichen und dabei echte Maße im Blick behalten. Das Modell
soll also vom reinen Anschauen zu einem einfachen Einrichtungswerkzeug werden. Es muss auf dem Handy
(Touch) genauso gut bedienbar sein wie am PC.

## Gewünschte Funktionen (Reihenfolge = Vorschlag)

1. **Wandfarben je Raum/Wand.** Eine Wand antippen, Farbe aus einer Palette wählen (gängige
   Wandfarbtöne plus freie Farbwahl). Optional: „ganzer Raum“. Zurücksetzen auf Original.
2. **Möbel verschieben und drehen**, wie es heute schon für den Esstisch geht (siehe unten). Das soll für
   alle Möbel gelten: am Boden ziehen, in 15°-Schritten drehen, innerhalb des Raums begrenzt.
3. **Varianten speichern.** Den aktuellen Einrichtungsstand (Farben, Möbelpositionen) unter einem Namen
   speichern, laden und löschen. Erst einmal reicht `localStorage`, zusätzlich Export/Import als
   JSON-Datei, damit Varianten zwischen Handy und PC wandern können.
4. **Maßband.** Zwei Punkte antippen, Abstand in Metern anzeigen. Gedacht für „passt das Sofa hierhin?“.
5. **Möbelkatalog.** Einfache, parametrische Möbel (Sofa, Sessel, Regal, Bett, Tisch, Teppich …) mit
   einstellbaren Maßen in einen Raum setzen.

Alles zusammen gehört in einen **Einrichtungsmodus**: ein eigener Knopf im Dock, der die zugehörigen
Werkzeuge einblendet. Außerhalb des Modus soll sich das Modell verhalten wie bisher: Klick öffnet Türen
und Fenster, Doppelklick wechselt den Raum.

## Was es im Code schon gibt (`src/main.js`)

- **Esstisch verschieben/drehen** (ab ca. Zeile 2220, `// ---- Esstisch verschieben/drehen ----`):
  Raycast auf die Meshes der Gruppe `diningSet`, Ziehen auf einer Bodenebene, Begrenzung per
  `clampX/clampZ`, Drehen mit Knöpfen `rotL/rotR` bzw. Tasten Q/E, Auswahlring, Werkzeugleiste
  `#setTools` in `index.html`. Das ist die Vorlage für Punkt 2.
- **Möbel aus** (`buildFurn()`, ca. Zeile 2256): erkennt Möbel **heuristisch** über Größe und Material.
  Möbel sind meist keine eigenen Objekte, sondern lose Meshes. Für Punkt 2 müssen Möbel deshalb
  zuerst zu benannten Gruppen zusammengefasst werden (je Möbelstück eine `THREE.Group` mit Name,
  Raum und Begrenzung). Am besten dort, wo sie im Code entstehen.
- **Wände:** Fast alle Wände nutzen ein gemeinsames Material `wallMat`. Für Farben je Wand oder Raum
  braucht jede Wand oder jeder Raum ein eigenes Material (z. B. `Mu()` = ungecacht) und eine Zuordnung
  Wand → Raum. Wände sind als `wallMeshes` gesammelt („Wände aus“).
- **Räume:** `ROOMS` (ca. Zeile 2376) enthält die Doppelklick-Räume mit Begrenzungen. Das ist eine gute
  Grundlage für die Zuordnung Wand/Möbel → Raum.
- **Performance-Zusammenfassung** am Ende von `main.js`: statische Meshes werden nach Material zu
  wenigen großen Meshes verschmolzen. Ausgenommen ist alles in `fixed` (aktuell u. a. `acts`, `doors`,
  `sashes`, `diningSet`). **Wichtig:** Alles, was einfärbbar oder verschiebbar werden soll, muss dort
  ausgenommen werden oder ein eigenes Material behalten, sonst ist es nach dem Zusammenfassen
  nicht mehr einzeln greifbar. Gleichzeitig soll die Performance auf dem Handy nicht spürbar leiden.

## Arbeitsweise

- In kleinen, einzeln testbaren Schritten arbeiten. Nach jedem Schritt committen und pushen
  (Repo: https://github.com/RobertTrebor/haus-3d-modell).
- Ansehen: VS Code → Live Server („Go Live“, Wurzel ist `src/`) oder `python server.py` (kann als einziger in `src/config/` speichern).
- Vor jedem Commit prüfen: Die Seite lädt ohne Konsolenfehler, die bestehenden Ansichten und Klicks
  (Türen, Fenster, Rollläden, Garage, Etagenknöpfe) funktionieren weiter.
- Versionen: Nach größeren Schritten `python build.py v83_Kurzname` (Windows ggf. `py build.py …`).
  Die Datei aus `dist/` kann Robert in einem claude.ai-Chat ins Live-Artifact übernehmen lassen.
- Sichtbare Texte in der Oberfläche auf Deutsch.
- Maße von Robert stehen in `docs/uebergabe.md` und haben Vorrang vor Schätzungen.
- Später, nicht jetzt: Three.js-Update (aktuell r128 per CDN) und Aufteilung von `main.js` in Module.
  Wenn es für den Einrichtungsmodus hilft, darf der neue Code schon in eine eigene Datei
  (z. B. `src/einrichten.js`). Dann muss `build.py` diese Datei mit einbetten.

## Erster Schritt (Vorschlag)

Wandfarben im Wohnzimmer (EG): Den Wohnzimmerwänden eigene Materialien geben, sie vom Zusammenfassen
ausnehmen, einen Knopf „Einrichten“ ins Dock setzen und im Einrichtungsmodus per Antippen einer Wand eine
kleine Farbpalette zeigen. Die Wahl in `localStorage` merken. Danach mit Robert abstimmen, bevor es auf
alle Räume ausgeweitet wird.

## Umsetzung v83

Code: `src/einrichten.js` (eigene Datei, wird von `build.py` mit eingebettet). `main.js` stellt am Ende
`window.HAUS` bereit (Szene, Kamera, Räume, Listen, Merge-Daten) und hält sich im Einrichtungsmodus
(`HAUS.editMode`) aus Klicks heraus.

- **Knopf „Einrichten“** im Dock öffnet oben ein Feld mit Reitern: Streichen · Möbel · Neu · Maßband ·
  Varianten. Außerhalb des Modus verhält sich alles wie vorher.
- **Wandfarben:** Wände werden nicht mehr einzeln gehalten (vorher je Wand ein Material-Array → ca. 150
  Zeichenaufrufe mehr). Streichen setzt jetzt **Vertexfarben** in den zusammengefassten Wand-Meshes;
  das Zusammenfassen merkt sich dafür je Quell-Mesh den Vertex-Bereich und die Flächengruppen
  (`big.userData.recs`, `HAUS.srcRec`). Wand-IDs (`w0`, `w1`, …) und Speicherformat sind wie vorher,
  alte Farben aus `haus3d-wall-colors-v1` werden übernommen. Option „ganzer Raum“ (über `ROOMS`),
  Originalfarbe, „Alle Wände zurück“.
- **Möbel verschieben/drehen:** Möbelstücke werden erst beim ersten Öffnen von „Möbel“ gebildet
  (~20 ms): Möbel-Meshes aus `buildFurn()` werden zusammengelegt, wenn sie in derselben verschobenen
  Gruppe liegen oder sich berühren (bis 1,5 cm Abstand), höchstens 3,3 × 3,3 × 2,5 m. Deko, die auf/in einem
  Möbelstück steht, wandert mit. Erst beim Greifen wird das Stück aus den zusammengefassten Meshes
  herausgelöst (eigene Gruppe, kostet nur dann ein paar Zeichenaufrufe). ID = Mittelpunkt in cm.
  Der Esstisch ist jetzt ein normales Möbelstück (Lampe wandert mit). Ziehen bleibt im Raum,
  Drehen 15° (Knöpfe oder Q/E), „Zurück an Ursprung“, „Ausblenden“.
- **Neu (Katalog):** Sofa, Sessel, Bett, Tisch, Stuhl, Schreibtisch, Regal, Schrank, Kommode, TV-Board,
  Teppich, Pflanze – Maße B/T/H in cm und Farbe änderbar, Duplizieren, Löschen. Je Möbel 1–3 Meshes.
- **Maßband:** zwei Punkte antippen → Linie und Abstand, im Feld zusätzlich waagerecht/Höhe.
- **Varianten:** aktueller Stand automatisch in `haus3d-einrichtung-v1`; benannte Varianten in
  `haus3d-varianten-v1`; Export als JSON-Datei (mit Text zum Kopieren als Ausweichweg), Import per Datei
  oder eingefügtem Text; „Alles zurücksetzen“ mit Rückfrage.

Bekannte Grenzen: Eine Wandfläche ist eine Quaderseite – lange Wände über zwei Räume färben sich
ganz. Die Möbel-Erkennung ist heuristisch (z. B. Kapok-Lounge = mehrere Teile, eng stehende Möbel
können zusammenhängen). Gespeicherte Möbel-IDs hängen an der Ursprungsposition: Wird ein Möbel im
Code verschoben, verliert die Variante dessen Verschiebung.

## Umsetzung v84 (11.11.2026)

- **Katalog** (Reiter „Katalog“): Artikel kommen aus `src/katalog.js` (`window.KATALOG`). Dort ist eine
  Liste von **Quellen** `{id, name, laden:()=>Promise<Artikel[]>}`; heute nur der Fantasiekatalog mit
  erfundenen Marken (Nordlicht, Casa Lumen, Werkbank Nr. 7, Stapelbar, Traumwerk …) und Preisen.
  Eine Online-Quelle wird später als weitere Quelle eingetragen (Beispiel im Dateikopf); die Artikel müssen
  nur auf das Feld `form` (Bauform aus `CAT` in `einrichten.js`) und B/T/H in cm abgebildet werden.
  Suche, Kategorie-Filter, Farbwahl je Artikel, „Einfügen“ setzt das Möbel wie unter „Neu“ in die
  Bildmitte (Name, Marke, Preis bleiben am Möbel und in Varianten gespeichert: `p`, `n`, `mk`, `pr`).
  Neue Bauformen: Ecksofa, Hocker, Bank, runder Tisch, Couchtisch, Stehlampe (auch unter „Neu“).
- **Türen** (Reiter „Türen“): Türen werden beim ersten Öffnen erkannt – jede `swing`-Drehgruppe (seit v84
  merkt sich `swing()` den Pivot: `a.pv`, `a.axis`) und jede `makeDoor`-Tür, deren größtes Teil ein hohes,
  dünnes Blatt ist (≥ 1,70 m hoch, ≤ 12 cm dick, 55–130 cm breit). 22 Türen werden gefunden, Schranktüren
  (< 1,85 m, < 62 cm) heißen „Schranktür“. Tür antippen → Design: Original, Weiß glatt, Kassetten, Anthrazit,
  Eiche hell, Nussbaum, Milchglas; Farbe bei den lackierten Varianten; „Auf / Zu“; „Auf alle Türen anwenden“.
  Umsetzung: Material des Blatts tauschen (Material-Arrays bleiben Arrays), Kassetten = ein zusätzliches
  Mesh je Tür im Pivot. ID = Pivot-Weltposition in cm (`d514_0_472`), Speicher `state.doors`.
- **Flügeltor vor der Garage**: Kasten unter „Türen“. Zweiflügeliges Tor in der Garagenöffnung (zwischen
  weißem Rahmen und Sektionaltor, z = NF+0,14), öffnet zum Hof, klickbar wie andere Türen. Material: Lärche
  oder Eiche dunkel (Bretter als Textur), Stahl anthrazit/moosgrün/weinrot, Aluminium weiß, Edelstahl,
  eigene Farbe. Optionen: Fenster oben (3 je Flügel), Sektionaltor ausblenden. Liegt in `gRoof`, also nur in
  Hof-/Fassaden-/Keller-Ansichten sichtbar („Zum Hof schauen“). Geometrie wird nur einmal gebaut, danach
  nur Materialien getauscht bzw. Gruppe versteckt (Klick-Registrierung in `acts` bleibt gültig).
  Speicher `state.tor`.
- `window.HAUS` zusätzlich: `anims, doors, toggleDoor, B, canvasTex, clickable, swing, tog, gRoof, NF, gx0,
  gx1, garPans, white, isFacade()`.
- Test: Headless-Chrome-Lauf über die gebaute Datei (alle Reiter, Türstile, Tor-Materialien, Katalog-Einfügen,
  Varianten-Rundlauf) ohne Konsolenfehler; 883 Draw-Calls, 141 k Dreiecke im Überblick (Messbasis für den
  Performance-Plan).
- **Maßregister** (im Reiter „Maßband“): Dateien `src/masse/{masse,innenwaende,aussenwaende,tueren,moebel}.js`
  halten Maße mit Quelle gemessen/geschätzt/unbekannt; Räume und Türen kommen automatisch aus dem Modell dazu.
  Nach einer Messung „Als Maß speichern“ mit dem vor Ort gemessenen Wert; Liste mit Abweichung, „Nachmessen“,
  „Stimmt so“, „Zeigen“; Export/Import als JSON (`haus3d-masse-v1` im localStorage). Ablauf: `docs/masse.md`.
