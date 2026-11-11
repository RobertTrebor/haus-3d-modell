# Maßregister: gemessen oder geschätzt?

Stand: 11.11.2026 (v84). Ziel: Für jedes Maß im Modell soll erkennbar sein, ob es **gemessen** (von Robert
vor Ort), **geschätzt** (aus Fotos) oder **unbekannt** (Herkunft nicht dokumentiert) ist – und Robert soll
nachgemessene Werte direkt in der App erfassen können, damit das Modell Schritt für Schritt stimmt.

## Wo die Maße liegen

| Datei | Inhalt |
|---|---|
| `src/masse/masse.js` | Grundgerüst (`window.MASSE`), Beschreibung des Eintragsformats |
| `src/masse/innenwaende.js` | Innenwände, Raumhöhen, Räume, Treppen |
| `src/masse/aussenwaende.js` | Außenwände, Vorbau, Fenster, Eingang |
| `src/masse/tueren.js` | Türen (nur Einträge mit bekannter Herkunft; alle Türen erscheinen automatisch) |
| `src/masse/moebel.js` | Möbel |

Ein Eintrag sieht so aus:

```js
{id:'raum.kvest.breite', raum:'Waschküche', wert:2.50, quelle:'gemessen', datum:'2026-11-09', konst:'VX1-VX0'}
```

- `modell` ist der Wert, der im 3D-Modell steckt. Für Räume (`raum.<schlüssel>.breite/.tiefe`) und Türen
  (`tuer.<tür-id>.breite/.hoehe`) liest die App ihn zur Laufzeit aus dem Modell, er muss nicht eingetragen werden.
- `wert` ist der nachgemessene Wert, `quelle` die Herkunft, `konst` ein Hinweis, welche Konstante in `main.js`
  den Modellwert bestimmt (hilft beim Nachziehen des Codes).
- `einheit` ist `m`, wenn nichts angegeben ist; Zählwerte bekommen z. B. `einheit:'Stk'`.

## Ablauf für Robert (in der App)

1. **Einrichten → Maßband**: zwei Punkte antippen. Unter der Messung erscheint „Als Maß speichern“.
2. Kategorie wählen (Innenwände, Außenwände, Türen, Fenster, Möbel …), Bezeichnung eintragen, bei
   „Vor Ort gemessen“ den **wirklich gemessenen** Wert in cm eingeben (vorbelegt ist der Modellwert), speichern.
3. Im **Maßregister** darunter stehen alle Maße mit Abzeichen Gemessen / Geschätzt / Unbekannt, Modellwert,
   gemessenem Wert und Abweichung. Dort geht auch:
   - **Nachmessen**: zu einem vorhandenen Eintrag (z. B. „Flur – Breite (x)“) den gemessenen Wert eintragen.
   - **Stimmt so**: der Modellwert ist richtig → wird als gemessen übernommen.
   - **Zeigen**: eine selbst gespeicherte Strecke wieder einzeichnen und hinspringen.
4. **Exportieren** lädt `masse-nachgemessen.json` herunter (oder zeigt den Text zum Kopieren). Die Datei
   enthält nur die eigenen Nachmessungen und bleibt zusätzlich im Browser (`haus3d-masse-v1`), auch getrennt
   von den Einrichtungsvarianten. Mit **Importieren** kommt sie auf ein anderes Gerät.

## Ablauf für den Agenten (nach einem Export)

1. Die Einträge aus `masse-nachgemessen.json` in die passende Datei unter `src/masse/` übernehmen
   (`quelle:'gemessen'`, `datum`, `notiz`). Eigene IDs (`eigen.…`) dabei in sprechende IDs umbenennen.
2. Weicht `wert` vom `modell` ab: die zugehörige Konstante in `main.js` (siehe `konst`) anpassen und prüfen, was
   davon abhängt (Möbelpositionen sind absolute Koordinaten). Anschließend `modell` im Eintrag angleichen.
3. `docs/uebergabe.md` ergänzen, falls es ein grundsätzlich neues Maß ist. Build, Commit, Push.

## Noch nicht umgesetzt

- Die Modellgeometrie liest die Werte nicht automatisch aus dem Register; die Konstanten in `main.js`
  müssen weiterhin von Hand nachgezogen werden (bewusst, damit ein Tippfehler nicht das Modell zerlegt).
- Die „Maße“-Beschriftungen im 3D-Bild sind noch nicht nach Herkunft eingefärbt.
