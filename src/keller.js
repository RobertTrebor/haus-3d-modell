// Keller: Bogenzimmer, Kellerbüro, Waschküche, Flur, WC, Vorratsraum, Kriechkeller.
// ---- öffenbare Kellerfenster: Blendrahmen fest, Flügel drehen per Klick nach innen ----
function openWin(px,pz,ry,w,y0,y1,nS,mun,glM,wfM){const g=new THREE.Group();g.position.set(px,0,pz);g.rotation.y=ry;gCel.add(g);const wf=wfM||M('#F6F6F4',0.4),fw=0.06,h=y1-y0;
  B(-w/2,-w/2+fw,y0,y1,-0.03,0.03,wf,g);B(w/2-fw,w/2,y0,y1,-0.03,0.03,wf,g);B(-w/2,w/2,y0,y0+fw,-0.03,0.03,wf,g);B(-w/2,w/2,y1-fw,y1,-0.03,0.03,wf,g);
  const sw=(w-2*fw)/nS,sy0=y0+fw,sy1=y1-fw;
  for(let k=0;k<nS;k++){const left=(nS==1)||k==0,pv=new THREE.Group();pv.position.set(left?-w/2+fw:w/2-fw,0,0.0);g.add(pv);const P=[],d=left?1:-1,x0=left?0:-sw,x1=left?sw:0;
    P.push(B(x0,x1,sy0,sy1,-0.004,0.004,glM,pv));P.push(B(x0,x0+0.055,sy0,sy1,-0.025,0.025,wf,pv));P.push(B(x1-0.055,x1,sy0,sy1,-0.025,0.025,wf,pv));P.push(B(x0,x1,sy0,sy0+0.055,-0.025,0.025,wf,pv));P.push(B(x0,x1,sy1-0.055,sy1,-0.025,0.025,wf,pv));
    if(mun){const c=(x0+x1)/2,ym=(sy0+sy1)/2+0.05;P.push(B(c-0.014,c+0.014,sy0+0.05,sy1-0.05,-0.012,0.012,wf,pv));P.push(B(x0+0.05,x1-0.05,ym-0.014,ym+0.014,-0.012,0.012,wf,pv));}
    const fe=left?x1-0.035:x0+0.035;if(left&&(nS==1||k==0&&nS==2)){}P.push(B(fe-0.012,fe+0.012,sy0+h*0.42,sy0+h*0.42+0.13,0.025,0.05,M('#F0F0F0',0.3),pv));
    const a=swing(pv,'y',-d*1.2);clickable(P,tog(a));}
  return g;}
// ---- Bogenzimmer (Keller, links unten an der Kellertreppe) + Kellerbüro ----
const KRX0=rm('kroom','x0',-1.65),KRX1=1.2,KRZ0=rm('kroom','z0',3.84),KRZ1=r4(KRZ0+rm('kroom','tiefe',2.96)),PZ0=4.15,PZ1=5.0,KCH=CF+2.2,KBX0=rm('kbuero','x0',-1.95),KBX1=r4(KBX0+rm('kbuero','breite',4.2)),KBZ0=rm('kbuero','z0',0.0),KBZ1=r4(KBZ0+rm('kbuero','tiefe',3.54));
const lam=canvasTex(512,512,(x,w,h)=>{x.fillStyle='#C99A62';x.fillRect(0,0,w,h);for(let r=0;r<8;r++){const off=(r*173)%512;for(let k=-1;k<3;k++){const px=off+k*256;const g=x.createLinearGradient(px,0,px+256,0);const b=190+rnd()*30;g.addColorStop(0,`rgb(${b+15},${b-35},${b-95})`);g.addColorStop(1,`rgb(${b},${b-45},${b-105})`);x.fillStyle=g;x.fillRect(px,r*64,256,64);x.fillStyle='rgba(90,55,25,0.45)';x.fillRect(px,r*64,2,64);}x.fillStyle='rgba(90,55,25,0.35)';x.fillRect(0,r*64,w,1.5);for(let i=0;i<14;i++){x.strokeStyle='rgba(140,90,45,0.25)';x.beginPath();const yy=r*64+rnd()*64;x.moveTo(0,yy);x.bezierCurveTo(170,yy+rnd()*8-4,340,yy+rnd()*8-4,512,yy);x.stroke();}}});
const lamFloor=(x0,x1,z0,z1)=>{const t=lam.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set((x1-x0)/2.0,(z1-z0)/1.4);const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),new THREE.MeshStandardMaterial({map:t,roughness:0.45}));m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,CF+0.002,(z0+z1)/2);m.userData.noShadow=1;gCel.add(m);};
lamFloor(KRX0,XE,KRZ0,KRZ1);lamFloor(KBX0,KBX1,KBZ0,KBZ1);lamFloor(0.0,0.85,KBZ1,KRZ0);
B(-2.33,XE,CF-0.2,CF,-0.39,KRZ1+0.3,baseM,gCel);
B(XE-0.02,XE+0.33,CF,CF+0.012,PZ0,PZ1,M('#B98A55',0.5),gCel);
// Wände
B(KRX0-0.3,0.0,CF,0,KBZ1,KRZ0,rough,gCel);B(0.85,1.55,CF,0,KBZ1,KRZ0,rough,gCel);B(2.65,XE,CF,0,KBZ1,KRZ0,rough,gCel);B(1.55,2.65,CF,0,KBZ1,KBZ1+0.06,rough,gCel);B(1.55,2.65,CF+1.04,CF+1.12,KBZ1+0.06,KRZ0+0.03,rough,gCel);B(1.55,1.6,CF+1.12,0,KBZ1+0.06,KRZ0,rough,gCel);B(1.6,1.95,CF+2.0,0,KBZ1+0.06,KRZ0,rough,gCel);B(1.95,2.03,CF+1.12,0,KBZ1+0.06,KRZ0,rough,gCel);B(2.03,2.62,CF+1.92,0,KBZ1+0.06,KRZ0,rough,gCel);B(2.62,2.65,CF+1.12,0,KBZ1+0.06,KRZ0,rough,gCel);B(0.0,0.85,CF+2.0,0,KBZ1,KRZ0,rough,gCel);B(0.0,0.85,CF,CF+0.012,KBZ1,KRZ0,M('#C8A050',0.3,{metalness:0.6}),gCel);
B(-2.33,XE,CF,0,KRZ1,KRZ1+0.3,rough,gCelF); // Südwand zur Straße (gCelF, siehe eingang.js)
B(-2.33,KRX0,CF,0,KRZ0,4.95,rough,gCel);B(-2.33,KRX0,CF,0,5.62,KRZ1,rough,gCel);B(-2.33,KRX0,CF,CF+1.38,4.95,5.62,rough,gCel);B(-2.33,KRX0,CF+2.05,0,4.95,5.62,rough,gCel);

B(KRX0,XE,KCH,0,KRZ0,KRZ1,rough,gCel);
// Fenster (Blick auf Rutsche/Garten)
{const wf=M('#F4F4F0',0.4);openWin(-2.26,5.285,Math.PI/2,0.67,CF+1.38,CF+2.05,1,0,new THREE.MeshStandardMaterial({color:col('#CFE6C8'),emissive:col('#BFE0B0'),emissiveIntensity:0.75,transparent:true,opacity:0.85}));
 B(-2.3,KRX0+0.05,CF+1.34,CF+1.38,4.93,5.64,wf,gCel);
 [['#F4F4F0',-2.0,5.05,0.18,0.25],['#2A5AA8',-1.95,5.2,0.12,0.2],['#E8E8E8',-2.05,5.35,0.14,0.18],['#F2D020',-2.0,5.5,0.12,0.12]].forEach(([c,x,z,w,h])=>B(x-w/2,x+w/2,CF+1.38,CF+1.38+h,z-0.06,z+0.06,M(c,0.8),gCel));}
// Segmentbogen parallel zur Ostwand
(function(){const sh=new THREE.Shape(),y0=CF+1.25,yc=CF+1.81,yt=KCH;sh.moveTo(KRZ0,yt);sh.lineTo(KRZ1,yt);sh.lineTo(KRZ1,y0);sh.quadraticCurveTo((KRZ0+KRZ1)/2,yc+(yc-y0),KRZ0,y0);sh.lineTo(KRZ0,yt);
  const g=new THREE.ExtrudeGeometry(sh,{depth:0.32,bevelEnabled:false,curveSegments:32});const m=new THREE.Mesh(g,rough);m.rotation.y=-Math.PI/2;m.position.set(KRX1+0.32,0,0);gCel.add(m);})();
const kRoomL=new THREE.PointLight(col('#FFF1DA'),0.6,6,2);kRoomL.position.set(-0.2,CF+2.1,4.6);gCel.add(kRoomL);
{const l2=new THREE.PointLight(col('#FFE8C8'),0.45,4,2);l2.position.set(2.2,CF+2.0,4.4);gCel.add(l2);}
cyl(0.3,5.4,0.06,KCH-0.03,0.03,M('#F4F4F2',0.4),16,gCel);
// Strahlerleiste über der Tür, Steckdose in der Laibung
B(XE-0.03,XE,CF+2.12,CF+2.18,4.2,4.85,M('#C8CCD0',0.3,{metalness:0.7}),gCel);[4.3,4.75].forEach(z=>{const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.04,0.09,12),M('#D8DCE0',0.3,{metalness:0.7}));sp.rotation.z=Math.PI/2.6;sp.position.set(XE-0.08,CF+2.12,z);gCel.add(sp);const bl=new THREE.Mesh(new THREE.SphereGeometry(0.02,8,6),new THREE.MeshBasicMaterial({color:0xFFF2C8}));bl.position.set(XE-0.12,CF+2.1,z);gCel.add(bl);});
B(XE+0.05,XE+0.14,CF+1.05,CF+1.3,PZ1-0.015,PZ1,M('#E8E8E6',0.4),gCel);B(XE+0.07,XE+0.12,CF+1.2,CF+1.25,PZ1-0.02,PZ1-0.015,M('#E8501E',0.3),gCel);
// Nischen in der Nordwand (Gang): Puzzles links, Pokal/Bastelkram rechts, darunter Kartons + Folienballon; Zählerklappe an der Ostwand; Reifen
{const zf=KBZ1+0.08,zb=KRZ0-0.02;
 const pzc=['#E8E8F0','#1E2A6A','#C82A2A','#2A6AD8','#F2C02A','#1E1E1E','#3AA05A','#E8702A'];
 B(1.62,1.92,CF+1.12,CF+1.17,zf,zb,M('#3A8A4A',0.6),gCel);[0,1,2,3,4,5].forEach(k=>B(1.62+k*0.045,1.66+k*0.045,CF+1.17,CF+1.55+((k*7)%3)*0.04,zf+0.02,zb,M(pzc[k],0.6),gCel));
 B(1.62,1.9,CF+1.6,CF+1.66,zf,zb,M('#1E2A6A',0.6),gCel);B(1.6,1.88,CF+1.66,CF+1.72,zf+0.01,zb,M('#C82A2A',0.6),gCel);B(1.87,1.93,CF+1.17,CF+1.75,zf+0.03,zb,M('#2A6AD8',0.6),gCel);
 const gold=M('#D8B040',0.25,{metalness:0.85});B(2.06,2.14,CF+1.12,CF+1.17,zb-0.12,zb-0.04,M('#1E1E1E',0.4),gCel);cyl(2.1,zb-0.08,0.025,CF+1.17,0.12,M('#2E9A4A',0.3,{metalness:0.4}),10,gCel);{const cup=new THREE.Mesh(new THREE.CylinderGeometry(0.065,0.025,0.11,14),gold);cup.position.set(2.1,CF+1.36,zb-0.08);gCel.add(cup);}
 B(2.2,2.5,CF+1.12,CF+1.17,zf+0.02,zb,M('#2A5AD8',0.5),gCel);B(2.22,2.36,CF+1.17,CF+1.29,zb-0.12,zb-0.02,M('#DDEEF4',0.4,{transparent:true,opacity:0.8}),gCel);B(2.26,2.32,CF+1.29,CF+1.31,zb-0.1,zb-0.04,M('#3AD84A',0.4),gCel);
 gCel.add(blob(2.42,CF+1.28,zb-0.1,0.1,0.11,0.08,M('#F2EEE4',0.95)));cyl(2.57,zb-0.06,0.03,CF+1.12,0.2,M('#D8DCE0',0.3,{metalness:0.7}),10,gCel);B(2.5,2.6,CF+1.12,CF+1.45,zf+0.01,zf+0.06,M('#C8A06A',0.8),gCel);
 [['#E8E4DC',1.6,1.92,0.42],['#B88C5A',1.6,1.85,0.18]].forEach(([c,x0,x1,h],k)=>B(x0,x1,CF+(k?0.42:0),CF+(k?0.42:0)+h,zf+0.02,KRZ0+0.05,M(c,0.8),gCel));
 {const bal=blob(2.15,CF+0.28,KRZ0-0.05,0.25,0.2,0.18,M('#D0D4D8',0.15,{metalness:0.85}));gCel.add(bal);}B(2.38,2.62,CF,CF+0.6,KRZ0-0.08,KRZ0+0.02,M('#D8BC88',0.9),gCel);
 B(XE-0.012,XE,CF+1.1,CF+1.75,3.88,4.12,M('#F2F2F0',0.35),gCel);B(XE-0.016,XE-0.012,CF+1.12,CF+1.73,3.9,4.1,M('#E8E8E6',0.35),gCel);cyl(XE-0.02,4.06,0.008,CF+1.42,0.01,M('#888',0.3),8,gCel);
 [['#1A1A1A',0.5],['#2A7AD8',0.46],['#E8701E',0.44],['#F2C02A',0.42],['#E8E8E8',0.4]].forEach(([c,r],i)=>{const t=new THREE.Mesh(new THREE.TorusGeometry(r,0.016,8,48),M(c,0.5));t.position.set(XE-0.06-i*0.03,CF+r+0.01,3.88+r*0.6);t.rotation.y=Math.PI/2;t.rotation.x=0.06;gCel.add(t);});
 B(1.38,1.42,CF,CF+1.6,KRZ0+0.1,KRZ0+0.14,M('#F4F4F2',0.4),gCel);B(1.48,1.52,CF,CF+1.6,KRZ0+0.1,KRZ0+0.14,M('#F4F4F2',0.4),gCel);}
// südlich der Tür: Lamellentüren, obere Nische, Garderobennische mit Kleiderstange, GAS-Schild
{const louT=canvasTex(64,128,(x,w,h)=>{x.fillStyle='#F2F0EA';x.fillRect(0,0,w,h);for(let y=10;y<h-8;y+=7){x.fillStyle='rgba(120,115,105,0.55)';x.fillRect(7,y,w-14,2);x.fillStyle='rgba(255,255,255,0.9)';x.fillRect(7,y+2,w-14,1);}x.strokeStyle='#D8D4CA';x.lineWidth=5;x.strokeRect(3,3,w-6,h-6);},null);
 const lM=new THREE.MeshStandardMaterial({map:louT,roughness:0.6});[[5.08,5.5],[5.56,5.98]].forEach(([z0,z1])=>{const pl=new THREE.Mesh(new THREE.PlaneGeometry(z1-z0,0.8),lM);pl.rotation.y=-Math.PI/2;pl.position.set(XE-0.012,CF+1.6,(z0+z1)/2);gCel.add(pl);B(XE-0.012,XE,CF+1.2,CF+2.0,z0-0.01,z0,M('#E0DCD2',0.6),gCel);});
 B(XE-0.01,XE,CF+1.02,CF+1.09,5.05,5.15,M('#F2D020',0.5),gCel);
 const bar2=new THREE.Mesh(new THREE.CylinderGeometry(0.014,0.014,1.6,8),M('#C8CCD0',0.3,{metalness:0.7}));bar2.rotation.x=Math.PI/2;bar2.position.set(2.62,CF+1.08,5.85);gCel.add(bar2);
 [[2.55,5.1],[2.55,6.6]].forEach(([x,z])=>B(x-0.015,x+0.015,CF,CF+1.08,z,z+0.03,M('#F4F4F2',0.4),gCel));
 [['#2A3A6A',0.95],['#4A4A3A',1.0],['#2A2A2E',0.9],['#C8A8D8',0.85],['#C89A3A',0.8],['#D83A3A',0.9],['#1E2440',0.95],['#6A6A72',0.8]].forEach(([c,h],i)=>B(2.48,2.76,CF+1.06-h,CF+1.06,5.15+i*0.18,5.3+i*0.18,M(c,0.9),gCel));
 [['#C8303A',0,0.6],['#2A4AA8',0.25,0.45],['#1E1E20',0.5,0.5],['#E06A30',0.15,0.35]].forEach(([c,dz,h],i)=>gCel.add(blob(2.45-i*0.05,CF+h*0.6,6.45-dz*0.6,0.28,h*0.6,0.22,M(c,0.85))));
 [['#F4E8EC',6.1,6.3,0.3],['#E86A9A',6.15,6.35,0.22],['#C8A070',6.25,6.5,0.18],['#2A5AA8',6.45,6.62,0.14]].forEach(([c,z0,z1,h])=>B(XE+0.02,2.94,CF+1.25,CF+1.25+h,z0,z1,M(c,0.85),gCel));B(XE+0.02,2.95,CF+0.05,CF+0.95,6.1,6.6,M('#B8803A',0.6),gCel);{const wh=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.012,6,24),M('#2A2A2E',0.5));wh.position.set(2.82,CF+1.5,6.45);wh.rotation.y=Math.PI/2;gCel.add(wh);}}
// Regal aus Fichte an der Südwand (bis unter die Decke)
const shelfPine=M('#D9B98A',0.6);[KRX0+0.02,-0.25,KRX1-0.05].forEach(x=>B(x-0.04,x,CF,KCH-0.05,KRZ1-0.45,KRZ1,shelfPine,gCel));
[0.05,0.5,0.95,1.4,1.85].forEach((y,j)=>{B(KRX0+0.02,KRX1-0.05,CF+y,CF+y+0.025,KRZ1-0.45,KRZ1,shelfPine,gCel);
  for(let k=0;k<8;k++){const x=KRX0+0.1+k*0.34+rnd()*0.04;B(x,x+0.22+rnd()*0.06,CF+y+0.025,CF+y+0.17+rnd()*0.2,KRZ1-0.42,KRZ1-0.05,M(['#E85A8A','#3AA0D8','#F2C23A','#FFFFFF','#E4E0D8','#7AC04A','#E84A3A','#8A8C90','#E87A2A'][(j*5+k)%9],0.7),gCel);}});
// Bücherregal + Kartons + Ski am Südende des Gangs
B(1.6,2.2,CF,CF+1.85,KRZ1-0.35,KRZ1,M('#E2C9A0',0.6),gCel);[0.4,0.8,1.2,1.6].forEach(y=>B(1.62,2.18,CF+y,CF+y+0.02,KRZ1-0.33,KRZ1-0.02,M('#D8BC90',0.6),gCel));
[0.42,0.82,1.22].forEach((y,j)=>[0,1,2].forEach(k=>B(1.65+k*0.18,1.8+k*0.18,CF+y+0.02,CF+y+0.2,KRZ1-0.3,KRZ1-0.08,M(['#2A2A2E','#C8B898','#8A5A3A','#F4F4F0'][(j+k)%4],0.7),gCel)));
[[1.25,1.6,0,0.45],[1.25,1.6,0.45,0.85],[2.2,2.6,0,0.5]].forEach(([x0,x1,y0,y1])=>B(x0,x1,CF+y0,CF+y1,KRZ1-0.4,KRZ1-0.05,M('#B88C5A',0.85),gCel));
B(2.22,2.28,CF,CF+1.6,KRZ1-0.5,KRZ1-0.44,M('#1E1E20',0.4),gCel);B(2.3,2.36,CF,CF+1.6,KRZ1-0.5,KRZ1-0.44,M('#1E1E20',0.4),gCel);
// Bügelbrett mit Muster + Bügeleisen, Rattanhocker
{const ibT=canvasTex(128,64,(x,w,h)=>{x.fillStyle='#F4F0E6';x.fillRect(0,0,w,h);[['#E84A3A',20,20],['#2A9AA8',60,40],['#F2C02A',100,18],['#3A8A4A',45,12],['#E84A3A',90,50]].forEach(([c,cx,cy])=>{x.strokeStyle=c;x.lineWidth=2;for(let a=0;a<6.28;a+=0.4){x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*12,cy+Math.sin(a)*12);x.stroke();}});},null);
 B(1.6,1.95,CF+0.88,CF+0.91,5.0,6.25,new THREE.MeshStandardMaterial({map:ibT,roughness:0.8}),gCel);[[5.3,0.5],[5.95,-0.5]].forEach(([z,r])=>{const l=new THREE.Mesh(new THREE.BoxGeometry(0.02,1.0,0.02),M('#F4F4F2',0.4));l.position.set(1.78,CF+0.45,z);l.rotation.x=r;gCel.add(l);});
 B(1.7,1.85,CF+0.91,CF+1.05,5.25,5.5,M('#A8D8D8',0.3),gCel);
 const rat=canvasTex(64,64,(x,w,h)=>{x.fillStyle='#C8A060';x.fillRect(0,0,w,h);x.strokeStyle='rgba(120,80,30,0.6)';x.lineWidth=2;for(let i=0;i<w;i+=6){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(w,i);x.stroke();}},[2,2]);
 window.__ratM=new THREE.MeshStandardMaterial({map:rat,roughness:0.8});B(0.55,1.0,CF,CF+0.45,5.95,6.3,window.__ratM,gCel);}
// Wäscheständer, zwei Rattanstühle, Pool-Nudel, Bilderrahmen
{const rackMet=M('#E8ECEE',0.3,{metalness:0.5});B(-1.1,0.2,CF+0.88,CF+0.9,4.85,5.45,rackMet,gCel);for(let k=0;k<9;k++)B(-1.1,0.2,CF+0.9,CF+0.905,4.87+k*0.065,4.88+k*0.065,rackMet,gCel);
 [[-1.05,4.85],[0.15,4.85],[-1.05,5.43],[0.15,5.43]].forEach(([x,z])=>B(x,x+0.02,CF,CF+0.9,z,z+0.02,rackMet,gCel));
 const ratM=window.__ratM,chair=(x,z,ry)=>{const g=new THREE.Group();g.position.set(x,CF,z);g.rotation.y=ry;gCel.add(g);B(-0.22,0.22,0.45,0.5,-0.22,0.22,ratM,g);B(-0.22,0.22,0.5,1.05,0.19,0.23,ratM,g);[[-0.2,-0.2],[0.2,-0.2],[-0.2,0.2],[0.2,0.2]].forEach(([a,b])=>B(a-0.02,a+0.02,0,0.45,b-0.02,b+0.02,M('#C8A070',0.6),g));};
 chair(-0.75,4.35,0.2);chair(-0.15,4.25,-0.15);B(-0.95,-0.55,CF+0.5,CF+0.75,4.3,4.55,M('#1E1E20',0.8),gCel);B(-0.32,0.05,CF+0.5,CF+0.68,4.1,4.4,M('#F4F4F0',0.9),gCel);
 {const nd=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.04,1.5,10),M('#1E9AA8',0.6));nd.position.set(-0.3,CF+0.72,KRZ0+0.25);nd.rotation.z=0.35;gCel.add(nd);}
 B(-1.62,-1.58,CF,CF+0.75,5.0,5.45,M('#5A3A22',0.6),gCel);}
// weißes Hochglanz-Sideboard an der Nordwand, Ablagen darauf, Luftentfeuchter
{const gl=M('#F8F8F6',0.12),sx0=-1.6,sx1=-0.15,sz0=KRZ0,sz1=KRZ0+0.45;B(sx0,sx1,CF+0.05,CF+0.95,sz0,sz1,gl,gCel);B(sx0+0.02,sx1-0.02,CF+0.62,CF+0.625,sz1,sz1+0.003,M('#D8D8D6',0.3),gCel);B((sx0+sx1)/2-0.002,(sx0+sx1)/2+0.002,CF+0.07,CF+0.6,sz1,sz1+0.003,M('#D8D8D6',0.3),gCel);
 B(sx0+0.1,sx0+0.5,CF+0.95,CF+1.25,sz0+0.05,sz0+0.4,M('#4A88C8',0.4),gCel);for(let k=0;k<4;k++)B(sx0+0.1,sx0+0.5,CF+0.98+k*0.07,CF+0.99+k*0.07,sz0+0.4,sz0+0.41,M('#2A2A2E',0.4),gCel);
 B(sx0+0.6,sx0+1.0,CF+0.95,CF+1.05,sz0+0.05,sz0+0.4,M('#8A6A48',0.8),gCel);B(sx0+1.05,sx0+1.3,CF+0.95,CF+1.35,sz0+0.05,sz0+0.4,M('#B8B4A4',0.5),gCel);
 B(-0.45,-0.15,CF,CF+0.55,KRZ0+0.5,KRZ0+0.72,M('#F4F4F2',0.35),gCel);B(-0.41,-0.19,CF+0.52,CF+0.55,KRZ0+0.53,KRZ0+0.69,M('#9A9EA2',0.5),gCel);}
// Kartonberg vor dem Bogenpfeiler (Galaxus, be quiet!, Amazon), Rollcontainer, Holztruhe, Alukoffer
{const card=M('#B88C5A',0.85);
 [[0.88,1.2,0,0.6,KRZ0+0.05,KRZ0+0.5,'#EAE6DC'],[0.88,1.2,0.6,0.95,KRZ0+0.05,KRZ0+0.5,0],[0.9,1.2,0.95,1.3,KRZ0+0.05,KRZ0+0.48,0],[0.92,1.2,1.3,1.6,KRZ0+0.05,KRZ0+0.45,0],[0.88,1.2,0,0.45,KRZ0+0.55,KRZ0+1.0,0],[0.9,1.2,0.45,0.8,KRZ0+0.58,KRZ0+0.98,0],[0.2,0.8,0,0.38,KRZ0+0.9,KRZ0+1.3,'#6A4A2E']].forEach(([x0,x1,y0,y1,z0,z1,c])=>B(x0,x1,CF+y0,CF+y1,z0,z1,c?M(c,0.7):card,gCel));
 B(1.6,2.0,CF,CF+0.25,KRZ0+0.5,KRZ0+0.85,M('#C8CCD0',0.25,{metalness:0.8}),gCel);B(2.05,2.45,CF,CF+0.22,KRZ0+0.55,KRZ0+0.85,M('#2A2A2E',0.4),gCel);}
// ---- Kellerbüro (Glastür + Sprossenfenster zum Hof, großes Fenster zur Gartenterrasse mit Lamellenvorhang) ----
{const wf=M('#F6F6F4',0.4),marb=M('#E6DAC4',0.25),gl=new THREE.MeshStandardMaterial({color:col('#CFE6C0'),emissive:col('#B8DCA0'),emissiveIntensity:0.7});
 // Fenster mit zwei Flügeln und Sprossen; lokale Ebene: Breite x, Glas bei z=0, Normale +z
 const sWin=(px,pz,ry,w,y0,y1)=>openWin(px,pz,ry,w,y0,y1,2,1,new THREE.MeshStandardMaterial({color:col('#CFE6C0'),emissive:col('#B8DCA0'),emissiveIntensity:0.7,transparent:true,opacity:0.85}),wf);
 // Nordwand (Hof): Glastür, Sprossenfenster
 B(-1.18,0.03,CF,0,-0.36,KBZ0,rough,gCel);B(1.77,KBX1+0.3,CF,0,-0.36,KBZ0,rough,gCel);B(0.03,1.77,CF,CF+0.8,-0.36,KBZ0,rough,gCel);B(0.03,1.77,CF+2.05,0,-0.36,KBZ0,rough,gCel);B(KBX0,-1.98,CF,0,-0.36,KBZ0,rough,gCel);B(-1.98,-1.18,CF+2.1,0,-0.36,KBZ0,rough,gCel);
 sWin(0.9,-0.28,0,1.74,CF+0.8,CF+2.05);B(0.01,1.79,CF+0.8-0.04,CF+0.8,-0.25,KBZ0+0.05,marb,gCel);
 {const pv=new THREE.Group();pv.position.set(-1.96,CF,-0.04);gCel.add(pv);const P=[];P.push(B(0,0.76,0,2.06,-0.02,0.02,[wf,wf,wf,wf,wf,wf],pv));P.push(B(0.1,0.66,0.12,1.96,-0.025,0.025,new THREE.MeshStandardMaterial({color:col('#9DB8A8'),emissive:col('#7E9E8C'),emissiveIntensity:0.45,roughness:0.3}),pv));
  P.push(B(0.66,0.72,1.0,1.06,0.02,0.07,M('#E8E8E8',0.3),pv));const a=swing(pv,'y',-1.35);window.__tdA=a;clickable(P,()=>{a.target=a.target?0:a.open;if(window.__tdE)window.__tdE.target=a.target?window.__tdE.open:0;});}
 [CF+0.3,CF+1.0,CF+1.75].forEach(y=>B(-1.99,-1.96,y,y+0.08,-0.06,-0.02,wf,gCel));
 // Westwand: großes Fenster zur Terrasse
 B(-2.33,KBX0,CF,0,KBZ0,1.195,rough,gCel);B(-2.33,KBX0,CF,0,2.935,KBZ1,rough,gCel);B(-2.33,KBX0,CF,CF+0.8,1.195,2.935,rough,gCel);B(-2.33,KBX0,CF+2.05,0,1.195,2.935,rough,gCel);
 sWin(-2.24,2.065,Math.PI/2,1.74,CF+0.8,CF+2.05);B(-2.21,KBX0+0.09,CF+0.8-0.04,CF+0.8,1.175,2.955,marb,gCel);
 // Ostwand, Deckenabhängungen, Downlights
 B(KBX1,KBX1+0.3,CF,0,KBZ0,KBZ1,rough,gCel);B(KBX0,KBX1+0.3,KCH,0,KBZ0,KBZ1,M('#F8F8F6',0.9),gCel);
 const bmX0=KBX0+1.5,bmX1=bmX0+0.385;B(bmX0,bmX1,KCH-0.15,KCH,KBZ0,KBZ1,M('#F8F8F6',0.9),gCel);
 [0.6,1.77,2.94].flatMap(z=>[[(KBX0+bmX0)/2,z],[bmX1+(KBX1-bmX1)*0.27,z],[bmX1+(KBX1-bmX1)*0.73,z]]).forEach(([x,z])=>{cyl(x,z,0.045,KCH-0.012,0.012,M('#E8E8E8',0.3,{emissive:col('#FFFFFF'),emissiveIntensity:0.6}),14,gCel);});
 {const ol=new THREE.PointLight(col('#FFF4E0'),0.6,6,2);ol.position.set(0.0,CF+2.0,1.6);gCel.add(ol);const o2=new THREE.PointLight(col('#FFF4E0'),0.35,4,2);o2.position.set(1.8,CF+2.0,1.2);gCel.add(o2);}
 B(KBX0+0.02,KBX0+0.05,0,0,0,0,wf,gCel);
 B(0.92,1.0,CF+1.05,CF+1.17,KBZ1-0.015,KBZ1,wf,gCel);
 // Lamellenvorhang gelb/orange (Klick: auf/zu)
 const blind=(ax,fc,a0,a1,stackAt1)=>{const NS=Math.round((a1-a0)/0.09),sw=(a1-a0)/NS+0.012,ty=KCH-0.03,L=ty-(CF+0.75);
   if(ax==='z')B(fc-0.02,fc+0.03,ty-0.04,ty,a0,a1,wf,gCel);else B(a0,a1,ty-0.04,ty,fc-0.03,fc+0.02,wf,gCel);
   const slats=[];for(let i=0;i<NS;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(0.004,L,sw),new THREE.MeshStandardMaterial({color:col(i%2?'#F28A1E':'#F7C52A'),roughness:0.75,side:THREE.DoubleSide}));m.position.set(ax==='z'?fc:0,ty-0.04-L/2,ax==='z'?0:fc);if(ax!=='z')m.rotation.y=Math.PI/2;gCel.add(m);slats.push(m);}
   const place=t=>slats.forEach((m,i)=>{const c=a0+(i+0.5)*(a1-a0)/NS,o=stackAt1?a1-0.05-(NS-1-i)*0.011:a0+0.05+i*0.011,v=c+(o-c)*t,r=0.25+(Math.PI/2-0.25)*t;if(ax==='z'){m.position.z=v;m.rotation.y=r;}else{m.position.x=v;m.rotation.y=Math.PI/2+r;}});
   const st={t:0};place(0);const a=anim(()=>st.t,v=>{st.t=v;place(v);},1);clickable(slats,()=>{a.target=a.target>0.5?0:1;});return a;};
 window.__blind=blind('z',KBX0+0.12,0.95,3.2,true);window.__blind2=blind('x',KBZ0+0.12,-0.15,1.95,false);
 // Schreibtisch am Terrassenfenster (parallel zur Wand), drei Laptops, Stuhl davor, Luftreiniger links, Stehlampe rechts
 const dk=M('#C8834A',0.45),lg=M('#5A5E62',0.35,{metalness:0.6}),dx0=-1.86,dx1=-1.2,dz0=1.3,dz1=3.0;B(dx0,dx1,CF+0.72,CF+0.75,dz0,dz1,dk,gCel);[[dx0+0.05,dz0+0.05],[dx1-0.05,dz0+0.05],[dx0+0.05,dz1-0.05],[dx1-0.05,dz1-0.05]].forEach(([x,z])=>B(x-0.02,x+0.02,CF,CF+0.72,z-0.02,z+0.02,lg,gCel));
 const lap=(x,z,ry,open)=>{const g=new THREE.Group();g.position.set(x,CF+0.75,z);g.rotation.y=ry;gCel.add(g);B(-0.17,0.17,0,0.015,-0.12,0.12,M('#8A8C90',0.4,{metalness:0.4}),g);if(open){const sc=B(-0.17,0.17,0,0.23,-0.01,0.0,M('#2A2C30',0.3),g);sc.position.z=-0.12;sc.rotation.x=-0.25;B(-0.15,0.15,0.016,0.018,-0.1,0.05,M('#3A3C40',0.5),g);}else B(-0.17,0.17,0.015,0.025,-0.12,0.12,M('#7A7C80',0.4,{metalness:0.4}),g);};
 lap(-1.5,1.75,Math.PI/2,0);lap(-1.55,2.2,Math.PI/2,1);lap(-1.5,2.65,Math.PI/2,0);
 B(-1.42,-1.25,CF+0.75,CF+0.77,2.85,2.98,M('#F4F4F0',0.8),gCel);gCel.add(blob(-1.6,CF+0.79,2.88,0.09,0.035,0.06,M('#1E1E20',0.4)));{const mt=new THREE.Mesh(new THREE.SphereGeometry(0.045,12,8),M('#8A5A3A',0.5));mt.position.set(-1.78,CF+0.8,2.75);gCel.add(mt);}
 {const ec=new THREE.Mesh(new THREE.SphereGeometry(0.07,14,10),M('#7AA0C8',0.6));ec.position.set(-1.72,CF+0.82,1.45);gCel.add(ec);}B(-1.8,-1.7,CF+0.75,CF+0.97,1.85,1.93,M('#F4F4F2',0.4),gCel);B(-1.45,-1.25,CF+0.75,CF+0.85,1.35,1.6,M('#E8E8E6',0.8),gCel);
 cyl(-1.33,2.2,0.025,CF+0.76,0.01,M('#2A2A2E',0.4),12,gCel);
 // dunkler Holzstuhl mit Sprossenlehne (Rückenlehne zum Raum)
 const chairD=(x,z,ry,cushion)=>{const g=new THREE.Group();g.position.set(x,CF,z);g.rotation.y=ry;gCel.add(g);const w=M('#4A2A1A',0.5);B(-0.22,0.22,0.44,0.48,-0.2,0.2,w,g);[[-0.2,-0.18],[0.2,-0.18],[-0.2,0.18],[0.2,0.18]].forEach(([a,b])=>B(a-0.02,a+0.02,0,0.44,b-0.02,b+0.02,w,g));
   for(let k=0;k<5;k++)B(-0.18+k*0.09,-0.15+k*0.09,0.48,0.98,0.17,0.2,w,g);B(-0.22,0.22,0.95,1.0,0.16,0.21,w,g);if(cushion)B(-0.2,0.2,0.48,0.52,-0.18,0.16,M(cushion,0.8),g);return g;};
 chairD(-0.85,2.2,Math.PI/2,'#C8303A');
 B(-1.92,-1.66,CF,CF+0.62,3.12,3.38,M('#F6F6F4',0.4),gCel);cyl(-1.79,3.25,0.09,CF+0.62,0.005,M('#BBBBBB',0.5),16,gCel);
 {const lx=-1.7,lz=1.0;cyl(lx,lz,0.012,CF,1.62,M('#C8CCD0',0.25,{metalness:0.8}),8,gCel);cyl(lx,lz,0.12,CF,0.02,M('#C8CCD0',0.25,{metalness:0.8}),20,gCel);const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.07,0.22,16,1,true),new THREE.MeshStandardMaterial({color:col('#F4F4F0'),transparent:true,opacity:0.45,side:THREE.DoubleSide}));sh.position.set(lx,CF+1.7,lz);gCel.add(sh);const bu=new THREE.Mesh(new THREE.SphereGeometry(0.04,10,8),new THREE.MeshBasicMaterial({color:0xFFF6E0}));bu.position.set(lx,CF+1.66,lz);gCel.add(bu);}
 // Schreibtisch unter dem Hoffenster mit Monitor, Tastatur, Ablage; Aktenvernichter; Stuhl mit Tuch
 B(-0.1,1.95,CF+0.72,CF+0.75,0.05,0.85,dk,gCel);[[-0.05,0.1],[1.9,0.1],[-0.05,0.8],[1.9,0.8]].forEach(([x,z])=>B(x-0.02,x+0.02,CF,CF+0.72,z-0.02,z+0.02,lg,gCel));
 B(0.35,1.0,CF+0.9,CF+1.3,0.28,0.3,M('#1E1E20',0.3),gCel);B(0.36,0.99,CF+0.88,CF+0.9,0.27,0.31,M('#D8D8DC',0.3,{metalness:0.6}),gCel);B(0.62,0.72,CF+0.75,CF+0.88,0.24,0.32,M('#D8D8DC',0.3,{metalness:0.6}),gCel);
 B(0.3,0.75,CF+0.75,CF+0.77,0.45,0.6,M('#1E1E20',0.5),gCel);B(0.85,0.93,CF+0.75,CF+0.79,0.48,0.56,M('#2A2A2E',0.4),gCel);B(1.4,1.85,CF+0.75,CF+0.82,0.4,0.75,M('#D8282A',0.5),gCel);B(1.45,1.8,CF+0.82,CF+0.84,0.42,0.72,M('#F4F4F2',0.9),gCel);
 B(-0.4,-0.12,CF,CF+0.55,0.15,0.4,M('#1E1E20',0.5),gCel);
 {const c2=chairD(0.8,1.15,0,null);const cl=blob(0.8,CF+0.78,1.36,0.26,0.32,0.1,M('#F2F2EE',0.9));gCel.add(cl);}
 // Figuren auf der Marmorbank, Spiegel
 [['#C83A3A',0.2],['#F4F4F0',0.38],['#E8E8E8',0.55],['#B85A3A',0.75],['#E8A060',1.1],['#C8603A',1.5]].forEach(([c,x])=>{const f=new THREE.Mesh(new THREE.SphereGeometry(0.035,10,8),M(c,0.5));f.scale.set(1,1.4,1);f.position.set(x,CF+0.85,-0.15);gCel.add(f);});
 {const mr=new THREE.Mesh(new THREE.TorusGeometry(0.08,0.015,8,20),M('#8A5A2E',0.5));mr.position.set(1.32,CF+1.0,-0.15);gCel.add(mr);cyl(1.32,-0.15,0.008,CF+0.82,0.1,M('#2A2A2A',0.5),6,gCel);}
 // Regale: zwei Buche-Aktenschränke an der Südwand, weißes Billy an der Ostwand
 const beech=M('#D08A3A',0.55),bz0=KBZ1-0.38;[[0.62,1.42],[1.46,2.22]].forEach(([x0,x1],u)=>{B(x0,x1,CF,CF+2.0,bz0,KBZ1,beech,gCel);
   for(let r=0;r<2;r++){const y=CF+1.05+r*0.47;B(x0+0.03,x1-0.03,y,y+0.42,bz0-0.002,bz0+0.0,M('#9A6028',0.8),gCel);
     for(let k=0;k<7;k++){const xx=x0+0.05+k*0.105;const c=(u+r+k)%5==0?'#D8203A':((k%3)?'#2A2A2E':'#F2F2EE');B(xx,xx+0.075,y+0.02,y+0.33,bz0-0.005,bz0+0.28,M(c,0.6),gCel);B(xx+0.02,xx+0.055,y+0.08,y+0.2,bz0-0.007,bz0-0.005,M('#F4F4F0',0.7),gCel);}}
   B(x0+0.02,x1-0.02,CF+0.02,CF+0.98,bz0-0.004,bz0,beech,gCel);B((x0+x1)/2-0.003,(x0+x1)/2+0.003,CF+0.04,CF+0.96,bz0-0.006,bz0-0.004,M('#9A6028',0.6),gCel);
   B(x0+0.04,x1-0.04,CF+2.0,CF+2.22,bz0+0.05,KBZ1-0.02,M('#2A2A2E',0.5),gCel);});
 B(1.5,1.58,CF+1.25,CF+1.45,bz0-0.006,bz0-0.004,M('#F4E8F0',0.8),gCel);
 {const bw=M('#F4F2EA',0.5),bx0=KBX1-0.3;B(bx0,KBX1,CF,CF+2.02,0.95,1.7,bw,gCel);[0.35,0.75,1.15,1.55].forEach(y=>B(bx0,KBX1-0.02,CF+y,CF+y+0.02,0.97,1.68,bw,gCel));B(bx0+0.02,KBX1,CF+0.03,CF+2.0,0.95,0.97,bw,gCel);B(bx0+0.02,KBX1,CF+0.03,CF+2.0,1.68,1.7,bw,gCel);
  [[0.37,'#2A7AA8',1.0,1.2],[0.77,'#D8203A',1.3,1.45],[1.17,'#F4F4F0',1.05,1.4],[1.57,'#2A9A8A',1.0,1.15]].forEach(([y,c,z0,z1])=>B(bx0+0.04,KBX1-0.04,CF+y,CF+y+0.25,z0,z1,M(c,0.6),gCel));
  B(KBX1-0.08,KBX1-0.06,CF+1.2,CF+1.36,1.25,1.5,M('#C8D8E8',0.5),gCel);}
}


// ---- Keller: Waschküche mit Außentür, Flur, WC, Vorratsraum ----
const VX0=rm('kvest','x0',2.55),VX1=r4(VX0+rm('kvest','breite',2.5)),VZ0=rm('kvest','z0',0.0),WKZ1=r4(VZ0+rm('kvest','tiefe',3.63)),WKD0=3.98,WKD1=4.58,VZ1=3.72,KFX1=5.8,KFZ0=2.3,WX0=5.95,WX1=7.95,WZ0=2.45,WZ1=3.42,PX0=rm('kpantry','x0',6.25),PX1=r4(PX0+rm('kpantry','breite',2.16)),PZ0b=rm('kpantry','z0',4.83),PZ1b=r4(PZ0b+rm('kpantry','tiefe',1.87));
const garageDoorZ0=2.35,garageDoorZ1=3.20,garageDoorH=2.05;
const kTile=cellTile;
const kfl=(x0,x1,z0,z1,tex,sz)=>gCel.add(tileFloor(x0,x1,z0,z1,CF,tex||kTile,sz||0.8));
{const wkT=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#A9ABA8';x.fillRect(0,0,w,h);for(let i=0;i<500;i++){x.fillStyle=`rgba(${rnd()<0.5?'255,255,255':'60,60,60'},${0.04+rnd()*0.08})`;x.beginPath();x.ellipse(rnd()*w,rnd()*h,3+rnd()*14,2+rnd()*8,rnd()*3,0,6.3);x.fill();}},null);kfl(VX0,VX1,VZ0,WKZ1+0.25,wkT,1.6);}kfl(VX0,VX1,WKZ1+0.25,VZ1);
B(VX0-0.3,VX1+0.3,CF-0.2,CF,-0.3,VZ1,baseM,gCel);B(CW1,8.86,CF-0.2,CF,3.7,8.4,baseM,gCel);
// Wände Waschküche
B(VX0-0.3,VX0,CF,0,-0.36,WKZ1+0.07,rough,gCel);
B(VX0,3.08,CF,0,-0.36,VZ0,rough,gCel);B(3.08,3.45,CF,CF+0.8,-0.36,VZ0,rough,gCel);B(3.08,3.45,CF+2.0,0,-0.36,VZ0,rough,gCel);B(3.45,3.55,CF,0,-0.36,VZ0,rough,gCel);B(3.55,4.4,CF+2.06,0,-0.36,VZ0,rough,gCel);B(4.4,VX1+0.15,CF,0,-0.36,VZ0,rough,gCel);
B(VX1,VX1+0.15,CF,0,VZ0,garageDoorZ0,rough,gCel);B(VX1,VX1+0.15,CF,0,garageDoorZ1,VZ1,rough,gCel);B(VX1,VX1+0.15,CF+garageDoorH,0,garageDoorZ0,garageDoorZ1,rough,gCel);
B(VX0,WKD0,CF,0,WKZ1,WKZ1+0.07,rough,gCel);B(WKD1,VX1,CF,0,WKZ1,WKZ1+0.3,rough,gCel);B(WKD0,WKD1,CF+2.0,0,WKZ1,WKZ1+0.07,rough,gCel);
B(CW1,4.6,CF+2.0,0,VZ1,VZ1+0.23,rough,gCel);
B(VX0,VX1+0.15,CF+2.2,0,VZ0,VZ1,rough,gCel);
{
 const jambs=[[VX1-0.025,VX1+0.025],[5.275,5.325]],trim=M('#F4F2EC',0.45);
 jambs.forEach(([x0,x1])=>{
   B(x0,x1,CF,CF+garageDoorH,garageDoorZ0-0.05,garageDoorZ0,trim);
   B(x0,x1,CF,CF+garageDoorH,garageDoorZ1,garageDoorZ1+0.05,trim);
   B(x0,x1,CF+garageDoorH,CF+garageDoorH+0.06,garageDoorZ0-0.05,garageDoorZ1+0.05,trim);
 });
 const frame=new THREE.Group();frame.position.set((VX1+5.3)/2,CF,garageDoorZ1);frame.rotation.y=Math.PI/2;scene.add(frame);
 const pivot=new THREE.Group();frame.add(pivot);
 const slab=B(0.035,0.815,0.025,garageDoorH-0.02,-0.025,0.025,leaf,pivot);
 const knobM=M('#B8BCC0',0.3,{metalness:0.65});B(0.72,0.75,0.96,1.08,0.026,0.045,knobM,pivot);
 B(0.68,0.73,1.015,1.045,0.04,0.12,knobM,pivot);
 const doorSwing=swing(pivot,'y',-1.35);clickable([slab],tog(doorSwing));
 const portalMat=new THREE.MeshBasicMaterial({color:0xffffff,colorWrite:false,depthWrite:false,side:THREE.DoubleSide});
 [5.14,5.21].forEach(x=>{const portal=new THREE.Mesh(new THREE.PlaneGeometry(garageDoorZ1-garageDoorZ0,garageDoorH),portalMat);portal.rotation.y=Math.PI/2;portal.position.set(x,CF+garageDoorH/2,(garageDoorZ0+garageDoorZ1)/2);portal.userData.navPortal={rooms:{garage:'kvest',kvest:'garage'},isOpen:()=>Math.abs(doorSwing.target)>1.0};clickable([portal],tog(doorSwing));scene.add(portal);});
}
// Milchglasfenster mit Betonbrüstung
{const wf=M('#F6F6F4',0.4),fr=new THREE.MeshStandardMaterial({color:col('#D8E2E0'),emissive:col('#C8D6D2'),emissiveIntensity:0.85,roughness:0.3});
 openWin(3.265,-0.19,0,0.37,CF+0.8,CF+2.0,1,0,fr);
 B(3.06,3.47,CF+0.55,CF+0.8,-0.16,0.22,M('#EEECE6',0.95),gCel);
 // Außentür: weiß, Milchglas, nach innen öffnend (Klick)
 [[3.55,3.6],[4.35,4.4]].forEach(([a,b])=>B(a,b,CF,CF+2.06,-0.12,-0.04,wf,gCel));B(3.55,4.4,CF+2.0,CF+2.06,-0.12,-0.04,wf,gCel);B(3.55,4.4,CF,CF+0.02,-0.2,-0.04,M('#C8CCD0',0.3,{metalness:0.6}),gCel);
 const pv=new THREE.Group();pv.position.set(4.35,CF+0.02,-0.08);gCel.add(pv);const P=[];
 const dg=new THREE.MeshStandardMaterial({color:col('#DCE6E2'),emissive:col('#CCDCD6'),emissiveIntensity:0.8,roughness:0.3});
 P.push(B(-0.75,0,0,1.97,-0.035,0.035,[wf,wf,wf,wf,wf,wf],pv));P.push(B(-0.66,-0.09,0.12,1.88,-0.036,0.036,dg,pv));
 const hk=M('#E8E8E8',0.3);P.push(B(-0.71,-0.68,0.95,1.18,0.035,0.05,hk,pv));P.push(B(-0.71,-0.58,1.07,1.1,0.05,0.08,hk,pv));P.push(B(-0.705,-0.685,0.9,0.95,0.05,0.06,M('#2A2A2A',0.4),pv));
 const sw=swing(pv,'y',1.35);sw.target=sw.open;pv.rotation.y=sw.open;window.__wkA=sw;clickable(P,()=>{sw.target=sw.target?0:sw.open;if(window.__wkE)window.__wkE.target=sw.target?window.__wkE.open:0;});
 B(3.6,4.35,CF+0.001,CF+0.012,0.05,0.6,M('#2A2A2C',0.95),gCel);}
// Waschmaschine (LG) mit offener Tür, Bälle, Buch; Becken + Hähne, schwarze Abflussrohre, Kinderbilder
{const wm=M('#F4F4F2',0.35);B(4.45,5.05,CF,CF+0.85,1.0,1.6,wm,gCel);B(4.445,4.45,CF+0.65,CF+0.82,1.05,1.3,M('#E0E0DE',0.4),gCel);B(4.445,4.45,CF+0.68,CF+0.78,1.38,1.58,M('#2A2A2E',0.3),gCel);
 {const pd=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.05,24),M('#5A5E62',0.3,{metalness:0.5}));pd.rotation.z=Math.PI/2;pd.rotation.y=0.9;pd.position.set(4.3,CF+0.42,1.2);gCel.add(pd);const gl=new THREE.Mesh(new THREE.CircleGeometry(0.15,24),M('#3A4048',0.2));gl.rotation.y=-Math.PI/2+0.9;gl.position.set(4.27,CF+0.42,1.22);gCel.add(gl);}
 [[4.65,1.25],[4.85,1.45]].forEach(([x,z])=>{const b=new THREE.Mesh(new THREE.SphereGeometry(0.11,18,12),M('#E8701E',0.6));b.position.set(x,CF+0.96,z);gCel.add(b);});B(4.5,4.8,CF+0.85,CF+0.87,1.05,1.3,M('#2A5AA8',0.5),gCel);
 B(4.75,5.05,CF+0.6,CF+0.85,1.65,2.1,M('#6A6E72',0.5,{metalness:0.4}),gCel);const pb=M('#2A2C2E',0.5);cyl(5,1.75,0.025,CF+0.85,CF+2.3-CF-0.85,pb,10,gCel);cyl(5,2.05,0.025,CF+0.85,0.9,pb,10,gCel);
 {const h=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.4,10),pb);h.rotation.x=Math.PI/2;h.position.set(5,CF+1.75,1.9);gCel.add(h);}
 [[1.8,CF+1.15],[2.0,CF+1.0]].forEach(([z,y])=>B(4.93,5.01,y,y+0.04,z-0.02,z+0.02,M('#C8CCD0',0.3,{metalness:0.8}),gCel));
 [['#F2E0A0',0.75,CF+1.45,0.4,0.35],['#F4F4F0',0.25,CF+1.3,0.28,0.38]].forEach(([c,z,y,w,h])=>{const t=canvasTex(64,64,(x,W,H)=>{x.fillStyle=c;x.fillRect(0,0,W,H);['#E8303A','#2A8AD8','#F2C02A','#3AB04A','#C83AC8'].forEach((cc,i)=>{x.strokeStyle=cc;x.lineWidth=4;x.beginPath();x.arc(W/2,H*0.7,8+i*4,Math.PI,0);x.stroke();});},null);const pl=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:t,roughness:0.9}));pl.rotation.y=-Math.PI/2;pl.position.set(VX1-0.005,y,z);gCel.add(pl);});
 B(4.97,5.03,CF+1.35,CF+1.65,0.5,0.62,M('#2A3A5A',0.7),gCel);B(4.99,5.03,CF+0.9,CF+1.6,2.18,2.24,M('#A8283A',0.7),gCel);}
// Schuhregal (schwarzes Metall) an der Westwand: Schuhe, Helme, Schlafsack, Decke, Gummistiefel
{const mk=M('#1E1E20',0.5),rx0=VX0+0.02,rx1=VX0+0.4,rz0=0.3,rz1=1.5;[[rx0,rz0],[rx1-0.02,rz0],[rx0,rz1-0.02],[rx1-0.02,rz1-0.02]].forEach(([x,z])=>B(x,x+0.02,CF,CF+1.0,z,z+0.02,mk,gCel));
 [0.15,0.5,0.98].forEach(y=>B(rx0,rx1,CF+y,CF+y+0.015,rz0,rz1,mk,gCel));
 [['#2A2A3A',0.4],['#E84A6A',0.6],['#2A6AA8',0.8],['#3A3A3A',1.05],['#2AA0A8',1.25]].forEach(([c,z])=>B(rx0+0.05,rx1-0.05,CF+0.165,CF+0.27,z,z+0.17,M(c,0.6),gCel));
 [['#6AA8D8',0.55],['#D83A3A',0.85]].forEach(([c,z])=>{const h=new THREE.Mesh(new THREE.SphereGeometry(0.14,16,10,0,6.3,0,1.6),M(c,0.4));h.position.set(rx0+0.2,CF+0.515,z);gCel.add(h);});
 gCel.add(blob(rx0+0.18,CF+1.09,1.2,0.13,0.09,0.22,M('#E8701E',0.7)));gCel.add(blob(rx0+0.18,CF+1.2,1.3,0.12,0.05,0.16,M('#B82A3A',0.9)));
 B(rx0+0.05,rx0+0.25,CF+1.0,CF+1.25,0.4,0.62,M('#F4F4F0',0.6),gCel);cyl(rx0+0.14,0.5,0.06,CF+1.25,0.08,M('#E8303A',0.5),12,gCel);
 [[0.15,'#E8A8B8'],[0.32,'#2A2A2E']].forEach(([z,c])=>cyl(VX0+0.6,z+0.05,0.06,CF,0.38,M(c,0.6),12,gCel));}
// Heizung: Gas-Wandgerät, Ausdehnungsgefäß, Warmwasserspeicher, Abgasrohr, Leitungen
{const gr=M('#8A8E92',0.35,{metalness:0.4});B(3.35,3.85,CF+1.0,CF+1.85,WKZ1-0.38,WKZ1,gr,gCel);
 {const ev=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,0.32,20),M('#F2F2F0',0.4));ev.rotation.z=Math.PI/2;ev.position.set(3.18,CF+1.65,WKZ1-0.2);gCel.add(ev);}
 const wp=M('#F4F4F2',0.4);cyl(3.62,WKZ1-0.2,0.06,CF+1.85,0.25,wp,14,gCel);{const fl=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,0.3,14),wp);fl.rotation.x=Math.PI/2;fl.position.set(3.62,CF+2.12,WKZ1-0.1);gCel.add(fl);}
 cyl(3.6,WKZ1-0.75,0.3,CF,1.2,M('#F6F6F4',0.35),28,gCel);cyl(3.6,WKZ1-0.75,0.31,CF+1.2,0.06,M('#1E1E20',0.4),28,gCel);B(3.52,3.7,CF+0.75,CF+1.0,WKZ1-1.06,WKZ1-1.05,M('#3A6AC8',0.5),gCel);
 {const hat=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.2,0.05,20),M('#E8D0A0',0.8));hat.position.set(3.5,CF+1.28,WKZ1-0.7);gCel.add(hat);}B(3.7,3.78,CF+1.26,CF+1.34,WKZ1-0.82,WKZ1-0.74,M('#1E1E20',0.4),gCel);
 const cu=M('#B8703A',0.35,{metalness:0.6}),rd=M('#D8282A',0.6);
 const px=(x0,x1,y,z,r,m)=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r,x1-x0,10),m);c.rotation.z=Math.PI/2;c.position.set((x0+x1)/2,y,z);gCel.add(c);};
 const pz=(z0,z1,x,y,r,m)=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r,z1-z0,10),m);c.rotation.x=Math.PI/2;c.position.set(x,y,(z0+z1)/2);gCel.add(c);};
 px(VX0,VX1,CF+2.2,WKZ1-0.08,0.04,rd);px(VX0,VX1,CF+2.12,WKZ1-0.15,0.018,cu);pz(VZ0,WKZ1,VX0+0.1,CF+2.22,0.025,M('#E8E8E6',0.4));pz(VZ0,WKZ1,VX0+0.2,CF+2.18,0.025,M('#E8E8E6',0.4));
 [3.3,3.95,4.05].forEach(x=>cyl(x,WKZ1-0.05,0.014,CF+0.35,1.85,cu,8,gCel));px(3.3,4.05,CF+0.35,WKZ1-0.05,0.014,cu);
 [[3.97,CF+1.45],[4.07,CF+1.5]].forEach(([x,y])=>{const v=new THREE.Mesh(new THREE.TorusGeometry(0.04,0.008,6,12),M('#2E7A3A',0.5));v.position.set(x,y,WKZ1-0.12);gCel.add(v);});
 B(4.35,4.48,CF+1.45,CF+1.65,WKZ1-0.02,WKZ1,M('#1E1E20',0.3),gCel);
 cyl(VX0+0.05,1.9,0.035,CF,2.3,M('#F0F0EE',0.5),10,gCel);B(VX0,VX0+0.02,CF+1.4,CF+1.5,1.3,1.38,M('#E8E8E6',0.4),gCel);
 [['#F2D020'],['#E83A3A'],['#F4F4F0']].forEach(([c],i)=>gCel.add(blob(3.3,CF+2.0-i*0.12,WKZ1-0.45,0.04,0.03,0.04,M(c,0.6))));cyl(3.3,WKZ1-0.45,0.003,CF+1.8,0.5,M('#8A5AC8',0.6),4,gCel);
 // weißer Gartenstuhl mit Kissen, Wäschekorb
 const wc=M('#F4F4F2',0.5),cx0=3.25,cz0=WKZ1-1.15;B(cx0-0.22,cx0+0.22,CF+0.42,CF+0.46,cz0-0.2,cz0+0.2,wc,gCel);B(cx0-0.22,cx0+0.22,CF+0.46,CF+0.95,cz0+0.18,cz0+0.22,wc,gCel);[[-0.2,-0.18],[0.2,-0.18],[-0.2,0.18],[0.2,0.18]].forEach(([a,b])=>B(cx0+a-0.02,cx0+a+0.02,CF,CF+0.44,cz0+b-0.02,cz0+b+0.02,wc,gCel));
 B(cx0-0.18,cx0+0.18,CF+0.46,CF+0.5,cz0-0.16,cz0+0.16,M('#4A7A4A',0.8),gCel);B(VX0+0.05,VX0+0.5,CF,CF+0.25,WKZ1-0.45,WKZ1-0.05,M('#6A6E74',0.7),gCel);
 const wl=new THREE.PointLight(col('#FFF6E8'),0.55,5,2);wl.position.set(3.8,CF+2.0,1.0);gCel.add(wl);}
// Flur am Treppenfuß: Garderobenhaken mit Jacken an der Ostwand, Schuhkartons
B(4.57,4.6,CF+1.72,CF+1.76,3.95,4.75,white,gCel);
[['#E0288A',0.95],['#F06A9A',0.9],['#D8A8B8',0.85],['#2A3050',0.85],['#E83A30',0.8],['#2E5A8A',0.55]].forEach(([c,h],i)=>{const z=3.98+i*0.12;B(4.44,4.58,CF+1.75-h,CF+1.75,z,z+0.1,M(c,0.9),gCel);});
[[4.0,'#D84040',0.22],[4.25,'#F2F2F0',0.16],[4.25,'#6AC83A',0.1],[4.5,'#E84A4A',0.2]].forEach(([z,c,h],k)=>B(4.25,4.55,CF+(k==2?0.16:0),CF+(k==2?0.16:0)+h,z,z+0.22,M(c,0.7),gCel));
// Flur zum WC

// Vorratsraum (hinter der Garage, Fenster in der Ostwand)
const parq=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#A8683A';x.fillRect(0,0,w,h);for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.fillStyle=(i+j)%2?'#B87842':'#A0643A';x.fillRect(i*64,j*64,64,64);x.strokeStyle='rgba(240,220,190,0.85)';x.lineWidth=5;x.beginPath();x.moveTo(i*64+22,j*64+26);x.lineTo(i*64+32,j*64+18);x.lineTo(i*64+42,j*64+26);x.stroke();x.beginPath();x.moveTo(i*64+22,j*64+46);x.lineTo(i*64+32,j*64+38);x.lineTo(i*64+42,j*64+46);x.stroke();}},[1,1]);
kfl(PX0,PX1,PZ0b,PZ1b,parq,0.7);
{const pd0=5.15,pd1=5.85,wn0=5.25,wn1=5.8,wy0=CF+1.75,wy1=CF+2.2;
 B(PX0-0.15,PX0,CF,0,PZ0b,pd0,rough,gCel);B(PX0-0.15,PX0,CF,0,pd1,PZ1b,rough,gCel);B(PX0-0.15,PX0,CF+1.95,0,pd0,pd1,rough,gCel);
 [[pd0-0.04,pd0],[pd1,pd1+0.04]].forEach(([a,b])=>B(PX0-0.17,PX0+0.01,CF,CF+1.97,a,b,M('#C89A62',0.6),gCel));B(PX0-0.17,PX0+0.01,CF+1.95,CF+1.99,pd0-0.04,pd1+0.04,M('#C89A62',0.6),gCel);
 B(4.75,8.86,CF,0,PZ0b-0.3,PZ0b,rough,gCel);B(PX0-0.15,8.86,CF,0,PZ1b,PZ1b+0.3,rough,gCel);
 B(PX1,8.86,CF,0,PZ0b,wn0,rough,gCel);B(PX1,8.86,CF,0,wn1,PZ1b,rough,gCel);B(PX1,8.86,CF,wy0,wn0,wn1,rough,gCel);B(PX1,8.86,wy1,0,wn0,wn1,rough,gCel);
 B(8.72,8.75,wy0,wy1,wn0,wn1,new THREE.MeshStandardMaterial({color:col('#E8F0E8'),emissive:col('#D8E8D8'),emissiveIntensity:0.8}),gCel);B(8.68,8.74,wy0,wy1,wn0,wn0+0.06,white,gCel);B(8.68,8.74,wy0,wy1,wn1-0.06,wn1,white,gCel);B(8.68,8.74,wy0,wy0+0.06,wn0,wn1,white,gCel);B(8.68,8.74,wy1-0.06,wy1,wn0,wn1,white,gCel);B(8.66,8.68,wy0+0.12,wy0+0.22,wn1-0.1,wn1-0.08,M('#E8E8E8',0.3),gCel);
 B(PX0,PX1,CF+2.2,0,PZ0b,PZ1b,rough,gCel);
 B(PX0+0.6,PX1-0.3,CF+2.24,CF+2.3,(PZ0b+PZ1b)/2-0.05,(PZ0b+PZ1b)/2+0.05,M('#C8CCC8',0.4),gCel);const pl=new THREE.PointLight(col('#F4F8FF'),0.55,5,2);pl.position.set((PX0+PX1)/2,CF+2.0,(PZ0b+PZ1b)/2);gCel.add(pl);
 {const gp=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,PZ1b-PZ0b-0.4,14),M('#7A7E82',0.5));gp.rotation.x=Math.PI/2;gp.position.set(PX1-0.08,CF+1.0,(PZ0b+PZ1b)/2);gCel.add(gp);}
 B(PX1-0.05,PX1,CF+1.1,CF+1.55,wn1+0.2,wn1+0.48,M('#F2F2EE',0.4),gCel);cyl(PX1-0.03,wn1+0.34,0.02,CF+1.55,0.75,M('#B8BCC0',0.5),8,gCel);}
// Regale (Fichte) links und rechts, Getränkekisten, Eimer, Heu- und Einstreusäcke
const spine=M('#DDB888',0.6);
const shelfUnit=(x0,x1,z0,z1,m,n,top)=>{[[x0,z0],[x1-0.04,z0],[x0,z1-0.04],[x1-0.04,z1-0.04]].forEach(([x,z])=>B(x,x+0.04,CF,CF+top,z,z+0.04,m,gCel));for(let k=0;k<n;k++){const y=CF+0.1+k*(top-0.15)/(n-1);B(x0,x1,y,y+0.025,z0,z1,m,gCel);
    if(k<n-1)for(let q=0;q<5;q++){const ax=x0+0.04+(x1-x0-0.08)*(q/5),az=z0+0.04+(z1-z0-0.08)*(q/5);const vert=(x1-x0)<(z1-z0);const c=['#E8C040','#C84830','#3A7AC8','#E8E0D0','#6AA048','#8A5A3A','#F0A030'][(k*5+q)%7];
      if(vert)B(x0+0.05,x1-0.05,y+0.025,y+0.12+rnd()*0.12,az,az+(z1-z0-0.1)/5-0.03,M(c,0.6),gCel);else B(ax,ax+(x1-x0-0.1)/5-0.03,y+0.025,y+0.12+rnd()*0.12,z0+0.05,z1-0.05,M(c,0.6),gCel);}}};
shelfUnit(PX0+0.75,PX1-0.15,PZ0b+0.02,PZ0b+0.42,spine,5,2.2);shelfUnit(PX0+0.75,PX1-0.55,PZ1b-0.42,PZ1b-0.02,spine,4,1.85);
[[PX1-0.45,PZ1b-0.5,0],[PX1-0.45,PZ1b-0.9,0],[PX1-0.45,PZ1b-0.5,0.29],[PX1-0.45,PZ1b-0.9,0.29]].forEach(([x,z,y],k)=>B(x,x+0.4,CF+y,CF+y+0.29,z-0.2,z+0.13,M('#1C1C22',0.5),gCel));
cyl(PX0+1.1,PZ0b+1.2,0.2,CF,0.3,M('#1A1A1A',0.5),20,gCel);[[PX0+0.95,PZ0b+0.6,'#F2F2EE'],[PX0+0.95,PZ0b+0.6,'#F2F2EE']].forEach(([x,z,c],k)=>cyl(x,z,0.15,CF+k*0.3,0.3,M(c,0.6),16,gCel));
[[PX1-0.9,PZ0b+0.75,'#C8B880',0.5],[PX1-0.5,PZ0b+0.75,'#E8EEF0',0.55],[PX1-1.3,PZ0b+0.6,'#C89A62',0.35]].forEach(([x,z,c,h])=>gCel.add(blob(x,CF+h*0.55,z,0.2,h*0.55,0.15,M(c,0.85))));B(PX1-1.0,PX1-0.8,CF,CF+0.3,PZ0b+1.2,PZ0b+1.4,M('#F2B830',0.6),gCel);
// WC (zwischen Kellertreppe und Vorratsraum)
const gW=new THREE.Group();gW.position.set(-1.2,0,4.55);gCel.add(gW);gW.add(tileFloor(WX0-0.15,WX1,WZ0,WZ1,CF,cellTile,0.8));
B(KFX1,WX0,CF,0,KFZ0-0.3,2.6,rough,gW);B(KFX1,WX0,CF,0,3.4,VZ1+0.23,rough,gW);B(KFX1,WX0,CF+2.0,0,2.6,3.4,rough,gW);
[[2.56,2.6],[3.4,3.44]].forEach(([a,b])=>B(KFX1-0.02,WX0+0.02,CF,CF+2.03,a,b,white,gW));B(KFX1-0.02,WX0+0.02,CF+2.0,CF+2.04,2.56,3.44,white,gW);
const wcTex=canvasTex(128,256,(x,w,h)=>{x.fillStyle='#F6F4EE';x.fillRect(0,0,w,h);x.fillStyle='#B8BCC0';[70,78,86].forEach(px=>x.fillRect(px,20,3,h-40));for(let yy=60;yy<h-30;yy+=48){x.fillRect(66,yy,26,4);}});
(function(){const pv=new THREE.Group();pv.position.set(KFX1-0.01,CF,2.6);gW.add(pv);const P=[];const dm=new THREE.MeshStandardMaterial({map:wcTex,roughness:0.5});
  P.push(B(-0.035,0.005,0,1.98,0,0.8,[white,dm,white,white,white,white],pv));const hm=M('#D8C888',0.3,{metalness:0.7});P.push(B(-0.08,-0.035,0.97,0.99,0.62,0.74,hm,pv));P.push(B(-0.045,-0.035,0.9,1.1,0.72,0.76,hm,pv));
  const sw=swing(pv,'y',-1.35);sw.target=sw.open;pv.rotation.y=sw.open;clickable(P,tog(sw));})();
B(WX0,WX1,CF,0,WZ0-0.3,WZ0,rough,gW);B(WX0,WX1,CF,0,WZ1,WZ1+0.3,rough,gW);const CRO0=WZ0+0.2,CRO1=WZ0+0.95;B(WX1,WX1+0.3,CF,0,WZ0-0.3,CRO0,rough,gW);B(WX1,WX1+0.3,CF,0,CRO1,WZ1+0.3,rough,gW);B(WX1,WX1+0.3,CF+0.95,0,CRO0,CRO1,rough,gW);B(WX1-0.01,WX1+0.3,CF,CF+0.04,CRO0,CRO1,M('#8A6A48',0.7),gW);
B(WX0,7.15,CF+2.2,0,WZ0,WZ1,rough,gW);
(function(){const L=WX1-7.15,dy=0.95,len=Math.hypot(L,dy);const m=new THREE.Mesh(new THREE.BoxGeometry(len,0.12,WZ1-WZ0),rough);m.position.set(7.15+L/2,CF+2.3-dy/2+0.06,(WZ0+WZ1)/2);m.rotation.z=-Math.atan2(dy,L);gW.add(m);
  B(7.15,WX1,CF+2.36,0,WZ0,WZ1,rough,gW);})();
const wtile=M('#E8E8E6',0.3);B(WX0,7.55,CF,CF+1.5,WZ0,WZ0+0.01,wtile,gW);
for(let x=WX0;x<7.55;x+=0.25)B(x,x+0.004,CF,CF+1.5,WZ0+0.01,WZ0+0.012,M('#BBBBBB',0.5),gW);for(let y=0.25;y<1.5;y+=0.25)B(WX0,7.55,CF+y,CF+y+0.004,WZ0+0.01,WZ0+0.012,M('#BBBBBB',0.5),gW);
B(6.9,7.4,CF+0.78,CF+0.88,WZ0,WZ0+0.38,M('#FAFAFA',0.2),gW);cyl(7.15,WZ0+0.08,0.012,CF+0.88,0.14,M('#D0D4D8',0.2,{metalness:0.9}),10,gW);
B(7,7.25,CF+0.35,CF+0.72,WZ0,WZ0+0.18,M('#F2EEE4',0.4),gW);B(6.75,7.6,CF+1.55,CF+2.1,WZ0,WZ0+0.25,white,gW);
B(7.5,7.83,CF,CF+0.4,WZ0+0.16,WZ0+0.58,M('#FAFAFA',0.25),gW);B(7.49,7.84,CF+0.4,CF+0.43,WZ0+0.16,WZ0+0.6,M('#F0F0F0',0.3),gW);B(7.51,7.82,CF+0.55,CF+0.95,WZ0,WZ0+0.16,M('#FAFAFA',0.25),gW);
const k2brd=new THREE.Mesh(new THREE.BoxGeometry(0.02,1.6,0.7),M('#D8B888',0.6));k2brd.position.set(7.55,CF+0.8,WZ1-0.08);k2brd.rotation.x=-0.12;gW.add(k2brd);
cyl(WX1-0.1,WZ1-0.08,0.02,CF,2.3,M('#9AB4B0',0.4),8,gW);
const wl=new THREE.PointLight(col('#FFF6E8'),0.35,3,2);wl.position.set(7.05,CF+2.0,3.0);gW.add(wl);


// ---- Kriechkeller hinter dem WC (Einstieg durch die Öffnung in der WC-Wand) ----
const CRX0=7.05,CRX1=8.41,CRZ0=7.0,CRZ1=7.96,CRH=CF+1.45;
const conc=canvasTex(512,256,(x,w,h)=>{x.fillStyle='#A8A49A';x.fillRect(0,0,w,h);for(let i=0;i<900;i++){const v=120+rnd()*90;x.fillStyle=`rgba(${v},${v-4},${v-12},0.35)`;x.fillRect(rnd()*w,rnd()*h,2+rnd()*8,1+rnd()*3);}for(let y=0;y<h;y+=32){x.fillStyle='rgba(60,55,50,0.35)';x.fillRect(0,y+rnd()*3,w,2);}},[1,1]);
const concM=(r1,r2)=>{const t=conc.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(r1,r2);return new THREE.MeshStandardMaterial({map:t,roughness:0.95});};
const cwM=concM(2,1.2),cfM=M('#8E887E',0.95),brickM=new THREE.MeshStandardMaterial({map:canvasTex(128,128,(x,w,h)=>{x.fillStyle='#C8C0B0';x.fillRect(0,0,w,h);for(let r=0;r<8;r++)for(let c=-1;c<3;c++){x.fillStyle=`rgb(${190+rnd()*40},${130+rnd()*40},${80+rnd()*30})`;x.fillRect(c*56+(r%2)*28+2,r*16+2,52,12);}},[1,1]),roughness:0.9});
// Rohbau des Kriechkellers als Bauteil kennzeichnen (struct), damit er nicht als Möbel gilt und in Außenansichten stehen bleibt
[B(CRX0,CRX1,CF-0.2,CF,CRZ0,CRZ1,cfM,gCel),B(CRX1,8.86,CF,0,CRZ0-0.3,CRZ1+0.4,cwM,gCel),B(CRX0,CRX1,CRH,0,CRZ0,CRZ1,concM(4,1),gCel),
 B(CRX0+0.7,CRX0+1.0,CRH-0.18,CRH,CRZ0,CRZ1,cwM,gCel),B(CRX1-0.5,CRX1,CF,CRH,CRZ1-0.4,CRZ1,brickM,gCel)].forEach(m=>{m.userData.struct=1;});
const pipe=(x0,z0,x1,z1,y,r,m)=>{const L=Math.hypot(x1-x0,z1-z0);const p=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,12),m);p.position.set((x0+x1)/2,y,(z0+z1)/2);p.rotation.z=Math.PI/2;p.rotation.y=-Math.atan2(z1-z0,x1-x0);gCel.add(p);return p;};
pipe(CRX0,CRZ0+0.2,CRX1,CRZ0+0.2,CRH-0.12,0.07,M('#D8CFB8',0.8));pipe(CRX0,CRZ0+0.4,CRX1,CRZ0+0.4,CRH-0.06,0.025,M('#8A9096',0.4,{metalness:0.3}));pipe(CRX0,CRZ0+0.5,CRX1,CRZ0+0.5,CRH-0.08,0.015,white);
// Hausanschluss Wasser an der Ostwand
const wz=CRZ0+0.4,gp=M('#6E7478',0.4,{metalness:0.3}),k3brass=M('#B8903A',0.3,{metalness:0.8});
cyl(CRX1-0.08,wz,0.025,CF+0.05,CRH-CF-0.15,gp,10,gCel);pipe(CRX1-0.08,wz,CRX1-0.08,wz+0.35,CF+0.75,0.025,gp);
B(CRX1-0.14,CRX1-0.02,CF+0.7,CF+0.8,wz+0.1,wz+0.28,k3brass,gCel);B(CRX1-0.13,CRX1-0.03,CF+0.8,CF+0.86,wz+0.12,wz+0.26,M('#EDEDED',0.4),gCel);
cyl(CRX1-0.09,wz+0.3,0.045,CF+0.5,0.25,M('#B87A2A',0.4,{transparent:true,opacity:0.85}),14,gCel);B(CRX1-0.05,CRX1-0.01,CF+1.05,CF+1.25,wz-0.25,wz-0.15,M('#EEE',0.5),gCel);
const blM=new THREE.MeshStandardMaterial({color:col('#FFF2D8'),emissive:col('#FFE0A8'),emissiveIntensity:0.9});const bl=new THREE.Mesh(new THREE.SphereGeometry(0.08,16,8),blM);bl.scale.set(1.3,0.8,0.5);bl.position.set(CRX0+1.4,CRH-0.06,CRZ1-0.05);gCel.add(bl);
const crl=new THREE.PointLight(col('#FFD8A0'),0.5,4,2);crl.position.set(CRX0+1.3,CRH-0.3,CRZ0+0.4);gCel.add(crl);
// Farbeimer, Gartenschlauch, Platte, Rolle
[[CRX0+0.35,CRZ0+0.3,0.15,0.22,'#1E1E22'],[CRX0+0.7,CRZ0+0.55,0.13,0.2,'#F2F2F0','#2A5AC8'],[CRX0+1.05,CRZ0+0.35,0.17,0.2,'#F2F2F0','#2A5AC8'],[CRX1-0.7,CRZ0+0.3,0.12,0.2,'#F2F2F0','#D83A2A']].forEach(([x,z,r,h,c,lid])=>{cyl(x,z,r,CF,h,M(c,0.5),20,gCel);if(lid)cyl(x,z,r+0.01,CF+h,0.02,M(lid,0.5),20,gCel);});
for(let k=0;k<5;k++){const t=new THREE.Mesh(new THREE.TorusGeometry(0.16+k*0.03,0.012,6,32),M('#1E8A4A',0.5));t.rotation.x=Math.PI/2;t.position.set(CRX0+1.55,CF+0.015+k*0.02,CRZ0+0.4);gCel.add(t);}
{const ninco=new THREE.Mesh(new THREE.BoxGeometry(0.55,1.3,0.02),M('#B8BCC0',0.3,{metalness:0.6}));ninco.position.set(CRX0+0.6,CF+0.64,CRZ1-0.06);ninco.rotation.x=0.1;gCel.add(ninco);}
cyl(CRX0+1.0,CRZ1-0.15,0.06,CF+0.1,0.6,M('#E8DCC0',0.8),14,gCel);B(CRX1-0.3,CRX1-0.05,CF,CF+0.55,CRZ1-0.04,CRZ1,M('#D8303A',0.5),gCel);
