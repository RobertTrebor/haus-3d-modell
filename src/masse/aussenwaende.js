// Außenwände, Vorbau, Fenster, Eingang (Stand 09.11.2026 aus docs/uebergabe.md; Modellwerte aus dem Modell)
window.MASSE.add('aussenwaende',[
 {id:'wand.aussen.dicke',name:'Außenwände – Dicke',raum:'alle',modell:0.38,wert:0.38,quelle:'gemessen',datum:'2026-11-09',konst:'EWT'},
 {id:'vorbau.breite',name:'Vorbau (Hauseingang) – Breite außen',raum:'Hauseingang',modell:4.10,wert:4.10,quelle:'gemessen',datum:'2026-11-09',konst:'VBA'},
 {id:'vorbau.innen.breite',name:'Vorbau (Windfang bis Garderobe) – Breite innen',raum:'Windfang',modell:3.50,wert:3.50,quelle:'gemessen',datum:'2026-11-14',konst:'VBI',notiz:'mit 4,10 außen ergeben sich 30 cm dicke Seitenwände'},
 {id:'eingang.stufen',name:'Hauseingang – Stufen',raum:'Hauseingang',wert:3,quelle:'gemessen',einheit:'Stk',datum:'2026-11-09',notiz:'Edelstahl-Handlauf links; Stufenzahl im Modell prüfen'},
 {id:'kg.buero.fenster.breite',name:'Kellerbüro – Fensterbreite (beide Fenster)',raum:'Kellerbüro',modell:1.74,wert:1.74,quelle:'gemessen',datum:'2026-11-09',kat:'fenster'},
 {id:'kg.buero.fenster.hoehe',name:'Kellerbüro – Fensterhöhe',raum:'Kellerbüro',modell:1.25,wert:1.25,quelle:'gemessen',datum:'2026-11-09',kat:'fenster'},
 {id:'kg.buero.fensterbank.tiefe',name:'Kellerbüro – Fensterbank Tiefe',raum:'Kellerbüro',modell:0.30,wert:0.30,quelle:'gemessen',datum:'2026-11-09',kat:'fenster'},
 {id:'eg.ess.fenster.dreiteilig',name:'Esszimmer – dreiteiliges Gartenfenster',raum:'Esszimmer',quelle:'geschaetzt',kat:'fenster',notiz:'nach Fotos; mit Fotos/Maßen abgleichen (uebergabe.md Punkt 5)'},
 {id:'og.wintergarten.sprossen',name:'Wintergarten – Sprossenfenster 3×3',raum:'Bastelzimmer',quelle:'geschaetzt',kat:'fenster',notiz:'nach Fotos'},
]);
