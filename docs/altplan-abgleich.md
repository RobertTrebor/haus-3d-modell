# Abgleich: alter Bauplan (um 1940) und Maßregister

Stand: 13.11.2026. Verglichen wurden die aus dem alten Bauplan abgelesenen Maße (Artifact „Mühlstraße 46
Altplan“, https://claude.ai/artifact/W5zU8ySE4nKKfYeBZhXL9q) mit dem Maßregister (`src/masse/*.js`) und den
Modellwerten (`src/config/raeume.js`, `src/config/masse.js`).

**Am Modell und am Register wurde dabei nichts geändert.** Dieses Dokument hält nur das Ergebnis fest und
listet, was vor Ort nachzumessen ist.

Einordnung der Quellen:
- **Plan** = aus den eingescannten Plänen abgelesen. Das ist weder „gemessen“ noch „aus Fotos geschätzt“; der
  Plan zeigt die Planung von damals, nicht unbedingt den heutigen Zustand (Putz, Fliesen, Umbauten).
- **Modell** = Wert, der heute im 3D-Modell steckt.
- **Register** = Herkunft laut `src/masse/*.js` (gemessen / geschätzt / unbekannt). Räume ohne eigenen Eintrag
  gelten in der App automatisch als „unbekannt“.
- Maße von Robert haben Vorrang vor Plan und Schätzung.

## Kurzfassung

Der Plan bestätigt die meisten Raummaße im Erdgeschoss. An drei Stellen passt er nicht zu Register oder Modell:

1. **Raumhöhe EG**: Plan 2,51 m, von Robert gemessen 2,59 m. Das gemessene Maß gilt. Im Altplan-Artifact steht
   fälschlich „im Modell 2,50 – passt“; diese Zeile ist zu korrigieren.
2. **Bad und Küche**: beide 15 cm schmaler als im Plan, das Bad zusätzlich 19 cm weniger tief, die Küche 10 cm.
3. **Garage**: im Modell nach Fotos geschätzt; die Tiefe liegt 32 cm unter dem Plan.

Außerdem: Für keinen Raum im Erdgeschoss ist im Register belegt, dass er gemessen wurde. Das Altplan-Artifact
nennt die Modellwerte „gemessen“, das Register kennt die Herkunft nicht.

## Erdgeschoss

Breite (x) × Tiefe (z) in Metern. Abweichung = Modell minus Plan.

| Raum heute (Name im Plan) | Plan | Modell | Abweichung | Register |
|---|---|---|---|---|
| Wohnzimmer (Büro) | 3,89 × 3,59 | 3,90 × 3,54 | +1 / −5 cm | unbekannt („bitte bestätigen“) |
| Schlafzimmer (Wohnzimmer) | 4,39 × 3,47 | 4,39 × 3,47 | 0 / 0 | kein Eintrag |
| Esszimmer (Speisezimmer) | 4,73 × 4,25 | 4,67 × 4,30 | −6 / +5 cm | kein Eintrag |
| Flur (Diele), Breite | 2,20 | 2,20 | 0 | kein Eintrag |
| Bad | 3,23 × 1,40 | 3,08 × 1,21 | −15 / −19 cm | kein Eintrag |
| Küche | 3,23 × 3,20 | 3,08 × 3,10 | −15 / −10 cm | kein Eintrag |
| Außenwände, Dicke | 0,38 | 0,38 | 0 | gemessen (09.11.2026) |
| Lichte Raumhöhe | 2,51 | 2,59 | +8 cm | gemessen (09.11.2026) |
| Innenwände, Dicke | 0,12 und 0,25 | 0,18 (einzelne Wände 0,12 / 0,235) | – | gemessen, „ca.“, inkl. Türrahmen |
| Terrasse (Sitzplatz) | 2,00 × 4,12 | – | – | kein Eintrag |
| Außenmaß Hauptbau | 9,00 × 9,00 | – | – | kein Eintrag |

Anmerkungen:
- **Schlafzimmer und Flurbreite** sind auf den Zentimeter gleich dem Plan. Das kann eine Bestätigung sein, die
  Werte können aber auch aus dem Plan ins Modell gekommen sein. Ohne Nachmessung ist das nicht zu unterscheiden.
- **Esszimmer**: Laut Altplan-Artifact wurde die Tiefe mit 4,24–4,30 m gemessen (nicht im Register belegt); das
  Modell rechnet mit 4,30 m.
- **Bad und Küche**: Die gleiche Abweichung von 15 cm in der Breite spricht für eine dickere Wand zum Flur
  (Vorwand, Fliesen auf Putz) und gegen einen Messfehler. Das ist eine Vermutung, kein Befund.
- **Innenwände**: Der Plan kennt 12 cm (Wohnzimmer/Schlafzimmer) und 25 cm (Wohnzimmer/Flur). Das Register hat
  einen Wert für alle Innenwände (ca. 18 cm). Im Modell sind die Wand Wohnzimmer/Schlafzimmer 18 cm, die Wand
  Esszimmer/Flur 23,5 cm und die Wände am Bad 12 cm dick.
- **Terrasse**: Laut Altplan-Artifact innen 1,80 m gemessen (Brüstung); im Register steht dazu nichts.
- **Außenmaß**: Aus den Modellwerten ergibt sich rechnerisch etwa 9,23 m (Gartenseite, Ost–West) und 8,78 m
  (Ostseite, Nord–Süd). Das ist nur aus Raummaßen und Wandstärken addiert und nicht geprüft.

## Keller

Das Kellerblatt des Plans ist gedreht gezeichnet und schwer lesbar.

| Maß | Plan | Modell | Abweichung | Register |
|---|---|---|---|---|
| Garage, Breite | 2,96 | 2,90 | −6 cm | geschätzt (nach Fotos) |
| Garage, Tiefe | 4,92 | 4,60 | −32 cm | geschätzt (nach Fotos) |
| Außenwände Keller, Dicke | 0,45 | – | – | kein Eintrag |
| Außentreppe | 10 Stufen | – | – | kein Eintrag |
| „Lager“ | 3,67 × 4,25 | – | – | Zuordnung unklar |
| Mittlerer Raum (Heizung?), Breite | 2,65 | – | – | Zuordnung unklar |
| Raum am Kellergang, Breite | 3,92 | – | – | Zuordnung unklar |

Anmerkungen:
- Die drei letzten Planmaße lassen sich den heutigen Räumen (Bogenzimmer, Kellerbüro, Waschküche, Vorratsraum)
  nicht sicher zuordnen. Für die gemessenen Kellermaße (Waschküche 2,50 × 3,63, Keller-WC 0,97 × 2,00,
  Kellerbüro-Teilmaße) liefert der Plan deshalb keine Gegenprobe.
- Die Außentreppe mit 10 Stufen ist nicht die innere Kellertreppe (9 Stufen, gemessen).

## Obergeschoss

Kein Abgleich möglich. Der Plan zeigt die ursprüngliche Planung (Eltern-, Kinder-, Gastzimmer, Wendeltreppe,
Balkon), die nicht der heutigen Aufteilung entspricht, und das Register enthält keine Raummaße für das OG.

## Nachmessen – nach Priorität

Am einfachsten in der App: Einrichten → Maßband → Maßregister → „Nachmessen“ bzw. „Stimmt so“ (Ablauf in
`docs/masse.md`). Raummaße jeweils Wand zu Wand in etwa 1 m Höhe, nicht an Sockelleisten oder Fliesenkanten.

### 1. Bad und Küche (größte Abweichung zum Plan)
- Bad: Breite und Tiefe (Modell 3,08 × 1,21).
- Küche: Breite und Tiefe (Modell 3,08 × 3,10).
- Wandstärken an einer Tür ablesen: Flur/Bad, Flur/Küche, Bad/Küche, Bad/Schlafzimmer.
  Damit klärt sich, wo die 15 cm bzw. 19 cm gegenüber dem Plan geblieben sind.

### 2. Garage (bisher nur aus Fotos geschätzt)
- Breite und Tiefe innen (Modell 2,90 × 4,60; Plan 2,96 × 4,92).
- Bei der Gelegenheit: Verbindungstür Waschküche–Garage, Breite, Höhe und Abstand zur Ecke
  (offener Punkt 6 in `docs/uebergabe.md`).

### 3. Räume im Erdgeschoss bestätigen (Herkunft der Modellwerte nicht belegt)
- Wohnzimmer: Breite 3,90, Tiefe 3,54 (Plan 3,89 × 3,59).
- Schlafzimmer: Breite 4,39, Tiefe 3,47.
- Esszimmer: Breite 4,67; Tiefe an beiden Seiten des Raums messen (4,24–4,30?).
- Flur: Breite 2,20.

### 4. Innenwände einzeln
- Wohnzimmer/Schlafzimmer (Plan 12 cm, Modell 18 cm).
- Wohnzimmer/Flur (Plan 25 cm).
- Esszimmer/Flur (Modell 23,5 cm).
- Jeweils notieren, ob mit oder ohne Türrahmen gemessen.

### 5. Kontrollmaß außen
- Hauptbau außen: Länge der Gartenseite und einer Giebel- bzw. Längsseite (Plan 9,00 × 9,00).
  Ein Außenmaß zeigt, ob sich Fehler bei Räumen und Wandstärken aufsummieren.

### 6. Keller
- Dicke der Kelleraußenwand an einem Fenster oder der Außentür (Plan 45 cm).
- Bogenzimmer: Breite und Tiefe. Kellerbüro: Gesamtbreite und Tiefe. Vorratsraum: Breite und Tiefe.
  Mit diesen Maßen lassen sich „Lager“, „mittlerer Raum“ und „Raum am Kellergang“ aus dem Plan zuordnen.
- Kriechkeller: Tiefe (offener Punkt 5 in `docs/uebergabe.md`).
- Außentreppe am Keller: Stufen zählen (Plan 10).

### 7. Terrasse
- Breite und Tiefe innen zwischen Hauswand und Brüstung (Plan 2,00 × 4,12; bisher genannt 1,80 innen).

### 8. Raumhöhe (nur zur Kontrolle, niedrige Priorität)
- EG: 2,59 m ist gemessen und gilt. Falls ohnehin ein Maßband zur Hand ist: in einem zweiten Raum gegenprüfen,
  weil der Plan 2,51 m nennt.

## Offene Entscheidungen (später)

1. Planmaße als Notiz in die Registereinträge schreiben („Altplan um 1940: …“), ohne die Herkunft zu ändern?
2. Garage vorläufig auf die Planmaße 2,96 × 4,92 setzen (weiter „geschätzt“), bis nachgemessen ist?
3. Altplan-Artifact korrigieren: Zeile „Lichte Höhe EG“ (2,59 gemessen statt „im Modell 2,50“) und Spalte
   „Gemessen“ (Herkunft ist im Register nicht belegt).
4. Hat Robert die EG-Räume selbst gemessen? Dann als „gemessen“ mit Datum ins Register eintragen.
