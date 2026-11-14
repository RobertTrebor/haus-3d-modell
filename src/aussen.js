// Außen: Dach, Gauben, Sockel, Fassaden, Garage, Hof, Vorgarten.
// ---- Außenansicht: Hauptdach (Walmdach) mit Gauben + Schornstein, Natursteinsockel, Kellerfassade Gartenseite ----
const gRoof=new THREE.Group();scene.add(gRoof);gRoof.visible=false;let facadeMode=false;
// Füllplatten der Außenhülle (Geschossdecken ohne Treppenloch, damit man von außen nicht durchs Haus sieht). Sie bleiben
// einzelne Teile (start.js fasst sie nicht zusammen) und werden im Laufmodus im Haus ausgeblendet (loop in start.js).
const fuellPlatten=[];const fuell=m=>{m.userData.fuell=1;fuellPlatten.push(m);return m;};
const rx0=-0.83,rx1=9.28,rz0=-0.83,rz1=8.83,ry=OGF+OGH+0.05,rh=4.3,rdz=(rz1-rz0)/2,ridgeZ=(rz0+rz1)/2;
const roofTileT=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#4E3A34';x.fillRect(0,0,w,h);for(let r=0;r<8;r++){x.fillStyle='rgba(20,12,8,0.6)';x.fillRect(0,r*32+26,w,6);for(let c=0;c<8;c++){x.fillStyle=`rgba(${100+rnd()*40},${74+rnd()*25},${62+rnd()*20},0.45)`;x.fillRect(c*32+(r%2)*16,r*32,28,26);}}},[1,1]);
const roofM=new THREE.MeshStandardMaterial({map:roofTileT,roughness:0.85,side:THREE.DoubleSide});
const gut=M('#7A8084',0.4,{metalness:0.5});
{const rxa=rx0+rdz,rxb=rx1-rdz;const P=[[rx0,ry,rz1],[rx1,ry,rz1],[rx1,ry,rz0],[rx0,ry,rz0],[rxa,ry+rh,ridgeZ],[rxb,ry+rh,ridgeZ]];
 const tris=[[0,1,5],[0,5,4],[2,3,4],[2,4,5],[1,2,5],[3,0,4]];const pos=[],uv=[];
 tris.forEach(t=>t.forEach(k=>{const p=P[k];pos.push(...p);uv.push((p[0]+p[2])*0.9,(p[1]-ry)*2.4);}));
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();
 gRoof.add(new THREE.Mesh(g,roofM));
 fuell(B(rx0,rx1,ry-0.22,ry,rz0,rz1,M('#F2F0EA',0.8),gRoof));
 B(rx0-0.05,rx1+0.05,ry-0.12,ry+0.02,rz1,rz1+0.1,gut,gRoof);B(rx0-0.05,rx1+0.05,ry-0.12,ry+0.02,rz0-0.1,rz0,gut,gRoof);B(rx0-0.1,rx0,ry-0.12,ry+0.02,rz0,rz1,gut,gRoof);B(rx1,rx1+0.1,ry-0.12,ry+0.02,rz0,rz1,gut,gRoof);
 [[rx1-0.4,rz1+0.05],[rx0+0.5,rz1+0.05]].forEach(([x,z])=>cyl(x,z,0.04,-0.6,ry+0.6,gut,10,gRoof));
 cyl(4.55,-0.47,0.045,CF+0.22,ry-CF-0.22,gut,10,gRoof);{const e=cylZ(4.55,CF+0.16,-0.55,0.045,0.18,gut,gRoof);e.rotation.x=Math.PI/2.6;}
 // Fledermausgaube Straßenseite
 const run=rz1-ridgeZ,dzD=1.4,gy=ry+rh*(dzD/run),gz=rz1-dzD,gx=exc;
 const sh=new THREE.Shape();sh.moveTo(-0.6,0);sh.lineTo(0.6,0);sh.lineTo(0,0.45);sh.lineTo(-0.6,0);
 const batDormer=(px,pz,rot)=>{const g=new THREE.Group();g.position.set(px,gy,pz);g.rotation.y=rot;gRoof.add(g);
   const dm=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:0.9,bevelEnabled:false}),M('#F4F2EC',0.6));dm.position.set(0,-0.05,-0.88);g.add(dm);
   const hole=new THREE.Mesh(new THREE.CircleGeometry(0.22,20,0,Math.PI),M('#2A2220',0.7));hole.position.set(0,0,0.03);g.add(hole);};
 batDormer(gx,gz,0);batDormer(rx1-dzD,ridgeZ,Math.PI/2);batDormer(rx0+dzD,ridgeZ,-Math.PI/2);
 // Schleppgaube mit Schiefer, Gartenseite
 const dx0=3.05,dx1=5.35,dF=rz0+0.97,yF=ry+rh*((dF-rz0)/run)-0.05,dTop=yF+1.3;
 const slateT=canvasTex(128,128,(x,w,h)=>{x.fillStyle='#34383E';x.fillRect(0,0,w,h);for(let r=0;r<8;r++)for(let c=0;c<5;c++){x.fillStyle=`rgba(${70+rnd()*30},${74+rnd()*30},${84+rnd()*30},0.7)`;x.beginPath();x.ellipse(c*28+(r%2)*14,r*16+8,12,8,0,0,Math.PI*2);x.fill();}},[2,2]);
 const slM=new THREE.MeshStandardMaterial({map:slateT,roughness:0.7});
 B(dx0,dx1,yF-0.7,dTop,dF,dF+2.4,slM,gRoof);
 const dWin=(a,b)=>{B(a,b,yF+0.12,yF+1.12,dF-0.02,dF+0.01,white,gRoof);B(a+0.06,b-0.06,yF+0.18,yF+1.06,dF-0.025,dF-0.015,glass,gRoof);
   [0.33,0.67].forEach(t=>B(a+0.06,b-0.06,yF+0.18+0.88*t-0.012,yF+0.18+0.88*t+0.012,dF-0.03,dF-0.02,white,gRoof));B((a+b)/2-0.012,(a+b)/2+0.012,yF+0.18,yF+1.06,dF-0.03,dF-0.02,white,gRoof);};
 dWin(dx0+0.25,(dx0+dx1)/2-0.04);dWin((dx0+dx1)/2+0.04,dx1-0.25);
 {const s2=new THREE.Mesh(new THREE.BoxGeometry(dx1-dx0+0.35,0.08,2.8),roofM);s2.position.set((dx0+dx1)/2,dTop+0.12,dF+1.15);s2.rotation.x=-0.13;gRoof.add(s2);}
 B(dx0-0.17,dx1+0.17,dTop-0.04,dTop+0.08,dF-0.2,dF,M('#F2F0EA',0.8),gRoof);B(dx0-0.17,dx1+0.17,dTop-0.06,dTop,dF-0.28,dF-0.18,gut,gRoof);
 cyl(dx0-0.1,dF-0.2,0.03,yF-0.6,dTop-yF+0.6,gut,8,gRoof);
 // Schornstein (schiefergrau), westlich der Gaube
 B(1.55,2.05,ry+2.2,ry+rh+1.0,2.6,3.1,slM,gRoof);B(1.5,2.1,ry+rh+1.0,ry+rh+1.06,2.55,3.15,M('#5A5E62',0.5),gRoof);}
function HOFEXTRA(){
 const salm=putzMat(1,1);salm.color=col('#F2A088');const flagT=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#5A5652';x.fillRect(0,0,w,h);for(let i=0;i<46;i++){const cx=rnd()*w,cy=rnd()*h,r=16+rnd()*20,n=5+Math.floor(rnd()*3);x.fillStyle=['#8A8682','#7A7672','#9A928A','#6E6A66','#8A7A6A'][Math.floor(rnd()*5)];x.beginPath();for(let k=0;k<n;k++){const a=k/n*6.283+rnd()*0.5,rr=r*(0.7+rnd()*0.4);k?x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr):x.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}x.closePath();x.fill();}},[1,1]);
 const flagM=(w,d)=>{const t=flagT.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/1.2,d/1.2);return new THREE.MeshStandardMaterial({map:t,roughness:0.85});};
 const TE=-5.2,TH=CF+0.85,cap=(x0,x1,y,z0,z1)=>B(x0,x1,y-0.05,y,z0,z1,flagM(x1-x0,z1-z0),gRoof);
 // Gartenterrasse (ca. 85 cm über dem Hof), Stützmauer lachsfarben verputzt
 B(TE,TE+0.02,CF,TH-0.05,NF-4.6,NF-1.45,salm,gRoof);B(-14.5,TE,TH-0.6,TH-0.05,-7.0,7.0,M('#5A4A3A',0.95),gRoof);B(TE,XW-RV2,TH-0.6,TH-0.05,NF+1.0,7.0,M('#5A4A3A',0.95),gRoof);B(TE,-3.86,TH-0.6,TH-0.05,NF,NF+1.0,M('#5A4A3A',0.95),gRoof);cap(TE,-3.86,TH,NF,NF+1.0);B(-14.5,TE,CF,TH-0.6,-7.02,-7.0,salm,gRoof);
 cap(TE-0.25,TE+0.05,TH,NF-4.6,NF-1.45);
 {const m=new THREE.Mesh(new THREE.PlaneGeometry(4.2,5.4),flagM(4.2,5.4));m.rotation.x=-Math.PI/2;m.position.set(TE-2.1,TH-0.045,NF-1.9);gRoof.add(m);const m3=new THREE.Mesh(new THREE.PlaneGeometry(XW-RV2-TE,2.2),flagM(1.3,2.2));m3.rotation.x=-Math.PI/2;m3.position.set((TE+XW-RV2)/2,TH-0.045,NF+2.1);gRoof.add(m3);const g3=new THREE.Mesh(new THREE.PlaneGeometry(XW-RV2-TE,7.0-NF-3.2),M('#6E8A4E',0.95));g3.rotation.x=-Math.PI/2;g3.position.set((TE+XW-RV2)/2,TH-0.05,(NF+3.2+7.0)/2);gRoof.add(g3);}
 // Treppenanlage zum Garten: beide Läufe steigen vom Hof nach Westen, dazwischen der Pflanzblock
 // Treppe A: 3 Stufen direkt ums Eck der Bürotür, am Hausrand hinauf zur Terrasse (steigt nach Süden)
 {const x0=-3.0,x1=XW-RV2,sd=0.33,rs=(TH-CF)/3;for(let k=0;k<3;k++){const zf=NF+k*sd;B(x0,x1,CF,CF+rs*(k+1)-0.05,zf,NF+1.0+0.02,salm,gRoof);cap(x0,x1,CF+rs*(k+1),zf-0.03,NF+1.0+0.02);}}
 // Pflanzblock zwischen den Treppen (Terrassenhöhe), Front nach Norden zum Hof
 B(-3.85,-3.0,CF,TH-0.05,NF,NF+1.0,salm,gRoof);cap(-3.88,-2.97,TH,NF-0.03,NF+1.0);B(-3.8,-3.05,TH-0.05,TH-0.02,NF+0.05,NF+0.95,M('#4A3A2A',0.95),gRoof);
 // Treppe B: 4 Stufen westlich des Pflanzblocks, steigt vom Hof nach Westen auf die Gartenterrasse
 {const bz0=NF-1.45,bz1=NF,rs=(TH-CF)/4;for(let k=0;k<4;k++){const xb=-3.85-0.34*k;B(TE,xb,CF,CF+rs*(k+1)-0.05,bz0,bz1,salm,gRoof);cap(TE,xb+0.03,CF+rs*(k+1),bz0,bz1);}
  B(TE,-3.85,CF,TH-0.05,bz0-0.15,bz0,salm,gRoof);cap(TE,-3.82,TH,bz0-0.18,bz0);}
 // Beet mit Betonkante nördlich der kleinen Hoffläche
 {const cn=M('#8A8884',0.9);B(-5.2,-2.7,CF,CF+0.18,NF-1.95,NF-1.8,cn,gRoof);B(-5.2,-2.7,CF,CF+0.14,NF-3.2,NF-1.95,M('#4A3A2A',0.95),gRoof);
  for(let i=0;i<14;i++)gRoof.add(blob(-5.0+rnd()*2.2,CF+0.22+rnd()*0.1,NF-3.0+rnd()*0.9,0.2,0.12+rnd()*0.15,0.2,M(['#5A7A3A','#7A8A3A','#8A4A3A'][i%3],0.85)));}
 // Strauch auf dem Pflanzblock
 {const ylg0=M('#8A9A3A',0.85),ylg1=M('#A8A83E',0.85);[[0,0.9,0,0.45,0.8,0.4,ylg0],[0.1,1.6,0.1,0.4,0.65,0.4,ylg1],[-0.1,1.3,-0.2,0.35,0.55,0.35,ylg0],[0,2.2,0,0.3,0.45,0.3,ylg1]].forEach(([x,y,z,a,b,c,m])=>gRoof.add(blob(-3.42+x,TH+y,NF+0.5+z,a,b,c,m)));cyl(-3.42,NF+0.5,0.04,TH,1.1,M('#5A4A3A',0.9),6,gRoof);}
 // Gehölze: Strauch auf dem Pflanzblock, roter Fächerahorn, Efeu-Mauer hinten
 const ylg=M('#7A8A2E',0.85),ylg2=M('#9AA03A',0.85),maple=M('#8A3428',0.8);
  cyl(-7.2,NF-3.6,0.05,TH,0.6,M('#4A3A2E',0.9),6,gRoof);[[0,0.85,0,0.75,0.4,0.65],[0.3,1.05,0.2,0.5,0.3,0.5]].forEach(([x,y,z,a,b,c])=>gRoof.add(blob(-7.2+x,TH+y,NF-3.6+z,a,b,c,maple)));
 B(-11,TE-0.4,TH,TH+2.2,NF-4.75,NF-4.6,M('#E8E4D8',0.9),gRoof);for(let i=0;i<9;i++)gRoof.add(blob(-10.5+i*0.75+rnd()*0.3,TH+1.4+rnd()*0.6,NF-4.55,0.45,0.6+rnd()*0.4,0.12,M('#3E5A2A',0.8)));
 // Sitzplatz: Holztisch mit kariertem Tischtuch, Bank, pinker Kinderstuhl, Pflanzkästen
 const wood=M('#8A6440',0.8),clothT=canvasTex(64,64,(x,w,h)=>{x.fillStyle='#F4F4F0';x.fillRect(0,0,w,h);x.fillStyle='rgba(60,120,100,0.55)';for(let i=0;i<8;i+=2){x.fillRect(i*8,0,8,h);x.fillRect(0,i*8,w,8);}},[3,3]);
 const tx=-3.25,tz=2.25;B(tx-0.8,tx+0.8,TH+0.72,TH+0.76,tz-0.45,tz+0.45,new THREE.MeshStandardMaterial({map:clothT,roughness:0.9}),gRoof);B(tx-0.82,tx+0.82,TH+0.5,TH+0.72,tz-0.47,tz-0.45,new THREE.MeshStandardMaterial({map:clothT,roughness:0.9}),gRoof);
 [[-0.7,-0.35],[0.7,-0.35],[-0.7,0.35],[0.7,0.35]].forEach(([a,b])=>B(tx+a-0.05,tx+a+0.05,TH,TH+0.72,tz+b-0.05,tz+b+0.05,wood,gRoof));
 B(tx-0.8,tx+0.8,TH+0.42,TH+0.46,tz-0.95,tz-0.7,wood,gRoof);[-0.7,0.7].forEach(a=>B(tx+a-0.05,tx+a+0.05,TH,TH+0.42,tz-0.92,tz-0.73,wood,gRoof));
 {const pk=M('#D02A8A',0.5),cx=-5.6,cz=NF-2.4;B(cx-0.22,cx+0.22,TH+0.38,TH+0.42,cz-0.2,cz+0.2,pk,gRoof);B(cx-0.22,cx+0.22,TH+0.42,TH+0.8,cz+0.17,cz+0.21,pk,gRoof);B(cx-0.24,cx-0.2,TH+0.42,TH+0.6,cz-0.2,cz+0.2,pk,gRoof);B(cx+0.2,cx+0.24,TH+0.42,TH+0.6,cz-0.2,cz+0.2,pk,gRoof);[[-0.19,-0.17],[0.19,-0.17],[-0.19,0.17],[0.19,0.17]].forEach(([a,b])=>B(cx+a-0.025,cx+a+0.025,TH,TH+0.4,cz+b-0.025,cz+b+0.025,pk,gRoof));}
 [[-6.6,NF-2.0],[-5.8,NF-2.0]].forEach(([x,z])=>{B(x-0.38,x+0.38,TH,TH+0.18,z-0.14,z+0.14,M('#C8B8B0',0.7),gRoof);for(let k=0;k<6;k++)gRoof.add(blob(x-0.3+k*0.12,TH+0.28,z,0.05,0.14,0.08,M('#4A8A3A',0.8)));});
 [[-5.6,NF-0.6],[-5.9,NF-0.4]].forEach(([x,z])=>cyl(x,z,0.16,TH,0.14,M('#B8643A',0.8),14,gRoof));
 // Hofpflaster bis zur Stützmauer + Durchgang an der Westseite
 {const pv=canvasTex(128,128,(x,w,h)=>{x.fillStyle='#4A4644';x.fillRect(0,0,w,h);for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.fillStyle=`rgba(${80+rnd()*30},${76+rnd()*30},${72+rnd()*30},0.8)`;x.fillRect(i*32+2,j*32+2,28,28);}},[1,1]);
  const t=pv.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,6);const m=new THREE.Mesh(new THREE.PlaneGeometry(2.9,6.0),new THREE.MeshStandardMaterial({map:t,roughness:0.9}));m.rotation.x=-Math.PI/2;m.position.set(TE+1.45,CF-0.012,NF-3.0);gRoof.add(m);
}
 // Vordach über der Kellertür (Stegplatte auf Konsolen) mit Rinne, Fallrohr in den Mörtelkübel
 const tdA=-2.16,tdB=-0.98,cy0=CF+2.45,alu=M('#C8CCCC',0.4,{metalness:0.5});
 {const sh=new THREE.Mesh(new THREE.BoxGeometry(tdB-tdA,0.016,0.78),new THREE.MeshStandardMaterial({color:col('#E4EAEA'),transparent:true,opacity:0.6,roughness:0.2}));sh.position.set((tdA+tdB)/2,cy0,NF-0.42);sh.rotation.x=0.06;gRoof.add(sh);}
 B(tdA,tdB,cy0-0.06,cy0,NF-0.83,NF-0.78,alu,gRoof);B(tdA,tdB,cy0-0.02,cy0+0.03,NF-0.06,NF-0.03,alu,gRoof);
 [tdA+0.12,tdB-0.12].forEach(x=>{const st=new THREE.Mesh(new THREE.BoxGeometry(0.025,0.025,0.72),alu);st.position.set(x,cy0-0.2,NF-0.4);st.rotation.x=-0.55;gRoof.add(st);});
 const pip=M('#B4B8B8',0.5);cyl(-2.15,NF-0.07,0.04,CF+0.55,0.0-CF-0.55+0.9,pip,10,gRoof);{const e=cylZ(-2.15,CF+0.5,NF-0.17,0.04,0.2,pip,gRoof);e.rotation.x=Math.PI/2.4;}
 cyl(-2.15,NF-0.07,0.006,CF+1.2,0.01,M('#C83A3A',0.5),8,gRoof);
 {const tub=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.26,0.42,24,1,true),M('#1E1E20',0.5));tub.position.set(-2.12,CF+0.21,NF-0.4);gRoof.add(tub);B(-2.37,-1.87,CF+0.05,CF+0.06,NF-0.7,NF-0.2,M('#3A4A50',0.2),gRoof);}
 // pinke Gießkanne, Milchkanne
 {const pk=M('#E04A9A',0.5);B(-1.98,-1.78,CF,CF+0.3,NF-0.55,NF-0.42,pk,gRoof);const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.02,0.35,8),pk);sp.position.set(-1.72,CF+0.32,NF-0.49);sp.rotation.z=-0.8;gRoof.add(sp);B(-1.96,-1.8,CF+0.34,CF+0.36,NF-0.5,NF-0.47,pk,gRoof);
  cyl(-1.95,NF-0.95,0.07,CF,0.24,M('#B8BCC0',0.3,{metalness:0.8}),14,gRoof);}
 // Hochbeet mit Betonkante vor dem Sprossenfenster: Kletterrose, Strauch, Lampionblumen
 const bx0=-1.12,bx1=3.3,bz0=NF-1.0;const conc=M('#8A8884',0.9);
 B(bx0,bx1,CF,CF+0.22,bz0,bz0+0.12,conc,gRoof);B(bx0,bx0+0.12,CF,CF+0.22,bz0,NF,conc,gRoof);B(bx1-0.12,bx1,CF,CF+0.22,bz0,NF,conc,gRoof);B(bx0+0.12,bx1-0.12,CF,CF+0.17,bz0+0.12,NF,M('#4A3A2A',0.95),gRoof);
 const rleaf=M('#3E5A26',0.8),red=M('#C8102E',0.55),shr=M('#5A6A2A',0.85),orn=M('#E8701E',0.6);
 [[0,0.8,0,0.45,0.75,0.3],[0.15,1.6,0,0.4,0.6,0.25],[-0.1,2.2,0,0.3,0.45,0.2],[0.3,1.2,-0.1,0.3,0.5,0.25]].forEach(([x,y,z,a,b,c])=>gRoof.add(blob(2.25+x,CF+y,NF-0.35+z,a,b,c,rleaf)));
 for(let i=0;i<26;i++){const a=rnd()*6.283,h=0.7+rnd()*1.8;gRoof.add(blob(2.25+Math.cos(a)*(0.25+rnd()*0.25),CF+h,NF-0.35+Math.sin(a)*0.25-0.08,0.05,0.045,0.05,red));}
 [[0,1.2,0,0.7,1.1,0.45],[0.3,2.0,0,0.55,0.7,0.4],[-0.3,1.8,0.05,0.5,0.7,0.35],[0,2.6,0,0.35,0.4,0.3],[0.5,0.7,-0.1,0.4,0.55,0.35]].forEach(([x,y,z,a,b,c])=>gRoof.add(blob(0.35+x,CF+y,NF-0.45+z,a*0.85,b,c,shr)));
 for(let i=0;i<18;i++)gRoof.add(blob(bx0+0.3+rnd()*(bx1-bx0-0.6),CF+0.3+rnd()*0.35,bz0+0.2+rnd()*0.3,0.035,0.045,0.035,orn));
 [[1.0,0.1],[3.0,0.05]].forEach(([x,o])=>gRoof.add(blob(x,CF+0.4,bz0+0.25,0.35,0.25,0.22,M('#4E7A30',0.85))));
 {const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.14,0.32,18),M('#4A4C50',0.6));pot.position.set(1.4,CF+0.16,bz0-0.25);gRoof.add(pot);}
 // Strahler an der Wand, Fußmatte vor der Glastür, Blumentöpfe vor der Garage
 B(4.18,4.24,CF+2.55,CF+2.6,NF-0.2,NF-0.02,M('#C8CCD0',0.4,{metalness:0.5}),gRoof);{const fl=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.16,0.07),M('#E8E8E6',0.4));fl.position.set(4.21,CF+2.52,NF-0.24);fl.rotation.x=0.5;gRoof.add(fl);}
 B(kd0-0.05,kd1+0.05,CF,CF+0.012,NF-0.62,NF-0.05,M('#2A2A2C',0.95),gRoof);
 cyl(gx1-0.2,NF-0.35,0.16,CF,0.24,M('#C0663F',0.8),16,gRoof);cyl(gx1-0.55,NF-0.3,0.13,CF,0.24,M('#2A2A2C',0.7),16,gRoof);
}
const kFrostT=canvasTex(64,128,(x,w,h)=>{x.fillStyle='#4A4E52';x.fillRect(0,0,w,h);for(let i=0;i<900;i++){x.fillStyle=`rgba(${rnd()<0.5?'200,205,210':'20,22,24'},${0.04+rnd()*0.07})`;x.fillRect(rnd()*w,rnd()*h,1+rnd()*2,1+rnd()*2);}},null);
// Natursteinsockel rundum (Gartenseite liegt ein Geschoss tiefer)
const nStoneT=canvasTex(512,256,(x,w,h)=>{x.fillStyle='#7E7A72';x.fillRect(0,0,w,h);const cs=['#7A4A2E','#9A5A30','#5E3E2E','#A87444','#6A5A50','#4E362C','#8A6046','#B07438','#5A4E48'];
  let y=2;while(y<h){const rh=18+rnd()*22;let xx=-rnd()*30;while(xx<w){const rw=30+rnd()*50,j1=rnd()*4,j2=rnd()*4;const c=cs[Math.floor(rnd()*cs.length)];
    x.fillStyle=c;x.beginPath();x.moveTo(xx+3+j1,y+2+j2);x.lineTo(xx+rw-3-j2,y+2+rnd()*3);x.lineTo(xx+rw-2-rnd()*4,y+rh-3);x.lineTo(xx+3+rnd()*4,y+rh-2-rnd()*3);x.closePath();x.fill();
    const g=x.createLinearGradient(xx,y,xx+rw,y+rh);g.addColorStop(0,'rgba(255,220,170,0.18)');g.addColorStop(0.5,'rgba(60,30,20,0.12)');g.addColorStop(1,'rgba(255,200,140,0.15)');x.fillStyle=g;x.fill();
    for(let k=0;k<3;k++){x.strokeStyle=`rgba(${rnd()<0.5?'200,140,80':'50,35,30'},0.35)`;x.lineWidth=1+rnd()*2;x.beginPath();const sy=y+4+rnd()*(rh-8);x.moveTo(xx+5,sy);x.bezierCurveTo(xx+rw*0.3,sy+rnd()*8-4,xx+rw*0.6,sy+rnd()*8-4,xx+rw-5,sy+rnd()*6-3);x.stroke();}
    xx+=rw;}y+=rh;}},[1,1]);
const kPutzT=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#F1EFE8';x.fillRect(0,0,w,h);for(let i=0;i<70;i++){const cx=rnd()*w,cy=rnd()*h,r=14+rnd()*22,a=rnd()*6.3;x.strokeStyle=`rgba(150,145,135,${0.25+rnd()*0.2})`;x.lineWidth=1.2;x.beginPath();x.arc(cx,cy,r,a,a+1.6+rnd());x.stroke();x.strokeStyle='rgba(255,255,255,0.6)';x.beginPath();x.arc(cx,cy+1.5,r,a,a+1.4);x.stroke();}},[1,1]);
const putzMat=(w,h)=>{const t=kPutzT.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/1.3,h/1.3);return new THREE.MeshStandardMaterial({map:t,roughness:0.95});};
const stoneMat=(w,h)=>{const t=nStoneT.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/2.6,h/1.3);return new THREE.MeshStandardMaterial({map:t,roughness:0.9});};
const NF=-0.39,bTop=0.06,r5fx0=-0.39,r5fx1=8.86;
const gx0=rm('garage','x0',5.3),gx1=r4(gx0+rm('garage','breite',2.9)),kd0=3.55,kd1=4.4,ks0=3.08,ks1=3.45,r5kw0=0.03,r5kw1=1.77;
const nst=(a,b,y0,y1)=>B(a,b,y0,y1,NF-0.03,NF,stoneMat(b-a,y1-y0),gRoof);
const SL=CF+2.25,pz=(a,b,y0,y1)=>B(a,b,y0,y1,NF-0.03,NF,putzMat(b-a,y1-y0),gRoof);
nst(r5fx0,r5kw0,CF,SL);nst(r5kw1,ks0,CF,SL);nst(ks1,kd0,CF,SL);nst(kd1,gx0,CF,SL);nst(gx1,r5fx1,CF,SL);
nst(r5kw0,r5kw1,CF,CF+0.8);nst(ks0,ks1,CF,CF+0.8);pz(r5kw0,r5kw1,CF+2.05,SL);pz(ks0,ks1,CF+2.0,SL);pz(kd0,kd1,CF+2.1,SL);pz(gx0,gx1,CF+2.2,SL);
pz(XW-RV2,r5fx1,SL,bTop);B(XW-RV2-0.04,r5fx1+0.02,SL-0.02,SL+0.03,NF-0.07,NF,M('#F4F2EC',0.8),gRoof);
{const ex=r5fx1,es=(z0,z1,y0,y1)=>B(ex,ex+0.03,y0,y1,z0,z1,stoneMat(z1-z0,y1-y0),gRoof);const G0=3.35,G1=4.2,GY0=CF+1.25,GY1=CF+2.15,V0=5.25,V1=5.8,VY0=CF+1.75,VY1=CF+2.2;
 es(NF,G0,CF,SL);es(G0,G1,CF,GY0);es(G0,G1,GY1,SL);es(G1,V0,CF,SL);es(V0,V1,CF,VY0);es(V0,V1,VY1,SL);es(V1,8.4,CF,SL);B(ex,ex+0.03,SL,bTop,NF,8.4,putzMat(8.8,bTop-SL),gRoof);
 B(ex,ex+0.06,SL-0.03,SL+0.02,NF,8.4,M('#F2F2EE',0.5),gRoof);
 const wh=M('#F4F2EC',0.6),dk=M('#1E2226',0.3);B(ex-0.3,ex-0.27,GY0,GY1,G0,G1,dk,gRoof);B(ex-0.3,ex+0.03,GY0,GY0+0.01,G0,G1,wh,gRoof);B(ex-0.3,ex+0.03,GY1-0.01,GY1,G0,G1,wh,gRoof);B(ex-0.3,ex+0.03,GY0,GY1,G0,G0+0.01,wh,gRoof);B(ex-0.3,ex+0.03,GY0,GY1,G1-0.01,G1,wh,gRoof);
 B(ex-0.27,ex-0.2,GY0,GY1,G0,G0+0.07,wh,gRoof);B(ex-0.27,ex-0.2,GY0,GY1,G1-0.07,G1,wh,gRoof);B(ex-0.27,ex-0.2,GY0,GY0+0.07,G0,G1,wh,gRoof);B(ex-0.27,ex-0.2,GY1-0.07,GY1,G0,G1,wh,gRoof);B(ex-0.27,ex-0.2,GY0,GY1,(G0+G1)/2-0.025,(G0+G1)/2+0.025,wh,gRoof);B(ex-0.27,ex-0.2,(GY0+GY1)/2-0.025,(GY0+GY1)/2+0.025,G0,G1,wh,gRoof);
 B(ex-0.05,ex+0.09,GY0-0.06,GY0,G0-0.06,G1+0.06,M('#E8E6DE',0.6),gRoof);
 const fr=new THREE.MeshStandardMaterial({map:kFrostT,roughness:0.3,metalness:0.2});B(ex-0.12,ex-0.1,VY0,VY1,V0,V1,fr,gRoof);B(ex-0.12,ex+0.03,VY0,VY0+0.01,V0,V1,wh,gRoof);B(ex-0.12,ex+0.03,VY1-0.01,VY1,V0,V1,wh,gRoof);B(ex-0.12,ex+0.03,VY0,VY1,V0,V0+0.01,wh,gRoof);B(ex-0.12,ex+0.03,VY0,VY1,V1-0.01,V1,wh,gRoof);
 B(ex-0.1,ex-0.05,VY0,VY1,V0,V0+0.06,wh,gRoof);B(ex-0.1,ex-0.05,VY0,VY1,V1-0.06,V1,wh,gRoof);B(ex-0.1,ex-0.05,VY0,VY0+0.06,V0,V1,wh,gRoof);B(ex-0.1,ex-0.05,VY1-0.06,VY1,V0,V1,wh,gRoof);B(ex,ex+0.08,VY0-0.04,VY0,V0-0.04,V1+0.04,M('#E8E6DE',0.6),gRoof);
 cyl(ex+0.04,1.0,0.012,SL,0.95,M('#F2F2EE',0.5),8,gRoof);{const lp=new THREE.Mesh(new THREE.SphereGeometry(0.09,16,10,0,6.3,0,1.6),M('#F4F4F2',0.4));lp.rotation.z=-Math.PI/2;lp.position.set(ex+0.02,SL+1.0,1.0);gRoof.add(lp);}
 cyl(ex+0.04,6.0,0.012,SL+0.02,1.1,M('#F2F2EE',0.5),8,gRoof);}
B(gx1-0.02,r5fx1+0.03,CF,SL,NF-0.05,NF-0.03,stoneMat(0.7,SL-CF),gRoof);
B(XW-RV2-0.03,XW-RV2,CF,CF+2.07,NF,8.40,stoneMat(8.7,CF+2.07-CF),gRoof);B(XW-RV2-0.03,XW-RV2,CF+2.07,bTop,NF,8.40,putzMat(8.7,bTop-(CF+2.07)),gRoof);B(XW-RV2-0.07,XW-RV2,CF+2.07-0.02,CF+2.07+0.03,NF,8.40,M('#F2F2EE',0.5),gRoof);{const td0=-1.98,td1=-1.18;B(XW-RV2,td0,CF,SL,NF-0.03,NF,stoneMat(0.2,SL-CF),gRoof);B(td1,r5fx0,CF,SL,NF-0.03,NF,stoneMat(1,SL-CF),gRoof);B(td0,td1,CF+2.1,SL,NF-0.03,NF,stoneMat(0.8,SL-CF-2.1),gRoof);
 const frost=new THREE.MeshStandardMaterial({map:canvasTex(64,128,(x,w,h)=>{x.fillStyle='#4A4E52';x.fillRect(0,0,w,h);for(let i=0;i<900;i++){x.fillStyle=`rgba(${rnd()<0.5?'200,205,210':'20,22,24'},${0.03+rnd()*0.06})`;x.fillRect(rnd()*w,rnd()*h,1+rnd()*2,1+rnd()*2);}},null),roughness:0.3,metalness:0.2});
 {const pv=new THREE.Group();pv.position.set(td0+0.02,CF,NF-0.02);gRoof.add(pv);const w=td1-td0-0.04,P=[];P.push(B(0,w,0,2.08,-0.02,0.02,white,pv));P.push(B(0.12,w-0.12,0.15,1.95,-0.025,0.025,frost,pv));
  P.push(B(w-0.18,w-0.04,0.96,1.12,-0.055,-0.02,M('#E6E6E2',0.5),pv));P.push(B(w-0.17,w-0.05,0.97,1.11,-0.06,-0.055,M('#F4F4F0',0.4),pv));
  const a=swing(pv,'y',-1.35);window.__tdE=a;clickable(P,()=>{a.target=a.target?0:a.open;if(window.__tdA)window.__tdA.target=a.target?window.__tdA.open:0;});}
 B(td0-0.1,td1+0.1,CF-0.01,CF+0.005,NF-0.7,NF-0.05,M('#2A2A2C',0.95),gRoof);
 // Stufen hoch in den Garten (westlich der Terrasse)
 HOFEXTRA();}
// Strahler über dem Bürofenster, Kabelkanal, Außensteckdose
{const fx=XW-RV2,dk=M('#2A2C30',0.4),wk=M('#EEEEEA',0.5);B(fx-0.12,fx-0.02,CF+3.1,CF+3.3,1.95,2.2,dk,gRoof);B(fx-0.03,fx,CF+2.07,CF+3.1,2.06,2.09,wk,gRoof);
 B(fx-0.04,fx,CF+2.04,CF+2.08,0.0,0.75,wk,gRoof);B(fx-0.03,fx,CF+0.5,CF+2.04,0.72,0.75,wk,gRoof);B(fx-0.07,fx,CF+0.4,CF+0.52,0.67,0.8,M('#9A9EA2',0.5),gRoof);}
// Kellerfenster/-tür auf der Terrassenseite
[[1.195,2.935,CF+0.8,CF+2.05,1],[4.95,5.62,CF+1.38,CF+2.05,0]].forEach(([a,b,y0,y1,sp])=>{const fx=XW-RV2,m=(a+b)/2,hM=M('#F0F0EE',0.3);
  B(fx-0.05,fx-0.02,y0,y1,a,b,M('#2A3036',0.3),gRoof);B(fx-0.06,fx-0.05,y0+0.07,y1-0.07,a+0.07,b-0.07,glass,gRoof);B(fx-0.1,fx,y0-0.05,y0,a-0.05,b+0.05,M('#C8C4BA',0.6),gRoof);
  const fr=(z0,z1,yy0,yy1)=>{B(fx-0.075,fx-0.05,yy0,yy1,z0,z0+0.07,white,gRoof);B(fx-0.075,fx-0.05,yy0,yy1,z1-0.07,z1,white,gRoof);B(fx-0.075,fx-0.05,yy0,yy0+0.07,z0,z1,white,gRoof);B(fx-0.075,fx-0.05,yy1-0.07,yy1,z0,z1,white,gRoof);};
  if(sp){fr(a,m+0.01,y0,y1);fr(m-0.01,b,y0,y1);[(a+m)/2,(m+b)/2].forEach(c=>B(fx-0.085,fx-0.06,y0+0.07,y1-0.07,c-0.015,c+0.015,white,gRoof));B(fx-0.085,fx-0.06,(y0+y1)/2+0.05-0.015,(y0+y1)/2+0.05+0.015,a+0.07,b-0.07,white,gRoof);B(fx-0.1,fx-0.075,y0+(y1-y0)*0.45,y0+(y1-y0)*0.45+0.14,m-0.04,m-0.02,hM,gRoof);}
  else{fr(a,b,y0,y1);B(fx-0.1,fx-0.075,y0+(y1-y0)*0.45,y0+(y1-y0)*0.45+0.12,b-0.06,b-0.04,hM,gRoof);}});

// Garagentor (Rolltor)
const rollT=canvasTex(64,128,(x,w,h)=>{x.fillStyle='#F2F2F0';x.fillRect(0,0,w,h);for(let y=0;y<h;y+=8){x.fillStyle='rgba(120,120,120,0.5)';x.fillRect(0,y,w,1.5);}},[1,1]);
// ---- Garage innen + Sektionaltor (Klick: auf/zu) ----
{const GZ1=NF+4.92,GC=CF+2.2,z0=NF+0.32,Hv=1.98,R=0.18,NP=8,ph=Hv/NP,W=gx1-gx0-0.06;
 const gpT=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#F1F0EC';x.fillRect(0,0,w,h);for(let i=0;i<340;i++){const v=rnd();x.fillStyle=v<0.5?`rgba(255,255,255,${0.08+rnd()*0.12})`:`rgba(115,112,106,${0.015+rnd()*0.035})`;x.beginPath();x.ellipse(rnd()*w,rnd()*h,1+rnd()*3,1+rnd()*2,rnd()*3,0,6.3);x.fill();}},[1,1]);
 const gp=(w,h)=>{const t=gpT.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/1.4,h/1.4);return new THREE.MeshStandardMaterial({map:t,roughness:0.95});};
 // Raum: Wände, Decke, Boden, Laibung, Sturz
 B(gx0-0.12,gx0,CF,GC,NF,garageDoorZ0,gp(2.7,2.5),gRoof);B(gx0-0.12,gx0,CF,GC,garageDoorZ1,GZ1,gp(1.7,2.5),gRoof);B(gx0-0.12,gx0,CF+garageDoorH,GC,garageDoorZ0,garageDoorZ1,gp(0.9,0.2),gRoof);{const gwz0=3.35,gwz1=4.2,gwy0=CF+1.25,gwy1=CF+2.15,ex=8.86;B(gx1,ex,CF,GC,NF,gwz0,gp(3.7,2.5),gRoof);B(gx1,ex,CF,GC,gwz1,GZ1,gp(0.4,2.5),gRoof);B(gx1,ex,CF,gwy0,gwz0,gwz1,gp(0.9,1.3),gRoof);B(gx1,ex,gwy1,GC,gwz0,gwz1,gp(0.9,0.4),gRoof);
 const wh=M('#F4F2EC',0.6),gl=new THREE.MeshStandardMaterial({color:col('#C8DCC8'),emissive:col('#B0CCB0'),emissiveIntensity:0.6,roughness:0.3});const fx=ex-0.37;
 B(fx,fx+0.04,gwy0,gwy1,gwz0,gwz1,gl,gRoof);[[gwz0,gwz0+0.06],[gwz1-0.06,gwz1],[(gwz0+gwz1)/2-0.02,(gwz0+gwz1)/2+0.02]].forEach(([a,b])=>B(fx-0.02,fx+0.05,gwy0,gwy1,a,b,wh,gRoof));[gwy0,gwy1-0.06,(gwy0+gwy1)/2-0.02].forEach(y=>B(fx-0.02,fx+0.05,y,y+(y==(gwy0+gwy1)/2-0.02?0.04:0.06),gwz0,gwz1,wh,gRoof));
 B(gx1-0.02,fx,gwy0-0.05,gwy0,gwz0-0.05,gwz1+0.05,gp(0.6,0.1),gRoof);
 const pg=M('#9A9EA2',0.5);cyl(gx1-0.08,gwz0-0.15,0.055,CF+0.7,GC-CF-0.7,pg,12,gRoof);{const h=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,gwz1-gwz0+0.3,12),pg);h.rotation.x=Math.PI/2;h.position.set(gx1-0.08,CF+0.72,(gwz0+gwz1)/2);gRoof.add(h);}cyl(gx1-0.06,gwz1+0.15,0.03,CF+1.0,GC-CF-1.0,pg,10,gRoof);
 }B(gx0-0.12,gx1+0.12,CF,GC,GZ1,GZ1+0.12,gp(3,2.5),gRoof);
 B(gx0-0.12,gx1+0.12,GC,GC+0.12,NF,GZ1+0.12,gp(3,5.4),gRoof);B(gx0,gx1,CF+2.2,GC,NF-0.005,z0-0.03,gp(3,0.3),gRoof);
 B(gx0-0.12,gx1+0.12,CF-0.06,CF+0.004,NF-0.03,GZ1,M('#9A9894',0.9),gRoof);B(gx0-0.1,gx1+0.1,CF-0.06,CF+0.025,NF-0.5,NF-0.03,M('#A8A49C',0.9),gRoof);
 for(let k=0;k<5;k++)B(gx0+0.3+rnd()*2.2,gx0+0.6+rnd()*2.2,CF+0.005,CF+0.006,NF+0.5+k*0.9,NF+0.9+k*0.9,M('#B8C4CC',0.9),gRoof);
 // Pfeiler hinten rechts, Nische
 B(gx0,gx0+0.45,CF,GC,GZ1-0.45,GZ1,gp(0.5,2.5),gRoof);B(gx0+0.48,gx0+0.9,CF+0.3,CF+0.65,GZ1-0.012,GZ1,M('#C8A87A',0.95),gRoof);{const op=M('#EEE6D6',0.6);cyl(gx0+0.85,GZ1-0.05,0.022,CF,1.85,op,8,gRoof);const hp=new THREE.Mesh(new THREE.CylinderGeometry(0.022,0.022,0.6,8),op);hp.rotation.z=Math.PI/2;hp.position.set(gx0+0.55,CF+1.85,GZ1-0.05);gRoof.add(hp);[gx0+0.6,gx0+0.72].forEach(x=>B(x,x+0.02,CF+0.75,CF+0.85,GZ1-0.08,GZ1,M('#8A8A8A',0.5,{metalness:0.5}),gRoof));}

 // Leitungen an der Decke: rotes Rohr, graue Rohre, Kabelkanal
 const cx=(x0,x1,y,z,r,m)=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r,x1-x0,10),m);c.rotation.z=Math.PI/2;c.position.set((x0+x1)/2,y,z);gRoof.add(c);};
 const czz=(z0_,z1_,x,y,r,m)=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r,z1_-z0_,10),m);c.rotation.x=Math.PI/2;c.position.set(x,y,(z0_+z1_)/2);gRoof.add(c);};
 cx(gx0,gx1,GC-0.12,GZ1-0.12,0.025,M('#C8282A',0.5));cx(gx0,gx1,GC-0.2,GZ1-0.1,0.02,M('#9A9EA2',0.5));czz(NF+1.0,GZ1,gx0+0.15,GC-0.12,0.025,M('#C8282A',0.5));czz(NF+0.4,GZ1,gx0+0.25,GC-0.06,0.03,M('#C8CCD0',0.5));czz(NF+0.6,GZ1,gx1-0.6,GC-0.05,0.03,M('#C8CCD0',0.5));
 // Torantrieb (blau) mit Laufschiene
 const md=(gx0+gx1)/2;B(md-0.04,md+0.04,GC-0.08,GC,z0,NF+3.0,M('#2A2A2C',0.5),gRoof);B(md-0.2,md+0.2,GC-0.2,GC-0.04,NF+3.0,NF+3.45,M('#2448A8',0.4),gRoof);B(md-0.18,md+0.18,GC-0.205,GC-0.19,NF+3.05,NF+3.4,M('#F0F0EC',0.4),gRoof);
 {const led=new THREE.Mesh(new THREE.SphereGeometry(0.01,6,4),new THREE.MeshBasicMaterial({color:0xff3020}));led.position.set(md+0.05,GC-0.21,NF+3.2);gRoof.add(led);}
 cyl(md-0.6,NF+1.2,0.02,GC-0.4,0.4,M('#5A5A5A',0.5),6,gRoof);cyl(md-0.6,NF+1.2,0.03,GC-0.48,0.08,M('#E8301E',0.5),10,gRoof);
 // Laufschienen + Leuchtstoffröhren an den Seitenwänden
 const rl=M('#B8BCC0',0.4,{metalness:0.5});[gx0+0.02,gx1-0.06].forEach(x=>{B(x,x+0.04,CF,CF+Hv+0.05,z0-0.05,z0+0.03,rl,gRoof);B(x,x+0.04,CF+Hv+R-0.03,CF+Hv+R+0.05,z0,NF+3.0,rl,gRoof);});
 const tube=new THREE.MeshStandardMaterial({color:col('#FFFFFF'),emissive:col('#F4F8FF'),emissiveIntensity:0.6});
 [[gx0,1],[gx1,-1]].forEach(([x,d])=>{B(Math.min(x,x+d*0.08),Math.max(x,x+d*0.08),GC-0.5,GC-0.44,NF+0.8,NF+2.3,M('#E8E8E4',0.5),gRoof);czz(NF+0.82,NF+2.28,x+d*0.06,GC-0.52,0.016,tube,gRoof);});
 {const gl=new THREE.PointLight(col('#F4F6FF'),0.5,6,2);gl.position.set(md,GC-0.6,NF+2.2);gRoof.add(gl);}
 // Sektionaltor: 8 Lamellen, laufen in den Schienen hoch unter die Decke
 const panT=canvasTex(64,64,(x,w,h)=>{x.fillStyle='#F4F4F2';x.fillRect(0,0,w,h);x.fillStyle='rgba(140,140,140,0.6)';x.fillRect(0,h/2-1,w,2);x.fillStyle='rgba(90,90,90,0.8)';x.fillRect(0,h-2,w,2);x.fillStyle='rgba(255,255,255,0.8)';x.fillRect(0,1,w,2);},null);
 const panM=new THREE.MeshStandardMaterial({map:panT,roughness:0.45}),pans=[];
 for(let k=0;k<NP;k++){const m=new THREE.Mesh(new THREE.BoxGeometry(W,ph-0.004,0.04),panM);m.userData.navBlocker=1;gRoof.add(m);pans.push(m);}

 const hdl=B(-0.08,0.08,-0.02,0.02,-0.06,-0.02,M('#3A3A3C',0.4),pans[1]);
 const sOpen=Hv+Math.PI*R/2+0.02,place=sv=>{pans.forEach((m,k)=>{const u=k*ph+ph/2+sv;let y,z,th;
   if(u<=Hv){y=CF+u;z=z0;th=0;}else if(u<=Hv+Math.PI*R/2){th=(u-Hv)/R;y=CF+Hv+R*Math.sin(th);z=z0+R*(1-Math.cos(th));}else{th=Math.PI/2;y=CF+Hv+R;z=z0+R+(u-Hv-Math.PI*R/2);}
   m.position.set(gx0+0.03+W/2,y,z);m.rotation.x=th;});};
 const gst={s:0};place(0);const ga=anim(()=>gst.s,v=>{gst.s=v;place(v);},sOpen);clickable(pans,tog(ga));window.__garage=ga;window.__garPans=pans;
 const __gn0=gRoof.children.length;
 // Inhalt (aufgeräumt): Gartengeräte links, Netzrolle, Lochmatte + Einhell-Karton hinten, Etagere/Eimer/Holzklotz/Bälle rechts, Stäbe + Trimmer am Pfeiler
 const blk=M('#1E1E20',0.6),wd=M('#C89A5A',0.7);
 const lean=(x,z0,len,tilt,m,head)=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(0.016,0.016,len,6),m);t.position.set(x,CF+len/2*Math.cos(tilt),z0);t.rotation.z=tilt;gRoof.add(t);if(head){const h=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.3,0.26),head);h.position.set(x-Math.sin(tilt)*0.05+0.12,CF+0.15,z0);gRoof.add(h);}};
 [[NF+0.75,1.55,M('#2A2A2E',0.5)],[NF+0.95,1.6,M('#3A3A3E',0.5)],[NF+1.15,1.65,null],[NF+1.3,1.7,M('#C83A2A',0.5)],[NF+1.45,1.6,null],[NF+1.6,1.7,M('#8A8A8C',0.4,{metalness:0.5})],[NF+1.75,1.65,M('#2A2A2E',0.5)]].forEach(([z,l,h],k)=>lean(gx1-0.32+k*0.01,z,l,-0.2,wd,h));
 B(gx1-0.45,gx1-0.4,CF,CF+0.06,NF+0.5,NF+0.8,M('#8A6A3A',0.7),gRoof);cyl(gx1-0.42,NF+0.65,0.01,CF+0.06,0.05,M('#7ACA3A',0.5),6,gRoof);
 {const nt=M('#2E7A6A',0.8);const n=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.2,1.45,12,1,true),nt);n.position.set(gx1-0.3,CF+0.72,NF+2.25);n.rotation.z=-0.1;gRoof.add(n);}
 B(gx1-0.15,gx1-0.1,CF,CF+0.9,NF+2.6,NF+3.2,M('#B8B49A',0.8),gRoof);
 // Rückwand: schwarze Lochmatte, Einhell-Karton, Kabel
 {const mt=canvasTex(128,32,(x,w,h)=>{x.fillStyle='#1A1A1C';x.fillRect(0,0,w,h);x.fillStyle='#C8A040';for(let i=4;i<w;i+=8)for(let j=4;j<h;j+=8)x.fillRect(i,j,1.2,1.2);},null);B(6.5,7.75,CF+0.62,CF+0.92,GZ1-0.015,GZ1,new THREE.MeshStandardMaterial({map:mt,roughness:0.9}),gRoof);}
 {const et=canvasTex(128,96,(x,w,h)=>{x.fillStyle='#E8186A';x.fillRect(0,0,w,h);x.fillStyle='#1E1E22';x.fillRect(0,0,w,18);x.fillStyle='#FFF';x.font='bold 13px Arial';x.fillText('Einhell',30,13);x.fillStyle='#C8105A';x.fillRect(30,30,60,50);x.fillStyle='#2A2A2E';x.fillRect(40,40,40,30);},null);
  const em=new THREE.MeshStandardMaterial({map:et,roughness:0.7});B(6.55,7.05,CF,CF+0.36,GZ1-0.42,GZ1-0.08,em,gRoof);}
 for(let k=0;k<4;k++){const t=new THREE.Mesh(new THREE.TorusGeometry(0.18+k*0.02,0.008,6,24),blk);t.rotation.x=Math.PI/2;t.position.set(7.35,CF+0.01+k*0.012,GZ1-0.3);gRoof.add(t);}
 cyl(7.6,GZ1-0.05,0.006,CF,0.9,blk,4,gRoof);
 // rechts vorne: Metall-Etagere mit Kinderkram
 {const sx=gx0+0.25,sz=NF+0.75,wr=M('#1E2A22',0.5);[[-0.16,-0.16],[0.16,-0.16],[-0.16,0.16],[0.16,0.16]].forEach(([a,b])=>B(sx+a-0.01,sx+a+0.01,CF,CF+1.65,sz+b-0.01,sz+b+0.01,wr,gRoof));
  [0.25,0.6,0.95,1.3].forEach((y,k)=>{B(sx-0.16,sx+0.16,CF+y,CF+y+0.012,sz-0.16,sz+0.16,wr,gRoof);B(sx-0.12,sx+0.1,CF+y+0.012,CF+y+0.1,sz-0.1,sz+0.1,M(['#8A4AC8','#3AC8D8','#F2C02A','#E83A8A'][k],0.6),gRoof);});
  const nd=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.5,8),M('#F2C02A',0.6));nd.rotation.x=Math.PI/2;nd.position.set(sx,CF+1.05,sz);gRoof.add(nd);}
 cyl(gx0+0.55,NF+1.2,0.15,CF,0.34,M('#F4F4F0',0.6),16,gRoof);cyl(gx0+0.55,NF+1.2,0.16,CF+0.34,0.03,M('#2E9A4A',0.6),16,gRoof);
 cyl(gx0+0.35,NF+1.5,0.15,CF,0.22,M('#F4F4F0',0.6),16,gRoof);cyl(gx0+0.35,NF+1.5,0.15,CF+0.22,0.04,M('#C8A060',0.9),16,gRoof);
 {const bk=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.13,0.28,16),blk);bk.position.set(gx0+0.75,CF+0.3,NF+1.45);bk.rotation.z=0.5;gRoof.add(bk);}
 cyl(gx0+0.95,NF+1.05,0.14,CF,0.32,M('#C8A070',0.8),14,gRoof);cyl(gx0+0.95,NF+1.05,0.14,CF+0.32,0.005,M('#E8D0A0',0.8),14,gRoof);
 [[gx0+1.15,NF+0.75,0.12,'#E83A2A'],[gx0+0.8,NF+0.6,0.11,'#F4F2EA'],[gx0+0.7,NF+1.75,0.07,'#E8702A']].forEach(([x,z,r,c])=>{const b=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),M(c,0.5));b.position.set(x,CF+r,z);gRoof.add(b);});
 cyl(gx0+1.3,NF+0.5,0.08,CF,0.3,M('#C8CCD0',0.3,{metalness:0.8}),14,gRoof);gRoof.add(blob(gx0+0.6,CF+0.15,NF+1.85,0.2,0.15,0.18,M('#E8508A',0.8)));
 // Stäbe/Bambus + Rasentrimmer an der rechten Wand vor dem Pfeiler
 for(let k=0;k<9;k++){const len=1.8+rnd()*0.4,t=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,len,6),M(k%3?'#C8A86A':'#24443A',0.7));t.position.set(gx0+0.15+k*0.015,CF+len/2*0.97,GZ1-0.7-k*0.06);t.rotation.x=0.25;gRoof.add(t);}
 {const tg=new THREE.Group();tg.position.set(gx0+0.18,CF,NF+2.6);tg.rotation.z=-0.12;gRoof.add(tg);const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,1.1,8),M('#2E7A4A',0.5));sh.position.y=0.6;tg.add(sh);
  B(-0.04,0.04,1.1,1.3,-0.03,0.03,M('#C8202A',0.5),tg);B(-0.08,0.08,0.0,0.12,-0.1,0.1,M('#2A4A3A',0.5),tg);}
 [[gx0+0.55,GZ1-0.5],[gx0+0.68,GZ1-0.52]].forEach(([x,z])=>{const pl=new THREE.Mesh(new THREE.BoxGeometry(0.08,1.0,0.04),M('#5A4A3A',0.8));pl.position.set(x,CF+0.48,z);pl.rotation.z=0.2;gRoof.add(pl);});
 gRoof.children.slice(__gn0).forEach(o=>o.traverse(m=>{if(m.isMesh)m.userData.deco=1;}));
}
B(gx0,gx0+0.08,CF,CF+2.2,NF-0.05,NF,white,gRoof);B(gx1-0.08,gx1,CF,CF+2.2,NF-0.05,NF,white,gRoof);B(gx0,gx1,CF+2.12,CF+2.2,NF-0.05,NF,white,gRoof);
// Kellertür (dunkel, offen) + schmales Fenster + breites Sprossenfenster
{const pv=new THREE.Group();pv.position.set(kd1-0.02,CF,NF-0.02);gRoof.add(pv);const w=kd1-kd0-0.04,P=[];P.push(B(-w,0,0,2.08,-0.02,0.02,white,pv));P.push(B(-w+0.1,-0.1,0.15,1.95,-0.025,0.025,new THREE.MeshStandardMaterial({color:col('#C8D2D4'),roughness:0.3,metalness:0.1}),pv));P.push(B(-w+0.04,-w+0.07,0.95,1.15,-0.05,-0.02,M('#E8E8E8',0.3),pv));P.push(B(-w+0.04,-w+0.16,1.06,1.09,-0.07,-0.05,M('#E8E8E8',0.3),pv));
  const a=swing(pv,'y',1.35);a.target=a.open;pv.rotation.y=a.open;window.__wkE=a;clickable(P,()=>{a.target=a.target?0:a.open;if(window.__wkA)window.__wkA.target=a.target?window.__wkA.open:0;});}B(kd0-0.06,kd0,CF,CF+2.15,NF-0.04,NF,white,gRoof);B(kd1,kd1+0.06,CF,CF+2.15,NF-0.04,NF,white,gRoof);B(kd0-0.06,kd1+0.06,CF+2.1,CF+2.16,NF-0.04,NF,white,gRoof);
const kWinN=(a,b,y0,y1,spr,frost)=>{const gm=frost?new THREE.MeshStandardMaterial({map:kFrostT,roughness:0.3,metalness:0.2}):glass;B(a,a+0.06,y0,y1,NF-0.03,NF,white,gRoof);B(b-0.06,b,y0,y1,NF-0.03,NF,white,gRoof);B(a,b,y0,y0+0.06,NF-0.03,NF,white,gRoof);B(a,b,y1-0.06,y1,NF-0.03,NF,white,gRoof);B(a+0.06,b-0.06,y0+0.06,y1-0.06,NF+0.005,NF+0.01,M('#2A3036',0.3),gRoof);B(a+0.06,b-0.06,y0+0.06,y1-0.06,NF-0.02,NF-0.015,gm,gRoof);
  const hM=M('#F0F0EE',0.3);if(spr){const m=(a+b)/2;B(m-0.05,m+0.05,y0,y1,NF-0.045,NF-0.02,white,gRoof);[(a+m)/2,(m+b)/2].forEach(c=>B(c-0.015,c+0.015,y0+0.06,y1-0.06,NF-0.04,NF-0.03,white,gRoof));B(a+0.06,b-0.06,(y0+y1)/2+0.05-0.015,(y0+y1)/2+0.05+0.015,NF-0.04,NF-0.03,white,gRoof);B(m+0.02,m+0.04,y0+(y1-y0)*0.45,y0+(y1-y0)*0.45+0.14,NF-0.07,NF-0.045,hM,gRoof);}
  else B(b-0.09,b-0.07,y0+(y1-y0)*0.42,y0+(y1-y0)*0.42+0.12,NF-0.06,NF-0.03,hM,gRoof);B(a-0.04,b+0.04,y0-0.04,y0,NF-0.1,NF,white,gRoof);};
kWinN(ks0,ks1,CF+0.8,CF+2.0,0,1);kWinN(r5kw0,r5kw1,CF+0.8,CF+2.05,1);
// Hof auf Kellerniveau + Wiese
{const pavT=canvasTex(128,128,(x,w,h)=>{x.fillStyle='#4A4644';x.fillRect(0,0,w,h);for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.fillStyle=`rgba(${80+rnd()*30},${76+rnd()*30},${72+rnd()*30},0.8)`;x.fillRect(i*32+2,j*32+2,28,28);}},[1,1]);
 const t=pavT.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(9,5);const m=new THREE.Mesh(new THREE.PlaneGeometry(10,6),new THREE.MeshStandardMaterial({map:t,roughness:0.9}));m.rotation.x=-Math.PI/2;m.position.set(4.3,CF-0.01,NF-3.0);gRoof.add(m);
 const gm=new THREE.Mesh(new THREE.PlaneGeometry(10.9,14),M('#6E8A4E',0.95));gm.rotation.x=-Math.PI/2;gm.scale.set(9.3/10.9,1,1);gm.position.set(-9.85,CF+0.85-0.055,0);gRoof.add(gm);}
// Geschossdecke zwischen EG und OG als Außenband
{const pl=M('#F4F2EC',0.85);fuell(B(-0.39,8.86,H,OGF+0.01,-0.39,8.41,pl,gRoof));fuell(B(XW-RV2,-0.38,H,OGF+0.01,Z0-0.38,S+0.39,pl,gRoof));fuell(B(HX0,KX1+0.38,H,OGF+0.01,KZ0,S+0.39,pl,gRoof));}

// ---- Vorgarten zur Straße: Natursteinmauer mit Pfeilern, Tor, Zaun, Briefkasten, Gehweg, Einfahrtstor ----
{const yG=EF-0.4,wz=FZ+3.2,sandT=canvasTex(256,128,(x,w,h)=>{x.fillStyle='#8A7A62';x.fillRect(0,0,w,h);for(let r=0;r<5;r++)for(let c=0;c<7;c++){const v=rnd();x.fillStyle=v<0.35?'#C8B898':v<0.7?'#B0A080':'#D8C8A8';x.fillRect(c*40+(r%2)*18+rnd()*4,r*26+2,30+rnd()*8,22);}},[1,1]);
 const sMat=(w,h)=>{const t=sandT.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/0.9,h/0.45);return new THREE.MeshStandardMaterial({map:t,roughness:0.9});};
 const g0=exc-0.6,g1=exc+0.6,wx0=-2.5,dr0=9.0,dr1=12.5;
 B(wx0,g0-0.45,yG,yG+0.55,wz,wz+0.35,sMat(g0-wx0,0.55),gRoof);B(g1+0.45,dr0-0.45,yG,yG+0.55,wz,wz+0.35,sMat(dr0-g1,0.55),gRoof);
 [[g0-0.45,g0],[g1,g1+0.45],[dr0-0.45,dr0]].forEach(([a,b])=>B(a,b,yG,yG+1.15,wz-0.03,wz+0.4,sMat(0.45,1.15),gRoof));
 const iron=M('#2E4A3A',0.5,{metalness:0.4});
 const fence=(a,b,y0,y1)=>{B(a,b,y1-0.03,y1,wz+0.16,wz+0.19,iron,gRoof);B(a,b,y0,y0+0.03,wz+0.16,wz+0.19,iron,gRoof);for(let x=a+0.06;x<b;x+=0.12)B(x,x+0.015,y0,y1,wz+0.165,wz+0.185,iron,gRoof);};
 fence(wx0,g0-0.45,yG+0.55,yG+1.08);fence(g1+0.45,dr0-0.45,yG+0.55,yG+1.08);
 // Gartentor (ein Flügel) und Einfahrtstor (zwei Flügel): Drehgruppen, Klick öffnet nach innen. Eine unsichtbare Fläche je
 // Flügel ist Klickfläche (die Stäbe sind zu dünn zum Treffen) und Hindernis im Laufmodus.
 {const gateHit=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false,side:THREE.DoubleSide});
  const gate=(hx,len,dir,y0,y1)=>{const pv=new THREE.Group();pv.position.set(hx,0,wz+0.175);gRoof.add(pv);const P=[],a=dir>0?0:-len,b=dir>0?len:0;
   P.push(B(a,b,y1-0.03,y1,-0.015,0.015,iron,pv),B(a,b,y0,y0+0.03,-0.015,0.015,iron,pv),B(dir>0?b-0.03:a,dir>0?b:a+0.03,y0,y1,-0.015,0.015,iron,pv));for(let x=a+0.06;x<b-0.04;x+=0.12)P.push(B(x,x+0.015,y0,y1,-0.01,0.01,iron,pv));
   const h=B(a,b,y0,y1,-0.004,0.004,gateHit,pv);h.userData.noShadow=1;h.castShadow=false;P.push(h);return {P,a:swing(pv,'y',dir*1.4)};};
  const gt=gate(g0,g1-g0,1,yG+0.05,yG+1.0);clickable(gt.P,tog(gt.a));
  const eL=gate(dr0,(dr1-dr0)/2,1,yG-0.35,yG+1.25),eR=gate(dr1,(dr1-dr0)/2,-1,yG-0.35,yG+1.25);clickable([...eL.P,...eR.P],()=>{const t=eL.a.target?0:eL.a.open;eL.a.target=t;eR.a.target=t?eR.a.open:0;});}
 B(g1+0.06,g1+0.4,yG+0.75,yG+1.0,wz+0.4,wz+0.5,M('#5A5E62',0.4,{metalness:0.4}),gRoof);B(g1+0.43,g1+0.45,yG+0.85,yG+0.95,wz+0.42,wz+0.48,M('#2A4AA8',0.5),gRoof);
 B(g0+0.05,g1-0.05,yG-0.02,yG+0.02,FZ+1.0,wz,M('#9A968E',0.85),gRoof);
 B(wx0,dr0,yG-0.1,yG,FZ,wz,M('#5A6A44',0.95),gRoof);
 {const pv=canvasTex(128,128,(x,w,h)=>{x.fillStyle='#9A928A';x.fillRect(0,0,w,h);for(let i=0;i<8;i++)for(let j=0;j<4;j++){x.fillStyle=`rgba(${150+rnd()*30},${140+rnd()*30},${130+rnd()*25},0.9)`;x.fillRect(i*16+((j%2)*8),j*32+1,15,30);}},[1,1]);
  const t=pv.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(15,3);const m=new THREE.Mesh(new THREE.PlaneGeometry(dr1-wx0,3.0),new THREE.MeshStandardMaterial({map:t,roughness:0.9}));m.rotation.x=-Math.PI/2;m.position.set((wx0+dr1)/2,yG-0.38+0.001,wz+0.35+1.5);gRoof.add(m);
  B(wx0,dr1,yG-0.4,yG-0.38,wz+0.35,wz+3.35,M('#8A847C',0.9),gRoof);B(wx0,dr1,yG-0.5,yG-0.4,wz+3.35,wz+9,M('#4A4A4C',0.9),gRoof);
  B(g0,g1,yG-0.38,yG,wz+0.35,wz+0.6,M('#A8A49A',0.85),gRoof);
  const t2=pv.clone();t2.needsUpdate=true;t2.wrapS=t2.wrapT=THREE.RepeatWrapping;t2.repeat.set(1,1);const dm=new THREE.MeshStandardMaterial({map:t2,color:col('#7E7A76'),roughness:0.9,side:THREE.DoubleSide});
  const ex0=8.86,zs=8.0,yT=yG-0.36,P=[[ex0,CF+0.004,-0.39],[dr1,CF+0.004,-0.39],[dr1,yT,zs],[ex0,yT,zs],[ex0,yT,zs],[dr1,yT,zs],[dr1,yT,wz],[ex0,yT,wz]];
  const pos=[],uv=[];[[0,1,2],[0,2,3],[4,5,6],[4,6,7]].forEach(t=>t.forEach(k=>{const q=P[k];pos.push(...q);uv.push((q[0]-ex0)/0.9,q[2]/0.9);}));const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();gRoof.add(new THREE.Mesh(g,dm));
  {const sp=[],e=[[dr1,CF,-0.39],[dr1,CF+0.004,-0.39],[dr1,yT,zs],[dr1,CF,zs]];[[0,1,2],[0,2,3]].forEach(t=>t.forEach(k=>sp.push(...e[k])));const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));sg.computeVertexNormals();gRoof.add(new THREE.Mesh(sg,M('#5A4A3A',0.95,{side:THREE.DoubleSide})));}
  {const m=new THREE.Mesh(new THREE.PlaneGeometry(dr1-9.3,6.0),new THREE.MeshStandardMaterial({map:(()=>{const t=pv.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3.5,6.5);return t;})(),roughness:0.9}));m.rotation.x=-Math.PI/2;m.position.set((9.3+dr1)/2,CF-0.01,-3.39);gRoof.add(m);}
  for(let k=0;k<7;k++)gRoof.add(blob(dr1+0.3,CF+0.6+(yT-CF)*(k/6)*0.9+0.5,-0.2+k*1.3,0.45,0.9+rnd()*0.4,0.6,M(k%2?'#6A8A3A':'#7A9A44',0.85)));}
 gRoof.add(deco(blob(g1+2.0,yG+0.95,wz-0.55,1.5,0.85,0.5,M('#3E6A2E',0.8))));gRoof.add(deco(blob(g0-1.6,yG+1.2,wz-0.7,1.3,1.1,0.7,M('#5A8A3A',0.8))));}

// Zwischenzone EG-Decke bis OG-Boden um das Treppenhaus
const gMid=new THREE.Group();scene.add(gMid);
B(XE,HX0,H,OGF,Z0,HZ1+0.38,wallMat,gMid);B(HX1,EX+ET,H,OGF,Z0,HZ1,wallMat,gMid);B(XW-RV2,XE,H,OGF,S,S+0.38,wallMat,gMid);B(XE,HX0,H,OGF,Z0-0.12,Z0,wallMat,gMid);
label('Treppenpodest',(CX0+EX)/2,LY+2.0,(HZ1+0.3+EDZ)/2);
const facadeGroups=[gMid,gWin,gLeft,gRight,gBack,gDW,gDS,gDE,gHE,gHS,gKE,gKS,gKN,gBaE,gBN,gBE,gVS,gVR,gUp,gVRoof,gOG,gJN,gJW,gJE,gJS,gWN,gWE,gWS,gGW,gGS,gGN,gLS,gLE,gGC,gAW,gAS,gAE,gAN,gOBE,gOBW,gCE,gVW];
