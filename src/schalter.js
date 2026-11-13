// Schalter in der Leiste: Deko aus, Möbel aus, Wände aus (bestimmt, welche Teile dazugehören).
// Esstisch verschieben/drehen: jetzt allgemein für alle Möbel im Einrichtungsmodus (einrichten.js)

// ---- Deko ein/aus ----
const decoMats=new Set([lampOn,rattan.material,shade.material,leafM,stemM,potM,potW,stalk,leaf2,leaf3]);
const decoHex=new Set(['5e9a55','7baf5a','4e8a4a','6fa35e','c0663f','e9e6df','4a3a2a']);
const hexOf=m=>{const c=m.color.clone().convertLinearToSRGB();return c.getHexString();};
{const gb=new THREE.Box3(new THREE.Vector3(5.36,CF-0.15,-0.3),new THREE.Vector3(8.84,-0.05,4.5));window.__garConf=gCel.children.filter(o=>{const b=new THREE.Box3().setFromObject(o);return !b.isEmpty()&&b.intersectsBox(gb);});}
const decoMeshes=[];
scene.traverse(o=>{if(!o.isMesh||!o.material||Array.isArray(o.material))return;if(o.userData.deco||decoMats.has(o.material)||(o.material.color&&decoHex.has(hexOf(o.material))))decoMeshes.push(o);});
const decoBtn=document.getElementById('deco');
const furnBtn=document.getElementById('furn');let furnList=null;
const isStruct=o=>{let q=o;while(q){if(q.userData&&q.userData.struct)return true;if(q===gRoof||q===dimG)return true;q=q.parent;}return false;};
function buildFurn(){const SM=new Set([wallMat,glass,baseM,plinthM,rough]),FL=window.__FLIGHTS||[],out=[],b=new THREE.Box3();scene.updateMatrixWorld(true);
  scene.traverse(o=>{if(!o.isMesh||!o.material)return;if(o.userData.deco||isStruct(o))return;const m=Array.isArray(o.material)?o.material[0]:o.material;if(SM.has(m)||(m.transparent&&m.opacity<0.5))return;
    b.setFromObject(o);if(b.isEmpty())return;const h=b.max.y-b.min.y,dx=b.max.x-b.min.x,dz=b.max.z-b.min.z,w=Math.max(dx,dz),t=Math.min(dx,dz);
    if(h>2.3||(w>2.6&&t>1.2)||(h<0.03&&w>1.2)||(t<0.12&&h>1.8))return;if(m===white&&t<0.12)return;
    const c=b.getCenter(new THREE.Vector3());if(FL.some(f=>c.x>f.box[0]-0.15&&c.x<f.box[1]+0.15&&c.y>f.box[2]-0.2&&c.y<f.box[3]+1.2&&c.z>f.box[4]-0.15&&c.z<f.box[5]+0.15))return;out.push(o);});return out;}
// ---- Inneneinrichtung in Außenansichten ----
// Möbel und Deko im Haus machen von außen über die Hälfte der Zeichenlast aus, sind dort aber kaum zu sehen. In
// Außenansichten werden sie deshalb erst nahe am Haus gezeichnet (Abstand je Leistungsstufe: LEIST.innen, Regel in
// start.js). innerSet = die betroffenen Teile: Mittelpunkt in einem Raum aus ROOMS (also nicht Fensterrahmen, Rollläden,
// Holzverkleidung an der Fassade und nichts in Garten oder Garage). INNER_BOX = Hausgrundriss für die Abstandsmessung.
const INNER_BOX=[XW-0.45,Math.max(RX1,KX1)+0.45,-0.45,EDZ+0.1];let innerHidden=false;const innerSet=new Set();
function innerCheck(m){if(!m||!m.isMesh||!m.geometry)return;let q=m;while(q){if(q===gRoof)return;q=q.parent;}m.updateWorldMatrix(true,false);if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();
  const c=m.geometry.boundingBox.getCenter(new THREE.Vector3()).applyMatrix4(m.matrixWorld);
  if((window.__ROOMS||[]).some(r=>c.x>r[2]+0.02&&c.x<r[3]-0.02&&c.z>r[4]+0.02&&c.z<r[5]-0.02&&c.y>r[6]-0.1&&c.y<r[6]+2.7))innerSet.add(m);}
function applyFurnDeco(){const fo=furnBtn.getAttribute('aria-pressed')==='true',dof=decoBtn.getAttribute('aria-pressed')==='true';
  if(furnList)furnList.forEach(m=>{m.visible=!(fo||(innerHidden&&innerSet.has(m)));});decoMeshes.forEach(m=>{m.visible=!(dof||(innerHidden&&innerSet.has(m)));});}
furnBtn.addEventListener('click',()=>{if(!furnList)furnList=buildFurn();const on=furnBtn.getAttribute('aria-pressed')!=='true';furnBtn.setAttribute('aria-pressed',String(on));furnBtn.textContent=on?'Möbel ein':'Möbel aus';applyFurnDeco();});
decoBtn.addEventListener('click',()=>{const on=decoBtn.getAttribute('aria-pressed')!=='true';decoBtn.setAttribute('aria-pressed',String(on));applyFurnDeco();});

// ---- Wände ein/aus ----
const wallSet=new Set([wallMat,pvc,glass,sillM,trim,white,leaf,backing,hMat]);
const wallMeshes=[];
scene.traverse(o=>{if(o.isMesh&&(o.userData.wall||wallSet.has(o.material))){wallMeshes.push(o);o.userData.navBlocker=1;}});
const wallBtn=document.getElementById('walls');
wallBtn.addEventListener('click',()=>{const on=wallBtn.getAttribute('aria-pressed')!=='true';wallBtn.setAttribute('aria-pressed',String(on));wallMeshes.forEach(m=>m.visible=!on);wallsHidden=on;shutters.forEach(shutApply);});
