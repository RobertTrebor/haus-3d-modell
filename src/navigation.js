// Navigation: Umsehen im Raum (Kamera bleibt am Standpunkt), Zoomen/Verschieben bleibt im Raum,
// Doppelklick/Doppeltipp (Raum wechseln, hingehen, Treppen). Räume in ROOMS, Treppenläufe in FLIGHTS.
// Drehen im Raum: Kamera bleibt am Standpunkt (Umsehen statt Umkreisen), damit sie nicht durch Wände wandert
let pivot=null,camIn=false;const touchIds=new Set();
renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')touchIds.add(e.pointerId);
  const rot=e.pointerType==='touch'?touchIds.size===1:(e.button===0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey),c=camera.position;
  pivot=rot&&(camIn||(window.__roomAt&&window.__roomAt(c.x,c.y-0.5,c.z)))?c.clone():null;},true);
['pointerup','pointercancel'].forEach(n=>window.addEventListener(n,e=>touchIds.delete(e.pointerId),true));
renderer.domElement.addEventListener('wheel',()=>{pivot=null;},{capture:true,passive:true});
// Zoomen/Verschieben im Raum: Schritte, die aus dem Raum oder durch eine Wand führen, werden verworfen (außer bei „Wände aus“)
const inRoomBox=(p,r)=>p.x>r[2]+0.1&&p.x<r[3]-0.1&&p.z>r[4]+0.1&&p.z<r[5]-0.1&&p.y>r[6]+0.3&&p.y<r[6]+(r[6]===0?H:2.45)-0.1;
const navRay=new THREE.Raycaster();
function leavesRoom(a,b){const R=window.__ROOMS||[],ra=R.some(r=>inRoomBox(a,r));
  if(!ra&&!camIn)return false;
  if(ra&&!R.some(r=>inRoomBox(b,r)))return true;
  const d=b.clone().sub(a),len=d.length();if(len<1e-6)return false;
  const bl=[];scene.traverse(o=>{if(o.isMesh&&o.userData.navBlocker)bl.push(o);});
  navRay.set(a,d.normalize());navRay.near=0;navRay.far=len+0.15;navRay.camera=camera;
  return navRay.intersectObjects(bl,false).some(h=>{let o=h.object;while(o){if(!o.visible)return false;o=o.parent;}return true;});}
{const upd=controls.update.bind(controls);controls.update=function(){
  if(pivot&&!camera.position.equals(pivot))pivot=null; // Kamera wurde anderweitig bewegt (Ansichtswechsel o. Ä.)
  const pc=camera.position.clone(),pt=controls.target.clone();
  const r=upd();
  if(pivot){const d=controls.target.clone().sub(camera.position);camera.position.copy(pivot);controls.target.copy(pivot).add(d);}
  else if(!wallsHidden&&!camera.position.equals(pc)&&leavesRoom(pc,camera.position)){camera.position.copy(pc);controls.target.copy(pt);}
  return r;};}

// ===== Doppelklick / Doppeltipp: Raum wechseln, hingehen, Treppe hoch/runter =====
(function(){
  const EYE=1.6,toastEl=document.getElementById('toast');let tt=null;
  const toast=t=>{toastEl.textContent=t;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('on'),1600);};
  const shown=o=>{while(o){if(!o.visible)return false;o=o.parent;}return true;};
  const ROOMS=[
    ['Wohnzimmer','slide',0,W,0,D,0],['Esszimmer','dining',XW,XE,Z0,S,0],['Flur','hall',HX0,HX1,Z0,HZ1,0],['Küche','kitchen',KX0,KX1,KZ0,KZ1,0],['Bad','bath',BX0,BX1,BZ0,BZ1,0],['Schlafzimmer','bedroom',RX0,RX1,RZ0,RZ1,0],
    ['Windfang','vcorr',CX0,CL1,HZ1,EDZ,EF],
    ['Treppenpodest','landing',CX0,EX,HZ1+0.25,EDZ,LY],['WC (Zwischentreppe)','wcz',WCX0,CL1,WCZ0,WCZ1,LY],
    ['Janinas Zimmer','janina',JX0,JX1,JZ0,JZ1,OGF],['Wichtelzimmer','wichtel',KX0w,KX1w,KZ0w,KZ1w,OGF],['Lesezimmer','lese1',LX0,LX1,LZ0o,LZ1o,OGF],['Bastelzimmer','bastel1',GX0,GX1,LZ0o,LZ1o,OGF],['Au-pair-Zimmer','aupair1',AUX0,AUX1,AUZ0,AUZ1,OGF],['Bad oben','bathog',OBX0,OBX1,OBZ0,OBZ1,OGF],
    ['Bogenzimmer','kroom',KRX0,XE,KRZ0,KRZ1,CF],['Kellerbüro','kbuero',KBX0,KBX1,KBZ0,KBZ1,CF],['Waschküche','kvest',VX0,VX1,VZ0,WKZ1,CF],['Garage','garage',gx0,gx1,NF+0.32,NF+4.92,CF],['Vorratsraum','kpantry',PX0,PX1,PZ0b,PZ1b,CF],['Keller-WC','kwc',WTX-WZ1,WTX-WZ0,WX0+WTZ,WX1+WTZ,CF],['Kellerflur','kcab',CW1,PX0-0.15,4.53,5.81,CF],
    ['Yogazimmer','yoga',DKX0,DKX1,DKZ0,3.3,DGF],['Flur (DG)','dgflur',2.96,5.15,3.42,DKZ1,DGF],['Bad (DG)','dgbath',5.27,DKX1,3.42,DKZ1,DGF],['Abstellkammer','dgstore',DKX0,2.84,3.42,DKZ1,DGF]];
  window.__ROOMS=ROOMS;window.__toast=t=>toast(t);
  const roomAt=window.__roomAt=(x,y,z)=>ROOMS.find(r=>x>r[2]&&x<r[3]&&z>r[4]&&z<r[5]&&y>r[6]-0.35&&y<r[6]+(r[6]===0?H:2.45));
  // Treppenläufe: Bereich + unterer/oberer Standpunkt mit Blickrichtung
  const SM=(HX0+SUX)/2,S2=(SDX+EX)/2;
  const FLIGHTS=[
    {n:'Kellertreppe',box:[CW0,CW1,CF-0.1,EF+0.3,cz0-2.4,HZ1+0.4],lo:[3.5,CF,4.9,0,-1],hi:[3.5,EF,HZ1+EWT+0.35,0,-1]},
    {n:'Eingangstreppe',box:[SDX,EX,EF-0.1,0.3,SD0-0.1,SD0+NSD*SDT+0.1],lo:[exc,EF,EDZ-0.8,0,1],hi:[exc,0,SD0-0.45,0,1]},
    {n:'Treppe zum Podest',box:[HX0,SUX+0.05,-0.1,LY+0.3,SU0-0.1,LZ+0.05],lo:[SM,0,SU0-0.55,0,1],hi:[(HX0+EX)/2,LY,(HZ1+0.3+EDZ)/2,1,0]},
    {n:'Treppe ins Dachgeschoss',box:[AX0,AX1+0.05,OGF-0.1,DGF+0.3,ATZ0-0.1,ATZ0+NAT*ATS+0.05],lo:[(AX0+AX1)/2,OGF,ATZ0-0.55,0,1],hi:[3.75,DGF,6.95,0.3,1]},
    {n:'Treppe ins Obergeschoss',box:[SDX,EX,LY-0.1,OGF+0.3,U1Z-0.1,HZ1+0.35],lo:[S2,LY,(HZ1+0.3+EDZ)/2,0,-1],hi:[S2,OGF,U1Z-0.7,0,-1]}];
  window.__FLIGHTS=FLIGHTS;
  const inBox=(p,b)=>p.x>b[0]-0.05&&p.x<b[1]+0.05&&p.y>b[2]&&p.y<b[3]&&p.z>b[4]-0.05&&p.z<b[5]+0.05;
  const inGar=(x,y,z)=>x>gx0-0.02&&x<gx1+0.02&&z>NF-0.25&&z<NF+4.95&&y>CF-0.2&&y<CF+2.4;
  function moveTo(pos,look,lbl){const p=new THREE.Vector3(...pos),t=new THREE.Vector3(...look);facadeMode=inGar(pos[0],pos[1]-1,pos[2]);{const fy=pos[1]-EYE;setLevel(fy>DGF-0.4?2:(fy>OGF-0.4?1:0));}
    if(reduce){camera.position.copy(p);controls.target.copy(t);}else tween={p0:camera.position.clone(),t0:controls.target.clone(),p,t,start:performance.now(),dur:900};
    if(lbl){window.__setViewLabel(lbl);}toast(lbl||'');}
  const stand=(x,y,z,dx,dz,lbl)=>{const target=new THREE.Vector3(x,y+EYE,z);if(pathBlocked(target)){toast('Wand im Weg');return;}moveTo([x,y+EYE,z],[x+dx*2,y+EYE-0.25,z+dz*2],lbl);};
  const rc=new THREE.Raycaster(),v2=new THREE.Vector2();
  function hitAt(e){const r=renderer.domElement.getBoundingClientRect();v2.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);rc.setFromCamera(v2,camera);
    const hs=rc.intersectObjects(scene.children,true);
    for(const h of hs){const o=h.object;if(!o.isMesh||!shown(o))continue;const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||m.wireframe||(m.transparent&&m.opacity<0.7))continue;return h;}return null;}
  function floorBelow(x,y,z){const r2=new THREE.Raycaster(new THREE.Vector3(x,y,z),new THREE.Vector3(0,-1,0),0,4);r2.camera=camera;const hs=r2.intersectObjects(scene.children,true);for(const h of hs){if(h.object.isMesh&&shown(h.object))return h.point.y;}return y-EYE;}
  const clampIn=(r,x,z)=>[Math.min(Math.max(x,r[2]+0.35),r[3]-0.35),Math.min(Math.max(z,r[4]+0.35),r[5]-0.35)];
  function pathBlocked(target){
    const direction=target.clone().sub(camera.position),distance=direction.length();if(distance<0.12)return false;
    const pathRay=new THREE.Raycaster(camera.position.clone(),direction.normalize(),0.05,distance-0.08);pathRay.camera=camera;
    return pathRay.intersectObjects(scene.children,true).some(hit=>shown(hit.object)&&hit.object.userData.navBlocker);
  }
  function onDouble(e){const h=hitAt(e);if(!h)return;const p=h.point.clone(),c=camera.position;
    const n=h.face?h.face.normal.clone().transformDirection(h.object.matrixWorld):new THREE.Vector3(0,1,0);
    window.__lastHit=[p.x.toFixed(2),p.y.toFixed(2),p.z.toFixed(2),n.y.toFixed(2)];
    const portal=h.object.userData.navPortal;
    if(portal){const from=roomAt(c.x,c.y-0.5,c.z),target=portal.rooms[from&&from[1]];if(!target){toast('Kein angrenzender Raum');return;}if(!portal.isOpen()){toast('Tür ist geschlossen');return;}viewSel.value=target;viewSel.dispatchEvent(new Event('change'));return;}
    // Von außen in den Hauseingang: im Windfang hinstellen und die Blickrichtung behalten (die Holztreppe hinauf zum Flur,
    // Richtung Wohn- und Schlafzimmer) statt in die Ansicht „Windfang“ zu wechseln, die nach links schaut.
    if(c.z>EDZ&&!roomAt(c.x,c.y-0.5,c.z)&&p.x>CX0-0.1&&p.x<CL1+0.1&&p.z>SD0-0.2&&p.z<EDZ+0.15&&p.y>EF-0.4&&p.y<EF+2.7){
      if(h.object.userData.navBlocker||pathBlocked(p)){toast('Tür ist geschlossen');return;}
      moveTo([exc,EF+EYE,EDZ-0.6],[exc,1.25,Z0+0.3],'Hauseingang');return;}
    const camEye=c.y-EYE;
    const fl=FLIGHTS.find(f=>inBox(p,f.box));
    if(fl){const goUp=Math.abs(camEye-fl.lo[1])<=Math.abs(camEye-fl.hi[1]);const s=goUp?fl.hi:fl.lo;stand(s[0],s[1],s[2],s[3],s[4],fl.n+(goUp?' – oben':' – unten'));return;}
    const q=p.clone();if(Math.abs(n.y)<0.5)q.addScaledVector(n,0.06);
    const room=roomAt(q.x,q.y,q.z);
    const camRoom=roomAt(c.x,c.y-0.5,c.z);
    if(!room){toast('Kein Raum erkannt');return;}
    if(camRoom!==room){if(h.object.userData.navBlocker||pathBlocked(p)){toast('Wand oder geschlossene Tür im Weg');return;}viewSel.value=room[1];viewSel.dispatchEvent(new Event('change'));toast(room[0]);return;}
    const fy=room[6];
    const dir=new THREE.Vector3().subVectors(controls.target,c);dir.y=0;if(dir.lengthSq()<1e-4)dir.set(0,0,-1);dir.normalize();
    if(n.y>0.6&&p.y-fy<0.15){const [x,z]=clampIn(room,p.x,p.z);stand(x,fy,z,dir.x,dir.z,room[0]);return;}
    // Wand oder Möbel: 1,3 m davor in Richtung Kamera hinstellen und hinschauen
    const away=new THREE.Vector3(c.x-p.x,0,c.z-p.z);if(away.lengthSq()<1e-4)away.copy(dir).negate();away.normalize();
    const [x,z]=clampIn(room,p.x+away.x*1.3,p.z+away.z*1.3);
    if(pathBlocked(new THREE.Vector3(x,fy+EYE,z))){toast('Wand im Weg');return;}
    moveTo([x,fy+EYE,z],[p.x,Math.max(p.y,fy+1.0),p.z],room[0]);}
  let last=0,lx=0,ly=0,dx0=0,dy0=0;
  renderer.domElement.addEventListener('pointerdown',e=>{dx0=e.clientX;dy0=e.clientY;});
  renderer.domElement.addEventListener('dblclick',e=>{e.preventDefault();if(window.HAUS&&HAUS.navBlock&&HAUS.navBlock())return;onDouble(e);});
  window.__dblAt=(x,y)=>onDouble({clientX:x,clientY:y});
  renderer.domElement.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')return;if(window.HAUS&&HAUS.navBlock&&HAUS.navBlock())return;if(Math.hypot(e.clientX-dx0,e.clientY-dy0)>8)return;const now=performance.now();
    if(now-last<400&&Math.hypot(e.clientX-lx,e.clientY-ly)<40){last=0;onDouble(e);}else{last=now;lx=e.clientX;ly=e.clientY;}});
})();
