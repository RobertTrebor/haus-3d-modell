// Obergeschoss: Janinas Zimmer, Wichtelzimmer, Lesezimmer, Bastelzimmer, Treppenhaus, Au-pair-Zimmer, Bad, WC.
// ===================== OBERGESCHOSS =====================
const OGF=U1,OGH=KONST.OGH,gOG=new THREE.Group();scene.add(gOG);let floorOG=false;
const gJN=new THREE.Group(),gJW=new THREE.Group(),gJE=new THREE.Group(),gJS=new THREE.Group();gOG.add(gJN,gJW,gJE,gJS);
const ogB=(x0,x1,y0,y1,z0,z1,m,g)=>B(x0,x1,OGF+y0,OGF+y1,z0,z1,m,g||gOG);
// ---- Janinas Zimmer (über dem Wohnzimmer) ----
const JX0=0,JX1=W,JZ0=0,JZ1=D;
{const t=ftA.clone();t.needsUpdate=true;t.center.set(0.5,0.5);t.rotation=Math.PI/2;t.repeat.set((JZ1-JZ0)/2.4,(JX1-JX0)/2.4);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(JX1-JX0,JZ1-JZ0),new THREE.MeshStandardMaterial({map:t,roughness:0.42}));m.rotation.x=-Math.PI/2;m.position.set((JX0+JX1)/2,OGF+0.002,(JZ0+JZ1)/2);m.userData.noShadow=1;gOG.add(m);}
ogB(JX0-0.38,JX1+0.18,-0.3,-0.015,JZ0-0.38,JZ1+0.18,M('#F4F2EC',0.9));
// Nordwand mit Sprossenfenster
const jn0=1.07,jn1=2.87,jy0=0.95,jy1=2.2;
ogB(JX0-0.38,jn0,0,OGH,JZ0-0.38,JZ0,wallMat,gJN);ogB(jn1,JX1+0.18,0,OGH,JZ0-0.38,JZ0,wallMat,gJN);ogB(jn0,jn1,0,jy0,JZ0-0.38,JZ0,wallMat,gJN);ogB(jn0,jn1,jy1,OGH,JZ0-0.38,JZ0,wallMat,gJN);
win({ax:'z',f:JZ0,s:-1,a0:jn0,a1:jn1,y0:OGF+jy0,y1:OGF+jy1,g:gJN,rows:[0.53],noBox:1});stulp('z',gJN,JZ0,-1,jn0,jn1,OGF+jy0,OGF+jy1,true);
ogB(jn0-0.1,jn1+0.1,jy1+0.04,jy1+0.3,JZ0,JZ0+0.2,white,gJN);
// Westwand mit Fenster zum Holzbalkon
const jw0=1.6,jw1=2.45,jch=1.36;
ogB(JX0-0.38,JX0,0,OGH,JZ0,jw0,wallMat,gJW);ogB(JX0-0.38,JX0,0,OGH,jw1,JZ1,wallMat,gJW);ogB(JX0-0.38,JX0,0,jy0,jw0,jw1,wallMat,gJW);ogB(JX0-0.38,JX0,jy1,OGH,jw0,jw1,wallMat,gJW);
win({ax:'x',f:JX0,s:-1,a0:jw0,a1:jw1,y0:OGF+jy0,y1:OGF+jy1,g:gJW,rows:[0.34,0.67],noBox:1});stulp('x',gJW,JX0,-1,jw0,jw1,OGF+jy0,OGF+jy1,false);
ogB(JX0,JX0+0.2,jy1+0.04,jy1+0.3,jw0-0.1,jw1+0.1,white,gJW);
// Ost- und Südwand (Tür im Süden, Ostteil)
ogB(JX1,JX1+0.18,0,OGH,JZ0,JZ1,wallMat,gJE);
const jd0=2.95,jd1=3.8;ogB(JX0-0.38,jd0,0,OGH,JZ1,JZ1+0.18,wallMat,gJS);ogB(jd1,JX1+0.18,0,OGH,JZ1,JZ1+0.18,wallMat,gJS);ogB(jd0,jd1,2.05,OGH,JZ1,JZ1+0.18,wallMat,gJS);
[[jd0-0.06,jd0],[jd1,jd1+0.06]].forEach(([a,b])=>ogB(a,b,0,2.06,JZ1-0.01,JZ1+0.19,white,gJS));ogB(jd0-0.06,jd1+0.06,2.03,2.09,JZ1-0.01,JZ1+0.19,white,gJS);
(function(){const pv=new THREE.Group();pv.position.set(jd1,OGF,JZ1-0.03);gOG.add(pv);const P=[];P.push(B(-(jd1-jd0),0,0,2.03,-0.02,0.02,white,pv));stripDoor(m=>P.push(m),pv,-(jd1-jd0)*0.62,-(jd1-jd0)*0.48,0.42,1.88,0);
  {const lb=new THREE.Mesh(new THREE.PlaneGeometry(0.42,0.3),new THREE.MeshStandardMaterial({map:canvasTex(256,180,(x,w,h)=>{x.fillStyle='#F4F2EE';x.fillRect(0,0,w,h);x.fillStyle='rgba(120,170,220,0.5)';for(let i=0;i<60;i++)x.fillRect(rnd()*w,rnd()*h,8,2);x.font='bold 64px cursive';x.fillStyle='#D04A6A';x.fillText('Janina',22,112);}),roughness:0.8}));lb.position.set(-(jd1-jd0)*0.55,1.98,-0.025);lb.rotation.y=Math.PI;pv.add(lb);}
  const hm=M('#C8CCD0',0.25,{metalness:0.8});P.push(B(-(jd1-jd0)+0.05,-(jd1-jd0)+0.08,0.98,1.06,-0.08,-0.04,hm,pv));P.push(B(-(jd1-jd0)+0.05,-(jd1-jd0)+0.18,1.02,1.045,-0.1,-0.07,hm,pv));
  const sw=swing(pv,'y',-1.35);sw.target=sw.open;pv.rotation.y=sw.open;clickable(P,tog(sw));})();
// Sockelleisten + Heizkörper unter dem Nordfenster
ogB(JX0,JX1,0,0.07,JZ0,JZ0+0.012,white);ogB(JX1-0.012,JX1,0,0.07,JZ0,JZ1,white);ogB(JX0,JX0+0.012,0,0.07,JZ0,JZ1,white);
ogB(jn0+0.05,jn1-0.05,0.2,0.8,JZ0+0.05,JZ0+0.13,white);for(let x=jn0+0.08;x<jn1-0.07;x+=0.035)ogB(x,x+0.012,0.22,0.78,JZ0+0.13,JZ0+0.14,white);
ogB(JX0+0.05,JX0+0.13,0.2,0.75,jw0+0.05,jw1-0.05,white);
// Hochbett an der Südwand mit Leiter, Schreibtisch darunter
const beech=M('#D9A86A',0.55),lb0=0.05,lb1=2.1,lbz0=JZ1-1.0,lbz1=JZ1-0.03,lbh=1.45;
[[lb0,lbz0],[lb1-0.07,lbz0],[lb0,lbz1-0.07],[lb1-0.07,lbz1-0.07]].forEach(([x,z])=>ogB(x,x+0.07,0,lbh+0.45,z,z+0.07,beech));
ogB(lb0,lb1,lbh-0.12,lbh,lbz0,lbz1,beech);ogB(lb0+0.05,lb1-0.05,lbh,lbh+0.16,lbz0+0.05,lbz1-0.05,M('#C8203A',0.85));
ogB(lb0+0.1,lb0+0.7,lbh+0.16,lbh+0.32,lbz0+0.1,lbz1-0.1,M('#B01830',0.9));
{const my=OGF+lbh+0.16,bz=(lbz0+lbz1)/2;const wb=M('#F2EEE4',0.95),gr=M('#8A8A88',0.95),br=M('#A8703A',0.9);
 gOG.add(blob(lb0+1.15,my+0.16,bz+0.1,0.16,0.17,0.13,wb));gOG.add(blob(lb0+1.15,my+0.38,bz+0.12,0.11,0.1,0.1,wb));[-0.07,0.07].forEach(d=>gOG.add(blob(lb0+1.15+d,my+0.47,bz+0.12,0.035,0.035,0.03,wb)));gOG.add(blob(lb0+1.15,my+0.36,bz+0.03,0.035,0.03,0.03,M('#B88A6A',0.9)));
 gOG.add(blob(lb0+0.85,my+0.1,bz-0.05,0.2,0.1,0.09,gr));gOG.add(blob(lb0+0.7,my+0.17,bz-0.08,0.08,0.08,0.07,gr));
 gOG.add(blob(lb0+1.45,my+0.08,bz-0.05,0.14,0.08,0.07,br));gOG.add(blob(lb0+1.4,my+0.17,bz-0.1,0.06,0.06,0.05,br));
 gOG.add(blob(lb0+1.0,my+0.08,bz-0.15,0.04,0.12,0.03,M('#D8504A',0.9)));}
[0.1,0.25,0.4].forEach(dy=>ogB(lb0,lb1-0.45,lbh+dy,lbh+dy+0.08,lbz0,lbz0+0.04,beech));[0.1,0.25,0.4].forEach(dy=>ogB(lb0,lb0+0.04,lbh+dy,lbh+dy+0.08,lbz0,lbz1,beech));
(function(){const L=Math.hypot(lbh+0.1,0.55),ang=Math.atan2(0.55,lbh+0.1);[lb1-0.47,lb1-0.08].forEach(x=>{const r=new THREE.Mesh(new THREE.BoxGeometry(0.06,L,0.09),beech);r.position.set(x,OGF+(lbh+0.1)/2,lbz0-0.3);r.rotation.x=-ang;gOG.add(r);});
  for(let k=1;k<5;k++){const f=k/5,y=OGF+f*(lbh+0.1),z=lbz0-0.55*(1-f)-0.02;const st=B(lb1-0.47,lb1-0.08,y-0.02,y+0.02,z-0.06,z+0.06,beech,gOG);}})();
ogB(lb0+0.1,lb0+1.2,0.72,0.75,lbz0+0.15,lbz1-0.05,white);ogB(lb0+0.12,lb0+0.32,0,0.72,lbz0+0.2,lbz1-0.1,M('#D8C8A8',0.7));
ogB(lb0+1.25,lb0+1.7,0,0.65,lbz0+0.3,lbz1-0.08,M('#D9AE78',0.55));for(let k=0;k<4;k++)ogB(lb0+1.27,lb0+1.68,0.06+k*0.15,0.07+k*0.15,lbz0+0.295,lbz0+0.3,M('#B88A58',0.6));
ogB(lb0+0.3,lb0+1.1,0.001,0.03,lbz0-0.1,lbz0+0.6,M('#9A2A5A',0.9));
// Kleiderschrank (weiße Glastüren) in der Nordwestecke + Regal
ogB(JX0+0.02,JX0+0.62,0,2.15,JZ0+0.05,JZ0+1.0,M('#D9AE78',0.55));ogB(JX0+0.62,JX0+0.64,0.06,2.1,JZ0+0.08,JZ0+0.52,M('#E2EBEE',0.15));ogB(JX0+0.62,JX0+0.64,0.06,2.1,JZ0+0.53,JZ0+0.97,M('#E2EBEE',0.15));
{const al=M('#B8BCC0',0.3,{metalness:0.6});[[0.06,0.1],[0.49,0.56],[0.93,0.97]].forEach(([a,b])=>ogB(JX0+0.635,JX0+0.66,0.06,2.1,JZ0+a,JZ0+b,al));ogB(JX0+0.635,JX0+0.66,0.06,0.1,JZ0+0.06,JZ0+0.97,al);ogB(JX0+0.635,JX0+0.66,2.06,2.1,JZ0+0.06,JZ0+0.97,al);
 [[0.22,0.3],[0.66,0.74]].forEach(([a,b])=>[[1.1,1.16],[1.0,1.06]].forEach(([y0,y1])=>{ogB(JX0+0.645,JX0+0.65,y0,y1,JZ0+a,JZ0+a+0.05,M('#C84060',0.4));ogB(JX0+0.645,JX0+0.65,y0,y1,JZ0+b-0.03,JZ0+b+0.02,M('#3A7AB8',0.4));}));}
ogB(JX0+0.02,JX0+0.36,0,1.1,JZ0+1.02,JZ0+1.32,M('#D9AE78',0.55));[0.35,0.7].forEach(y=>ogB(JX0+0.02,JX0+0.36,y,y+0.02,JZ0+1.02,JZ0+1.32,M('#C89A62',0.6)));
// Stuhl am Westfenster
ogB(JX0+0.35,JX0+0.75,0.44,0.48,jch+0.05,jch+0.45,M('#8A5A30',0.6));[[0.37,0.07],[0.71,0.07],[0.37,0.41],[0.71,0.41]].forEach(([dx,dz])=>ogB(JX0+dx,JX0+dx+0.03,0,0.44,jch+dz-0.02,jch+dz+0.01,M('#8A5A30',0.6)));ogB(JX0+0.35,JX0+0.39,0.44,0.95,jch+0.05,jch+0.45,M('#8A5A30',0.6));
// Sideboard + Regal + Glasschrank an der Ostwand
const sbx=JX1-0.45;ogB(sbx,JX1,0,0.78,0.75,1.9,M('#D9AE78',0.55));ogB(sbx-0.005,sbx,0.03,0.75,0.77,1.32,M('#CFA470',0.55));
for(let k=0;k<4;k++){ogB(sbx-0.006,sbx,0.05+k*0.18,0.2+k*0.18,1.34,1.88,M('#CFA470',0.55));ogB(sbx-0.03,sbx-0.006,0.12+k*0.18,0.135+k*0.18,1.55,1.67,M('#C8CCD0',0.3,{metalness:0.8}));}
ogB(sbx,JX1,0,0.9,0.3,0.74,M('#D9AE78',0.55));ogB(sbx,JX1,0.78,1.35,0.75,1.25,M('#D9AE78',0.55));ogB(sbx-0.005,sbx,0.82,1.31,0.79,1.21,M('#C8CCD0',0.3,{metalness:0.6}));
gOG.add(deco(blob(JX1-0.22,OGF+1.5,1.0,0.3,0.2,0.3,M('#5E9A3A',0.7))));
// Bilder an der Ostwand, Uhr an der Nordwand
const jpic=(x0,x1,y0,y1,z0,z1,c)=>ogB(x0,x1,y0,y1,z0,z1,M(c,0.6));
jpic(JX1-0.02,JX1,1.45,1.95,1.6,2.0,'#E8B830');jpic(JX1-0.02,JX1,1.6,1.82,0.95,1.2,'#D8603A');jpic(JX1-0.02,JX1,1.55,1.7,2.25,2.37,'#7AA0C8');
cyl(3.45,JZ0+0.02,0.14,OGF+1.9,0.03,M('#5AB8E0',0.4),24,gOG);
// Turnmatte (rund) + Vertikaltuch von der Decke
const jcx=1.95,jcz=1.55;cyl(jcx,jcz,0.85,OGF,0.1,M('#B83A4A',0.7),40,gOG);ogB(jcx-0.85,jcx+0.85,0.1,0.102,jcz-0.008,jcz+0.008,M('#8A2A34',0.8));ogB(jcx-0.008,jcx+0.008,0.1,0.102,jcz-0.85,jcz+0.85,M('#8A2A34',0.8));
const silkT=canvasTex(128,512,(x,w,h)=>{x.fillStyle='#F6E8DC';x.fillRect(0,0,w,h);for(let i=0;i<40;i++){const c=['rgba(230,40,90,0.45)','rgba(250,170,60,0.4)','rgba(240,90,120,0.35)','rgba(250,220,120,0.4)'][i%4];x.fillStyle=c;x.beginPath();x.ellipse(rnd()*w,rnd()*h,10+rnd()*30,20+rnd()*60,0,0,Math.PI*2);x.fill();}});
const silkM=new THREE.MeshStandardMaterial({map:silkT,roughness:0.8,side:THREE.DoubleSide});
{const g=new THREE.CylinderGeometry(0.04,0.11,OGH-0.6,14,1,true);const m=new THREE.Mesh(g,silkM);m.position.set(jcx,OGF+0.25+(OGH-0.6)/2,jcz);gOG.add(m);
 const pool=new THREE.Mesh(new THREE.SphereGeometry(0.25,16,8),silkM);pool.scale.set(1.3,0.35,0.9);pool.position.set(jcx+0.1,OGF+0.17,jcz+0.05);gOG.add(pool);
 for(let k=0;k<3;k++){const lk=new THREE.Mesh(new THREE.TorusGeometry(0.035,0.01,6,12),M('#222',0.4,{metalness:0.6}));lk.position.set(jcx,OGF+OGH-0.08-k*0.06,jcz);lk.rotation.y=k*Math.PI/2;gOG.add(lk);}}
cyl(jcx+0.4,jcz-0.2,0.2,OGF+OGH-0.03,0.03,new THREE.MeshStandardMaterial({color:col('#FFFFFF'),emissive:col('#FFF6E0'),emissiveIntensity:0.4}),28,gOG);
// Pflanzen + Sterne am Nordfenster
[[2.0,'#3A6AB8'],[2.3,'#F4F4F4'],[2.75,'#F4F4F4']].forEach(([x,c])=>{cyl(x,JZ0+0.1,0.07,OGF+jy0,0.14,M(c,0.5),12,gOG);gOG.add(deco(blob(x,OGF+jy0+0.25,JZ0+0.1,0.13,0.18,0.1,M('#4E8A3A',0.7))));});
[[2.2,1.95,'#F2A830'],[2.9,1.85,'#E8503A'],[2.5,2.05,'#F2C840']].forEach(([x,y,c])=>{const st=new THREE.Mesh(new THREE.CircleGeometry(0.08,5),M(c,0.5));st.position.set(x,OGF+y,JZ0+0.25);gOG.add(st);});
const jl=new THREE.PointLight(col('#FFF4E0'),0.5,6,2);jl.position.set(1.95,OGF+2.2,1.7);gOG.add(jl);
const jLab=label('Janinas Zimmer',1.95,OGF+2.75,1.77);

// ---- Wichtelzimmer (über dem Schlafzimmer) ----
const KX0w=W+T,KX1w=RX1,KZ0w=0,KZ1w=RZ1;const gWN=new THREE.Group(),gWE=new THREE.Group(),gWS=new THREE.Group();gOG.add(gWN,gWE,gWS);
{const t=ftA.clone();t.needsUpdate=true;t.center.set(0.5,0.5);t.rotation=Math.PI/2;t.repeat.set((KZ1w-KZ0w)/2.4,(KX1w-KX0w)/2.4);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(KX1w-KX0w,KZ1w-KZ0w),new THREE.MeshStandardMaterial({map:t,roughness:0.42}));m.rotation.x=-Math.PI/2;m.position.set((KX0w+KX1w)/2,OGF+0.002,(KZ0w+KZ1w)/2);m.userData.noShadow=1;gOG.add(m);}
ogB(KX0w,KX1w+0.38,-0.3,-0.015,KZ0w-0.38,KZ1w+0.18,M('#F4F2EC',0.9));
// Nordwand mit Fenster (Rollladen halb unten)
ogB(KX0w,nw0,0,OGH,KZ0w-0.38,KZ0w,wallMat,gWN);ogB(nw1,KX1w+0.38,0,OGH,KZ0w-0.38,KZ0w,wallMat,gWN);ogB(nw0,nw1,0,jy0,KZ0w-0.38,KZ0w,wallMat,gWN);ogB(nw0,nw1,jy1,OGH,KZ0w-0.38,KZ0w,wallMat,gWN);
win({ax:'z',f:KZ0w,s:-1,a0:nw0,a1:nw1,y0:OGF+jy0,y1:OGF+jy1,g:gWN,rows:[0.53],noBox:1});stulp('z',gWN,KZ0w,-1,nw0,nw1,OGF+jy0,OGF+jy1,true);
const shutM=M('#7E8486',0.5);ogB(nw0+0.05,nw1-0.05,jy0+0.75,jy1,KZ0w-0.27,KZ0w-0.255,shutM,gWN);ogB(nw0-0.15,nw1+0.15,jy1+0.02,OGH-0.02,KZ0w,KZ0w+0.24,white,gWN);
// Ostwand mit Fenster und Vorhängen
ogB(KX1w,KX1w+0.38,0,OGH,KZ0w,ew0,wallMat,gWE);ogB(KX1w,KX1w+0.38,0,OGH,ew1,KZ1w+0.18,wallMat,gWE);ogB(KX1w,KX1w+0.38,0,jy0,ew0,ew1,wallMat,gWE);ogB(KX1w,KX1w+0.38,jy1,OGH,ew0,ew1,wallMat,gWE);
win({ax:'x',f:KX1w,s:1,a0:ew0,a1:ew1,y0:OGF+jy0,y1:OGF+jy1,g:gWE,rows:[0.55],noBox:1});stulp('x',gWE,KX1w,1,ew0,ew1,OGF+jy0,OGF+jy1,true);
ogB(KX1w+0.255,KX1w+0.27,jy0+0.25,jy1,ew0+0.05,ew1-0.05,shutM,gWE);ogB(KX1w-0.24,KX1w,jy1+0.02,OGH-0.02,ew0-0.15,ew1+0.15,white,gWE);
cyl(KX1w-0.12,(ew0+ew1)/2,0.012,OGF+jy1+0.05,0.01,white,6,gWE);ogB(KX1w-0.13,KX1w-0.11,jy1+0.02,jy1+0.04,ew0-0.12,ew1+0.12,white,gWE);
{const cm=new THREE.MeshStandardMaterial({color:col('#F4E8D0'),roughness:0.95,side:THREE.DoubleSide,transparent:true,opacity:0.92});
 [[ew0-0.1,ew0+0.62],[ew1-0.62,ew1+0.1]].forEach(([a,b])=>{for(let k=0;k<6;k++){const w=(b-a)/6,pl=new THREE.Mesh(new THREE.PlaneGeometry(w*1.2,jy1-0.05),cm);pl.position.set(KX1w-0.12+(k%2?0.03:-0.03),OGF+(jy1+0.05)/2,a+w*(k+0.5));pl.rotation.y=Math.PI/2+(k%2?0.4:-0.4);gWE.add(pl);}});}
// Südwand mit Tür (geht nach innen auf)
const wd0=4.2,wd1=5.0;ogB(KX0w,wd0,0,OGH,KZ1w,KZ1w+0.18,wallMat,gWS);ogB(wd1,KX1w+0.38,0,OGH,KZ1w,KZ1w+0.18,wallMat,gWS);ogB(wd0,wd1,2.05,OGH,KZ1w,KZ1w+0.18,wallMat,gWS);
[[wd0-0.06,wd0],[wd1,wd1+0.06]].forEach(([a,b])=>ogB(a,b,0,2.06,KZ1w-0.01,KZ1w+0.19,white,gWS));ogB(wd0-0.06,wd1+0.06,2.03,2.09,KZ1w-0.01,KZ1w+0.19,white,gWS);
(function(){const pv=new THREE.Group();pv.position.set(wd1,OGF,KZ1w-0.01);gOG.add(pv);const P=[];P.push(B(-(wd1-wd0),0,0,2.03,-0.04,0,white,pv));stripDoor(m=>P.push(m),pv,-(wd1-wd0)*0.62,-(wd1-wd0)*0.48,0.42,1.88,0,0.022);
  const hm=M('#E8E8E8',0.3);P.push(B(-(wd1-wd0)+0.05,-(wd1-wd0)+0.08,0.98,1.06,-0.08,-0.04,hm,pv));P.push(B(-(wd1-wd0)+0.05,-(wd1-wd0)+0.18,1.02,1.045,-0.1,-0.07,hm,pv));
  const sw=swing(pv,'y',-1.35);clickable(P,tog(sw));})();
ogB(KX0w,KX1w,0,0.07,KZ0w,KZ0w+0.012,white);ogB(KX1w-0.012,KX1w,0,0.07,KZ0w,KZ1w,white);ogB(KX0w,KX0w+0.012,0,0.07,KZ0w,KZ1w,white);
// Heizkörper unter Nordfenster
ogB(nw0+0.05,nw1-0.05,0.2,0.8,KZ0w+0.05,KZ0w+0.13,white);for(let x=nw0+0.08;x<nw1-0.07;x+=0.035)ogB(x,x+0.012,0.22,0.78,KZ0w+0.13,KZ0w+0.14,white);
// Weißer Kleiderschrank (Falttüren mit Milchglasquadraten) an der Westwand
const wwx=KX0w+0.62,w1wz0=0.45,w1wz1=2.05;ogB(KX0w+0.02,wwx,0,2.1,w1wz0,w1wz1,M('#F6F6F4',0.4));
for(let k=0;k<4;k++){const a=w1wz0+k*(w1wz1-w1wz0)/4;ogB(wwx,wwx+0.02,0.03,2.07,a+0.005,a+(w1wz1-w1wz0)/4-0.005,M('#FAFAF8',0.35));if(k==1||k==2)[0.45,1.05,1.65].forEach(y=>ogB(wwx+0.02,wwx+0.023,y,y+0.3,a+0.1,a+0.3,M('#BCC4C8',0.2)));}
[[w1wz0+0.38],[w1wz0+1.2]].forEach(([z])=>ogB(wwx+0.02,wwx+0.04,0.85,1.3,z,z+0.02,M('#C8CCD0',0.25,{metalness:0.8})));
[[0.0,'#DCD8CC'],[0.3,'#DCD8CC']].forEach(([y,c])=>ogB(KX0w+0.05,KX0w+0.5,y,y+0.28,w1wz1+0.05,w1wz1+0.45,M(c,0.8)));
ogB(KX0w,KX0w+0.012,1.3,1.95,w1wz1+0.08,w1wz1+0.45,M('#F2D84A',0.6));ogB(KX0w,KX0w+0.012,1.95,2.25,w1wz1+0.1,w1wz1+0.4,M('#F2A8C0',0.6));
for(let z=w1wz0+0.1;z<w1wz1;z+=0.35)ogB(KX0w+0.1,KX0w+0.4,2.1,2.25,z,z+0.3,M('#E4EEF2',0.3,{transparent:true,opacity:0.8}));
// Spiegel + Luftreiniger an der Nordwand
ogB(4.3,4.62,0.45,1.75,KZ0w,KZ0w+0.03,M('#E8E2D8',0.7));ogB(4.34,4.58,0.5,1.7,KZ0w+0.03,KZ0w+0.032,M('#DCE8EE',0.08,{metalness:0.25}));
ogB(4.68,4.95,0,0.62,KZ0w+0.12,KZ0w+0.36,M('#F8F8F8',0.35));ogB(4.68,4.95,0.6,0.63,KZ0w+0.12,KZ0w+0.36,M('#2A2A2A',0.4));
// Meerschweinchenkäfige + Decke
const wire=new THREE.MeshStandardMaterial({color:col('#E8E8E8'),wireframe:true});
ogB(5.0,6.2,0,0.15,KZ0w+0.15,KZ0w+0.72,M('#2A3A8A',0.5));{const c=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.32,0.57,12,4,6),wire);c.position.set(5.6,OGF+0.31,KZ0w+0.435);gOG.add(c);}
ogB(5.03,6.17,0.15,0.17,KZ0w+0.18,KZ0w+0.69,M('#C8A870',0.95));ogB(5.6,5.9,0.17,0.32,KZ0w+0.3,KZ0w+0.55,M('#8A6A48',0.8));
ogB(6.25,6.95,0,0.12,KZ0w+0.15,KZ0w+1.4,M('#1E7A78',0.5));{const c=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.42,1.25,6,4,10),wire);c.position.set(6.6,OGF+0.21,KZ0w+0.775);gOG.add(c);}
ogB(6.28,6.92,0.12,0.14,KZ0w+0.18,KZ0w+1.37,M('#C8A870',0.95));ogB(6.4,6.75,0.14,0.36,KZ0w+0.75,KZ0w+1.05,M('#EDE6D8',0.8));
ogB(5.0,5.9,0.002,0.012,KZ0w+0.9,KZ0w+1.65,M('#F4A8C0',0.9));{const tu=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.11,0.3,16,1,true),new THREE.MeshStandardMaterial({color:col('#F4B0C8'),side:THREE.DoubleSide}));tu.rotation.z=Math.PI/2;tu.position.set(5.6,OGF+0.12,KZ0w+1.3);gOG.add(tu);}
// Weiße Kommode + Laterne + Bilder an der Nordwand (Ostecke)
ogB(7.05,8.0,0,0.8,KZ0w+0.02,KZ0w+0.5,M('#F6F6F2',0.4));[0.18,0.48].forEach(y=>{ogB(7.1,7.95,y,y+0.28,KZ0w+0.5,KZ0w+0.51,M('#F0F0EC',0.4));[7.3,7.75].forEach(x=>cyl(x,KZ0w+0.52,0.02,OGF+y+0.13,0.02,M('#222',0.4),8,gOG));});
ogB(7.75,7.9,0.8,1.1,KZ0w+0.15,KZ0w+0.3,M('#F2F2EE',0.5));ogB(7.6,7.85,1.3,1.65,KZ0w,KZ0w+0.01,M('#9CC8D8',0.7));ogB(7.95,8.2,1.3,1.65,KZ0w,KZ0w+0.01,M('#F0E0D0',0.7));
// zwei Stühle vor dem Ostfenster
ogB(7.95,8.35,0.44,0.48,ew0+0.05,ew0+0.45,M('#D8B888',0.6));ogB(8.31,8.35,0.44,0.95,ew0+0.05,ew0+0.45,M('#D8B888',0.6));[[7.97,0.07],[8.31,0.07],[7.97,0.41],[8.31,0.41]].forEach(([x,dz])=>ogB(x,x+0.03,0,0.44,ew0+dz-0.02,ew0+dz+0.01,M('#D8B888',0.6)));
cyl(8.15,ew0+0.95,0.2,OGF+0.44,0.04,M('#C8A060',0.6),16,gOG);ogB(8.32,8.35,0.46,1.0,ew0+0.8,ew0+1.1,M('#C8A060',0.6));[[-0.13,-0.13],[0.13,-0.13],[-0.13,0.13],[0.13,0.13]].forEach(([dx,dz])=>cyl(8.15+dx,ew0+0.95+dz,0.012,OGF,0.44,M('#C8A060',0.6),6,gOG));
// Weißes Etagenbett an der Südwand, Leiter am Ostende
const bw=M('#F6F4EE',0.5),w1bx0=5.75,w1bx1=7.85,w1bz0=KZ1w-0.98,bz1=KZ1w-0.03;
[[w1bx0,w1bz0],[w1bx1-0.07,w1bz0],[w1bx0,bz1-0.07],[w1bx1-0.07,bz1-0.07]].forEach(([x,z])=>ogB(x,x+0.07,0,1.95,z,z+0.07,bw));
[0.22,1.32].forEach(y=>ogB(w1bx0,w1bx1,y,y+0.15,w1bz0,bz1,bw));ogB(w1bx0+0.07,w1bx1-0.07,0.37,0.5,w1bz0+0.03,bz1-0.03,M('#A8A8AC',0.9));ogB(w1bx0+0.07,w1bx1-0.07,1.47,1.6,w1bz0+0.03,bz1-0.03,M('#9CC83A',0.8));
ogB(w1bx0,w1bx1-0.45,1.6,1.8,w1bz0,w1bz0+0.04,bw);ogB(w1bx0,w1bx0+0.05,0.5,1.32,w1bz0,bz1,bw);ogB(w1bx0,w1bx0+0.05,1.6,1.95,w1bz0,bz1,bw);ogB(w1bx1-0.05,w1bx1,1.6,1.95,w1bz0,bz1,bw);
ogB(w1bx1-0.42,w1bx1-0.37,0,1.95,w1bz0-0.12,w1bz0-0.06,bw);ogB(w1bx1-0.07,w1bx1-0.02,0,1.95,w1bz0-0.12,w1bz0-0.06,bw);for(let k=1;k<6;k++)ogB(w1bx1-0.4,w1bx1-0.04,k*0.3,k*0.3+0.04,w1bz0-0.12,w1bz0-0.06,bw);
gOG.add(blob(w1bx0+0.9,OGF+0.6,(w1bz0+bz1)/2,0.45,0.09,0.28,M('#F49090',0.9)));gOG.add(blob(w1bx0+0.35,OGF+0.6,bz1-0.25,0.12,0.12,0.1,M('#F2EEE4',0.95)));gOG.add(blob(w1bx0+0.55,OGF+0.6,bz1-0.2,0.1,0.1,0.09,M('#7A5030',0.9)));
ogB(w1bx0+0.06,w1bx0+0.2,0.9,0.92,w1bz0+0.1,bz1-0.1,bw);ogB(w1bx0+0.02,w1bx0+0.06,0.5,1.3,w1bz0+0.2,bz1-0.1,M('#D9AE78',0.55));
// Nachttisch + Stoffbox
ogB(w1bx0-0.5,w1bx0-0.03,0,0.68,bz1-0.5,bz1,M('#F2F0EA',0.5));ogB(w1bx0-0.45,w1bx0-0.15,0.68,0.73,bz1-0.4,bz1-0.15,M('#3A8A4A',0.6));
ogB(w1bx0-0.5,w1bx0-0.05,0,0.36,w1bz0+0.0,w1bz0+0.42,M('#E2DCCC',0.85));
// Deckenleuchte
cyl(6.3,1.7,0.18,OGF+OGH-0.03,0.03,new THREE.MeshStandardMaterial({color:col('#FFFFFF'),emissive:col('#FFF6E0'),emissiveIntensity:0.4}),28,gOG);
const wl2=new THREE.PointLight(col('#FFF4E0'),0.5,6,2);wl2.position.set(6.3,OGF+2.2,1.7);gOG.add(wl2);
const wLab=label('Wichtelzimmer',6.3,OGF+2.75,1.7);



// ---- Lesezimmer + Wintergarten/Bastelzimmer (über dem Esszimmer) ----
const GX0=XW,GX1=-0.1,LX0=0.08,LX1=XE,LZ0o=Z0,LZ1o=S,WGH=2.3;
const gGW=new THREE.Group(),gGS=new THREE.Group(),gGN=new THREE.Group(),gLS=new THREE.Group(),gLE=new THREE.Group(),gGC=new THREE.Group();gOG.add(gGW,gGS,gGN,gLS,gLE,gGC);
ogB(XW-RV2,HX0,-0.3,-0.015,JZ1,S+0.38,M('#F4F2EC',0.9));
B(HX0,HX1,U1-0.25,U1-0.015,JZ1+0.18,U1Z-1.3,M('#F4F1EA',0.9),gOG);
{const t=ftA.clone();t.needsUpdate=true;t.center.set(0.5,0.5);t.rotation=Math.PI/2;t.repeat.set((LZ1o-LZ0o)/2.4,(LX1-LX0)/2.4);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(LX1-LX0,LZ1o-LZ0o),new THREE.MeshStandardMaterial({map:t,roughness:0.42}));m.rotation.x=-Math.PI/2;m.position.set((LX0+LX1)/2,OGF+0.002,(LZ0o+LZ1o)/2);m.userData.noShadow=1;gOG.add(m);
 const t2=ftA.clone();t2.needsUpdate=true;t2.center.set(0.5,0.5);t2.rotation=Math.PI/2;t2.repeat.set((U1Z-1.3-JZ1)/2.4,(HX1-HX0)/2.4);
 const m2=new THREE.Mesh(new THREE.PlaneGeometry(HX1-HX0,U1Z-1.3-JZ1-0.18),new THREE.MeshStandardMaterial({map:t2,roughness:0.42}));m2.rotation.x=-Math.PI/2;m2.position.set((HX0+HX1)/2,OGF+0.003,(JZ1+0.18+U1Z-1.3)/2);gOG.add(m2);}
const terra=canvasTex(256,256,(x,w,h)=>{for(let i=0;i<4;i++)for(let j=0;j<4;j++){const v=rnd();x.fillStyle=`rgb(${165+v*30},${120+v*25},${85+v*20})`;x.fillRect(i*64,j*64,64,64);for(let k=0;k<30;k++){x.fillStyle=`rgba(${90+rnd()*60},${60+rnd()*40},40,0.25)`;x.fillRect(i*64+rnd()*60,j*64+rnd()*60,3+rnd()*8,2+rnd()*5);}}x.strokeStyle='rgba(70,55,45,0.7)';x.lineWidth=2;for(let k=0;k<=256;k+=64){x.beginPath();x.moveTo(k,0);x.lineTo(k,256);x.stroke();x.beginPath();x.moveTo(0,k);x.lineTo(256,k);x.stroke();}},[1,1]);
{const t=terra.clone();t.needsUpdate=true;t.repeat.set((GX1-GX0)/1.2,(LZ1o-LZ0o)/1.2);const m=new THREE.Mesh(new THREE.PlaneGeometry(GX1-GX0,LZ1o-LZ0o),new THREE.MeshStandardMaterial({map:t,roughness:0.5}));m.rotation.x=-Math.PI/2;m.position.set((GX0+GX1)/2,OGF+0.002,(LZ0o+LZ1o)/2);gOG.add(m);}
// Holzfenster (dunkelbraun) mit Jalousie
const darkW=M('#5A2A18',0.45),blindT=canvasTex(64,128,(x,w,h)=>{x.fillStyle='#E8E8E6';x.fillRect(0,0,w,h);for(let y=0;y<h;y+=8){x.fillStyle='rgba(120,120,120,0.55)';x.fillRect(0,y,w,1.5);}},[1,1]);
function wgWin(o){const g=o.g,f=o.f,sg=o.s;const P=(a,b,y0,y1,d0,d1,m)=>{const e0=f+sg*d0,e1=f+sg*d1,lo=Math.min(e0,e1),hi=Math.max(e0,e1);return o.ax==='z'?B(a,b,OGF+y0,OGF+y1,lo,hi,m,g):B(lo,hi,OGF+y0,OGF+y1,a,b,m,g);};
  const {a0,a1,y0,y1}=o,fw=0.07;P(a0,a1,y0,y0+fw,0.08,0.2,darkW);P(a0,a1,y1-fw,y1,0.08,0.2,darkW);P(a0,a0+fw,y0,y1,0.08,0.2,darkW);P(a1-fw,a1,y0,y1,0.08,0.2,darkW);
  P(a0+fw,a1-fw,y0+fw,y1-fw,0.14,0.145,glass);
  (o.cols||[]).forEach(t=>{const a=a0+fw+(a1-a0-2*fw)*t;P(a-0.012,a+0.012,y0+fw,y1-fw,0.12,0.14,darkW);});(o.rows||[]).forEach(t=>{const y=y0+fw+(y1-y0-2*fw)*t;P(a0+fw,a1-fw,y-0.012,y+0.012,0.12,0.14,darkW);});
  const hm=M('#D8D8D2',0.3,{metalness:0.6});const ha=o.hl?a0+fw+0.04:a1-fw-0.06;P(ha,ha+0.025,(y0+y1)/2-0.06,(y0+y1)/2+0.08,0.04,0.08,hm);
  P(a0-0.03,a1+0.03,y0-0.03,y0,-0.08,0.12,white);P(a0-0.05,a1+0.05,y1+0.05,y1+0.13,-0.07,0.02,M('#B8BCBE',0.4,{metalness:0.4}));
  if(o.blind){const bt=blindT.clone();bt.needsUpdate=true;bt.wrapS=bt.wrapT=THREE.RepeatWrapping;bt.repeat.set(1,o.blind*(y1-y0)/0.25);const bm=new THREE.MeshStandardMaterial({map:bt,roughness:0.6,side:THREE.DoubleSide});const bh=o.blind*(y1-y0);
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(a1-a0,bh),bm);const d=f+sg*-0.04;if(o.ax==='z'){pl.position.set((a0+a1)/2,OGF+y1-bh/2,d);}else{pl.position.set(d,OGF+y1-bh/2,(a0+a1)/2);pl.rotation.y=Math.PI/2;}g.add(pl);}}
function wallWins(ax,f,s,a0,a1,wins,y0,y1,th,g,mat,top){mat=mat||wallMat;top=top||OGH;const P=(a,b,ya,yb)=>{const lo=Math.min(f,f+s*th),hi=Math.max(f,f+s*th);return ax==='z'?ogB(a,b,ya,yb,lo,hi,mat,g):ogB(lo,hi,ya,yb,a,b,mat,g);};
  let c=a0;wins.forEach(([w0,w1])=>{P(c,w0,0,top);P(w0,w1,0,y0);P(w0,w1,y1,top);c=w1;});P(c,a1,0,top);}
const wy0=0.9,wy1=2.12;
// Westwand (lang): drei Fenster
const wwW=[[3.95,5.1],[5.35,6.5],[6.75,7.9]];wallWins('x',GX0,-1,LZ0o-0.3,LZ1o+0.3,wwW,wy0,wy1,RV2,gGW,null,WGH);
wwW.forEach(([a,b],i)=>wgWin({ax:'x',f:GX0,s:-1,a0:a,a1:b,y0:wy0,y1:wy1,g:gGW,cols:[0.34,0.67],rows:[0.34,0.67],blind:0.3,hl:false}));
// Nord- und Südende: je zwei schmale Fenster
const enW=[[GX0+0.12,GX0+0.82],[GX0+1.0,GX0+1.72]];
wallWins('z',LZ0o,-1,GX0-RV2,GX1,enW,wy0,wy1,0.3,gGN,null,WGH);enW.forEach(([a,b],i)=>wgWin({ax:'z',f:LZ0o,s:-1,a0:a,a1:b,y0:wy0,y1:wy1,g:gGN,blind:0.6,hl:i==0}));
wallWins('z',LZ1o,1,GX0-RV2,GX1,enW,wy0,wy1,0.3,gGS,null,WGH);enW.forEach(([a,b],i)=>wgWin({ax:'z',f:LZ1o,s:1,a0:a,a1:b,y0:wy0,y1:wy1,g:gGS,blind:0,hl:i==0}));
// dunkle Holzverkleidung außen
const cladT=canvasTex(128,128,(x,w,h)=>{x.fillStyle='#4A2818';x.fillRect(0,0,w,h);for(let i=0;i<w;i+=16){x.fillStyle='rgba(20,10,5,0.6)';x.fillRect(i,0,2,h);}},[6,1]);const cladM=new THREE.MeshStandardMaterial({map:cladT,roughness:0.6});
ogB(GX0-RV2-0.02,GX0-RV2,0,wy0-0.03,LZ0o-0.32,LZ1o+0.32,cladM,gGW);ogB(GX0-RV2-0.02,GX0-RV2,wy1+0.13,WGH+0.2,LZ0o-0.32,LZ1o+0.32,cladM,gGW);
ogB(GX0-RV2-0.02,GX1,0,wy0-0.03,LZ1o+0.3,LZ1o+0.32,cladM,gGS);ogB(GX0-RV2-0.02,GX1,wy1+0.13,WGH+0.2,LZ1o+0.3,LZ1o+0.32,cladM,gGS);
ogB(GX0-RV2-0.02,GX1,0,wy0-0.03,LZ0o-0.32,LZ0o-0.3,cladM,gGN);ogB(GX0-RV2-0.02,GX1,wy1+0.13,WGH+0.2,LZ0o-0.32,LZ0o-0.3,cladM,gGN);
ogB(GX0-RV2-0.05,GX1+0.05,WGH+0.2,WGH+0.3,LZ0o-0.35,LZ1o+0.35,M('#3A2014',0.6),gGC);
// weiße Holzpaneeldecke (nur von innen)
const panT=canvasTex(64,256,(x,w,h)=>{x.fillStyle='#F6F6F2';x.fillRect(0,0,w,h);x.fillStyle='rgba(150,150,145,0.6)';for(let i=0;i<w;i+=10)x.fillRect(i,0,1,h);},[1,1]);
{const t=panT.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4,1);const m=new THREE.Mesh(new THREE.PlaneGeometry(GX1-GX0,LZ1o-LZ0o),new THREE.MeshStandardMaterial({map:t,roughness:0.6,side:THREE.DoubleSide}));m.rotation.x=Math.PI/2;m.position.set((GX0+GX1)/2,OGF+WGH,(LZ0o+LZ1o)/2);gGC.add(m);}
// Trennwand Lesezimmer/Wintergarten mit Glastür
const gd0=6.2,gd1=7.2;ogB(GX1,LX0,0,OGH,LZ0o,gd0,wallMat);ogB(GX1,LX0,0,OGH,gd1,LZ1o,wallMat);ogB(GX1,LX0,2.05,OGH,gd0,gd1,wallMat);
[[gd0-0.05,gd0],[gd1,gd1+0.05]].forEach(([a,b])=>ogB(GX1-0.01,LX0+0.01,0,2.07,a,b,white));ogB(GX1-0.01,LX0+0.01,2.03,2.08,gd0-0.05,gd1+0.05,white);
(function(){const pv=new THREE.Group();pv.position.set(LX0+0.01,OGF,gd1);gOG.add(pv);const P=[];
  P.push(B(0,0.04,0,2.03,-(gd1-gd0),-(gd1-gd0)+0.07,white,pv));P.push(B(0,0.04,0,2.03,-0.07,0,white,pv));P.push(B(0,0.04,0,0.12,-(gd1-gd0),0,white,pv));P.push(B(0,0.04,1.96,2.03,-(gd1-gd0),0,white,pv));
  P.push(B(0.015,0.025,0.12,1.96,-(gd1-gd0)+0.07,-0.07,glass,pv));P.push(B(0.04,0.08,0.98,1.02,-(gd1-gd0)+0.05,-(gd1-gd0)+0.17,M('#C8C8C8',0.3,{metalness:0.7}),pv));
  const sw=swing(pv,'y',-1.4);sw.target=sw.open;pv.rotation.y=sw.open;clickable(P,tog(sw));})();
// Lesezimmer: Südwand mit Fenster und blauen Vorhängen, Ostwand mit Tür zum Flur
const l1lw0=0.95,l1lw1=2.05;
ogB(LX0,l1lw0,0,OGH,LZ1o,LZ1o+0.38,wallMat,gLS);ogB(l1lw1,LX1+0.235,0,OGH,LZ1o,LZ1o+0.38,wallMat,gLS);ogB(l1lw0,l1lw1,0,0.85,LZ1o,LZ1o+0.38,wallMat,gLS);ogB(l1lw0,l1lw1,2.15,OGH,LZ1o,LZ1o+0.38,wallMat,gLS);
win({ax:'z',f:LZ1o,s:1,a0:l1lw0,a1:l1lw1,y0:OGF+0.85,y1:OGF+2.15,g:gLS,rows:[0.5],noBox:1});
ogB(l1lw0+0.05,l1lw1-0.05,0.18,0.75,LZ1o-0.13,LZ1o-0.05,white);for(let x=l1lw0+0.08;x<l1lw1-0.07;x+=0.035)ogB(x,x+0.012,0.2,0.73,LZ1o-0.14,LZ1o-0.13,white);
{const cuT=canvasTex(128,256,(x,w,h)=>{x.fillStyle='#A8C8E4';x.fillRect(0,0,w,h);for(let i=0;i<26;i++){const cx=rnd()*w,cy=rnd()*h;x.strokeStyle='rgba(40,60,110,0.6)';x.lineWidth=1;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+rnd()*20-10,cy+30);x.stroke();x.fillStyle='rgba(250,250,245,0.9)';x.beginPath();x.arc(cx,cy,5,0,Math.PI*2);x.fill();x.fillStyle='rgba(40,60,110,0.8)';x.beginPath();x.arc(cx,cy,1.6,0,Math.PI*2);x.fill();}},[1,1]);
 const cm=new THREE.MeshStandardMaterial({map:cuT,roughness:0.95,side:THREE.DoubleSide});
 [[l1lw0-0.15,l1lw0+0.3],[l1lw1-0.3,l1lw1+0.15]].forEach(([a,b])=>{for(let k=0;k<4;k++){const w=(b-a)/4,pl=new THREE.Mesh(new THREE.PlaneGeometry(w*1.2,1.35),cm);pl.position.set(a+w*(k+0.5),OGF+0.85+0.62,LZ1o-0.1+(k%2?0.03:-0.03));pl.rotation.y=(k%2?0.4:-0.4);gLS.add(pl);}});
 ogB(l1lw0-0.2,l1lw1+0.2,2.18,2.2,LZ1o-0.12,LZ1o-0.1,white,gLS);}
const hd0=3.85,hd1=4.7;ogB(LX1,HX0,0,OGH,LZ0o,hd0,wallMat,gLE);ogB(LX1,HX0,0,OGH,hd1,LZ1o,wallMat,gLE);ogB(LX1,HX0,2.05,OGH,hd0,hd1,wallMat,gLE);
[[hd0-0.05,hd0],[hd1,hd1+0.05]].forEach(([a,b])=>ogB(LX1-0.01,HX0+0.01,0,2.07,a,b,white,gLE));ogB(LX1-0.01,HX0+0.01,2.03,2.08,hd0-0.05,hd1+0.05,white,gLE);
(function(){const pv=new THREE.Group();pv.position.set(LX1-0.01,OGF,hd0);gOG.add(pv);const P=[];P.push(B(-0.04,0,0,2.03,0,hd1-hd0,white,pv));stripDoor(m=>P.push(m),pv,(hd1-hd0)*0.48,(hd1-hd0)*0.62,0.42,1.88,1,0.022);
  const hm=M('#E8E8E8',0.3);P.push(B(-0.08,-0.04,0.98,1.06,hd1-hd0-0.08,hd1-hd0-0.05,hm,pv));P.push(B(-0.1,-0.07,1.02,1.045,hd1-hd0-0.18,hd1-hd0-0.05,hm,pv));
  const sw=swing(pv,'y',-1.35);sw.target=sw.open;pv.rotation.y=sw.open;clickable(P,tog(sw));})();
ogB(LX0,LX1,0,0.07,LZ1o-0.012,LZ1o,white);ogB(LX1-0.012,LX1,0,0.07,LZ0o,LZ1o,white);ogB(LX0,LX0+0.012,0,0.07,LZ0o,LZ1o,white);
// Lesezimmer-Möbel: graues Sofa an der Ostwand, Bücherregale Nord + West, Korbtisch + Bürostuhl
const sofaG=M('#9A9894',0.9);ogB(LX1-0.9,LX1-0.02,0,0.42,4.9,6.95,sofaG);ogB(LX1-0.28,LX1-0.02,0.42,0.85,4.9,6.95,sofaG);ogB(LX1-0.9,LX1-0.02,0.42,0.62,4.9,5.12,sofaG);ogB(LX1-0.9,LX1-0.02,0.42,0.62,6.73,6.95,sofaG);
ogB(LX1-0.85,LX1-0.3,0.42,0.52,5.15,6.0,M('#A8A6A2',0.95));ogB(LX1-0.85,LX1-0.3,0.42,0.52,6.0,6.7,M('#A8A6A2',0.95));ogB(LX1-0.55,LX1-0.3,0.52,0.75,6.1,6.7,M('#8A1A2A',0.9));
cyl(LX1-0.6,6.85,0.05,OGF+0.62,0.12,M('#F4F2EC',0.4),12,gOG);
const shW=M('#F6F6F4',0.45);const bookC=['#C83A30','#3A6AB8','#E8B830','#4A9A5A','#E8E0D0','#8A3A6A','#E87A30','#2A4A8A'];
const shelf=(x0,x1,z0,z1,h,n)=>{const al=(x1-x0)>(z1-z0);ogB(x0,x1,0,h,z0,z0+0.02,shW);if(!al)ogB(x0,x1,0,h,z1-0.02,z1,shW);ogB(x0,x0+0.02,0,h,z0,z1,shW);if(al)ogB(x1-0.02,x1,0,h,z0,z1,shW);
  for(let k=0;k<n;k++){const y=0.08+k*(h-0.1)/(n-1);if(o2X(x0,x1,z0,z1))ogB(x0,x1,y,y+0.02,z0,z1,shW);else ogB(x0,x1,y,y+0.02,z0,z1,shW);
   if(k<n-1){const along=(x1-x0)>(z1-z0);const L=along?x1-x0:z1-z0;for(let q=0.03;q<L-0.05;q+=0.035+rnd()*0.02){const c=bookC[Math.floor(rnd()*8)],hh=0.17+rnd()*0.1;if(along)ogB(x0+q,x0+q+0.028,y+0.02,y+0.02+hh,z0+0.03,z1-0.06,M(c,0.7));else ogB(x0+0.03,x1-0.06,y+0.02,y+0.02+hh,z0+q,z0+q+0.028,M(c,0.7));}}}};
const o2X=()=>true;
// Nordregale: je 0,60 m breit (geschätzt, genaue Maße folgen) – enden bei x=LX0+1.67, damit die geöffnete Flurtür (Blatt reicht bis ca. LX0+1.80) frei bleibt
shelf(LX0+0.45,LX0+1.05,LZ0o,LZ0o+0.32,2.0,6);shelf(LX0+1.07,LX0+1.67,LZ0o,LZ0o+0.32,2.0,6);
shelf(LX0,LX0+0.32,LZ0o+0.35,LZ0o+1.15,2.15,6);shelf(LX0,LX0+0.32,LZ0o+1.17,LZ0o+1.97,2.15,6);
ogB(LX0+2.42,LX0+2.47,0,0.85,LZ0o+0.05,LZ0o+0.45,M('#222',0.5));
cyl(LX0+0.48,LZ1o-0.45,0.3,OGF+0.6,0.03,M('#B8885A',0.7),20,gOG);cyl(LX0+0.48,LZ1o-0.45,0.03,OGF,0.6,M('#B8885A',0.7),8,gOG);
cyl(LX0+0.95,LZ1o-0.8,0.3,OGF+0.05,0.02,M('#222',0.4),5,gOG);cyl(LX0+0.95,LZ1o-0.8,0.025,OGF+0.05,0.42,M('#222',0.4),8,gOG);ogB(LX0+0.75,LX0+1.15,0.45,0.52,LZ1o-1.0,LZ1o-0.6,M('#5A5A5A',0.8));ogB(LX0+0.75,LX0+1.15,0.52,0.95,LZ1o-0.62,LZ1o-0.58,M('#2A2A2A',0.7));
ogB(LX0,LX0+0.01,1.2,1.9,LZ1o-1.0,LZ1o-0.45,M('#F4F4F0',0.8));[0,1,2,3].forEach(i=>cyl(LX0+0.01,LZ1o-1.6+i*0.16,0.07,OGF+2.0,0.01,M(['#E86A8A','#4AB8C8','#F2C840','#7AC84A'][i],0.6),14,gOG));
ogB(LX1-0.01,LX1,1.4,2.0,5.4,6.2,M('#3A6AA8',0.6));
// Wintergarten-Möbel: Bastelschreibtisch NW, Regale an der Innenwand, Monstera, Heizkörper
const beechW=M('#D8A868',0.55);ogB(GX0+0.05,GX0+1.05,0.7,0.76,LZ0o+0.05,LZ0o+0.8,beechW);ogB(GX0+0.1,GX0+0.2,0,0.7,LZ0o+0.1,LZ0o+0.75,M('#9A9EA2',0.4,{metalness:0.5}));ogB(GX0+0.9,GX0+1.0,0,0.7,LZ0o+0.1,LZ0o+0.75,M('#9A9EA2',0.4,{metalness:0.5}));
[['#E84A8A',0.1],['#3A8AE8',0.06],['#F2C840',0.08],['#4AB84A',0.05]].forEach(([c,h],i)=>ogB(GX0+0.15+i*0.2,GX0+0.32+i*0.2,0.76,0.76+h,LZ0o+0.15+(i%2)*0.25,LZ0o+0.4+(i%2)*0.25,M(c,0.6)));
ogB(GX0+1.1,GX0+1.5,0.44,0.48,LZ0o+0.25,LZ0o+0.65,beechW);ogB(GX0+1.46,GX0+1.5,0.48,0.9,LZ0o+0.25,LZ0o+0.65,beechW);[[1.12,0.27],[1.46,0.27],[1.12,0.61],[1.46,0.61]].forEach(([dx,dz])=>ogB(GX0+dx,GX0+dx+0.03,0,0.44,LZ0o+dz,LZ0o+dz+0.03,beechW));
const lowSh=(z0,z1)=>{ogB(GX1-0.42,GX1,0,0.85,z0,z1,M('#D08A3A',0.55));for(let y of [0.3,0.58])ogB(GX1-0.42,GX1-0.4,y,y+0.02,z0+0.02,z1-0.02,M('#B87830',0.6));};lowSh(LZ0o+0.9,LZ0o+1.75);lowSh(LZ0o+1.77,LZ0o+2.6);
[['#E8E0D0',0.15],['#3A8AE8',0.12],['#E87A3A',0.1],['#7AC84A',0.08]].forEach(([c,h],i)=>ogB(GX1-0.38,GX1-0.1,0.85,0.85+h,LZ0o+1.0+i*0.4,LZ0o+1.3+i*0.4,M(c,0.6)));
{const gb=new THREE.Mesh(new THREE.SphereGeometry(0.1,16,10),M('#3A8AD8',0.4));gb.position.set(GX1-0.25,OGF+1.05,LZ0o+2.2);gOG.add(gb);}
ogB(GX1-0.36,GX1,0,1.9,LZ1o-1.25,LZ1o-0.4,M('#3A2A20',0.6));for(let k=0;k<5;k++){const y=0.05+k*0.42;ogB(GX1-0.36,GX1,y,y+0.02,LZ1o-1.25,LZ1o-0.4,M('#4A3A2E',0.6));if(k<4)for(let q=0;q<10;q++)ogB(GX1-0.3,GX1-0.05,y+0.02,y+0.22+rnd()*0.1,LZ1o-1.2+q*0.08,LZ1o-1.14+q*0.08,M(bookC[(k*3+q)%8],0.7));}
ogB(GX1-0.45,GX1-0.05,0,0.4,gd0-0.45,gd0-0.05,M('#F2A8B8',0.6));
cyl(GX0+0.45,LZ1o-0.45,0.22,OGF,0.38,M('#A8987A',0.8),18,gOG);cyl(GX0+0.45,LZ1o-0.45,0.015,OGF+0.38,1.9,M('#D8C090',0.6),6,gOG);
{const lm=new THREE.MeshStandardMaterial({color:col('#2E6A2A'),roughness:0.6,side:THREE.DoubleSide});for(let k=0;k<14;k++){const ang=k*2.4,r=0.12+rnd()*0.3,y=0.6+k*0.1;const lf=new THREE.Mesh(new THREE.CircleGeometry(0.16+rnd()*0.06,10),lm);lf.scale.set(1,0.8,1);lf.position.set(GX0+0.45+Math.cos(ang)*r,OGF+y,LZ1o-0.45+Math.sin(ang)*r);lf.rotation.set(-1.0+rnd()*0.8,ang,0.3);lf.userData.deco=1;gOG.add(lf);
 const st=new THREE.Mesh(new THREE.CylinderGeometry(0.006,0.006,r+0.1,4),M('#4A7A3A',0.6));st.position.set(GX0+0.45+Math.cos(ang)*r/2,OGF+y-0.05,LZ1o-0.45+Math.sin(ang)*r/2);st.rotation.z=Math.PI/2.6;st.rotation.y=-ang;gOG.add(st);}}
cyl(GX0+0.95,LZ1o-0.3,0.09,OGF,0.28,M('#2E4A34',0.5),12,gOG);
ogB(GX0+0.15,GX0+1.65,0.15,0.75,LZ1o-0.13,LZ1o-0.05,white);for(let x=GX0+0.18;x<GX0+1.63;x+=0.035)ogB(x,x+0.012,0.17,0.73,LZ1o-0.14,LZ1o-0.13,white);
ogB(GX1-0.5,GX1-0.1,0,0.3,gd1+0.05,gd1+0.4,M('#B88C5A',0.85));ogB(GX0+0.35,GX0+0.75,0,0.25,LZ0o+2.6,LZ0o+3.0,M('#C83A30',0.7));
const wgl=new THREE.PointLight(col('#FFF8EC'),0.5,6,2);wgl.position.set((GX0+GX1)/2,OGF+2.0,5.9);gOG.add(wgl);const lsl=new THREE.PointLight(col('#FFF4E0'),0.45,6,2);lsl.position.set(1.4,OGF+2.2,5.9);gOG.add(lsl);
const lLab=label('Lesezimmer',1.4,OGF+2.75,5.9),gLab=label('Bastelzimmer (Wintergarten)',(GX0+GX1)/2,OGF+2.75,5.9);


// ---- Treppenhaus oben: Wand mit Rundfenster über dem Podest, Dachbodentreppe ----
const RWX=exc,RWY=UE+0.6,RWR=0.34;
{const sh=new THREE.Shape();sh.moveTo(HX0-0.05,UE-0.2);sh.lineTo(EX+0.05,UE-0.2);sh.lineTo(EX+0.05,OGF+OGH);sh.lineTo(HX0-0.05,OGF+OGH);sh.lineTo(HX0-0.05,UE-0.2);
 const hole=new THREE.Path();hole.absarc(RWX,RWY,RWR+0.06,0,Math.PI*2,true);sh.holes.push(hole);
 const g=new THREE.ExtrudeGeometry(sh,{depth:0.3,bevelEnabled:false,curveSegments:40});const m=new THREE.Mesh(g,wallMat);m.position.z=HZ1;registerPaintableWall(m,g.groups.length||1);gUp.add(m);}
{const ring=new THREE.Mesh(new THREE.TorusGeometry(RWR+0.02,0.045,10,48),M('#F2F0EA',0.4));ring.position.set(RWX,RWY,HZ1+0.04);gUp.add(ring);
 const ring2=new THREE.Mesh(new THREE.TorusGeometry(RWR-0.03,0.022,8,48),M('#E8E6E0',0.4));ring2.position.set(RWX,RWY,HZ1+0.07);gUp.add(ring2);
 const rt=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#DCEAF0';x.fillRect(0,0,w,h);for(let i=0;i<700;i++){x.strokeStyle=`rgba(255,255,255,${0.3+rnd()*0.5})`;x.lineWidth=1.2;const px=rnd()*w,py=rnd()*h,a=rnd()*6.28,l=4+rnd()*10;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke();}});
 const gl=new THREE.Mesh(new THREE.CircleGeometry(RWR-0.03,40),new THREE.MeshStandardMaterial({map:rt,emissive:col('#CFE4F0'),emissiveIntensity:0.55,roughness:0.3,side:THREE.DoubleSide}));gl.position.set(RWX,RWY,HZ1+0.08);gUp.add(gl);
 [[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([a,b])=>{const cl=B(RWX+a*0.29-0.02,RWX+a*0.29+0.02,RWY+b*0.29-0.01,RWY+b*0.29+0.01,HZ1+0.06,HZ1+0.085,M('#D8D8D2',0.3,{metalness:0.6}),gUp);});}
// Stirn des Vorbaus (Unterzug) zum Treppenhaus
B(HX0,EX,UE-0.25,UE-0.2,HZ1-0.02,HZ1+0.3,M('#F2F0EA',0.6),gUp);
// Kinderbilder-Girlande an der Westwand
for(let k=0;k<8;k++){const z=U1Z-1.0+k*0.22,y=OGF+1.55-k*0.11;B(EX-0.006,EX,y-0.18,y,z,z+0.17,M(['#3A8AC8','#E8C040','#5AA84A','#E86A3A','#7AB8E8','#F2E0A0','#C84A6A','#4AA8A0'][k],0.7),gUp);}
// Dachbodentreppe (offene Kiefertreppe über dem zweiten Lauf, steigt nach Süden)
const pineM=M('#D8A868',0.55),NAT=13,ATR=OGH/13,ATS=0.16,ATZ0=4.35,AX0=HX0+0.005,AX1=HX0+0.86;
for(let i=0;i<NAT;i++){const z=ATZ0+i*ATS,y=OGF+ATR*(i+1);B(AX0+0.06,AX1-0.06,y-0.035,y,z,z+ATS+0.03,pineM,gUp);}
{const L=Math.hypot(NAT*ATS,NAT*ATR+0.3),ang=Math.atan2(NAT*ATR,NAT*ATS);[[AX0,AX0+0.06],[AX1-0.06,AX1]].forEach(([a,b])=>{const sb=new THREE.Mesh(new THREE.BoxGeometry(b-a,0.26,L),pineM);sb.position.set((a+b)/2,OGF+NAT*ATR/2+0.05,ATZ0+NAT*ATS/2);sb.rotation.x=-ang;gUp.add(sb);});
 const hr=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.06,L),M('#C89050',0.5));hr.position.set(AX1-0.02,OGF+NAT*ATR/2+0.95,ATZ0+NAT*ATS/2);hr.rotation.x=-ang;gUp.add(hr);window.__atticRail=hr;
 B(AX1-0.05,AX1,OGF,OGF+1.05,ATZ0-0.04,ATZ0+0.02,M('#C89050',0.5),gUp);}
// Bodenluke + Gitarre oben

// OG-Flur: Wäschekorb, Strahler, Regal mit Drucker
B(HX0+0.3,HX0+0.85,OGF,OGF+0.32,U1Z-1.25,U1Z-0.85,M('#2A3A4A',0.6),gUp);
cyl(HX0+0.85,U1Z-1.1,0.06,OGF+OGH-0.05,0.04,M('#9AA0A4',0.3,{metalness:0.7}),12,gUp);B(HX0+0.6,HX0+1.1,OGF+OGH-0.03,OGF+OGH-0.01,U1Z-1.12,U1Z-1.08,M('#9AA0A4',0.3,{metalness:0.7}),gUp);


// ---- Au-pair-Zimmer (über der Küche) ----
const AUX0=KX0,AUX1=KX1,AUZ0=KZ0,AUZ1=KZ1;const gAW=new THREE.Group(),gAS=new THREE.Group(),gAE=new THREE.Group(),gAN=new THREE.Group();gOG.add(gAW,gAS,gAE,gAN);
{const t=ftA.clone();t.needsUpdate=true;t.center.set(0.5,0.5);t.rotation=Math.PI/2;t.repeat.set((AUZ1-AUZ0)/2.4,(AUX1-AUX0)/2.4);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(AUX1-AUX0,AUZ1-AUZ0),new THREE.MeshStandardMaterial({map:t,roughness:0.42}));m.rotation.x=-Math.PI/2;m.position.set((AUX0+AUX1)/2,OGF+0.002,(AUZ0+AUZ1)/2);m.userData.noShadow=1;gOG.add(m);}
ogB(EX,AUX1+0.38,-0.3,-0.015,AUZ0-0.12,AUZ1+0.38,M('#F4F2EC',0.9));
// Westwand zum Flur mit Tür (öffnet nach innen)
const ad0=AUZ0+0.4,ad1=AUZ0+1.25;
ogB(EX,AUX0,0,OGH,AUZ0-0.12,ad0,wallMat,gAW);ogB(EX,AUX0,0,OGH,ad1,AUZ1+0.38,wallMat,gAW);ogB(EX,AUX0,2.05,OGH,ad0,ad1,wallMat,gAW);
[[ad0-0.05,ad0],[ad1,ad1+0.05]].forEach(([a,b])=>ogB(EX-0.01,AUX0+0.01,0,2.07,a,b,white,gAW));ogB(EX-0.01,AUX0+0.01,2.03,2.08,ad0-0.05,ad1+0.05,white,gAW);
ogB(EX-0.012,EX,1.0,1.1,ad0-0.18,ad0-0.1,M('#F2EEDC',0.5),gAW);
(function(){const pv=new THREE.Group();pv.position.set(AUX0+0.01,OGF,ad1);gOG.add(pv);const P=[];P.push(B(-0.02,0.02,0,2.03,-(ad1-ad0),0,white,pv));stripDoor(m=>P.push(m),pv,-(ad1-ad0)*0.62,-(ad1-ad0)*0.48,0.42,1.88,1);
  const hm=M('#C4C8CC',0.25,{metalness:0.85});[-1,1].forEach(sd=>{P.push(B(sd*0.02,sd*0.05,1.025,1.045,-(ad1-ad0)+0.06,-(ad1-ad0)+0.18,hm,pv));});
  [[0.3,1.25,'#F2E04A'],[0.5,1.6,'#F4F0E8'],[0.45,1.45,'#E87A4A']].forEach(([dz,y,c],i)=>P.push(B(0.021,0.024,y,y+0.25,-(ad1-ad0)+0.05+i*0.02,-(ad1-ad0)+0.3,M(c,0.7),pv)));
  const sw=swing(pv,'y',-1.35);sw.target=sw.open;pv.rotation.y=sw.open;clickable(P,tog(sw));})();
// Nordwand (zum Bad) und Ostwand
ogB(AUX0,AUX1+0.38,0,OGH,AUZ0-0.12,AUZ0,wallMat,gAN);ogB(AUX1,AUX1+0.38,0,OGH,AUZ0,AUZ1+0.38,wallMat,gAE);
// Südwand mit Fenster, Rollladen, Heizkörper, Gardinen
const aw0=AUX1-1.0,aw1=AUX1-0.12;
ogB(AUX0,aw0,0,OGH,AUZ1,AUZ1+0.38,wallMat,gAS);ogB(aw1,AUX1+0.38,0,OGH,AUZ1,AUZ1+0.38,wallMat,gAS);ogB(aw0,aw1,0,0.9,AUZ1,AUZ1+0.38,wallMat,gAS);ogB(aw0,aw1,2.15,OGH,AUZ1,AUZ1+0.38,wallMat,gAS);
win({ax:'z',f:AUZ1,s:1,a0:aw0,a1:aw1,y0:OGF+0.9,y1:OGF+2.15,g:gAS,rows:[0.55],noBox:1});
ogB(aw0+0.05,aw1-0.05,1.4,2.15,AUZ1+0.255,AUZ1+0.27,M('#7E8486',0.5),gAS);ogB(aw0-0.1,aw1+0.1,2.17,OGH-0.02,AUZ1-0.2,AUZ1,white,gAS);
ogB(aw0+0.05,aw1-0.05,0.18,0.75,AUZ1-0.13,AUZ1-0.05,white);for(let x=aw0+0.08;x<aw1-0.07;x+=0.035)ogB(x,x+0.012,0.2,0.73,AUZ1-0.14,AUZ1-0.13,white);
{const cm=new THREE.MeshStandardMaterial({color:col('#FAF8F2'),roughness:0.95,side:THREE.DoubleSide,transparent:true,opacity:0.85});
 [[aw0-0.25,aw0+0.05],[aw1-0.05,aw1+0.25]].forEach(([a,b])=>{for(let k=0;k<3;k++){const w=(b-a)/3,pl=new THREE.Mesh(new THREE.PlaneGeometry(w*1.3,2.05),cm);pl.position.set(a+w*(k+0.5),OGF+1.07,AUZ1-0.12+(k%2?0.03:-0.03));pl.rotation.y=(k%2?0.4:-0.4);gAS.add(pl);}});}
ogB(aw0-0.35,aw0-0.1,1.4,1.85,AUZ1-0.012,AUZ1,M('#F4F0E8',0.6),gAS);ogB(aw0-0.33,aw0-0.12,1.45,1.8,AUZ1-0.016,AUZ1-0.012,M('#E8A0B0',0.6),gAS);
ogB(AUX0,AUX1,0,0.07,AUZ1-0.012,AUZ1,white);ogB(AUX1-0.012,AUX1,0,0.07,AUZ0,AUZ1,white);ogB(AUX0,AUX0+0.012,0,0.07,AUZ0,AUZ1,white);
// Weißer Kleiderschrank (Spiegeltür in der Mitte) an der Westwand
const wfx=AUX0+0.6,wfz0=AUZ1-2.15,wfz1=AUZ1-0.45,wfw=(wfz1-wfz0)/3;
ogB(AUX0+0.01,wfx,0,2.15,wfz0,wfz1,M('#F6F6F4',0.4));
const ws=M('#F8F8F6',0.35),wh=M('#B8BCC0',0.25,{metalness:0.85});
[0,2].forEach(k=>{const a=wfz0+k*wfw;ogB(wfx,wfx+0.02,0.72,2.12,a+0.005,a+wfw-0.005,ws);ogB(wfx,wfx+0.02,0.38,0.7,a+0.005,a+wfw-0.005,ws);ogB(wfx,wfx+0.02,0.04,0.36,a+0.005,a+wfw-0.005,ws);
  [0.52,0.2].forEach(y=>ogB(wfx+0.02,wfx+0.04,y,y+0.02,a+0.15,a+wfw-0.15,wh));ogB(wfx+0.02,wfx+0.04,1.2,1.55,k?a+0.05:a+wfw-0.07,k?a+0.07:a+wfw-0.05,wh);});
ogB(wfx,wfx+0.02,0.04,2.12,wfz0+wfw+0.005,wfz0+2*wfw-0.005,M('#F8F8F6',0.35));ogB(wfx+0.02,wfx+0.024,0.08,2.08,wfz0+wfw+0.05,wfz0+2*wfw-0.05,M('#DCE6EC',0.08,{metalness:0.3}));
ogB(wfx+0.021,wfx+0.023,1.7,1.95,wfz0+wfw*2+0.08,wfz0+wfw*3-0.12,M('#8A9A88',0.7));
ogB(AUX0+0.05,AUX0+0.45,0,0.6,wfz0-0.5,wfz0-0.1,M('#6A6C70',0.6));ogB(AUX0+0.1,AUX0+0.4,0.6,0.72,wfz0-0.45,wfz0-0.15,M('#2A2A2E',0.6));
// Bett an der Ostwand (rosa Bezug, geblümte Decke)
const bdx0=AUX1-1.45,bdz0=AUZ0+1.0,bdz1=AUZ0+3.0;ogB(bdx0,AUX1-0.03,0.12,0.42,bdz0,bdz1,M('#F2D8D4',0.9));[[bdx0+0.1,bdz0+0.1],[AUX1-0.15,bdz0+0.1],[bdx0+0.1,bdz1-0.15],[AUX1-0.15,bdz1-0.15]].forEach(([x,z])=>cyl(x,z,0.025,OGF,0.12,M('#B8BCC0',0.3,{metalness:0.6}),8,gOG));
ogB(bdx0+0.05,AUX1-0.08,0.42,0.47,bdz0+0.05,bdz1-0.5,M('#F4ECD8',0.9));ogB(bdx0+0.4,AUX1-0.08,0.42,0.5,bdz1-0.9,bdz1-0.1,M('#C8B0C8',0.9));
gOG.add(blob(AUX1-0.6,OGF+0.56,bdz1-0.25,0.35,0.08,0.18,M('#E8D8E0',0.9)));gOG.add(blob(AUX1-0.45,OGF+0.62,bdz1-0.3,0.22,0.07,0.15,M('#1E1E22',0.95)));
ogB(bdx0+0.5,bdx0+0.85,0.47,0.92,bdz0+0.3,bdz0+0.55,M('#2A4A7A',0.7));gOG.add(blob(bdx0+0.7,OGF+0.52,bdz1-1.2,0.35,0.05,0.2,M('#2E6A4A',0.85)));
// Runder Tisch, Rattanstuhl, Holzregal in der Nordostecke
cyl(AUX1-0.55,AUZ0+0.55,0.42,OGF+0.72,0.03,M('#C89A62',0.5),24,gOG);[[-0.2,-0.2],[0.2,-0.2],[-0.2,0.2],[0.2,0.2]].forEach(([dx,dz])=>cyl(AUX1-0.55+dx,AUZ0+0.55+dz,0.012,OGF,0.72,M('#6A6E72',0.4,{metalness:0.6}),6,gOG));
ogB(AUX1-0.85,AUX1-0.35,0.75,0.77,AUZ0+0.35,AUZ0+0.7,M('#2A2A2E',0.5));ogB(AUX1-0.95,AUX1-0.65,0.75,0.85,AUZ0+0.65,AUZ0+0.9,M('#B88C5A',0.8));
const rat=M('#D8B880',0.8);ogB(AUX1-1.25,AUX1-0.85,0.45,0.5,AUZ0+0.15,AUZ0+0.55,rat);ogB(AUX1-1.25,AUX1-0.85,0.5,1.0,AUZ0+0.12,AUZ0+0.16,rat);[[-1.23,0.17],[-0.88,0.17],[-1.23,0.52],[-0.88,0.52]].forEach(([dx,dz])=>ogB(AUX1+dx,AUX1+dx+0.025,0,0.45,AUZ0+dz,AUZ0+dz+0.025,M('#8A8C90',0.4,{metalness:0.6})));
ogB(AUX1-1.2,AUX1-0.9,0.9,1.0,AUZ0+0.2,AUZ0+0.35,M('#2050A8',0.8));
const shF=M('#C88A48',0.55);ogB(AUX1-2.2,AUX1-1.35,0,1.95,AUZ0+0.01,AUZ0+0.32,shF);for(let k=0;k<5;k++){const y=0.08+k*0.37;ogB(AUX1-2.18,AUX1-1.37,y,y+0.02,AUZ0+0.03,AUZ0+0.3,M('#B87838',0.6));if(k<4)for(let q=0;q<14;q++)ogB(AUX1-2.15+q*0.055,AUX1-2.11+q*0.055,y+0.02,y+0.2+rnd()*0.08,AUZ0+0.05,AUZ0+0.27,M(['#C83A30','#3A6AB8','#E8B830','#4A9A5A','#E8E0D0','#8A3A6A'][(k+q)%6],0.7));}
// Sterne an der Ostwand, Leselampe
[[bdz0+0.6,1.85,'#F2A040'],[bdz0+1.0,1.95,'#E84A3A'],[bdz0+0.8,1.5,'#C86A9A']].forEach(([z,y,c])=>{const st=new THREE.Mesh(new THREE.CircleGeometry(0.11,5),M(c,0.6));st.position.set(AUX1-0.012,OGF+y,z);st.rotation.y=-Math.PI/2;gOG.add(st);});
cyl(AUX1-0.15,AUZ0+0.3,0.03,OGF+1.5,0.02,M('#F4F4F4',0.4),8,gOG);
const aul=new THREE.PointLight(col('#FFF4E0'),0.5,6,2);aul.position.set((AUX0+AUX1)/2,OGF+2.2,(AUZ0+AUZ1)/2);gOG.add(aul);
const aLab=label('Au-pair-Zimmer',(AUX0+AUX1)/2,OGF+2.75,(AUZ0+AUZ1)/2);


// ---- Bad im Obergeschoss (über dem Bad unten) ----
const OBX0=KX0,OBX1=BX1,OBZ0=3.65,OBZ1=BZ1;const gOBE=new THREE.Group(),gOBW=new THREE.Group();gOG.add(gOBE,gOBW);
const obTile=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#F2F0EE';x.fillRect(0,0,w,h);for(let i=0;i<40;i++){x.strokeStyle='rgba(180,175,175,0.35)';x.lineWidth=1.5;x.beginPath();const px=rnd()*w,py=rnd()*h;x.moveTo(px,py);x.bezierCurveTo(px+20,py+10,px+30,py-10,px+60,py+5);x.stroke();}x.strokeStyle='rgba(150,150,150,0.8)';x.lineWidth=3;x.strokeRect(0,0,w,h);},[1,1]);
const obTileM=(w,h)=>{const t=obTile.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/0.25,h/0.33);return new THREE.MeshStandardMaterial({map:t,roughness:0.2});};
const pinkM=M('#F2BCD0',0.8);
function obPlane(ax,f,a0,a1,y0,y1,m,rot,g){const pl=new THREE.Mesh(new THREE.PlaneGeometry(a1-a0,y1-y0),m);if(ax==='z'){pl.position.set((a0+a1)/2,OGF+(y0+y1)/2,f);pl.rotation.y=rot;}else{pl.position.set(f,OGF+(y0+y1)/2,(a0+a1)/2);pl.rotation.y=rot;}(g||gOG).add(pl);return pl;}
ogB(EX,OBX1+0.38,-0.3,-0.015,OBZ0-0.06,OBZ1,M('#F4F2EC',0.9));
{const t=tileTex.clone();t.needsUpdate=true;t.repeat.set((OBX1-OBX0)/0.8,(OBZ1-OBZ0)/0.8);const m=new THREE.Mesh(new THREE.PlaneGeometry(OBX1-OBX0,OBZ1-OBZ0),new THREE.MeshStandardMaterial({map:t,roughness:0.3}));m.rotation.x=-Math.PI/2;m.position.set((OBX0+OBX1)/2,OGF+0.003,(OBZ0+OBZ1)/2);gOG.add(m);}
const TH2=2.0;
// Wandfliesen bis 2 m, darüber rosa; Bordüre
obPlane('z',OBZ0+0.003,OBX0,OBX1,0,TH2,obTileM(OBX1-OBX0,TH2),0);obPlane('z',OBZ0+0.003,OBX0,OBX1,TH2,OGH,pinkM,0);
obPlane('z',OBZ1-0.003,OBX0,OBX1,0,TH2,obTileM(OBX1-OBX0,TH2),Math.PI);obPlane('z',OBZ1-0.003,OBX0,OBX1,TH2,OGH,pinkM,Math.PI);
obPlane('x',OBX1-0.003,OBZ0,OBZ1,0,TH2,obTileM(OBZ1-OBZ0,TH2),-Math.PI/2);obPlane('x',OBX1-0.003,OBZ0,OBZ1,TH2,OGH,pinkM,-Math.PI/2);
ogB(OBX0,OBX1,1.62,1.68,OBZ0+0.004,OBZ0+0.008,M('#D8B8C8',0.4));ogB(OBX0,OBX1,1.62,1.68,OBZ1-0.008,OBZ1-0.004,M('#D8B8C8',0.4));ogB(OBX1-0.008,OBX1-0.004,1.62,1.68,OBZ0,OBZ1,M('#D8B8C8',0.4));
{const c=new THREE.Mesh(new THREE.PlaneGeometry(OBX1-OBX0,OBZ1-OBZ0),pinkM);c.rotation.x=Math.PI/2;c.position.set((OBX0+OBX1)/2,OGF+OGH-0.01,(OBZ0+OBZ1)/2);gOG.add(c);}
[OBX0+0.8,OBX0+1.5,OBX0+2.2].forEach(x=>cyl(x,(OBZ0+OBZ1)/2,0.05,OGF+OGH-0.02,0.01,new THREE.MeshStandardMaterial({color:col('#FFFFFF'),emissive:col('#FFF6E8'),emissiveIntensity:0.6}),14,gOG));
// Westwand zum Flur mit Tür
const bd0=OBZ0+0.12,bd1=OBZ0+0.92;
ogB(EX,OBX0,0,OGH,OBZ0-0.06,bd0,wallMat,gOBW);ogB(EX,OBX0,0,OGH,bd1,OBZ1,wallMat,gOBW);ogB(EX,OBX0,2.05,OGH,bd0,bd1,wallMat,gOBW);
[[bd0-0.05,bd0],[bd1,bd1+0.05]].forEach(([a,b])=>ogB(EX-0.01,OBX0+0.01,0,2.07,a,b,white,gOBW));ogB(EX-0.01,OBX0+0.01,2.03,2.08,bd0-0.05,bd1+0.05,white,gOBW);
obPlane('x',OBX0+0.003,bd1+0.05,OBZ1,0,TH2,obTileM(OBZ1-bd1,TH2),Math.PI/2);obPlane('x',OBX0+0.003,OBZ0,OBZ1,TH2,OGH,pinkM,Math.PI/2);obPlane('x',OBX0+0.003,OBZ0,bd0-0.05,0,TH2,obTileM(0.1,TH2),Math.PI/2);
(function(){const pv=new THREE.Group();pv.position.set(OBX0+0.01,OGF,bd1);gOG.add(pv);const P=[];P.push(B(-0.02,0.02,0,2.03,-(bd1-bd0),0,white,pv));stripDoor(m=>P.push(m),pv,-(bd1-bd0)*0.62,-(bd1-bd0)*0.48,1.55,1.88,1);
  const hm=M('#C4C8CC',0.25,{metalness:0.85});[-1,1].forEach(sd=>P.push(B(sd*0.02,sd*0.05,1.025,1.045,-(bd1-bd0)+0.06,-(bd1-bd0)+0.18,hm,pv)));
  const sw=swing(pv,'y',-1.3);sw.target=sw.open;pv.rotation.y=sw.open;clickable(P,tog(sw));})();
// Ostwand außen mit Fenster (dunkler Holzrahmen, Spitzengardine)
const obw0=OBZ0+0.3,obw1=OBZ0+0.95,oby0=1.05,oby1=1.95;
ogB(OBX1,OBX1+0.38,0,OGH,OBZ0-0.06,obw0,wallMat,gOBE);ogB(OBX1,OBX1+0.38,0,OGH,obw1,OBZ1,wallMat,gOBE);ogB(OBX1,OBX1+0.38,0,oby0,obw0,obw1,wallMat,gOBE);ogB(OBX1,OBX1+0.38,oby1,OGH,obw0,obw1,wallMat,gOBE);
wgWin({ax:'x',f:OBX1,s:1,a0:obw0,a1:obw1,y0:oby0,y1:oby1,g:gOBE});
{const lace=canvasTex(128,128,(x,w,h)=>{x.clearRect(0,0,w,h);x.fillStyle='rgba(255,255,255,0.55)';x.fillRect(0,0,w,h);x.strokeStyle='rgba(255,255,255,0.95)';x.lineWidth=2;for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.beginPath();x.arc(16+i*32,16+j*32,10,0,Math.PI*2);x.stroke();x.beginPath();x.arc(16+i*32,16+j*32,4,0,Math.PI*2);x.stroke();}});
 const lm=new THREE.MeshStandardMaterial({map:lace,transparent:true,roughness:0.9,side:THREE.DoubleSide});const pl=new THREE.Mesh(new THREE.PlaneGeometry(obw1-obw0-0.04,oby1-oby0-0.1),lm);pl.position.set(OBX1-0.02,OGF+(oby0+oby1)/2-0.03,(obw0+obw1)/2);pl.rotation.y=-Math.PI/2;gOBE.add(pl);}
ogB(OBX1-0.15,OBX1,oby0-0.03,oby0,obw0-0.25,obw1+0.05,obTileM(0.15,0.03),gOG);
// Badewanne an der Nordwand, Wannenverkleidung gefliest
const tbx0=OBX0+0.3,tbx1=OBX0+2.0,tbz1=OBZ0+0.75;
ogB(tbx0,tbx1,0,0.55,OBZ0,tbz1,obTileM(tbx1-tbx0,0.55));ogB(tbx0,tbx1,0.55,0.6,OBZ0,tbz1,M('#FAFAFA',0.15));ogB(tbx0+0.08,tbx1-0.08,0.3,0.601,OBZ0+0.08,tbz1-0.08,M('#E8ECEE',0.15));
cyl(tbx1-0.1,OBZ0+0.04,0.03,OGF+0.75,0.12,M('#D0D4D8',0.15,{metalness:0.9}),10,gOG);
ogB(tbx0+0.2,tbx0+0.25,1.0,2.0,OBZ0,OBZ0+0.04,M('#D0D4D8',0.15,{metalness:0.9}));
ogB(tbx0+0.5,tbx0+0.8,1.15,1.6,OBZ0,OBZ0+0.12,M('#F4F4F4',0.4));[['#3A8AD8'],['#E8B830'],['#F4F4F4']].forEach(([c],i)=>ogB(tbx0+0.52+i*0.09,tbx0+0.6+i*0.09,1.45,1.6,OBZ0+0.03,OBZ0+0.1,M(c,0.5)));
// Waschbecken + Spiegel, gemauerter Vorsprung
ogB(tbx1,tbx1+0.25,0,1.15,OBZ0,OBZ0+0.25,obTileM(0.25,1.15));ogB(tbx1+0.25,tbx1+0.9,0.82,0.92,OBZ0,OBZ0+0.45,M('#FAFAFA',0.15));ogB(tbx1+0.5,tbx1+0.6,0.4,0.82,OBZ0,OBZ0+0.08,M('#C8CCD0',0.2,{metalness:0.8}));
ogB(tbx1+0.3,tbx1+0.85,1.25,1.95,OBZ0,OBZ0+0.02,M('#D8E4EA',0.05,{metalness:0.5}));ogB(tbx1+0.3,tbx1+0.85,1.2,1.22,OBZ0,OBZ0+0.12,M('#F4F4F4',0.2));
ogB(tbx1+0.3,tbx1+0.75,0.35,0.9,OBZ0+0.47,OBZ0+0.49,M('#E85A9A',0.7));
// Handtuchheizkörper Südwand nahe Fenster, weißes Regal, Haken mit Handtüchern
ogB(OBX1-0.75,OBX1-0.25,0.3,1.75,OBZ1-0.07,OBZ1-0.02,white);for(let y=0.35;y<1.75;y+=0.08)ogB(OBX1-0.77,OBX1-0.23,y,y+0.025,OBZ1-0.08,OBZ1-0.02,white);
ogB(OBX1-0.6,OBX1-0.05,0,1.05,OBZ0+0.55,OBZ1-0.12,M('#FAFAFA',0.4));[0.3,0.65].forEach(y=>ogB(OBX1-0.58,OBX1-0.07,y,y+0.02,OBZ0+0.57,OBZ1-0.14,M('#F0F0F0',0.4)));ogB(OBX1-0.5,OBX1-0.15,0.32,0.5,OBZ0+0.6,OBZ1-0.2,M('#F2D030',0.6));
[[OBX0+0.9,'#B88A5A'],[OBX0+0.6,'#C8A8D8']].forEach(([x,c])=>{ogB(x,x+0.04,1.55,1.6,OBZ1-0.06,OBZ1-0.01,M('#C8CCD0',0.2,{metalness:0.8}));ogB(x-0.25,x+0.25,0.75,1.55,OBZ1-0.08,OBZ1-0.04,M(c,0.95));});
ogB(OBX1-1.0,OBX1-0.7,0,0.2,OBZ0+0.8,OBZ1-0.12,M('#FAFAFA',0.4));
ogB(OBX0+0.4,OBX0+1.8,0.003,0.015,tbz1+0.03,OBZ1-0.12,M('#E8C8C0',0.95));
const obl=new THREE.PointLight(col('#FFF4EC'),0.45,5,2);obl.position.set((OBX0+OBX1)/2,OGF+2.2,(OBZ0+OBZ1)/2);gOG.add(obl);
const obLab=label('Bad (OG)',(OBX0+OBX1)/2,OGF+2.75,(OBZ0+OBZ1)/2);
// ---- WC auf der Zwischentreppe (im Vorbau, östlich vom Podest) ----
const WCX0=EX+0.12,WCZ0=HZ1+0.3,WCZ1=EDZ;
B(EX,CL1,LY-0.03,LY-0.002,HZ1,EDZ,stairTop,gUp);B(EX,CL1,LY-0.2,LY-0.03,HZ1,HZ1+0.3,wallMat,gUp);B(EX,CL1+VWT,LY,UE,HZ1,HZ1+0.3,wallMat,gUp);
win({ax:'x',f:CX0,s:-1,a0:lpw0,a1:lpw1,y0:lpy0,y1:lpy1,g:gUp,sashes:1,rows:[],noBox:1});
{const L=LY,x0=CX0;
 B(x0,x0+0.16,lpy0-0.04,lpy0,lpw0-0.03,lpw1+0.03,white,gUp);B(x0,x0+0.14,lpy0-0.32,lpy0-0.04,lpw0-0.05,lpw1+0.15,M('#E8E6E0',0.6),gUp);
 // Netzwerk-/Telefonverteiler unter dem Fenster
 B(x0,x0+0.04,L+0.45,L+0.85,lpw0+0.02,lpw1-0.06,M('#DCDCD8',0.5),gUp);B(x0+0.04,x0+0.07,L+0.55,L+0.75,lpw0+0.06,lpw0+0.22,M('#2A2A2C',0.5),gUp);B(x0+0.04,x0+0.08,L+0.5,L+0.68,lpw0+0.3,lpw0+0.42,white,gUp);
 B(x0,x0+0.05,L+0.05,L+0.12,lpw0+0.15,lpw0+0.4,white,gUp);
 B(x0+0.16,x0+0.19,lpy0,lpy0+0.17,lpw0+0.15,lpw0+0.21,white,gUp);
 // Holzschrank mit Glastüren (Südseite)
 const oak=M('#D8BC8C',0.55),cg=M('#C8D2D0',0.25,{transparent:true,opacity:0.75});B(x0+0.02,x0+0.84,L,L+0.95,EDZ-0.4,EDZ-0.02,oak,gUp);
 [[0.06,0.43],[0.44,0.8]].forEach(([a,b])=>{B(x0+a,x0+b,L+0.06,L+0.9,EDZ-0.41,EDZ-0.4,cg,gUp);B(x0+a,x0+b,L+0.47,L+0.49,EDZ-0.42,EDZ-0.4,oak,gUp);});
 B(x0+0.3,x0+0.62,L+0.95,L+1.13,EDZ-0.35,EDZ-0.08,M('#F2F2F0',0.4),gUp);B(x0+0.33,x0+0.59,L+1.1,L+1.13,EDZ-0.36,EDZ-0.34,M('#2A2A2E',0.5),gUp);
 // weißer Wandvorsprung (Kabelkanal) neben dem Fenster, Traumfänger, Kinderbilder
 B(x0,x0+0.2,L,L+2.1,lpw0-0.2,lpw0-0.05,white,gUp);
 const dc=new THREE.Mesh(new THREE.TorusGeometry(0.3,0.008,6,40),M('#C8A070',0.5));dc.position.set(x0+0.25,L+1.95,lpw0-0.45);dc.rotation.y=Math.PI/2;deco(dc);gUp.add(dc);
 const net=new THREE.Mesh(new THREE.CircleGeometry(0.29,24),new THREE.MeshStandardMaterial({color:col('#7AB8D8'),wireframe:true}));net.position.copy(dc.position);net.rotation.y=Math.PI/2;deco(net);gUp.add(net);
 [['#E83A30',0.12],['#2A6AD8',0.08],['#F2C030',0.05]].forEach(([c,r])=>{const k=new THREE.Mesh(new THREE.CircleGeometry(r,16),M(c,0.6,{side:THREE.DoubleSide}));k.position.set(x0+0.24,L+1.95,lpw0-0.45);k.rotation.y=Math.PI/2;deco(k);gUp.add(k);});
 B(x0,x0+0.006,L+1.25,L+1.6,lpw0-1.0,lpw0-0.75,M('#5AB04A',0.7),gUp);B(x0,x0+0.008,L+1.3,L+1.48,lpw0-0.85,lpw0-0.75,M('#3A8AD8',0.6),gUp);B(x0,x0+0.006,L+1.15,L+1.45,lpw0-1.25,lpw0-1.02,M('#F4F4F0',0.7),gUp);}
const wcd0=WCZ0+0.08,wcd1=WCZ0+0.78;B(EX,WCX0,LY,UE,WCZ0,wcd0,wallMat,gUp);B(EX,WCX0,LY,UE,wcd1,WCZ1,wallMat,gUp);B(EX,WCX0,LY+2.03,UE,wcd0,wcd1,wallMat,gUp);
[[wcd0-0.05,wcd0],[wcd1,wcd1+0.05]].forEach(([a,b])=>B(EX-0.01,WCX0+0.01,LY,LY+2.05,a,b,white,gUp));B(EX-0.01,WCX0+0.01,LY+2.0,LY+2.06,wcd0-0.05,wcd1+0.05,white,gUp);
B(EX-0.012,EX,LY+1.05,LY+1.15,wcd0-0.18,wcd0-0.1,M('#F2EEDC',0.5),gUp);
(function(){const pv=new THREE.Group();pv.position.set(WCX0+0.01,LY,wcd0);gUp.add(pv);const P=[];P.push(B(-0.02,0.02,0,2.0,0,wcd1-wcd0,white,pv));stripDoor(m=>P.push(m),pv,(wcd1-wcd0)*0.38,(wcd1-wcd0)*0.52,0.42,1.85,1);
  const hm=M('#C4C8CC',0.25,{metalness:0.85});[-1,1].forEach(sd=>P.push(B(sd*0.02,sd*0.05,1.0,1.02,wcd1-wcd0-0.18,wcd1-wcd0-0.06,hm,pv)));
  const sw=swing(pv,'y',1.3);sw.target=sw.open;pv.rotation.y=sw.open;clickable(P,tog(sw));})();
{const t=ftA.clone();t.needsUpdate=true;t.center.set(0.5,0.5);t.rotation=Math.PI/2;t.repeat.set(0.4,0.8);const m=new THREE.Mesh(new THREE.PlaneGeometry(CL1-WCX0,WCZ1-WCZ0),new THREE.MeshStandardMaterial({map:t,roughness:0.42}));m.rotation.x=-Math.PI/2;m.position.set((WCX0+CL1)/2,LY+0.006,(WCZ0+WCZ1)/2);gUp.add(m);}
win({ax:'x',f:CL1,s:1,a0:wcw0,a1:wcw1,y0:wcy0,y1:wcy1,g:gUp,sashes:1,rows:[],frost:1,noBox:1});
B(CL1-0.42,CL1-0.02,LY,LY+0.4,(WCZ0+WCZ1)/2-0.18,(WCZ0+WCZ1)/2+0.18,M('#FAFAFA',0.2),gUp);B(CL1-0.45,CL1-0.04,LY+0.4,LY+0.43,(WCZ0+WCZ1)/2-0.19,(WCZ0+WCZ1)/2+0.19,M('#FFFFFF',0.25),gUp);
B(CL1-0.18,CL1-0.02,LY+0.43,LY+0.85,(WCZ0+WCZ1)/2-0.19,(WCZ0+WCZ1)/2+0.19,M('#F6F4EE',0.3),gUp);
B(CL1-0.5,CL1-0.2,LY+0.65,LY+0.8,WCZ1-0.32,WCZ1-0.01,M('#FAFAFA',0.2),gUp);B(CL1-0.38,CL1-0.36,LY+0.8,LY+1.0,WCZ1-0.05,WCZ1-0.03,M('#D0D4D8',0.15,{metalness:0.9}),gUp);
B(CL1-0.75,CL1-0.01,LY+0.6,LY+1.25,WCZ1-0.006,WCZ1,M('#EEEEEC',0.2),gUp);
cyl(CL1-0.9,WCZ1-0.04,0.08,LY+0.9,0.01,M('#D0D4D8',0.15,{metalness:0.9}),20,gUp);B(CL1-0.98,CL1-0.82,LY+0.6,LY+0.85,WCZ1-0.06,WCZ1-0.03,M('#E05A9A',0.9),gUp);
B(CL1-0.65,CL1-0.5,LY+0.75,LY+0.9,WCZ0,WCZ0+0.12,M('#F4F4F2',0.4),gUp);cyl(CL1-0.575,WCZ0+0.07,0.05,LY+0.68,0.1,M('#FFFFFF',0.6),12,gUp);
const wcl=new THREE.PointLight(col('#FFF6EA'),0.35,3,2);wcl.position.set((WCX0+CL1)/2,LY+1.9,(WCZ0+WCZ1)/2);gUp.add(wcl);
