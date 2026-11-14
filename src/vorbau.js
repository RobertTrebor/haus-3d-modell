// Vorbau: Hauseingang außen, Podest, zweiter Treppenlauf, Vorbau-Obergeschoss mit Walmdach.
// ---- Hauseingang außen: Vordach, Stufen, Sockel, Lampe, Büsche ----
const FZ=EDZ+EWT;
(function(){const w=2.3,dp=0.95,r=0.38,sh=new THREE.Shape();const x0=-w/2,x1=w/2;
  sh.moveTo(x0,0);sh.lineTo(x1,0);sh.lineTo(x1,dp-r);sh.quadraticCurveTo(x1,dp,x1-r,dp);sh.lineTo(x0+r,dp);sh.quadraticCurveTo(x0,dp,x0,dp-r);sh.lineTo(x0,0);
  const g=new THREE.ExtrudeGeometry(sh,{depth:0.14,bevelEnabled:true,bevelSize:0.02,bevelThickness:0.02,bevelSegments:2,curveSegments:16});
  const m=new THREE.Mesh(g,[M('#DCDAD2',0.9),M('#7A7A6A',0.95)]);m.rotation.x=Math.PI/2;m.position.set(exc,EF+2.72,FZ);gVS.add(m);
  const moss=new THREE.Mesh(new THREE.ShapeGeometry(sh,16),M('#5E6450',0.95));moss.rotation.x=-Math.PI/2;moss.position.set(exc,EF+2.745,FZ);moss.scale.set(1,-1,1);gVS.add(moss);
  // Stufen mit gerundeter Front
  const step=(w2,d2,y,r2)=>{const s2=new THREE.Shape();s2.moveTo(-w2/2,0);s2.lineTo(w2/2,0);s2.lineTo(w2/2,d2-r2);s2.quadraticCurveTo(w2/2,d2,w2/2-r2,d2);s2.lineTo(-w2/2+r2,d2);s2.quadraticCurveTo(-w2/2,d2,-w2/2,d2-r2);s2.lineTo(-w2/2,0);
    const g2=new THREE.ExtrudeGeometry(s2,{depth:y+1.3,bevelEnabled:false,curveSegments:16});const mm=new THREE.Mesh(g2,M('#B8B4A8',0.85));mm.rotation.x=Math.PI/2;mm.position.set(exc,y,FZ);scene.add(mm);};
  // 3 Stufen: oben gerundetes Podest, darunter zwei breite gerade Blockstufen
  step(1.9,0.58,EF-0.01,0.28);step(2.7,0.98,EF-0.14,0.04);step(2.9,1.36,EF-0.27,0.04);
  B(exc-0.36,exc+0.36,EF-0.01,EF+0.004,FZ+0.08,FZ+0.42,M('#3A3A3C',0.9));B(exc-0.05,exc+0.6,EF-0.405,EF-0.395,FZ+1.45,FZ+1.95,M('#4A5A3A',0.95));
  // Edelstahl-Handlauf links
  {const ss=M('#D4D8DC',0.35,{metalness:0.35}),hx=exc-1.3,tube=(a,b,r)=>{const v=new THREE.Vector3().subVectors(b,a),L=v.length(),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,12),ss);m.position.copy(a).add(b).multiplyScalar(0.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());scene.add(m);};
   const V=(x,y,z)=>new THREE.Vector3(x,y,z),p0=V(hx,EF-0.4,FZ+1.25),p1=V(hx,EF+0.6,FZ+1.25),p2=V(hx,EF+0.95,FZ+0.35),p3=V(hx,EF+0.95,FZ+0.05),p4=V(hx+0.18,EF+0.95,FZ+0.03);
   tube(p0,p1,0.024);tube(p1,p2,0.022);tube(p2,p3,0.022);tube(p3,p4,0.02);tube(V(hx,EF-0.27,FZ+0.7),V(hx,EF+0.8,FZ+0.7),0.022);tube(V(hx,EF+0.3,FZ+1.25),V(hx+0.12,EF+0.3,FZ+1.25),0.012);
   [p1,p2,p3].forEach(q=>{const k=new THREE.Mesh(new THREE.SphereGeometry(0.024,10,8),ss);k.position.copy(q);scene.add(k);});}
})();
// Natursteinsockel
const stoneT=canvasTex(512,128,(x,w,h)=>{x.fillStyle='#5A4A3E';x.fillRect(0,0,w,h);for(let r=0;r<3;r++)for(let c=0;c<10;c++){const v=rnd();x.fillStyle=v<0.3?'#8A6A4E':v<0.6?'#6E5646':v<0.8?'#A08870':'#4E3E36';const ww=40+rnd()*30;x.fillRect(c*56+r*18-10+rnd()*6,r*42+3,ww,37);}},[4,1]);
const stoneM=new THREE.MeshStandardMaterial({map:stoneT,roughness:0.9});
B(CX0-VWT-0.02,dx0-0.06,-1.3,EF+0.02,FZ,FZ+0.025,stoneM);B(dx1+0.06,CL1+VWT+0.02,-1.3,EF+0.02,FZ,FZ+0.025,stoneM);
B(CX0-VWT-0.025,CX0-VWT,-1.3,EF+0.02,HZ1,FZ+0.025,stoneM);B(CL1+VWT,CL1+VWT+0.025,-1.3,EF+0.02,HZ1,FZ+0.025,stoneM);
B(dx0-0.06,dx1+0.06,-1.3,EF-0.02,FZ,FZ+0.02,M('#B8B4A8',0.85));
// Rahmen-Putzfasche um die Tür
B(dx0-0.1,dx0-0.04,EF,EF+dH+0.1,FZ,FZ+0.02,M('#C8C4BA',0.8));B(dx1+0.04,dx1+0.1,EF,EF+dH+0.1,FZ,FZ+0.02,M('#C8C4BA',0.8));B(dx0-0.1,dx1+0.1,EF+dH+0.04,EF+dH+0.1,FZ,FZ+0.02,M('#C8C4BA',0.8));
// Kugelleuchte rechts, Klingel links, Schild
const gl2=new THREE.Mesh(new THREE.SphereGeometry(0.11,20,14),new THREE.MeshStandardMaterial({color:col('#FAFAF6'),emissive:col('#FFF0D0'),emissiveIntensity:0.35,roughness:0.3}));gl2.position.set(dx1+0.95,EF+2.1,FZ+0.14);scene.add(gl2);B(dx1+0.91,dx1+0.99,EF+1.88,EF+2.02,FZ,FZ+0.08,M('#E8E8E4',0.4));
B(dx0-0.68,dx0-0.5,EF+1.3,EF+1.38,FZ,FZ+0.02,M('#2A2A2A',0.4));B(dx0-0.66,dx0-0.52,EF+1.31,EF+1.33,FZ+0.02,FZ+0.022,M('#EEE',0.4));
B(dx1+0.28,dx1+0.72,EF+1.5,EF+1.78,FZ,FZ+0.012,M('#E8ECF0',0.3));B(dx1+0.3,dx1+0.46,EF+1.53,EF+1.75,FZ+0.012,FZ+0.014,M('#5A8AB8',0.4));
// Hausnummer 46 (Emaille), Klingel mit Sprechanlage, Leuchte mit Licht
{const nt=canvasTex(220,180,(x,w,h)=>{x.fillStyle='#1F3E7A';x.fillRect(0,0,w,h);x.strokeStyle='#F4F4F0';x.lineWidth=8;x.strokeRect(10,10,w-20,h-20);x.fillStyle='#F4F4F0';x.font='bold 120px Arial, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('46',w/2,h/2+6);},null);
 const np=new THREE.Mesh(new THREE.PlaneGeometry(0.24,0.2),new THREE.MeshStandardMaterial({map:nt,roughness:0.3}));np.position.set(dx1+0.55,EF+2.1,FZ+0.012);gVS.add(np);}
B(dx0-0.7,dx0-0.48,EF+1.18,EF+1.5,FZ,FZ+0.025,M('#C8CCD0',0.25,{metalness:0.85}),gVS);
for(let k=0;k<4;k++)B(dx0-0.66,dx0-0.52,EF+1.42-k*0.018,EF+1.43-k*0.018,FZ+0.025,FZ+0.028,M('#3A3A3E',0.5),gVS);
B(dx0-0.66,dx0-0.52,EF+1.26,EF+1.31,FZ+0.025,FZ+0.03,M('#F4F2E8',0.5),gVS);cyl(dx0-0.59,FZ+0.03,0.016,EF+1.21,0.012,M('#E8E2C8',0.3),12,gVS);
{const ol=new THREE.PointLight(col('#FFE2B0'),0.35,3.5,2);ol.position.set(dx1+0.95,EF+2.0,FZ+0.35);gVS.add(ol);}
// Türrahmen außen sichtbar in der Laibung + Steinschwelle
B(dx0-0.1,dx0-0.04,EF,EF+dH+0.1,EDZ+0.08,FZ,M('#EDE9E0',0.8),gVS);B(dx1+0.04,dx1+0.1,EF,EF+dH+0.1,EDZ+0.08,FZ,M('#EDE9E0',0.8),gVS);B(dx0-0.1,dx1+0.1,EF+dH+0.06,EF+dH+0.1,EDZ+0.08,FZ,M('#EDE9E0',0.8),gVS);
B(dx0-0.04,dx1+0.04,EF,EF+0.03,EDZ+0.08,FZ+0.04,M('#9E9A90',0.6),gVS);
// Fußabstreifer-Gitter auf der oberen Stufe, Regenrinne am Vordach-Rand
B(exc-0.3,exc+0.3,EF-0.005,EF+0.008,FZ+0.08,FZ+0.42,M('#4A4A4C',0.5,{metalness:0.6}),gVS);
// Büsche: Eibe links, Kirschlorbeer rechts
const yew=M('#3E6A2E',0.8),laurel=M('#2E5A26',0.6);
[[0,0.5,0,0.45,0.9,0.45],[0.1,1.2,0.05,0.35,0.6,0.35],[-0.15,0.9,0.15,0.3,0.5,0.3],[0.25,1.6,0,0.25,0.4,0.25]].forEach(([x,y,z,a,b,c])=>deco(blob(dx0-1.0+x,EF-0.35+y,FZ+0.45+z,a,b,c,yew)));
[[0,0.6,0,0.5,0.7,0.45],[0.2,1.1,0.1,0.4,0.5,0.4],[-0.2,1.0,-0.05,0.35,0.45,0.35]].forEach(([x,y,z,a,b,c])=>deco(blob(dx1+1.15+x,EF-0.35+y,FZ+0.45+z,a,b,c,laurel)));


// ---- Podest im Vorbau, zweiter Lauf ins 1. OG, Vorbau-Obergeschoss mit Walmdach ----
const gUp=new THREE.Group();scene.add(gUp);const gVRoof=new THREE.Group();scene.add(gVRoof);const UE=LY+2.2;
B(HX0,EX,LY-0.03,LY,HZ1+0.3,EDZ,stairTop,gVR);{const t=ftA.clone();t.needsUpdate=true;t.center.set(0.5,0.5);t.rotation=Math.PI/2;t.repeat.set((EDZ-HZ1-0.3)/2.4,(EX-HX0)/2.4);const m=new THREE.Mesh(new THREE.PlaneGeometry(EX-HX0,EDZ-HZ1-0.3),new THREE.MeshStandardMaterial({map:t,roughness:0.42,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));m.rotation.x=-Math.PI/2;m.position.set((HX0+EX)/2,LY+0.004,(HZ1+0.3+EDZ)/2);m.userData.noShadow=1;gVR.add(m);};B(CX0,CL1,2.22,LY-0.03,HZ1+EWT,EDZ,M('#F4F1EA',0.9),gVR);
// zweiter Lauf (über der Eingangstreppe) nach Norden
const N2=8;for(let i=0;i<N2;i++){const y=LY+SRI*(i+1),z1=HZ1+0.3-i*STR,z0=z1-STR;B(SDX+0.03,EX,y-0.08,y-0.03,z0,z1,sofM,gUp);B(SDX+0.03,EX,y-SRI,y-0.03,z1-0.03,z1,sofM,gUp);B(SDX+0.03,EX,y-0.03,y,z0,z1+0.02,stairTop,gUp);}
const U1=LY+SRI*N2,U1Z=HZ1+0.3-N2*STR;
B(HX0,EX,U1-0.25,U1-0.035,U1Z-1.3,U1Z,M('#F4F1EA',0.9),gUp);B(HX0,EX,U1-0.03,U1,U1Z-1.3,U1Z,M('#C9955A',0.5),gUp);
{const L2=Math.hypot(N2*STR,SRI*N2),a2=Math.atan2(SRI*N2,N2*STR);const pn=new THREE.Mesh(new THREE.BoxGeometry(0.05,1.1,L2+0.1),stairM);pn.position.set(SDX+0.025,LY+SRI*N2/2+0.3,HZ1+0.3-N2*STR/2);pn.rotation.x=a2;gUp.add(pn);}cyl(SDX+0.02,HZ1+0.33,0.11,LY,1.0,stairM,24,gUp);
{const rl=Math.hypot(N2*STR,SRI*N2);const r2=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,rl,10),stairTop);r2.position.set(SDX+0.02,LY+SRI*N2/2+0.9,HZ1+0.3-N2*STR/2);r2.rotation.x=-Math.atan2(N2*STR,SRI*N2);gUp.add(r2);}
// Geländer oben am Treppenloch
B(HX0+0.9,SDX,U1+0.95,U1+1.0,U1Z-0.04,U1Z,stairTop,gUp);B(HX0+0.9,SDX,U1,U1+0.3,U1Z-0.04,U1Z,stairM,gUp);for(let x=HX0+1.0;x<SDX;x+=0.22)B(x,x+0.035,U1,U1+0.95,U1Z-0.035,U1Z-0.005,stairTop,gUp);
// Obergeschoss des Vorbaus: Wände, Podestfenster, Walmdach
const lpw0=8.36,lpw1=8.8,lpy0=LY+0.95,lpy1=LY+1.8;B(CX0-VWT,CX0,LY,UE,HZ1,lpw0,wallMat,gUp);B(CX0-VWT,CX0,LY,UE,lpw1,FZ,wallMat,gUp);B(CX0-VWT,CX0,LY,lpy0,lpw0,lpw1,wallMat,gUp);B(CX0-VWT,CX0,lpy1,UE,lpw0,lpw1,wallMat,gUp);const wcw0=8.55,wcw1=9.1,wcy0=LY+0.9,wcy1=LY+1.65;B(CL1,CL1+VWT,LY,UE,HZ1,wcw0,wallMat,gUp);B(CL1,CL1+VWT,LY,UE,wcw1,FZ,wallMat,gUp);B(CL1,CL1+VWT,LY,wcy0,wcw0,wcw1,wallMat,gUp);B(CL1,CL1+VWT,wcy1,UE,wcw0,wcw1,wallMat,gUp);
const lw0=exc-0.5,lw1=exc+0.5,ly0=LY+0.85,ly1=LY+1.7;
B(CX0-VWT,lw0,LY,UE,EDZ,FZ,wallMat,gUp);B(lw1,CL1+VWT,LY,UE,EDZ,FZ,wallMat,gUp);B(lw0,lw1,LY,ly0,EDZ,FZ,wallMat,gUp);B(lw0,lw1,ly1,UE,EDZ,FZ,wallMat,gUp);
win({ax:'z',f:EDZ,s:1,a0:lw0,a1:lw1,y0:ly0,y1:ly1,g:gUp,rows:[],frost:1,noBox:1});
B(lw0-0.03,lw1+0.03,ly0-0.04,ly0,FZ,FZ+0.06,sillM,gUp);
B(CX0-VWT,CL1+VWT,UE-0.2,UE,HZ1,FZ,M('#F4F1EA',0.9),gUp);
(function(){const x0=CX0-VWT-0.3,x1=CL1+VWT+0.3,zf=FZ+0.3,zb=HZ1,run=zf-zb,rh=0.2,y0=UE;
  const A=[x0,y0,zf],Bv=[x1,y0,zf],C=[x1,y0,zb],D=[x0,y0,zb],R1=[x0+run,y0+rh,zb],R2=[x1-run,y0+rh,zb];
  const tri=[A,Bv,R2, A,R2,R1, D,A,R1, Bv,C,R2];const pos=[],uv=[];tri.forEach(p=>{pos.push(...p);uv.push(p[0]*1.2,(p[1]-y0)*3+p[2]*0.4);});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();
  const tileT=canvasTex(128,128,(x,w,h)=>{x.fillStyle='#6A4A3E';x.fillRect(0,0,w,h);for(let r=0;r<4;r++){x.fillStyle='rgba(30,18,12,0.55)';x.fillRect(0,r*32+28,w,4);for(let c=0;c<4;c++){x.fillStyle=`rgba(${120+rnd()*40},${80+rnd()*20},${60+rnd()*20},0.35)`;x.fillRect(c*32+(r%2)*16,r*32,30,28);}}},[1,1]);
  const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({map:tileT,roughness:0.8,side:THREE.DoubleSide}));gVRoof.add(m);
  B(x0,x1,y0-0.06,y0,zf-0.12,zf,M('#9AA0A4',0.4,{metalness:0.5}),gVRoof);})();
