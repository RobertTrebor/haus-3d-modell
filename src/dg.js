// Dachgeschoss (beginnt mit dem Abstellbereich unter der Dachbodentreppe im OG): Wände mit Dachschrägen,
// Gauben, Flur, Yogazimmer, Bad, Abstellkammer.
// ---- Abstellbereich unter der Dachbodentreppe ----
{const ply=new THREE.MeshStandardMaterial({color:col('#E0A868'),roughness:0.55});
 const L=Math.hypot(NAT*ATS,NAT*ATR),ang=Math.atan2(NAT*ATR,NAT*ATS);
 const sof=new THREE.Mesh(new THREE.BoxGeometry(AX1-AX0-0.02,0.015,L),ply);sof.position.set((AX0+AX1)/2,OGF+NAT*ATR/2-0.06,ATZ0+NAT*ATS/2);sof.rotation.x=-ang;gUp.add(sof);
 const sz0=5.2,sz1=U1Z-0.05,ax=AX0+0.02;
 // blaue Tasche, blaue Schubladenbox, Kartons, Staubsauger
 B(ax,ax+0.42,OGF,OGF+0.5,sz0+0.05,sz0+0.5,M('#1E5AB8',0.7),gUp);B(ax+0.05,ax+0.37,OGF+0.5,OGF+0.6,sz0+0.1,sz0+0.45,M('#2A6AD0',0.6),gUp);
 B(ax,ax+0.38,OGF,OGF+0.42,sz0+0.55,sz0+0.85,M('#2A4AA8',0.4),gUp);B(ax+0.37,ax+0.38,OGF+0.05,OGF+0.4,sz0+0.58,sz0+0.82,M('#C8D8EC',0.3),gUp);
 B(ax,ax+0.4,OGF,OGF+0.32,sz0+0.88,sz1,M('#F2EEE6',0.85),gUp);B(ax+0.05,ax+0.33,OGF+0.32,OGF+0.5,sz0+0.9,sz0+1.15,M('#B88C5A',0.85),gUp);
 B(ax+0.5,ax+0.82,OGF,OGF+0.36,sz0-0.05,sz0+0.28,M('#1E1E22',0.5),gUp);
 const hose=new THREE.Mesh(new THREE.TorusGeometry(0.32,0.02,8,30,Math.PI*1.3),M('#8A9096',0.4,{metalness:0.4}));hose.position.set(ax+0.55,OGF+0.62,sz0+0.4);hose.rotation.y=Math.PI/2;gUp.add(hose);
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.018,1.1,8),M('#9AA0A4',0.3,{metalness:0.7}));pole.position.set(ax+0.15,OGF+0.6,sz0-0.15);pole.rotation.z=0.12;gUp.add(pole);
 const bag=new THREE.Mesh(new THREE.ConeGeometry(0.2,0.55,10,1,true),new THREE.MeshStandardMaterial({color:col('#CFEFE0'),transparent:true,opacity:0.6,side:THREE.DoubleSide}));bag.position.set(ax+0.15,OGF+1.0,sz0-0.15);bag.rotation.x=Math.PI;gUp.add(bag);}

// ===================== DACHGESCHOSS =====================
const DGF=OGF+OGH,gDG=new THREE.Group(),gDGshell=new THREE.Group();scene.add(gDG);gDG.add(gDGshell);
const DGK=4.3/4.83,DKX0=0.24,DKX1=8.21,DKZ0=0.24,DKZ1=7.76,DKH=1.0,DFC=2.35,DSI=(DFC-DKH)/DGK;
const dgLabs=[];let floorDG=false;
{
const dB=(x0,x1,y0,y1,z0,z1,m,g)=>B(x0,x1,DGF+y0,DGF+y1,z0,z1,m,g||gDG);
const hAt=(x,z)=>Math.min(DFC,DKH+DGK*Math.min(x-DKX0,DKX1-x,z-DKZ0,DKZ1-z));
const shellM=new THREE.MeshStandardMaterial({color:col('#F3F2EE'),roughness:0.9,side:THREE.DoubleSide});
const glassD=new THREE.MeshStandardMaterial({color:col('#CFE6F2'),transparent:true,opacity:0.25,roughness:0.05,side:THREE.DoubleSide,depthWrite:false});
const wSide=new THREE.MeshStandardMaterial({color:col('#F6F6F3'),roughness:0.6,side:THREE.DoubleSide});
// --- Wände mit Dachschrägen-Profil (Türen als Aussparung) ---
function aWall(axis,c0,c1,a0,a1,doors,mat){const cm=(c0+c1)/2,H=a=>axis==='z'?hAt(a,cm):hAt(cm,a);
  const seg=(s0,s1,bot)=>{const sh=new THREE.Shape();sh.moveTo(s0,bot);sh.lineTo(s1,bot);const n=Math.max(2,Math.ceil((s1-s0)/0.1));
    let ok=false;for(let i=n;i>=0;i--){const a=s0+(s1-s0)*i/n,h=Math.max(bot+0.02,H(a));if(h>bot+0.03)ok=true;sh.lineTo(a,h);}if(!ok)return;
    const g=new THREE.ExtrudeGeometry(sh,{depth:c1-c0,bevelEnabled:false,curveSegments:1});const m=new THREE.Mesh(g,mat||wallMat);
    if(axis==='z'){m.position.set(0,DGF,c0);}else{m.rotation.y=-Math.PI/2;m.position.set(c1,DGF,0);}if((mat||wallMat)===wallMat)registerPaintableWall(m,g.groups.length||1);gDG.add(m);};
  let cur=a0;(doors||[]).forEach(([d0,d1,dh])=>{seg(cur,d0,0);seg(d0,d1,dh);cur=d1;});seg(cur,a1,0);}
// --- Dachschrägen innen (Pyramidenstumpf) mit Gaubenöffnungen ---
function slopeFace(face,polys){polys.forEach(({pts,holes})=>{const sh=new THREE.Shape();pts.forEach(([u,s],i)=>i?sh.lineTo(u,s):sh.moveTo(u,s));
  (holes||[]).forEach(([u0,u1,s0,s1])=>{const p=new THREE.Path();p.moveTo(u0,s0);p.lineTo(u1,s0);p.lineTo(u1,s1);p.lineTo(u0,s1);p.lineTo(u0,s0);sh.holes.push(p);});
  const g=new THREE.ShapeGeometry(sh),p=g.attributes.position;for(let i=0;i<p.count;i++){const u=p.getX(i),s=p.getY(i),y=DGF+DKH+s*DGK;let x,z;
    if(face==='S'){x=u;z=DKZ1-s;}else if(face==='N'){x=u;z=DKZ0+s;}else if(face==='E'){x=DKX1-s;z=u;}else{x=DKX0+s;z=u;}p.setXYZ(i,x,y,z);}
  g.computeVertexNormals();const mesh=new THREE.Mesh(g,shellM);registerPaintableWall(mesh,1,true);gDGshell.add(mesh);});}
const sH0=(1.15-DKH)/DGK,sH1=(2.05-DKH)/DGK,GX0g=3.15,GX1g=5.25;
slopeFace('S',[{pts:[[DKX0,0],[DKX1,0],[DKX1-DSI,DSI],[DKX0+DSI,DSI]],holes:[[exc-0.55,exc+0.55,sH0,sH1]]}]);
slopeFace('E',[{pts:[[DKZ0,0],[DKZ1,0],[DKZ1-DSI,DSI],[DKZ0+DSI,DSI]],holes:[[3.45,4.55,sH0,sH1]]}]);
slopeFace('W',[{pts:[[DKZ0,0],[DKZ1,0],[DKZ1-DSI,DSI],[DKZ0+DSI,DSI]],holes:[[3.45,4.55,sH0,sH1]]}]);
slopeFace('N',[{pts:[[DKX0,0],[GX0g,0],[GX0g,DSI],[DKX0+DSI,DSI]]},{pts:[[GX1g,0],[DKX1,0],[DKX1-DSI,DSI],[GX1g,DSI]]}]);
{const c=new THREE.Mesh(new THREE.PlaneGeometry(DKX1-DKX0-2*DSI,DKZ1-DKZ0-2*DSI),shellM);c.rotation.x=Math.PI/2;c.position.set((DKX0+DKX1)/2,DGF+DFC,(DKZ0+DKZ1)/2);gDGshell.add(c);
 const c2=new THREE.Mesh(new THREE.PlaneGeometry(GX1g-GX0g,DSI),shellM);c2.rotation.x=Math.PI/2;c2.position.set((GX0g+GX1g)/2,DGF+DFC,DKZ0+DSI/2);gDGshell.add(c2);}
// Kniestöcke
const kw=wSide;dB(DKX0-0.1,GX0g,0,DKH,DKZ0-0.1,DKZ0,kw);dB(GX1g,DKX1+0.1,0,DKH,DKZ0-0.1,DKZ0,kw);dB(DKX0-0.1,DKX1+0.1,0,DKH,DKZ1,DKZ1+0.1,kw);dB(DKX0-0.1,DKX0,0,DKH,DKZ0,DKZ1,kw);dB(DKX1,DKX1+0.1,0,DKH,DKZ0,DKZ1,kw);
// Fledermausgauben innen (Halbrundfenster in Nische)
function batNiche(px,pz,rot,extra){const g=new THREE.Group();g.position.set(px,DGF,pz);g.rotation.y=rot;gDGshell.add(g);
  const w=0.55,zi=-sH1,zw=-0.12,h0=1.15,h1=2.05;
  [-1,1].forEach(sd=>{const b=new THREE.Mesh(new THREE.BoxGeometry(0.04,h1-1.1,zw-zi),shellM);b.position.set(sd*(w+0.02),(h1+1.1)/2,(zi+zw)/2);g.add(b);});
  const tp=new THREE.Mesh(new THREE.BoxGeometry(2*w+0.08,0.04,zw-zi),shellM);tp.position.set(0,h1+0.02,(zi+zw)/2);g.add(tp);
  const sl=new THREE.Mesh(new THREE.BoxGeometry(2*w,0.04,0.22),white);sl.position.set(0,h0-0.02,zw-0.09);g.add(sl);
  const r=0.44,cy=h0+0.06,sh=new THREE.Shape();sh.moveTo(-w,h0);sh.lineTo(w,h0);sh.lineTo(w,h1);sh.lineTo(-w,h1);sh.lineTo(-w,h0);
  const hp=new THREE.Path();hp.moveTo(-r,cy);hp.absarc(0,cy,r,Math.PI,0,true);hp.lineTo(-r,cy);sh.holes.push(hp);
  const wm=new THREE.Mesh(new THREE.ShapeGeometry(sh,24),wSide);wm.position.z=zw;g.add(wm);
  const gl=new THREE.Mesh(new THREE.CircleGeometry(r-0.02,24,0,Math.PI),glassD);gl.position.set(0,cy,zw+0.01);g.add(gl);
  const fr=new THREE.Mesh(new THREE.RingGeometry(r-0.05,r+0.01,32,1,0,Math.PI),wSide);fr.position.set(0,cy,zw-0.005);g.add(fr);
  const bar=new THREE.Mesh(new THREE.BoxGeometry(2*r,0.06,0.06),white);bar.position.set(0,cy+0.01,zw-0.01);g.add(bar);
  if(extra)extra(g,zw,cy);return g;}
batNiche(exc,DKZ1,0);batNiche(DKX0,4.0,-Math.PI/2);
const stripeT=canvasTex(256,128,(x,w,h)=>{const cs=['#F2C330','#E2453A','#2E7ED8','#2EA06A','#F6F2EA','#7A5AC8'];for(let i=0;i<32;i++){x.fillStyle=cs[i%6];x.fillRect(i*8,0,8,h);}},[1,1]);
const stripeM=new THREE.MeshStandardMaterial({map:stripeT,roughness:0.9,side:THREE.DoubleSide});
batNiche(DKX1,4.0,Math.PI/2,(g,zw,cy)=>{const c=new THREE.Mesh(new THREE.PlaneGeometry(1.0,0.72),stripeM);c.position.set(0,cy+0.2,zw-0.25);g.add(c);});
// Schleppgaube Garten (Yogazimmer): Frontwand mit zwei Fenstern, Wangen
{const sh=new THREE.Shape();sh.moveTo(GX0g,0);sh.lineTo(GX1g,0);sh.lineTo(GX1g,DFC);sh.lineTo(GX0g,DFC);sh.lineTo(GX0g,0);
 [[3.3,4.16],[4.24,5.1]].forEach(([a,b])=>{const p=new THREE.Path();p.moveTo(a,0.98);p.lineTo(b,0.98);p.lineTo(b,1.98);p.lineTo(a,1.98);p.lineTo(a,0.98);sh.holes.push(p);});
 const m=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:0.1,bevelEnabled:false}),wSide);m.position.set(0,DGF,DKZ0-0.1);gDG.add(m);
 [[3.3,4.16],[4.24,5.1]].forEach(([a,b])=>win({ax:'z',f:DKZ0+0.1,s:-1,a0:a,a1:b,y0:DGF+0.98,y1:DGF+1.98,g:gDG,rows:[0.53],noBox:1}));
 [GX0g,GX1g].forEach(x=>{const s=new THREE.Shape();s.moveTo(DKZ0,DKH);s.lineTo(DKZ0,DFC);s.lineTo(DKZ0+DSI,DFC);s.lineTo(DKZ0,DKH);const m2=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:0.06,bevelEnabled:false}),shellM);m2.rotation.y=-Math.PI/2;m2.position.set(x+0.03,DGF,0);gDGshell.add(m2);});
 dB(3.25,5.15,0.15,0.75,DKZ0+0.04,DKZ0+0.12,white);for(let x=3.28;x<5.13;x+=0.04)dB(x,x+0.015,0.17,0.73,DKZ0+0.12,DKZ0+0.13,white);}
// --- Boden: Rohdecke mit Treppenloch, Dielen, Fliesen, Teppich ---
const DH0=4.5,DH1=ATZ0+NAT*ATS;const slab=M('#F4F2EC',0.9);
dB(-0.38,8.85,-0.24,-0.006,-0.38,DH0,slab);dB(-0.38,8.85,-0.24,-0.006,DH1,8.40,slab);dB(-0.38,AX0,-0.24,-0.006,DH0,DH1,slab);dB(AX1,8.85,-0.24,-0.006,DH0,DH1,slab);
const pineT=canvasTex(512,512,(x,w,h)=>{x.fillStyle='#DDBF92';x.fillRect(0,0,w,h);for(let i=0;i<w;i+=40){x.fillStyle=`rgba(${150+rnd()*40},${100+rnd()*25},60,0.16)`;x.fillRect(i,0,40,h);x.fillStyle='rgba(110,70,35,0.55)';x.fillRect(i,0,2,h);}
  for(let k=0;k<70;k++){x.fillStyle='rgba(90,55,25,0.7)';x.beginPath();x.arc(rnd()*w,rnd()*h,1.5+rnd()*2,0,6.3);x.fill();}for(let k=0;k<140;k++){x.strokeStyle='rgba(150,100,55,0.2)';x.beginPath();const px=rnd()*w;x.moveTo(px,0);x.lineTo(px+rnd()*6-3,h);x.stroke();}},[1,1]);
const btT=canvasTex(128,128,(x,w,h)=>{x.fillStyle='#CFE2E0';x.fillRect(0,0,w,h);for(let i=0;i<200;i++){x.fillStyle=`rgba(${150+rnd()*60},${190+rnd()*40},${190+rnd()*40},0.4)`;x.fillRect(rnd()*w,rnd()*h,3,3);}x.strokeStyle='rgba(120,140,140,0.8)';x.lineWidth=2;x.strokeRect(0,0,w,h);},[1,1]);
const dFl=(x0,x1,z0,z1,tex,sz,color)=>{let mat;if(tex){const t=tex.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set((x1-x0)/sz,(z1-z0)/sz);mat=new THREE.MeshStandardMaterial({map:t,roughness:0.5});}else mat=M(color,0.95);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),mat);m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,DGF+0.002,(z0+z1)/2);m.userData.noShadow=1;gDG.add(m);};
dFl(DKX0,DKX1,DKZ0,3.3,pineT,1.6);dFl(2.96,5.15,3.42,DH0,pineT,1.6);dFl(AX1,5.15,DH0,DH1,pineT,1.6);dFl(2.96,5.15,DH1,DKZ1,pineT,1.6);
dFl(DKX0,2.84,3.42,DKZ1,null,0,'#CFC6B5');dFl(5.27,DKX1,3.42,DKZ1,btT,0.45);
// --- Trennwände mit Türen ---
aWall('z',3.3,3.42,DKX0,DKX1,[[3.6,4.4,2.02]]);
aWall('x',2.84,2.96,3.42,DKZ1,[[3.85,4.45,2.0]]);
aWall('x',5.15,5.27,3.42,DKZ1,[[3.55,4.35,2.0]]);
dB(5.27,5.29,0,1.95,3.42,3.55,obTileM(0.13,1.95));dB(5.27,5.29,0,1.95,4.35,6.2,obTileM(1.85,1.95));dB(5.27,DKX1,0,1.95,3.42,3.44,obTileM(2.9,1.95));
function dgDoor(px,pz,len,axis,open,clr){const pv=new THREE.Group();pv.position.set(px,DGF,pz);gDG.add(pv);const P=[],dm=M('#F7F5EE',0.45),pm=M('#EFECE3',0.5);
  const Bx=(a0,a1,y0,y1,t0,t1,m)=>axis==='x'?B(a0,a1,y0,y1,t0,t1,m,pv):B(t0,t1,y0,y1,a0,a1,m,pv);
  P.push(Bx(-len,0,0,1.98,-0.02,0.02,dm));[[0.12,0.62],[0.72,1.22],[1.32,1.86]].forEach(([y0,y1])=>{P.push(Bx(-len+0.1,-0.1,y0,y1,0.02,0.03,pm));P.push(Bx(-len+0.1,-0.1,y0,y1,-0.03,-0.02,pm));});
  const hm=M('#C4C8CC',0.25,{metalness:0.85});[-1,1].forEach(sd=>P.push(Bx(-len+0.05,-len+0.18,1.02,1.045,sd*0.03,sd*0.06,hm)));
  const sw=swing(pv,'y',open);sw.target=sw.open;pv.rotation.y=sw.open;clickable(P,tog(sw));}
dgDoor(4.4,3.3,0.8,'x',-1.4);
{const pv=new THREE.Group();}
dgDoor(2.84,4.45,0.6,'z',1.3);dgDoor(5.15,4.35,0.8,'z',1.25);
[[3.6,4.4,'z',3.3,3.42],[3.85,4.45,'x',2.84,2.96],[3.55,4.35,'x',5.15,5.27]].forEach(([a,b,ax,c0,c1])=>{if(ax==='z'){dB(a-0.05,a,0,2.04,c0-0.01,c1+0.01,white);dB(b,b+0.05,0,2.04,c0-0.01,c1+0.01,white);dB(a-0.05,b+0.05,2.0,2.05,c0-0.01,c1+0.01,white);}
  else{dB(c0-0.01,c1+0.01,0,2.04,a-0.05,a,white);dB(c0-0.01,c1+0.01,0,2.04,b,b+0.05,white);dB(c0-0.01,c1+0.01,2.0,2.05,a-0.05,b+0.05,white);}});
// Sockelleisten
dB(2.96,5.15,0,0.07,3.42,3.432,white);dB(5.138,5.15,0,0.07,4.4,DKZ1,white);dB(DKX0,DKX1,0,0.07,3.288,3.3,white);
// --- Flur: Geländer, Kommode, Drucker, Decke ---
const rw=M('#F2F0EA',0.45);dB(AX1,AX1+0.05,0,0.95,DH0,DH1,rw);dB(AX1-0.01,AX1+0.06,0.92,0.98,DH0-0.04,DH1,rw);dB(AX0,AX1+0.06,0.92,0.98,DH0-0.05,DH0,rw);dB(AX0,AX1+0.06,0,0.12,DH0-0.05,DH0,rw);
for(let z=DH0+0.06;z<DH1-0.03;z+=0.11)dB(AX1+0.01,AX1+0.04,0.05,0.93,z,z+0.03,rw);for(let x=AX0+0.08;x<AX1;x+=0.11)dB(x,x+0.03,0.1,0.93,DH0-0.04,DH0-0.01,rw);
[[AX1,DH0-0.05],[AX1,DH1-0.06]].forEach(([x,z])=>dB(x-0.01,x+0.06,0,1.02,z,z+0.07,rw));
const dres=M('#FAFAF8',0.35),knob=M('#2A2A2E',0.4);dB(4.65,5.14,0,0.84,5.0,6.62,dres);dB(4.62,5.14,0.84,0.87,4.98,6.64,dres);
[[0.06,0.3],[0.31,0.55],[0.56,0.81]].forEach(([y0,y1],r)=>[[5.02,5.8],[5.82,6.6]].forEach(([z0,z1])=>{const sp=r==2?2:1;for(let q=0;q<sp;q++){const a=z0+(z1-z0)*q/sp,b=z0+(z1-z0)*(q+1)/sp;dB(4.64,4.65,y0+0.01,y1-0.01,a+0.01,b-0.01,dres);dB(4.62,4.64,(y0+y1)/2-0.012,(y0+y1)/2+0.012,(a+b)/2-0.012,(a+b)/2+0.012,knob);}}));
dB(4.72,5.08,0.87,1.12,5.95,6.4,M('#1E1E22',0.5));dB(4.75,4.8,0.87,1.02,5.6,5.66,white);dB(4.75,4.83,0.87,0.94,5.25,5.4,M('#2A6AD8',0.5));
dB(2.97,3.35,0,0.32,3.43,3.8,M('#B8905A',0.85));{const bl=new THREE.Mesh(new THREE.BoxGeometry(0.42,1.0,0.4),stripeM);bl.position.set(3.16,DGF+0.62,3.62);bl.rotation.y=0.15;gDG.add(deco(bl));}
cyl(4.05,4.32,0.13,DGF,0.42,M('#F6F6F4',0.3),18,gDG);
dB(3.9,4.8,DFC-0.03,DFC,3.95,4.7,white);dB(3.98,4.72,DFC-0.05,DFC-0.03,4.03,4.62,M('#ECEAE4',0.6));
cyl(4.3,5.8,0.2,DGF+DFC-0.06,0.05,new THREE.MeshStandardMaterial({color:col('#FFFFFF'),emissive:col('#FFF2D8'),emissiveIntensity:0.6}),28,gDG);cyl(4.6,4.9,0.05,DGF+DFC-0.03,0.03,white,12,gDG);
// --- Yogazimmer ---
const oak=M('#C8935A',0.55);dB(6.4,8.0,0,0.32,0.6,2.6,oak);[[6.4,0.6],[7.9,0.6],[6.4,2.5],[7.9,2.5]].forEach(([x,z])=>dB(x,x+0.1,0,0.32,z,z+0.1,oak));
dB(6.45,7.95,0.32,0.5,0.65,2.55,M('#9CB4CE',0.85));dB(6.45,7.95,0.5,0.55,0.95,2.55,M('#A7BED6',0.9));
dB(0.55,1.35,0.72,0.75,0.8,2.55,M('#D4B48A',0.5));[[0.6,0.85],[0.6,2.45],[1.25,0.85],[1.25,2.45]].forEach(([x,z])=>dB(x,x+0.04,0,0.72,z,z+0.04,M('#9AA0A4',0.4,{metalness:0.5})));
dB(0.68,0.72,0.82,1.28,1.0,1.68,M('#141416',0.4));dB(0.68,0.72,0.84,1.2,1.78,2.38,M('#141416',0.4));dB(0.66,0.7,0.75,0.82,1.25,1.45,M('#2A2A2E',0.4));
dB(1.45,1.95,0.44,0.52,1.35,1.85,M('#1E1E22',0.6));dB(1.88,1.95,0.52,1.15,1.35,1.85,M('#2A2A30',0.6));cyl(1.7,1.6,0.03,DGF,0.44,M('#9AA0A4',0.3,{metalness:0.8}),8,gDG);
dB(0.98,1.0,0.8,1.75,2.6,3.15,white);[[0.95,2.62],[0.95,3.1]].forEach(([x,z])=>dB(x,x+0.03,0,0.95,z,z+0.03,M('#9AA0A4',0.4)));
dB(2.25,3.05,0,1.0,2.88,3.28,M('#D2A66C',0.55));for(let k=0;k<5;k++)dB(2.27,3.03,0.08+k*0.18,0.09+k*0.18,2.875,2.88,M('#B88850',0.6));
art('rooster1',0.5,0.62,2.65,DGF+1.5,3.288,Math.PI,gDG);
dB(3.35,4.45,0.001,0.03,1.0,1.65,M('#21436E',0.9));cyl(3.75,1.3,0.16,DGF+0.03,0.15,M('#2347A0',0.7),18,gDG);dB(3.45,3.95,0.03,0.2,1.35,1.6,M('#8A1E2E',0.85));dB(3.42,3.98,0.2,0.3,1.38,1.58,M('#A82638',0.9));
dB(5.6,6.0,0,0.55,1.6,1.75,M('#2A2C30',0.6));
cyl(4.2,1.8,0.2,DGF+DFC-0.04,0.04,new THREE.MeshStandardMaterial({color:col('#FFFFFF'),emissive:col('#FFF2D8'),emissiveIntensity:0.4}),24,gDG);
// --- Bad ---
dB(5.9,7.62,0,0.55,6.98,7.72,obTileM(1.7,0.55));dB(5.9,7.62,0.55,0.6,6.98,7.72,M('#FAFAFA',0.15));dB(5.98,7.54,0.3,0.601,7.06,7.64,M('#E8ECEE',0.15));dB(5.9,7.62,0.25,0.27,6.975,6.98,M('#2E9E9A',0.4));
{const c=new THREE.Mesh(new THREE.PlaneGeometry(0.72,1.4),new THREE.MeshStandardMaterial({color:col('#F4F6F8'),transparent:true,opacity:0.75,side:THREE.DoubleSide}));c.rotation.y=Math.PI/2;c.position.set(5.92,DGF+1.3,7.35);gDG.add(c);}
dB(5.8,5.93,0,2.2,6.36,6.5,M('#8A4E26',0.8));
dB(5.29,5.75,0,0.8,5.35,6.15,M('#F4F2EA',0.5));for(let z=5.4;z<6.12;z+=0.05)dB(5.75,5.76,0.08,0.75,z,z+0.025,M('#E2DFD6',0.5));dB(5.29,5.8,0.8,0.86,5.32,6.18,M('#FAFAFA',0.2));
{const mr=new THREE.Mesh(new THREE.TorusGeometry(0.3,0.02,8,40),M('#C8CCD0',0.2,{metalness:0.9}));mr.rotation.y=Math.PI/2;mr.position.set(5.31,DGF+1.6,5.75);gDG.add(mr);const mi=new THREE.Mesh(new THREE.CircleGeometry(0.29,32),M('#DCE6EC',0.08,{metalness:0.3}));mi.rotation.y=Math.PI/2;mi.position.set(5.305,DGF+1.6,5.75);gDG.add(mi);}
dB(5.29,5.5,1.15,1.16,5.45,6.05,M('#D8EAEA',0.1,{transparent:true,opacity:0.6}));
// WC an der Nordwand neben der Tür
dB(5.9,7.2,0,0.45,3.44,3.62,obTileM(1.3,0.45));dB(5.9,7.2,0.45,0.48,3.44,3.64,M('#FAFAFA',0.2));
dB(6.42,6.78,0,0.4,3.62,4.12,M('#FAFAFA',0.2));dB(6.4,6.8,0.4,0.43,3.6,4.16,M('#FFFFFF',0.25));dB(6.4,6.8,0.43,0.78,3.6,3.66,M('#FFFFFF',0.25));
dB(6.37,6.83,0.98,1.36,3.44,3.62,M('#F6F4EE',0.3));cyl(6.6,3.55,0.02,DGF+0.48,0.5,M('#F2F2F2',0.3),8,gDG);
dB(6.0,6.12,0.48,0.82,3.48,3.58,M('#F4F4F4',0.4));dB(6.9,7.0,0.48,0.62,3.48,3.58,M('#3A7AD8',0.5));
cyl(5.75,3.72,0.13,DGF,0.28,M('#7A8086',0.4,{metalness:0.4}),16,gDG);
dB(5.32,5.62,0,0.6,3.48,3.72,M('#F4F4F2',0.35));dB(5.32,5.62,0.08,0.3,3.72,3.73,M('#2E5E8A',0.4));
dB(6.5,7.4,0.95,0.97,4.7,5.2,M('#1E2A6A',0.4));[[6.5,4.7],[7.37,5.17]].forEach(([x,z])=>dB(x,x+0.03,0,0.95,z,z+0.03,M('#F2F2F2',0.4)));
dB(5.3,5.36,0.6,1.6,4.4,4.6,M('#7A1A26',0.9));
cyl(6.8,5.6,0.04,DGF+DFC-0.02,0.02,new THREE.MeshStandardMaterial({color:col('#FFFFFF'),emissive:col('#FFF6E0'),emissiveIntensity:0.9}),12,gDG);cyl(6.8,4.6,0.04,DGF+DFC-0.02,0.02,new THREE.MeshStandardMaterial({color:col('#FFFFFF'),emissive:col('#FFF6E0'),emissiveIntensity:0.9}),12,gDG);
// --- Abstellkammer ---
cyl(0.95,4.6,0.012,DGF+1.52,0.01,white,6,gDG);{const rod=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,1.9,8),M('#C8CCD0',0.2,{metalness:0.8}));rod.rotation.x=Math.PI/2;rod.position.set(0.95,DGF+1.5,5.6);gDG.add(rod);}
[4.75,5.2,5.65,6.1,6.5].forEach(z=>{dB(0.7,0.96,1.45,1.53,z,z+0.03,M('#C8CCD0',0.3,{metalness:0.7}));dB(0.94,0.98,1.48,1.56,z,z+0.03,M('#D83A2A',0.5));});
[['#2A2A2E',4.9],['#8A8C90',5.1],['#6E7074',5.3],['#3A2E2A',5.55]].forEach(([c,z])=>dB(0.88,1.02,0.75,1.48,z,z+0.18,M(c,0.9)));
dB(0.3,0.38,0,1.1,5.8,6.9,M('#D8DCE0',0.3,{transparent:true,opacity:0.7}));dB(1.3,1.9,0,0.45,6.4,6.8,M('#F2F0EC',0.6));dB(1.6,2.4,0,0.18,4.6,5.2,M('#1E5AD8',0.5));
dB(2.0,2.6,0,0.6,6.95,7.5,M('#B8905A',0.85));dB(2.05,2.55,0.6,0.95,7.0,7.45,M('#C8A070',0.85));dB(1.0,1.4,0.45,0.52,7.0,7.35,M('#E8E2D4',0.9));
// --- Lichter + Beschriftung ---
[[4.2,1.7],[4.0,5.6],[6.8,5.3],[1.5,5.5]].forEach(([x,z])=>{const l=new THREE.PointLight(col('#FFF4E2'),0.45,6,2);l.position.set(x,DGF+2.1,z);gDG.add(l);});
[['Yogazimmer',4.2,1.7],['Flur (DG)',4.0,5.5],['Bad (DG)',6.8,5.3],['Abstellkammer',1.5,5.6]].forEach(([t,x,z])=>dgLabs.push(label(t,x,DGF+2.7,z)));
}
