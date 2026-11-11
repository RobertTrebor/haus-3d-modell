// Möbelkatalog: Quellen und Artikel. Der Einrichtungsmodus (einrichten.js) liest window.KATALOG.
//
// Eine Quelle ist {id, name, laden:()=>Promise<Artikel[]>}. Heute gibt es nur den Fantasiekatalog
// (erfundene Marken und Preise). Später kann eine Online-Quelle dazukommen, z. B.:
//
//   window.KATALOG.quellen.push({id:'shop', name:'Beispiel-Shop',
//     laden:()=>fetch('https://…/artikel.json').then(r=>r.json()).then(list=>list.map(a=>({
//       id:'shop-'+a.sku, name:a.title, marke:a.brand, kat:'Sofas', preis:a.price,
//       b:a.width_cm, t:a.depth_cm, h:a.height_cm, farben:[[a.hex,a.colorName]], form:'sofa', url:a.url})))});
//
// Artikel: {id, name, marke, kat (Kategorie), preis (EUR), b/t/h (cm), farben [[hex, Name], …],
//          form (Bauform aus einrichten.js: sofa, ecksofa, sessel, hocker, bank, bett, tisch, rundtisch,
//          couchtisch, schreibtisch, stuhl, regal, schrank, kommode, tv, teppich, pflanze, stehlampe),
//          material (Text), text (kurze Beschreibung), url (optional)}
(function(){
'use strict';
const F=[];
let n=0;
const add=(kat,marke,name,form,b,t,h,preis,farben,material,text)=>F.push({id:'f'+(++n),kat,marke,name,form,b,t,h,preis,farben,material,text,url:null});

// ---- Sitzen ----
add('Sofas','Nordlicht','Sofa „Fjella“ 3-Sitzer','sofa',228,96,84,1290,[['#8C9BA5','Nebelgrau'],['#6B7F6A','Salbei'],['#C8B59A','Sand'],['#3C3F49','Nachtblau']],'Stoff (Flachgewebe), Buchenfüße','Weiche Sitzkissen, lose Rückenkissen, abnehmbare Bezüge.');
add('Sofas','Nordlicht','Sofa „Fjella“ 2-Sitzer','sofa',178,96,84,990,[['#8C9BA5','Nebelgrau'],['#6B7F6A','Salbei'],['#C8B59A','Sand']],'Stoff (Flachgewebe), Buchenfüße','Kleiner Bruder der Fjella für Lesezimmer oder Au-pair-Zimmer.');
add('Sofas','Nordlicht','Ecksofa „Fjella“ mit Récamiere','ecksofa',262,168,84,1890,[['#8C9BA5','Nebelgrau'],['#6B7F6A','Salbei'],['#B8524A','Ziegel']],'Stoff, Buchenfüße','Récamiere rechts; die lange Seite ist 262 cm, die kurze 168 cm.');
add('Sofas','Casa Lumen','Schlafsofa „Siesta“','sofa',196,92,88,1150,[['#A67B5B','Cognac'],['#55606B','Schiefer'],['#D9D2C5','Leinen']],'Kunstleder/Stoff, Metallfüße','Ausklappbar zur Liegefläche 140 × 196 cm (Liegeposition nicht im Modell).');
add('Sofas','Werkbank Nr. 7','Chesterfield „Lord Oak“','sofa',210,95,78,2450,[['#5E3A2A','Tabak'],['#2E4A3A','Flaschengrün'],['#1F1F22','Schwarz']],'Echtleder, Eiche massiv','Klassischer Knopfbezug, niedrige Rückenlehne.');
add('Sessel','Nordlicht','Sessel „Fjella“','sessel',92,96,84,590,[['#8C9BA5','Nebelgrau'],['#6B7F6A','Salbei'],['#C8B59A','Sand']],'Stoff, Buchenfüße','Passend zur Sofaserie.');
add('Sessel','Casa Lumen','Ohrensessel „Großvater“','sessel',84,90,108,790,[['#9A4A3A','Rost'],['#3A4A5C','Petrol'],['#C9C1B0','Kiesel']],'Samt, Buche gebeizt','Hoher Rücken, ideal neben dem Kamin oder im Lesezimmer.');
add('Sessel','Kaprun & Söhne','Loungesessel „Alm“','sessel',78,82,72,640,[['#D2B48C','Natur'],['#7A6A55','Taupe']],'Leinen, Eiche geölt','Niedrige Sitzhöhe 38 cm, breite Armlehnen.');
add('Sessel','Werkbank Nr. 7','Schwingsessel „Pendel“','sessel',66,80,96,520,[['#2B2B2B','Schwarz'],['#C8A060','Honig']],'Leder, Stahlrohr','Freischwinger mit Lederbespannung.');
add('Hocker & Bänke','Kaprun & Söhne','Hocker „Alm“','hocker',60,45,42,220,[['#D2B48C','Natur'],['#7A6A55','Taupe']],'Leinen, Eiche geölt','Passt vor den Loungesessel.');
add('Hocker & Bänke','Kaprun & Söhne','Sitzbank „Hüttenzauber“','bank',160,38,46,340,[['#C8A060','Fichte geölt'],['#8A6A4A','Nussbaum']],'Massivholz','Schlichte Bank für Flur oder Esstisch.');
add('Hocker & Bänke','Casa Lumen','Polsterbank „Boulevard“','bank',120,42,48,410,[['#55606B','Schiefer'],['#D9D2C5','Leinen'],['#9A4A3A','Rost']],'Samt, Metallgestell','Gepolsterte Bank fürs Schlafzimmer oder den Windfang.');

// ---- Schlafen ----
add('Betten','Traumwerk','Bett „Birke“ 140 × 200','bett',148,208,90,690,[['#E5D5B8','Birke'],['#F4F1EA','Weiß']],'Birke massiv','Kopfteil 90 cm, Lattenrost inklusive (Matratze nicht im Preis).');
add('Betten','Traumwerk','Bett „Birke“ 160 × 200','bett',168,208,90,790,[['#E5D5B8','Birke'],['#F4F1EA','Weiß']],'Birke massiv','Wie 140 cm, nur breiter.');
add('Betten','Traumwerk','Bett „Birke“ 180 × 200','bett',188,208,90,890,[['#E5D5B8','Birke'],['#F4F1EA','Weiß']],'Birke massiv','Doppelbett in Komfortbreite.');
add('Betten','Casa Lumen','Polsterbett „Wolke“ 160 × 200','bett',176,222,110,1290,[['#8C9BA5','Nebelgrau'],['#D9D2C5','Leinen'],['#3A4A5C','Petrol']],'Stoff, Holzrahmen','Hohes gepolstertes Kopfteil, Bettkasten.');
add('Betten','Traumwerk','Kinderbett „Kuschel“ 90 × 200','bett',96,206,70,390,[['#F4F1EA','Weiß'],['#E5D5B8','Birke'],['#B9C9B0','Mint']],'Kiefer lackiert','Mit Absturzschutz (nicht im Modell).');
add('Betten','Traumwerk','Tagesbett „Veranda“ 90 × 200','bett',98,204,80,540,[['#F4F1EA','Weiß'],['#3C3F49','Nachtblau']],'Metall','Sofa am Tag, Bett in der Nacht.');

// ---- Tische ----
add('Tische','Werkbank Nr. 7','Esstisch „Tafel“ 180','tisch',180,90,76,1190,[['#A8835B','Eiche natur'],['#6B4E35','Eiche geräuchert'],['#F4F1EA','Weiß lackiert']],'Eiche massiv','Für 6 Personen, ausziehbar auf 230 cm (Auszug nicht im Modell).');
add('Tische','Werkbank Nr. 7','Esstisch „Tafel“ 220','tisch',220,100,76,1490,[['#A8835B','Eiche natur'],['#6B4E35','Eiche geräuchert']],'Eiche massiv','Für 8 Personen.');
add('Tische','Werkbank Nr. 7','Rundtisch „Scheibe“ Ø 120','rundtisch',120,120,75,980,[['#A8835B','Eiche natur'],['#F4F1EA','Weiß']],'Eiche furniert, Mittelfuß','Platz für 4–5 Personen, gut in Ecken.');
add('Tische','Casa Lumen','Couchtisch „Insel“','couchtisch',110,60,42,290,[['#3E3B38','Schwarz'],['#A8835B','Eiche'],['#CFCBC4','Beton']],'Holzwerkstoff','Flacher Tisch fürs Sofa.');
add('Tische','Casa Lumen','Beistelltisch „Tablett“ Ø 45','rundtisch',45,45,52,120,[['#3E3B38','Schwarz'],['#C8A060','Messing']],'Metall','Klein, leicht, überall einsetzbar.');
add('Tische','Büroform','Schreibtisch „Fokus“ 140','schreibtisch',140,70,74,420,[['#F4F1EA','Weiß'],['#D8CBB5','Ahorn'],['#3E3B38','Anthrazit']],'Holzwerkstoff, Stahlgestell','Mit Kabelkanal.');
add('Tische','Büroform','Schreibtisch „Fokus“ 160 höhenverstellbar','schreibtisch',160,80,74,890,[['#F4F1EA','Weiß'],['#D8CBB5','Ahorn']],'Holzwerkstoff, Motorgestell','Höhe 65–125 cm (im Modell 74 cm).');
add('Tische','Kinderland','Kinderschreibtisch „Schlau“','schreibtisch',110,60,66,260,[['#F4F1EA','Weiß'],['#B9C9B0','Mint'],['#E8D0C2','Altrosa']],'Kiefer lackiert','Mitwachsend, 54–76 cm.');
add('Stühle','Werkbank Nr. 7','Stuhl „Tafel“','stuhl',46,52,86,190,[['#A8835B','Eiche natur'],['#3E3B38','Schwarz']],'Eiche massiv','Zum Esstisch Tafel.');
add('Stühle','Casa Lumen','Polsterstuhl „Boulevard“','stuhl',50,58,88,230,[['#55606B','Schiefer'],['#9A4A3A','Rost'],['#D9D2C5','Leinen']],'Samt, Metallgestell','Mit Armlehnen.');
add('Stühle','Büroform','Bürostuhl „Rücken“','stuhl',62,62,112,350,[['#2B2B2B','Schwarz'],['#8C9BA5','Grau']],'Netzrücken, Kunststoff','Drehstuhl mit Rollen.');

// ---- Aufbewahren ----
add('Regale','Stapelbar','Regal „Kiste“ 2 × 4','regal',77,39,147,180,[['#F4F1EA','Weiß'],['#E5D5B8','Birke'],['#3E3B38','Schwarz']],'Holzwerkstoff','Würfelregal, 8 Fächer.');
add('Regale','Stapelbar','Regal „Kiste“ 4 × 4','regal',147,39,147,290,[['#F4F1EA','Weiß'],['#E5D5B8','Birke'],['#3E3B38','Schwarz']],'Holzwerkstoff','16 Fächer, auch als Raumteiler.');
add('Regale','Stapelbar','Bücherregal „Bibliothek“ 80','regal',80,28,202,240,[['#F4F1EA','Weiß'],['#6B4E35','Eiche dunkel']],'Holzwerkstoff','6 Böden, fürs Lesezimmer.');
add('Regale','Stapelbar','Bücherregal „Bibliothek“ 120','regal',120,28,202,320,[['#F4F1EA','Weiß'],['#6B4E35','Eiche dunkel']],'Holzwerkstoff','Breite Variante.');
add('Regale','Werkbank Nr. 7','Wandregal „Brett“ 120','regal',120,25,40,140,[['#A8835B','Eiche natur']],'Eiche massiv','Offenes Regal mit 1 Boden (frei stellbar).');
add('Schränke','Stapelbar','Kleiderschrank „Alltag“ 100','schrank',100,58,201,390,[['#F4F1EA','Weiß'],['#E5D5B8','Birke']],'Holzwerkstoff','2 Türen, 1 Kleiderstange.');
add('Schränke','Stapelbar','Kleiderschrank „Alltag“ 150','schrank',150,58,201,540,[['#F4F1EA','Weiß'],['#E5D5B8','Birke']],'Holzwerkstoff','3 Türen.');
add('Schränke','Stapelbar','Kleiderschrank „Alltag“ 200','schrank',200,58,236,790,[['#F4F1EA','Weiß'],['#8C9BA5','Grau']],'Holzwerkstoff','4 Türen, deckenhoch.');
add('Schränke','Casa Lumen','Vitrine „Salon“','schrank',80,40,180,620,[['#2E4A3A','Flaschengrün'],['#3C3F49','Nachtblau'],['#F4F1EA','Weiß']],'Holz lackiert, Glas','Glastüren oben (im Modell geschlossen).');
add('Schränke','Kinderland','Kinderkleiderschrank „Zwerg“','schrank',90,52,160,310,[['#F4F1EA','Weiß'],['#B9C9B0','Mint'],['#E8D0C2','Altrosa']],'Kiefer lackiert','Niedrig, Kinder kommen selbst heran.');
add('Kommoden','Casa Lumen','Sideboard „Salon“ 160','kommode',160,42,78,690,[['#2E4A3A','Flaschengrün'],['#3C3F49','Nachtblau'],['#A8835B','Eiche']],'Holz lackiert','3 Türen, fürs Esszimmer.');
add('Kommoden','Stapelbar','Kommode „Alltag“ 80','kommode',80,45,95,230,[['#F4F1EA','Weiß'],['#E5D5B8','Birke']],'Holzwerkstoff','4 Schubladen.');
add('Kommoden','Stapelbar','Kommode „Alltag“ 120','kommode',120,45,78,290,[['#F4F1EA','Weiß'],['#E5D5B8','Birke'],['#8C9BA5','Grau']],'Holzwerkstoff','6 Schubladen.');
add('Kommoden','Kinderland','Wickelkommode „Zwerg“','kommode',90,75,96,360,[['#F4F1EA','Weiß'],['#B9C9B0','Mint']],'Kiefer lackiert','Später als normale Kommode nutzbar.');
add('TV & Medien','Casa Lumen','TV-Board „Leinwand“ 180','tv',180,40,48,420,[['#3E3B38','Schwarz'],['#A8835B','Eiche'],['#F4F1EA','Weiß']],'Holzwerkstoff','Für Fernseher bis 75 Zoll.');
add('TV & Medien','Casa Lumen','TV-Board „Leinwand“ 140','tv',140,40,48,350,[['#3E3B38','Schwarz'],['#A8835B','Eiche']],'Holzwerkstoff','Kompakte Variante.');

// ---- Textil, Licht, Grün ----
add('Teppiche','Webkante','Teppich „Dünengras“ 160 × 230','teppich',160,230,1,260,[['#C9B79C','Natur'],['#8C9BA5','Grau'],['#6B7F6A','Salbei']],'Wolle/Jute','Flach gewebt, robust.');
add('Teppiche','Webkante','Teppich „Dünengras“ 200 × 300','teppich',200,300,1,390,[['#C9B79C','Natur'],['#8C9BA5','Grau']],'Wolle/Jute','Fürs Wohnzimmer.');
add('Teppiche','Webkante','Hochflor „Wolke“ 140 × 200','teppich',140,200,3,220,[['#F4F1EA','Creme'],['#E8D0C2','Altrosa'],['#9FB3C8','Taubenblau']],'Polyester','Weich, gut vorm Bett.');
add('Teppiche','Webkante','Läufer „Flur“ 80 × 250','teppich',80,250,1,120,[['#B8524A','Ziegel'],['#3C3F49','Nachtblau'],['#C9B79C','Natur']],'Baumwolle','Schmaler Läufer für Flur oder Windfang.');
add('Teppiche','Kinderland','Spielteppich „Stadt“ 140 × 200','teppich',140,200,1,90,[['#8AB17D','Grün'],['#9FB3C8','Blau']],'Polyamid','Mit Straßen und Häusern (im Modell einfarbig).');
add('Leuchten','Lichtwerk','Stehleuchte „Bogen“','stehlampe',40,40,205,340,[['#C8A060','Messing'],['#2B2B2B','Schwarz']],'Metall, Stoffschirm','Schirm Ø 40 cm.');
add('Leuchten','Lichtwerk','Stehleuchte „Leselicht“','stehlampe',30,30,150,160,[['#2B2B2B','Schwarz'],['#F4F1EA','Weiß']],'Metall','Schmale Leseleuchte neben dem Sessel.');
add('Pflanzen','Grünzeug','Monstera im Topf','pflanze',80,80,140,89,[['#5E9A55','Grün']],'Pflanze, Terrakottatopf','Große Blätter, braucht Platz.');
add('Pflanzen','Grünzeug','Geigenfeige','pflanze',60,60,180,129,[['#4E8A48','Dunkelgrün']],'Pflanze, Topf','Hoch und schmal, gut in Ecken.');
add('Pflanzen','Grünzeug','Olivenbäumchen','pflanze',50,50,120,79,[['#8A9A6A','Olivgrün']],'Pflanze, Topf','Für helle Plätze am Fenster.');
add('Pflanzen','Grünzeug','Kleine Zimmerpflanze','pflanze',30,30,45,19,[['#5E9A55','Grün']],'Pflanze, Topf','Für Regal oder Fensterbank (frei stellbar).');

window.KATALOG={
  quellen:[{id:'fantasie',name:'Fantasiekatalog (erfundene Marken und Preise)',laden:()=>Promise.resolve(F.slice())}],
  // Alle Quellen laden; Fehler einer Quelle blockieren die anderen nicht.
  laden(){return Promise.all(this.quellen.map(q=>Promise.resolve().then(()=>q.laden()).then(list=>list.map(a=>Object.assign({quelle:q.id},a))).catch(e=>{console.warn('Katalogquelle fehlgeschlagen:',q.id,e);return [];}))).then(ls=>[].concat(...ls));}
};
})();
