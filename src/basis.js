// Basis: Renderer, Szene, Kamera, Materialien und Hilfsfunktionen (B, cyl, blob, M, canvasTex …),
// Baumaße (KONST aus config/masse.js) und Raummaße (rm aus config/raeume.js).
if(!window.THREE||!THREE.OrbitControls){document.getElementById('err').style.display='flex';throw new Error('three.js fehlt');}
const stage=document.getElementById('stage');
const renderer=new THREE.WebGLRenderer({antialias:true});
const __mob=window.matchMedia('(pointer: coarse)').matches,__prMax=Math.min(window.devicePixelRatio,__mob?1.75:2);let __pr=__prMax;renderer.setPixelRatio(__pr);let __ft=0,__fn=0,__fl=performance.now();
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;let __shF=0;
// Zeichnen nur bei Bedarf (start.js): __dirty = nächstes Bild zeichnen, __dirtyUntil = bis zu diesem Zeitpunkt durchzeichnen
// (nach Bedienung), __anim = in diesem Bild hat sich ein bewegliches Teil bewegt (Türen, Rollläden, Flügel, Geräte)
let __dirty=1,__dirtyUntil=performance.now()+5000,__anim=0;
let __frames=0,__avg=0;
// Leistungsstufe (Schalter „Leistung“ in der Leiste, start.js): mode = Wahl (auto/hoch/niedrig), eff = wirksame Stufe.
// innen = Abstand zum Haus in m, bis zu dem in Außenansichten die Inneneinrichtung gezeichnet wird; lichter = Punktlichter
// gleichzeitig; prMin = kleinstes Pixelverhältnis, auf das die automatische Auflösungsanpassung heruntergehen darf.
const LEIST={mode:'auto',eff:'mittel',autoLow:false,innen:{hoch:30,mittel:8,niedrig:4},schatten:{hoch:true,mittel:true,niedrig:false},lichter:{hoch:99,mittel:99,niedrig:4},prMin:{hoch:1,mittel:1,niedrig:0.75}}; // Messanzeige (start.js): gezeichnete Bilder, mittlerer Bildabstand in ms
stage.prepend(renderer.domElement);

const scene=new THREE.Scene();
const DAY_BG=new THREE.Color('#CFE0EE').convertSRGBToLinear();
const NIGHT_BG=new THREE.Color('#1C2536').convertSRGBToLinear();
scene.background=DAY_BG.clone();

const camera=new THREE.PerspectiveCamera(50,1,0.1,120);
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.maxPolarAngle=Math.PI*0.6;
controls.minDistance=0.3;
controls.maxDistance=40; // weit herauszoomen erlaubt; die Ansichten selbst bleiben bei höchstens 14 m (viewCam in ansichten.js)

const col=h=>new THREE.Color(h).convertSRGBToLinear();
const Mu=(h,r=0.85,extra={})=>new THREE.MeshStandardMaterial(Object.assign({color:col(h),roughness:r,metalness:0},extra));
const __MC=new Map();
const M=(h,r=0.85,extra={})=>{if(Object.values(extra).some(v=>v!==null&&typeof v==='object'))return Mu(h,r,extra);const k=h+'|'+r+'|'+JSON.stringify(extra);let m=__MC.get(k);if(!m){m=Mu(h,r,extra);__MC.set(k,m);}return m;};
let wallPaintSerial=0;
// Streichbare Wand nur kennzeichnen; die Farbe wird im Einrichtungsmodus (einrichten.js) per Vertexfarbe gesetzt,
// damit die Wände weiter zu wenigen Meshes zusammengefasst werden können.
function registerPaintableWall(mesh,faceCount,sloped){mesh.userData.paintWall='w'+wallPaintSerial++;mesh.userData.wall=1;if(sloped)mesh.userData.paintWallSloped=1;}
function B(x0,x1,y0,y1,z0,z1,m,parent){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0),m);
  mesh.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);
  if(m&&m.userData&&m.userData.paintableWall)registerPaintableWall(mesh,mesh.geometry.groups.length||1);
  (parent||scene).add(mesh);return mesh;
}
function rr(x0,y0,x1,y1,r){
  const s=new THREE.Shape();
  s.moveTo(x0+r,y0);s.lineTo(x1-r,y0);s.quadraticCurveTo(x1,y0,x1,y0+r);
  s.lineTo(x1,y1-r);s.quadraticCurveTo(x1,y1,x1-r,y1);s.lineTo(x0+r,y1);
  s.quadraticCurveTo(x0,y1,x0,y1-r);s.lineTo(x0,y0+r);s.quadraticCurveTo(x0,y0,x0+r,y0);
  return s;
}
function slab(x0,x1,z0,z1,y0,h,r,m){
  const b=0.03;
  const g=new THREE.ExtrudeGeometry(rr(x0+b,z0+b,x1-b,z1-b,r),{depth:h-2*b,bevelEnabled:true,bevelSize:b,bevelThickness:b,bevelSegments:4,curveSegments:8});
  g.rotateX(Math.PI/2);
  const mesh=new THREE.Mesh(g,m);mesh.position.y=y0+h-b;scene.add(mesh);return mesh;
}
function cyl(x,z,r,y0,h,m,seg=32,parent){
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg),m);
  mesh.position.set(x,y0+h/2,z);(parent||scene).add(mesh);return mesh;
}
function blob(x,y,z,sx,sy,sz,m){
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,28,18),m);
  mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);scene.add(mesh);return mesh;
}
function deco(o){o.userData.deco=1;return o;}
function canvasTex(w,h,draw,rep){
  const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;
  t.anisotropy=renderer.capabilities.getMaxAnisotropy();
  if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}
  return t;
}
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};

// Baumaße (Raumhöhen, Wandstärken, Stufen): Quelle ist src/config/masse.js (window.HAUS_MASSE.konst); die Zahlen hier sind nur Rückfallwerte.
const KONST={H:2.59,T:0.18,OGH:2.59,EWT:0.38,KST:9,VBA:4.1,VBI:3.5}; // VBA/VBI: Vorbau Breite außen/innen
{const k=(window.HAUS_MASSE&&window.HAUS_MASSE.konst)||{};Object.keys(KONST).forEach(n=>{if(typeof k[n]==='number'&&isFinite(k[n]))KONST[n]=k[n];});}
// Raummaße: Quelle ist src/config/raeume.js (window.HAUS_RAEUME.raeume); rm(Raum,Feld,Rückfallwert)
const RAEUME=(window.HAUS_RAEUME&&window.HAUS_RAEUME.raeume)||{};
const rm=(key,feld,fb)=>{const r=RAEUME[key],v=r&&r[feld];return typeof v==='number'&&isFinite(v)?v:fb;},r4=v=>Math.round(v*1e4)/1e4;
const {H,T}=KONST,W=rm('slide','breite',3.9),D=rm('slide','tiefe',3.54);
