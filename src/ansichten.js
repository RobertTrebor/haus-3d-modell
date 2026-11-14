// Ansichten: Kamerastandpunkte (VIEWS), Etagenwahl, Kamerafahrt, Ansichts-Menü.
// Neue Ansicht: Eintrag in VIEWS {p:Kamera, t:Blickziel, fl:Etage, facade:Außenansicht} und <option> in index.html.
const VIEWS={
  overview:{p:[13.5,12.5,15],t:[3.0,0.3,4.2]},
  kitchen:{p:[5.5,1.6,6.3],t:[8.4,0.9,6.6]},
  bath:{p:[4.65,1.65,4.37],t:[8.4,1.0,4.2]},
  bedroom:{p:[4.6,1.7,3.2],t:[7.4,0.7,0.7]},
  hall:{p:[3.95,1.6,3.9],t:[3.6,1.0,8.6]},
  stairs:{p:[3.2,2.9,7.9],t:[4.4,0.4,4.2]},
  vcorr:{p:[EX-0.12,EF+1.65,HZ1+EWT+0.35],t:[CX0,EF+0.95,EDZ-0.2]},
  vcloset:{p:[SDX+0.2,EF+1.55,EDZ-0.25],t:[CL1,EF+0.9,KZ1+0.6]},
  kg:{p:[3.2,7.5,-6.5],t:[3.0,CF+0.5,3.6],fl:-1},kcab:{p:[3.5,CF+1.6,5.0],t:[3.5,CF+1.0,3.5]},kroom:{p:[2.9,CF+1.6,4.45],t:[-1.6,CF+1.0,5.5]},kroom2:{p:[-0.6,CF+1.6,5.9],t:[2.3,CF+1.2,4.0]},kbuero:{p:[2.2,CF+1.7,3.05],t:[-1.8,CF+1.0,0.9]},kbuero2:{p:[0.9,CF+1.65,3.1],t:[-0.6,CF+1.0,-0.3]},
  kvest:{p:[4.6,CF+1.6,3.3],t:[3.3,CF+1.0,-0.3]},kvestDoor:{p:[3.6,CF+1.6,2.5],t:[5.8,CF+1.2,2.78],fl:-1,facade:1},kvest2:{p:[4.75,CF+1.65,2.9],t:[VX0+0.2,CF+1.0,1.9]},
  kcorr:{p:[3.55,CF+1.55,3.35],t:[5.9,CF+1.0,2.6]},
  kwc:{p:[WTX-(WZ0+WZ1)/2,CF+1.55,5.45],t:[WTX-(WZ0+WZ1)/2,CF+0.5,7.9]},
  kpantry:{p:[6.55,CF+1.65,6.45],t:[8.41,CF+1.35,5.3]},
  kcrawl:{p:[CRX0+0.3,CF+1.1,CRZ0+0.5],t:[CRX1,CF+0.4,CRZ0+0.5]},
  kcrawl2:{p:[CRX0+0.9,CF+1.1,CRZ0+0.8],t:[CRX1,CF+0.7,CRZ0+0.4]},
  cellar:{p:[3.5,0.45,8.3],t:[3.5,-2.6,4.3]},
  estairs:{p:[exc+0.9,EF+1.15,FZ+3.0],t:[exc-0.1,EF+0.25,FZ+0.2],facade:1},outside:{p:[exc+0.6,EF+1.8,17.0],t:[exc,EF+2.6,9.6],facade:1},
  street:{p:[exc,1.1,25.5],t:[exc,2.6,6.0],facade:1},
  street2:{p:[exc-7.5,1.0,21.5],t:[exc,2.4,6.0],facade:1},
  hof:{p:[2.8,CF+1.9,-10.5],t:[2.6,CF+1.5,0],facade:1},garage:{p:[6.75,CF+1.6,NF+0.6],t:[6.75,CF+0.7,NF+4.9],fl:-1,facade:1},garageDoor:{p:[6.4,CF+1.6,2.78],t:[4.5,CF+1.2,2.78],fl:-1,facade:1},hofstairs:{p:[-1.2,CF+1.75,NF-3.4],t:[-3.9,CF+0.6,NF+0.4],facade:1},
  garden:{p:[4.0,CF+1.2,-22.0],t:[4.0,1.4,3.0],facade:1},
  terraceside:{p:[-16,0.6,-6.0],t:[1.5,2.8,3.5],facade:1},
  stairup:{p:[4.35,1.6,4.0],t:[3.5,1.6,8.6]},
  landwin:{p:[CX0+1.35,LY+1.5,9.2],t:[CX0,LY+1.15,8.5]},
  stairdown:{p:[(SDX+EX)/2,OGF+1.5,U1Z-0.3],t:[exc-0.1,LY+0.8,EDZ]},
  landing:{p:[(SDX+EX)/2-0.15,LY+1.55,HZ1+0.3+1.0],t:[(SDX+EX)/2,OGF+0.7,U1Z-0.6]},
  ogover:{p:[11.5,14.5,13],t:[2.6,3.2,3.0],fl:1},
  janina:{p:[3.35,OGF+1.6,3.25],t:[1.6,OGF+0.9,0.2],fl:1},
  janina2:{p:[3.6,OGF+1.55,1.2],t:[0.0,OGF+1.0,2.3],fl:1},
  janina3:{p:[0.7,OGF+2.2,3.1],t:[3.5,OGF+0.6,0.6],fl:1},
  wichtel:{p:[4.65,OGF+1.6,3.15],t:[7.6,OGF+0.8,0.6],fl:1},
  wichtel2:{p:[6.4,OGF+1.6,0.75],t:[6.9,OGF+0.8,3.4],fl:1},
  wichtel3:{p:[7.7,OGF+1.6,2.3],t:[4.1,OGF+1.0,1.0],fl:1},
  lese1:{p:[2.5,OGF+1.6,4.05],t:[0.0,OGF+0.9,7.7],fl:1},
  lese2:{p:[1.2,OGF+1.6,7.6],t:[1.2,OGF+1.0,3.7],fl:1},
  bastel1:{p:[-1.0,OGF+1.55,4.0],t:[-1.0,OGF+0.9,8.0],fl:1},
  bastel2:{p:[-0.6,OGF+1.55,7.6],t:[-1.5,OGF+0.8,3.8],fl:1},
  ogstair:{p:[4.75,OGF+1.6,5.1],t:[3.9,OGF+1.15,HZ1],fl:1},
  ogdoor:{p:[3.35,OGF+1.55,5.2],t:[2.9,OGF+1.1,3.0],fl:1},
  aupair1:{p:[AUX0+0.15,OGF+1.75,AUZ0+0.7],t:[AUX1-0.5,OGF+0.35,AUZ0+2.1],fl:1},
  aupair2:{p:[AUX1-0.4,OGF+1.6,AUZ0+0.9],t:[AUX0,OGF+1.0,AUZ1-1.0],fl:1},
  bathog:{p:[OBX0+0.45,OGF+1.75,OBZ1-0.25],t:[OBX1,OGF+0.6,OBZ0+0.3],fl:1},
  bathog2:{p:[OBX1-0.35,OGF+1.6,OBZ1-0.3],t:[OBX0,OGF+0.9,OBZ0+0.4],fl:1},
  wcz:{p:[EX-0.7,LY+1.6,(wcd0+wcd1)/2],t:[CL1,LY+0.6,(WCZ0+WCZ1)/2],fl:1},
  abstell:{p:[EX-0.15,OGF+1.3,6.25],t:[HX0,OGF+0.45,5.6],fl:1},
  dgover:{p:[11.5,DGF+8.5,13],t:[4.0,DGF,4.0],fl:2},
  dgtop:{p:[exc-0.1,DGF+1.55,5.75],t:[exc,DGF+1.3,7.75],fl:2},
  dgflur:{p:[4.3,DGF+1.6,7.0],t:[3.9,DGF+0.9,3.3],fl:2},
  yoga:{p:[7.2,DGF+1.45,2.9],t:[0.8,DGF+0.9,1.6],fl:2},
  yoga2:{p:[2.3,DGF+1.6,2.95],t:[7.4,DGF+0.6,1.4],fl:2},
  dgbath:{p:[6.6,DGF+1.6,5.2],t:[6.6,DGF+0.6,3.5],fl:2},
  dgbath2:{p:[6.0,DGF+1.6,4.3],t:[7.0,DGF+0.7,6.9],fl:2},
  dgstore:{p:[1.9,DGF+1.6,3.6],t:[0.6,DGF+0.7,6.4],fl:2},
  entrance:{p:[(SDX+EX)/2,1.6,SD0-1.5],t:[(SDX+EX)/2,-0.35,9.2]},
  dining:{p:[1.9,1.65,3.95],t:[-1.8,0.8,7.2]},
  top:{p:[3.0,19,4.2],t:[3.0,0,4.2]},
  slide:{p:[0.7,1.6,3.35],t:[2.3,0.7,0.6]},
  entry:{p:[3.4,1.6,3.35],t:[1.0,0.7,0.8]},
  kapok:{p:[3.3,0.95,1.05],t:[0.2,0.85,0.9]}
};
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let tween=null;
let kgMode=false;const kgClip=[new THREE.Plane(new THREE.Vector3(0,-1,0),CF+2.12)];
function setLevel(l){kgMode=l===-1;renderer.clippingPlanes=kgMode?kgClip:[];floorOG=l>=1;floorDG=l>=2;const v=['kg','eg','og','dg'][l+1];const fs=document.getElementById('floorSel');if(fs)fs.value=v;document.querySelectorAll('.seg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.floor===v)));}
function setFloor(on){setLevel(on?1:0);}
// Kamerastandpunkt einer Ansicht: höchstens 14 m vom Blickziel (so waren die Ansichten immer zu sehen, als 14 m noch die
// Zoomgrenze war); weiter weg kommt man nur durch eigenes Herauszoomen.
function viewCam(v){const t=new THREE.Vector3(...v.t),d=new THREE.Vector3(...v.p).sub(t);if(d.length()>14)d.setLength(14);return [t.clone().add(d),t];}
function goTo(key){
  const v=VIEWS[key];const [p,t]=viewCam(v);setLevel(v.fl===-1?-1:(v.fl===2?2:(v.fl?1:0)));facadeMode=!!v.facade;
  if(reduce){camera.position.copy(p);controls.target.copy(t);return;}
  tween={p0:camera.position.clone(),t0:controls.target.clone(),p,t,start:performance.now(),dur:900};
}
// Startansicht der App (Schlüssel aus VIEWS; die Auswahl im Menü folgt automatisch)
const START='street';
{const [p,t]=viewCam(VIEWS[START]);camera.position.copy(p);controls.target.copy(t);}facadeMode=!!VIEWS[START].facade;

const viewSel=document.getElementById('viewSel');viewSel.value=START;
viewSel.addEventListener('change',()=>goTo(viewSel.value));
const floorSel=document.getElementById('floorSel');floorSel.addEventListener('change',()=>{if(floorSel.value==='kg'){goTo('kg');return;}facadeMode=false;setLevel({eg:0,og:1,dg:2}[floorSel.value]);});
controls.addEventListener('start',()=>{tween=null;});
// ===== Ansichts-Menü (Bottom-Sheet) =====
(function(){
  const sheet=document.getElementById('viewSheet'),btn=document.getElementById('viewBtn'),tabs=document.getElementById('sheetTabs'),grid=document.getElementById('sheetGrid'),nameEl=document.getElementById('viewName'),sub=document.querySelector('.head p');
  const groups=[...viewSel.querySelectorAll('optgroup')].map(g=>({label:g.label,opts:[...g.querySelectorAll('option')].map(o=>({v:o.value,t:o.textContent}))}));
  let cur=0;
  const findGroup=v=>Math.max(0,groups.findIndex(g=>g.opts.some(o=>o.v===v)));
  function renderGrid(){grid.innerHTML='';groups[cur].opts.forEach(o=>{const b=document.createElement('button');b.textContent=o.t;if(o.v===viewSel.value)b.setAttribute('aria-current','true');b.addEventListener('click',()=>{choose(o.v);});grid.appendChild(b);});}
  function renderTabs(){tabs.innerHTML='';groups.forEach((g,i)=>{const b=document.createElement('button');b.setAttribute('role','tab');b.textContent=g.label;b.setAttribute('aria-selected',String(i===cur));b.addEventListener('click',()=>{cur=i;renderTabs();renderGrid();});tabs.appendChild(b);});}
  function open(){cur=findGroup(viewSel.value);renderTabs();renderGrid();sheet.hidden=false;btn.setAttribute('aria-expanded','true');}
  function close(){sheet.hidden=true;btn.setAttribute('aria-expanded','false');}
  function label(v){for(const g of groups)for(const o of g.opts)if(o.v===v)return o.t;return v;}
  window.__setViewLabel=t=>{nameEl.textContent=t;if(sub)sub.textContent=t;};
  function choose(v){viewSel.value=v;viewSel.dispatchEvent(new Event('change'));close();}
  viewSel.addEventListener('change',()=>window.__setViewLabel(label(viewSel.value)));
  btn.addEventListener('click',()=>sheet.hidden?open():close());
  document.getElementById('sheetClose').addEventListener('click',close);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sheet.hidden)close();});
  renderer.domElement.addEventListener('pointerdown',()=>{if(!sheet.hidden)close();});
  document.querySelectorAll('.seg button').forEach(b=>b.addEventListener('click',()=>{floorSel.value=b.dataset.floor;floorSel.dispatchEvent(new Event('change'));}));
  window.__setViewLabel(label(viewSel.value));
})();
