// Maßregister – Grundgerüst. Die Einträge liegen in innenwaende.js, aussenwaende.js, tueren.js, moebel.js.
// Im Einrichtungsmodus (Reiter „Maßband“) werden sie angezeigt, mit eigenen Nachmessungen ergänzt und exportiert.
//
// Eintrag: {id, name, raum,
//           modell   – Wert, der im 3D-Modell steckt (m; für Räume/Türen wird er zur Laufzeit aus dem Modell gelesen),
//           wert     – nachgemessener Wert (m), falls vorhanden,
//           quelle   – 'gemessen' | 'geschaetzt' | 'unbekannt',
//           datum    – 'JJJJ-MM-TT', notiz, einheit (Standard 'm', sonst z. B. 'Stk'),
//           konst    – Name der Konstante/Formel im Modell, die den Modellwert bestimmt (Hilfe beim Nachziehen)}
//
// IDs: Räume  raum.<ansichtsschlüssel>.breite / .tiefe  (Schlüssel aus ROOMS in navigation.js, z. B. raum.kvest.breite)
//      Türen  tuer.<tür-id>.breite / .hoehe             (Tür-ID aus dem Reiter „Türen“, z. B. tuer.d514_0_472.breite)
//      sonst frei, z. B. wand.aussen.dicke, kg.buero.balken.breite, eigen.<zeit> (aus der App)
window.MASSE={eintraege:[],add(kat,list){list.forEach(e=>{if(!e||!e.id)return;e.kat=e.kat||kat;this.eintraege.push(e);});}};
