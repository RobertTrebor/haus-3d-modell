// Einrichtungsmodus: Wände streichen, Möbel verschieben/drehen, neue Möbel, Maßband, Varianten.
// Braucht window.HAUS aus main.js (wird am Ende von main.js nach dem Zusammenfassen gesetzt).
(function(){
'use strict';
const H=window.HAUS;if(!H)return;
const {scene,camera,renderer,controls,col}=H;
const cv=renderer.domElement,$=id=>document.getElementById(id);
const panel=$('editPanel'),body=$('editBody'),editBtn=$('editBtn');

// ---------- Speicher ----------
const K_CUR='haus3d-einrichtung-v1',K_VAR='haus3d-varianten-v1',K_OLDWALL='haus3d-wall-colors-v1';
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}};
let state={v:2,walls:{},pieces:{},items:[],doors:{},tor:null};
// Gespeichert wird nur bei echter Änderung; quiet = Stand wird nur angewendet (Start, anderes Gerät), kein neuer Zeitstempel
let saveT=0,lastJs='',quiet=false;
const flush=()=>{if(saveT){clearTimeout(saveT);saveT=0;}const js=JSON.stringify(state);if(js===lastJs)return;lastJs=js;LS.set(K_CUR,state);if(!quiet){LS.set(K_T,Date.now());syncPush();}};
const save=()=>{clearTimeout(saveT);saveT=setTimeout(flush,200);};
window.addEventListener('pagehide',flush);document.addEventListener('visibilitychange',()=>{if(document.hidden)flush();});

// ---------- Synchronisierung der Designideen (Artifact-Datenbank auf claude.ai; sonst nur dieses Gerät) ----------
// Privat je angemeldeter Person: data/users/<id>/einrichtung {t,dev,json} und .../varianten {json}. Neuerer Zeitstempel gewinnt.
const K_T='haus3d-einrichtung-t',K_DEV='haus3d-geraet';
const DEV=(()=>{let d=LS.get(K_DEV,null);if(!d){d=Math.random().toString(36).slice(2,10);LS.set(K_DEV,d);}return d;})();
const sync={status:'lokal',cur:null,vars:null,curBusy:false,curDirty:false,varBusy:false,varDirty:false,pushT:0};
const SYNC_TXT={lokal:'Nur auf diesem Gerät gespeichert. Synchronisierung zwischen PC und Smartphone gibt es im Artifact auf claude.ai (angemeldet).',
  verbinde:'Synchronisierung: Verbindung wird aufgebaut …',ok:'Synchronisierung aktiv: Designideen und Varianten sind auf allen Geräten gleich, auf denen du dieses Artifact öffnest.',
  offline:'Synchronisierung: Speicher gerade nicht erreichbar – Änderungen bleiben auf diesem Gerät und werden später abgeglichen.',fehler:'Synchronisierung: Fehler beim Speichern – Änderungen bleiben auf diesem Gerät.'};
function setSync(st){if(sync.status===st)return;sync.status=st;const el=$('eSync');if(el)el.textContent=SYNC_TXT[st];}
function syncPush(){if(!sync.cur)return;clearTimeout(sync.pushT);sync.pushT=setTimeout(pushCur,1500);}
function pushCur(){if(!sync.cur)return;if(sync.curBusy){sync.curDirty=true;return;}sync.curBusy=true;sync.curDirty=false;
  sync.cur.set({t:+LS.get(K_T,0)||1,dev:DEV,json:lastJs||JSON.stringify(state)}).then(()=>setSync('ok'),()=>setSync('fehler')).then(()=>{sync.curBusy=false;if(sync.curDirty)pushCur();});}
function pushVars(){if(!sync.vars)return;if(sync.varBusy){sync.varDirty=true;return;}sync.varBusy=true;sync.varDirty=false;
  sync.vars.set({json:JSON.stringify(LS.get(K_VAR,{}))}).then(()=>setSync('ok'),()=>setSync('fehler')).then(()=>{sync.varBusy=false;if(sync.varDirty)pushVars();});}
function onCur(snap){const md=snap.metadata||{};if(md.hasPendingWrites)return;const d=snap.exists?snap.data():null,lt=+LS.get(K_T,0)||0,rt=d&&+d.t||0;
  if(!md.fromCache)setSync('ok');
  if(d&&typeof d.json==='string'&&rt>lt){let st=null;try{st=JSON.parse(d.json);}catch(e){}if(!st)return;flush();
    quiet=true;try{applyState(st);flush();}finally{quiet=false;}LS.set(K_T,rt);H.toast('Stand vom anderen Gerät übernommen');if(H.editMode)render();}
  else if(lt>rt&&!md.fromCache)pushCur();}
function onVars(snap){const md=snap.metadata||{};if(md.hasPendingWrites)return;const d=snap.exists?snap.data():null;let R={};try{R=d&&typeof d.json==='string'?JSON.parse(d.json)||{}:{};}catch(e){}
  const L=LS.get(K_VAR,{}),M=Object.assign({},R);let lc=false,rc=false;
  Object.keys(L).forEach(n=>{if(!M[n]||(+L[n].t||0)>(+M[n].t||0)){M[n]=L[n];rc=true;}});Object.keys(M).forEach(n=>{if(!L[n]||(+M[n].t||0)>(+L[n].t||0))lc=true;});
  if(lc){LS.set(K_VAR,M);if(H.editMode&&tool==='vars')render();}if(rc&&!md.fromCache)pushVars();}
async function syncInit(){const c=window.claude;if(!c||typeof c.use!=='function')return;setSync('verbinde');
  try{const [db,user]=await Promise.all([c.use('db'),c.use('user')]);const id=db&&user?await user.id():null;if(!id){setSync('lokal');return;}
    sync.cur=db.doc('data/users/'+id+'/einrichtung');sync.vars=db.doc('data/users/'+id+'/varianten');
    const tm=setTimeout(()=>{if(sync.status==='verbinde')setSync('offline');},10000);
    sync.cur.onSnapshot(sn=>{clearTimeout(tm);onCur(sn);},()=>{clearTimeout(tm);setSync('offline');});sync.vars.onSnapshot(onVars,()=>{});
  }catch(e){sync.cur=sync.vars=null;setSync('lokal');}}

// ---------- Fester Bestand und Baumaße (src/config/, nur mit server.py am PC schreibbar) ----------
// Zwei Ebenen: BASE/MCFG = Status quo des Hauses (Dateien im Repo), state = Designideen (Browser, Varianten).
const BASE=window.HAUS_BESTAND&&typeof window.HAUS_BESTAND==='object'?window.HAUS_BESTAND:{};if(!BASE.pieces||typeof BASE.pieces!=='object')BASE.pieces={};if(!Array.isArray(BASE.items))BASE.items=[];
const MCFG=window.HAUS_MASSE&&typeof window.HAUS_MASSE==='object'?window.HAUS_MASSE:{};if(!MCFG.konst)MCFG.konst={};if(!MCFG.register)MCFG.register={};
let canWrite=false;
const post=(url,data)=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).then(r=>{if(!r.ok)throw 0;return true;})
  .catch(()=>{H.toast('Nicht in die Datei gespeichert – läuft server.py?');return false;});
const saveBase=()=>post('/api/bestand',{pieces:BASE.pieces,items:BASE.items});
const saveMasse=()=>post('/api/masse',{konst:MCFG.konst,register:MCFG.register});
if(/^https?:$/.test(location.protocol)&&/^(localhost|127\.0\.0\.1)$/.test(location.hostname))
  fetch('/api/info').then(r=>r.ok?r.json():null).then(j=>{canWrite=!!(j&&j.schreibbar);if(canWrite){massMigrate();if(H.editMode)render();}}).catch(()=>{});

// ---------- Hilfen ----------
const shown=o=>{while(o){if(!o.visible)return false;o=o.parent;}return true;};
const rc=new THREE.Raycaster(),v2=new THREE.Vector2();
function setRay(e){const r=cv.getBoundingClientRect();v2.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);rc.setFromCamera(v2,camera);}
function firstHit(e){setRay(e);const hs=rc.intersectObjects(scene.children,true);
  for(const h of hs){const o=h.object;if(!o.isMesh||o.userData.helper||!shown(o))continue;const m=Array.isArray(o.material)?o.material[0]:o.material;
    if(!m||m.visible===false||m.wireframe||(m.transparent&&m.opacity<0.6))continue;return h;}return null;}
const fmt=v=>v.toFixed(2).replace('.',',')+' m';
const cm=v=>Math.round(v*100);
const isId=g=>g.position.lengthSq()===0&&g.rotation.x===0&&g.rotation.y===0&&g.rotation.z===0&&g.scale.x===1&&g.scale.y===1&&g.scale.z===1;
const idChain=o=>{let q=o;while(q&&q!==scene){if(q.isMesh||!isId(q))return false;q=q.parent;}return q===scene;};
const rooms=()=>H.rooms();
const roomH=r=>r[6]===0?H.H:2.45;
const roomAt=(x,y,z)=>rooms().find(r=>x>r[2]&&x<r[3]&&z>r[4]&&z<r[5]&&y>r[6]-0.35&&y<r[6]+roomH(r));
// Treffer -> Quell-Mesh (bei zusammengefassten Meshes über die Vertex-Bereiche)
function recOfHit(h){const recs=h.object.userData.recs;if(!recs)return null;const v=h.faceIndex*3;let lo=0,hi=recs.length-1;
  while(lo<hi){const mid=(lo+hi+1)>>1;if(recs[mid].start<=v)lo=mid;else hi=mid-1;}const r=recs[lo];return v<r.start+r.count?r:null;}
// mehrere Geometrien (Box/Zylinder/Kugel) zu einer zusammenfassen – ein Mesh, ein Zeichenaufruf
function mergeGeos(list){const pos=[],nor=[],uv=[];let hasUv=true;list.forEach(q=>{const g=q.index?q.toNonIndexed():q;const P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv;
    for(let i=0;i<P.count;i++){pos.push(P.getX(i),P.getY(i),P.getZ(i));nor.push(N.getX(i),N.getY(i),N.getZ(i));if(U)uv.push(U.getX(i),U.getY(i));else hasUv=false;}});
  const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));G.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));if(hasUv&&uv.length)G.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));G.computeBoundingSphere();return G;}
function worldBox(src,rec){const g=src.geometry;if(!g.boundingBox)g.computeBoundingBox();if(!rec)src.updateWorldMatrix(true,false);return g.boundingBox.clone().applyMatrix4(src.matrixWorld);}

// =====================================================================
// Wände streichen (Vertexfarben, damit die Wände zusammengefasst bleiben)
// =====================================================================
const PW=new Map(),PWbySrc=new Map();
H.srcRec.forEach((r,src)=>{if(!src.userData.paintWall)return;const e={id:src.userData.paintWall,mesh:r.big,start:r.start,count:r.count,groups:r.groups,src,merged:true};PW.set(e.id,e);PWbySrc.set(src,e);});
scene.traverse(o=>{if(o.isMesh&&o.userData.paintWall&&!PWbySrc.has(o)){const e={id:o.userData.paintWall,mesh:o,start:0,count:0,groups:null,src:o,merged:false};PW.set(e.id,e);PWbySrc.set(o,e);}});
const vcCache=new Map();
function vcMat(m){let v=vcCache.get(m);if(!v){v=m.clone();v.vertexColors=true;v.color.setRGB(1,1,1);vcCache.set(m,v);}return v;}
function prep(e){const mesh=e.mesh;
  if(!e.merged&&!e.groups){let g=mesh.geometry;if(g.index){g=g.toNonIndexed();mesh.geometry=g;}e.count=g.attributes.position.count;e.groups=g.groups.map(q=>[q.start,q.count,q.materialIndex||0]);}
  if(!e.groups.length)e.groups=[[0,e.count,0]];
  if(!mesh.userData.vc){const g=mesh.geometry,n=g.attributes.position.count,base=mesh.material.color,a=new Float32Array(n*3);
    for(let i=0;i<n;i++){a[i*3]=base.r;a[i*3+1]=base.g;a[i*3+2]=base.b;}g.setAttribute('color',new THREE.BufferAttribute(a,3));
    mesh.userData.vc=1;mesh.userData.base=base.clone();mesh.userData.origMat=mesh.material;mesh.material=vcMat(mesh.material);}}
function faceOf(e,h){const v=h.faceIndex*3-e.start;if(!e.groups)return 0;for(const g of e.groups)if(v>=g[0]&&v<g[0]+g[1])return g[2];return 0;}
function setFace(e,face,hex){prep(e);const c=e.mesh.geometry.attributes.color,base=e.mesh.userData.base,cc=hex?col(hex):base;
  e.groups.forEach(g=>{if(g[2]!==face)return;for(let i=e.start+g[0],n=e.start+g[0]+g[1];i<n;i++)c.setXYZ(i,cc.r,cc.g,cc.b);});c.needsUpdate=true;
  const w=state.walls[e.id]||(state.walls[e.id]=[]);if(hex)w[face]=hex;else{delete w[face];if(!w.some(Boolean))delete state.walls[e.id];}}
function wallHit(h){let e=null;if(h.object.userData.recs){const r=recOfHit(h);e=r&&PWbySrc.get(r.src);}else e=PWbySrc.get(h.object);
  if(!e)return null;if(!e.merged&&!e.groups){/* Gruppen erst nach prep bekannt */prep(e);}
  const face=faceOf(e,h);if(e.src.userData.paintFaces&&!e.src.userData.paintFaces.includes(face))return null;
  const n=h.face.normal.clone().transformDirection(h.object.matrixWorld);if(!e.src.userData.paintWallSloped&&Math.abs(n.y)>0.25)return null;return {e,face,n};}
// Flächenmitten/-normalen für "ganzer Raum"
let faceList=null;
function buildFaces(){faceList=[];const p=new THREE.Vector3(),a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3();
  PW.forEach(e=>{if(!e.merged&&!e.groups)prep(e);const pos=e.mesh.geometry.attributes.position;e.mesh.updateWorldMatrix(true,false);const mw=e.mesh.matrixWorld;
    e.groups.forEach(g=>{if(e.src.userData.paintFaces&&!e.src.userData.paintFaces.includes(g[2]))return;const s=e.start+g[0];if(g[1]<3)return;
      const ctr=new THREE.Vector3();for(let i=s;i<s+g[1];i++){p.fromBufferAttribute(pos,i).applyMatrix4(mw);ctr.add(p);}ctr.divideScalar(g[1]);
      a.fromBufferAttribute(pos,s).applyMatrix4(mw);b.fromBufferAttribute(pos,s+1).applyMatrix4(mw);c.fromBufferAttribute(pos,s+2).applyMatrix4(mw);
      const n=b.clone().sub(a).cross(c.clone().sub(a)).normalize();faceList.push({e,face:g[2],ctr,n});});});}
function paintRoom(hit,hex){const p=hit.point.clone().addScaledVector(hit.n,0.2),r=roomAt(p.x,p.y,p.z);if(!r)return 0;if(!faceList)buildFaces();
  const done=new Set();let k=0;faceList.forEach(f=>{if(Math.abs(f.n.y)>0.3)return;const q=f.ctr.clone().addScaledVector(f.n,0.2);
    if(q.x>r[2]&&q.x<r[3]&&q.z>r[4]&&q.z<r[5]&&f.ctr.y>r[6]-0.1&&f.ctr.y<r[6]+roomH(r)+0.1){const key=f.e.id+'|'+f.face;if(done.has(key))return;done.add(key);setFace(f.e,f.face,hex);k++;}});
  return k?r[0]:0;}
function resetWalls(){Object.keys(state.walls).forEach(id=>{const e=PW.get(id),w=state.walls[id];if(e&&w)w.forEach((hx,f)=>{if(hx)setFace(e,f,null);});});state.walls={};}
const SWATCHES=[['#F3F0EA','Warmweiß'],['#FFFFFF','Reinweiß'],['#E9E2D0','Creme'],['#D7C8AA','Leinen'],['#E8D0C2','Altrosa'],['#D9A88C','Terrakotta hell'],['#D8E6D5','Salbei'],['#B9C9B0','Graugrün'],['#C9DDE8','Nebelblau'],['#9FB3C8','Taubenblau'],['#CFCBC4','Kiesel'],['#6F7275','Anthrazit']];
let paintHex='#D8E6D5',paintRoomMode=false;

// =====================================================================
// Möbel: Stücke aus den vorhandenen Möbeln bilden (erst bei Bedarf)
// =====================================================================
let pieces=null;const pieceById=new Map(),pieceBySrc=new Map(),pieceByHandle=new Map();
function buildPieces(){if(pieces)return pieces;pieces=[];
  const furn=H.furnSrc.filter(m=>m.geometry&&m.geometry.attributes&&m.geometry.attributes.position);
  const items=furn.map(src=>{const rec=H.srcRec.get(src)||null;let handle=null,cont=null,gkey=null;
    if(rec){cont=rec.big.parent;let q=rec.parent;while(q&&q!==scene&&!idChain(q)){gkey=q;q=q.parent;}}
    else{handle=src;while(handle.parent&&!idChain(handle.parent))handle=handle.parent;cont=handle.parent;gkey=handle!==src?handle:null;}
    return {src,rec,handle,cont,gkey,box:worldBox(src,rec)};}).filter(it=>it.cont&&!it.box.isEmpty());
  // Union-Find: gleiche verschobene Gruppe oder sich berührend, aber nicht größer als ein Möbelstück
  const par=items.map((_,i)=>i),bx=items.map(it=>it.box.clone());
  const f=i=>{while(par[i]!==i){par[i]=par[par[i]];i=par[i];}return i;};
  const fits=b=>(b.max.x-b.min.x)<3.3&&(b.max.z-b.min.z)<3.3&&(b.max.y-b.min.y)<2.5;
  const uni=(i,j,force)=>{i=f(i);j=f(j);if(i===j)return;const b=bx[i].clone().union(bx[j]);if(!force&&!fits(b))return;par[j]=i;bx[i]=b;};
  const byG=new Map();items.forEach((it,i)=>{if(it.gkey){const a=byG.get(it.gkey);if(a===undefined)byG.set(it.gkey,i);else uni(a,i,true);}});
  // Gruppen, die zu groß sind (ganze Etagen o. ä.), wieder auflösen
  const big=new Set();items.forEach((it,i)=>{if(it.gkey&&!fits(bx[f(i)]))big.add(it.gkey);});
  if(big.size){items.forEach((it,i)=>{par[i]=i;bx[i]=it.box.clone();if(big.has(it.gkey)){it.gkey=null;if(!it.rec)it.handle=it.src;}});
    byG.clear();items.forEach((it,i)=>{if(it.gkey){const a=byG.get(it.gkey);if(a===undefined)byG.set(it.gkey,i);else uni(a,i,true);}});}
  const eps=0.015,ex=items.map(it=>it.box.clone().expandByScalar(eps));
  const ord=items.map((_,i)=>i).sort((a,b)=>items[a].box.min.x-items[b].box.min.x);
  for(let a=0;a<ord.length;a++){const i=ord[a];for(let c=a+1;c<ord.length;c++){const j=ord[c];if(items[j].box.min.x>ex[i].max.x)break;if(ex[i].intersectsBox(ex[j]))uni(i,j,false);}}
  const cl=new Map();items.forEach((it,i)=>{const r=f(i);let a=cl.get(r);if(!a)cl.set(r,a=[]);a.push(it);});
  const used=new Set();
  cl.forEach(list=>{const box=new THREE.Box3();list.forEach(it=>box.union(it.box));const c=box.getCenter(new THREE.Vector3());
    let id='m'+cm(c.x)+'_'+cm(c.z)+'_'+cm(box.min.y);while(used.has(id))id+='b';used.add(id);
    const pc={id,kind:'fixed',list,decos:[],box,pivot:new THREE.Vector3(c.x,box.min.y,c.z),cont:list[0].cont,room:roomAt(c.x,box.min.y+0.3,c.z)||null,wrap:null,dx:0,dz:0,ry:0,hidden:false};
    pieces.push(pc);pieceById.set(id,pc);list.forEach(it=>{pieceBySrc.set(it.src,pc);if(it.handle&&it.handle!==it.src)pieceByHandle.set(it.handle,pc);if(it.handle)pieceByHandle.set(it.handle,pc);});});
  // Deko, die auf oder in einem Möbelstück steht, wandert mit
  H.decoSrc.forEach(src=>{if(pieceBySrc.has(src)||!src.geometry||!src.geometry.attributes.position)return;const rec=H.srcRec.get(src)||null;const b=worldBox(src,rec);if(b.isEmpty())return;
    const c=b.getCenter(new THREE.Vector3());let best=null,bv=1e9;
    pieces.forEach(pc=>{const B=pc.box;if(c.x>B.min.x&&c.x<B.max.x&&c.z>B.min.z&&c.z<B.max.z&&b.min.y>B.min.y+0.05&&b.min.y<B.max.y+0.03){const s=B.getSize(new THREE.Vector3()),v=s.x*s.y*s.z;if(v<bv){bv=v;best=pc;}}});
    if(best){let handle=null,cont=null;if(rec)cont=rec.big.parent;else{handle=src;while(handle.parent&&!idChain(handle.parent))handle=handle.parent;cont=handle.parent;}
      if(!cont)return;best.decos.push({src,rec,handle,cont,deco:true});pieceBySrc.set(src,best);if(handle)pieceByHandle.set(handle,best);}});
  return pieces;}
// Einzelnes Möbelstück aus den zusammengefassten Meshes herauslösen und in eine eigene Gruppe setzen
function materialize(pc){if(pc.wrap)return pc.wrap;const cont=pc.cont,wrap=new THREE.Group(),inner=new THREE.Group();
  wrap.position.copy(pc.pivot);inner.position.copy(pc.pivot).negate();wrap.add(inner);cont.add(wrap);wrap.updateMatrixWorld(true);wrap.userData.piece=pc.id;
  const newF=[],newD=[],moved=new Set(),inv=new THREE.Matrix4();
  pc.list.concat(pc.decos).forEach(it=>{if(it.rec){const r=it.rec,big=r.big,G=big.geometry,ng=new THREE.BufferGeometry();
      ['position','normal','uv','color'].forEach(k=>{const A=G.attributes[k];if(!A)return;ng.setAttribute(k,new THREE.BufferAttribute(A.array.slice(r.start*A.itemSize,(r.start+r.count)*A.itemSize),A.itemSize));});
      if(big.parent!==cont){big.updateWorldMatrix(true,false);ng.applyMatrix4(inv.copy(cont.matrixWorld).invert().multiply(big.matrixWorld));}
      ng.computeBoundingSphere();const m=new THREE.Mesh(ng,big.userData.origMat||big.material);m.castShadow=big.castShadow;m.receiveShadow=big.receiveShadow;m.userData.piece=pc.id;inner.add(m);
      const P=G.attributes.position;for(let i=r.start;i<r.start+r.count;i++)P.setXYZ(i,0,0,0);P.needsUpdate=true;(it.deco?newD:newF).push(m);}
    else if(it.handle&&!moved.has(it.handle)){moved.add(it.handle);inner.attach(it.handle);}});
  wrap.traverse(o=>{if(o.isMesh)o.userData.piece=pc.id;});
  if(newF.length)H.addFurn(newF);if(newD.length)H.addDeco(newD);
  if(pc.list.some(it=>it.handle===H.diningSet))pc.light=H.dLight.position.clone();
  pc.wrap=wrap;H.dirty();return wrap;}
// Bestand eines Möbelstücks (fest übernommene Korrektur) und Vergleich damit
const baseOf=pc=>Object.assign({dx:0,dz:0,ry:0,hidden:false},pc.fest?null:BASE.pieces[pc.id]);
const atBase=pc=>{const b=baseOf(pc);return Math.abs(pc.dx-b.dx)<1e-3&&Math.abs(pc.dz-b.dz)<1e-3&&Math.abs(pc.ry-b.ry)<1e-3&&!!pc.hidden===!!b.hidden;};
const toBase=pc=>{const b=baseOf(pc);pc.dx=+b.dx||0;pc.dz=+b.dz||0;pc.ry=+b.ry||0;pc.hidden=!!b.hidden;};
function applyPiece(pc){materialize(pc);const w=pc.wrap;w.position.set(pc.pivot.x+pc.dx,pc.pivot.y,pc.pivot.z+pc.dz);w.rotation.y=pc.ry;w.visible=!pc.hidden;w.updateMatrixWorld(true);
  if(pc.light){H.dLight.position.copy(pc.light).sub(pc.pivot).applyAxisAngle(new THREE.Vector3(0,1,0),pc.ry).add(pc.pivot).add(new THREE.Vector3(pc.dx,0,pc.dz));}
  if(pc.kind==='fixed'){if(!atBase(pc))state.pieces[pc.id]={dx:+pc.dx.toFixed(3),dz:+pc.dz.toFixed(3),ry:+pc.ry.toFixed(4),hidden:pc.hidden||undefined};else delete state.pieces[pc.id];}
  else{const it=pc.item;it.x=+(pc.pivot.x+pc.dx).toFixed(3);it.z=+(pc.pivot.z+pc.dz).toFixed(3);it.ry=+pc.ry.toFixed(4);}
  H.dirty();save();if(sel===pc)updSel();}
function pieceOfHit(h){if(!h)return null;const o=h.object;if(o.userData.piece)return pieceById.get(o.userData.piece)||null;
  if(o.userData.recs){const r=recOfHit(h);return r?pieceBySrc.get(r.src)||null:null;}
  let q=o;while(q&&q!==scene){const p=pieceBySrc.get(q)||pieceByHandle.get(q);if(p)return p;q=q.parent;}return null;}

// =====================================================================
// Neue Möbel (Katalog)
// =====================================================================
const CAT={sofa:['Sofa',200,90,85,'#7A8A99'],sessel:['Sessel',85,85,80,'#B07A5A'],bett:['Bett',160,200,45,'#D9D2C5'],tisch:['Tisch',160,90,75,'#A8835B'],
  stuhl:['Stuhl',45,50,90,'#A8835B'],schreibtisch:['Schreibtisch',140,70,75,'#D8CBB5'],regal:['Regal',80,35,180,'#E8E2D6'],schrank:['Schrank',100,60,200,'#EFECE6'],
  kommode:['Kommode',120,45,80,'#EFECE6'],tv:['TV-Board',180,40,50,'#3E3B38'],teppich:['Teppich',200,140,1,'#C9B79C'],pflanze:['Pflanze',45,45,120,'#5E9A55'],
  ecksofa:['Ecksofa',260,170,85,'#7A8A99'],hocker:['Hocker',60,45,42,'#B07A5A'],bank:['Bank',160,38,46,'#A8835B'],rundtisch:['Runder Tisch',120,120,75,'#A8835B'],couchtisch:['Couchtisch',110,60,42,'#3E3B38'],stehlampe:['Stehlampe',40,40,180,'#2B2B2B']};
function buildItem(it){const W=it.w/100,D=it.d/100,Ht=it.h/100,m=H.M(it.c,0.85),dark=H.M('#3A3633',0.6),light=H.M('#F4F1EA',0.9),parts=[];
  const box=(x0,x1,y0,y1,z0,z1,mt)=>{const g=new THREE.BoxGeometry(Math.max(x1-x0,0.005),Math.max(y1-y0,0.003),Math.max(z1-z0,0.005));g.translate((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);parts.push([g,mt||m]);};
  const w=W/2,d=D/2,legs=(h,t,mt)=>{[[-w,-d],[w-t,-d],[-w,d-t],[w-t,d-t]].forEach(([x,z])=>box(x,x+t,0,h,z,z+t,mt));};
  switch(it.t){
    case 'sofa':case 'sessel':{const arm=Math.min(0.2,W*0.15),seat=Math.min(0.45,Ht*0.55);box(-w,w,0.06,seat,-d,d);box(-w,w,seat,Ht,d-0.2,d);box(-w,-w+arm,seat,Math.min(Ht,seat+0.2),-d,d-0.2);box(w-arm,w,seat,Math.min(Ht,seat+0.2),-d,d-0.2);legs(0.06,0.05,dark);break;}
    case 'bett':{box(-w,w,0.1,Ht*0.55,-d,d);box(-w+0.03,w-0.03,Ht*0.55,Ht,-d+0.03,d-0.03,light);box(-w,w,0.1,Math.max(Ht+0.45,0.9),d-0.06,d);legs(0.1,0.06,dark);break;}
    case 'tisch':case 'schreibtisch':{box(-w,w,Ht-0.04,Ht,-d,d);legs(Ht-0.04,0.05);break;}
    case 'stuhl':{const s=Math.min(0.46,Ht*0.5);box(-w,w,s-0.04,s,-d,d);legs(s-0.04,0.035);box(-w,w,s,Ht,d-0.04,d);break;}
    case 'regal':{const t=0.02,n=Math.max(2,Math.round(Ht/0.36));box(-w,-w+t,0,Ht,-d,d);box(w-t,w,0,Ht,-d,d);box(-w,w,0,Ht,d-0.008,d);for(let i=0;i<=n;i++){const y=Math.min(Ht-t,i*(Ht-t)/n);box(-w+t,w-t,y,y+t,-d,d-0.008);}break;}
    case 'schrank':case 'kommode':case 'tv':{box(-w,w,0.03,Ht,-d,d);box(-w+0.01,w-0.01,0,0.03,-d+0.02,d-0.02,dark);if(it.t==='schrank'&&W>0.6)box(-0.005,0.005,0.08,Ht-0.05,-d-0.004,-d,dark);else box(-w+0.04,w-0.04,Ht*0.5-0.004,Ht*0.5+0.004,-d-0.004,-d,dark);break;}
    case 'teppich':{box(-w,w,0,Math.max(Ht,0.006),-d,d);break;}
    case 'pflanze':{const pot=Math.min(0.35,Ht*0.3),pr=Math.min(w,d)*0.6,pg=new THREE.CylinderGeometry(pr,pr*0.8,pot,16);pg.translate(0,pot/2,0);parts.push([pg,H.M('#C0663F',0.8)]);
      const fg=new THREE.SphereGeometry(1,14,10);fg.scale(w,(Ht-pot)/2,d);fg.translate(0,pot+(Ht-pot)/2,0);parts.push([fg,m]);break;}
    case 'ecksofa':{const sd=Math.min(0.95,D*0.6),seat=Math.min(0.45,Ht*0.55),arm=Math.min(0.2,W*0.1);
      box(-w,w,0.06,seat,d-sd,d);box(-w,w,seat,Ht,d-0.2,d);box(-w,-w+arm,seat,Math.min(Ht,seat+0.2),d-sd,d-0.2);
      box(w-sd,w,0.06,seat,-d,d-sd);box(w-arm,w,seat,Math.min(Ht,seat+0.2),-d,d-sd);legs(0.06,0.05,dark);break;}
    case 'hocker':{box(-w,w,0.1,Ht,-d,d);legs(0.1,0.04,dark);break;}
    case 'bank':{box(-w,w,Ht-0.05,Ht,-d,d);legs(Ht-0.05,0.05);break;}
    case 'couchtisch':{box(-w,w,Ht-0.04,Ht,-d,d);legs(Ht-0.04,0.045,dark);break;}
    case 'rundtisch':{const r=Math.min(w,d),top=new THREE.CylinderGeometry(r,r,0.035,28);top.translate(0,Ht-0.0175,0);parts.push([top,m]);
      const col=new THREE.CylinderGeometry(0.05,0.05,Ht-0.06,12);col.translate(0,(Ht-0.06)/2+0.025,0);parts.push([col,dark]);const base=new THREE.CylinderGeometry(r*0.45,r*0.5,0.025,24);base.translate(0,0.0125,0);parts.push([base,dark]);break;}
    case 'stehlampe':{const r=Math.min(w,d),base=new THREE.CylinderGeometry(r*0.55,r*0.6,0.02,20);base.translate(0,0.01,0);parts.push([base,m]);
      const pole=new THREE.CylinderGeometry(0.012,0.012,Ht-0.26,8);pole.translate(0,(Ht-0.26)/2+0.02,0);parts.push([pole,m]);
      const sh=new THREE.CylinderGeometry(r*0.8,r,0.26,20);sh.translate(0,Ht-0.13,0);parts.push([sh,H.M('#F4F1EA',0.9)]);break;}
    default:box(-w,w,0,Ht,-d,d);}
  // je Material zu einem Mesh zusammenfassen (wenige Zeichenaufrufe)
  const g=new THREE.Group(),byM=new Map();parts.forEach(([geo,mt])=>{const a=byM.get(mt)||[];a.push(geo);byM.set(mt,a);});
  byM.forEach((list,mt)=>{const mesh=new THREE.Mesh(mergeGeos(list),mt);mesh.castShadow=it.t!=='teppich';mesh.receiveShadow=true;g.add(mesh);});
  return g;}
let itemSerial=1;const items=[];
function addItem(it,select){const pc={id:it.id||('n'+Date.now().toString(36)+(itemSerial++)),kind:'new',item:it,pivot:new THREE.Vector3(it.x,it.y,it.z),dx:0,dz:0,ry:it.ry||0,hidden:false,list:[],decos:[]};
  it.id=pc.id;const wrap=new THREE.Group();wrap.userData.piece=pc.id;const inner=buildItem(it);wrap.add(inner);scene.add(wrap);pc.wrap=wrap;
  wrap.traverse(o=>{if(o.isMesh)o.userData.piece=pc.id;});H.addFurn(inner.children.slice());pc.meshes=inner.children.slice();
  pc.room=roomAt(it.x,it.y+0.3,it.z)||null;pieceById.set(pc.id,pc);items.push(pc);if(!state.items.includes(it))state.items.push(it);applyPiece(pc);if(select)selectPiece(pc);return pc;}
// Fest übernommene zusätzliche Möbel (Bestand): verhalten sich wie vorhandene Möbel, Designänderungen sind Abweichungen davon
const festItems=[];
function addBaseItem(it){const pc={id:it.id,kind:'fixed',fest:true,item:it,pivot:new THREE.Vector3(it.x,it.y,it.z),dx:0,dz:0,ry:0,hidden:false,list:[],decos:[]};
  const wrap=new THREE.Group(),inner=buildItem(it);inner.rotation.y=it.ry||0;wrap.add(inner);wrap.position.copy(pc.pivot);scene.add(wrap);wrap.updateMatrixWorld(true);pc.wrap=wrap;
  wrap.traverse(o=>{if(o.isMesh)o.userData.piece=pc.id;});pc.meshes=inner.children.slice();H.addFurn(pc.meshes);pc.box=new THREE.Box3().setFromObject(wrap);
  pc.room=roomAt(it.x,it.y+0.3,it.z)||null;pieceById.set(pc.id,pc);festItems.push(pc);H.dirty();return pc;}
function applyBase(){if(Object.keys(BASE.pieces).length){buildPieces();Object.keys(BASE.pieces).forEach(id=>{const pc=pieceById.get(id);if(pc&&!pc.fest){toBase(pc);applyPiece(pc);}});}
  BASE.items.forEach(it=>{if(it&&it.id&&CAT[it.t]&&!pieceById.has(it.id))addBaseItem(it);});}
// Aktuelle Lage eines Möbelstücks als Status quo festschreiben (Korrektur) -> src/config/bestand.js
function commitPiece(pc,remove){let keep=pc;
  if(pc.kind==='new'){const it=Object.assign({},pc.item);removeItem(pc);BASE.items.push(it);keep=addBaseItem(it);}
  else if(pc.fest){const it=pc.item;
    if(remove){BASE.items.splice(BASE.items.indexOf(it),1);H.removeFurn(pc.meshes);scene.remove(pc.wrap);pieceById.delete(pc.id);festItems.splice(festItems.indexOf(pc),1);delete state.pieces[pc.id];keep=null;}
    else{it.x=+(pc.pivot.x+pc.dx).toFixed(3);it.z=+(pc.pivot.z+pc.dz).toFixed(3);it.ry=+((it.ry||0)+pc.ry).toFixed(4);pc.pivot.set(it.x,it.y,it.z);pc.wrap.children[0].rotation.y=it.ry;pc.dx=pc.dz=pc.ry=0;pc.room=roomAt(it.x,it.y+0.3,it.z)||pc.room;applyPiece(pc);}}
  else{if(remove)pc.hidden=true;const v={dx:+pc.dx.toFixed(3),dz:+pc.dz.toFixed(3),ry:+pc.ry.toFixed(4)};if(pc.hidden)v.hidden=true;
    if(v.dx||v.dz||v.ry||v.hidden)BASE.pieces[pc.id]=v;else delete BASE.pieces[pc.id];applyPiece(pc);}
  selectPiece(remove?null:keep);H.dirty();save();
  return saveBase().then(ok=>{if(ok)H.toast(remove?'Aus dem Bestand entfernt':'Fest übernommen (src/config/bestand.js)');render();});}
function rebuildItem(pc){const it=pc.item;H.removeFurn(pc.meshes);pc.wrap.remove(pc.wrap.children[0]);const inner=buildItem(it);pc.wrap.add(inner);
  inner.traverse(o=>{if(o.isMesh)o.userData.piece=pc.id;});pc.meshes=inner.children.slice();H.addFurn(pc.meshes);H.dirty();save();updSel(true);}
function removeItem(pc){H.removeFurn(pc.meshes);scene.remove(pc.wrap);pieceById.delete(pc.id);items.splice(items.indexOf(pc),1);state.items=state.items.filter(x=>x!==pc.item);if(sel===pc)selectPiece(null);H.dirty();save();}
function placePoint(){const r=cv.getBoundingClientRect(),e={clientX:r.left+r.width/2,clientY:r.top+r.height*0.62};setRay(e);
  let p=null;const hs=rc.intersectObjects(scene.children,true);
  for(const h of hs){const o=h.object;if(!o.isMesh||o.userData.helper||!shown(o)||!h.face)continue;const m=Array.isArray(o.material)?o.material[0]:o.material;if(m&&m.transparent&&m.opacity<0.6)continue;
    const n=h.face.normal.clone().transformDirection(o.matrixWorld);if(pieceOfHit(h))continue;if(n.y>0.7){p=h.point.clone();}break;}
  // Raum der Kamera (Innenansicht) bzw. des Blickziels; Punkt in diesen Raum holen
  const c=camera.position,t=controls.target,room=(p&&roomAt(p.x,p.y+0.3,p.z))||roomAt(c.x,c.y-1.0,c.z)||roomAt(t.x,t.y,t.z)||roomAt(t.x,t.y+0.5,t.z);
  if(!room){if(p)return p;const pl=new THREE.Plane(new THREE.Vector3(0,1,0),0),q=new THREE.Vector3();return rc.ray.intersectPlane(pl,q)?q:new THREE.Vector3(t.x,0,t.z);}
  if(!p||!(p.x>room[2]&&p.x<room[3]&&p.z>room[4]&&p.z<room[5])){const pl=new THREE.Plane(new THREE.Vector3(0,1,0),-room[6]),q=new THREE.Vector3();p=rc.ray.intersectPlane(pl,q)?q:new THREE.Vector3((room[2]+room[3])/2,room[6],(room[4]+room[5])/2);p.y=room[6];}
  const ix=Math.min(0.5,(room[3]-room[2])/2),iz=Math.min(0.5,(room[5]-room[4])/2);p.x=Math.min(room[3]-ix,Math.max(room[2]+ix,p.x));p.z=Math.min(room[5]-iz,Math.max(room[4]+iz,p.z));return p;}

// =====================================================================
// Auswahl, Ziehen, Drehen
// =====================================================================
let sel=null,selBox=null,selDoor=null;const movable=()=>tool==='move'||tool==='new'||tool==='catalog';
function showBox(obj){if(selBox){scene.remove(selBox);selBox=null;}
  if(obj){selBox=new THREE.BoxHelper(obj,0xE3B448);selBox.material.depthTest=false;selBox.material.transparent=true;selBox.renderOrder=999;selBox.userData.helper=1;scene.add(selBox);}}
function selectPiece(pc){sel=pc;if(pc)selDoor=null;showBox(pc?(pc.wrap||materialize(pc)):null);render();}
function sizeOf(pc){if(pc.item)return [pc.item.w/100,pc.item.d/100,pc.item.h/100];const s=pc.box.getSize(new THREE.Vector3());return [s.x,s.z,s.y];}
function updSel(full){if(selBox&&sel){selBox.setFromObject(sel.wrap);}if(full!==false&&sel&&movable())renderSelInfo();}
const clampTo=(pc,x,z)=>{const r=pc.room;if(!r)return [x,z];return [Math.min(r[3]-0.1,Math.max(r[2]+0.1,x)),Math.min(r[5]-0.1,Math.max(r[4]+0.1,z))];};
let drag=null,pointers=0,lastPieceDown=0;H.navBlock=()=>H.editMode&&performance.now()-lastPieceDown<700;const plane=new THREE.Plane(),hp=new THREE.Vector3();
cv.addEventListener('pointerdown',e=>{pointers++;if(!H.editMode)return;
  if(drag&&pointers>1){drag=null;controls.enabled=true;return;}
  if(!movable())return;if(e.button!==undefined&&e.button!==0)return;
  if(tool==='move')buildPieces();const h=firstHit(e),pc=pieceOfHit(h);if(!pc)return;
  if(pc.hidden)return;lastPieceDown=performance.now();materialize(pc);plane.set(new THREE.Vector3(0,1,0),-pc.pivot.y);setRay(e);if(!rc.ray.intersectPlane(plane,hp))return;
  controls.enabled=false;drag={pc,ox:pc.pivot.x+pc.dx-hp.x,oz:pc.pivot.z+pc.dz-hp.z,sx:e.clientX,sy:e.clientY,moved:false};cv.style.cursor='grabbing';},{capture:true});
window.addEventListener('pointermove',e=>{if(!drag)return;if(!drag.moved&&Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)>5){drag.moved=true;if(sel!==drag.pc)selectPiece(drag.pc);}
  if(!drag.moved)return;setRay(e);if(!rc.ray.intersectPlane(plane,hp))return;const pc=drag.pc;let [x,z]=clampTo(pc,hp.x+drag.ox,hp.z+drag.oz);
  pc.dx=x-pc.pivot.x;pc.dz=z-pc.pivot.z;applyPiece(pc);});
const endPtr=e=>{pointers=Math.max(0,pointers-1);if(!drag)return;const d=drag;drag=null;controls.enabled=true;cv.style.cursor='';if(!d.moved)selectPiece(sel===d.pc?null:d.pc);};
window.addEventListener('pointerup',endPtr);window.addEventListener('pointercancel',endPtr);
const rot=(pc,s)=>{pc.ry=Math.round((pc.ry+s*Math.PI/12)/(Math.PI/12))*(Math.PI/12);applyPiece(pc);};
window.addEventListener('keydown',e=>{if(!H.editMode||!sel||/INPUT|TEXTAREA/.test(document.activeElement&&document.activeElement.tagName))return;
  if(e.key==='q'||e.key==='Q')rot(sel,1);else if(e.key==='e'||e.key==='E')rot(sel,-1);else if(e.key==='Escape')selectPiece(null);
  else if(e.key==='Delete'&&sel.kind==='new')removeItem(sel);});

// =====================================================================
// Maßband
// =====================================================================
const gMeas=new THREE.Group();scene.add(gMeas);let measA=null,measN=0;
const hm=c=>new THREE.MeshBasicMaterial({color:c,depthTest:false,transparent:true});
function textSprite(t){const c=document.createElement('canvas'),x=c.getContext('2d');c.width=256;c.height=72;x.fillStyle='rgba(255,252,246,.95)';x.strokeStyle='#C99A2E';x.lineWidth=4;
  x.beginPath();if(x.roundRect)x.roundRect(4,4,248,64,30);else x.rect(4,4,248,64);x.fill();x.stroke();x.fillStyle='#2B2A27';x.font='600 38px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,128,38);
  const tx=new THREE.CanvasTexture(c);tx.encoding=THREE.sRGBEncoding;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,depthTest:false,transparent:true}));s.scale.set(0.62,0.175,1);s.renderOrder=1000;return s;}
function dot(p){const m=new THREE.Mesh(new THREE.SphereGeometry(0.025,12,8),hm(0xC99A2E));m.position.copy(p);m.renderOrder=1000;m.userData.helper=1;gMeas.add(m);return m;}
function measure(e){const h=firstHit(e);if(!h)return;const p=h.point.clone();
  if(!measA){measA={p,d:dot(p)};H.toast('Zweiten Punkt antippen');return;}
  const a=measA.p;dot(p);const lg=new THREE.BufferGeometry().setFromPoints([a,p]);const ln=new THREE.Line(lg,new THREE.LineBasicMaterial({color:0xC99A2E,depthTest:false,transparent:true}));ln.renderOrder=1000;gMeas.add(ln);
  const d=a.distanceTo(p),dh=Math.hypot(p.x-a.x,p.z-a.z),dy=Math.abs(p.y-a.y);const s=textSprite(fmt(d));s.position.copy(a).add(p).multiplyScalar(0.5).add(new THREE.Vector3(0,0.12,0));gMeas.add(s);
  lastMeasObj={a:a.clone(),p:p.clone(),d,dh,dy};measA=null;measN++;lastMeas=fmt(d)+(dy>0.05&&dh>0.05?' (waagerecht '+fmt(dh)+', Höhe '+fmt(dy)+')':'');H.toast(fmt(d));if(tool==='measure')render();}
let lastMeas='';
function clearMeas(){while(gMeas.children.length){const o=gMeas.children.pop();o.geometry&&o.geometry.dispose();}measA=null;measN=0;lastMeas='';lastMeasObj=null;}

// =====================================================================
// Türen: Design der Drehflügeltüren (Blatt-Material, Kassetten)
// =====================================================================
const DOOR_STYLES={original:['Original'],weiss:['Weiß glatt','#F6F4EF'],kassetten:['Kassetten','#F6F4EF'],anthrazit:['Anthrazit','#3A3D42'],eiche:['Eiche hell'],nuss:['Nussbaum'],glas:['Milchglas']};
const PAINTED=s=>s==='weiss'||s==='kassetten'||s==='anthrazit';
const matCache=new Map();
function woodTex(base,dark,boards){return H.canvasTex(256,512,(x,w,h)=>{x.fillStyle=base;x.fillRect(0,0,w,h);let sd=7;const r=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};
  for(let i=0;i<80;i++){const gx=r()*w;x.strokeStyle=dark;x.globalAlpha=0.06+r()*0.16;x.lineWidth=0.5+r()*2;x.beginPath();x.moveTo(gx,0);for(let y=0;y<=h;y+=24)x.lineTo(gx+Math.sin(y/70+i)*2.5,y);x.stroke();}
  if(boards){x.globalAlpha=0.6;x.fillStyle=dark;for(let k=1;k<boards;k++)x.fillRect(Math.round(k*w/boards)-1,0,2,h);}x.globalAlpha=1;},null);}
function doorMat(style,hex){const key='door|'+style+'|'+(hex||'');let m=matCache.get(key);if(m)return m;
  if(style==='eiche')m=new THREE.MeshStandardMaterial({map:woodTex('#D9B98A','#8A5A2E',0),roughness:0.6});
  else if(style==='nuss')m=new THREE.MeshStandardMaterial({map:woodTex('#6E4A33','#2E1A0E',0),roughness:0.55});
  else if(style==='glas')m=new THREE.MeshStandardMaterial({color:col('#E8EEF0'),transparent:true,opacity:0.6,roughness:0.25});
  else m=H.Mu(hex||DOOR_STYLES[style][1]||'#F6F4EF',0.45);
  matCache.set(key,m);return m;}
let doorList=null;const doorByPv=new Map(),doorById=new Map();
// Türen erkennen: Drehgruppen (swing um y) bzw. makeDoor-Türen, deren größtes Teil ein hohes, dünnes Blatt ist
function buildDoors(){if(doorList)return doorList;doorList=[];
  const cand=H.anims.filter(a=>a.pv&&a.axis==='y'&&!a.pv.userData.gate).map(a=>({pv:a.pv,toggle:()=>{a.target=a.target?0:a.open;}})).concat(H.doors.map(d=>({pv:d.g,toggle:()=>H.toggleDoor(d)})));
  const inv=new THREE.Matrix4(),mm=new THREE.Matrix4(),sz=new THREE.Vector3();
  cand.forEach(c=>{const pv=c.pv;if(doorByPv.has(pv))return;pv.updateWorldMatrix(true,true);inv.copy(pv.matrixWorld).invert();let leaf=null,lb=null,best=0;
    pv.traverse(o=>{if(!o.isMesh||!o.geometry||!o.geometry.attributes||!o.geometry.attributes.position||o.userData.navPortal)return;const g=o.geometry;if(!g.boundingBox)g.computeBoundingBox();
      const b=g.boundingBox.clone().applyMatrix4(mm.multiplyMatrices(inv,o.matrixWorld));b.getSize(sz);const thin=Math.min(sz.x,sz.z),wide=Math.max(sz.x,sz.z);
      if(sz.y<1.7||thin>0.12||wide<0.55||wide>1.3)return;const area=wide*sz.y;if(area>best){best=area;leaf=o;lb=b;}});
    if(!leaf)return;const wp=pv.getWorldPosition(new THREE.Vector3());let id='d'+cm(wp.x)+'_'+cm(wp.y)+'_'+cm(wp.z);while(doorById.has(id))id+='b';
    lb.getSize(sz);const thin=sz.x<sz.z?'x':'z',wide=Math.max(sz.x,sz.z),n=new THREE.Vector3(thin==='x'?1:0,0,thin==='z'?1:0).transformDirection(pv.matrixWorld);
    const ctr=lb.getCenter(new THREE.Vector3()).applyMatrix4(pv.matrixWorld),rs=[];[1,-1].forEach(s=>{const q=ctr.clone().addScaledVector(n,s*0.4);const r=roomAt(q.x,q.y,q.z);if(r&&!rs.includes(r))rs.push(r);});
    const d={id,pv,leaf,box:lb,thin,toggle:c.toggle,orig:leaf.material,deco:null,style:'original',c:null,cab:sz.y<1.85&&wide<0.62};
    d.name=(d.cab?'Schranktür':'Tür')+(rs.length?' · '+rs.map(r=>r[0]).join(' / '):'');
    doorList.push(d);doorByPv.set(pv,d);doorById.set(id,d);});
  return doorList;}
function doorOfHit(h){if(!h)return null;let q=h.object;while(q&&q!==scene){const d=doorByPv.get(q);if(d)return d;q=q.parent;}return null;}
// Kassetten: je Blattseite zwei aufgesetzte Rahmen, als ein Mesh
function doorPanels(d,m){const b=d.box,g=[],t=d.thin,y0=b.min.y,hh=b.max.y-y0,lo=t==='x'?b.min.z:b.min.x,hi=t==='x'?b.max.z:b.max.x,f0=t==='x'?b.min.x:b.min.z,f1=t==='x'?b.max.x:b.max.z;
  const strip=(a0,a1,ya,yb,fa,fb)=>{const G=new THREE.BoxGeometry(t==='x'?fb-fa:a1-a0,yb-ya,t==='x'?a1-a0:fb-fa);G.translate(t==='x'?(fa+fb)/2:(a0+a1)/2,(ya+yb)/2,t==='x'?(a0+a1)/2:(fa+fb)/2);g.push(G);};
  const ins=0.1,sw=0.045,pr=0.006;[[0.07,0.44],[0.52,0.93]].forEach(([p0,p1])=>{const ya=y0+hh*p0,yb=y0+hh*p1;[[f0-pr,f0+0.001],[f1-0.001,f1+pr]].forEach(([fa,fb])=>{
    strip(lo+ins,lo+ins+sw,ya,yb,fa,fb);strip(hi-ins-sw,hi-ins,ya,yb,fa,fb);strip(lo+ins,hi-ins,ya,ya+sw,fa,fb);strip(lo+ins,hi-ins,yb-sw,yb,fa,fb);});});
  const mesh=new THREE.Mesh(mergeGeos(g),Array.isArray(m)?m[0]:m);mesh.receiveShadow=true;mesh.userData.doorDeco=1;d.pv.add(mesh);return mesh;}
function applyDoor(d){const st=DOOR_STYLES[d.style]?d.style:'original';d.style=st;const m=st==='original'?d.orig:doorMat(st,PAINTED(st)?d.c:null);
  d.leaf.material=Array.isArray(d.orig)&&!Array.isArray(m)?d.orig.map(()=>m):m;
  if(d.deco){d.pv.remove(d.deco);d.deco.geometry.dispose();d.deco=null;}
  if(st==='kassetten')d.deco=doorPanels(d,m);
  if(st==='original')delete state.doors[d.id];else state.doors[d.id]={s:st,c:PAINTED(st)&&d.c?d.c:undefined};
  H.dirty();save();}
function resetDoors(){if(doorList)doorList.forEach(d=>{if(d.style!=='original'){d.style='original';d.c=null;applyDoor(d);}});state.doors={};}
function selectDoor(d){selDoor=d;if(d)sel=null;showBox(d?d.leaf:null);render();}
function renderDoorSel(){const box=$('eDoorSel');if(!box)return;if(!selDoor){box.innerHTML='';return;}const d=selDoor;
  box.innerHTML='<div class="sel"><div class="row"><b>'+esc(d.name)+'</b><span class="muted">'+esc(DOOR_STYLES[d.style][0])+'</span><button id="eDTog" style="margin-left:auto">Auf / Zu</button><button id="eDDone">Fertig</button></div>'+
    '<div class="row">'+Object.keys(DOOR_STYLES).map(k=>'<button data-ds="'+k+'" aria-pressed="'+(d.style===k)+'">'+DOOR_STYLES[k][0]+'</button>').join('')+'</div>'+
    '<div class="row"><label class="chk">Farbe <input type="color" id="eDCol" value="'+(d.c||DOOR_STYLES[d.style][1]||'#f6f4ef').toLowerCase()+'"'+(PAINTED(d.style)?'':' disabled')+'></label><span class="muted">bei Weiß glatt, Kassetten, Anthrazit</span><button id="eDAll" style="margin-left:auto">Auf alle '+(d.cab?'Schranktüren':'Türen')+' anwenden</button></div></div>';
  box.querySelectorAll('[data-ds]').forEach(b=>b.onclick=()=>{d.style=b.dataset.ds;applyDoor(d);renderDoorSel();});
  $('eDCol').oninput=e=>{d.c=e.target.value.toUpperCase();applyDoor(d);};
  $('eDTog').onclick=()=>{d.toggle();showBox(null);H.dirty();};$('eDDone').onclick=()=>selectDoor(null);
  $('eDAll').onclick=()=>{let k=0;buildDoors().forEach(o=>{if(o===d||o.cab!==d.cab)return;o.style=d.style;o.c=d.c;applyDoor(o);k++;});H.toast(k+' weitere '+(d.cab?'Schranktüren':'Türen')+' geändert');};}

// =====================================================================
// Flügeltor vor der Garage (zweiflügelig, Material wählbar; in gRoof, also in den Hof-Ansichten)
// =====================================================================
const GATE_MATS={laerche:['Lärche natur, Bretter','wood','#D4AE78','#7A5A30'],eiche:['Eiche dunkel, Bretter','wood','#7E5E40','#3A2512'],anthrazit:['Stahl anthrazit (RAL 7016)','metal','#383B40'],gruen:['Stahl moosgrün (RAL 6005)','metal','#2E4A3A'],
  rot:['Stahl weinrot (RAL 3005)','metal','#5E1F26'],weiss:['Aluminium weiß','metal','#F2F1EC'],edelstahl:['Edelstahl gebürstet','steel','#B8BCC0'],eigene:['Eigene Farbe (glatt)','metal',null]};
let gate=null;const gateCfg={an:false,mat:'laerche',c:'#6B7F6A',fenster:false,sekt:false};
function gateMats(key){const G=GATE_MATS[key]||GATE_MATS.laerche,hex=key==='eigene'?gateCfg.c:G[2],k='gate|'+key+'|'+hex;let m=matCache.get(k);if(m)return m;
  if(G[1]==='wood')m={frame:H.Mu(G[2],0.7),panel:new THREE.MeshStandardMaterial({map:woodTex(G[2],G[3],9),roughness:0.7})};
  else if(G[1]==='steel'){const s=H.Mu(hex,0.35,{metalness:0.85});m={frame:s,panel:s};}
  else{const s=H.Mu(hex,0.5,{metalness:0.25});m={frame:s,panel:s};}
  matCache.set(k,m);return m;}
function buildGate(){if(gate)return gate;const {B,gRoof,NF,gx0,gx1,CF}=H,grp=new THREE.Group();grp.userData.gate=1;gRoof.add(grp);
  const z=NF+0.14,y0=CF+0.02,hgt=2.0,LW=(gx1-gx0-0.16)/2-0.012,mats=gateMats(gateCfg.mat),glass=new THREE.MeshStandardMaterial({color:col('#CFE6F2'),transparent:true,opacity:0.35,roughness:0.1}),hdlM=H.Mu('#C8CCD0',0.3,{metalness:0.7});
  const leaves=[],all=[];
  [[gx0+0.08,1],[gx1-0.08,-1]].forEach(([hx,s])=>{const pv=new THREE.Group();pv.position.set(hx,y0,z);pv.userData.gate=1;grp.add(pv);const X=(a,b)=>[Math.min(s*a,s*b),Math.max(s*a,s*b)];
    const bx=(a,b,ya,yb,za,zb,m,nb)=>{const r=X(a,b),q=B(r[0],r[1],ya,yb,za,zb,m,pv);q.castShadow=true;q.receiveShadow=true;if(nb!==false)q.userData.navBlocker=1;all.push(q);return q;};
    const fr=[bx(0,0.07,0,hgt,-0.03,0.03,mats.frame),bx(LW-0.07,LW,0,hgt,-0.03,0.03,mats.frame),bx(0.07,LW-0.07,0,0.1,-0.03,0.03,mats.frame),bx(0.07,LW-0.07,hgt-0.08,hgt,-0.03,0.03,mats.frame)];
    const wy0=1.42,wy1=1.8,panels=[bx(0.07,LW-0.07,0.1,wy0,-0.02,0.02,mats.panel),bx(0.07,LW-0.07,wy1,hgt-0.08,-0.02,0.02,mats.panel)],bandSolid=bx(0.07,LW-0.07,wy0,wy1,-0.02,0.02,mats.panel);
    const wins=[],mull=[];const xs=[0.18,0.5,0.82].map(f=>0.07+(LW-0.14)*f),hw=Math.min(0.14,(LW-0.14)/8);let prev=0.07;
    xs.forEach(c=>{mull.push(bx(prev,c-hw,wy0,wy1,-0.02,0.02,mats.frame));wins.push(bx(c-hw,c+hw,wy0+0.03,wy1-0.03,-0.006,0.006,glass));mull.push(bx(c-hw,c+hw,wy0,wy0+0.03,-0.02,0.02,mats.frame));mull.push(bx(c-hw,c+hw,wy1-0.03,wy1,-0.02,0.02,mats.frame));prev=c+hw;});
    mull.push(bx(prev,LW-0.07,wy0,wy1,-0.02,0.02,mats.frame));
    bx(LW-0.22,LW-0.09,1.0,1.03,-0.07,-0.03,hdlM,false);bx(LW-0.12,LW-0.09,0.98,1.05,-0.03,0.03,hdlM,false);
    const a=H.swing(pv,'y',s*1.5);leaves.push({pv,a,fr,panels,bandSolid,wins,mull});});
  const toggle=()=>{leaves.forEach(l=>{l.a.target=l.a.target?0:l.a.open;});H.dirty();};H.clickable(all,toggle);
  gate={grp,leaves,toggle};return gate;}
function applyGate(){const c=gateCfg;
  if(!c.an){if(gate)gate.grp.visible=false;H.garPans.forEach(m=>m.visible=true);state.tor=null;}
  else{buildGate();gate.grp.visible=true;const mats=gateMats(c.mat);
    gate.leaves.forEach(l=>{l.fr.forEach(m=>m.material=mats.frame);l.panels.forEach(m=>m.material=mats.panel);l.bandSolid.material=mats.panel;l.mull.forEach(m=>{m.material=mats.frame;m.visible=c.fenster;});l.wins.forEach(m=>m.visible=c.fenster);l.bandSolid.visible=!c.fenster;});
    H.garPans.forEach(m=>m.visible=!c.sekt);state.tor={mat:c.mat,c:c.mat==='eigene'?c.c:undefined,fenster:c.fenster||undefined,sekt:c.sekt||undefined};}
  H.dirty();save();}
function gateHtml(){const c=gateCfg;return '<div class="sub"><div class="row"><label class="chk"><input type="checkbox" id="eGOn"'+(c.an?' checked':'')+'> <b>Flügeltor vor der Garage</b></label><span class="muted">zweiflügelig, öffnet zum Hof – zu sehen in den Hof-Ansichten</span></div>'+
  '<div class="row"><label class="chk">Material <select id="eGMat">'+Object.keys(GATE_MATS).map(k=>'<option value="'+k+'"'+(c.mat===k?' selected':'')+'>'+GATE_MATS[k][0]+'</option>').join('')+'</select></label><input type="color" id="eGCol" value="'+c.c.toLowerCase()+'" aria-label="Eigene Farbe" title="Eigene Farbe"'+(c.mat==='eigene'?'':' disabled')+'></div>'+
  '<div class="row"><label class="chk"><input type="checkbox" id="eGWin"'+(c.fenster?' checked':'')+'> Fenster oben</label><label class="chk"><input type="checkbox" id="eGSekt"'+(c.sekt?' checked':'')+'> Sektionaltor ausblenden</label><button id="eGTog">Tor auf / zu</button><button id="eGView" style="margin-left:auto">Zum Hof schauen</button></div></div>';}
function bindGate(){$('eGOn').onchange=e=>{gateCfg.an=e.target.checked;applyGate();if(gateCfg.an&&!H.isFacade())H.toast('Tor eingebaut – „Zum Hof schauen“ zeigt es');};
  $('eGMat').onchange=e=>{gateCfg.mat=e.target.value;if(!gateCfg.an){gateCfg.an=true;$('eGOn').checked=true;}applyGate();$('eGCol').disabled=gateCfg.mat!=='eigene';};
  $('eGCol').oninput=e=>{gateCfg.c=e.target.value.toUpperCase();if(gateCfg.mat==='eigene'&&gateCfg.an)applyGate();};
  $('eGWin').onchange=e=>{gateCfg.fenster=e.target.checked;if(gateCfg.an)applyGate();};$('eGSekt').onchange=e=>{gateCfg.sekt=e.target.checked;if(gateCfg.an)applyGate();};
  $('eGTog').onclick=()=>{if(!gateCfg.an){H.toast('Erst das Flügeltor einbauen');return;}gate.toggle();};
  $('eGView').onclick=()=>{const vs=$('viewSel');if(vs){vs.value='hof';vs.dispatchEvent(new Event('change'));}};}

// =====================================================================
// Katalog (Quellen und Artikel: katalog.js)
// =====================================================================
let kat=null,katLoading=false,katQ='',katCat='';const katCol={};
const eur=v=>v==null?'':Math.round(v).toLocaleString('de-DE')+' €';
function loadKat(){if(kat||katLoading)return;if(!window.KATALOG){kat=[];return;}katLoading=true;
  window.KATALOG.laden().then(l=>{kat=l;}).catch(()=>{kat=[];}).then(()=>{katLoading=false;if(tool==='catalog')render();});}
function katRows(){const q=katQ.trim().toLowerCase();return (kat||[]).filter(a=>(!katCat||a.kat===katCat)&&(!q||(a.name+' '+a.marke+' '+a.kat+' '+(a.material||'')).toLowerCase().includes(q)));}
function renderKat(){const list=$('eKList');if(!list)return;const rows=katRows(),MAXR=80;
  list.innerHTML=(rows.length?rows.slice(0,MAXR).map(a=>{const ci=katCol[a.id]||0;return '<div class="krow"><div class="kinfo"><b>'+esc(a.name)+'</b><div class="muted">'+esc(a.marke)+' · '+a.b+' × '+a.t+' × '+a.h+' cm · '+eur(a.preis)+(a.material?' · '+esc(a.material):'')+'</div>'+(a.text?'<div class="muted">'+esc(a.text)+'</div>':'')+'</div>'+
      '<div class="row">'+(a.farben||[]).map((f,i)=>'<button class="sw sm" data-kc="'+a.id+'|'+i+'" title="'+esc(f[1])+'" aria-label="'+esc(f[1])+'" aria-pressed="'+(ci===i)+'" style="--swatch:'+f[0]+'"></button>').join('')+'<button data-ins="'+a.id+'">Einfügen</button></div></div>';}).join('')
    :'<div class="muted">'+(kat?'Nichts gefunden.':'Katalog wird geladen …')+'</div>')+(rows.length>MAXR?'<div class="muted">Nur die ersten '+MAXR+' Treffer – bitte Suche eingrenzen.</div>':'');
  list.querySelectorAll('[data-kc]').forEach(b=>b.onclick=()=>{const [id,i]=b.dataset.kc.split('|');katCol[id]=+i;renderKat();});
  list.querySelectorAll('[data-ins]').forEach(b=>b.onclick=()=>{const a=rows.find(x=>x.id===b.dataset.ins);if(!a)return;const f=(a.farben||[])[katCol[a.id]||0],p=placePoint();
    addItem({t:CAT[a.form]?a.form:'schrank',w:a.b,d:a.t,h:a.h,c:f?f[0]:'#CFCBC4',x:+p.x.toFixed(3),y:+p.y.toFixed(3),z:+p.z.toFixed(3),ry:0,p:a.id,n:a.name,mk:a.marke,pr:a.preis},true);H.toast(a.name+' eingefügt');});}

// =====================================================================
// Maßregister: gemessen / geschätzt / unbekannt (Dateien src/masse/*.js + eigene Nachmessungen)
// =====================================================================
const K_MASS='haus3d-masse-v1';
const MKAT={raeume:'Räume',innenwaende:'Innenwände',aussenwaende:'Außenwände',tueren:'Türen',fenster:'Fenster',moebel:'Möbel',sonstiges:'Sonstiges'};
const QUELLE={gemessen:'Gemessen',geschaetzt:'Geschätzt',unbekannt:'Unbekannt'};
let massUser=LS.get(K_MASS,{});if(!massUser||typeof massUser!=='object'||Array.isArray(massUser))massUser={};
let lastMeasObj=null,massKat='',massQ='',massEdit=null,massOpen=false;
const massSave=()=>LS.set(K_MASS,massUser);
// Einträge, deren Modellwert zur Laufzeit aus dem Modell kommt: Räume (ROOMS) und Türen (Türregister)
function massAuto(){const out=[];
  rooms().forEach(r=>{out.push({id:'raum.'+r[1]+'.breite',kat:'raeume',name:r[0]+' – Breite (x)',raum:r[0],modell:+(r[3]-r[2]).toFixed(3),quelle:'unbekannt'});out.push({id:'raum.'+r[1]+'.tiefe',kat:'raeume',name:r[0]+' – Tiefe (z)',raum:r[0],modell:+(r[5]-r[4]).toFixed(3),quelle:'unbekannt'});});
  const s=new THREE.Vector3();buildDoors().forEach(d=>{d.box.getSize(s);const rn=d.name.replace(/^(Schrank)?[Tt]ür( · )?/,'');
    out.push({id:'tuer.'+d.id+'.breite',kat:'tueren',name:d.name+' – Breite',raum:rn,modell:+Math.max(s.x,s.z).toFixed(3),quelle:'unbekannt'});out.push({id:'tuer.'+d.id+'.hoehe',kat:'tueren',name:d.name+' – Höhe',raum:rn,modell:+s.y.toFixed(3),quelle:'unbekannt'});});
  return out;}
// Konstanten aus src/config/masse.js, die ein Registereintrag bestimmt: konst 'A' oder 'A-B' (z. B. 'VX1-VX0')
const KV=H.konst||{};
const kParse=s=>{const m=/^(\w+)(?:-(\w+))?$/.exec(s||'');return m&&typeof KV[m[1]]==='number'&&(!m[2]||typeof KV[m[2]]==='number')?m:null;};
function massMigrate(){const ids=Object.keys(massUser);if(!ids.length)return;ids.forEach(id=>{MCFG.register[id]=Object.assign({},MCFG.register[id]||{},massUser[id]);});
  saveMasse().then(ok=>{if(!ok)return;massUser={};massSave();H.toast(ids.length+' Nachmessungen ins Projekt übernommen');if(H.editMode&&tool==='measure')render();});}
let massConfirm=null;
function massAll(){const map=new Map();massAuto().forEach(e=>map.set(e.id,e));
  ((window.MASSE&&window.MASSE.eintraege)||[]).forEach(e=>{if(!e||!e.id)return;const n=Object.assign({quelle:'unbekannt'},map.get(e.id)||{},e,{datei:true});const k=kParse(e.konst);if(k)n.modell=+(KV[k[1]]-(k[2]?KV[k[2]]:0)).toFixed(3);map.set(e.id,n);});
  Object.keys(MCFG.register).forEach(id=>{const u=MCFG.register[id];if(!u||typeof u!=='object')return;map.set(id,Object.assign({quelle:'unbekannt',id},map.get(id)||{},u,{id,eigen:true,fest:true}));});
  Object.keys(massUser).forEach(id=>{const u=massUser[id];if(!u||typeof u!=='object')return;map.set(id,Object.assign({quelle:'unbekannt',id},map.get(id)||{},u,{id,eigen:true}));});
  return [...map.values()];}
const massOwn=()=>Object.assign({},MCFG.register,massUser);
const mUnit=e=>e.einheit||'m';
const mFmt=(v,e)=>v==null||isNaN(v)?'–':(mUnit(e)==='m'?fmt(v):String(v)+' '+mUnit(e));
function massPut(id,data){const tgt=canWrite?MCFG.register:massUser;tgt[id]=Object.assign({},tgt[id]||{},data,{datum:new Date().toISOString().slice(0,10)});if(canWrite)saveMasse();else massSave();}
function massDelta(e){if(e.wert==null||e.modell==null||mUnit(e)!=='m')return '';const d=Math.round((e.wert-e.modell)*100);return d?' · Δ '+(d>0?'+':'')+d+' cm':' · stimmt';}
// gespeicherte Strecke wieder einzeichnen und die Kamera dorthin holen
function massShow(e){if(!e.pts)return;const a=new THREE.Vector3(...e.pts[0]),p=new THREE.Vector3(...e.pts[1]);dot(a);dot(p);
  const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,p]),new THREE.LineBasicMaterial({color:0xC99A2E,depthTest:false,transparent:true}));ln.renderOrder=1000;gMeas.add(ln);
  const s=textSprite(e.wert!=null?mFmt(e.wert,e):mFmt(e.modell,e));s.position.copy(a).add(p).multiplyScalar(0.5).add(new THREE.Vector3(0,0.12,0));gMeas.add(s);measN++;
  const mid=a.clone().add(p).multiplyScalar(0.5),dir=camera.position.clone().sub(controls.target);if(dir.lengthSq()<1e-6)dir.set(1,0.6,1);dir.setLength(Math.max(2.2,a.distanceTo(p)*1.6));
  controls.target.copy(mid);camera.position.copy(mid).add(dir);controls.update();H.dirty();renderMeasure();}
function renderMeasure(){const all=massAll(),cnt={gemessen:0,geschaetzt:0,unbekannt:0};all.forEach(e=>cnt[QUELLE[e.quelle]?e.quelle:'unbekannt']++);
  let h='<div class="row"><span class="muted">Zwei Punkte antippen (Boden, Wand, Möbel).</span><b id="eLast">'+esc(lastMeas)+'</b><button id="eMClr" style="margin-left:auto"'+(measN||measA?'':' disabled')+'>Messungen löschen</button></div>';
  if(lastMeasObj){const m=lastMeasObj,rm=roomAt(m.a.x,m.a.y+0.3,m.a.z)||roomAt(m.p.x,m.p.y+0.3,m.p.z);
    h+='<div class="sel"><div class="row"><b>Als Maß speichern</b><span class="muted">Modell: '+fmt(m.d)+(m.dh>0.05&&m.dy>0.05?' (waagerecht '+fmt(m.dh)+', Höhe '+fmt(m.dy)+')':'')+'</span></div>'+
      '<div class="row"><select id="eMKat" aria-label="Kategorie">'+Object.keys(MKAT).map(k=>'<option value="'+k+'"'+(k==='sonstiges'?' selected':'')+'>'+MKAT[k]+'</option>').join('')+'</select><input type="text" id="eMName" placeholder="Bezeichnung, z. B. Fensterbreite" value="'+esc(rm?rm[0]+' – ':'')+'"></div>'+
      '<div class="row"><label class="chk">Vor Ort gemessen <input type="number" id="eMWert" step="1" min="0" value="'+cm(m.d)+'"> cm</label><label class="chk">Strecke <select id="eMArt"><option value="d">direkt</option><option value="dh">waagerecht</option><option value="dy">Höhe</option></select></label><input type="text" id="eMNotiz" placeholder="Notiz" style="width:min(200px,45vw)"><button id="eMSave">Speichern</button></div>'+
      '<div class="muted">Trage den Wert ein, den du wirklich gemessen hast. '+(canWrite?'Der Wert wird fest im Projekt gespeichert (src/config/masse.js). Wo das Modell direkt an einem Maß hängt, bietet die Liste „Ins Modell übernehmen“ an.':'Das Modell ändert sich dadurch nicht von selbst; die Liste zeigt die Abweichung. Am PC (server.py) werden die Werte fest im Projekt gespeichert, sonst über „Exportieren“.')+'</div></div>';}
  h+='<details class="sub"'+(massOpen?' open':'')+' id="eMDet"><summary><b>Maßregister</b> <span class="muted">'+cnt.gemessen+' gemessen · '+cnt.geschaetzt+' geschätzt · '+cnt.unbekannt+' unbekannt</span></summary>'+
    '<div class="row"><select id="eMFil" aria-label="Kategorie"><option value="">Alle Kategorien</option>'+Object.keys(MKAT).map(k=>'<option value="'+k+'"'+(massKat===k?' selected':'')+'>'+MKAT[k]+'</option>').join('')+'</select><input type="search" id="eMQ" placeholder="Suchen" value="'+esc(massQ)+'" aria-label="Suchen"><button id="eMExp">Exportieren</button><button id="eMImpB">Importieren …</button><input type="file" id="eMImp" accept=".json,application/json" hidden></div>'+
    '<div class="klist" id="eMList"></div><div id="eMOut"></div></details>';
  body.innerHTML=h;
  $('eMClr').onclick=()=>{clearMeas();render();};
  if(lastMeasObj){$('eMSave').onclick=()=>{const m=lastMeasObj,name=$('eMName').value.trim();if(!name){$('eMName').focus();return;}const art=$('eMArt').value,v=+$('eMWert').value,ok=isFinite(v)&&v>0;
      massPut('eigen.'+Date.now().toString(36),{name,kat:$('eMKat').value,raum:(roomAt(m.a.x,m.a.y+0.3,m.a.z)||[''])[0]||undefined,modell:+m[art].toFixed(3),wert:ok?+(v/100).toFixed(3):null,quelle:ok?'gemessen':'unbekannt',notiz:$('eMNotiz').value.trim()||undefined,
        pts:[[+m.a.x.toFixed(3),+m.a.y.toFixed(3),+m.a.z.toFixed(3)],[+m.p.x.toFixed(3),+m.p.y.toFixed(3),+m.p.z.toFixed(3)]]});
      lastMeasObj=null;massOpen=true;massKat='';massQ='';H.toast('Maß gespeichert');render();};}
  $('eMDet').ontoggle=e=>{massOpen=e.target.open;};$('eMFil').onchange=e=>{massKat=e.target.value;renderMassList();};$('eMQ').oninput=e=>{massQ=e.target.value;renderMassList();};
  $('eMExp').onclick=()=>{const data=JSON.stringify({app:'haus3d-masse',v:1,stand:new Date().toISOString().slice(0,10),eintraege:Object.keys(massOwn()).map(id=>Object.assign({id},massOwn()[id]))},null,1);
    try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download='masse-nachgemessen.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}catch(e){}
    $('eMOut').innerHTML='<div class="muted">Enthält nur deine eigenen Nachmessungen ('+Object.keys(massOwn()).length+'). Falls kein Download kam: Text kopieren.</div><textarea readonly>'+esc(data)+'</textarea>';};
  $('eMImpB').onclick=()=>{$('eMOut').innerHTML='<div class="muted">Datei wählen oder Text einfügen:</div><textarea id="eMTxt"></textarea><div class="row"><button id="eMFile">Datei wählen …</button><button id="eMTake">Text übernehmen</button></div>';
    $('eMFile').onclick=()=>$('eMImp').click();$('eMTake').onclick=()=>massImport($('eMTxt').value);};
  $('eMImp').onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>massImport(String(r.result));r.readAsText(f);};
  renderMassList();}
function massImport(t){try{const d=JSON.parse(t);const list=Array.isArray(d)?d:(d&&d.eintraege);if(!Array.isArray(list))throw 0;let n=0;
    list.forEach(e=>{if(!e||!e.id)return;const {id,...rest}=e;massUser[id]=Object.assign({},massUser[id]||{},rest);n++;});massSave();H.toast(n+' Maße importiert');massOpen=true;renderMeasure();}catch(e){H.toast('Datei nicht erkannt');}}
function renderMassList(){const list=$('eMList');if(!list)return;const q=massQ.trim().toLowerCase();
  const rows=massAll().filter(e=>(!massKat||e.kat===massKat)&&(!q||((e.name||'')+' '+(e.raum||'')+' '+(e.notiz||'')+' '+e.id).toLowerCase().includes(q))).sort((a,b)=>(a.kat||'').localeCompare(b.kat||'')||(a.name||'').localeCompare(b.name||''));
  list.innerHTML=rows.length?rows.map(e=>{const qk=QUELLE[e.quelle]?e.quelle:'unbekannt',ed=massEdit===e.id;
    return '<div class="krow"><div class="kinfo"><b>'+esc(e.name||e.id)+'</b> <span class="badge '+qk+'">'+QUELLE[qk]+'</span><div class="muted">'+esc(MKAT[e.kat]||e.kat||'')+(e.raum?' · '+esc(e.raum):'')+' · Modell '+mFmt(e.modell,e)+(e.wert!=null?' · gemessen '+mFmt(e.wert,e)+esc(massDelta(e)):'')+(e.datum?' · '+esc(e.datum):'')+(e.notiz?' · '+esc(e.notiz):'')+'</div></div>'+
      '<div class="row">'+(ed?'<input type="number" step="1" min="0" id="eMEdV" aria-label="Gemessener Wert" value="'+(e.wert!=null?(mUnit(e)==='m'?cm(e.wert):e.wert):e.modell!=null?(mUnit(e)==='m'?cm(e.modell):e.modell):'')+'"><span class="muted">'+(mUnit(e)==='m'?'cm':esc(mUnit(e)))+'</span><button data-mok="'+esc(e.id)+'">OK</button><button data-mcancel="1">Abbrechen</button>'
        :'<button data-mmess="'+esc(e.id)+'">Nachmessen</button>'+(e.modell!=null&&e.quelle!=='gemessen'?'<button data-mok2="'+esc(e.id)+'" title="Der Modellwert stimmt mit der Wirklichkeit überein">Stimmt so</button>':'')+(canWrite&&e.wert!=null&&kParse(e.konst)&&Math.abs(e.wert-e.modell)>0.0005?'<button data-mapply="'+esc(e.id)+'">'+(massConfirm===e.id?'Wirklich? Modell wird neu aufgebaut':'Ins Modell übernehmen')+'</button>':'')+(e.pts?'<button data-mshow="'+esc(e.id)+'">Zeigen</button>':'')+(e.eigen?'<button data-mdel="'+esc(e.id)+'" aria-label="Eigenen Eintrag löschen" title="Eigenen Eintrag löschen">✕</button>':''))+'</div></div>';}).join('')
    :'<div class="muted">Keine Einträge.</div>';
  const byId=new Map(rows.map(e=>[e.id,e]));const keep=e=>({name:e.name,kat:e.kat,raum:e.raum,modell:e.modell,einheit:e.einheit});
  list.querySelectorAll('[data-mmess]').forEach(b=>b.onclick=()=>{massEdit=b.dataset.mmess;renderMassList();const i=$('eMEdV');if(i){i.focus();i.select();}});
  list.querySelectorAll('[data-mcancel]').forEach(b=>b.onclick=()=>{massEdit=null;renderMassList();});
  list.querySelectorAll('[data-mok]').forEach(b=>b.onclick=()=>{const v=+$('eMEdV').value;if(!(v>0))return;const e=byId.get(b.dataset.mok);massPut(e.id,Object.assign(keep(e),{wert:mUnit(e)==='m'?+(v/100).toFixed(3):v,quelle:'gemessen'}));massEdit=null;renderMeasure();});
  list.querySelectorAll('[data-mok2]').forEach(b=>b.onclick=()=>{const e=byId.get(b.dataset.mok2);massPut(e.id,Object.assign(keep(e),{wert:e.modell,quelle:'gemessen'}));renderMeasure();});
  list.querySelectorAll('[data-mshow]').forEach(b=>b.onclick=()=>massShow(byId.get(b.dataset.mshow)));
  list.querySelectorAll('[data-mdel]').forEach(b=>b.onclick=()=>{delete massUser[b.dataset.mdel];massSave();if(MCFG.register[b.dataset.mdel]){delete MCFG.register[b.dataset.mdel];saveMasse();}renderMeasure();});
  list.querySelectorAll('[data-mapply]').forEach(b=>b.onclick=()=>{const e=byId.get(b.dataset.mapply),k=kParse(e.konst);if(!k)return;
    if(massConfirm!==e.id){massConfirm=e.id;renderMassList();setTimeout(()=>{if(massConfirm===e.id){massConfirm=null;renderMassList();}},5000);return;}
    massConfirm=null;MCFG.konst=Object.assign({},KV,MCFG.konst,{[k[1]]:+(e.wert+(k[2]?KV[k[2]]:0)).toFixed(3)});saveMasse().then(ok=>{if(ok)location.reload();});});}

// =====================================================================
// Tippen im Einrichtungsmodus (Streichen, Maßband, Abwählen)
// =====================================================================
let down=null;
cv.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
cv.addEventListener('pointerup',e=>{if(!H.editMode||!down)return;const mv=Math.hypot(e.clientX-down[0],e.clientY-down[1]);down=null;if(mv>6)return;
  if(tool==='paint'){const h=firstHit(e);const w=h&&wallHit(h);if(!w){H.toast('Keine Wand getroffen');return;}
    if(paintRoomMode){const r=paintRoom({point:h.point,n:w.n},paintHex);if(r){H.toast(r+': '+(paintHex?'gestrichen':'Original'));save();return;}}
    setFace(w.e,w.face,paintHex);save();}
  else if(tool==='measure')measure(e);
  else if(tool==='doors'){const h=firstHit(e),d=doorOfHit(h);if(d)selectDoor(d);else if(selDoor)selectDoor(null);else H.toast('Keine Tür getroffen');}
  else if(movable()&&sel&&!drag){const h=firstHit(e);if(!pieceOfHit(h))selectPiece(null);}});

// =====================================================================
// Zustand anwenden, Varianten
// =====================================================================
function resetAll(){resetWalls();(pieces||[]).concat(festItems).forEach(pc=>{if(pc.wrap&&!atBase(pc)){toBase(pc);applyPiece(pc);}});
  items.slice().forEach(removeItem);resetDoors();gateCfg.an=false;gateCfg.fenster=false;gateCfg.sekt=false;applyGate();
  state={v:2,walls:{},pieces:{},items:[],doors:{},tor:null};selDoor=null;selectPiece(null);}
function applyState(st){resetAll();st=st||{};
  Object.keys(st.walls||{}).forEach(id=>{const e=PW.get(id),w=st.walls[id];if(e&&Array.isArray(w))w.forEach((hx,f)=>{if(hx)setFace(e,f,hx);});});
  const ps=st.pieces||{};if(Object.keys(ps).length){buildPieces();Object.keys(ps).forEach(id=>{const pc=pieceById.get(id),v=ps[id];if(!pc||pc.kind!=='fixed')return;pc.dx=+v.dx||0;pc.dz=+v.dz||0;pc.ry=+v.ry||0;pc.hidden=!!v.hidden;applyPiece(pc);});}
  (st.items||[]).forEach(it=>{if(it&&CAT[it.t])addItem(Object.assign({},it),false);});
  const ds=st.doors||{};if(Object.keys(ds).length){buildDoors();Object.keys(ds).forEach(id=>{const d=doorById.get(id),v=ds[id];if(!d||!v||!DOOR_STYLES[v.s])return;d.style=v.s;d.c=v.c||null;applyDoor(d);});}
  if(st.tor){gateCfg.an=true;gateCfg.mat=GATE_MATS[st.tor.mat]?st.tor.mat:'laerche';if(st.tor.c)gateCfg.c=st.tor.c;gateCfg.fenster=!!st.tor.fenster;gateCfg.sekt=!!st.tor.sekt;applyGate();}
  save();}
// Varianten: gelöschte bleiben als Marke {t,del} erhalten, damit das Löschen auch auf dem anderen Gerät ankommt
const vars=()=>LS.get(K_VAR,{});
const liveVars=()=>{const V=vars(),o={};Object.keys(V).forEach(n=>{if(V[n]&&V[n].s&&!V[n].del)o[n]=V[n];});return o;};
const setVars=V=>{const ok=LS.set(K_VAR,V);pushVars();return ok;};
const snapshot=()=>JSON.parse(JSON.stringify(state));

// =====================================================================
// Oberfläche
// =====================================================================
let tool='paint',confirmReset=false;
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function render(){const tabs=panel.querySelectorAll('[data-tool]');tabs.forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tool===tool)));
  cv.style.cursor=(tool==='paint'||tool==='measure')?'crosshair':'';
  if(tool==='paint'){body.innerHTML='<div class="row">'+SWATCHES.map(([h,n])=>'<button class="sw" data-hex="'+h+'" title="'+n+'" aria-label="'+n+'" aria-pressed="'+(paintHex===h)+'" style="--swatch:'+h+'"></button>').join('')+
      '<input type="color" id="eCol" value="'+(paintHex||'#f3f0ea').toLowerCase()+'" aria-label="Eigene Farbe" title="Eigene Farbe"><button class="sw orig" data-hex="" title="Original" aria-label="Originalfarbe" aria-pressed="'+(!paintHex)+'"></button></div>'+
      '<div class="row"><label class="chk"><input type="checkbox" id="eRoom"'+(paintRoomMode?' checked':'')+'> ganzer Raum</label><span class="muted">Wand antippen zum Streichen.</span><button id="eWallReset" style="margin-left:auto">Alle Wände zurück</button></div>';
    body.querySelectorAll('.sw').forEach(b=>b.onclick=()=>{paintHex=b.dataset.hex||null;render();});
    $('eCol').oninput=e=>{paintHex=e.target.value.toUpperCase();body.querySelectorAll('.sw').forEach(b=>b.setAttribute('aria-pressed','false'));};
    $('eRoom').onchange=e=>{paintRoomMode=e.target.checked;};
    $('eWallReset').onclick=()=>{resetWalls();save();H.toast('Wände zurückgesetzt');};}
  else if(tool==='catalog'){loadKat();const cats=[...new Set((kat||[]).map(a=>a.kat))];
    body.innerHTML='<div class="row"><input type="search" id="eKQ" placeholder="Suchen: Name, Marke, Material" value="'+esc(katQ)+'" aria-label="Suchen"><select id="eKK" aria-label="Kategorie"><option value="">Alle Kategorien</option>'+cats.map(c=>'<option value="'+esc(c)+'"'+(katCat===c?' selected':'')+'>'+esc(c)+'</option>').join('')+'</select><span class="muted">'+(kat?kat.length+' Artikel':'')+'</span></div>'+
      '<div id="eSel"></div><div class="klist" id="eKList"></div><div class="muted">Quelle: '+esc((window.KATALOG&&window.KATALOG.quellen.map(q=>q.name).join(', '))||'keine')+'. Eingefügte Möbel lassen sich wie unter „Neu“ ziehen, drehen und anpassen.</div>';
    $('eKQ').oninput=e=>{katQ=e.target.value;renderKat();};$('eKK').onchange=e=>{katCat=e.target.value;renderKat();};renderKat();renderSelInfo();}
  else if(tool==='doors'){buildDoors();body.innerHTML='<div class="muted">Tür antippen, dann Design wählen – Zimmertüren, Haus- und Kellertüren, Schranktüren.</div><div id="eDoorSel"></div>'+gateHtml();renderDoorSel();bindGate();}
  else if(tool==='move'||tool==='new'){
    let h='';if(tool==='new')h+='<div class="cat">'+Object.keys(CAT).map(k=>'<button data-cat="'+k+'">'+CAT[k][0]+'</button>').join('')+'</div><div class="muted">Wird in der Bildmitte auf den Boden gestellt. Dann ziehen und drehen.</div>';
    else h+='<div class="muted">Möbelstück antippen zum Auswählen, ziehen zum Verschieben (bleibt im Raum). Q/E drehen am PC.</div>';
    const gone=canWrite?Object.keys(BASE.pieces).filter(id=>BASE.pieces[id].hidden):[];
    if(canWrite)h+='<div class="row"><span class="muted">Bestand: '+Object.keys(BASE.pieces).length+' Korrekturen, '+BASE.items.length+' zusätzliche Möbel.</span>'+(gone.length?'<button id="eFestBack">'+gone.length+' entfernte zurückholen</button>':'')+'</div>';
    h+='<div id="eSel"></div>';body.innerHTML=h;
    if(gone.length)$('eFestBack').onclick=()=>{buildPieces();gone.forEach(id=>{const b=BASE.pieces[id];delete b.hidden;if(!(b.dx||b.dz||b.ry))delete BASE.pieces[id];const pc=pieceById.get(id);if(pc){toBase(pc);applyPiece(pc);}});saveBase().then(()=>render());};
    body.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{const k=b.dataset.cat,c=CAT[k],p=placePoint();addItem({t:k,w:c[1],d:c[2],h:c[3],c:c[4],x:+p.x.toFixed(3),y:+p.y.toFixed(3),z:+p.z.toFixed(3),ry:0},true);H.toast(c[0]+' hinzugefügt');});
    renderSelInfo();}
  else if(tool==='measure')renderMeasure();
  else if(tool==='vars'){const V=liveVars(),names=Object.keys(V).sort((a,b)=>(V[b].t||0)-(V[a].t||0));
    body.innerHTML='<div class="muted" id="eSync">'+SYNC_TXT[sync.status]+'</div><div class="row"><input type="text" id="eVName" placeholder="Name der Variante" maxlength="40"><button id="eVSave">Speichern</button></div>'+
      '<div class="vlist">'+(names.length?names.map(n=>'<div class="row"><span>'+esc(n)+' <span class="muted">'+(V[n].t?new Date(V[n].t).toLocaleDateString('de-DE'):'')+'</span></span><span class="row"><button data-load="'+esc(n)+'">Laden</button><button data-del="'+esc(n)+'" aria-label="'+esc(n)+' löschen">Löschen</button></span></div>').join(''):'<span class="muted">Noch keine Varianten gespeichert.</span>')+'</div>'+
      '<div class="row"><button id="eVExp">Exportieren</button><label class="chk"><button id="eVImpB">Importieren …</button><input type="file" id="eVImp" accept=".json,application/json" hidden></label><button id="eVReset" style="margin-left:auto">'+(confirmReset?'Wirklich alles zurücksetzen?':'Alles zurücksetzen')+'</button></div><div id="eVOut"></div>';
    $('eVSave').onclick=()=>{const n=$('eVName').value.trim();if(!n){$('eVName').focus();return;}const V2=vars();V2[n]={t:Date.now(),s:snapshot()};setVars(V2)?H.toast('Gespeichert: '+n):H.toast('Speichern nicht möglich');render();};
    body.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>{const v=liveVars()[b.dataset.load];if(v){applyState(v.s);H.toast('Geladen: '+b.dataset.load);}});
    body.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const V2=vars();V2[b.dataset.del]={t:Date.now(),del:1};setVars(V2);render();});
    $('eVExp').onclick=()=>{const data=JSON.stringify({app:'haus3d-einrichtung',v:1,aktuell:snapshot(),varianten:liveVars()},null,1);
      try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));a.download='einrichtung-varianten.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}catch(e){}
      $('eVOut').innerHTML='<div class="muted">Falls kein Download kam: Text kopieren und auf dem anderen Gerät bei „Importieren“ einfügen.</div><textarea readonly>'+esc(data)+'</textarea>';};
    $('eVImpB').onclick=()=>{$('eVOut').innerHTML='<div class="muted">Datei wählen oder Text hier einfügen:</div><textarea id="eVTxt"></textarea><div class="row"><button id="eVFile">Datei wählen …</button><button id="eVTake">Text übernehmen</button></div>';
      $('eVFile').onclick=()=>$('eVImp').click();$('eVTake').onclick=()=>importText($('eVTxt').value);};
    $('eVImp').onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>importText(String(r.result));r.readAsText(f);};
    $('eVReset').onclick=()=>{if(!confirmReset){confirmReset=true;render();setTimeout(()=>{if(confirmReset){confirmReset=false;if(tool==='vars')render();}},4000);return;}confirmReset=false;resetAll();save();H.toast('Alles zurückgesetzt');render();};}}
function importText(t){try{const d=JSON.parse(t);if(!d||(d.app!=='haus3d-einrichtung'&&!d.walls))throw 0;const V2=vars();let n=0;
    if(d.varianten)Object.keys(d.varianten).forEach(k=>{V2[k]=Object.assign({},d.varianten[k],{t:Date.now()});n++;});
    if(d.walls||d.pieces||d.items){V2['Import '+new Date().toLocaleString('de-DE')]={t:Date.now(),s:d};n++;}
    if(d.aktuell){V2['Importiert (aktuell) '+new Date().toLocaleDateString('de-DE')]={t:Date.now(),s:d.aktuell};n++;}
    setVars(V2);H.toast(n+' Variante(n) importiert');render();}catch(e){H.toast('Datei nicht erkannt');}}
function renderSelInfo(){const box=$('eSel');if(!box)return;if(!sel){box.innerHTML='';return;}const pc=sel,[w,d,h]=sizeOf(pc),isNew=pc.kind==='new';
  const nm=pc.item?(pc.item.n||CAT[pc.item.t][0]):'Möbelstück',rm=pc.room?' · '+pc.room[0]:'',prod=isNew&&pc.item.mk?esc(pc.item.mk)+(pc.item.pr?' · '+eur(pc.item.pr):'')+' · ':'';
  let s='<div class="sel"><div class="row"><b>'+esc(nm)+'</b><span class="muted">'+prod+esc(rm.slice(3))+' · '+fmt(w).slice(0,-2)+' × '+fmt(d).slice(0,-2)+' × '+fmt(h)+'</span></div>'+
    '<div class="row"><button id="eRL" aria-label="15 Grad nach links drehen">⟲ 15°</button><button id="eRR" aria-label="15 Grad nach rechts drehen">⟳ 15°</button>';
  if(isNew)s+='<button id="eDup">Duplizieren</button><button id="eDel">Löschen</button>';else s+='<button id="eRes"'+(atBase(pc)?' disabled':'')+'>Zurück an Ursprung</button><button id="eHide">Ausblenden</button>';
  s+='<button id="eDone" style="margin-left:auto">Fertig</button></div>';
  if(isNew){const it=pc.item;s+='<div class="row"><label class="chk">B <input type="number" id="eW" min="5" max="500" value="'+it.w+'"></label><label class="chk">T <input type="number" id="eD" min="5" max="500" value="'+it.d+'"></label><label class="chk">H <input type="number" id="eH" min="1" max="300" value="'+it.h+'"></label><span class="muted">cm</span><input type="color" id="eC" value="'+it.c.toLowerCase()+'" aria-label="Farbe"></div>';}
  if(canWrite)s+='<div class="row"><button id="eFest"'+(!isNew&&atBase(pc)?' disabled':'')+' title="Aktuelle Lage als Ist-Zustand des Hauses speichern">Fest übernehmen</button>'+(isNew?'':'<button id="eFestDel" title="Dieses Möbelstück gibt es in Wirklichkeit nicht (mehr)">Aus Bestand entfernen</button>')+
    '<span class="muted">'+(isNew?'Möbel steht wirklich dort':'Korrektur des Ist-Zustands')+' → wird im Projekt gespeichert, nicht als Designidee.</span></div>';
  s+='</div>';box.innerHTML=s;
  if(canWrite){$('eFest').onclick=()=>commitPiece(pc,false);if(!isNew)$('eFestDel').onclick=()=>commitPiece(pc,true);}
  $('eRL').onclick=()=>rot(pc,1);$('eRR').onclick=()=>rot(pc,-1);$('eDone').onclick=()=>{selectPiece(null);render();};
  if(isNew){$('eDel').onclick=()=>{removeItem(pc);render();};$('eDup').onclick=()=>{const it=Object.assign({},pc.item,{id:null,x:pc.item.x+0.3,z:pc.item.z+0.3});addItem(it,true);};
    const num=(id,k,mn,mx)=>{$(id).onchange=e=>{const v=Math.round(+e.target.value);if(!(v>=mn&&v<=mx))return;pc.item[k]=v;rebuildItem(pc);};};num('eW','w',5,500);num('eD','d',5,500);num('eH','h',1,300);
    $('eC').onchange=e=>{pc.item.c=e.target.value.toUpperCase();rebuildItem(pc);};}
  else{$('eRes').onclick=()=>{toBase(pc);applyPiece(pc);};$('eHide').onclick=()=>{pc.hidden=true;applyPiece(pc);selectPiece(null);render();H.toast('Ausgeblendet – „Alles zurücksetzen“ unter Varianten holt es zurück');};}}
panel.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>{tool=b.dataset.tool;if(tool==='move')buildPieces();if(!movable())sel=null;if(tool!=='doors')selDoor=null;showBox(sel?sel.wrap:selDoor?selDoor.leaf:null);render();}));
function setEdit(on){H.editMode=on;panel.hidden=!on;editBtn.setAttribute('aria-pressed',String(on));document.body.classList.toggle('editing',on);
  if(on)render();else{selDoor=null;selectPiece(null);drag=null;controls.enabled=true;cv.style.cursor='';}}
editBtn.addEventListener('click',()=>setEdit(!H.editMode));$('editClose').addEventListener('click',()=>setEdit(false));

// ---------- Start: gespeicherten Stand anwenden ----------
try{applyBase();}catch(e){console.warn('Bestand konnte nicht angewendet werden',e);}
try{let cur=LS.get(K_CUR,null);if(!cur){const old=LS.get(K_OLDWALL,null);cur={v:1,walls:old&&typeof old==='object'?old:{},pieces:{},items:[]};}const had=!!LS.get(K_CUR,null);quiet=true;try{applyState(cur);flush();}finally{quiet=false;}
  if(had&&!LS.get(K_T,0)&&lastJs!==JSON.stringify({v:2,walls:{},pieces:{},items:[],doors:{},tor:null}))LS.set(K_T,1);}catch(e){console.warn('Einrichtung konnte nicht geladen werden',e);}
syncInit();
window.__einrichten={sync,commitPiece,selectPiece,applyPiece,addItem,canWrite:()=>canWrite,bestand:BASE,festItems,state:()=>state,pieces:()=>buildPieces(),doors:()=>buildDoors(),selectDoor,applyDoor,gate:gateCfg,applyGate,masse:()=>massAll(),massPut,setEdit,applyState,PW};
})();
