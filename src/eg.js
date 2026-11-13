// Erdgeschoss: Wohnzimmer, Esszimmer, Flur, Küche, Bad, Schlafzimmer, Maßlinien.
const ftA=canvasTex(2048,2048,(x,w,h)=>{
  const n=12,pw=w/n;
  for(let i=0;i<n;i++){
    let py=-rnd()*1500;const x0=i*pw;
    while(py<h){
      const len=1400+rnd()*1600;
      x.save();x.beginPath();x.rect(x0,py,pw,len);x.clip();
      x.fillStyle=`hsl(${24+rnd()*5},${55+rnd()*12}%,${47+rnd()*8}%)`;x.fillRect(x0,py,pw,len);
      for(let k=0;k<34;k++){const gx=x0+rnd()*pw;x.strokeStyle=`rgba(${110+rnd()*30|0},${45+rnd()*15|0},15,${0.15+rnd()*0.3})`;x.lineWidth=1+rnd()*3;x.beginPath();x.moveTo(gx,py);for(let yy=py;yy<py+len;yy+=40)x.lineTo(gx+Math.sin(yy/180+k)*4,yy);x.stroke();}
      const nc=1+(rnd()*3|0);
      for(let c=0;c<nc;c++){const cx=x0+pw*(0.25+rnd()*0.5),ay=py+rnd()*len,sg=rnd()<.5?1:-1;
        for(let k=1;k<10;k++){const ww=k*pw*0.05,hh=50+k*42;x.strokeStyle=`rgba(105,40,12,${0.3+rnd()*0.35})`;x.lineWidth=1.5+rnd()*2.5;x.beginPath();let first=true;
          for(let t=-1;t<=1.001;t+=0.05){const px=cx+t*ww*(1+0.12*Math.sin(t*5+k)),yy=ay+sg*t*t*hh;if(first){x.moveTo(px,yy);first=false;}else x.lineTo(px,yy);}x.stroke();}}
      x.restore();
      x.fillStyle='rgba(70,30,10,0.55)';x.fillRect(x0,py,pw,3);
      py+=len;
    }
    x.fillStyle='rgba(70,30,10,0.5)';x.fillRect(x0,0,3,h);
  }
},[1,1]);
ftA.repeat.set(W/2.4,D/2.4);
const floorMat=new THREE.MeshStandardMaterial({map:ftA,roughness:0.42});
const floor=new THREE.Mesh(new THREE.PlaneGeometry(W,D),floorMat);
floor.rotation.x=-Math.PI/2;floor.position.set(W/2,0,D/2);scene.add(floor);

const wallMat=Mu('#F3F0EA',0.95);
wallMat.userData.paintableWall=1;
function livingWall(face,x0,x1,y0,y1,z0,z1,parent){
  const mesh=B(x0,x1,y0,y1,z0,z1,wallMat,parent);mesh.userData.paintFaces=[face];return mesh;
}
const white=Mu('#FAFAF7',0.5);
const glass=new THREE.MeshStandardMaterial({color:col('#CFE6F2'),transparent:true,opacity:0.16,roughness:0.05,depthWrite:false});
const gWin=new THREE.Group(),gLeft=new THREE.Group(),gRight=new THREE.Group(),gBack=new THREE.Group();
scene.add(gWin,gLeft,gRight,gBack);

const RV=0.38,pvc=Mu('#F7F7F4',0.4);
livingWall(4,-RV,1.07,0,H,-RV,0,gWin);livingWall(4,2.87,W+T,0,H,-RV,0,gWin);
livingWall(4,1.07,2.87,0,0.95,-RV,0,gWin);livingWall(4,1.07,2.87,2.2,H,-RV,0,gWin);
B(1.03,2.91,0.93,0.965,-0.2,0.05,M('#DCD5C6',0.45),gWin);
B(1.07,2.87,0.965,1.04,-0.24,-0.16,pvc,gWin);B(1.07,2.87,2.13,2.2,-0.24,-0.16,pvc,gWin);
B(1.07,1.14,0.965,2.2,-0.24,-0.16,pvc,gWin);B(2.8,2.87,0.965,2.2,-0.24,-0.16,pvc,gWin);
B(1.91,2.03,0.965,2.2,-0.24,-0.15,pvc,gWin);
[[1.14,1.91],[2.03,2.8]].forEach(([a,b])=>{
  B(a,b,1.04,2.13,-0.205,-0.2,glass,gWin);
  const m=(a+b)/2;B(m-0.0125,m+0.0125,1.04,2.13,-0.2,-0.18,pvc,gWin);
  B(a,b,1.62-0.0125,1.62+0.0125,-0.2,-0.18,pvc,gWin);
});

B(0.93,3.01,2.24,H,-0.02,0.14,pvc,gWin);
const rad=M('#F4F2EC',0.5);
B(1.15,2.75,0.14,0.72,0.03,0.12,rad,gWin);
for(let x=1.16;x<2.74;x+=0.032)B(x,x+0.014,0.16,0.7,0.12,0.128,rad,gWin);
cyl(2.8,0.08,0.025,0.55,0.1,pvc,16,gWin);
B(-T,W,0,0.06,0,0.012,white,gWin);

livingWall(0,-RV,0,0,H,-RV,1.6,gLeft);livingWall(0,-RV,0,0,H,2.6,D+T,gLeft);livingWall(0,-RV,0,2.2,H,1.6,2.6,gLeft);
B(-0.12,-0.04,0,2.2,1.6,1.69,pvc,gLeft);B(-0.12,-0.04,0,2.2,2.51,2.6,pvc,gLeft);
B(-0.12,-0.04,2.11,2.2,1.6,2.6,pvc,gLeft);B(-0.12,-0.04,0,0.1,1.6,2.6,pvc,gLeft);
B(-0.085,-0.08,0.1,2.11,1.69,2.51,glass,gLeft);


B(0,0.012,0,0.06,0,1.6,white,gLeft);B(0,0.012,0,0.06,2.6,D,white,gLeft);

livingWall(1,W,W+T,0,H,-T,D+T,gRight);
B(W-0.012,W,0,0.06,0,D,white,gRight);

B(-2.25,-1.83,0,H,D-0.12,D+T,wallMat,gBack);B(-1.83,-0.73,0,0.95,D-0.12,D+T,wallMat,gBack);B(-1.83,-0.73,2.2,H,D-0.12,D+T,wallMat,gBack);B(-0.73,-0.3,0,H,D-0.12,D+T,wallMat,gBack);B(-0.3,0.1,0,H,D,D+T,wallMat,gBack);livingWall(5,0.1,1.6,2.1,H,D,D+T,gBack);livingWall(5,1.6,3.02,0,H,D,D+T,gBack);livingWall(5,3.02,W,2.1,H,D,D+T,gBack);
const brass=M('#B8924A',0.3,{metalness:0.8});
const oak=M('#A87D52',0.6);
const trim=Mu('#F2EFE6',0.5);
B(0.03,0.1,0,2.17,D-0.015,D,trim,gBack);B(1.6,1.67,0,2.17,D-0.015,D,trim,gBack);B(0.03,1.67,2.1,2.17,D-0.015,D,trim,gBack);
B(1.54,1.6,0,2.09,D+0.03,D+0.075,trim,gBack);B(0.1,0.16,0,2.09,D+0.03,D+0.075,trim,gBack);B(0.16,0.165,0.95,1.15,D+0.045,D+0.06,brass,gBack);B(1.535,1.54,0.95,1.15,D+0.045,D+0.06,brass,gBack);
B(2.955,3.02,0,2.17,D-0.165,D,trim,gBack);B(3.84,3.9,0,2.17,D-0.015,D,trim,gBack);B(2.955,3.9,2.1,2.17,D-0.165,D,trim,gBack);
B(1.67,2.83,0,0.06,D-0.012,D,white,gBack);

const leaf=Mu('#F4F2EC',0.45);

const spruce=M('#D9A45C',0.5),rosew=M('#6B3E22',0.5);
function disk(x,y,r,z0,z1,m){const d=new THREE.Mesh(new THREE.CylinderGeometry(r,r,z1-z0,40),m);d.rotation.x=Math.PI/2;d.position.set(x,y,(z0+z1)/2);gBack.add(d);return d;}
livingWall(5,2.29,2.955,0,H,D-0.15,D,gBack);B(2.29,2.955,0,0.06,D-0.162,D-0.15,white,gBack);B(2.278,2.29,0,0.06,D-0.15,D,white,gBack);
disk(1.98,1.3,0.18,D-0.1,D-0.01,spruce);disk(1.98,1.55,0.14,D-0.1,D-0.01,spruce);
disk(1.98,1.47,0.045,D-0.102,D-0.1,M('#2A1A10',0.8));
B(1.93,2.03,1.17,1.19,D-0.105,D-0.1,rosew,gBack);
B(1.955,2.005,1.66,2.0,D-0.06,D-0.03,rosew,gBack);B(1.945,2.015,2.0,2.17,D-0.05,D-0.03,rosew,gBack);

const TI=0.235,XW=rm('dining','x0',-1.95),XE=XW+rm('dining','breite',4.67),S=D+T+rm('dining','tiefe',4.30),Z0=D+T,PI2=Math.PI;
const gDW=new THREE.Group(),gDS=new THREE.Group(),gDE=new THREE.Group();scene.add(gDW,gDS,gDE);
const ftB=ftA.clone();ftB.needsUpdate=true;ftB.center.set(0.5,0.5);ftB.rotation=PI2/2;ftB.repeat.set((S-Z0)/2.4,(XE-XW+TI)/2.4);
const dining=new THREE.Mesh(new THREE.PlaneGeometry(XE-XW+TI,S-Z0),new THREE.MeshStandardMaterial({map:ftB,roughness:0.42}));
dining.rotation.x=-PI2/2;dining.position.set((XW+XE+TI)/2,0,(Z0+S)/2);scene.add(dining);

const sillTex=canvasTex(512,128,(x,w,h)=>{x.fillStyle='#E6D8C2';x.fillRect(0,0,w,h);for(let i=0;i<45;i++){x.strokeStyle=`rgba(${170+rnd()*40|0},${140+rnd()*30|0},${110+rnd()*30|0},${0.12+rnd()*0.25})`;x.lineWidth=0.6+rnd()*2;x.beginPath();let px=rnd()*w,py=rnd()*h;x.moveTo(px,py);for(let k=0;k<6;k++){px+=(rnd()-.3)*90;py+=(rnd()-.5)*30;x.lineTo(px,py);}x.stroke();}},[2,1]);
const sillM=new THREE.MeshStandardMaterial({map:sillTex,roughness:0.25});
// north window (dining, facing balcony), shutter closed
win({ax:'z',f:Z0,s:-1,a0:-1.83,a1:-0.73,y0:0.95,y1:2.2,g:gBack,rows:[0.5]});
const shutTex=canvasTex(64,512,(x,w,h)=>{x.fillStyle='#E4E2DA';x.fillRect(0,0,w,h);for(let y=0;y<h;y+=16){x.fillStyle='rgba(90,90,85,0.45)';x.fillRect(0,y,w,2);x.fillStyle='rgba(255,255,240,0.9)';for(let s=4;s<w;s+=14)x.fillRect(s,y+3,7,2);}},[1,1]);



B(0.03,0.1,0,2.17,Z0,Z0+0.015,trim,gBack);B(1.6,1.67,0,2.17,Z0,Z0+0.015,trim,gBack);B(0.03,1.67,2.1,2.17,Z0,Z0+0.015,trim,gBack);
B(XW,0.03,0,0.06,Z0,Z0+0.012,white,gBack);B(1.67,XE,0,0.06,Z0,Z0+0.012,white,gBack);
// west wall with 3-part window
const RV2=0.38,wz0=Z0+0.75,wz1=Z0+3.92;
B(XW-RV2,XW,0,H,D,wz0,wallMat,gDW);B(XW-RV2,XW,0,H,wz1,S+0.24,wallMat,gDW);B(XW-RV2,XW,0,0.9,wz0,wz1,wallMat,gDW);B(XW-RV2,XW,2.2,H,wz0,wz1,wallMat,gDW);
B(XW-0.24,XW-0.16,0.9,0.97,wz0,wz1,pvc,gDW);B(XW-0.24,XW-0.16,2.13,2.2,wz0,wz1,pvc,gDW);B(XW-0.24,XW-0.16,0.9,2.2,wz0,wz0+0.07,pvc,gDW);B(XW-0.24,XW-0.16,0.9,2.2,wz1-0.07,wz1,pvc,gDW);
const sw=(wz1-wz0-0.14-0.2)/3;
for(let i=0;i<3;i++){const a=wz0+0.07+i*(sw+0.1),b=a+sw;
  if(i<2)B(XW-0.24,XW-0.15,0.9,2.2,b,b+0.1,pvc,gDW);
  B(XW-0.205,XW-0.2,0.97,2.13,a,b,glass,gDW);
  const m=(a+b)/2;B(XW-0.2,XW-0.18,0.97,2.13,m-0.0125,m+0.0125,pvc,gDW);
  [1.357,1.743].forEach(y=>B(XW-0.2,XW-0.18,y-0.0125,y+0.0125,a,b,pvc,gDW));
  }
B(XW-0.2,XW+0.05,0.865,0.9,wz0-0.04,wz1+0.04,sillM,gDW);
B(XW,XW+0.14,2.24,H,wz0-0.08,wz1+0.08,pvc,gDW);
B(XW+0.03,XW+0.12,0.14,0.72,Z0+1.65,Z0+3.05,rad,gDW);for(let z=Z0+1.66;z<Z0+3.04;z+=0.032)B(XW+0.12,XW+0.128,0.16,0.7,z,z+0.014,rad,gDW);
B(XW,XW+0.012,0,0.06,Z0,S,white,gDW);
[[Z0+1.2,'#5E9A55'],[Z0+2.35,'#7BAF5A'],[Z0+3.5,'#4E8A4A']].forEach(([z,c])=>{cyl(XW-0.02,z,0.06,0.9,0.1,M('#C0663F',0.8),16,gDW);blob(XW-0.02,1.08,z,0.1,0.12,0.1,M(c,0.8));});
// south, east walls
const sx0=-1.75,sx1=-0.70,sxm=(sx0+sx1)/2;
B(XW-RV2,sx0,0,H,S,S+0.38,wallMat,gDS);B(sx1,XE+TI,0,H,S,S+0.38,wallMat,gDS);B(sx0,sx1,0,0.9,S,S+0.38,wallMat,gDS);B(sx0,sx1,2.2,H,S,S+0.38,wallMat,gDS);
B(sx0,sx1,0.9,0.97,S+0.16,S+0.24,pvc,gDS);B(sx0,sx1,2.13,2.2,S+0.16,S+0.24,pvc,gDS);B(sx0,sx0+0.07,0.9,2.2,S+0.16,S+0.24,pvc,gDS);B(sx1-0.07,sx1,0.9,2.2,S+0.16,S+0.24,pvc,gDS);B(sxm-0.05,sxm+0.05,0.9,2.2,S+0.15,S+0.24,pvc,gDS);
[[sx0+0.07,sxm-0.05],[sxm+0.05,sx1-0.07]].forEach(([a,b])=>{B(a,b,0.97,2.13,S+0.2,S+0.205,glass,gDS);const m=(a+b)/2;B(m-0.0125,m+0.0125,0.97,2.13,S+0.18,S+0.2,pvc,gDS);B(a,b,1.6-0.0125,1.6+0.0125,S+0.18,S+0.2,pvc,gDS);});

B(sx0-0.04,sx1+0.04,0.865,0.9,S-0.05,S+0.2,sillM,gDS);B(sx0-0.1,sx1+0.1,2.24,H,S-0.14,S,pvc,gDS);B(XW,XE,0,0.06,S-0.012,S,white,gDS);
B(XE-0.012,XE,0,0.06,Z0+1.09,S,white,gDE);
// dining table (oval, two pedestals)
const cherry=M('#B8703E',0.35),navy=M('#2A3550',0.9);
const setStart=scene.children.length;
slab(-1.25,0.75,5.44,6.56,0.7,0.07,0.5,cherry);
B(-0.84,-0.56,0,0.72,5.80,6.20,cherry);B(0.06,0.34,0,0.72,5.80,6.20,cherry);
function chair(x,z,ry){const g=new THREE.Group();const a=(x0,x1,y0,y1,z0,z1,m)=>B(x0,x1,y0,y1,z0,z1,m,g);
  [[-0.2,-0.2],[0.17,-0.2],[-0.2,0.17],[0.17,0.17]].forEach(([p,q])=>a(p,p+0.03,0,0.44,q,q+0.03,cherry));
  a(-0.21,0.21,0.43,0.47,-0.21,0.21,cherry);a(-0.2,0.2,0.47,0.53,-0.2,0.2,navy);
  a(-0.2,-0.17,0.44,1.0,-0.21,-0.18,cherry);a(0.17,0.2,0.44,1.0,-0.21,-0.18,cherry);
  a(-0.17,0.17,0.6,0.9,-0.215,-0.175,navy);a(-0.2,0.2,0.9,1.0,-0.22,-0.17,cherry);
  g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);}
chair(-0.75,5.32,0);chair(0.25,5.32,0);chair(-0.75,6.68,PI2);chair(0.25,6.68,PI2);chair(0.87,6.0,-PI2/2);chair(-1.37,6.0,PI2/2);
const tt=M('#E07A1F',0.4);
(function(){const g=new THREE.Group();const a=(x0,x1,y0,y1,z0,z1)=>B(x0,x1,y0,y1,z0,z1,tt,g);
  [-0.23,0.2].forEach(x=>{a(x,x+0.03,0,0.04,-0.28,0.24);
    const post=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.8,0.06),tt);post.position.set(x+0.015,0.4,-0.14);post.rotation.x=0.14;g.add(post);});
  a(-0.2,0.2,0.66,0.75,-0.2,-0.18);a(-0.2,0.2,0.54,0.62,-0.19,-0.17);
  a(-0.2,0.2,0.44,0.465,-0.17,0.12);a(-0.2,0.2,0.2,0.222,-0.2,0.2);
  g.position.set(-0.25,0,5.24);scene.add(g);})();
blob(-0.25,0.88,6.0,0.12,0.13,0.12,M('#5E9A55',0.8));cyl(-0.25,6.0,0.07,0.77,0.1,M('#E9E6DF',0.4),16);
const diningSet=new THREE.Group();diningSet.position.set(-0.25,0,6.0);scene.add(diningSet);scene.updateMatrixWorld(true);scene.children.slice(setStart,-1).forEach(o=>diningSet.attach(o));
// hutch
const hut=M('#4A2C1C',0.55),hx0=-0.45,hx1=1.12;
B(hx0,hx1,0,0.9,S-0.5,S,hut);B(hx0-0.02,hx1+0.02,0.9,0.94,S-0.52,S,hut);
[0.35,0.75].forEach(y=>{[[hx0+0.05,(hx0+hx1)/2-0.02],[(hx0+hx1)/2+0.02,hx1-0.05]].forEach(([a,b])=>B(a,b,y,y+0.3,S-0.505,S-0.5,M('#3A2014',0.6)));});
B(hx0+0.05,hx0+0.08,0.94,2.0,S-0.38,S,hut);B(hx1-0.08,hx1-0.05,0.94,2.0,S-0.38,S,hut);B(hx0+0.05,hx1-0.05,0.94,2.0,S-0.04,S,hut);
B(hx0+0.02,hx1-0.02,2.0,2.1,S-0.42,S,hut);
const white2=M('#F4F2EC',0.3);
[1.25,1.58].forEach(y=>B(hx0+0.08,hx1-0.08,y,y+0.02,S-0.36,S-0.04,hut));
for(let k=0;k<3;k++){const a=hx0+0.08+k*0.48;cyl(a+0.14,S-0.2,0.12,0.95,0.12,white2,24);cyl(a+0.36,S-0.18,0.04,1.27,0.08,white2,12);cyl(a+0.24,S-0.2,0.05,1.6,0.12,white2,12);cyl(a+0.36,S-0.2,0.04,0.95,0.09,white2,12);}
const dw=(hx1-hx0-0.1)/3;
for(let k=0;k<3;k++){const a=hx0+0.05+k*dw,b=a+dw;
  B(a,a+0.04,0.94,2.0,S-0.4,S-0.38,hut);B(b-0.04,b,0.94,2.0,S-0.4,S-0.38,hut);B(a,b,0.94,0.99,S-0.4,S-0.38,hut);B(a,b,1.95,2.0,S-0.4,S-0.38,hut);
  B(a+0.04,b-0.04,0.99,1.95,S-0.395,S-0.39,glass);}
const ledMat=new THREE.MeshStandardMaterial({color:col('#FFE6B0'),emissive:col('#FFC870'),emissiveIntensity:0.3});
for(let x=hx0;x<=hx1;x+=0.08){const l=blob(x,2.1,S-0.43,0.008,0.008,0.008,ledMat);l.userData.noShadow=true;}
// east wall: door, fridge, cart, desk
const dk=M('#3E2416',0.5);
[[-0.78,S-0.38],[-0.52,S-0.38],[-0.78,S-0.06],[-0.52,S-0.06]].forEach(([x,z])=>B(x,x+0.035,0,0.72,z,z+0.035,dk));
B(-0.8,-0.47,0.72,0.75,S-0.4,S-0.02,dk);B(-0.78,-0.5,0.12,0.14,S-0.38,S-0.04,dk);
[[-0.72,'#E9D9B0'],[-0.63,'#7A5A3A'],[-0.55,'#D9A04A']].forEach(([x,c])=>cyl(x,S-0.2,0.04,0.75,0.13,M(c,0.4),14));
const potW=Mu('#EDEBE6',0.35);cyl(-1.0,S-0.3,0.17,0,0.36,potW,28);
const stalk=Mu('#7A4A2E',0.7),leaf2=Mu('#5B7A55',0.5,{side:THREE.DoubleSide}),leaf3=Mu('#7A3A2A',0.5,{side:THREE.DoubleSide});
for(let i=0;i<22;i++){const a=i*2.4,r=0.05+0.25*((i*37)%10)/10,y=0.9+((i*53)%10)/10*0.75;
  const lx=-1.0+Math.cos(a)*r,lz=S-0.3+Math.sin(a)*r*0.7;
  const st=new THREE.Mesh(new THREE.CylinderGeometry(0.004,0.005,y-0.35,5),stalk);st.position.set((-1.0+lx)/2,(y+0.35)/2,(S-0.3+lz)/2);st.lookAt(lx,y,lz);st.rotateX(PI2/2);scene.add(st);
  const lf=blob(lx,y,lz,0.13,0.008,0.045,i%3?leaf2:leaf3);lf.rotation.y=-a;lf.rotation.z=-0.4;}
[[-1.72,S-0.42],[-1.22,S-0.42],[-1.72,S-0.06],[-1.22,S-0.06]].forEach(([x,z])=>B(x,x+0.035,0,0.64,z,z+0.035,dk));
B(-1.74,-1.17,0.64,0.67,S-0.44,S-0.03,dk);

B(XE,XE+TI,0,H,Z0,Z0+0.04,wallMat,gDE);B(XE,XE+TI,2.05,H,Z0+0.04,Z0+1.02,wallMat,gDE);B(XE,XE+TI,0,H,Z0+1.02,S,wallMat,gDE);
B(XE-0.015,XE,0,2.12,Z0,Z0+0.04,trim,gDE);B(XE-0.015,XE,0,2.12,Z0+1.02,Z0+1.09,trim,gDE);B(XE-0.015,XE,2.05,2.12,Z0,Z0+1.09,trim,gDE);

const steel=M('#A9ADB0',0.3,{metalness:0.6});
const fz=Z0+1.5;

const oakL=M('#D29A55',0.55),cz=Z0+2.3;
[[XE-0.45,cz],[XE-0.05,cz],[XE-0.45,cz+0.44],[XE-0.05,cz+0.44]].forEach(([x,z])=>B(x,x+0.04,0,0.88,z,z+0.04,oakL));
B(XE-0.46,XE-0.01,0.86,0.9,cz-0.01,cz+0.49,oakL);B(XE-0.45,XE-0.02,0.4,0.43,cz,cz+0.48,oakL);B(XE-0.45,XE-0.02,0.06,0.09,cz,cz+0.48,oakL);
B(XE-0.44,XE-0.04,0.9,1.18,cz+0.02,cz+0.47,M('#EDEAE0',0.5));B(XE-0.445,XE-0.44,0.94,1.14,cz+0.05,cz+0.36,M('#1E1E1E',0.2));
const dz=S-1.2;
B(XE-0.42,XE,0.74,0.77,dz,S,oakL);B(XE-0.4,XE,0.6,0.74,dz+0.02,S-0.02,oakL);
B(XE-0.405,XE-0.4,0.62,0.72,dz+0.05,dz+0.5,M('#222',0.5));B(XE-0.405,XE-0.4,0.62,0.72,dz+0.8,S-0.05,M('#222',0.5));
[[XE-0.38,dz+0.04],[XE-0.06,dz+0.04],[XE-0.38,S-0.06],[XE-0.06,S-0.06]].forEach(([x,z])=>cyl(x,z,0.006,0,0.6,M('#1A1A1A',0.4),8));
B(XE-0.34,XE-0.1,0.77,0.785,dz+0.4,dz+0.75,M('#8D9196',0.3,{metalness:0.5}));B(XE-0.12,XE-0.1,0.785,1.0,dz+0.4,dz+0.75,M('#1A1A1A',0.3));

// dining north wall: keyboard, bench, guitar, clock, purifier, stool
const felt=M('#8E9296',0.95),yel=M('#E2C22E',0.6),lw=M('#C9B08A',0.6);
[[-1.72,Z0+0.1],[-0.72,Z0+0.1],[-1.72,Z0+0.36],[-0.72,Z0+0.36]].forEach(([x,z])=>B(x,x+0.04,0,0.72,z,z+0.04,lw));
B(-1.77,-0.63,0.72,0.84,Z0+0.08,Z0+0.42,felt);B(-1.8,-1.77,0.72,0.86,Z0+0.08,Z0+0.42,yel);B(-0.63,-0.6,0.72,0.86,Z0+0.08,Z0+0.42,yel);
B(-1.42,-0.97,0.84,1.12,Z0+0.1,Z0+0.12,M('#FAFAF7',0.8));
B(-1.47,-0.97,0.42,0.5,Z0+0.62,Z0+0.95,yel);[[-1.45,Z0+0.64],[-1.03,Z0+0.64],[-1.45,Z0+0.89],[-1.03,Z0+0.89]].forEach(([x,z])=>B(x,x+0.04,0,0.42,z,z+0.04,M('#9A9690',0.5)));
(function(){const x=-0.38,z0=Z0;const d=(yy,r,za,zb,m)=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r,zb-za,40),m);c.rotation.x=PI2/2;c.position.set(x,yy,(za+zb)/2);gBack.add(c);};
  d(1.2,0.18,z0+0.01,z0+0.1,spruce);d(1.45,0.14,z0+0.01,z0+0.1,spruce);d(1.37,0.045,z0+0.1,z0+0.102,M('#2A1A10',0.8));
  B(x-0.05,x+0.05,1.07,1.09,z0+0.1,z0+0.105,rosew,gBack);B(x-0.025,x+0.025,1.56,1.9,z0+0.03,z0+0.06,rosew,gBack);B(x-0.035,x+0.035,1.9,2.07,z0+0.03,z0+0.05,rosew,gBack);
  d(2.2,0.13,z0,z0+0.05,M('#7FA3A0',0.6));d(2.2,0.1,z0+0.05,z0+0.052,M('#FAFAF7',0.6));})();
B(-0.2,0.06,0,0.58,Z0+0.05,Z0+0.29,M('#F2F2F0',0.4));B(-0.19,0.05,0.58,0.6,Z0+0.06,Z0+0.28,M('#2A2A2A',0.6));
cyl(XE-0.7,dz+0.55,0.2,0,0.03,M('#F2F2F0',0.3),24);cyl(XE-0.7,dz+0.55,0.035,0.03,0.4,M('#B8B8B8',0.2,{metalness:0.7}),12);cyl(XE-0.7,dz+0.55,0.17,0.43,0.07,M('#8E9296',0.9),24);
const dLight=new THREE.PointLight(col('#FFD3A0'),0,6,2);dLight.position.set(-0.25,2.0,6.0);scene.add(dLight);

const stone=M('#CFCBC2',0.85),parapet=M('#F1EFEA',0.9);
B(XW-RV2,-RV,-0.05,0,-RV,D-0.12,stone);
B(XW-RV2,XW-RV2+0.15,-0.05,1.0,-RV,D-0.12,parapet);B(XW-RV2,-RV,-0.05,1.0,-RV,-RV+0.12,parapet);
const tl=M('#8B8580',0.5,{metalness:0.4});
cyl(-0.75,2.05,0.3,0.7,0.02,M('#AFC3C3',0.15,{transparent:true,opacity:0.6}),40);cyl(-0.75,2.05,0.03,0,0.7,tl,12);cyl(-0.75,2.05,0.2,0,0.02,tl,24);
const wicker=M('#D2B27A',0.95);
[[1.55,0],[2.55,1]].forEach(([z,i])=>{B(-1.0,-0.55,0.43,0.5,z-0.22,z+0.22,wicker);B(-1.0,-0.55,0.5,1.0,i?z+0.18:z-0.22,i?z+0.22:z-0.18,wicker);[[-0.97,z-0.19],[-0.58,z-0.19],[-0.97,z+0.19],[-0.58,z+0.19]].forEach(p=>cyl(p[0],p[1],0.02,0,0.43,oak,8));});
cyl(-1.1,2.85,0.12,0,0.25,M('#C0663F',0.8));blob(-1.1,0.38,2.85,0.14,0.16,0.14,M('#5E9A55',0.8));

const rugTex=canvasTex(880,800,(x,w,h)=>{
  x.fillStyle='#C9633F';x.fillRect(0,0,w,h);
  for(let i=0;i<5000;i++){x.fillStyle=`rgba(${rnd()<.5?'255,220,180':'120,40,20'},0.06)`;x.fillRect(rnd()*w,rnd()*h,2,2);}
  x.strokeStyle='#EFC47A';x.lineWidth=18;x.strokeRect(40,40,w-80,h-80);
  x.lineWidth=5;x.strokeRect(78,78,w-156,h-156);
  x.fillStyle='rgba(239,196,122,0.85)';
  for(let px=130;px<w-110;px+=78)for(let py=130;py<h-110;py+=78){x.save();x.translate(px,py);x.rotate(Math.PI/4);x.fillRect(-7,-7,14,14);x.restore();}
});
B(0.9,3.1,0,0.012,0.25,2.25,[M('#C9633F',0.95),M('#C9633F',0.95),new THREE.MeshStandardMaterial({map:rugTex,roughness:0.95}),M('#C9633F',0.95),M('#C9633F',0.95),M('#C9633F',0.95)]);

const thaiTex=canvasTex(512,512,(x,w,h)=>{
  const n=8,tw=w/n;
  for(let t=0;t<n;t++){const x0=t*tw;
    const g=x.createLinearGradient(x0,0,x0+tw,0);g.addColorStop(0,'#5E0E18');g.addColorStop(0.18,'#9A1B2B');g.addColorStop(0.5,'#B42234');g.addColorStop(0.82,'#9A1B2B');g.addColorStop(1,'#5E0E18');
    x.fillStyle=g;x.fillRect(x0,0,tw,h);
    for(let y=16;y<h;y+=32){const cx=x0+tw/2,cy=y+(t%2)*16;
      x.fillStyle='#E8B64A';x.beginPath();x.moveTo(cx,cy-11);x.lineTo(cx+11,cy);x.lineTo(cx,cy+11);x.lineTo(cx-11,cy);x.closePath();x.fill();
      x.fillStyle='#1F3B2E';x.beginPath();x.moveTo(cx,cy-6);x.lineTo(cx+6,cy);x.lineTo(cx,cy+6);x.lineTo(cx-6,cy);x.closePath();x.fill();
      x.fillStyle='#F4E6C8';x.beginPath();x.arc(cx,cy,2,0,7);x.fill();
      x.fillStyle='rgba(232,182,74,0.8)';[[-18,0],[18,0]].forEach(([dx,dy])=>{x.beginPath();x.arc(cx+dx*0.9,cy+16+dy,2.2,0,7);x.fill();});}
    x.fillStyle='rgba(40,5,10,0.7)';x.fillRect(x0,0,2,h);}
},[1.25,1.25]);
const thaiM=new THREE.MeshStandardMaterial({map:thaiTex,roughness:0.85});
const seamM=M('#4A0A12',0.9);
const KD=0.54,KX=W-KD;
[0.25,1.07].forEach((z0,i)=>{
  const z1=z0+0.8;
  [0,0.08,0.16].forEach(y=>slab(KX,W,z0,z1,y,0.08,0.035,thaiM));
  const tri=new THREE.Shape();tri.moveTo(0,0);tri.lineTo(0.3,0);tri.lineTo(0.3,0.3);tri.lineTo(0,0);
  const tg=new THREE.ExtrudeGeometry(tri,{depth:0.74,bevelEnabled:true,bevelSize:0.025,bevelThickness:0.03,bevelSegments:4});
  const back=new THREE.Mesh(tg,thaiM);back.position.set(W-0.325,0.265,z0+0.03);scene.add(back);
  [0.08,0.16].forEach(y=>B(KX+0.01,KX+0.014,y-0.004,y+0.004,z0+0.03,z1-0.03,seamM));
  const p=blob(W-0.2,0.48,z0+0.4,0.07,0.19,0.19,M(i?'#E0AE3E':'#2F6F73',0.95));p.rotation.z=0.5;
});
const sage=M('#8FAE8B',0.95);
B(KX+0.02,KX+0.28,0.24,0.262,1.12,1.8,sage);B(KX-0.005,KX+0.02,0.1,0.262,1.12,1.8,sage);

const heartS=new THREE.Shape();
for(let i=0;i<=120;i++){const t=i/120*Math.PI*2,u=16*Math.pow(Math.sin(t),3),v=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);i?heartS.lineTo(v/32,u/32):heartS.moveTo(v/32,u/32);}
const hg=new THREE.ExtrudeGeometry(heartS,{depth:0.03,bevelEnabled:true,bevelSize:0.012,bevelThickness:0.012,bevelSegments:3,curveSegments:4});
hg.rotateX(Math.PI/2);
const ht=new THREE.Mesh(hg,M('#D0182A',0.22));ht.position.set(2.0,0.42,1.25);scene.add(ht);
const whiteGloss=M('#F6F5F2',0.3);
[[2.1,1.0],[2.1,1.5]].forEach(([x,z])=>{cyl(x,z,0.26,0,0.03,whiteGloss,40);cyl(x,z,0.17,0.03,0.35,whiteGloss,40);});
cyl(1.9,1.1,0.06,0.432,0.1,M('#C0663F',0.8),20);blob(1.9,0.58,1.1,0.1,0.09,0.1,M('#6FA35E',0.8));
B(2.05,2.25,0.432,0.447,1.3,1.44,M('#F2E8D5',0.6));cyl(2.11,1.37,0.035,0.447,0.07,M('#FFFFFF',0.3),16);

[[0.45,'#B85C8A'],[2.05,'#5A8FC7']].forEach(([z,c])=>{
  const m=M(c,0.95);cyl(2.0,z,0.2,0,0.13,m,40);blob(2.0,0.13,z,0.2,0.035,0.2,m);
});

const teal=M('#2F6F73',0.55);
B(0.02,0.44,0.1,0.55,0.3,1.5,teal);
[0.7,1.1].forEach(z=>B(0.44,0.445,0.14,0.51,z-0.004,z+0.004,M('#245659',0.6)));
[0.5,0.9,1.3].forEach(z=>blob(0.45,0.36,z,0.012,0.012,0.012,brass));
[[0.08,0.36],[0.38,0.36],[0.08,1.44],[0.38,1.44]].forEach(p=>cyl(p[0],p[1],0.015,0,0.1,oak,10));
const screenMat=M('#101113',0.25);
B(0.19,0.22,0.62,1.19,0.415,1.385,screenMat);
B(0.14,0.3,0.55,0.565,0.8,1.0,M('#222',0.4));B(0.2,0.215,0.565,0.64,0.88,0.92,M('#222',0.4));

const potM=Mu('#E9E6DF',0.4);cyl(0.66,0.28,0.2,0,0.02,potM,32);cyl(0.66,0.28,0.17,0.02,0.3,potM,32);cyl(0.66,0.28,0.16,0.3,0.01,M('#4A3A2A',1),24);
const stemM=Mu('#6B5A3A',0.8);cyl(0.66,0.28,0.018,0.3,1.75,stemM,8);cyl(0.63,0.3,0.012,0.3,1.2,stemM,8);
const leafM=Mu('#253F24',0.35,{side:THREE.DoubleSide});
for(let i=0;i<28;i++){
  const a=i*2.4,y=0.55+i*0.055,r=0.1+0.06*((i*7)%3);
  const lf=blob(0.66+Math.cos(a)*r,y,0.28+Math.sin(a)*r,0.13,0.01,0.065,leafM);lf.rotation.y=-a;lf.rotation.z=-0.5;
}



// ---- Flur ----
const HX0=XE+TI,HX1=HX0+rm('hall','breite',2.2),HZ1=S,SUX=HX0+1.05,SDX=HX1-1.12,SD0=6.85,SD1=S,NST=8,STR=0.24,SRI=0.185,SU0=HZ1+0.3-NST*STR;
const gHE=new THREE.Group(),gHS=new THREE.Group();scene.add(gHE,gHS);
function hfloor(x0,x1,z0,z1,tex){const t=ftA.clone();t.needsUpdate=true;t.center.set(0.5,0.5);t.rotation=Math.PI/2;t.repeat.set((z1-z0)/2.4,(x1-x0)/2.4);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),new THREE.MeshStandardMaterial({map:tex||t,roughness:0.42}));m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,0.001,(z0+z1)/2);m.userData.noShadow=1;scene.add(m);return m;}
hfloor(HX0,HX1,Z0,SU0);hfloor(SUX,HX1,SU0,SD0);hfloor(SDX,HX1,SD1,HZ1);
const tileTex=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#F4F4F2';x.fillRect(0,0,w,h);x.strokeStyle='rgba(120,120,120,0.55)';x.lineWidth=2;for(let k=-w;k<2*w;k+=64){x.beginPath();x.moveTo(k,0);x.lineTo(k+h,h);x.stroke();x.beginPath();x.moveTo(k,h);x.lineTo(k+h,0);x.stroke();}},[4,4]);


const RX1W=W+T+4.39+0.38;
// north wall east of living room with bedroom door
B(W+T,4.18,0,H,D-0.07,Z0,wallMat,gBack);B(4.18,4.96,2.05,H,D-0.07,Z0,wallMat,gBack);B(4.96,HX1+TI,0,H,D-0.07,Z0,wallMat,gBack);B(HX1+TI,RX1W,0,H,D-0.07,D+0.05,wallMat,gBack);

[[4.11,4.18],[4.96,5.03]].forEach(([a,b])=>B(a,b,0,2.12,Z0,Z0+0.015,trim,gBack));B(4.11,5.03,2.05,2.12,Z0,Z0+0.015,trim,gBack);
[[2.83,2.9],[3.84,3.91]].forEach(([a,b])=>B(a,b,0,2.12,Z0,Z0+0.015,trim,gBack));B(2.83,3.91,2.05,2.12,Z0,Z0+0.015,trim,gBack);
B(HX0,2.83,0,0.06,Z0,Z0+0.012,white,gBack);B(3.91,4.11,0,0.06,Z0,Z0+0.012,white,gBack);B(5.03,HX1,0,0.06,Z0,Z0+0.012,white,gBack);
// west wall of hall (dining east wall) – trims on hall side, continuation along stair
B(HX0,HX0+0.015,0,2.12,Z0,Z0+0.04,trim,gDE);B(HX0,HX0+0.015,0,2.12,Z0+1.02,Z0+1.09,trim,gDE);B(HX0,HX0+0.015,2.05,2.12,Z0,Z0+1.09,trim,gDE);
B(HX0,HX0+0.012,0,0.06,Z0+1.09,SU0,white,gDE);
// east wall: bathroom door, kitchen opening
const EX=HX1,ET=TI;
B(EX,EX+ET,0,H,D+0.05,4.0,wallMat,gHE);B(EX,EX+ET,2.05,H,4.0,4.74,wallMat,gHE);B(EX,EX+ET,0,H,4.74,5.94,wallMat,gHE);B(EX,EX+ET,2.05,H,5.94,6.74,wallMat,gHE);B(EX,EX+ET,0,H,6.74,HZ1,wallMat,gHE);
[[3.93,4.0],[4.74,4.81],[5.87,5.94],[6.74,6.81]].forEach(([a,b])=>B(EX-0.015,EX,0,2.12,a,b,trim,gHE));B(EX-0.015,EX,2.05,2.12,3.93,4.81,trim,gHE);B(EX-0.015,EX,2.05,2.12,5.87,6.81,trim,gHE);
B(EX-0.012,EX,0,0.06,Z0,3.93,white,gHE);B(EX-0.012,EX,0,0.06,4.81,5.87,white,gHE);

const tileW=new THREE.MeshStandardMaterial({map:tileTex,roughness:0.3});


// hall furniture
const pine=M('#D29A5C',0.55);
B(EX-0.39,EX-0.01,0.03,1.12,4.84,5.85,pine);B(EX-0.41,EX-0.01,1.12,1.16,4.82,5.87,pine);
B(EX-0.395,EX-0.39,0.12,1.05,4.89,5.29,glass);
for(let k=0;k<5;k++){const y=0.12+k*0.19;B(EX-0.395,EX-0.39,y+0.02,y+0.17,5.35,5.81,M('#C38A4E',0.55));blob(EX-0.4,y+0.1,5.58,0.012,0.012,0.012,M('#8A8A8A',0.3,{metalness:0.8}));}
B(EX-0.42,EX-0.02,0,0.52,3.75,3.91,wicker);B(EX-0.43,EX-0.01,0.52,0.55,3.74,3.92,M('#EDE8DC',0.8));
const chestM=M('#1E1B18',0.5),redM=M('#B8202A',0.5);
B(HX0,HX0+0.48,0.04,0.6,5.15,6.1,chestM);B(HX0,HX0+0.5,0.6,0.63,5.13,6.12,redM);B(HX0,HX0+0.5,0.0,0.05,5.13,6.12,redM);
B(HX0+0.08,HX0+0.12,1.0,2.05,5.35,5.4,oak);B(HX0+0.08,HX0+0.12,1.0,2.05,5.85,5.9,oak);B(HX0+0.08,HX0+0.12,1.0,1.05,5.35,5.9,oak);B(HX0+0.08,HX0+0.12,2.0,2.05,5.35,5.9,oak);
B(HX0+0.07,HX0+0.08,1.05,2.0,5.4,5.85,M('#D5DEE2',0.08,{metalness:0.6}));
// stairs up (west side)
const stairM=M('#8A5530',0.5),stairTop=M('#9E6538',0.45);
const sofM=[stairM,stairM,stairM,white,stairM,stairM];
for(let i=0;i<NST;i++){const z0=SU0+i*STR,y=SRI*(i+1);B(HX0,SUX,y-0.08,y-0.03,z0,z0+STR,sofM);B(HX0,SUX,y-SRI,y-0.03,z0,z0+0.03,sofM);B(HX0,SUX+0.02,y-0.03,y,z0-0.02,z0+STR,stairTop);}
B(HX0,SUX+0.06,0,SRI,SU0-0.06,SU0+0.03,stairM);
const LY=SRI*NST,LZ=SU0+NST*STR;
// geschlossene Holzbrüstung + Handlauf an der Innenseite (zum Eingang hin)
cyl(SUX-0.03,SU0+0.02,0.05,0,1.1,stairTop,16);
{const rl=Math.hypot(LZ-SU0,LY);const rail=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,rl,10),stairTop);rail.position.set(SUX-0.03,1.0+LY/2,(SU0+LZ)/2);rail.rotation.x=Math.atan2(LZ-SU0,LY);scene.add(rail);
 const pr=new THREE.Mesh(new THREE.BoxGeometry(0.035,0.72,rl),stairM);pr.position.set(SUX-0.03,0.55+LY/2,(SU0+LZ)/2);pr.rotation.x=-Math.atan2(LY,LZ-SU0);scene.add(pr);}
// south end wall with window above landing, basement stair
B(XE,HX0,0,3.6,HZ1,HZ1+0.38,wallMat,gHS);B(HX0,3.12,0,SRI*(NST-1)-0.1,HZ1,HZ1+0.38,wallMat,gHS);B(3.88,SDX,0,SRI*(NST-1)-0.1,HZ1,HZ1+0.38,wallMat,gHS);B(3.12,3.88,-0.68+1.95,SRI*(NST-1)-0.1,HZ1,HZ1+0.38,wallMat,gHS);B(EX,EX+ET,0,3.6,HZ1,HZ1+0.38,wallMat,gHS);

// hall pendant
const shade=new THREE.Mesh(new THREE.SphereGeometry(0.22,24,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:col('#F2E6D2'),emissive:col('#FFE2B0'),emissiveIntensity:0.1,transparent:true,opacity:0.85,side:THREE.DoubleSide}));
shade.position.set(3.95,2.0,5.2);shade.userData.noShadow=1;scene.add(shade);deco(cyl(3.95,5.2,0.004,2.0,0.5,M('#B8924A',0.3,{metalness:0.8}),6));
const hLight=new THREE.PointLight(col('#FFD3A0'),0,6,2);hLight.position.set(3.95,1.9,5.2);scene.add(hLight);
// ---- Küche ----
const BZ1=rm('bedroom','tiefe',3.47)+0.12+rm('bath','tiefe',1.21),KX0=EX+ET,KX1=KX0+rm('kitchen','breite',3.08),KZ0=S-rm('kitchen','tiefe',3.1),KZ1=S,KT=0.38;
const gKE=new THREE.Group(),gKS=new THREE.Group(),gKN=new THREE.Group();scene.add(gKE,gKS,gKN);
hfloor(KX0,KX1,KZ0,KZ1);
const kFront=M('#F1ECE0',0.45),kPlinth=M('#DCD6C8',0.6),kTop=M('#2E2A28',0.35),kBar=M('#B9BCBE',0.3,{metalness:0.7}),kGap=M('#CFC8B8',0.6);
const marble=canvasTex(512,256,(x,w,h)=>{x.fillStyle='#302C2B';x.fillRect(0,0,w,h);for(let i=0;i<60;i++){x.strokeStyle=`rgba(${150+rnd()*40|0},${150+rnd()*40|0},${150+rnd()*40|0},${0.08+rnd()*0.2})`;x.lineWidth=0.5+rnd()*1.5;x.beginPath();let px=rnd()*w,py=rnd()*h;x.moveTo(px,py);for(let k=0;k<8;k++){px+=(rnd()-.5)*60;py+=(rnd()-.5)*40;x.lineTo(px,py);}x.stroke();}},[3,1]);
const marbleM=new THREE.MeshStandardMaterial({map:marble,roughness:0.3});
const kUnits=[];
function base(x0,x1,z0,z1,face,rows){kUnits.push([x0,x1,z0,z1,face,rows]);}
// walls
B(KX0,KX1+KT,0,H,BZ1,KZ0,wallMat,gKN);
B(KX0,KX1+KT,0,H,KZ1,KZ1+KT,wallMat,gKS);
const kw0=KZ0+0.97,kw1=KZ0+2.22,kwm=(kw0+kw1)/2;
B(KX1,KX1+KT,0,H,BZ1,kw0,wallMat,gKE);B(KX1,KX1+KT,0,H,kw1,KZ1+KT,wallMat,gKE);B(KX1,KX1+KT,0,0.95,kw0,kw1,wallMat,gKE);B(KX1,KX1+KT,2.2,H,kw0,kw1,wallMat,gKE);
B(KX1+0.14,KX1+0.22,0.95,1.02,kw0,kw1,pvc,gKE);B(KX1+0.14,KX1+0.22,2.13,2.2,kw0,kw1,pvc,gKE);B(KX1+0.14,KX1+0.22,0.95,2.2,kw0,kw0+0.07,pvc,gKE);B(KX1+0.14,KX1+0.22,0.95,2.2,kw1-0.07,kw1,pvc,gKE);B(KX1+0.13,KX1+0.22,0.95,2.2,kwm-0.05,kwm+0.05,pvc,gKE);
[[kw0+0.07,kwm-0.05],[kwm+0.05,kw1-0.07]].forEach(([a,b])=>{B(KX1+0.18,KX1+0.185,1.02,2.13,a,b,glass,gKE);const m=(a+b)/2;B(KX1+0.16,KX1+0.18,1.02,2.13,m-0.0125,m+0.0125,pvc,gKE);B(KX1+0.16,KX1+0.18,1.6-0.0125,1.6+0.0125,a,b,pvc,gKE);});
B(KX1-0.02,KX1+0.2,0.92,0.95,kw0-0.03,kw1+0.03,sillM,gKE);B(KX1-0.14,KX1,2.24,H,kw0-0.1,kw1+0.1,pvc,gKE);
// north run: hob, sink, backsplash, hood, wall cabinets
[[KX0,KX0+0.6,[0.78,0.55,0.3]],[KX0+0.6,KX0+1.8,[0.78,0.55,0.3]],[KX0+1.8,KX0+2.4,[0.8]],[KX0+2.4,KX0+3.0,[0.8]],[KX0+3.0,KX1,[]]].forEach(([a,b,r])=>base(a,b,KZ0,KZ0+0.6,'z+',r));
B(KX0,KX1,0.86,0.9,KZ0,KZ0+0.62,kTop);
B(KX0,KX1,0.9,1.58,KZ0,KZ0+0.012,marbleM);
B(KX0+0.75,KX0+1.55,0.9,0.906,KZ0+0.06,KZ0+0.56,M('#0E0E0E',0.1));
B(KX0+1.0,KX0+1.3,1.72,H,KZ0,KZ0+0.26,steel);B(KX0+0.7,KX0+1.6,1.6,1.68,KZ0,KZ0+0.5,steel);B(KX0+0.7,KX0+1.6,1.6,1.62,KZ0+0.48,KZ0+0.51,M('#111',0.2));
B(KX0+2.45,KX0+3.0,0.895,0.906,KZ0+0.08,KZ0+0.5,M('#E6DFD0',0.4));B(KX0+2.5,KX0+2.8,0.896,0.907,KZ0+0.12,KZ0+0.46,M('#CFC6B4',0.5));
cyl(KX0+2.65,KZ0+0.06,0.015,0.9,0.28,steel,10);B(KX0+2.64,KX0+2.66,1.16,1.18,KZ0+0.06,KZ0+0.2,steel);


// east run under window: knee space + radiator, drawers
base(KX1-0.6,KX1,KZ1-1.2,KZ1-0.6,'x-',[0.78,0.52,0.28]);
B(KX1-0.62,KX1,0.86,0.9,KZ0+0.6,KZ1-0.6,kTop);
B(KX1-0.13,KX1-0.04,0.18,0.68,kw0,kw1-0.3,rad);for(let z=kw0+0.01;z<kw1-0.31;z+=0.032)B(KX1-0.141,KX1-0.13,0.2,0.66,z,z+0.014,rad);
// south run: tall cabinet, fridge niche, oven column, drawers + corner
B(KX0+0.02,KX0+0.51,0,0.1,KZ1-0.55,KZ1,kPlinth);
B(KX0+0.53,KX0+0.55,0,2.35,KZ1-0.6,KZ1,kFront);B(KX0+1.46,KX0+1.48,0,2.35,KZ1-0.6,KZ1,kFront);B(KX0+0.55,KX0+1.46,2.0,2.35,KZ1-0.6,KZ1,kFront);B(KX0+0.55,KX0+1.46,1.82,1.84,KZ1-0.58,KZ1,kFront);


[['#B83A2E',0.62],['#2F6F73',0.72],['#E0AE3E',0.8]].forEach(([c,x])=>B(KX0+x,KX0+x+0.05,1.84,2.08,KZ1-0.5,KZ1-0.25,M(c,0.6)));blob(KX0+1.2,1.95,KZ1-0.3,0.14,0.1,0.14,wicker);
B(KX0+1.48,KX0+1.51,0.93,1.66,KZ1-0.6,KZ1,kFront);B(KX0+2.05,KX0+2.08,0.93,1.66,KZ1-0.6,KZ1,kFront);B(KX0+1.51,KX0+2.05,1.55,1.66,KZ1-0.6,KZ1,kFront);B(KX0+1.5,KX0+2.06,0,0.1,KZ1-0.55,KZ1,kPlinth);
B(KX0+1.51,KX0+2.05,1.55,1.64,KZ1-0.605,KZ1-0.6,steel);

[[KX0+2.08,KX0+2.68,[0.78,0.52,0.28]],[KX0+2.68,KX1,[0.78,0.52,0.28]]].forEach(([a,b,r])=>base(a,b,KZ1-0.6,KZ1,'z-',r));
B(KX0+2.08,KX1,0.86,0.9,KZ1-0.62,KZ1,kTop);B(KX0+2.08,KX0+3.0,0.9,1.4,KZ1-0.012,KZ1,marbleM);
B(KX0+2.3,KX0+2.6,0.9,1.15,KZ1-0.35,KZ1-0.1,M('#EDEDEA',0.3));B(KX1-0.5,KX1-0.2,0.9,1.12,KZ1-0.42,KZ1-0.14,M('#F2F2F0',0.3));
// white chair + step stool at window
const wc=M('#F4F2EC',0.5);
(function(){const g=new THREE.Group();const a=(x0,x1,y0,y1,z0,z1,m)=>B(x0,x1,y0,y1,z0,z1,m||wc,g);
  [[-0.19,-0.19],[0.16,-0.19],[-0.19,0.16],[0.16,0.16]].forEach(([p,q])=>a(p,p+0.03,0,0.45,q,q+0.03));
  a(-0.2,0.2,0.45,0.48,-0.2,0.2);a(-0.18,0.18,0.48,0.52,-0.18,0.18,M('#2E3F5E',0.9));
  a(-0.19,-0.16,0.45,0.95,-0.2,-0.17);a(0.16,0.19,0.45,0.95,-0.2,-0.17);a(-0.19,0.19,0.8,0.93,-0.21,-0.17);a(-0.16,0.16,0.7,0.92,-0.23,-0.21,M('#C4262E',0.9));
  g.position.set(KX1-0.5,0,kw0+0.5);g.rotation.y=PI2/2;scene.add(g);})();
B(KX1-0.95,KX1-0.65,0,0.24,kw0+0.05,kw0+0.35,M('#AEB6BC',0.6));
const kLight=new THREE.PointLight(col('#FFF1DC'),0,7,2);kLight.position.set((KX0+KX1)/2,2.3,(KZ0+KZ1)/2);scene.add(kLight);
deco(cyl((KX0+KX1)/2,(KZ0+KZ1)/2,0.22,2.44,0.06,new THREE.MeshStandardMaterial({color:col('#FAFAF7'),emissive:col('#FFF6E6'),emissiveIntensity:0.2}),32));
// ---- generic window ----
let __S=0;{const _add=THREE.Object3D.prototype.add;THREE.Object3D.prototype.add=function(...a){if(__S>0)a.forEach(o=>o&&o.userData&&(o.userData.struct=1));return _add.apply(this,a);};}
const __wrapS=f=>function(...a){__S++;try{return f.apply(this,a);}finally{__S--;}};
win=__wrapS(win); // sash, sashFrame, addShutter, belt, stripDoor werden am Anfang von eg-bedienung.js umhüllt (dort definiert)
function win(o){const g=o.g,f=o.f,sg=o.s;
  const P=(a,b,y0,y1,d0,d1,m)=>{const e0=f+sg*d0,e1=f+sg*d1,lo=Math.min(e0,e1),hi=Math.max(e0,e1);return o.ax==='z'?B(a,b,y0,y1,lo,hi,m,g):B(lo,hi,y0,y1,a,b,m,g);};
  const gl=o.frost?new THREE.MeshStandardMaterial({color:col('#F6EFE6'),emissive:col('#F3E6D6'),emissiveIntensity:0.45,roughness:0.6}):glass;
  const {a0,a1,y0,y1}=o,n=o.sashes||2,mw=0.1,fw=0.07,sw=(a1-a0-2*fw-(n-1)*mw)/n;
  P(a0,a1,y0,y0+fw,0.16,0.24,pvc);P(a0,a1,y1-fw,y1,0.16,0.24,pvc);P(a0,a0+fw,y0,y1,0.16,0.24,pvc);P(a1-fw,a1,y0,y1,0.16,0.24,pvc);
  for(let i=0;i<n;i++){const a=a0+fw+i*(sw+mw),b=a+sw;if(i<n-1)P(b,b+mw,y0,y1,0.15,0.24,pvc);
    P(a,b,y0+fw,y1-fw,0.2,0.205,gl);const m=(a+b)/2;P(m-0.0125,m+0.0125,y0+fw,y1-fw,0.18,0.2,pvc);
    (o.rows||[0.55]).forEach(t=>{const y=y0+fw+(y1-y0-2*fw)*t;P(a,b,y-0.0125,y+0.0125,0.18,0.2,pvc);});}
  if(!o.noSill)P(a0-0.04,a1+0.04,y0-0.035,y0,-0.05,0.2,sillM);
  if(!o.noBox)P(a0-0.1,a1+0.1,2.24,H,-0.14,0,pvc);}
// ---- Bad ----
const BX0=KX0,BX1=KX0+rm('bath','breite',3.08),BZ0=BZ1-rm('bath','tiefe',1.21),PW=0.37,PD=0.38;
const gBaE=new THREE.Group();scene.add(gBaE);
function RXW(){return BX1+0.38;}
const tf=new THREE.Mesh(new THREE.PlaneGeometry(BX1-BX0,BZ1-BZ0),new THREE.MeshStandardMaterial({map:(()=>{const t=tileTex.clone();t.needsUpdate=true;t.repeat.set((BX1-BX0)/0.6,(BZ1-BZ0)/0.6);return t;})(),roughness:0.3}));
tf.rotation.x=-Math.PI/2;tf.position.set((BX0+BX1)/2,0.002,(BZ0+BZ1)/2);tf.userData.noShadow=1;scene.add(tf);
const wtTex=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#F5F5F3';x.fillRect(0,0,w,h);for(let i=0;i<14;i++){x.strokeStyle='rgba(170,170,175,0.25)';x.lineWidth=1+rnd()*2;x.beginPath();let px=rnd()*w,py=rnd()*h;x.moveTo(px,py);for(let k=0;k<5;k++){px+=(rnd()-.3)*50;py+=(rnd()-.5)*30;x.lineTo(px,py);}x.stroke();}x.strokeStyle='rgba(130,130,130,0.6)';x.lineWidth=3;x.strokeRect(0,0,w,h);},[1,1]);
function tileWall(ax,f,a0,a1,y0,y1,g,flip){const t=wtTex.clone();t.needsUpdate=true;t.repeat.set((a1-a0)/0.2,(y1-y0)/0.25);t.offset.set(0,(y0%0.25)/0.25);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(a1-a0,y1-y0),new THREE.MeshStandardMaterial({map:t,roughness:0.25}));
  if(ax==='z'){m.position.set((a0+a1)/2,(y0+y1)/2,f);if(flip)m.rotation.y=Math.PI;}else{m.position.set(f,(y0+y1)/2,(a0+a1)/2);m.rotation.y=flip?-Math.PI/2:Math.PI/2;}
  m.userData.noShadow=1;registerPaintableWall(m,1);(g||scene).add(m);return m;}
const brd=canvasTex(512,32,(x,w,h)=>{x.fillStyle='#E8E4DE';x.fillRect(0,0,w,h);for(let i=0;i<w;i+=32){x.fillStyle='#8A6E7A';x.beginPath();x.arc(i+16,16,8,0,7);x.fill();x.fillStyle='#4E6A8A';x.beginPath();x.arc(i+16,16,4,0,7);x.fill();x.fillStyle='#9A8E86';x.fillRect(i,2,32,3);x.fillRect(i,h-5,32,3);}},[6,1]);
function border(ax,f,a0,a1,g,flip){const t=brd.clone();t.needsUpdate=true;t.repeat.set((a1-a0)/0.25,1);const m=new THREE.Mesh(new THREE.PlaneGeometry(a1-a0,0.06),new THREE.MeshStandardMaterial({map:t,roughness:0.3}));
  if(ax==='z'){m.position.set((a0+a1)/2,1.9,f);if(flip)m.rotation.y=Math.PI;}else{m.position.set(f,1.9,(a0+a1)/2);m.rotation.y=flip?-Math.PI/2:Math.PI/2;}registerPaintableWall(m,1);(g||scene).add(m);}
const TH=2.1;
tileWall('z',BZ0+0.003,BX0,BX1,0,TH);border('z',BZ0+0.005,BX0,BX1);
tileWall('z',BZ1-0.003,BX0,BX1,0,TH,null,true);border('z',BZ1-0.005,BX0,BX1,null,true);
tileWall('x',BX0+0.003,4.74,BZ1,0,TH);tileWall('x',BX0+0.003,BZ0+PD,4.0,0,TH);
B(BX0,BX0+PW,0,H,BZ0,BZ0+PD,wallMat);tileWall('x',BX0+PW+0.003,BZ0,BZ0+PD,0,TH);tileWall('z',BZ0+PD+0.003,BX0,BX0+PW,0,TH);border('x',BX0+PW+0.005,BZ0,BZ0+PD);border('z',BZ0+PD+0.005,BX0,BX0+PW);
const bw0=BZ0+0.25,bw1=BZ0+0.95;
B(BX1,BX1+0.38,0,H,BZ0-0.12,bw0,wallMat,gBaE);B(BX1,BX1+0.38,0,H,bw1,KZ0,wallMat,gBaE);B(BX1,BX1+0.38,0,1.1,bw0,bw1,wallMat,gBaE);B(BX1,BX1+0.38,2.15,H,bw0,bw1,wallMat,gBaE);
win({ax:'x',f:BX1,s:1,a0:bw0,a1:bw1,y0:1.1,y1:2.15,g:gBaE,sashes:1,rows:[0.72],frost:1,noSill:1,noBox:1});
B(BX1-0.18,BX1,0,1.1,BZ0,BZ1,M('#F2F2F0',0.4),gBaE);tileWall('x',BX1-0.183,BZ0,BZ1,0,1.1,gBaE,true);B(BX1-0.2,BX1,1.1,1.13,BZ0,BZ1,M('#F5F5F3',0.3),gBaE);
tileWall('x',BX1-0.003,BZ0,bw0,1.13,TH,gBaE,true);tileWall('x',BX1-0.003,bw1,BZ1,1.13,TH,gBaE,true);
const porc=M('#FBFBFA',0.2),chrome=M('#D4D8DC',0.3,{metalness:0.35});
blob(6.05,0.8,BZ0+0.24,0.26,0.09,0.22,porc);cyl(6.05,BZ0+0.1,0.03,0.4,0.35,chrome,10);cyl(6.05,BZ0+0.08,0.015,0.88,0.14,chrome,10);
B(5.79,6.31,1.05,1.09,BZ0,BZ0+0.1,M('#F5F5F3',0.3));
const mir=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.6),M('#E4ECF0',0.1,{metalness:0.2}));mir.position.set(6.05,1.55,BZ0+0.012);scene.add(mir);
cyl(6.05,BZ0+0.05,0.02,1.92,0.02,chrome,8);blob(5.95,1.95,BZ0+0.1,0.04,0.05,0.04,M('#EDEDED',0.3));blob(6.15,1.95,BZ0+0.1,0.04,0.05,0.04,M('#EDEDED',0.3));
const shx0=6.33,shx1=7.2,sz1=BZ0+0.8;
B(shx0,shx1,0,0.22,BZ0,sz1,M('#F2F2F0',0.3));tileWall('z',sz1+0.002,shx0,shx1,0,0.22,null,true);B(shx0+0.03,shx1-0.03,0.22,0.24,BZ0+0.03,sz1-0.03,porc);
B(shx1,shx1+0.1,0,TH,BZ0,sz1,M('#F2F2F0',0.3));tileWall('x',shx1+0.103,BZ0,sz1,0,TH,null,false);tileWall('x',shx1-0.003,BZ0,sz1,0,TH,null,true);
const sg=new THREE.MeshStandardMaterial({color:col('#DDE8EC'),transparent:true,opacity:0.22,roughness:0.05,depthWrite:false});
B(shx0,shx1,0.24,2.0,sz1-0.01,sz1,sg);B(shx0,shx0+0.01,0.24,2.0,BZ0,sz1,sg);
B(shx0,shx1,1.98,2.0,sz1-0.015,sz1+0.005,chrome);B(shx0-0.005,shx0+0.015,0.24,2.0,sz1-0.015,sz1+0.005,chrome);B(shx0-0.005,shx0+0.015,1.98,2.0,BZ0,sz1,chrome);
cyl(6.8,BZ0+0.03,0.012,1.2,0.9,chrome,8);blob(6.8,2.1,BZ0+0.08,0.05,0.02,0.05,chrome);
blob(7.62,0.3,BZ0+0.42,0.19,0.22,0.27,porc);const seat=new THREE.Mesh(new THREE.TorusGeometry(0.15,0.035,10,28),porc);seat.rotation.x=Math.PI/2;seat.scale.set(1,1.35,1);seat.position.set(7.62,0.45,BZ0+0.45);scene.add(seat);
B(7.44,7.8,0.45,0.85,BZ0,BZ0+0.14,porc);
B(7.47,7.77,0,0.2,BZ0+0.62,BZ0+0.85,M('#F4F4F2',0.4));
cyl(BX1-0.2,BZ0+1.0,0.06,0.9,0.12,porc,20);B(BX1-0.22,BX1-0.2,0.95,0.97,BZ0+0.95,BZ0+1.05,chrome);
B(7.75,8.25,0.3,1.75,BZ1-0.09,BZ1-0.07,M('#F7F7F4',0.3));for(let y=0.35;y<1.72;y+=0.08)B(7.75,8.25,y,y+0.025,BZ1-0.1,BZ1-0.06,M('#F7F7F4',0.3));
blob(6.3,1.2,BZ1-0.08,0.18,0.48,0.07,M('#6E1F2E',0.9));blob(6.55,1.25,BZ1-0.08,0.14,0.42,0.06,M('#C9A57A',0.9));
B(6.35,7.15,0.003,0.012,BZ0+0.84,BZ1-0.03,M('#4A4648',0.95));
cyl(8.3,BZ1-0.2,0.1,0,0.3,M('#FAFAFA',0.3),20);
// ---- Schlafzimmer ----
const RX0=W+T,RX1=RX0+rm('bedroom','breite',4.39),RZ0=0,RZ1=rm('bedroom','tiefe',3.47);
const gBN=new THREE.Group(),gBE=new THREE.Group();scene.add(gBN,gBE);
(function(){const t=ftA.clone();t.needsUpdate=true;t.repeat.set((RX1-RX0)/2.4,(RZ1-RZ0)/2.4);const m=new THREE.Mesh(new THREE.PlaneGeometry(RX1-RX0,RZ1-RZ0),new THREE.MeshStandardMaterial({map:t,roughness:0.42}));m.rotation.x=-Math.PI/2;m.position.set((RX0+RX1)/2,0.001,(RZ0+RZ1)/2);m.userData.noShadow=1;scene.add(m);})();
const nw0=5.3,nw1=7.1;
B(RX0-T,nw0,0,H,RZ0-0.38,RZ0,wallMat,gBN);B(nw1,RX1+0.38,0,H,RZ0-0.38,RZ0,wallMat,gBN);B(nw0,nw1,0,0.95,RZ0-0.38,RZ0,wallMat,gBN);B(nw0,nw1,2.2,H,RZ0-0.38,RZ0,wallMat,gBN);
win({ax:'z',f:RZ0,s:-1,a0:nw0,a1:nw1,y0:0.95,y1:2.2,g:gBN,rows:[0.53]});
const ew0=0.95,ew1=2.35;
B(RX1,RX1+0.38,0,H,RZ0-0.38,ew0,wallMat,gBE);B(RX1,RX1+0.38,0,H,ew1,RZ1+0.25,wallMat,gBE);B(RX1,RX1+0.38,0,0.95,ew0,ew1,wallMat,gBE);B(RX1,RX1+0.38,2.2,H,ew0,ew1,wallMat,gBE);
win({ax:'x',f:RX1,s:1,a0:ew0,a1:ew1,y0:0.95,y1:2.2,g:gBE,rows:[0.45]});
B(RX1-0.13,RX1-0.11,0.05,2.35,ew0-0.25,ew1+0.25,new THREE.MeshStandardMaterial({color:col('#FFFFFF'),transparent:true,opacity:0.7,roughness:0.9,side:THREE.DoubleSide}),gBE);
cyl(RX1-0.12,(ew0+ew1)/2,0.01,2.36,0.02,chrome,6);
B(nw0+0.05,nw1-0.05,0.14,0.7,RZ0+0.03,RZ0+0.12,rad);
B(RX0,RX0+0.012,0,0.06,RZ0,RZ1,white);B(RX0,RX1,0,0.06,RZ0,RZ0+0.012,white,gBN);B(RX1-0.012,RX1,0,0.06,RZ0,RZ1,white,gBE);B(5.03,RX1,0,0.06,RZ1-0.012,RZ1,white);
const wood2=M('#C8924E',0.5);
B(RX0,RX0+0.6,0,2.25,0.3,2.6,wood2);
for(let k=1;k<5;k++){const z=0.3+k*0.46;B(RX0+0.6,RX0+0.602,0,2.25,z-0.003,z+0.003,M('#8A6232',0.6));}
B(RX0+0.601,RX0+0.605,0.1,2.15,1.24,1.66,M('#D5DEE2',0.05,{metalness:0.7}));
[0.76,1.22,1.68,2.14].forEach(z=>B(RX0+0.6,RX0+0.62,1.0,1.2,z-0.03,z-0.02,M('#333',0.4)));
const bx0=5.75,bx1=7.35,bz0=1.44;
B(bx0,bx1,0.08,0.42,bz0,RZ1,M('#D9A86A',0.5));[[bx0,bz0],[bx1-0.07,bz0]].forEach(([x,z])=>B(x,x+0.07,0,0.08,z,z+0.07,M('#D9A86A',0.5)));
B(bx0+0.04,bx1-0.04,0.42,0.58,bz0+0.04,RZ1-0.02,M('#7E2A7A',0.8));
slab(bx0+0.02,bx1-0.02,bz0+0.02,RZ1-0.45,0.56,0.1,0.05,M('#7FA8A6',0.9));
blob(6.15,0.66,RZ1-0.25,0.33,0.08,0.18,M('#8FB5B2',0.9));blob(6.95,0.66,RZ1-0.25,0.33,0.08,0.18,M('#C8E04A',0.8));
B(bx0-0.02,bx1+0.02,0.3,1.0,RZ1-0.08,RZ1,M('#4A4744',0.8));
B(5.28,5.7,0,0.55,RZ1-0.45,RZ1-0.02,M('#4A4744',0.8));
B(4.8,5.4,0,0.28,1.9,2.3,M('#6E7478',0.6));
chair(5.95,RZ0+0.55,0);
B(5.1,5.55,0,0.42,RZ0+0.3,RZ0+0.75,M('#222',0.8));B(5.1,5.55,0.42,0.85,RZ0+0.3,RZ0+0.36,M('#222',0.8));B(5.12,5.53,0.44,0.8,RZ0+0.3,RZ0+0.55,M('#C23A3A',0.9));
B(6.9,7.25,0,0.6,RZ0+0.12,RZ0+0.4,M('#F4F4F2',0.35));B(6.92,7.23,0.6,0.61,RZ0+0.14,RZ0+0.38,M('#222',0.5));
cyl(7.6,RZ0+0.35,0.14,0,0.02,M('#F4F4F2',0.3),20);cyl(7.6,RZ0+0.35,0.015,0.02,1.0,M('#F4F4F2',0.3),8);
const fan=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,0.08,24),M('#F4F4F2',0.4));fan.rotation.x=Math.PI/2;fan.position.set(7.6,1.1,RZ0+0.35);scene.add(fan);
B(7.95,8.35,0,1.0,0.35,1.1,M('#B8BCC0',0.5));B(7.97,8.33,0.3,0.95,0.37,1.08,M('#8A8274',0.9));
const loader=new THREE.TextureLoader();
function art(key,w,h,x,y,z,rotY,parent,o={}){
  const t=loader.load(window.ART[key]);t.encoding=THREE.sRGBEncoding;t.anisotropy=renderer.capabilities.getMaxAnisotropy();
  const m=new THREE.MeshStandardMaterial({map:t,roughness:0.75,transparent:!!o.alpha,alphaTest:o.alpha?0.4:0,opacity:o.alpha?0.92:1,side:(o.alpha||o.ds)?THREE.DoubleSide:THREE.FrontSide});
  const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);p.userData.wall=1;p.rotation.y=rotY;p.position.set(x,y,z);(parent||scene).add(p);return p;
}
const backing=Mu('#6E5A2E',0.6),PI=Math.PI;
art('rooster1',0.52,0.53,W-0.03,1.625,1.07,-PI/2,gRight);B(W-0.028,W,1.37,1.88,0.82,1.32,backing,gRight);
art('rooster2',0.52,0.53,W-0.03,1.625,1.94,-PI/2,gRight);B(W-0.028,W,1.37,1.88,1.69,2.19,backing,gRight);
art('kids_east',0.37,0.46,W-0.004,1.39,0.215,-PI/2,gRight);
art('portrait_tv',0.58,0.65,0.03,1.725,0.9,PI/2,gLeft);B(0,0.028,1.41,2.04,0.62,1.18,backing,gLeft);
art('girl',0.36,0.54,0.03,1.87,3.05,PI/2,gLeft);B(0,0.028,1.61,2.13,2.88,3.22,backing,gLeft);
art('kids_west',0.6,0.55,0.004,1.22,3.05,PI/2,gLeft);
art('rainbow',0.39,0.31,0.555,2.045,0.004,0,gWin);
art('calendar',0.34,0.45,2.55,1.805,D-0.154,PI,gBack);
art('h1',0.19,0.22,1.675,1.78,-0.197,0,gWin,{alpha:1});
art('h2',0.21,0.21,2.225,1.795,-0.197,0,gWin,{alpha:1});
art('h3',0.21,0.24,2.565,1.81,-0.197,0,gWin,{alpha:1});
art('winsq',0.3,0.21,2.4,1.385,-0.197,0,gWin,{ds:1});
art('pinboard',0.86,0.58,XE-0.012,1.62,S-0.6,-PI/2,gDE);B(XE-0.01,XE,1.32,1.92,S-1.04,S-0.16,M('#B8BCC0',0.3,{metalness:0.6}),gDE);
art('leaves',0.42,0.3,XE-0.004,1.75,Z0+2.55,-PI/2,gDE);
art('flower',0.25,0.25,XE-0.006,1.45,Z0+2.25,-PI/2,gDE,{alpha:1});
art('wreath',0.3,0.4,XW+0.004,1.55,3.95,PI/2,gDW);
{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);const d=x.getImageData(0,0,c.width,c.height),p=d.data;
  for(let i=0;i<p.length;i+=4){const r=p[i],g=p[i+1],b=p[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);if(mn>70&&mx-mn<42)p[i+3]=0;}x.putImageData(d,0,0);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;const m=new THREE.MeshStandardMaterial({map:t,emissive:col('#FFFFFF'),emissiveMap:t,emissiveIntensity:0.45,roughness:0.8,transparent:true,alphaTest:0.3});
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.0,0.82),m);pl.position.set(Math.min(RX1-0.6,nw1+0.68),1.62,RZ0+0.006);pl.userData.deco=1;gBN.add(pl);};img.src=window.ART.wingheart;}
art('chest',0.44,0.52,HX0+0.24,0.33,5.125,PI);art('chest',0.9,0.52,HX0+0.485,0.33,5.625,PI/2);

B(1.72,2.24,0,0.55,3.2,3.52,teal);
B(1.76,2.2,0.06,0.5,3.19,3.2,M('#245659',0.6));
const bookCols=['#E0AE3E','#C9633F','#B85C8A','#F2E8D5','#5A8FC7','#8FAE8B'];
let bx=1.76;bookCols.forEach((c,i)=>{const w=0.03+(i%3)*0.012,hh=0.2+(i%2)*0.05;B(bx,bx+w,0.55,0.55+hh,3.27,3.47,M(c,0.8));bx+=w+0.004;});
deco(cyl(2.15,3.36,0.055,0.55,0.12,M('#F2E8D5',0.6),20));deco(blob(2.15,0.72,3.36,0.09,0.08,0.09,M('#5E9A55',0.8)));

const lampOn=new THREE.MeshStandardMaterial({color:col('#FFF3D6'),emissive:col('#FFD9A0'),emissiveIntensity:0.15,roughness:0.9});
deco(cyl(3.62,2.22,0.14,0,0.02,M('#2B2A27',0.4),24));deco(cyl(3.62,2.22,0.012,0.02,0.95,M('#2B2A27',0.4),8));
const lantern=blob(3.62,1.15,2.22,0.22,0.22,0.22,lampOn);lantern.userData.noShadow=true;
const lampLight=new THREE.PointLight(col('#FFC98A'),0,5,2);lampLight.position.set(3.62,1.15,2.22);scene.add(lampLight);

deco(cyl(2.0,1.25,0.004,2.0,0.5,M('#2B2A27',0.5),6));
const rattan=new THREE.Mesh(new THREE.SphereGeometry(0.24,18,12),new THREE.MeshStandardMaterial({color:col('#C89A55'),wireframe:true}));
rattan.position.set(2.0,1.82,1.25);scene.add(rattan);
const bulb=blob(2.0,1.82,1.25,0.05,0.05,0.05,lampOn);bulb.userData.noShadow=true;
const pendLight=new THREE.PointLight(col('#FFC98A'),0,5,2);pendLight.position.set(2.0,1.75,1.25);scene.add(pendLight);

const hemi=new THREE.HemisphereLight(col('#E4EEF8'),col('#B89A74'),0.6);scene.add(hemi);
const amb=new THREE.AmbientLight(0xffffff,0.12);scene.add(amb);
const sun=new THREE.DirectionalLight(col('#FFF1DC'),1.7);
sun.position.set(1.2,4.2,-4.5);sun.target.position.set(3.0,0,4.8);scene.add(sun,sun.target);
sun.castShadow=true;sun.shadow.mapSize.set(__mob?1024:2048,__mob?1024:2048);
Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:0.5,far:26});
sun.shadow.bias=-0.001;sun.shadow.normalBias=0.04;
const side=new THREE.DirectionalLight(col('#EAF2FF'),0.45);side.position.set(-5,3,2.1);scene.add(side);

scene.traverse(o=>{if(o.isMesh){const tr=o.material&&o.material.transparent;o.castShadow=!tr&&!o.userData.noShadow;o.receiveShadow=true;}});
floor.castShadow=false;dining.castShadow=false;


// ---- Maße ----
const dimG=new THREE.Group();dimG.visible=false;scene.add(dimG);
const dimLineM=new THREE.LineBasicMaterial({color:0x1F4E79,depthTest:false,transparent:true});
const fmt=v=>(Math.round(v*100)/100).toFixed(2).replace('.',',')+' m';
function label(txt,x,y,z,big){
  const c=document.createElement('canvas'),fs=big?44:40,pad=14;const g=c.getContext('2d');g.font=`600 ${fs}px Bricolage Grotesque, system-ui, sans-serif`;
  const w=Math.ceil(g.measureText(txt).width)+pad*2,h=fs+pad*1.4;c.width=w;c.height=h;
  g.font=`600 ${fs}px Bricolage Grotesque, system-ui, sans-serif`;g.fillStyle=big?'rgba(31,78,121,0.92)':'rgba(255,255,255,0.94)';
  const r=h/2;g.beginPath();g.moveTo(r,0);g.lineTo(w-r,0);g.arc(w-r,r,r,-Math.PI/2,Math.PI/2);g.lineTo(r,h);g.arc(r,r,r,Math.PI/2,Math.PI*1.5);g.fill();
  if(!big){g.strokeStyle='#1F4E79';g.lineWidth=3;g.stroke();}
  g.fillStyle=big?'#FFFFFF':'#1F4E79';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,w/2,h/2+2);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true}));
  const sc=big?0.0046:0.0038;sp.scale.set(w*sc,h*sc,1);sp.position.set(x,y,z);sp.renderOrder=999;dimG.add(sp);return sp;}
function dline(pts){const g=new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(...p)));const l=new THREE.Line(g,dimLineM);l.renderOrder=998;dimG.add(l);}
function dimX(x0,x1,z,y){y=y||0.05;dline([[x0,y,z],[x1,y,z]]);[x0,x1].forEach(x=>dline([[x,y,z-0.1],[x,y,z+0.1]]));label(fmt(x1-x0),(x0+x1)/2,y+0.08,z);}
function dimZ(z0,z1,x,y){y=y||0.05;dline([[x,y,z0],[x,y,z1]]);[z0,z1].forEach(z=>dline([[x-0.1,y,z],[x+0.1,y,z]]));label(fmt(z1-z0),x,y+0.08,(z0+z1)/2);}
function room(name,x0,x1,z0,z1,o={}){
  const ix=o.ix!=null?o.ix:0.35,iz=o.iz!=null?o.iz:0.35;
  dimX(x0,x1,o.zx!=null?o.zx:z0+iz);dimZ(z0,z1,o.xz!=null?o.xz:x0+ix);
  label(name,o.lx!=null?o.lx:(x0+x1)/2,1.2,o.lz!=null?o.lz:(z0+z1)/2,true);}
room('Wohnzimmer',0,W,0,D,{zx:D-0.45,xz:W-0.7,lx:1.7,lz:1.0});
room('Esszimmer',XW,XE,Z0,S,{zx:Z0+1.3,xz:XE-0.55,lz:Z0+3.1});
room('Flur',HX0,HX1,Z0,SU0,{zx:Z0+0.55,xz:(HX0+HX1)/2,lz:Z0+1.6});
room('Küche',KX0,KX1,KZ0,KZ1,{zx:KZ0+1.2,xz:KX0+1.0,lx:KX0+2.1,lz:KZ0+2.2});
room('Bad',BX0,BX1,BZ0,BZ1,{zx:BZ1-0.2,xz:BX0+2.4,lx:BX0+1.1,lz:BZ0+0.45});
room('Schlafzimmer',RX0,RX1,RZ0,RZ1,{zx:RZ0+0.5,xz:RX1-0.35,lx:RX0+2.0,lz:1.2});
room('Terrasse',XW-RV2+0.15,-RV,-RV+0.12,D,{zx:0.3,xz:-RV-0.35,lz:2.6});
[['Treppe hoch',(HX0+SUX)/2,(SU0+HZ1)/2],['Eingang',(SDX+HX1)/2,(SD0+SD1)/2]].forEach(([t,x,z])=>label(t,x,2.4,z));
const dimBtn=document.getElementById('dims');
dimBtn.addEventListener('click',()=>{const on=dimBtn.getAttribute('aria-pressed')!=='true';dimBtn.setAttribute('aria-pressed',String(on));dimG.visible=on;});
