// Bewegliche Teile: Fensterflügel, Rollläden, Türen, Geräte und Küchenschränke (klickbar),
// mit den Helfern sash, addShutter, makeDoor, clickable, anim, swing, tog.
{sash=__wrapS(sash);stulp=__wrapS(stulp);sashFrame=__wrapS(sashFrame);addShutter=__wrapS(addShutter);belt=__wrapS(belt);stripDoor=__wrapS(stripDoor);} // Zähler __S wie bei win (eg.js)
// ---- Fenstergriffe + Flügel ----
const hMat=Mu('#C8B07A',0.3,{metalness:0.75});
const sashes=[],sashHits=[];
function winHandle(ax,face,dir,a,y,g){
  const f1=face+dir*0.012,f2=face+dir*0.034,lo=(p,q)=>Math.min(p,q),hi=(p,q)=>Math.max(p,q),out=[];
  if(ax==='z'){out.push(B(a-0.018,a+0.018,y-0.045,y+0.045,lo(face,f1),hi(face,f1),hMat,g),B(a-0.011,a+0.011,y-0.13,y+0.012,lo(f1,f2),hi(f1,f2),hMat,g));}
  else{out.push(B(lo(face,f1),hi(face,f1),y-0.045,y+0.045,a-0.018,a+0.018,hMat,g),B(lo(f1,f2),hi(f1,f2),y-0.13,y+0.012,a-0.011,a+0.011,hMat,g));}
  return out;}
// sash: hinge at a0, handle near a1; band = depth range (glass..handle); pd = glass depth; dir = inward sign
function sashFrame(ax,g,a0,a1,y0,y1,pd){const sf=0.045;
  if(ax==='z'){B(a0,a1,y0,y0+sf,pd-0.02,pd+0.02,pvc,g);B(a0,a1,y1-sf,y1,pd-0.02,pd+0.02,pvc,g);B(a0,a0+sf,y0,y1,pd-0.02,pd+0.02,pvc,g);B(a1-sf,a1,y0,y1,pd-0.02,pd+0.02,pvc,g);}
  else{B(pd-0.02,pd+0.02,y0,y0+sf,a0,a1,pvc,g);B(pd-0.02,pd+0.02,y1-sf,y1,a0,a1,pvc,g);B(pd-0.02,pd+0.02,y0,y1,a0,a0+sf,pvc,g);B(pd-0.02,pd+0.02,y0,y1,a1-sf,a1,pvc,g);}}
function sash(ax,g,a0,a1,y0,y1,bandA,bandB,pd,dir,hy,flip,noHandle){
  const lo=Math.min(bandA,bandB),hi=Math.max(bandA,bandB),sf=0.045;
  // sash frame
  if(ax==='z'){B(a0,a1,y0,y0+sf,pd-0.02,pd+0.02,pvc,g);B(a0,a1,y1-sf,y1,pd-0.02,pd+0.02,pvc,g);B(a0,a0+sf,y0,y1,pd-0.02,pd+0.02,pvc,g);B(a1-sf,a1,y0,y1,pd-0.02,pd+0.02,pvc,g);}
  else{B(pd-0.02,pd+0.02,y0,y0+sf,a0,a1,pvc,g);B(pd-0.02,pd+0.02,y1-sf,y1,a0,a1,pvc,g);B(pd-0.02,pd+0.02,y0,y1,a0,a0+sf,pvc,g);B(pd-0.02,pd+0.02,y0,y1,a1-sf,a1,pvc,g);}
  const hA=flip?a1:a0,hx=flip?a0+0.04:a1-0.04,face=pd+dir*0.045,hs=noHandle?[]:winHandle(ax,face,dir,hx,hy,g),hy0=noHandle?y0:hy-0.17,hy1=noHandle?y1:hy+0.07; // ohne Griff: ganzer Mittelholm ist Klickfläche
  g.updateMatrixWorld(true);
  const pv=new THREE.Group();if(ax==='z')pv.position.set(hA,0,pd);else pv.position.set(pd,0,hA);g.add(pv);pv.updateMatrixWorld(true);
  const bb=new THREE.Box3(),e=0.006,take=[];
  g.children.forEach(o=>{if(!o.isMesh||o===pv)return;bb.setFromObject(o);
    const A=ax==='z'?[bb.min.x,bb.max.x]:[bb.min.z,bb.max.z],Dd=ax==='z'?[bb.min.z,bb.max.z]:[bb.min.x,bb.max.x];
    if(A[0]>=a0-e&&A[1]<=a1+e&&bb.min.y>=y0-e&&bb.max.y<=y1+e&&Dd[0]>=lo-e&&Dd[1]<=hi+e)take.push(o);});
  take.forEach(o=>pv.attach(o));
  const hit=ax==='z'?B(hx-0.04,hx+0.04,hy0,hy1,Math.min(face,face+dir*0.06),Math.max(face,face+dir*0.06),hitMat,pv):B(Math.min(face,face+dir*0.06),Math.max(face,face+dir*0.06),hy0,hy1,hx-0.04,hx+0.04,hitMat,pv);
  hit.position.sub(pv.position);hit.userData.wall=1;
  const sgn=(ax==='z'?-dir:dir)*(flip?-1:1),sh={pv,open:sgn*1.25,t:0,target:0};hs.forEach(m=>{m.userData.sash=sh;sashHits.push(m);});hit.userData.sash=sh;sashHits.push(hit);sashes.push(sh);return sh;}
const hitMat=new THREE.MeshBasicMaterial({visible:false});
sash('z',gWin,1.14,1.91,1.04,2.13,-0.21,-0.11,-0.2025,1,1.58);
sash('x',gLeft,1.69,2.51,0.1,2.11,-0.09,0.0,-0.0825,1,1.05);
sashFrame('z',gBack,-1.76,-1.33,1.02,2.13,Z0-0.2025);sash('z',gBack,-1.23,-0.80,1.02,2.13,Z0-0.225,Z0-0.11,Z0-0.2025,1,1.58,true);
sashFrame('z',gDS,sxm+0.05,sx1-0.07,0.97,2.13,S+0.2025);
(function(){const sw=(wz1-wz0-0.14-0.2)/3;for(let i=0;i<3;i++){const a=wz0+0.07+i*(sw+0.1),b=a+sw;sash('x',gDW,a,b,0.97,2.13,XW-0.21,XW-0.11,XW-0.2025,1,1.58);}})();
sash('z',gDS,sx0+0.07,sxm-0.05,0.97,2.13,S+0.11,S+0.21,S+0.2025,-1,1.58);
sash('x',gKE,kw0+0.07,kwm-0.05,1.02,2.13,KX1+0.09,KX1+0.19,KX1+0.1825,-1,1.58);
sash('z',gBN,nw0+0.07,nw0+0.07+0.78,1.02,2.13,-0.21,-0.11,-0.2025,1,1.58);
sash('x',gBE,ew0+0.07,ew0+0.07+0.555,1.02,2.13,RX1+0.11,RX1+0.21,RX1+0.2025,-1,1.58);
sash('x',gBaE,bw0+0.07,bw1-0.07,1.17,2.08,BX1+0.11,BX1+0.21,BX1+0.2025,-1,1.62);
// Zweiflügelige Fenster (stulp): sh.needs = Flügel, der zuerst offen sein muss; sh.follower = Flügel, der mit schließt
function toggleSash(sh){if(sh.needs&&!sh.target&&!sh.needs.target){if(window.__toast)window.__toast('Erst den rechten Flügel öffnen');return;}
  sh.target=sh.target?0:sh.open;if(!sh.target&&sh.follower)sh.follower.target=0;}
// Zweiflügeliges Fenster aus win(): Griff am rechten Flügel (von innen gesehen), beide Flügel außen angeschlagen.
// f = Wandfläche, s = Richtung nach außen (wie bei win), rightHigh = rechter Flügel liegt bei den größeren Koordinaten.
function stulp(ax,g,f,s,a0,a1,y0,y1,rightHigh){const fw=0.07,mw=0.1,sw=(a1-a0-2*fw-mw)/2,P=[[a0+fw,a0+fw+sw],[a0+fw+sw+mw,a1-fw]],R=P[rightHigh?1:0],L=P[rightHigh?0:1],hy=y0+0.61;
  const r=sash(ax,g,R[0],R[1],y0+fw,y1-fw,f+s*0.21,f+s*0.11,f+s*0.2025,-s,hy,rightHigh),l=sash(ax,g,L[0],L[1],y0+fw,y1-fw,f+s*0.21,f+s*0.11,f+s*0.2025,-s,hy,!rightHigh,true);
  l.needs=r;r.follower=l;return [r,l];}
// ---- Rollläden + Gurtband ----
const shutters=[],shutHits=[];
const beltBoxM=M('#EFE6D2',0.45),strapM=M('#E9DFC8',0.5);
function addShutter(ax,pos,a0,a1,y0,y1,g,closed){
  const h=y1-y0,w=a1-a0,t=shutTex.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;
  const geo=new THREE.PlaneGeometry(w,h);geo.translate(0,-h/2,0);
  const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:t,roughness:0.7,side:THREE.DoubleSide}));m.castShadow=true;m.receiveShadow=true;m.userData.wall=1;
  const grp=new THREE.Group();grp.add(m);
  if(ax==='z')grp.position.set((a0+a1)/2,y1,pos);else{grp.position.set(pos,y1,(a0+a1)/2);grp.rotation.y=Math.PI/2;}
  g.add(grp);
  const sh={grp,m,tex:t,h,t:closed?1:0,target:closed?1:0};shutters.push(sh);shutApply(sh);return sh;}
// belt: ax = wall plane axis, face = inner wall face, dir = into room, a = position along wall
function belt(sh,ax,face,dir,a,g,by){by=by||1.0;const lo=Math.min,hi=Math.max,parts=[],f=face+dir*0.04,pz=face+dir*0.022;
  if(ax==='z'){parts.push(B(a-0.035,a+0.035,by,by+0.19,lo(face,f),hi(face,f),beltBoxM,g),cyl(a,pz,0.013,by+0.19,2.24-by-0.19,strapM,12,g),B(a-0.06,a+0.06,by-0.05,2.24,lo(face,face+dir*0.08),hi(face,face+dir*0.08),hitMat,g));}
  else{parts.push(B(lo(face,f),hi(face,f),by,by+0.19,a-0.035,a+0.035,beltBoxM,g),cyl(pz,a,0.013,by+0.19,2.24-by-0.19,strapM,12,g),B(lo(face,face+dir*0.08),hi(face,face+dir*0.08),by-0.05,2.24,a-0.06,a+0.06,hitMat,g));}
  parts.forEach(p=>{p.userData.wall=1;p.userData.shutter=sh;shutHits.push(p);});}
function shutApply(sh){const k=Math.max(sh.t,0.003);sh.grp.scale.y=k;sh.tex.repeat.set(1,sh.h*k/1.25);sh.m.visible=sh.t>0.004&&!wallsHidden;}
let wallsHidden=false;
belt(addShutter('z',-0.27,1.07,2.87,0.965,2.2,gWin,false),'z',0,1,3.0,gWin);
belt(addShutter('x',-0.2,1.6,2.6,0,2.2,gLeft,false),'x',0,1,1.48,gLeft);
belt(addShutter('z',Z0-0.27,-1.83,-0.73,0.95,2.2,gBack,true),'z',Z0,1,-0.62,gBack);
belt(addShutter('x',XW-0.27,wz0,wz1,0.9,2.2,gDW,false),'x',XW,1,wz0-0.12,gDW);
belt(addShutter('z',S+0.27,sx0,sx1,0.9,2.2,gDS,false),'z',S,-1,sx0-0.12,gDS);
belt(addShutter('x',KX1+0.26,kw0,kw1,0.95,2.2,gKE,false),'x',KX1,-1,kw1+0.12,gKE,1.05);
belt(addShutter('z',RZ0-0.27,nw0,nw1,0.95,2.2,gBN,false),'z',RZ0,1,nw1+0.12,gBN);
belt(addShutter('x',RX1+0.27,ew0,ew1,0.95,2.2,gBE,false),'x',RX1,-1,ew1+0.12,gBE);
function toggleShutter(sh){sh.target=sh.target>0.5?0:1;}
function shutTick(){shutters.forEach(sh=>{const df=sh.target-sh.t;if(Math.abs(df)>0.0005){__anim=1;sh.t+=reduceMotionS?df:Math.sign(df)*Math.min(Math.abs(df),0.018);shutApply(sh);}});
  sashes.forEach(sh=>{const df=sh.target-sh.pv.rotation.y;if(Math.abs(df)>0.001){sh.pv.rotation.y+=reduceMotionS?df:df*0.12;__anim=1;}});}
const reduceMotionS=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Türen (klickbar) ----
const doors=[],doorHits=[];
const frostD=new THREE.MeshStandardMaterial({color:col('#E3EAEC'),transparent:true,opacity:0.75,roughness:0.6});
const doorSteel=M('#C4C8CC',0.25,{metalness:0.85});
const stripFrost=new THREE.MeshStandardMaterial({color:col('#F2F0EA'),emissive:col('#EAE4D8'),emissiveIntensity:0.25,roughness:0.35,transparent:true,opacity:0.88});
function cylZ(x,y,z,r,d,m,g){const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d,16),m);c.rotation.x=Math.PI/2;c.position.set(x,y,z);(g||scene).add(c);return c;}
// schmaler senkrechter Milchglasstreifen mit Rahmenleiste (Haus-Türstil); ax 0 = Blatt in x-Richtung, 1 = Blatt in z-Richtung
function stripDoor(add,g,a0,a1,y0,y1,ax,th){th=th||0.022;const fr=M('#EFEDE6',0.5);
  const Bx=(p0,p1,ya,yb,d0,d1,m)=>ax?B(d0,d1,ya,yb,p0,p1,m,g):B(p0,p1,ya,yb,d0,d1,m,g);
  add(Bx(a0+0.015,a1-0.015,y0+0.015,y1-0.015,-th,th,stripFrost));
  [[a0,a0+0.015],[a1-0.015,a1]].forEach(([p,q])=>add(Bx(p,q,y0,y1,-th-0.006,th+0.006,fr)));add(Bx(a0,a1,y0,y0+0.015,-th-0.006,th+0.006,fr));add(Bx(a0,a1,y1-0.015,y1,-th-0.006,th+0.006,fr));}
function makeDoor(hx,hz,L,closed,open,o={}){
  const g=new THREE.Group();g.position.set(hx,0,hz);
  const parts=[];const add=m=>{parts.push(m);return m;};
  add(B(0.02,L,0.01,2.02,-0.02,0.02,leaf,g));
  stripDoor(add,g,L*0.38,L*0.52,0.42,1.88,0);
  [-1,1].forEach(sd=>{add(cylZ(L-0.075,1.035,sd*0.022,0.032,0.012,doorSteel,g));add(cylZ(L-0.075,0.93,sd*0.022,0.02,0.008,doorSteel,g));add(B(L-0.2,L-0.07,1.025,1.045,sd*0.045,sd*0.058,doorSteel,g));add(B(L-0.085,L-0.07,1.025,1.045,sd*0.02,sd*0.05,doorSteel,g));});
  g.rotation.y=open;scene.add(g);
  const d={g,closed,open,target:open,isOpen:true};doors.push(d);parts.forEach(p=>{p.userData.door=d;doorHits.push(p);});return d;}
makeDoor(3.86,D-0.02,0.82,Math.PI,Math.PI/2,{glass:1});
makeDoor(XE+0.02,Z0+0.06,0.94,Math.PI*1.5,Math.PI);
makeDoor(4.2,RZ1-0.02,0.74,0,Math.PI/2);
makeDoor(EX-0.02,4.72,0.7,Math.PI/2,Math.PI);
function toggleDoor(d){d.isOpen=!d.isOpen;d.target=d.isOpen?d.open:d.closed;}
window.__toggleAllDoors=()=>doors.forEach(toggleDoor);
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();let downAt=null;
function pickDoor(e){const r=renderer.domElement.getBoundingClientRect();mv.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(mv,camera);
  const shown=o=>{while(o){if(!o.visible)return false;o=o.parent;}return true;};
  const hits=ray.intersectObjects(doorHits.concat(shutHits,sashHits,acts).filter(shown),false);if(!hits.length)return null;const u=hits[0].object.userData;if(u.act)return {act:u.act};return u.door?{door:u.door}:u.sash?{sash:u.sash}:{shutter:u.shutter};}
renderer.domElement.addEventListener('pointerdown',e=>{downAt=[e.clientX,e.clientY];});
renderer.domElement.addEventListener('pointerup',e=>{if(!downAt)return;const moved=Math.hypot(e.clientX-downAt[0],e.clientY-downAt[1]);downAt=null;if(moved>6)return;if(window.HAUS&&HAUS.editMode)return;const p=pickDoor(e);if(p&&p.act)p.act();else if(p&&p.door)toggleDoor(p.door);else if(p&&p.sash)toggleSash(p.sash);else if(p&&p.shutter)toggleShutter(p.shutter);});
renderer.domElement.addEventListener('pointermove',e=>{if(e.buttons)return;if(window.HAUS&&HAUS.editMode)return;renderer.domElement.style.cursor=pickDoor(e)?'pointer':'';});
function doorTick(){shutTick();applianceTick();doors.forEach(d=>{const df=d.target-d.g.rotation.y;if(Math.abs(df)>0.001){d.g.rotation.y+=reduceMotion?df:df*0.12;__shF=0;__anim=1;}});}
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
doors.forEach(d=>d.g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}}));

// ---- Geräte & Küchenschränke (klickbar) ----
const acts=[],anims=[];
function clickable(meshes,fn){meshes.forEach(m=>{m.userData.act=fn;acts.push(m);});}
function anim(get,set,open){const a={get,set,open,target:0};anims.push(a);return a;}
const swing=(pv,axis,open)=>{const a=anim(()=>pv.rotation[axis],v=>pv.rotation[axis]=v,open);a.pv=pv;a.axis=axis;return a;};
const slide=(o,open)=>anim(()=>o.position.z,v=>o.position.z=v,open);
const tog=a=>()=>{a.target=a.target?0:a.open;};
const fIn=M('#F4F6F7',0.4),fShelf=new THREE.MeshStandardMaterial({color:col('#DDEFF5'),transparent:true,opacity:0.55,roughness:0.1}),binM=new THREE.MeshStandardMaterial({color:col('#D9E3E8'),transparent:true,opacity:0.6,roughness:0.2});
// Kühlschrank Esszimmer
const fSteel=M('#707478',0.32,{metalness:0.55}),fLightM=new THREE.MeshStandardMaterial({color:col('#E8F6FF'),emissive:col('#9FDFFF'),emissiveIntensity:0});
const fx0=XE-0.63,fx1=XE-0.02,fzA=fz,fzB=fz+0.62;
B(fx0,fx1,0,0.06,fzA,fzB,fSteel);B(fx0,fx1,1.81,1.85,fzA,fzB,fSteel);B(fx1-0.04,fx1,0,1.85,fzA,fzB,fSteel);B(fx0,fx1,0,1.85,fzA,fzA+0.035,fSteel);B(fx0,fx1,0,1.85,fzB-0.035,fzB,fSteel);B(fx0,fx1,0.78,0.83,fzA,fzB,fSteel);
B(fx1-0.045,fx1-0.04,0.06,1.81,fzA+0.035,fzB-0.035,fIn);B(fx0,fx1-0.045,0.83,1.81,fzA+0.035,fzA+0.04,fIn);B(fx0,fx1-0.045,0.83,1.81,fzB-0.04,fzB-0.035,fIn);
B(fx0+0.1,fx1-0.1,1.79,1.8,fzA+0.2,fzB-0.2,fLightM);[1.08,1.33,1.56].forEach(y=>B(fx0+0.02,fx1-0.05,y,y+0.008,fzA+0.04,fzB-0.04,fShelf));
[[0.1,0.38],[0.42,0.74]].forEach(([a,b])=>B(fx0+0.03,fx1-0.06,a,b,fzA+0.05,fzB-0.05,binM));
cyl(fx0+0.2,fzA+0.15,0.05,1.565,0.13,M('#7CC576',0.5),16);cyl(fx0+0.22,fzA+0.3,0.045,1.565,0.12,M('#C8342A',0.3),16);B(fx0+0.12,fx0+0.32,1.338,1.4,fzA+0.36,fzB-0.08,M('#E8D9A8',0.6));cyl(fx0+0.25,fzA+0.2,0.04,1.088,0.1,M('#E9C46A',0.5),14);B(fx0+0.1,fx0+0.35,0.9,0.97,fzA+0.1,fzB-0.1,M('#A8D38A',0.6));
const fLight=new THREE.PointLight(col('#BFE8FF'),0,1.6,2);fLight.position.set(fx0+0.25,1.5,(fzA+fzB)/2);scene.add(fLight);
const fDoors=[];
function fridgeDoor(y0,y1,hy){const pv=new THREE.Group();pv.position.set(XE-0.65,0,fzB);scene.add(pv);const P=[];const a=m=>{P.push(m);return m;};
  a(B(-0.045,0,y0,y1,-0.62,0,fSteel,pv));a(B(0,0.005,y0+0.02,y1-0.02,-0.6,-0.02,fIn,pv));
  if(y1-y0>0.6){[y0+0.12,y0+0.4,y0+0.68].forEach(y=>{a(B(0.005,0.07,y,y+0.012,-0.56,-0.06,fIn,pv));a(B(0.06,0.07,y,y+0.08,-0.56,-0.06,fShelf,pv));});a(cyl(0.035,-0.45,0.03,y0+0.132,0.16,M('#C8342A',0.4),12,pv));a(cyl(0.035,-0.35,0.028,y0+0.412,0.2,M('#E8E2D0',0.4),12,pv));}
  a(B(-0.075,-0.045,hy[0],hy[1],-0.585,-0.565,fSteel,pv));a(B(-0.075,-0.045,hy[0],hy[0]+0.02,-0.585,-0.54,fSteel,pv));a(B(-0.075,-0.045,hy[1]-0.02,hy[1],-0.585,-0.54,fSteel,pv));
  const d=swing(pv,'y',1.8);fDoors.push(d);clickable(P,tog(d));}
fridgeDoor(0.84,1.85,[1.3,1.72]);fridgeDoor(0.02,0.78,[0.45,0.72]);
// Kühlschrank Küche (French Door)
const kSteel=M('#B4B8BB',0.25,{metalness:0.7}),kx0=KX0+0.555,kx1=KX0+1.455,kxm=(kx0+kx1)/2,kzF=KZ1-0.72,kzB=KZ1-0.04;
const kLightM=new THREE.MeshStandardMaterial({color:col('#E8F6FF'),emissive:col('#9FDFFF'),emissiveIntensity:0});
B(kx0,kx1,0,0.05,kzF,kzB,kSteel);B(kx0,kx1,1.75,1.79,kzF,kzB,kSteel);B(kx0,kx0+0.035,0,1.79,kzF,kzB,kSteel);B(kx1-0.035,kx1,0,1.79,kzF,kzB,kSteel);B(kx0,kx1,0,1.79,kzB-0.035,kzB,kSteel);B(kx0,kx1,0.88,0.93,kzF,kzB,kSteel);
B(kx0+0.035,kx1-0.035,0.93,1.75,kzB-0.04,kzB-0.035,fIn);B(kx0+0.035,kx0+0.04,0.93,1.75,kzF,kzB-0.035,fIn);B(kx1-0.04,kx1-0.035,0.93,1.75,kzF,kzB-0.035,fIn);
B(kx0+0.2,kx1-0.2,1.73,1.74,kzF+0.2,kzB-0.2,kLightM);[1.15,1.38,1.58].forEach(y=>B(kx0+0.04,kx1-0.04,y,y+0.008,kzF+0.03,kzB-0.04,fShelf));
[[0.08,0.46],[0.5,0.85]].forEach(([a,b])=>{B(kx0+0.05,kxm-0.01,a,b,kzF+0.06,kzB-0.06,binM);B(kxm+0.01,kx1-0.05,a,b,kzF+0.06,kzB-0.06,binM);});
cyl(kx0+0.2,kzF+0.2,0.05,1.158,0.14,M('#F2F2F0',0.4),16);B(kx0+0.35,kx0+0.55,1.158,1.23,kzF+0.1,kzF+0.35,M('#7CC576',0.6));cyl(kx1-0.25,kzF+0.25,0.045,1.388,0.12,M('#C8342A',0.3),16);B(kx0+0.1,kx1-0.3,0.94,1.0,kzF+0.1,kzB-0.15,M('#A8D38A',0.6));cyl(kx1-0.15,kzF+0.3,0.035,1.588,0.1,M('#E9C46A',0.5),14);
const kfLight=new THREE.PointLight(col('#BFE8FF'),0,1.8,2);kfLight.position.set(kxm,1.5,kzF+0.35);scene.add(kfLight);
const kDoors=[];
function kDoor(side,y0,y1,disp){const w=kxm-kx0,sg=side<0?1:-1,pv=new THREE.Group();pv.position.set(side<0?kx0:kx1,0,kzF);scene.add(pv);const P=[];const a=m=>{P.push(m);return m;};
  const X=(p,q)=>[Math.min(sg*p,sg*q),Math.max(sg*p,sg*q)];let r;
  r=X(0.004,w-0.004);a(B(r[0],r[1],y0,y1,-0.05,0,kSteel,pv));r=X(0.03,w-0.03);a(B(r[0],r[1],y0+0.03,y1-0.03,0,0.006,fIn,pv));
  if(y1-y0>0.7){[0.15,0.4,0.62].forEach(t=>{const y=y0+(y1-y0)*t;r=X(0.05,w-0.05);a(B(r[0],r[1],y,y+0.012,0.006,0.08,fIn,pv));a(B(r[0],r[1],y,y+0.07,0.07,0.08,fShelf,pv));});
    r=X(w-0.06,w-0.035);a(B(r[0],r[1],y0+0.15,y1-0.1,-0.085,-0.05,kSteel,pv));
    if(disp){r=X(0.07,0.35);a(B(r[0],r[1],y0+0.12,y0+0.52,-0.052,-0.05,M('#111',0.2),pv));r=X(0.1,0.32);a(B(r[0],r[1],y0+0.45,y0+0.5,-0.054,-0.052,new THREE.MeshStandardMaterial({color:col('#223'),emissive:col('#4AB8FF'),emissiveIntensity:0.6}),pv));}}
  else{r=X(0.05,w-0.03);a(B(r[0],r[1],y1-0.07,y1-0.04,-0.075,-0.05,kSteel,pv));}
  const d=swing(pv,'y',sg*1.55);kDoors.push(d);clickable(P,tog(d));}
kDoor(-1,0.935,1.79,true);kDoor(1,0.935,1.79,false);kDoor(-1,0.05,0.875,false);kDoor(1,0.05,0.875,false);
// Backofen
const enamel=M('#1C1D20',0.5),ox0=KX0+1.51,ox1=KX0+2.05,oz=KZ1-0.6,rackM=M('#9A9EA2',0.3,{metalness:0.7});
B(ox0,ox1,0.93,0.97,oz,KZ1-0.05,enamel);B(ox0,ox1,1.51,1.55,oz,KZ1-0.05,enamel);B(ox0,ox1,0.97,1.51,KZ1-0.08,KZ1-0.05,enamel);B(ox0,ox0+0.02,0.97,1.51,oz,KZ1-0.05,enamel);B(ox1-0.02,ox1,0.97,1.51,oz,KZ1-0.05,enamel);
const oLightM=new THREE.MeshStandardMaterial({color:col('#FFF2D6'),emissive:col('#FFB050'),emissiveIntensity:0.4});B(ox1-0.08,ox1-0.03,1.47,1.5,KZ1-0.2,KZ1-0.12,oLightM);
[1.12,1.3].forEach(y=>{for(let x=ox0+0.04;x<ox1-0.03;x+=0.04)B(x,x+0.005,y,y+0.005,oz+0.03,KZ1-0.1,rackM);B(ox0+0.03,ox1-0.03,y,y+0.008,oz+0.03,oz+0.04,rackM);});
B(ox0+0.1,ox1-0.1,1.3,1.31,oz+0.08,KZ1-0.15,M('#3A3B3E',0.5));blob((ox0+ox1)/2,1.36,KZ1-0.33,0.13,0.05,0.1,M('#D9A45C',0.8));
const oLight=new THREE.PointLight(col('#FFB870'),0,1.2,2);oLight.position.set((ox0+ox1)/2,1.4,oz+0.1);scene.add(oLight);
B(KX0+1.62,KX0+1.92,1.575,1.62,KZ1-0.607,KZ1-0.604,new THREE.MeshStandardMaterial({color:col('#112'),emissive:col('#4AB8FF'),emissiveIntensity:0.7}));
const oDoor=(function(){const pv=new THREE.Group();pv.position.set(0,0.95,oz);scene.add(pv);const P=[];const a=m=>{P.push(m);return m;};
  a(B(ox0,ox1,0,0.6,-0.035,0,M('#1A1A1A',0.15),pv));a(B(ox0,ox1,0.52,0.6,-0.036,-0.03,steel,pv));
  a(B(ox0+0.09,ox1-0.09,0.47,0.485,-0.07,-0.055,steel,pv));a(B(ox0+0.1,ox0+0.115,0.46,0.485,-0.07,-0.035,steel,pv));a(B(ox1-0.115,ox1-0.1,0.46,0.485,-0.07,-0.035,steel,pv));
  const d=swing(pv,'x',-1.45);clickable(P,tog(d));return d;})();
// Küchenschränke & Schubladen
const cabIn=M('#F2EFE8',0.6),drawM=M('#9EA3A8',0.4,{metalness:0.5}),drawIn=M('#C9CDD1',0.6);
function unitFrame(face,x0,x1,z0,z1){const g=new THREE.Group();let w,d;
  if(face==='z+'){g.position.set(x0,0,z1);w=x1-x0;d=z1-z0;}else if(face==='z-'){g.position.set(x1,0,z0);g.rotation.y=Math.PI;w=x1-x0;d=z1-z0;}else{g.position.set(x0,0,z0);g.rotation.y=-Math.PI/2;w=z1-z0;d=x1-x0;}
  scene.add(g);return {g,w,d};}
function cabDrawers(face,x0,x1,z0,z1,fr,body){const {g,w,d}=unitFrame(face,x0,x1,z0,z1);
  const lo=Math.min(...fr.map(f=>f[0])),hi=Math.max(...fr.map(f=>f[1]));
  if(body!==false){B(0,w,lo,hi,-d,-0.021,kFront,g);if(lo<0.2)B(0.03,w-0.03,0,0.1,-d,-0.05,kPlinth,g);}
  fr.forEach(([ya,yb],k)=>{const dg=new THREE.Group();g.add(dg);const P=[];const a=m=>{P.push(m);return m;};const dd=d-0.08;
    a(B(0.002,w-0.002,ya+0.003,yb-0.003,-0.02,0,kFront,dg));a(B(0.06,w-0.06,yb-0.075,yb-0.063,0,0.015,kBar,dg));
    a(B(0.03,0.042,ya+0.02,yb-0.05,-dd,-0.02,drawM,dg));a(B(w-0.042,w-0.03,ya+0.02,yb-0.05,-dd,-0.02,drawM,dg));a(B(0.03,w-0.03,ya+0.02,ya+0.032,-dd,-0.02,drawIn,dg));a(B(0.03,w-0.03,ya+0.02,yb-0.05,-dd,-dd+0.012,drawM,dg));
    if(k===0&&yb-ya<0.3){a(B(0.05,w-0.05,ya+0.032,ya+0.04,-dd+0.02,-0.04,M('#8F959B',0.5),dg));for(let x=0.1;x<w-0.08;x+=0.09)a(B(x,x+0.006,ya+0.04,ya+0.08,-dd+0.02,-0.04,M('#8F959B',0.5),dg));
      for(let x=0.07;x<w-0.1;x+=0.09)a(B(x+0.02,x+0.035,ya+0.04,ya+0.05,-dd+0.05,-0.08,rackM,dg));}
    else if(yb-ya>0.25&&w>0.8){a(cyl(0.3,-0.3,0.14,ya+0.035,0.07,M('#1E1E1E',0.4),24,dg));a(cyl(0.65,-0.28,0.12,ya+0.035,0.09,M('#1E1E1E',0.4),24,dg));a(cyl(w-0.3,-0.32,0.11,ya+0.035,0.12,M('#B8BCBF',0.3,{metalness:0.7}),24,dg));}
    const sl=slide(dg,Math.min(0.45,d-0.1));clickable(P,tog(sl));});
  return g;}
function cabDoors(face,x0,x1,z0,z1,y0,y1,n,shelves,hinges,bar){const {g,w,d}=unitFrame(face,x0,x1,z0,z1);
  B(0,0.018,y0,y1,-d,-0.021,kFront,g);B(w-0.018,w,y0,y1,-d,-0.021,kFront,g);B(0,w,y0,y0+0.018,-d,-0.021,kFront,g);B(0,w,y1-0.018,y1,-d,-0.021,kFront,g);B(0,w,y0,y1,-d,-d+0.015,kFront,g);
  B(0.018,w-0.018,y0+0.018,y1-0.018,-d+0.015,-d+0.02,cabIn,g);
  if(y0<0.2)B(0.03,w-0.03,0,y0,-d,-0.05,kPlinth,g);
  const cols=['#E9C46A','#F4A261','#8AB17D','#E76F51','#6D9DC5','#F2F2F0','#B5838D'];let ci=0;
  shelves.forEach(y=>{B(0.018,w-0.018,y,y+0.016,-d+0.02,-0.04,cabIn,g);});
  [y0+0.018].concat(shelves.map(y=>y+0.016)).forEach(y=>{for(let x=0.07;x<w-0.1;x+=0.13+((ci*37)%5)*0.02){const c=M(cols[ci++%cols.length],0.5),hgt=0.08+((ci*13)%5)*0.03;if(ci%3)cyl(0,0,0.035,y,hgt,c,14,g).position.set(x+0.03,y+hgt/2,-d*0.5);else B(x,x+0.07,y,y+hgt,-d+0.05,-d+0.05+Math.min(0.2,d-0.12),c,g);}});
  const dw=w/n;for(let i=0;i<n;i++){const hl=hinges[i]==='L',pv=new THREE.Group();pv.position.set(hl?i*dw:(i+1)*dw,0,0);g.add(pv);const P=[];const a=m=>{P.push(m);return m;};
    const r=hl?[0.002,dw-0.002]:[-dw+0.002,-0.002];a(B(r[0],r[1],y0+0.002,y1-0.002,-0.02,0,kFront,pv));
    if(bar){const by=bar==='top'?y1-0.08:y0+0.06,rb=hl?[0.06,dw-0.06]:[-dw+0.06,-0.06];a(B(rb[0],rb[1],by,by+0.012,0,0.015,kBar,pv));}
    const dd=swing(pv,'y',hl?-1.75:1.75);clickable(P,tog(dd));}
  return g;}
const DF=[[0.66,0.86],[0.385,0.655],[0.1,0.38]];
kUnits.forEach(([x0,x1,z0,z1,face,rows])=>{
  if(rows.length>=3)cabDrawers(face,x0,x1,z0,z1,DF);
  else if(rows.length===1)cabDoors(face,x0,x1,z0,z1,0.1,0.86,1,[0.45],[x0<KX0+2.0?'L':'R'],'top');
  else base0(x0,x1,z0,z1,face);});
function base0(x0,x1,z0,z1,face){B(x0,x1,0.1,0.86,z0,z1,kFront);B(x0+0.03,x1-0.03,0,0.1,z0,z1-0.05,kPlinth);}
cabDoors('z+',KX0+1.62,KX0+3.05,KZ0,KZ0+0.35,1.58,2.35,3,[1.84,2.09],['L','L','R'],false);
cabDoors('z-',KX0+2.1,KX1-0.02,KZ1-0.35,KZ1,1.5,2.35,2,[1.78,2.06],['L','R'],false);
cabDoors('z-',KX0+1.48,KX0+2.08,KZ1-0.6,KZ1,1.66,2.35,1,[2.0],['L'],'bottom');
cabDrawers('z-',KX0+1.48,KX0+2.08,KZ1-0.6,KZ1,[[0.1,0.93]]);
cabDoors('z-',KX0,KX0+0.53,KZ1-0.6,KZ1,1.56,2.35,1,[1.82,2.08],['R'],'bottom');
cabDoors('z-',KX0,KX0+0.53,KZ1-0.6,KZ1,0.1,1.55,1,[0.5,0.85,1.2],['R'],'top');
// Toaster
const tRed=M('#C21F2B',0.28),tGrey=M('#A9AFB5',0.4),tDark=M('#2A2A2A',0.6),tSlotM=new THREE.MeshStandardMaterial({color:col('#3A2010'),emissive:col('#FF6A1A'),emissiveIntensity:0});
const tx0=-1.57,tx1=-1.32,tz0=S-0.3,tz1=S-0.16,ty0=0.67,ty1=0.87,tg=[];
tg.push(B(tx0,tx1,ty0,ty1-0.015,tz0,tz1,tRed),B(tx0+0.01,tx1-0.01,ty1-0.015,ty1,tz0+0.01,tz1-0.01,tRed));
const slotZ=[[tz0+0.035,tz0+0.058],[tz1-0.058,tz1-0.035]];
slotZ.forEach(([a,b])=>{tg.push(B(tx0+0.03,tx1-0.03,ty1-0.001,ty1+0.002,a-0.006,b+0.006,tGrey),B(tx0+0.035,tx1-0.035,ty1-0.004,ty1+0.003,a,b,tSlotM));});
const knob=new THREE.Mesh(new THREE.CylinderGeometry(0.014,0.014,0.012,18),tGrey);knob.rotation.x=Math.PI/2;knob.position.set((tx0+tx1)/2,ty0+0.035,tz0-0.006);scene.add(knob);tg.push(knob);
tg.push(B((tx0+tx1)/2-0.003,(tx0+tx1)/2+0.003,ty0+0.08,ty1-0.02,tz0-0.002,tz0,tDark));
const lever=B((tx0+tx1)/2-0.025,(tx0+tx1)/2+0.025,-0.012,0.012,tz0-0.025,tz0-0.002,tGrey);tg.push(lever);
const breadM=new THREE.MeshStandardMaterial({color:col('#E8C98E'),roughness:0.9}),breadBase=col('#E8C98E'),breadDark=col('#8E5020');
const slices=slotZ.map(([a,b])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(tx1-tx0-0.09,0.11,(b-a)-0.006),breadM);m.position.set((tx0+tx1)/2,0,(a+b)/2);scene.add(m);tg.push(m);return m;});
const tLight=new THREE.PointLight(col('#FF7A2A'),0,0.6,2);tLight.position.set((tx0+tx1)/2,ty1+0.05,(tz0+tz1)/2);scene.add(tLight);
const toast={state:'idle',t:0,bread:0.04,lever:ty1-0.06,shade:0,vy:0};
function toastApply(){lever.position.y=toast.lever;slices.forEach(m=>m.position.y=ty1-0.055+toast.bread);}
toastApply();
clickable(tg,()=>{if(toast.state==='idle'){toast.state='on';toast.t=0;}else if(toast.state==='on'){toast.t=99;}});
function applianceTick(){
  anims.forEach(a=>{const c=a.get(),df=a.target-c;if(Math.abs(df)>0.0005){a.set(reduceMotion?a.target:c+df*0.14);__shF=0;__anim=1;}});
  const fo=Math.max(...fDoors.map(d=>Math.abs(d.get())))/1.8;fLightM.emissiveIntensity=fo>0.05?1.4:0;fLight.intensity=fo>0.05?0.9*fo:0;
  const ko=Math.max(...kDoors.slice(0,2).map(d=>Math.abs(d.get())))/1.55;kLightM.emissiveIntensity=ko>0.05?1.4:0;kfLight.intensity=ko>0.05?ko:0;
  const oo=Math.abs(oDoor.get())/1.45;oLightM.emissiveIntensity=0.4+1.4*oo;oLight.intensity=0.9*oo;
  if(toast.state==='on'){toast.t+=1/60;toast.lever+=((ty0+0.07)-toast.lever)*0.3;toast.bread+=(-0.06-toast.bread)*0.3;
    const k=Math.min(1,toast.t/0.8);tSlotM.emissiveIntensity=1.6*k;tLight.intensity=0.8*k;
    if(toast.t>4.5){toast.state='pop';toast.vy=0.011;toast.shade=Math.min(1,toast.shade+0.34);breadM.color.copy(breadBase).lerp(breadDark,toast.shade);}}
  else if(toast.state==='pop'){tSlotM.emissiveIntensity*=0.9;tLight.intensity*=0.9;toast.lever+=((ty1-0.06)-toast.lever)*0.4;
    toast.bread+=toast.vy;toast.vy-=0.0011;if(toast.vy<0&&toast.bread<=0.04){toast.bread=0.04;toast.state='idle';tSlotM.emissiveIntensity=0;tLight.intensity=0;}}
  if(toast.state==='on'||toast.state==='pop')__anim=1;
  toastApply();}
