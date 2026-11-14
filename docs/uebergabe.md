# Übergabe 3D-Modell Haus Mühlstr. 46

Stand: 14.11.2026 (v108, Branch `laufmodus`; `main` steht auf v104). Repository am 09.11.2026 angelegt aus v82 (`v82_Performance.html`).

## Wichtige Maße (von Robert)
- Raumhöhe EG und OG 2,59 m; Kellerräume 2,20 m; Bogen-Scheitel 1,81 m.
- Kellertreppe 9 Stufen à 19 cm, oberste etwas niedriger.
- Vorbau außen 4,10 m breit, innen 3,50 m (14.11.2026); Außenwände 38 cm; Innenwände ca. 18 cm (inkl. Türrahmen).
- Waschküche 2,50 × 3,63 m; Keller-WC 0,97 × 2,00 m (Ausrichtung im Modell seit v106: längs Nord–Süd, geschätzt).
- Kellerbüro: von der Terrassenfensterwand 1,50 m bis Balken (38,5 cm breit, 15 cm tief), dann ca. 2,30 m
  bis zur Waschküchenwand; 3 + 6 Spots; beide Fenster 1,74 × 1,25 m, Fensterbank 30 cm,
  gelb-orange Vertikallamellen.
- Hauseingang: 3 Stufen, Edelstahl-Handlauf links.

## Kellerräume (Namen)
Bogenzimmer, Kellerbüro, Waschküche (früher „Vorraum mit Außentür“), Vorratsraum (mit Fenster zur
Einfahrt), Keller-WC (unter dem EG, im Modell längs unter der Treppe zum Hauseingang), Kriechkeller (laut Robert
vermutlich unter dem Windfang, daher die niedrige Decke), Wandschrank am Fuß der Kellertreppe, Garage
(Sektionaltor per Klick).

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
8. Außenansicht vorne links: Zwischen Haus und Vorgarten fehlt der Boden (man sieht von schräg oben Himmelsfarbe,
   der Sockel des Vorbaus wirkt schwebend). Klären, wie es dort wirklich aussieht (Rasen, Weg, tiefer liegende Fläche?).
4. Bei „Wände aus“ bleibt ein einzelnes Wandteil sichtbar (bestand schon vor dem Refactoring, nicht untersucht).
5. `einrichten.js` (rund 600 Zeilen) ist noch nicht nach Reitern aufgeteilt.
6. Weitere Maße anbinden: Fenster, Treppen, Räume im DG, Windfang, WCs, Kellerflur sind noch feste Zahlen im Code.
   Die Räume im OG folgen den Räumen darunter.
7. Viele Maße und Positionen stammen aus Fotos (geschätzt). Korrekturen: am PC über „Fest übernehmen“ bzw. das
   Maßregister, oder anhand weiterer Fotos im Code.

9. Alter Bauplan (um 1940): Abgleich mit dem Maßregister und nach Priorität sortierte Liste zum Nachmessen in
   `docs/altplan-abgleich.md` (13.11.2026). Am Modell wurde dafür nichts geändert; Entscheidungen stehen aus.

Außenansichten (v94/v95): Der Keller-Rohbau (Wände, Böden, Decken) hängt in der Gruppe `gCelF` und bleibt in
Außenansichten sichtbar; nur die Kellereinrichtung (`gCel`) wird dort ausgeblendet. Die Außenansicht endet nicht
mehr beim Blick von oben, sondern über eine andere Ansicht oder die Etagenknöpfe EG/OG/DG.

Performance (v100–v103, siehe `docs/plan-performance.md`): Messanzeige (`?debug` oder dreimal auf den Titel klicken),
Zeichnen nur bei Bedarf, Schalter „Leistung“ (Auto/Hoch/Niedrig), Inneneinrichtung in Außenansichten erst nahe am Haus.

Laufmodus (v104/v105, `src/laufen.js`, Branch `laufmodus`): Knopf „Laufen“ in der Leiste. Am PC W/A/S/D oder
Pfeiltasten, Maus zum Umsehen (Klick ins Bild fängt die Maus, Esc gibt sie frei, zweites Esc beendet), Umschalt =
schneller; am Handy Steuerkreis links unten und Wischen. Start am aktuellen Standpunkt, wenn die Kamera in einem Raum
oder knapp über dem Boden steht, sonst auf dem Gehweg vor dem Haus. Wände, geschlossene Türen, Möbel und Zäune halten
auf; Deko und dünne Rohre/Stangen nicht. Im Laufmodus gilt die Außenansicht (Fassade, Dach, Garten sichtbar).
- v105 (Schritt 2): Alle fünf Treppen aus `FLIGHTS` gehen hinauf und hinunter, ebenso die Stufen vor der Haustür; die
  nächste Etage erscheint schon auf der Treppe; unter niedrigen Decken senkt sich die Augenhöhe. Geprüft mit
  `python tools/pruefen.py laufen` (geht jede Treppe in beide Richtungen ab).
- Türen müssen wie sonst per Klick geöffnet werden (Gartentor, Haustür, Tür zur Kellertreppe).
- Seit v106 ist die Figur wieder ohne Sonderregel an der Eingangstreppe unterwegs (der Keller überdeckt sie nicht mehr).
- Im Artifact lässt sich die Maus vermutlich nicht fangen (der Viewer erlaubt das nicht); dort mit gedrückter Maustaste
  umsehen. Lokal über `server.py` geht beides. Auf einem echten Handy noch nicht ausprobiert.
- Offen: fehlender Boden vorne links (Punkt 8 oben) – dort bleibt man auf der letzten Höhe stehen.
- Der Fingerabdruck hat sich mit v105 geändert, weil vier Füllplatten der Außenhülle (`fuell(...)` in `aussen.js`,
  Geschossdecken ohne Treppenloch) nicht mehr zusammengefasst werden; sie werden im Laufmodus im Haus ausgeblendet.

Umbau Keller-WC, Kriechkeller und Kellertür (v106, 14.11.2026, nach Angaben von Robert; Lage und Ausrichtung geschätzt):
- Vorher überdeckten Kellerdecke und Kellerwände die Treppe zum Hauseingang (in der Ansicht „Treppe zum Hauseingang“
  war statt der Stufen eine weiße Fläche zu sehen). Das Keller-WC lag quer (Ost–West) neben der Treppe, der Kriechkeller
  östlich davon unter der Küche.
- Jetzt: Das Keller-WC (0,97 × 2,00 m, gemessen) liegt längs unter der Treppe zum Hauseingang; Tür im Norden zum
  Kellerflur, Decke fällt unter der Treppe von 2,20 m auf etwa 1,37 m. In der Südwand führt die niedrige Öffnung in den
  Kriechkeller unter dem Windfang (Höhe 1,45 m, Ausdehnung Windfang bis Garderobe, geschätzt). Der alte Platz ist Erdreich.
  Code: `keller.js` (Gruppe `gW`, um 90° gedreht eingesetzt: `WTX`, `WTZ`, `WSX`, `WTOP`) und `eingang.js`.
- Die Stufen der Eingangstreppe sind unten nur noch 18 cm dick statt bis −0,8 m massiv.
- Kellertür im Windfang: Der Wandvorsprung links endet jetzt am Türrahmen (verdeckte vorher 30 cm der Tür), die zwei
  Heizungsrohre stehen in der Ecke daneben statt vor der Türmitte. **Der Windfang wurde nicht verbreitert:** Der Vorbau
  ist außen 4,10 m breit (gemessen), mit 38 cm Außenwänden ergibt das innen 3,34 m; die Tür (76 cm) liegt darin frei.
  (Überholt durch v107: innen 3,50 m gemessen.)
- Offen: Stimmt die Tür des Keller-WCs im Norden (zum Kellerflur)? Wie weit reicht der Kriechkeller? Der Kellerflur ist
  durch das gedrehte WC im Süden schmaler geworden (Nische östlich der WC-Tür).
- Noch im Modell: `vorbau.js` Zeile 53 enthält einen Quader mit vertauschter Höhe (`B(CX0,CL1,2.22,LY-0.03,…)`), der nach
  innen gestülpt über dem Treppenpodest liegt (insgesamt 25 solche Quader, die übrigen winzig). Der Laufmodus ignoriert sie.

Korrekturen von Robert vom 14.11.2026 (v107, mit Foto vom Windfang):
- **Vorbau innen 3,50 m breit (gemessen).** Mit 4,10 m außen (gemessen) sind die Seitenwände des Vorbaus 30 cm dick statt
  38 cm. Neu in `KONST`/`src/config/masse.js`: `VBA` (außen) und `VBI` (innen); `VWT` ist die Wanddicke daraus.
- Windfang aufgeräumt (zwei Jacken, Schuhe unter dem Regal; Rucksack, Hocker und Eimer entfernt). Das Fenster ist frei
  und lässt sich öffnen (Klick auf den Griff). Wandvorsprung und Heizungsrohre in der Ecke wie auf dem Foto.
- Tür zur Kellertreppe: Bänder links, öffnet in den Windfang zum Fenster hin.
- Keller: Vom Treppenfuß gibt es jetzt einen Durchgang nach Osten (vorher war dort eine Wand; der Flur war nur über die
  Waschküche erreichbar). Der Wandschrank mit den braunen Türen steht schräg (Winkel und Lage geschätzt), die Türen sind
  anfangs zu und schließen jetzt ohne Lücke. Die WC-Tür ist anfangs zu. Die Schuhkartons im Flur sind weggeräumt.
  Damit stimmt Roberts Beschreibung: links Bogenzimmer, am Schrank vorbei, umdrehen – links Vorratsraum, geradeaus WC,
  dahinter der Kriechkeller. Die Lage von WC und Kriechkeller aus v106 ist damit bestätigt.
- Waschküche: (überholt durch v108, siehe Abgleich mit den Fotos unten) Heizung an die Westwand verlegt.
- Gartentor und Einfahrtstor lassen sich per Klick öffnen (auch in der Ansicht von der Straße).
- Offen: Foto vom Treppenfuß im Keller (Winkel des Wandschranks, Breite des Durchgangs) und von der Heizung.

Fotos (seit 14.11.2026): Robert legt Fotos nach Räumen sortiert in `fotos\` ab. Verwendet werden nur Dateien, deren Name
nicht mit `PXL` beginnt (Robert benennt um, was dran ist). `tools\fotos_verkleinern.ps1` legt davon verkleinerte Kopien
in `fotos-klein\` an (1600 px); nur diese ansehen, und immer nur die des Raums, an dem gearbeitet wird. Beide Ordner
sind von Git ausgenommen. Bisher angesehen: `keller-flur`, `keller-wc-kriechkeller`, `vorratsraum`, `waschküche`.

Abgleich Keller mit den Fotos (v108, 14.11.2026; alle Lagen nach Foto geschätzt):
- Waschküche: Die Heizung hängt an der Südwand (hinter dem Eckschrank), aber in der Ecke zur Westwand; im Modell saß sie
  direkt neben der Tür zum Flur. Die Verlegung an die Westwand aus v107 war falsch und ist zurückgenommen. Ausdehnungsgefäß
  links vom Gerät, Speicher davor, Regal an der Westwand neben der Ecke.
- Eckschrank: steht stärker schräg (0,4 rad), sein rechtes Ende reicht bis zum Türrahmen der Waschküche.
- Flur vor dem WC: nur etwa 1,3 m breit. Der Vorratsraum öffnet sich ohne Tür in der linken Wand direkt vor der WC-Wand.
  Dafür ist die Westwand des Vorratsraums von x = 6,25 auf 5,50 gerückt (`raeume.js`, Breite 2,91 statt 2,16).
  **Die 2,16 m waren nicht als gemessen belegt – bitte Breite des Vorratsraums und des Flurs nachmessen.**
- Keller-WC: Lage unter der Treppe durch das Foto bestätigt (Fliesen und Waschbecken links, schräge Decke, Öffnung zum
  Kriechkeller hinten rechts). Öffnung nach rechts gerückt.
- Kriechkeller: Ziegelpfeiler rechts (Westen), Eimer links (Osten) wie auf den Fotos.
- Offen: Die Tür zum Bogenzimmer liegt im Modell direkt links neben dem Eckschrank (frei bleiben rund 55 cm); auf dem Foto
  ist links vom Schrank ein Stück Wand. Foto vom Treppenfuß mit Blick zum Bogenzimmer wäre hilfreich.

Bewusste Einschränkungen der Navigation:
- Durch offene Türen zoomen geht nicht mehr; Raumwechsel per Doppelklick/Doppeltipp.
- Der Blick nach oben ist wie bisher auf etwa 18° über der Waagerechten begrenzt (`controls.maxPolarAngle`).
- Flure und Treppen ohne Eintrag in `ROOMS` (z. B. Flur im OG) sind nur gegen Wände gesichert, nicht gegen die Decke.

Arbeitsweise:
- Prüfen nach Umbauten: `python tools/pruefen.py` (braucht den laufenden `server.py`). Der Fingerabdruck muss bei
  einer reinen Umsortierung gleich bleiben; Stand v108: `Bauteile=2277 Modell=1239366489 Raeume=-1275046457 Ansichten=-1418392598 Moebel=537 Tueren=22`
  (v105 änderte ihn durch die einzeln geführten Füllplatten, v106 und v107 durch die Umbauten in Keller und Windfang).
- Git: Auf Roberts Rechner ist keine Git-Identität eingerichtet. Die Commits vom 13.11. wurden einzeln mit
  `git -c user.name="Robert Lengsfeld" -c user.email="RobertTrebor@users.noreply.github.com" commit …` erstellt.
  Seit dem 13.11.2026 (v103) ist `main` der aktuelle Stand und der Arbeitsbranch; `einrichtungsmodus-weiterarbeit`
  wurde nach `main` übernommen und wird nicht mehr gebraucht.
- Nicht im Claude-Chat direkt am Artifact ändern lassen: Das Artifact wird aus dem Repository gebaut, solche
  Änderungen gingen beim nächsten Build verloren. Unterwegs: Claude Code mit Anbindung an dieses Repository, oder
  Fotos und Wünsche sammeln und am PC umsetzen.
- Artifact: zeigt den jeweils letzten Build; veröffentlicht aus VS Code mit den Fähigkeiten `db` und `user`.

## Historie
- v30–v82: Einzeldateien in `C:\Users\rober\Documents\Grundriss-Versionen`.
- ab v83: Git-Historie in diesem Repository (v85–v92 am 13.11.2026, siehe oben).
