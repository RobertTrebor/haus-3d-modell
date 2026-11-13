# Übergabe 3D-Modell Haus Mühlstr. 46

Stand: 09.11.2026 – Repository angelegt aus v82 (`v82_Performance.html`), inhaltlich unverändert.

## Wichtige Maße (von Robert)
- Raumhöhe EG und OG 2,59 m; Kellerräume 2,20 m; Bogen-Scheitel 1,81 m.
- Kellertreppe 9 Stufen à 19 cm, oberste etwas niedriger.
- Vorbau 4,10 m breit; Außenwände 38 cm; Innenwände ca. 18 cm (inkl. Türrahmen).
- Waschküche 2,50 × 3,63 m; Keller-WC 0,97 × 2,00 m.
- Kellerbüro: von der Terrassenfensterwand 1,50 m bis Balken (38,5 cm breit, 15 cm tief), dann ca. 2,30 m
  bis zur Waschküchenwand; 3 + 6 Spots; beide Fenster 1,74 × 1,25 m, Fensterbank 30 cm,
  gelb-orange Vertikallamellen.
- Hauseingang: 3 Stufen, Edelstahl-Handlauf links.

## Kellerräume (Namen)
Bogenzimmer, Kellerbüro, Waschküche (früher „Vorraum mit Außentür“), Vorratsraum (mit Fenster zur
Einfahrt), Keller-WC und Kriechkeller (zwischen Vorratsraum und Kellertreppe), Wandschrank am Fuß der
Kellertreppe, Garage (Sektionaltor per Klick).

## Offene Punkte / nächste Schritte
1. **Performance**: Robert meldet (09.11.) v82 auf Handy *und* PC noch zäh. Messung im Test (Überblick):
   ca. 880 Zeichenaufrufe, im OG ca. 1340; 14 Punktlichter mit MeshStandardMaterial. Größter Posten:
   ~430 Meshes bleiben einzeln, weil sie klickbar/animiert sind (`fixed`). Ansatzpunkte: klickbare Teile je
   Gruppe zusammenfassen, Punktlichter nur im sichtbaren Bereich, ggf. einfachere Materialien auf dem Handy.
2. **Einrichtungsmodus** – v83 umgesetzt (`src/einrichten.js`, siehe `docs/aufgabe-einrichtungsmodus.md`).
   Rückmeldung von Robert abwarten: Möbel-Erkennung (Teile, die zusammengehören), Bedienung am Handy.
3. Weiteres Gebäude im Garten als eigener Teil. Benötigt: Lage zum Haus, Außenmaße, Höhen, Fotos.
4. Three.js-Update und Module (die Aufteilung von `main.js` in mehrere klassische Skripte ist seit v92 erledigt) (sinnvoll zusammen mit 2./3.).
5. Kleinigkeiten: dunkle Fläche oben an der linken Gartentreppe glätten; EG/OG-Fenster der Gartenseite
   (dreiteiliges Esszimmerfenster, Wintergarten 3×3-Sprossen, Putzband) mit Fotos abgleichen;
   Maße Kriechkeller/Garage nachmessen.
6. Verbindungstür Waschküche–Garage: im Modell nach Fotos mit ca. 0,85 × 2,05 m angesetzt;
  Position und tatsächliche Maße vor Ort bestätigen.

## Historie
- v30–v82: Einzeldateien in `C:\Users\rober\Documents\Grundriss-Versionen`.
- ab v83: Git-Historie in diesem Repository.
