# Speicherlogik: Status quo und Designideen

Stand: 13.11.2026 (v88). Es gibt zwei getrennte Ebenen.

## 1. Status quo des Hauses – fest im Projekt (`src/config/`)

Alles, was das Haus so beschreibt, wie es wirklich ist. Die Dateien liegen im Repository, Git ist die Historie.

| Datei | Inhalt | Wird geändert über |
|---|---|---|
| `src/config/masse.js` → `konst` | Baumaße, an denen `main.js` hängt (Meter bzw. Stück) | Einrichten → Maßband → Maßregister → „Ins Modell übernehmen“ |
| `src/config/masse.js` → `register` | Nachmessungen zum Maßregister (IDs wie in `src/masse/`) | Einrichten → Maßband → „Speichern“, „Nachmessen“, „Stimmt so“ |
| `src/config/bestand.js` → `pieces` | Korrekturen an vorhandenen Möbeln (Verschiebung `dx`/`dz`, Drehung `ry`, `hidden`) | Einrichten → Möbel → Stück wählen → „Fest übernehmen“ / „Aus Bestand entfernen“ |
| `src/config/bestand.js` → `items` | zusätzliche Möbel, die wirklich dort stehen | Einrichten → Neu/Katalog → „Fest übernehmen“ |

Schreiben geht nur am PC mit `python server.py` (http://localhost:8000). Der Server lauscht nur auf dem eigenen
Rechner und schreibt ausschließlich diese beiden Dateien. Danach wie gewohnt committen und pushen.
Im Artifact und mit einem einfachen Dateiserver fehlen die Schaltflächen; dort bleiben Nachmessungen im Browser
und wandern über „Exportieren“ ins Projekt.

Bisher an `konst` angebunden: `W`, `D` (Wohnzimmer), `H`, `OGH` (Raumhöhen), `T` (Innenwand), `EWT` (Außenwand),
`KST` (Stufen Kellertreppe), `VX0`, `VX1`, `VZ0`, `WKZ1` (Waschküche), `gx0`, `gx1` (Garage). Ein Registereintrag
kann ins Modell übernommen werden, wenn sein Feld `konst` eine dieser Konstanten oder eine Differenz davon ist
(z. B. `VX1-VX0`). Weitere Maße: Zahl in `main.js` durch `KONST.<Name>` ersetzen, Name und Wert in `masse.js`
und in die Rückfallwerte in `main.js` eintragen, `konst` im Register setzen.

Achtung: Teile mit festen Koordinaten in `main.js` wandern bei einer Maßänderung nicht automatisch mit.
Die IDs der Möbel (`m<x>_<z>_<y>`) ergeben sich aus ihrer Lage in `main.js`; wird ein Möbelstück dort verschoben,
muss sein Eintrag in `bestand.js` entfernt oder umbenannt werden.

## 2. Designideen – im Browser

Wandfarben, verschobene oder neue Möbel, Türen-Design, Varianten: wie bisher im `localStorage`
(`haus3d-einrichtung-v1`, `haus3d-varianten-v1`), mit Export/Import als Datei. Gespeichert werden nur
Abweichungen vom Status quo; „Zurück an Ursprung“ und „Alles zurücksetzen“ führen auf den Status quo zurück.

## 3. Synchronisierung PC ↔ Smartphone (geprüft, noch nicht umgesetzt)

Das Artifact kann eine eingebaute Datenbank nutzen (Artifact-Fähigkeit `db`, zusammen mit `user`): Daten liegen
bei claude.ai, pro angemeldeter Person privat unter `data/users/<id>/`, und sind auf jedem Gerät gleich, auf dem
das Artifact geöffnet wird. Damit lassen sich Designideen und Varianten zwischen PC und Smartphone abgleichen.
Einschränkungen: nur im Artifact (nicht auf localhost), nur angemeldet, und das Artifact muss mit dieser Fähigkeit
veröffentlicht werden. Geplanter Ablauf: Status quo am PC pflegen → bauen → Artifact aktualisieren → Designideen
im Artifact (PC oder Smartphone), gespeichert in der Artifact-Datenbank, mit `localStorage` als Rückfall.
