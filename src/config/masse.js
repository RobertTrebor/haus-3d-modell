// Baumaße des Hauses (feste Größen) und fest gespeicherte Nachmessungen. Wird von server.py geschrieben
// (Einrichten → Maßband) und von basis.js gelesen. Aufbau: konst = Konstanten für das Modell (Meter bzw. Stück;
// Raummaße stehen in raeume.js),
// register = Nachmessungen zum Maßregister (IDs wie in src/masse/). Änderungen per Git committen.
window.HAUS_MASSE={
 "konst": {
  "H": 2.59,
  "T": 0.18,
  "OGH": 2.59,
  "EWT": 0.38,
  "KST": 9,
  "VBA": 4.1,
  "VBI": 3.5
 },
 "register": {}
};
