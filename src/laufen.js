// Laufmodus: wie in einem 3D-Spiel durch das Haus und um das Haus herum gehen (Knopf „Laufen“ in der Leiste).
// PC: W/A/S/D oder Pfeiltasten laufen, Maus sieht sich um (Klick ins Bild fängt die Maus, Esc gibt sie frei),
// Umschalt = schneller. Handy: Steuerkreis links unten läuft, Wischen im Bild sieht sich um. Türen wie sonst per Klick/Tipp.
// Technik: Beim Start werden alle festen Flächen als Dreiecke in ein Raster (1 m) einsortiert; bewegliche Teile
// (Türen, Fenster, Tore: HAUS.fixed) liegen in einem zweiten Raster, das nach jeder Bewegung neu aufgebaut wird.
// Der Körper ist ein Kreis (Radius RAD), der aus allem herausgeschoben wird, was zwischen LO und HI über den Füßen
// liegt; der Boden ist die höchste Fläche unter den Füßen bis STEP darüber (Stufen bis 32 cm werden so mitgenommen).
// Möbel liegen in eigenen Rastern: Sie sind schon ab LOF über dem Boden ein Hindernis und zählen nie als Boden, damit
// man nicht auf Sofas und Betten steigt. Deko ist kein Hindernis; Möbel und Wände nur, solange sie nicht ausgeblendet sind. Muss nach einrichten.js laden.
(function(){
  const H=window.HAUS,btn=document.getElementById('walkBtn'),stageEl=document.getElementById('stage');if(!H||!btn||!stageEl)return;
  const cv=renderer.domElement,EYE=1.62,RAD=0.22,STEP=0.32,LO=0.42,LOF=0.12,HI=1.5,LIM=45,MX=3,MZ=4,FOV=66;
  let on=false,yaw=0,pitch=0,feet=0,eyeY=0,px=0,pz=0,lastT=0,fov0=50,lvl=-9,grids=null,ctx=null,dynDirty=false,dynT=0,locked=false,jx=0,jy=0;
  const keys=new Set();
  // ---- Oberfläche: Beenden-Knopf, Hinweis, Steuerkreis, Zielpunkt ----
  const hud=document.createElement('div');hud.className='walkhud';
  hud.innerHTML='<button class="walkx" id="walkX">✕ Laufen beenden</button>'+
    '<div class="walkhelp"><b>W A S D</b> / Pfeile: laufen · <b>Maus</b>: umsehen (Klick ins Bild fängt die Maus, <b>Esc</b> gibt sie frei) · <b>Klick</b>: Türen öffnen · <b>Umschalt</b>: schneller</div>'+
    '<div class="walkjoy" id="walkJoy"><i></i></div><div class="walkdot"></div>';
  stageEl.appendChild(hud);
  const joy=hud.querySelector('#walkJoy'),knob=joy.firstChild;
  // ---- Raster aus Dreiecken ----
  const key=(ix,iz)=>(ix+4096)*8192+(iz+4096);
  function context(){const tog=new Set(H.togGroups||[]);tog.add(gCelF);
    return {tog,deco:new Set(decoMeshes),furn:new Set(furnList||[]),wall:new Set(wallMeshes),gar:new Set(window.__garConf||[]),furnOff:document.getElementById('furn').getAttribute('aria-pressed')==='true'};}
  // Zählt ein Teil als Hindernis bzw. Boden? (unabhängig davon, welche Wände gerade für die Ansicht ausgeblendet sind)
  function solid(m){const g=m.geometry;if(!m.isMesh||!g||!g.attributes||!g.attributes.position||m.userData.navPortal)return false;
    if(ctx.deco.has(m)||ctx.gar.has(m))return false;
    const mat=Array.isArray(m.material)?m.material[0]:m.material;if(!mat||mat.depthTest===false||mat.wireframe||(mat.transparent&&mat.opacity<0.12))return false;
    if(ctx.furn.has(m)){if(ctx.furnOff)return false;}else if(ctx.wall.has(m)){if(wallsHidden)return false;}else if(!m.visible)return false;
    for(let q=m.parent;q&&q!==scene;q=q.parent){if(q===dimG)return false;if(!q.visible&&!ctx.tog.has(q))return false;}
    return true;}
  const _v=new THREE.Vector3(),_m=new THREE.Matrix4(),_i=new THREE.Matrix4();
  function addGeo(G,g,mat){const P=g.attributes.position,ix=g.index,n=ix?ix.count:P.count,t=G.t,e=mat.elements,w=[0,0,0,0,0,0,0,0,0];
    for(let k=0;k+2<n;k+=3){
      for(let j=0;j<3;j++){const a=ix?ix.getX(k+j):k+j,x=P.getX(a),y=P.getY(a),z=P.getZ(a);w[j*3]=e[0]*x+e[4]*y+e[8]*z+e[12];w[j*3+1]=e[1]*x+e[5]*y+e[9]*z+e[13];w[j*3+2]=e[2]*x+e[6]*y+e[10]*z+e[14];}
      const x0=Math.max(Math.floor(Math.min(w[0],w[3],w[6])),MX-LIM-1),x1=Math.min(Math.floor(Math.max(w[0],w[3],w[6])),MX+LIM+1),z0=Math.max(Math.floor(Math.min(w[2],w[5],w[8])),MZ-LIM-1),z1=Math.min(Math.floor(Math.max(w[2],w[5],w[8])),MZ+LIM+1);
      if(x0>x1||z0>z1)continue;const id=t.length/9;for(let j=0;j<9;j++)t.push(w[j]);
      for(let a=x0;a<=x1;a++)for(let b=z0;b<=z1;b++){const kk=key(a,b);let c=G.cells.get(kk);if(!c){c=[];G.cells.set(kk,c);}c.push(id);}}}
  function addMesh(G,m){if(m.isInstancedMesh){for(let i=0;i<m.count;i++){m.getMatrixAt(i,_i);_m.multiplyMatrices(m.matrixWorld,_i);addGeo(G,m.geometry,_m);}}else addGeo(G,m.geometry,m.matrixWorld);}
  function build(dynOnly){scene.updateMatrixWorld(true);const fx=H.fixed||new Set();
    // grids: [Rohbau fest, Möbel fest, Rohbau beweglich, Möbel beweglich]; Boden sind nur die Rohbau-Raster (0 und 2)
    const neu=()=>({t:[],cells:new Map()});
    if(!dynOnly){ctx=context();grids=[neu(),neu(),null,null];scene.traverse(m=>{if(m.isMesh&&!fx.has(m)&&solid(m))addMesh(grids[ctx.furn.has(m)?1:0],m);});}
    grids[2]=neu();grids[3]=neu();fx.forEach(m=>{if(m.parent&&solid(m))addMesh(grids[ctx.furn.has(m)?3:2],m);});}
  // Höchste Fläche an der Stelle (x,z), die nicht über ymax liegt
  function ground1(x,z,ymax){let best=-1e9;const kk=key(Math.floor(x),Math.floor(z));
    for(let s=0;s<4;s+=2){const G=grids[s],c=G.cells.get(kk);if(!c)continue;const t=G.t;
      for(let k=0;k<c.length;k++){const i=c[k]*9,ax=t[i],az=t[i+2],bx=t[i+3],bz=t[i+5],cx=t[i+6],cz=t[i+8],d=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz);if(Math.abs(d)<1e-9)continue;
        const u=((bz-cz)*(x-cx)+(cx-bx)*(z-cz))/d,v=((cz-az)*(x-cx)+(ax-cx)*(z-cz))/d,w=1-u-v;if(u<-1e-6||v<-1e-6||w<-1e-6)continue;
        const y=u*t[i+1]+v*t[i+4]+w*t[i+7];if(y<=ymax&&y>best)best=y;}}
    return best;}
  const ground=(x,z,ymax)=>Math.max(ground1(x,z,ymax),ground1(x+0.12,z,ymax),ground1(x-0.12,z,ymax),ground1(x,z+0.12,ymax),ground1(x,z-0.12,ymax));
  // Kreis (px,pz) aus allen Flächen herausschieben, die zwischen LO und HI über den Füßen liegen
  const seg=[0,0,0,0];
  function slice(t,i,y){let n=0;for(let e=0;e<3;e++){const a=i+e*3,b=i+((e+1)%3)*3,ya=t[a+1]-y,yb=t[b+1]-y;if((ya<0)!==(yb<0)){const f=ya/(ya-yb);if(n<2){seg[n*2]=t[a]+(t[b]-t[a])*f;seg[n*2+1]=t[a+2]+(t[b+2]-t[a+2])*f;n++;}}}return n;}
  function pushOut(){const hi=feet+HI;
    for(let pass=0;pass<3;pass++){let moved=false;const x0=Math.floor(px-RAD),x1=Math.floor(px+RAD),z0=Math.floor(pz-RAD),z1=Math.floor(pz+RAD);
      for(let s=0;s<4;s++){const G=grids[s],t=G.t,lo=feet+(s&1?LOF:LO);for(let a=x0;a<=x1;a++)for(let b=z0;b<=z1;b++){const c=G.cells.get(key(a,b));if(!c)continue;
        for(let k=0;k<c.length;k++){const i=c[k]*9,ya=t[i+1],yb=t[i+4],yc=t[i+7],mn=Math.min(ya,yb,yc),mx=Math.max(ya,yb,yc);if(mx<=lo||mn>=hi||mx-mn<1e-3)continue;
          if(Math.min(t[i],t[i+3],t[i+6])>px+RAD||Math.max(t[i],t[i+3],t[i+6])<px-RAD||Math.min(t[i+2],t[i+5],t[i+8])>pz+RAD||Math.max(t[i+2],t[i+5],t[i+8])<pz-RAD)continue;
          const l=Math.max(lo,mn)+1e-3,h=Math.min(hi,mx)-1e-3;if(h<l)continue;const md=Math.min(h,Math.max(l,ya+yb+yc-mn-mx));
          for(let q=0;q<3;q++){const y=q===0?l:q===1?md:h;if(q&&y===l)continue;if(q===2&&y===md)continue;const n=slice(t,i,y);if(!n)continue;
            let qx=seg[0],qz=seg[1];if(n===2){const dx=seg[2]-seg[0],dz=seg[3]-seg[1],L=dx*dx+dz*dz;if(L>1e-12){const f=Math.min(1,Math.max(0,((px-seg[0])*dx+(pz-seg[1])*dz)/L));qx=seg[0]+dx*f;qz=seg[1]+dz*f;}}
            const ex=px-qx,ez=pz-qz,d=Math.hypot(ex,ez);if(d<RAD&&d>1e-6){const f=(RAD-d)/d;px+=ex*f;pz+=ez*f;moved=true;}}}}}
      if(!moved)break;}}
  // ---- Bewegung je Bild (läuft anstelle von controls.update) ----
  function tick(){const now=performance.now(),dt=Math.min(0.05,Math.max(0,(now-lastT)/1000));lastT=now;if(tween)tween=null;
    if(__animPrev)dynDirty=true;if(dynDirty&&now-dynT>120){build(true);dynT=now;if(!__animPrev)dynDirty=false;}
    const K=c=>keys.has(c)?1:0;
    yaw+=(K('ArrowLeft')-K('ArrowRight'))*1.9*dt;
    let mf=K('KeyW')+K('ArrowUp')-K('KeyS')-K('ArrowDown')-jy,ms=K('KeyD')-K('KeyA')+jx;const ml=Math.hypot(mf,ms);
    if(ml>0.01){if(ml>1){mf/=ml;ms/=ml;}const sp=(keys.has('ShiftLeft')||keys.has('ShiftRight'))?4.2:2.1,si=Math.sin(yaw),co=Math.cos(yaw),dist=sp*dt,n=Math.max(1,Math.ceil(dist/0.08));
      const dx=(ms*co-mf*si)*dist/n,dz=(-ms*si-mf*co)*dist/n;
      for(let k=0;k<n;k++){px+=dx;pz+=dz;pushOut();const g=ground(px,pz,feet+STEP);if(g>feet)feet=g;}
      px=Math.min(MX+LIM,Math.max(MX-LIM,px));pz=Math.min(MZ+LIM,Math.max(MZ-LIM,pz));}
    {const g=ground(px,pz,feet+STEP);if(g>-1e8){if(g>=feet)feet=g;else feet=Math.max(g,feet-7*dt);}}
    eyeY+=(feet+EYE-eyeY)*Math.min(1,dt*10);if(Math.abs(feet+EYE-eyeY)<0.002)eyeY=feet+EYE;
    camera.position.set(px,eyeY,pz);camera.rotation.set(pitch,yaw,0,'YXZ');
    const cp=Math.cos(pitch);controls.target.set(px-Math.sin(yaw)*cp*1.5,eyeY+Math.sin(pitch)*1.5,pz-Math.cos(yaw)*cp*1.5);
    facadeMode=true;const l=feet>DGF-0.4?2:(feet>OGF-0.4?1:0);if(l!==lvl||kgMode){lvl=l;setLevel(l);}}
  {const upd=controls.update.bind(controls);controls.update=function(){if(on){tick();return false;}return upd();};}
  {const nb=H.navBlock;H.navBlock=()=>on||(nb?nb():false);}
  // ---- Start und Ende ----
  function start(){if(on)return;if(H.editMode){H.toast('Erst „Einrichten“ beenden');return;}
    tween=null;build(false);const c=camera.position,d=controls.target.clone().sub(c);if(d.lengthSq()<1e-6)d.set(0,0,-1);d.normalize();
    yaw=Math.atan2(-d.x,-d.z);pitch=Math.max(-1.3,Math.min(1.3,Math.asin(d.y)));
    const room=window.__roomAt&&window.__roomAt(c.x,c.y-0.5,c.z);let f=null;
    if(room)f=room[6];else{const g=ground1(c.x,c.z,c.y-0.5);if(g>-1e8&&c.y-g<2.6)f=g;}
    if(f===null){px=exc+0.6;pz=17;yaw=0;pitch=0;const g=ground1(px,pz,EF+2.2);f=g>-1e8?g:EF;eyeY=f+EYE;}else{px=c.x;pz=c.z;eyeY=c.y;}
    feet=f;lvl=-9;on=true;window.__laufenAn=true;lastT=performance.now();dynT=lastT;dynDirty=false;keys.clear();jx=jy=0;
    controls.enabled=false;fov0=camera.fov;camera.fov=FOV;camera.updateProjectionMatrix();facadeMode=true;
    document.body.classList.add('walking');btn.setAttribute('aria-pressed','true');if(window.__setViewLabel)window.__setViewLabel('Laufmodus');H.toast('Laufmodus');H.dirty();
    if(window.matchMedia('(pointer: fine)').matches)lock();}
  function stop(){if(!on)return;on=false;window.__laufenAn=false;if(document.pointerLockElement===cv)document.exitPointerLock();setLocked(false);
    controls.enabled=true;camera.fov=fov0;camera.updateProjectionMatrix();const p=Math.min(pitch,0.3),cp=Math.cos(p);
    camera.position.set(px,eyeY,pz);controls.target.set(px-Math.sin(yaw)*cp*1.5,eyeY+Math.sin(p)*1.5,pz-Math.cos(yaw)*cp*1.5);
    const room=window.__roomAt&&window.__roomAt(px,eyeY-0.5,pz);facadeMode=!(room||camIn);
    document.body.classList.remove('walking');btn.setAttribute('aria-pressed','false');if(window.__setViewLabel)window.__setViewLabel(room?room[0]:(facadeMode?'Außen':'Im Haus'));
    grids=ctx=null;keys.clear();jx=jy=0;knob.style.transform='';H.dirty();}
  btn.addEventListener('click',()=>on?stop():start());hud.querySelector('#walkX').addEventListener('click',stop);
  // ---- Tasten ----
  const typing=()=>/INPUT|TEXTAREA|SELECT/.test((document.activeElement&&document.activeElement.tagName)||'');
  window.addEventListener('keydown',e=>{if(!on||typing())return;if(e.code==='Escape'){if(!locked)stop();return;}
    if(/^(Key[WASD]|Arrow(Up|Down|Left|Right)|Shift(Left|Right))$/.test(e.code)){keys.add(e.code);if(e.code.startsWith('Arrow'))e.preventDefault();}});
  window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());
  // ---- Maus: gefangen (wie im Spiel) oder ziehen; Finger: wischen ----
  function setLocked(v){locked=v;document.body.classList.toggle('walk-lock',v);}
  function lock(){try{const r=cv.requestPointerLock&&cv.requestPointerLock();if(r&&r.catch)r.catch(()=>{});}catch(e){}}
  document.addEventListener('pointerlockchange',()=>setLocked(document.pointerLockElement===cv&&on));
  const turn=(dx,dy,k)=>{yaw-=dx*k;pitch=Math.max(-1.35,Math.min(1.35,pitch-dy*k));H.dirty();};
  document.addEventListener('mousemove',e=>{if(on&&locked)turn(e.movementX||0,e.movementY||0,0.0022);});
  function act(e){const p=pickDoor(e);if(!p)return false;if(p.act)p.act();else if(p.door)toggleDoor(p.door);else if(p.sash)toggleSash(p.sash);else if(p.shutter)toggleShutter(p.shutter);return true;}
  // Gefangene Maus: Klicks gelten der Bildmitte (der Mauszeiger steht still), die übliche Klick-Behandlung wird übersprungen
  ['pointerdown','pointerup','dblclick'].forEach(n=>window.addEventListener(n,e=>{if(!on||!locked)return;e.stopPropagation();
    if(n==='pointerup'&&e.button===0){const r=cv.getBoundingClientRect();act({clientX:r.left+r.width/2,clientY:r.top+r.height/2});}},true));
  let look=null;
  cv.addEventListener('pointerdown',e=>{if(!on||locked||look)return;look={id:e.pointerId,x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,touch:e.pointerType==='touch'};});
  window.addEventListener('pointermove',e=>{if(!on||!look||e.pointerId!==look.id)return;turn(e.clientX-look.x,e.clientY-look.y,look.touch?0.0055:0.004);look.x=e.clientX;look.y=e.clientY;});
  const endLook=e=>{if(!look||e.pointerId!==look.id)return;const l=look;look=null;
    // Mausklick ohne Ziehen, der kein bedienbares Teil trifft: Maus fangen (Türen usw. schaltet die übliche Klick-Behandlung)
    if(on&&!l.touch&&e.type==='pointerup'&&e.button===0&&Math.hypot(e.clientX-l.sx,e.clientY-l.sy)<6&&!pickDoor(e))lock();};
  window.addEventListener('pointerup',endLook);window.addEventListener('pointercancel',endLook);
  // ---- Steuerkreis (Touch) ----
  let jid=null;const jset=e=>{const r=joy.getBoundingClientRect(),R=r.width/2,m=R*0.62;let x=e.clientX-r.left-R,y=e.clientY-r.top-R;const d=Math.hypot(x,y);if(d>m){x*=m/d;y*=m/d;}
    knob.style.transform='translate('+x.toFixed(0)+'px,'+y.toFixed(0)+'px)';jx=Math.abs(x/m)<0.12?0:x/m;jy=Math.abs(y/m)<0.12?0:y/m;H.dirty();};
  joy.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();jid=e.pointerId;try{joy.setPointerCapture(jid);}catch(err){}jset(e);});
  joy.addEventListener('pointermove',e=>{if(e.pointerId===jid)jset(e);});
  const jend=e=>{if(e.pointerId!==jid)return;jid=null;jx=jy=0;knob.style.transform='';};joy.addEventListener('pointerup',jend);joy.addEventListener('pointercancel',jend);
  // Möbel/Wände ein- oder ausgeblendet: Hindernisse neu aufbauen (die Leiste ist im Laufmodus verborgen; nur zur Sicherheit)
  ['furn','walls','deco'].forEach(id=>{const b=document.getElementById(id);if(b)b.addEventListener('click',()=>{if(on)setTimeout(()=>{if(on)build(false);},0);});});
  // Für Tests und zum Ausprobieren in der Konsole
  window.__laufen={start,stop,an:()=>on,stand:()=>({x:px,z:pz,fuss:feet,auge:eyeY,yaw,pitch,gefangen:locked}),
    setze:(x,z,f,y)=>{px=x;pz=z;if(typeof f==='number')feet=f;if(typeof y==='number')yaw=y;eyeY=feet+EYE;},
    taste:(code,unten)=>{if(unten)keys.add(code);else keys.delete(code);},boden:(x,z,ymax)=>ground(x,z,ymax),
    zahl:()=>grids?{fest:(grids[0].t.length+grids[1].t.length)/9,beweglich:(grids[2].t.length+grids[3].t.length)/9,moebel:(grids[1].t.length+grids[3].t.length)/9}:null};
})();
