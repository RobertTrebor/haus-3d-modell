# Übergabe 3D-Modell Haus Mühlstr. 46

Stand: 13.11.2026 (v92). Repository am 09.11.2026 angelegt aus v82 (`v82_Performance.html`).

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

## Stand 13.11.2026 (v85–v92)

Umgesetzt (Einzelheiten in den Commits und in `docs/speicherlogik.md`):
- v85/v86: Im Raum dreht die Kamera am Standpunkt (Umsehen); Zoomen und Verschieben bleiben im Raum, außer bei
  „Wände aus“.
- v87: Lesezimmer – die zwei Regale an der Nordwand je 0,60 m statt 0,80 m breit, damit die Flurtür frei ist.
  **Breite und Lage sind geschätzt**, genaue Maße von Robert stehen aus.
- v88: Speicherlogik – Status quo fest in `src/config/` (nur mit `python server.py` schreibbar), Designideen im
  Browser. „Fest übernehmen“ bei Möbeln, „Ins Modell übernehmen“ im Maßregister.
- v89: Designideen und Varianten werden im Artifact zwischen PC und Smartphone synchronisiert.
- v90–v92: Refactoring – Raummaße in `src/config/raeume.js`, `main.js` aufgeteilt (siehe README).

Offen:
1. Lesezimmer: genaue Maße der Regale (und ggf. des Raums) von Robert; der schmale schwarze Gegenstand direkt
   hinter der Flurtür (`og.js`, bei `LX0+2.42`) steht noch im Schwenkbereich des Türblatts – versetzen/entfernen?
2. Synchronisierung mit zwei echten Geräten ausprobieren (bisher nur mit nachgebildeter Datenbank getestet).
3. „Exportieren“ (Varianten, Maße) lädt im Artifact keine Datei herunter, weil der Viewer das blockiert; der Text
   zum Kopieren funktioniert. Lösung: Artifact-Fähigkeit `downloads` einbauen.
4. Bei „Wände aus“ bleibt ein einzelnes Wandteil sichtbar (bestand schon vor dem Refactoring, nicht untersucht).
5. `einrichten.js` (rund 600 Zeilen) ist noch nicht nach Reitern aufgeteilt.
6. Weitere Maße anbinden: Fenster, Treppen, Räume im DG, Windfang, WCs, Kellerflur sind noch feste Zahlen im Code.
   Die Räume im OG folgen den Räumen darunter.
7. Viele Maße und Positionen stammen aus Fotos (geschätzt). Korrekturen: am PC über „Fest übernehmen“ bzw. das
   Maßregister, oder anhand weiterer Fotos im Code.

Bewusste Einschränkungen der Navigation:
- Durch offene Türen zoomen geht nicht mehr; Raumwechsel per Doppelklick/Doppeltipp.
- Der Blick nach oben ist wie bisher auf etwa 18° über der Waagerechten begrenzt (`controls.maxPolarAngle`).
- Flure und Treppen ohne Eintrag in `ROOMS` (z. B. Flur im OG) sind nur gegen Wände gesichert, nicht gegen die Decke.

Arbeitsweise:
- Prüfen nach Umbauten: `python tools/pruefen.py` (braucht den laufenden `server.py`). Der Fingerabdruck muss bei
  einer reinen Umsortierung gleich bleiben; Stand v92: `Bauteile=2171 Modell=119753075 Raeume=-1893535870
  Ansichten=-1918846762 Moebel=547 Tueren=22`.
- Git: Auf Roberts Rechner ist keine Git-Identität eingerichtet. Die Commits vom 13.11. wurden einzeln mit
  `git -c user.name="Robert Lengsfeld" -c user.email="RobertTrebor@users.noreply.github.com" commit …` erstellt.
  Gearbeitet wird auf dem Branch `einrichtungsmodus-weiterarbeit` (nicht `main`).
- Artifact: zeigt v92; veröffentlicht aus VS Code mit den Fähigkeiten `db` und `user`.

## Historie
- v30–v82: Einzeldateien in `C:\Users\rober\Documents\Grundriss-Versionen`.
- ab v83: Git-Historie in diesem Repository (v85–v92 am 13.11.2026, siehe oben).
