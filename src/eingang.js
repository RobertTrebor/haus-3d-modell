// Eingang innen: Eingangstreppe, Windfang, Garderobe, Kellertreppe.
// ---- Treppe zum Hauseingang + Windfang ----
const EF=-0.68,NSD=4,SDT=0.25,EDZ=SD0+2.5,EWT=KONST.EWT,exc=(SDX+EX)/2;
const gVS=new THREE.Group();scene.add(gVS);
const stepWood=M('#C9955A',0.5),treadM=M('#55585C',0.95),panelWood=M('#5A3A22',0.55);
for(let i=0;i<NSD;i++){const z0=SD0+i*SDT,y=-(0.17*(i+1));B(SDX,EX,Math.max(-0.8,y-0.18),y,z0,z0+SDT,stepWood);
  const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.012,40,1,false,0,Math.PI),treadM);tr.scale.set(1,1,0.55);tr.rotation.y=Math.PI/2;tr.position.set(exc,y+0.006,z0+SDT-0.02);
  const tb=B(exc-0.42,exc+0.42,y,y+0.012,z0+0.02,z0+SDT-0.02,treadM);scene.add(tr);}
B(SDX,EX,-0.46,0,SD0-0.04,SD0,stepWood);
const entryTile=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#E3D9C6';x.fillRect(0,0,w,h);for(let i=0;i<8;i++)for(let j=0;j<8;j++){x.fillStyle=`rgba(${190+((i*7+j*3)%5)*6},${178+((i+j)%4)*5},${150+((i*3+j)%5)*5},0.55)`;x.fillRect(i*32+2,j*32+2,28,28);}x.strokeStyle='rgba(120,110,95,0.6)';x.lineWidth=2;for(let k=0;k<=256;k+=32){x.beginPath();x.moveTo(k,0);x.lineTo(k,256);x.stroke();x.beginPath();x.moveTo(0,k);x.lineTo(256,k);x.stroke();}},[1,1]);
const etz0=SD0+NSD*SDT;entryTile.repeat.set((EX-SDX)/0.8,(EDZ-etz0)/0.8);
const ef=new THREE.Mesh(new THREE.PlaneGeometry(EX-SDX,EDZ-etz0),new THREE.MeshStandardMaterial({map:entryTile,roughness:0.5}));ef.rotation.x=-Math.PI/2;ef.position.set(exc,EF+0.001,(etz0+EDZ)/2);ef.userData.noShadow=1;scene.add(ef);
B(SDX,EX,-0.8,EF,etz0,EDZ,M('#8C8A86',0.9));
B(exc-0.35,exc+0.35,EF+0.001,EF+0.012,EDZ-0.75,EDZ-0.3,M('#7A6A58',0.95));
// Seitenwände Grube + Windfang
B(EX,EX+ET,-0.8,0,SD0,HZ1,wallMat,gHE);
// Vorbau: außen KONST.VBA (4,10 m) und innen KONST.VBI (3,50 m) breit, beides gemessen; daraus die Dicke der Seitenwände VWT (30 cm)
const VWT=(KONST.VBA-KONST.VBI)/2,CX0=exc-KONST.VBI/2,CL0=EX+EWT,CL1=exc+KONST.VBI/2,CO0=8.45,CO1=9.15;
B(EX,EX+EWT,-0.8,LY,HZ1,CO0,wallMat,gHE);B(EX,EX+EWT,-0.8,LY,CO1,EDZ+EWT,wallMat,gHE);B(EX,EX+EWT,EF+1.95,LY,CO0,CO1,wallMat,gHE);
const gVR=new THREE.Group();scene.add(gVR);B(CX0,CL1,LY-0.2,LY-0.04,HZ1+EWT,EDZ,M('#F4F1EA',0.9),gVR);B(SDX,EX,LY-0.2,LY-0.04,HZ1,HZ1+EWT,M('#F4F1EA',0.9),gVR);
// Holzverkleidung unter der Treppe (Seite zum Eingang)
for(let i=0;i<NST;i++){const za=SU0+i*STR,zb=za+STR,top=SRI*(i+1)-0.03;if(zb<=SD0)B(SUX-0.02,SDX,0,top,za,zb,panelWood);else{if(za<SD0)B(SUX-0.02,SDX,0,top,za,SD0,panelWood);B(SUX-0.02,SDX,-0.8,top,Math.max(za,SD0),zb,panelWood);}}

// Haustür
const dW=0.95,dH=2.05,dx0=exc-dW/2,dx1=exc+dW/2;
B(SDX,dx0-0.06,EF,LY,EDZ,EDZ+EWT,wallMat,gVS);B(dx1+0.06,EX,EF,LY,EDZ,EDZ+EWT,wallMat,gVS);B(dx0-0.06,dx1+0.06,EF+dH+0.06,LY,EDZ,EDZ+EWT,wallMat,gVS);
const frameW=M('#8A5A2E',0.5);B(dx0-0.06,dx0,EF,EF+dH+0.06,EDZ-0.01,EDZ+0.08,frameW,gVS);B(dx1,dx1+0.06,EF,EF+dH+0.06,EDZ-0.01,EDZ+0.08,frameW,gVS);B(dx0-0.06,dx1+0.06,EF+dH,EF+dH+0.06,EDZ-0.01,EDZ+0.08,frameW,gVS);
B(dx0-0.08,dx1+0.08,EF-0.02,EF+0.01,EDZ-0.02,EDZ+EWT,M('#B8B2A6',0.6),gVS);
const doorTex=canvasTex(256,560,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'#9A6634');g.addColorStop(0.5,'#A87140');g.addColorStop(1,'#946030');x.fillStyle=g;x.fillRect(0,0,w,h);
  for(let i=0;i<70;i++){x.strokeStyle=`rgba(90,50,20,${0.08+rnd()*0.12})`;x.lineWidth=1+rnd()*2;const px=rnd()*w;x.beginPath();x.moveTo(px,0);x.bezierCurveTo(px+8,h/3,px-8,2*h/3,px+4,h);x.stroke();}
  const oct=(cx,cy,ww,hh,k)=>{x.beginPath();x.moveTo(cx-ww/2+k,cy-hh/2);x.lineTo(cx+ww/2-k,cy-hh/2);x.lineTo(cx+ww/2,cy-hh/2+k);x.lineTo(cx+ww/2,cy+hh/2-k);x.lineTo(cx+ww/2-k,cy+hh/2);x.lineTo(cx-ww/2+k,cy+hh/2);x.lineTo(cx-ww/2,cy+hh/2-k);x.lineTo(cx-ww/2,cy-hh/2+k);x.closePath();};
  [76,180].forEach(cx=>{oct(cx,160,84,264,20);x.fillStyle='rgba(70,40,15,0.55)';x.fill();oct(cx,160,78,258,18);x.fillStyle='#B07A44';x.fill();
    x.save();x.globalCompositeOperation='destination-out';oct(cx,160,70,250,16);x.fill();x.restore();
    oct(cx,440,64,110,14);x.lineWidth=6;x.strokeStyle='#6E4420';x.stroke();});
  x.fillStyle='rgba(60,35,12,0.35)';x.fillRect(0,0,w,6);x.fillRect(0,h-10,w,10);x.fillRect(0,0,6,h);x.fillRect(w-6,0,6,h);x.fillRect(0,318,w,4);},null);
const dMat=new THREE.MeshStandardMaterial({map:doorTex,roughness:0.55,alphaTest:0.5});
(function(){const pv=new THREE.Group();pv.position.set(dx1,EF,EDZ+0.035);scene.add(pv);const P=[];const a=m=>{P.push(m);return m;};
  const dOut=new THREE.MeshStandardMaterial({map:doorTex,color:col('#E8B888'),roughness:0.5,alphaTest:0.5});
  // Bleiverglasung (Rauten, Milchglas bernsteinfarben) in den achteckigen Fenstern
  {const lt=canvasTex(140,500,(x,w,h)=>{x.fillStyle='rgba(238,228,204,0.62)';x.fillRect(0,0,w,h);for(let i=0;i<300;i++){x.fillStyle=`rgba(255,255,255,${0.1+rnd()*0.2})`;x.fillRect(rnd()*w,rnd()*h,2+rnd()*4,1+rnd()*3);}
     x.strokeStyle='#3A3128';x.lineWidth=3.5;const st=46;for(let k=-h;k<w+h;k+=st){x.beginPath();x.moveTo(k,0);x.lineTo(k+h*0.33,h);x.stroke();x.beginPath();x.moveTo(k,0);x.lineTo(k-h*0.33,h);x.stroke();}
     x.lineWidth=5;x.beginPath();x.moveTo(w/2,0);x.lineTo(w/2,h);x.stroke();[0.2,0.5,0.8].forEach(t=>{x.beginPath();x.moveTo(0,h*t);x.lineTo(w,h*t);x.stroke();});
     x.fillStyle='rgba(200,150,70,0.55)';[0.35,0.65].forEach(t=>{x.beginPath();x.moveTo(w/2,h*t-24);x.lineTo(w/2+22,h*t);x.lineTo(w/2,h*t+24);x.lineTo(w/2-22,h*t);x.closePath();x.fill();x.stroke();});},null);
   const lm=new THREE.MeshStandardMaterial({map:lt,transparent:true,roughness:0.25,side:THREE.DoubleSide,depthWrite:false,emissive:col('#FFE9C0'),emissiveMap:lt,emissiveIntensity:0.25});
   const ow=0.26,oh=0.915,k=0.06,os=new THREE.Shape();os.moveTo(-ow/2+k,-oh/2);os.lineTo(ow/2-k,-oh/2);os.lineTo(ow/2,-oh/2+k);os.lineTo(ow/2,oh/2-k);os.lineTo(ow/2-k,oh/2);os.lineTo(-ow/2+k,oh/2);os.lineTo(-ow/2,oh/2-k);os.lineTo(-ow/2,-oh/2+k);os.lineTo(-ow/2+k,-oh/2);
   const og=new THREE.ShapeGeometry(os);const uv=og.attributes.uv,pp=og.attributes.position;for(let q=0;q<uv.count;q++)uv.setXY(q,pp.getX(q)/ow+0.5,pp.getY(q)/oh+0.5);
   [0.297,0.703].forEach(f=>{const gm=new THREE.Mesh(og,lm);gm.position.set(-dW+f*dW,dH*(1-160/560),0);pv.add(gm);P.push(gm);
     // profilierte Achteck-Füllung unten (erhaben, beidseitig)
     const pw=0.237,ph=0.403,pk=0.055,ps=new THREE.Shape();ps.moveTo(-pw/2+pk,-ph/2);ps.lineTo(pw/2-pk,-ph/2);ps.lineTo(pw/2,-ph/2+pk);ps.lineTo(pw/2,ph/2-pk);ps.lineTo(pw/2-pk,ph/2);ps.lineTo(-pw/2+pk,ph/2);ps.lineTo(-pw/2,ph/2-pk);ps.lineTo(-pw/2,-ph/2+pk);ps.lineTo(-pw/2+pk,-ph/2);
     const pg=new THREE.ExtrudeGeometry(ps,{depth:0.012,bevelEnabled:true,bevelSize:0.012,bevelThickness:0.008,bevelSegments:2});
     [[0.03,dOut],[-0.042,dMat]].forEach(([z,mm])=>{const pm=new THREE.Mesh(pg,new THREE.MeshStandardMaterial({color:mm===dOut?col('#C89060'):col('#9A6838'),roughness:0.5}));pm.position.set(-dW+f*dW,dH*(1-440/560),z);pv.add(pm);P.push(pm);});
     // Glasleisten
     [[0.031],[-0.034]].forEach(([z])=>{const rim=new THREE.Mesh(new THREE.ShapeGeometry(os),M('#8A5A2E',0.5));});});}a(B(-dW,0,0,dH,-0.03,0.03,[frameW,frameW,frameW,frameW,dOut,dMat],pv));
  {const bo=M('#B8903A',0.3,{metalness:0.8});a(B(-dW+0.045,-dW+0.095,0.88,1.26,0.03,0.04,bo,pv));{const kn=new THREE.Mesh(new THREE.SphereGeometry(0.035,16,10),bo);kn.position.set(-dW+0.07,1.15,0.08);pv.add(kn);a(kn);}a(B(-dW+0.064,-dW+0.076,1.13,1.17,0.04,0.075,bo,pv));{const cy2=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.012,12),M('#D8D4C8',0.3,{metalness:0.9}));cy2.rotation.x=Math.PI/2;cy2.position.set(-dW+0.07,0.97,0.046);pv.add(cy2);}}
  const brassH=M('#C8B07A',0.3,{metalness:0.75});a(B(-dW+0.05,-dW+0.075,0.95,1.2,-0.05,-0.03,brassH,pv));a(B(-dW+0.05,-dW+0.19,1.05,1.07,-0.08,-0.05,brassH,pv));a(B(-dW+0.05,-dW+0.075,0.95,1.2,0.03,0.05,brassH,pv));
  const d=swing(pv,'y',-1.5);clickable(P,tog(d));})();
// Bilder an der Wand links der Eingangstreppe
{const pics=[['#2E6A9A','#F2C840'],['#C84A3A','#F4E8D0'],['#4A8A4A','#E8D8B0'],['#8A5AA8','#F0D0A0']];
 pics.forEach(([c1,c2],i)=>{const t=canvasTex(128,160,(x,w,h)=>{x.fillStyle=c2;x.fillRect(0,0,w,h);for(let k=0;k<14;k++){x.fillStyle=k%2?c1:'rgba(255,255,255,0.6)';x.beginPath();x.ellipse(rnd()*w,rnd()*h,8+rnd()*22,6+rnd()*18,rnd()*3,0,6.3);x.fill();}},null);
   const z=SD0+0.35+i*0.52,y=0.9-i*0.14+0.2,wd=0.34,ht=0.44;B(EX-0.025,EX,y-ht/2-0.025,y+ht/2+0.025,z-wd/2-0.025,z+wd/2+0.025,M('#2A2420',0.5),gHE);
   const pl=new THREE.Mesh(new THREE.PlaneGeometry(wd,ht),new THREE.MeshStandardMaterial({map:t,roughness:0.7}));pl.rotation.y=-Math.PI/2;pl.position.set(EX-0.027,y,z);pl.userData.deco=1;gHE.add(pl);});}
// Schirmständer, Schuhablage, Schlüsselbrett, Türkette
cyl(dx0-0.25,EDZ-0.25,0.11,EF,0.5,M('#3A4A5A',0.5),18,gVS);[['#C83A3A',0.02],['#2A2A2E',-0.03]].forEach(([c,d])=>{const um=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.8,6),M(c,0.6));um.position.set(dx0-0.25+d,EF+0.55,EDZ-0.25+d);um.rotation.z=0.12;gVS.add(um);});
B(dx1+0.12,EX-0.05,EF,EF+0.04,EDZ-0.35,EDZ-0.05,M('#8A8C90',0.4,{metalness:0.5}),gVS);[[dx1+0.18,'#2A2A2E'],[dx1+0.32,'#7A4A2A']].forEach(([x,c])=>B(x,x+0.11,EF+0.04,EF+0.13,EDZ-0.32,EDZ-0.06,M(c,0.6),gVS));
B(EX-0.02,EX,EF+1.45,EF+1.6,EDZ-0.7,EDZ-0.4,M('#C89A62',0.5),gHE);[0,1,2,3].forEach(k=>B(EX-0.06,EX-0.02,EF+1.47,EF+1.49,EDZ-0.67+k*0.08,EDZ-0.66+k*0.08,M('#C8CCD0',0.3,{metalness:0.8}),gHE));
const eLampM=new THREE.MeshStandardMaterial({color:col('#FFF2D0'),emissive:col('#FFD58A'),emissiveIntensity:0.9});
const eLamp=new THREE.Mesh(new THREE.SphereGeometry(0.13,24,12,0,Math.PI*2,0,Math.PI/2),eLampM);eLamp.rotation.x=-Math.PI/2;eLamp.position.set(SDX-0.3,EF+1.95,EDZ-0.004);eLamp.rotation.set(-Math.PI/2,0,0);scene.add(eLamp);
const eLight=new THREE.PointLight(col('#FFD9A0'),0.5,3,2);eLight.position.set(SDX-0.4,EF+1.9,EDZ-0.3);eLight.distance=4.5;eLight.intensity=0.6;scene.add(eLight);


// ---- Windfang-Flur (rechts), Garderobe (links), Kellertreppe ----
const tileFloor=(x0,x1,z0,z1,y,tex,sz)=>{const t=(tex||entryTile).clone();t.needsUpdate=true;t.repeat.set((x1-x0)/(sz||0.8),(z1-z0)/(sz||0.8));const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),new THREE.MeshStandardMaterial({map:t,roughness:0.5}));m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,y+0.001,(z0+z1)/2);m.userData.noShadow=1;scene.add(m);return m;};
const baseM=Mu('#8C8A86',0.9),plinthM=Mu('#9A968E',0.6);
// Flur nach Westen
tileFloor(CX0,SDX,HZ1+EWT,EDZ,EF);B(CX0,SDX,-0.8,EF,HZ1+EWT,EDZ,baseM);
B(CX0-VWT,3.12,-0.8,0,HZ1,HZ1+EWT,wallMat);B(3.88,SDX,-0.8,0,HZ1,HZ1+EWT,wallMat);B(3.12,3.88,-0.8,EF,HZ1,HZ1+EWT,baseM);
B(CX0-VWT,XE,0,LY,HZ1,HZ1+EWT,wallMat);
B(CX0-VWT,SDX,-0.8,LY,EDZ,EDZ+EWT,wallMat,gVS);
B(CX0,3.06,EF,LY,HZ1+EWT,HZ1+EWT+0.2,wallMat); // Wandvorsprung endet am Rahmen der Kellertür (geschätzt; vorher verdeckte er 30 cm der Tür)
const gVW=new THREE.Group();scene.add(gVW);
const vw0=8.68,vw1=9.2;
B(CX0-VWT,CX0,-0.8,LY,HZ1+EWT,vw0,wallMat,gVW);B(CX0-VWT,CX0,-0.8,LY,vw1,EDZ+EWT,wallMat,gVW);B(CX0-VWT,CX0,-0.8,EF+1.0,vw0,vw1,wallMat,gVW);B(CX0-VWT,CX0,EF+1.9,LY,vw0,vw1,wallMat,gVW);
win({ax:'x',f:CX0,s:-1,a0:vw0,a1:vw1,y0:EF+1.0,y1:EF+1.9,g:gVW,sashes:1,rows:[],frost:1,noBox:1});
sash('x',gVW,vw0+0.07,vw1-0.07,EF+1.07,EF+1.83,CX0-0.21,CX0-0.11,CX0-0.2025,1,EF+1.45); // Flügel zum Öffnen (Klick auf den Griff)
// Heizkörper + Rohre
B(CX0+0.02,CX0+0.1,EF+0.15,EF+0.75,vw0+0.02,vw1-0.02,white);
for(let z=vw0+0.05;z<vw1-0.03;z+=0.035)B(CX0+0.1,CX0+0.11,EF+0.17,EF+0.73,z,z+0.012,white);
cyl(CX0+0.04,HZ1+EWT+0.24,0.018,EF,2.9,white,8);cyl(CX0+0.09,HZ1+EWT+0.24,0.012,EF,2.9,white,8); // Heizungsrohre in der Ecke neben der Kellertür (Lage geschätzt)
// Sockelleisten
B(CX0,SDX,EF,EF+0.08,EDZ-0.012,EDZ,plinthM);
// Garderobenregal an der Südwand (aufgeräumt: zwei Jacken, Schuhe darunter; das Fenster bleibt frei)
const rackX0=CX0+0.38,rackX1=rackX0+0.72,wrM=M('#3B3B3E',0.4,{metalness:0.6}),shelfW=M('#4E3A2A',0.6);
B(rackX0,rackX1,EF+1.95,EF+1.98,EDZ-0.3,EDZ,shelfW);
[rackX0+0.03,rackX1-0.05].forEach(x=>B(x,x+0.02,EF+1.55,EF+1.98,EDZ-0.3,EDZ-0.01,wrM));
B(rackX0,rackX1,EF+1.7,EF+1.72,EDZ-0.22,EDZ-0.2,wrM);
const coat=(x,z,w,h,d,c,y1,g)=>B(x-w/2,x+w/2,y1-h,y1,z-d/2,z+d/2,M(c,0.9),g);
[[rackX0+0.42,'#2A2A2E',0.85],[rackX0+0.6,'#A9C0D2',0.62]].forEach(([x,c,h],i)=>coat(x,EDZ-0.18+(i%2)*0.03,0.2,h,0.14,c,EF+1.7));
[[rackX0+0.15,'#EDEDED'],[rackX0+0.3,'#EDEDED'],[rackX0+0.5,'#222']].forEach(([x,c])=>B(x-0.05,x+0.05,EF,EF+0.1,EDZ-0.3,EDZ-0.04,M(c,0.8)));
// Kellertür (weiß, mit Glasstreifen): Bänder links (zum Fenster hin), öffnet in den Windfang Richtung Fenster (Robert 14.11.2026)
B(3.06,3.12,EF,EF+2.0,HZ1+EWT-0.01,HZ1+EWT+0.06,white);B(3.88,3.94,EF,EF+2.0,HZ1+EWT-0.01,HZ1+EWT+0.06,white);B(3.06,3.94,EF+1.95,EF+2.0,HZ1+EWT-0.01,HZ1+EWT+0.06,white);
(function(){const pv=new THREE.Group();pv.position.set(3.12,EF,HZ1+EWT+0.02);scene.add(pv);const P=[];const a=m=>{P.push(m);return m;};
  a(B(0,0.76,0,1.95,-0.02,0.02,white,pv));a(B(0.2,0.3,0.35,1.75,0.02,0.025,M('#DDE8EC',0.2),pv));
  const hM=M('#F4F4F4',0.3);a(B(0.7,0.72,0.98,1.05,0.02,0.07,hM,pv));a(B(0.6,0.72,1.03,1.05,0.06,0.08,hM,pv));
  clickable(P,tog(swing(pv,'y',-1.45)));})();
// Kellertreppe unter der Treppe nach oben
const KST=KONST.KST,KR0=0.15,CF=EF-KR0-0.19*(KST-1),CW0=3.05,CW1=3.95,cz0=HZ1-0.25;
const cellTile=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#E4DDD0';x.fillRect(0,0,w,h);for(let i=0;i<300;i++){x.fillStyle=`rgba(${160+rnd()*40},${150+rnd()*40},130,0.15)`;x.fillRect(rnd()*w,rnd()*h,6,2);}x.strokeStyle='rgba(110,105,95,0.7)';x.lineWidth=3;x.strokeRect(0,0,128,128);x.strokeRect(128,0,128,128);x.strokeRect(0,128,128,128);x.strokeRect(128,128,128,128);},[1,1]);
const gCel=new THREE.Group();scene.add(gCel);
// gCelF: Keller-Außenwände zur Straße. Bleiben in Außenansichten sichtbar, auch wenn der Keller (gCel) ausgeblendet ist (start.js).
const gCelF=new THREE.Group();scene.add(gCelF);
const cTop=new THREE.MeshStandardMaterial({map:cellTile,roughness:0.45}),nosM=M('#7C746A',0.5),rough=Mu('#F6F4EF',0.95);rough.userData.paintableWall=1;
B(CW0,CW1,-0.8,EF,cz0,HZ1+EWT,baseM,gCel);tileFloor(CW0,CW1,cz0,HZ1+EWT,EF,cellTile,0.6);
for(let i=1;i<KST;i++){const y=EF-KR0-0.19*(i-1),za=cz0-0.25*i,zb=za+0.25;B(CW0,CW1,y-0.19,y,za,zb,[baseM,baseM,cTop,baseM,baseM,cTop],gCel);B(CW0,CW1,y-0.012,y+0.006,za,za+0.035,nosM,gCel);}
const cBot=cz0-0.25*KST;B(CW0,CW1,CF-0.2,CF,4.1,cBot+0.25,baseM,gCel);tileFloor(CW0,CW1,4.1,cBot+0.25,CF,cellTile,0.6);
B(CW0+0.2,CW1-0.2,CF+0.001,CF+0.012,cBot-0.35,cBot+0.1,M('#3A3C3F',0.95),gCel);
B(XE,CW0,CF-0.2,0,3.63,4.15,rough,gCel);
B(2.97,CW0,CF-0.2,0,5.0,6.7,rough,gCel);B(XE,2.97,CF-0.2,CF,5.0,6.7,rough,gCel);B(XE,2.97,CF+1.15,0,5.0,6.05,rough,gCel);B(XE,2.97,CF+1.15,CF+1.25,6.05,6.7,rough,gCel);B(XE,2.97,CF+1.95,0,6.05,6.7,rough,gCel);B(XE,CW0,CF-0.2,0,6.7,HZ1,rough,gCelF);B(XE,CW0,CF+2.0,0,4.15,5.0,rough,gCel);B(XE,CW0,CF-0.2,CF,4.15,5.0,baseM,gCel);B(CW1,SDX,CF-0.2,-0.8,Z0,4.0,rough,gCel);B(CW1,SDX,CF-0.2,CF,4.0,5.02,baseM,gCel);B(CW1,SDX,CF-0.2,-0.8,5.02,HZ1,rough,gCel);B(CW1,SDX,-0.8,0,Z0,4.0,rough,gCel);B(CW1,SDX,CF+2.0,0,4.0,5.02,rough,gCel);B(CW1,SDX,-0.8,0,5.02,SD0,rough,gCel); // Durchgang vom Treppenfuß nach Osten (am Wandschrank vorbei) zum Flur mit WC und Vorratsraum (Robert 14.11.2026; Breite geschätzt)B(CW1,SUX-0.02,-0.8,0,SD0,HZ1,rough,gCel);
B(CW0,CW1,-0.3,0,Z0,SU0,rough,gCel);
// Kellertür unten (Holz)
const pineTx=canvasTex(128,256,(x,w,h)=>{x.fillStyle='#D68A45';x.fillRect(0,0,w,h);for(let i=0;i<w;i+=16){x.fillStyle='rgba(120,60,20,0.35)';x.fillRect(i,0,1.5,h);}for(let i=0;i<40;i++){x.strokeStyle='rgba(150,80,30,0.25)';x.beginPath();const px=rnd()*w;x.moveTo(px,0);x.lineTo(px+rnd()*6-3,h);x.stroke();}});
B(CW0,3.13,CF,-0.3,Z0,3.95,rough,gCel);B(3.88,CW1,CF,-0.3,Z0,3.95,rough,gCel);B(3.13,3.88,CF+1.95,-0.3,Z0,3.95,rough,gCel);
// Wandschrank unten an der Kellertreppe (braune Türen, anfangs geschlossen)
{const pm=new THREE.MeshStandardMaterial({map:pineTx,roughness:0.6}),wsh=M('#F2F0EA',0.7),bz=3.7;
 // Der Schrank steht schräg vor einem (Robert 14.11.2026): Gruppe gWS, um die linke vordere Ecke gedreht und etwas vorgezogen.
 // Nach den Fotos keller-flur/* reicht sein rechtes Ende bis an den Türrahmen der Waschküche. Winkel und Lage sind geschätzt. Die alte Nische dahinter ist mit einer dünnen Wand geschlossen.
 const gWS=new THREE.Group(),wsA=0.4,wsP=[3.13,4.14],wsQ=[3.12,4.45];gWS.rotation.y=wsA;gWS.position.set(wsQ[0]-(wsP[0]*Math.cos(wsA)+wsP[1]*Math.sin(wsA)),0,wsQ[1]-(-wsP[0]*Math.sin(wsA)+wsP[1]*Math.cos(wsA)));gCel.add(gWS);B(3.13,3.88,CF,CF+1.95,Z0,Z0+0.03,rough,gCel);
 B(3.13,4.08,CF,CF+1.95,bz,bz+0.05,M('#E2DED4',0.9),gWS);B(3.08,3.13,CF,CF+1.95,bz,3.92,rough,gWS);B(4.08,3.93,CF,CF+1.95,bz,3.92,rough,gWS);B(3.13,4.08,CF+1.95,CF+2.0,bz,3.92,rough,gWS);
 [0.42,0.8,1.17,1.52].forEach(y=>B(3.13,4.08,CF+y,CF+y+0.025,bz+0.05,4.1,wsh,gWS));[3.45,3.58].forEach(x=>cyl(x,bz+0.1,0.025,CF,1.95,M('#B8BCC0',0.5),10,gWS));
 B(3.2,3.42,CF,CF+0.22,3.80,4.08,M('#B88C5A',0.85),gWS);B(3.5,3.65,CF+0.02,CF+0.08,3.90,4.05,M('#D82A2A',0.6),gWS);
 [[3.22,'#F4F4F2',0.13],[3.34,'#F2E0A0',0.06],[3.36,'#F2E0A0',0.06],[3.55,'#D8DCE0',0.2],[3.68,'#2A6A3A',0.18]].forEach(([x,c,h],k)=>cyl(x,3.72+(k%2)*0.05,0.045,CF+0.445,h,M(c,0.5),12,gWS));
 B(3.15,3.45,CF+0.825,CF+0.88,3.80,4.05,M('#3AB04A',0.6),gWS);B(3.17,3.43,CF+0.88,CF+1.05,3.82,4.03,M('#E8F4F4',0.3,{transparent:true,opacity:0.5}),gWS);B(3.47,3.68,CF+0.825,CF+0.95,3.82,4.05,M('#E8C870',0.7),gWS);B(3.14,3.32,CF+0.825,CF+0.92,3.95,4.08,M('#9AD8D0',0.5),gWS);
 cyl(3.25,3.90,0.08,CF+1.545,0.3,M('#F4F4F2',0.5),16,gWS);B(3.55,4.06,CF+1.545,CF+1.75,3.80,4.06,M('#B88C5A',0.85),gWS);
 const leaf=(hx,dir)=>{const pv=new THREE.Group();pv.position.set(hx,CF+0.02,4.14);gWS.add(pv);const x0=dir>0?0:-0.47,x1=dir>0?0.47:0,P=[];P.push(B(x0,x1,0,1.92,-0.012,0.012,pm,pv));P.push(B(dir>0?x1-0.06:x0+0.03,dir>0?x1-0.03:x0+0.06,0.95,1.02,0.012,0.03,M('#C8B07A',0.3,{metalness:0.75}),pv));const a=swing(pv,'y',-dir*1.45);return {P,a};};
 const L=leaf(3.13,1),R=leaf(4.08,-1);clickable([...L.P,...R.P],()=>{const t=L.a.target?0:L.a.open;L.a.target=t;R.a.target=t?R.a.open:0;});
 // Strahler-Rondell an der Decke, Steckdosen links
 const gS=M('#B8BCC0',0.4,{metalness:0.5});cyl(3.35,4.32,0.09,CF+2.25,0.03,M('#C8A06A',0.6),16,gCel);[[-0.08,0],[0.08,0.04],[0,-0.08]].forEach(([dx,dz])=>{const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.045,0.12,12),gS);sp.position.set(3.35+dx,CF+2.08,4.32+dz);sp.rotation.x=0.6;gCel.add(sp);const bl=new THREE.Mesh(new THREE.SphereGeometry(0.03,8,6),new THREE.MeshBasicMaterial({color:0xFFF4D8}));bl.position.set(3.35+dx,CF+2.02,4.36+dz);gCel.add(bl);});
 B(CW0,CW0+0.04,CF+1.0,CF+1.18,4.17,4.26,M('#E8E8E2',0.4),gCel);B(CW0,CW0+0.04,CF+1.62,CF+1.72,4.17,4.26,M('#E8E8E2',0.4),gCel);}
// Flur vom Treppenfuß zur Waschküche (östlich der Treppe)
gCel.add(tileFloor(CW1,4.6,3.72,5.02,CF,cellTile,0.8));B(4.6,4.75,CF,0,3.72,4.53,rough,gCel);{const KFE=rm('kpantry','x0',5.5)-0.15; // Ostwand des Flurs = Westwand des Vorratsraums
 gCel.add(tileFloor(CW1,KFE,4.53,5.81,CF,cellTile,0.8));B(CW1,CW1+0.1,CF,0,5.02,8.0,rough,gCel);B(CW1,KFE,CF+2.2,0,3.72,5.81,rough,gCel);}
// Kellerwand unter der Hauswand zum Vorbau: zwischen SDX und EX (unter der Treppe zum Hauseingang) steht stattdessen die
// niedrige Südwand des Keller-WCs mit der Öffnung zum Kriechkeller (keller.js)
B(CW1,SDX,CF,0,7.96,8.4,rough,gCel);B(EX,6.25,CF,0,7.96,8.4,rough,gCel);
// Handlauf links (Westwand) + Kabelkanal
const hlen=Math.hypot(0.25*(KST-1),EF-CF);const hr=new THREE.Mesh(new THREE.CylinderGeometry(0.022,0.022,hlen,10),M('#9A5E30',0.45));hr.position.set(CW0+0.07,(EF+CF)/2+0.9,cz0-0.25*KST/2);hr.rotation.x=Math.atan2(0.25*(KST-1),EF-CF);gCel.add(hr);
for(let k=0;k<3;k++){const z=cz0-0.3-k*0.8,y=EF-(EF-CF)*((cz0-z)/(0.25*KST))+0.9;B(CW0,CW0+0.07,y-0.01,y+0.01,z,z+0.02,M('#BFC3C6',0.3,{metalness:0.7}),gCel);}
B(CW0,CW0+0.03,-0.4,-0.34,cz0-2.2,cz0,white,gCel);
// Figuren auf dem Sims
[['#E8D8B0',0.08],['#9DB4C8',0.09],['#C64040',0.09],['#7A8A6A',0.08],['#E9A3B7',0.07]].forEach(([c,h],i)=>{const x=CW0+0.12+i*0.17;deco(B(x,x+0.08,0,h,SU0-0.12,SU0-0.04,M(c,0.6),gCel));});
// Garderobe (links vom Eingang)
tileFloor(CL0,CL1,KZ1+0.3,EDZ,EF);B(CL0,CL1,-0.8,EF,KZ1+0.3,EDZ,baseM);
B(EX,CL1+VWT,-0.8,0,KZ1,KZ1+0.3,wallMat);B(EX+EWT,CL1+VWT,-0.8,LY,EDZ,EDZ+EWT,wallMat,gVS);
const gCE=new THREE.Group();scene.add(gCE);const cw0=8.58,cw1=9.1;
B(CL1,CL1+VWT,-0.8,LY,KZ1+0.3,cw0,wallMat,gCE);B(CL1,CL1+VWT,-0.8,LY,cw1,EDZ+EWT,wallMat,gCE);B(CL1,CL1+VWT,-0.8,EF+1.05,cw0,cw1,wallMat,gCE);B(CL1,CL1+VWT,EF+1.95,LY,cw0,cw1,wallMat,gCE);
win({ax:'x',f:CL1,s:1,a0:cw0,a1:cw1,y0:EF+1.05,y1:EF+1.95,g:gCE,sashes:1,rows:[]});
// Türrahmen der Garderobe
[[CO0-0.05,CO0],[CO1,CO1+0.05]].forEach(([a,b])=>B(EX-0.02,EX+EWT+0.01,EF,EF+1.97,a,b,white));B(EX-0.02,EX+EWT+0.01,EF+1.95,EF+2.0,CO0-0.05,CO1+0.05,white);
B(EX-0.01,EX,EF+1.1,EF+1.18,CO0-0.3,CO0-0.22,white);B(EX-0.012,EX-0.01,EF+1.13,EF+1.15,CO0-0.27,CO0-0.25,M('#C23A3A',0.4));
// Kleiderstange + Kleidung
const bar=new THREE.Mesh(new THREE.CylinderGeometry(0.014,0.014,CL1-CL0-0.3,10),M('#C0C4C8',0.25,{metalness:0.8}));bar.rotation.z=Math.PI/2;bar.position.set((CL0+CL1)/2,EF+1.85,KZ1+0.55);scene.add(bar);
[['#D8F03A',0.9],['#E8503A',0.75],['#2E8C9A',0.55],['#E06A30',0.85],['#D24848',0.8]].forEach(([c,h],i)=>{const x=CL0+0.04+i*0.11;B(x,x+0.09,EF+1.83-h,EF+1.83,KZ1+0.35,KZ1+0.78,M(c,0.9));});
[['#7C7A38',1.15],['#C8283E',0.95],['#5A2436',1.0]].forEach(([c,h],i)=>{const x=CL1-0.75+i*0.2;B(x,x+0.24,EF+1.9-h,EF+1.9,EDZ-0.14,EDZ-0.02,M(c,0.9));});
// Schuhregal + Mülleimer + Box
const sr=M('#9A9EA2',0.35,{metalness:0.7});[0.02,0.2,0.38,0.56].forEach(y=>B(CL0+0.1,CL0+0.75,EF+y,EF+y+0.015,KZ1+0.33,KZ1+0.63,sr));
[[0.03,'#F0F0F0'],[0.21,'#2A3A5A'],[0.39,'#E8E8E8'],[0.57,'#333']].forEach(([y,c])=>[0.2,0.45].forEach(dx=>B(CL0+dx,CL0+dx+0.18,EF+y+0.015,EF+y+0.1,KZ1+0.36,KZ1+0.6,M(c,0.8))));
B(CL1-0.45,CL1-0.1,EF,EF+0.85,KZ1+0.8,KZ1+1.1,M('#1E1E1E',0.4));B(CL1-0.5,CL1-0.1,EF,EF+0.3,EDZ-0.5,EDZ-0.2,M('#8FA0B0',0.3,{transparent:true,opacity:0.7}));
B(CL0+0.1,CL0+0.8,EF+0.001,EF+0.012,KZ1+0.7,EDZ-0.2,M('#3A3A3C',0.95));
[[CL0+0.4],[CL1-0.4]].forEach(([x])=>deco(cyl(x,(KZ1+0.3+EDZ)/2,0.045,LY-0.24,0.02,M('#D0D4D8',0.2,{metalness:0.8}),16)));
// Vorhang vor der Garderobe (Klick: auf/zu)
const curTex=canvasTex(256,512,(x,w,h)=>{const cs=['#E9B98A','#8FB5B0','#9DB6D4','#E6C79A','#A8C4A0'];for(let i=0;i<8;i++)for(let j=0;j<10;j++){x.fillStyle=cs[(i*3+j*7)%5];x.fillRect(i*32,j*52,32,52);}
  x.strokeStyle='rgba(50,90,150,0.7)';x.lineWidth=2.5;for(let k=0;k<22;k++){const cx=rnd()*w,cy=rnd()*h;x.beginPath();for(let t=0;t<14;t+=0.2)x.lineTo(cx+Math.cos(t)*t*0.9,cy+Math.sin(t)*t*0.9);x.stroke();}
  for(let k=0;k<10;k++){const cx=rnd()*w,cy=rnd()*h;x.fillStyle='#D8573E';x.beginPath();x.ellipse(cx,cy,7,13,rnd()-0.5,0,Math.PI*2);x.fill();x.strokeStyle='#5E8A58';x.lineWidth=2;x.beginPath();x.moveTo(cx,cy+12);x.lineTo(cx+3,cy+40);x.stroke();}});
const curM=new THREE.MeshStandardMaterial({map:curTex,roughness:0.95,side:THREE.DoubleSide});
const cRod=B(EX-0.07,EX-0.05,LY-0.32,LY-0.3,CO0-0.1,CO1+0.2,M('#B8B2A6',0.4,{metalness:0.5}));
const cg=new THREE.Group();cg.position.set(EX-0.06,0,CO1+0.18);scene.add(cg);const curP=[];
const nf=10,cwid=CO1+0.18-(CO0-0.08);for(let i=0;i<nf;i++){const pl=new THREE.Mesh(new THREE.PlaneGeometry(cwid/nf*1.12,LY-0.33-EF),curM);const zc=-(i+0.5)*cwid/nf;pl.position.set((i%2?-0.035:0.035),(LY-0.33+EF)/2,zc);pl.rotation.y=Math.PI/2+(i%2?0.35:-0.35);cg.add(pl);curP.push(pl);}
const ca=anim(()=>(1-cg.scale.z)/0.72,v=>cg.scale.z=1-0.72*v,1);ca.target=1;cg.scale.z=1-0.72;
clickable(curP,()=>{ca.target=ca.target>0.3?0:1;});
label('Windfang',(CX0+SDX)/2,2.75,(HZ1+EWT+EDZ)/2);label('Garderobe',(CL0+CL1)/2,2.75,(KZ1+0.3+EDZ)/2);
