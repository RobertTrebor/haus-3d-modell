# Speicherlogik: Status quo und Designideen

Stand: 13.11.2026 (v90). Es gibt zwei getrennte Ebenen.

## 1. Status quo des Hauses – fest im Projekt (`src/config/`)

Alles, was das Haus so beschreibt, wie es wirklich ist. Die Dateien liegen im Repository, Git ist die Historie.

| Datei | Inhalt | Wird geändert über |
|---|---|---|
| `src/config/masse.js` → `konst` | Baumaße, an denen `main.js` hängt (Meter bzw. Stück) | Einrichten → Maßband → Maßregister → „Ins Modell übernehmen“ |
| `src/config/masse.js` → `register` | Nachmessungen zum Maßregister (IDs wie in `src/masse/`) | Einrichten → Maßband → „Speichern“, „Nachmessen“, „Stimmt so“ |
| `src/config/raeume.js` | Raummaße (Breite, Tiefe, feste Ecken) | Einrichten → Maßband → Maßregister → „Ins Modell übernehmen“ |
| `src/config/bestand.js` → `pieces` | Korrekturen an vorhandenen Möbeln (Verschiebung `dx`/`dz`, Drehung `ry`, `hidden`) | Einrichten → Möbel → Stück wählen → „Fest übernehmen“ / „Aus Bestand entfernen“ |
| `src/config/bestand.js` → `items` | zusätzliche Möbel, die wirklich dort stehen | Einrichten → Neu/Katalog → „Fest übernehmen“ |

Schreiben geht nur am PC mit `python server.py` (http://localhost:8000). Der Server lauscht nur auf dem eigenen
Rechner und schreibt ausschließlich diese drei Dateien. Danach wie gewohnt committen und pushen.
Im Artifact und mit einem einfachen Dateiserver fehlen die Schaltflächen; dort bleiben Nachmessungen im Browser
und wandern über „Exportieren“ ins Projekt.

Bisher an `konst` angebunden: `H`, `OGH` (Raumhöhen), `T` (Innenwand), `EWT` (Außenwand), `KST` (Stufen
Kellertreppe). Ein Registereintrag kann ins Modell übernommen werden, wenn sein Feld `konst` eine dieser
Konstanten ist. Weitere Maße: Zahl im Code durch `KONST.<Name>` ersetzen, Name und Wert in `masse.js` und in
die Rückfallwerte eintragen, `konst` im Register setzen.

Raummaße stehen seit v90 in `src/config/raeume.js` (`breite` = x, `tiefe` = z, je Raumschlüssel aus `ROOMS`;
`x0`/`z0` nur, wo der Raum eine eigene feste Ecke hat). Der Code liest sie mit `rm('<raum>','<feld>',Rückfallwert)`.
Im Maßregister erscheint „Ins Modell übernehmen“ automatisch bei `raum.<schlüssel>.breite` / `.tiefe`, wenn das
Feld in `raeume.js` steht. Angebunden: Wohnzimmer, Esszimmer, Flur (Breite), Küche, Bad, Schlafzimmer,
Bogenzimmer (Tiefe), Kellerbüro, Waschküche, Garage (Breite), Vorratsraum. Die Räume im OG folgen den Räumen
darunter; DG, Windfang, WCs und Kellerflur sind noch nicht einzeln angebunden.

Achtung: Teile mit festen Koordinaten in `main.js` wandern bei einer Maßänderung nicht automatisch mit.
Die IDs der Möbel (`m<x>_<z>_<y>`) ergeben sich aus ihrer Lage in `main.js`; wird ein Möbelstück dort verschoben,
muss sein Eintrag in `bestand.js` entfernt oder umbenannt werden.

## 2. Designideen – im Browser

Wandfarben, verschobene oder neue Möbel, Türen-Design, Varianten: im `localStorage`
(`haus3d-einrichtung-v1`, `haus3d-varianten-v1`), mit Export/Import als Datei. Gespeichert werden nur
Abweichungen vom Status quo; „Zurück an Ursprung“ und „Alles zurücksetzen“ führen auf den Status quo zurück.

## 3. Synchronisierung PC ↔ Smartphone (seit v89)

Designideen (aktueller Stand und Varianten) werden im Artifact über die eingebaute Datenbank von claude.ai
abgeglichen (Artifact-Fähigkeiten `db` und `user`). Die Daten liegen privat je angemeldeter Person:

- `data/users/<id>/einrichtung` – `{t, dev, json}`: aktueller Stand, Zeitstempel der letzten Änderung, Gerät
- `data/users/<id>/varianten` – `{json}`: alle Varianten; gelöschte bleiben als Marke `{t, del}` erhalten

Regeln: Beim aktuellen Stand gewinnt der neuere Zeitstempel; Varianten werden je Name zusammengeführt (neuere
gewinnt). Geschrieben wird nur bei echter Änderung, gebündelt nach 1,5 s. `localStorage` bleibt als lokale Kopie
und Rückfall. Der Reiter „Varianten“ zeigt den Zustand der Synchronisierung an.

Voraussetzungen: nur im Artifact (nicht auf localhost oder aus der Datei), nur angemeldet, und das Artifact muss
mit `capabilities: {db: {}, user: {}}` veröffentlicht sein. Der Status quo (`src/config/`) wird nicht
synchronisiert – er ist Teil des Builds. Ablauf: Status quo am PC pflegen → bauen → Artifact aktualisieren →
Designideen im Artifact am PC oder Smartphone.
