# Plan: Darstellung schneller und reaktionsfreudiger machen

Stand: 11.11.2026 (v84). Gilt für die Modellskripte (Szene in `basis.js`, Schleife und Zusammenfassen in `start.js`; früher `main.js`) und `src/einrichten.js`.
Ziel: flüssiges Drehen/Zoomen auf dem Android-Handy, sofortige Reaktion auf Tipp und Ziehen,
weniger Akkuverbrauch – ohne dass das Modell sichtbar schlechter aussieht.

## 1. Befund (aus dem Code; Messwerte folgen in Schritt 0)

| Punkt | Wo | Wirkung |
|---|---|---|
| Die Schleife rendert **jeden Frame**, auch wenn sich nichts bewegt (`requestAnimationFrame(loop)` am Ende von `loop()`). | `main.js`, `loop()` | Handy läuft dauerhaft auf Volllast, UI-Eingaben konkurrieren mit dem Rendern, Akku. |
| Schattenkarte wird **alle 20 Frames** neu berechnet (`__shF%20===0`), auch im Stillstand. | `loop()` | Jede Schatten-Neuberechnung zeichnet die ganze Szene ein zweites Mal (aus Sicht der Sonne). |
| **28 Punktlichter** + 2 Richtungslichter in der Szene. Viele stehen bei Tag auf Intensität 0 (Kühlschränke, Backofen, Esszimmerlampe, Flurlampe …), sind aber `visible`. | überall, `new THREE.PointLight` | three.js r128 rechnet **jedes sichtbare Licht in jedem Pixel** jedes `MeshStandardMaterial` – auch bei Intensität 0. Das ist auf dem Handy der teuerste Einzelposten im Fragment-Shader. |
| `PCFSoftShadowMap`, 2048² (Handy 1024²), `antialias:true`. | Renderer-Setup | Weichzeichnen der Schatten kostet pro Pixel 9+ Texturzugriffe; MSAA verdoppelt den Füllaufwand auf Handys mit hoher Pixeldichte. |
| Zusammengefasste Meshes sind **sehr groß** (ein Mesh je Gruppe + Material). | Merge-Block am Ende von `main.js` | Frustum-Culling greift nicht mehr: Das ganze Haus wird gezeichnet, auch wenn man in einem Raum steht. Dafür wenige Draw-Calls. |
| Hover-Raycast bei **jeder Mausbewegung** gegen `doorHits+shutHits+sashHits+acts` (Hunderte Meshes) inkl. `filter(shown)`-Array-Neuaufbau. | `pointermove`-Handler | Am PC spürbares Ruckeln beim Bewegen der Maus über das Bild. |
| Große Canvas-Texturen (Parkett 2048², viele 256–512²) mit Anisotropie = Maximum. | `canvasTex`, `ftA` | Speicher und Bandbreite auf dem Handy; Parkett allein 16 MB (ohne Mipmaps). |
| Hochaufgelöste Geometrie: `SphereGeometry(1,28,18)` für jeden Blob, Zylinder mit 32 Segmenten, `ExtrudeGeometry` mit Bevel. | `blob`, `cyl`, `slab` | Dreiecke, die man nie sieht (Deko im Keller, kleine Töpfe). |
| Pixelverhältnis wird bereits dynamisch angepasst (`__pr`, 1 … 1,75/2). | `loop()` | Gut – aber reagiert erst nach 45 Frames und senkt nur die Auflösung, nicht die Lichter/Schatten. |

## 2. Reihenfolge (jeder Schritt einzeln testbar und einzeln committbar)

### Schritt 0 – Messen, bevor etwas geändert wird
- Kleine Anzeige (nur mit `?debug` in der URL): FPS, `renderer.info.render.calls`, `triangles`,
  `programs.length`, aktuelle Pixelratio. Sitzt im Dock, aktualisiert jede Sekunde.
- Fünf feste Testansichten als Messpunkte: Überblick, Wohnzimmer von der Schiebetür, Küche,
  OG-Überblick, Hof. Werte am PC und auf Roberts Handy notieren (Tabelle in diesem Dokument).
- Damit lässt sich jeder folgende Schritt mit Zahlen belegen; nichts wird „nach Gefühl“ entschieden.

### Schritt 1 – Rendern nur bei Bedarf (größter Gewinn für Akku und Reaktionszeit)
- `loop()` nur rendern, wenn sich etwas ändert: Kamera (`controls.addEventListener('change')`),
  laufende Animation (Türen, Rollläden, Tween, Geräte), Modusschalter, Einrichtungsaktionen
  (`H.dirty()` gibt es schon und setzt `__shF=0`; daraus wird „Frame anfordern“).
- Umsetzung: `let needFrame=true; function requestFrame(){needFrame=true;}`; die rAF-Schleife läuft
  weiter (billig), überspringt aber `renderer.render`, wenn `needFrame` falsch ist und keine Animation
  aktiv ist. Damping von OrbitControls: nach dem Loslassen so lange rendern, bis die Bewegung
  unter einer Schwelle liegt (OrbitControls feuert `change` dabei selbst).
- Erwartung: im Stillstand 0 Frames statt 60; Tippen/Ziehen reagiert sofort, weil der Hauptthread
  frei ist.

### Schritt 2 – Lichter aufräumen
- Punktlichter mit Intensität 0 auf `visible=false` setzen und erst beim Einschalten (Abend,
  Kühlschranktür auf, Backofen) sichtbar machen. Achtung: Jede Änderung der Lichtanzahl kompiliert
  die Shader neu (kurzer Ruckler). Deshalb nur an Modus-Grenzen umschalten (gibt es schon für
  Fassade/Keller über `__pls`/`__plk`), nicht pro Frame.
- Pro Etage/Ansicht nur die Lichter aktiv lassen, die man sehen kann (Keller-Lichter aus, wenn
  man im OG ist). Zuordnung über die bestehenden Sichtbarkeitsgruppen (`gCel`, `gOG`, `gDG`, `gRoof`).
- Ziel: höchstens 6–8 aktive Punktlichter gleichzeitig statt 28.

### Schritt 3 – Schatten gezielt
- `renderer.shadowMap.needsUpdate` nur noch setzen, wenn sich etwas bewegt hat (Tür, Möbel, Abend-
  schalter, Etage) – die 20-Frame-Regel entfällt (mit Schritt 1 ohnehin).
- Handy: `PCFShadowMap` statt `PCFSoftShadowMap`, 1024² bleibt; Innenansichten brauchen die
  Sonnenschatten kaum → in Innenräumen Schatten ganz abschalten (`sun.castShadow=false`), Fassade
  und Garten behalten sie.
- Optional: Schatten-Kamera (`sun.shadow.camera`) enger um den sichtbaren Bereich legen, dann
  reicht eine kleinere Karte für dieselbe Schärfe.

### Schritt 4 – Culling: zusammenfassen nach Raum statt nach Haus
- Merge-Block so ändern, dass je **Raum/Sichtbarkeitsgruppe** zusammengefasst wird (Schlüssel:
  Gruppe + Material + Rolle, wie heute, plus ROOM-Box des Mittelpunkts). Dann kann three.js ganze
  Räume per Frustum/Sichtbarkeit weglassen, Draw-Calls bleiben zweistellig pro Raum.
- Die bestehende Sichtbarkeitslogik in `loop()` (`inside`, `inOG`, `inDG`, Fassaden-Gruppen) bleibt;
  zusätzlich: wenn die Kamera in einem Raum steht, Räume ohne Sichtverbindung ausblenden (grobe
  Nachbarschaftstabelle in `ROOMS`).
- Deko-Objekte (`decoMeshes`) ab einer Entfernung ausblenden (einfaches LOD: `visible=false`, wenn
  Kamera > 12 m entfernt und Objekt < 15 cm).

### Schritt 5 – Texturen und Geometrie verschlanken
- Parkett-Textur 2048² → 1024² (Unterschied am Handy nicht sichtbar), Anisotropie auf 4 begrenzen.
- Canvas-Texturen mit `generateMipmaps` prüfen; `minFilter` für kleine Texturen auf `LinearFilter`.
- `blob` mit `SphereGeometry(1,16,12)`, `cyl` standardmäßig 16 Segmente (Parameter bleibt für
  Sonderfälle), `slab` mit `bevelSegments:2`.
- Nach dem Zusammenfassen die Quellgeometrien freigeben (`geometry.dispose()`), Speicher am Handy.

### Schritt 6 – Eingaben entkoppeln
- Hover-Raycast (`pointermove`) nur alle 80 ms und nur, wenn sich die Maus > 4 px bewegt hat; die
  Liste `doorHits.concat(…)` einmal vorberechnen statt pro Bewegung neu zu bauen; zuerst gegen
  Bounding-Boxen der Gruppen testen, erst dann gegen Dreiecke.
- Touch: Hover ganz überspringen (`pointer: coarse`).
- Einrichtungsmodus: `firstHit` auf die sichtbaren Gruppen begrenzen (statt `scene.children`),
  Möbel-Raycast gegen `pieces`-Boxen vorfiltern.

### Schritt 7 – Startzeit
- Der Merge-Block probiert jede Animation durch und vergleicht alle Mesh-Matrizen (Animationen ×
  Meshes). Ersatz: Meshes, die unter einer `swing`/`anim`-Gruppe hängen, direkt als „beweglich“
  markieren (`a.pv` ist seit v84 bekannt).
- Canvas-Texturen beim Start sind CPU-Arbeit; die großen (Parkett, Fliesen) in `requestIdleCallback`
  nachziehen und bis dahin eine Einfarb-Textur zeigen.

### Später (nicht in diesem Plan)
- three.js r128 → aktuelle Version (bessere Licht-/Schatten-Shader, `BatchedMesh`), erfordert
  Anpassungen (`outputEncoding` → `outputColorSpace`, OrbitControls-Import).
- `three-mesh-bvh` für schnelles Raycasting, falls Schritt 6 nicht reicht.

## 3. Erfolgskriterien
- Handy (Roberts Android): Überblick ≥ 30 FPS beim Drehen, Innenräume ≥ 45 FPS; Stillstand 0 Frames.
- PC: Hover über Türen ohne spürbares Ruckeln; Wechsel Etage/Ansicht < 100 ms Einfrieren.
- Keine sichtbaren Unterschiede in den fünf Messansichten (Screenshots vorher/nachher vergleichen).

## 4. Messtabelle (ausfüllen in Schritt 0)

| Ansicht | Gerät | FPS | Draw-Calls | Dreiecke | Pixelratio |
|---|---|---|---|---|---|
| Überblick | PC | | | | |
| Überblick | Handy | | | | |
| Wohnzimmer (Schiebetür) | Handy | | | | |
| Küche | Handy | | | | |
| OG Überblick | Handy | | | | |
| Hof | Handy | | | | |
