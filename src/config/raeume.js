// Räume: Maße, an denen main.js hängt (Meter). Wird von server.py geschrieben (Einrichten → Maßband →
// Maßregister → „Ins Modell übernehmen“ bei raum.<schlüssel>.breite / .tiefe) und von main.js gelesen.
// Schlüssel = Ansichtsschlüssel aus ROOMS. breite = Ausdehnung in x, tiefe = in z. x0/z0 stehen nur dort, wo der
// Raum im Modell eine eigene feste Ecke hat; sonst ergibt sich die Lage aus den Nachbarräumen und Wandstärken.
// Fehlt ein Feld, ist das Maß (noch) nicht einzeln änderbar, sondern in main.js abgeleitet.
window.HAUS_RAEUME={
 "raeume": {
  "slide": {"name": "Wohnzimmer", "etage": "EG", "breite": 3.9, "tiefe": 3.54},
  "dining": {"name": "Esszimmer", "etage": "EG", "x0": -1.95, "breite": 4.67, "tiefe": 4.3},
  "hall": {"name": "Flur", "etage": "EG", "breite": 2.2},
  "kitchen": {"name": "Küche", "etage": "EG", "breite": 3.08, "tiefe": 3.1},
  "bath": {"name": "Bad", "etage": "EG", "breite": 3.08, "tiefe": 1.21},
  "bedroom": {"name": "Schlafzimmer", "etage": "EG", "breite": 4.39, "tiefe": 3.47},
  "kroom": {"name": "Bogenzimmer", "etage": "KG", "x0": -1.65, "z0": 3.84, "tiefe": 2.96},
  "kbuero": {"name": "Kellerbüro", "etage": "KG", "x0": -1.95, "z0": 0.0, "breite": 4.2, "tiefe": 3.54},
  "kvest": {"name": "Waschküche", "etage": "KG", "x0": 2.55, "z0": 0.0, "breite": 2.5, "tiefe": 3.63},
  "garage": {"name": "Garage", "etage": "KG", "x0": 5.3, "breite": 2.9},
  "kpantry": {"name": "Vorratsraum", "etage": "KG", "x0": 6.25, "z0": 4.83, "breite": 2.16, "tiefe": 1.87}
 }
};
