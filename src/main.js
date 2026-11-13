(function(){
if(!window.THREE||!THREE.OrbitControls){document.getElementById('err').style.display='flex';return;}
const stage=document.getElementById('stage');
const renderer=new THREE.WebGLRenderer({antialias:true});
const __mob=window.matchMedia('(pointer: coarse)').matches,__prMax=Math.min(window.devicePixelRatio,__mob?1.75:2);let __pr=__prMax;renderer.setPixelRatio(__pr);let __ft=0,__fn=0,__fl=performance.now();
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;let __shF=0;
stage.prepend(renderer.domElement);

const scene=new THREE.Scene();
const DAY_BG=new THREE.Color('#CFE0EE').convertSRGBToLinear();
const NIGHT_BG=new THREE.Color('#1C2536').convertSRGBToLinear();
scene.background=DAY_BG.clone();

const camera=new THREE.PerspectiveCamera(50,1,0.1,80);
const controls=new THREE.OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.maxPolarAngle=Math.PI*0.6;
controls.minDistance=0.3;
controls.maxDistance=14;

const col=h=>new THREE.Color(h).convertSRGBToLinear();
const Mu=(h,r=0.85,extra={})=>new THREE.MeshStandardMaterial(Object.assign({color:col(h),roughness:r,metalness:0},extra));
const __MC=new Map();
const M=(h,r=0.85,extra={})=>{if(Object.values(extra).some(v=>v!==null&&typeof v==='object'))return Mu(h,r,extra);const k=h+'|'+r+'|'+JSON.stringify(extra);let m=__MC.get(k);if(!m){m=Mu(h,r,extra);__MC.set(k,m);}return m;};
let wallPaintSerial=0;
// Streichbare Wand nur kennzeichnen; die Farbe wird im Einrichtungsmodus (einrichten.js) per Vertexfarbe gesetzt,
// damit die Wände weiter zu wenigen Meshes zusammengefasst werden können.
function registerPaintableWall(mesh,faceCount,sloped){mesh.userData.paintWall='w'+wallPaintSerial++;mesh.userData.wall=1;if(sloped)mesh.userData.paintWallSloped=1;}
function B(x0,x1,y0,y1,z0,z1,m,parent){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0),m);
  mesh.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);
  if(m&&m.userData&&m.userData.paintableWall)registerPaintableWall(mesh,mesh.geometry.groups.length||1);
  (parent||scene).add(mesh);return mesh;
}
function rr(x0,y0,x1,y1,r){
  const s=new THREE.Shape();
  s.moveTo(x0+r,y0);s.lineTo(x1-r,y0);s.quadraticCurveTo(x1,y0,x1,y0+r);
  s.lineTo(x1,y1-r);s.quadraticCurveTo(x1,y1,x1-r,y1);s.lineTo(x0+r,y1);
  s.quadraticCurveTo(x0,y1,x0,y1-r);s.lineTo(x0,y0+r);s.quadraticCurveTo(x0,y0,x0+r,y0);
  return s;
}
function slab(x0,x1,z0,z1,y0,h,r,m){
  const b=0.03;
  const g=new THREE.ExtrudeGeometry(rr(x0+b,z0+b,x1-b,z1-b,r),{depth:h-2*b,bevelEnabled:true,bevelSize:b,bevelThickness:b,bevelSegments:4,curveSegments:8});
  g.rotateX(Math.PI/2);
  const mesh=new THREE.Mesh(g,m);mesh.position.y=y0+h-b;scene.add(mesh);return mesh;
}
function cyl(x,z,r,y0,h,m,seg=32,parent){
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg),m);
  mesh.position.set(x,y0+h/2,z);(parent||scene).add(mesh);return mesh;
}
function blob(x,y,z,sx,sy,sz,m){
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,28,18),m);
  mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);scene.add(mesh);return mesh;
}
function deco(o){o.userData.deco=1;return o;}
function canvasTex(w,h,draw,rep){
  const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;
  t.anisotropy=renderer.capabilities.getMaxAnisotropy();
  if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}
  return t;
}
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};

const W=3.9,D=3.54,H=2.59,T=0.18;

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

const TI=0.235,XW=-1.95,XE=XW+4.67,S=D+T+4.30,Z0=D+T,PI2=Math.PI;
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
const HX0=XE+TI,HX1=HX0+2.2,HZ1=S,SUX=HX0+1.05,SDX=HX1-1.12,SD0=6.85,SD1=S,NST=8,STR=0.24,SRI=0.185,SU0=HZ1+0.3-NST*STR;
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
const BZ1=3.47+0.12+1.21,KX0=EX+ET,KX1=KX0+3.08,KZ0=S-3.1,KZ1=S,KT=0.38;
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
{win=__wrapS(win);sash=__wrapS(sash);sashFrame=__wrapS(sashFrame);addShutter=__wrapS(addShutter);belt=__wrapS(belt);stripDoor=__wrapS(stripDoor);}
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
const BX0=KX0,BX1=KX0+3.08,BZ0=BZ1-1.21,PW=0.37,PD=0.38;
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
const RX0=W+T,RX1=RX0+4.39,RZ0=0,RZ1=3.47;
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
function sash(ax,g,a0,a1,y0,y1,bandA,bandB,pd,dir,hy,flip){
  const lo=Math.min(bandA,bandB),hi=Math.max(bandA,bandB),sf=0.045;
  // sash frame
  if(ax==='z'){B(a0,a1,y0,y0+sf,pd-0.02,pd+0.02,pvc,g);B(a0,a1,y1-sf,y1,pd-0.02,pd+0.02,pvc,g);B(a0,a0+sf,y0,y1,pd-0.02,pd+0.02,pvc,g);B(a1-sf,a1,y0,y1,pd-0.02,pd+0.02,pvc,g);}
  else{B(pd-0.02,pd+0.02,y0,y0+sf,a0,a1,pvc,g);B(pd-0.02,pd+0.02,y1-sf,y1,a0,a1,pvc,g);B(pd-0.02,pd+0.02,y0,y1,a0,a0+sf,pvc,g);B(pd-0.02,pd+0.02,y0,y1,a1-sf,a1,pvc,g);}
  const hA=flip?a1:a0,hx=flip?a0+0.04:a1-0.04,face=pd+dir*0.045,hs=winHandle(ax,face,dir,hx,hy,g);
  g.updateMatrixWorld(true);
  const pv=new THREE.Group();if(ax==='z')pv.position.set(hA,0,pd);else pv.position.set(pd,0,hA);g.add(pv);pv.updateMatrixWorld(true);
  const bb=new THREE.Box3(),e=0.006,take=[];
  g.children.forEach(o=>{if(!o.isMesh||o===pv)return;bb.setFromObject(o);
    const A=ax==='z'?[bb.min.x,bb.max.x]:[bb.min.z,bb.max.z],Dd=ax==='z'?[bb.min.z,bb.max.z]:[bb.min.x,bb.max.x];
    if(A[0]>=a0-e&&A[1]<=a1+e&&bb.min.y>=y0-e&&bb.max.y<=y1+e&&Dd[0]>=lo-e&&Dd[1]<=hi+e)take.push(o);});
  take.forEach(o=>pv.attach(o));
  const hit=ax==='z'?B(hx-0.04,hx+0.04,hy-0.17,hy+0.07,Math.min(face,face+dir*0.06),Math.max(face,face+dir*0.06),hitMat,pv):B(Math.min(face,face+dir*0.06),Math.max(face,face+dir*0.06),hy-0.17,hy+0.07,hx-0.04,hx+0.04,hitMat,pv);
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
function toggleSash(sh){sh.target=sh.target?0:sh.open;}
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
function shutTick(){shutters.forEach(sh=>{const df=sh.target-sh.t;if(Math.abs(df)>0.0005){sh.t+=reduceMotionS?df:Math.sign(df)*Math.min(Math.abs(df),0.018);shutApply(sh);}});
  sashes.forEach(sh=>{const df=sh.target-sh.pv.rotation.y;if(Math.abs(df)>0.001)sh.pv.rotation.y+=reduceMotionS?df:df*0.12;});}
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
function doorTick(){shutTick();applianceTick();doors.forEach(d=>{const df=d.target-d.g.rotation.y;if(Math.abs(df)>0.001){d.g.rotation.y+=reduceMotion?df:df*0.12;__shF=0;}});}
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
  anims.forEach(a=>{const c=a.get(),df=a.target-c;if(Math.abs(df)>0.0005){a.set(reduceMotion?a.target:c+df*0.14);__shF=0;}});
  const fo=Math.max(...fDoors.map(d=>Math.abs(d.get())))/1.8;fLightM.emissiveIntensity=fo>0.05?1.4:0;fLight.intensity=fo>0.05?0.9*fo:0;
  const ko=Math.max(...kDoors.slice(0,2).map(d=>Math.abs(d.get())))/1.55;kLightM.emissiveIntensity=ko>0.05?1.4:0;kfLight.intensity=ko>0.05?ko:0;
  const oo=Math.abs(oDoor.get())/1.45;oLightM.emissiveIntensity=0.4+1.4*oo;oLight.intensity=0.9*oo;
  if(toast.state==='on'){toast.t+=1/60;toast.lever+=((ty0+0.07)-toast.lever)*0.3;toast.bread+=(-0.06-toast.bread)*0.3;
    const k=Math.min(1,toast.t/0.8);tSlotM.emissiveIntensity=1.6*k;tLight.intensity=0.8*k;
    if(toast.t>4.5){toast.state='pop';toast.vy=0.011;toast.shade=Math.min(1,toast.shade+0.34);breadM.color.copy(breadBase).lerp(breadDark,toast.shade);}}
  else if(toast.state==='pop'){tSlotM.emissiveIntensity*=0.9;tLight.intensity*=0.9;toast.lever+=((ty1-0.06)-toast.lever)*0.4;
    toast.bread+=toast.vy;toast.vy-=0.0011;if(toast.vy<0&&toast.bread<=0.04){toast.bread=0.04;toast.state='idle';tSlotM.emissiveIntensity=0;tLight.intensity=0;}}
  toastApply();}

// ---- Treppe zum Hauseingang + Windfang ----
const EF=-0.68,NSD=4,SDT=0.25,EDZ=SD0+2.5,EWT=0.38,exc=(SDX+EX)/2;
const gVS=new THREE.Group();scene.add(gVS);
const stepWood=M('#C9955A',0.5),treadM=M('#55585C',0.95),panelWood=M('#5A3A22',0.55);
for(let i=0;i<NSD;i++){const z0=SD0+i*SDT,y=-(0.17*(i+1));B(SDX,EX,-0.8,y,z0,z0+SDT,stepWood);
  const tr=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.012,40,1,false,0,Math.PI),treadM);tr.scale.set(1,1,0.55);tr.rotation.y=Math.PI/2;tr.position.set(exc,y+0.006,z0+SDT-0.02);
  const tb=B(exc-0.42,exc+0.42,y,y+0.012,z0+0.02,z0+SDT-0.02,treadM);scene.add(tr);}
B(SDX,EX,-0.8,0,SD0-0.04,SD0,stepWood);
const entryTile=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#E3D9C6';x.fillRect(0,0,w,h);for(let i=0;i<8;i++)for(let j=0;j<8;j++){x.fillStyle=`rgba(${190+((i*7+j*3)%5)*6},${178+((i+j)%4)*5},${150+((i*3+j)%5)*5},0.55)`;x.fillRect(i*32+2,j*32+2,28,28);}x.strokeStyle='rgba(120,110,95,0.6)';x.lineWidth=2;for(let k=0;k<=256;k+=32){x.beginPath();x.moveTo(k,0);x.lineTo(k,256);x.stroke();x.beginPath();x.moveTo(0,k);x.lineTo(256,k);x.stroke();}},[1,1]);
const etz0=SD0+NSD*SDT;entryTile.repeat.set((EX-SDX)/0.8,(EDZ-etz0)/0.8);
const ef=new THREE.Mesh(new THREE.PlaneGeometry(EX-SDX,EDZ-etz0),new THREE.MeshStandardMaterial({map:entryTile,roughness:0.5}));ef.rotation.x=-Math.PI/2;ef.position.set(exc,EF+0.001,(etz0+EDZ)/2);ef.userData.noShadow=1;scene.add(ef);
B(SDX,EX,-0.8,EF,etz0,EDZ,M('#8C8A86',0.9));
B(exc-0.35,exc+0.35,EF+0.001,EF+0.012,EDZ-0.75,EDZ-0.3,M('#7A6A58',0.95));
// Seitenwände Grube + Windfang
B(EX,EX+ET,-0.8,0,SD0,HZ1,wallMat,gHE);
const CX0=exc-2.05+EWT,CL0=EX+EWT,CL1=exc+2.05-EWT,CO0=8.45,CO1=9.15;
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
B(CX0-EWT,3.12,-0.8,0,HZ1,HZ1+EWT,wallMat);B(3.88,SDX,-0.8,0,HZ1,HZ1+EWT,wallMat);B(3.12,3.88,-0.8,EF,HZ1,HZ1+EWT,baseM);
B(CX0-EWT,XE,0,LY,HZ1,HZ1+EWT,wallMat);
B(CX0-EWT,SDX,-0.8,LY,EDZ,EDZ+EWT,wallMat,gVS);
B(CX0,CX0+0.5,EF,LY,HZ1+EWT,HZ1+EWT+0.2,wallMat);
const gVW=new THREE.Group();scene.add(gVW);
const vw0=8.68,vw1=9.2;
B(CX0-EWT,CX0,-0.8,LY,HZ1+EWT,vw0,wallMat,gVW);B(CX0-EWT,CX0,-0.8,LY,vw1,EDZ+EWT,wallMat,gVW);B(CX0-EWT,CX0,-0.8,EF+1.0,vw0,vw1,wallMat,gVW);B(CX0-EWT,CX0,EF+1.9,LY,vw0,vw1,wallMat,gVW);
win({ax:'x',f:CX0,s:-1,a0:vw0,a1:vw1,y0:EF+1.0,y1:EF+1.9,g:gVW,sashes:1,rows:[],frost:1,noBox:1});
// Heizkörper + Rohre
B(CX0+0.02,CX0+0.1,EF+0.15,EF+0.75,vw0+0.02,vw1-0.02,white);
for(let z=vw0+0.05;z<vw1-0.03;z+=0.035)B(CX0+0.1,CX0+0.11,EF+0.17,EF+0.73,z,z+0.012,white);
cyl(CX0+0.55,HZ1+EWT+0.24,0.018,EF,2.9,white,8);cyl(CX0+0.6,HZ1+EWT+0.24,0.012,EF,2.9,white,8);
// Sockelleisten
B(CX0,SDX,EF,EF+0.08,EDZ-0.012,EDZ,plinthM);B(CX0+0.5,3.12,EF,EF+0.08,HZ1+EWT,HZ1+EWT+0.012,plinthM);
// Garderobenregal an der Südwand
const rackX0=CX0+0.18,rackX1=rackX0+0.72,wrM=M('#3B3B3E',0.4,{metalness:0.6}),shelfW=M('#4E3A2A',0.6);
B(rackX0,rackX1,EF+1.95,EF+1.98,EDZ-0.3,EDZ,shelfW);
[rackX0+0.03,rackX1-0.05].forEach(x=>B(x,x+0.02,EF+1.55,EF+1.98,EDZ-0.3,EDZ-0.01,wrM));
B(rackX0,rackX1,EF+1.7,EF+1.72,EDZ-0.22,EDZ-0.2,wrM);
const coat=(x,z,w,h,d,c,y1,g)=>B(x-w/2,x+w/2,y1-h,y1,z-d/2,z+d/2,M(c,0.9),g);
[[rackX0+0.15,'#5A2330',1.05],[rackX0+0.3,'#2A2A2E',1.0],[rackX0+0.48,'#A9C0D2',0.62],[rackX0+0.62,'#1E1E22',0.95],[rackX0+0.75,'#556B3A',0.7]].forEach(([x,c,h],i)=>coat(x,EDZ-0.18+(i%2)*0.03,0.2,h,0.14,c,EF+1.7));
coat(rackX0+0.05,EDZ-0.1,0.14,0.28,0.1,'#B8D63A',EF+1.25);
const bp=B(rackX0-0.05,rackX0+0.3,EF,EF+0.5,EDZ-0.55,EDZ-0.3,M('#4A2A55',0.85));
B(rackX1-0.05,rackX1+0.3,EF,EF+0.4,EDZ-0.35,EDZ-0.08,M('#55585C',0.6));B(rackX1,rackX1+0.25,EF+0.4,EF+0.62,EDZ-0.33,EDZ-0.1,white);
[[CX0+0.35,'#EDEDED'],[CX0+0.2,'#EDEDED'],[CX0+0.5,'#222']].forEach(([x,c])=>B(x-0.05,x+0.05,EF,EF+0.1,8.55,8.82,M(c,0.8)));
// Kellertür (weiß, mit Glasstreifen)
B(3.06,3.12,EF,EF+2.0,HZ1+EWT-0.01,HZ1+EWT+0.06,white);B(3.88,3.94,EF,EF+2.0,HZ1+EWT-0.01,HZ1+EWT+0.06,white);B(3.06,3.94,EF+1.95,EF+2.0,HZ1+EWT-0.01,HZ1+EWT+0.06,white);
(function(){const pv=new THREE.Group();pv.position.set(3.88,EF,HZ1+EWT+0.02);scene.add(pv);const P=[];const a=m=>{P.push(m);return m;};
  a(B(-0.76,0,0,1.95,-0.02,0.02,white,pv));a(B(-0.3,-0.2,0.35,1.75,0.02,0.025,M('#DDE8EC',0.2),pv));
  const hM=M('#F4F4F4',0.3);a(B(-0.72,-0.7,0.98,1.05,0.02,0.07,hM,pv));a(B(-0.72,-0.6,1.03,1.05,0.06,0.08,hM,pv));
  clickable(P,tog(swing(pv,'y',1.45)));})();
// Kellertreppe unter der Treppe nach oben
const KST=9,KR0=0.15,CF=EF-KR0-0.19*(KST-1),CW0=3.05,CW1=3.95,cz0=HZ1-0.25;
const cellTile=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#E4DDD0';x.fillRect(0,0,w,h);for(let i=0;i<300;i++){x.fillStyle=`rgba(${160+rnd()*40},${150+rnd()*40},130,0.15)`;x.fillRect(rnd()*w,rnd()*h,6,2);}x.strokeStyle='rgba(110,105,95,0.7)';x.lineWidth=3;x.strokeRect(0,0,128,128);x.strokeRect(128,0,128,128);x.strokeRect(0,128,128,128);x.strokeRect(128,128,128,128);},[1,1]);
const gCel=new THREE.Group();scene.add(gCel);
const cTop=new THREE.MeshStandardMaterial({map:cellTile,roughness:0.45}),nosM=M('#7C746A',0.5),rough=Mu('#F6F4EF',0.95);rough.userData.paintableWall=1;
B(CW0,CW1,-0.8,EF,cz0,HZ1+EWT,baseM,gCel);tileFloor(CW0,CW1,cz0,HZ1+EWT,EF,cellTile,0.6);
for(let i=1;i<KST;i++){const y=EF-KR0-0.19*(i-1),za=cz0-0.25*i,zb=za+0.25;B(CW0,CW1,y-0.19,y,za,zb,[baseM,baseM,cTop,baseM,baseM,cTop],gCel);B(CW0,CW1,y-0.012,y+0.006,za,za+0.035,nosM,gCel);}
const cBot=cz0-0.25*KST;B(CW0,CW1,CF-0.2,CF,4.1,cBot+0.25,baseM,gCel);tileFloor(CW0,CW1,4.1,cBot+0.25,CF,cellTile,0.6);
B(CW0+0.2,CW1-0.2,CF+0.001,CF+0.012,cBot-0.35,cBot+0.1,M('#3A3C3F',0.95),gCel);
B(XE,CW0,CF-0.2,0,3.63,4.15,rough,gCel);
B(2.97,CW0,CF-0.2,0,5.0,6.7,rough,gCel);B(XE,2.97,CF-0.2,CF,5.0,6.7,rough,gCel);B(XE,2.97,CF+1.15,0,5.0,6.05,rough,gCel);B(XE,2.97,CF+1.15,CF+1.25,6.05,6.7,rough,gCel);B(XE,2.97,CF+1.95,0,6.05,6.7,rough,gCel);B(XE,CW0,CF-0.2,0,6.7,HZ1,rough,gCel);B(XE,CW0,CF+2.0,0,4.15,5.0,rough,gCel);B(XE,CW0,CF-0.2,CF,4.15,5.0,baseM,gCel);B(CW1,SDX,CF-0.2,-0.8,Z0,HZ1,rough,gCel);B(CW1,SDX,-0.8,0,Z0,SD0,rough,gCel);B(CW1,SUX-0.02,-0.8,0,SD0,HZ1,rough,gCel);
B(CW0,CW1,-0.3,0,Z0,SU0,rough,gCel);
// Kellertür unten (Holz)
const pineTx=canvasTex(128,256,(x,w,h)=>{x.fillStyle='#D68A45';x.fillRect(0,0,w,h);for(let i=0;i<w;i+=16){x.fillStyle='rgba(120,60,20,0.35)';x.fillRect(i,0,1.5,h);}for(let i=0;i<40;i++){x.strokeStyle='rgba(150,80,30,0.25)';x.beginPath();const px=rnd()*w;x.moveTo(px,0);x.lineTo(px+rnd()*6-3,h);x.stroke();}});
B(CW0,3.13,CF,-0.3,Z0,3.95,rough,gCel);B(3.88,CW1,CF,-0.3,Z0,3.95,rough,gCel);B(3.13,3.88,CF+1.95,-0.3,Z0,3.95,rough,gCel);
// Wandschrank unten an der Kellertreppe
{const pm=new THREE.MeshStandardMaterial({map:pineTx,roughness:0.6}),wsh=M('#F2F0EA',0.7),bz=3.7;
 B(3.13,4.08,CF,CF+1.95,bz,bz+0.05,M('#E2DED4',0.9),gCel);B(3.08,3.13,CF,CF+1.95,bz,3.92,rough,gCel);B(4.08,3.93,CF,CF+1.95,bz,3.92,rough,gCel);B(3.13,4.08,CF+1.95,CF+2.0,bz,3.92,rough,gCel);
 [0.42,0.8,1.17,1.52].forEach(y=>B(3.13,4.08,CF+y,CF+y+0.025,bz+0.05,4.1,wsh,gCel));[3.45,3.58].forEach(x=>cyl(x,bz+0.1,0.025,CF,1.95,M('#B8BCC0',0.5),10,gCel));
 B(3.2,3.42,CF,CF+0.22,3.80,4.08,M('#B88C5A',0.85),gCel);B(3.5,3.65,CF+0.02,CF+0.08,3.90,4.05,M('#D82A2A',0.6),gCel);
 [[3.22,'#F4F4F2',0.13],[3.34,'#F2E0A0',0.06],[3.36,'#F2E0A0',0.06],[3.55,'#D8DCE0',0.2],[3.68,'#2A6A3A',0.18]].forEach(([x,c,h],k)=>cyl(x,3.72+(k%2)*0.05,0.045,CF+0.445,h,M(c,0.5),12,gCel));
 B(3.15,3.45,CF+0.825,CF+0.88,3.80,4.05,M('#3AB04A',0.6),gCel);B(3.17,3.43,CF+0.88,CF+1.05,3.82,4.03,M('#E8F4F4',0.3,{transparent:true,opacity:0.5}),gCel);B(3.47,3.68,CF+0.825,CF+0.95,3.82,4.05,M('#E8C870',0.7),gCel);B(3.14,3.32,CF+0.825,CF+0.92,3.95,4.08,M('#9AD8D0',0.5),gCel);
 cyl(3.25,3.90,0.08,CF+1.545,0.3,M('#F4F4F2',0.5),16,gCel);B(3.55,4.06,CF+1.545,CF+1.75,3.80,4.06,M('#B88C5A',0.85),gCel);
 const leaf=(hx,dir)=>{const pv=new THREE.Group();pv.position.set(hx,CF+0.02,4.14);gCel.add(pv);const x0=dir>0?0:-0.37,x1=dir>0?0.37:0,P=[];P.push(B(x0,x1,0,1.92,-0.012,0.012,pm,pv));P.push(B(dir>0?x1-0.06:x0+0.03,dir>0?x1-0.03:x0+0.06,0.95,1.02,0.012,0.03,M('#C8B07A',0.3,{metalness:0.75}),pv));const a=swing(pv,'y',-dir*1.45);a.target=a.open;pv.rotation.y=a.open;return {P,a};};
 const L=leaf(3.13,1),R=leaf(4.08,-1);clickable([...L.P,...R.P],()=>{const t=L.a.target?0:L.a.open;L.a.target=t;R.a.target=t?R.a.open:0;});
 // Strahler-Rondell an der Decke, Steckdosen links
 const gS=M('#B8BCC0',0.4,{metalness:0.5});cyl(3.35,4.32,0.09,CF+2.25,0.03,M('#C8A06A',0.6),16,gCel);[[-0.08,0],[0.08,0.04],[0,-0.08]].forEach(([dx,dz])=>{const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.045,0.12,12),gS);sp.position.set(3.35+dx,CF+2.08,4.32+dz);sp.rotation.x=0.6;gCel.add(sp);const bl=new THREE.Mesh(new THREE.SphereGeometry(0.03,8,6),new THREE.MeshBasicMaterial({color:0xFFF4D8}));bl.position.set(3.35+dx,CF+2.02,4.36+dz);gCel.add(bl);});
 B(CW0,CW0+0.04,CF+1.0,CF+1.18,4.17,4.26,M('#E8E8E2',0.4),gCel);B(CW0,CW0+0.04,CF+1.62,CF+1.72,4.17,4.26,M('#E8E8E2',0.4),gCel);}
// Flur vom Treppenfuß zur Waschküche (östlich der Treppe)
gCel.add(tileFloor(CW1,4.6,3.72,5.02,CF,cellTile,0.8));B(4.6,4.75,CF,0,3.72,4.53,rough,gCel);gCel.add(tileFloor(CW1,6.1,4.53,6.55,CF,cellTile,0.8));gCel.add(tileFloor(CW1+0.1,4.6,6.55,7.96,CF,cellTile,0.8));B(CW1,CW1+0.1,CF,0,5.02,8.0,rough,gCel);B(CW1,6.1,CF+2.2,0,3.72,6.55,rough,gCel);B(CW1+0.1,4.6,CF+2.2,0,6.55,7.96,rough,gCel);B(CW1,6.25,CF,0,7.96,8.4,rough,gCel);
// Handlauf links (Westwand) + Kabelkanal
const hlen=Math.hypot(0.25*(KST-1),EF-CF);const hr=new THREE.Mesh(new THREE.CylinderGeometry(0.022,0.022,hlen,10),M('#9A5E30',0.45));hr.position.set(CW0+0.07,(EF+CF)/2+0.9,cz0-0.25*KST/2);hr.rotation.x=Math.atan2(0.25*(KST-1),EF-CF);gCel.add(hr);
for(let k=0;k<3;k++){const z=cz0-0.3-k*0.8,y=EF-(EF-CF)*((cz0-z)/(0.25*KST))+0.9;B(CW0,CW0+0.07,y-0.01,y+0.01,z,z+0.02,M('#BFC3C6',0.3,{metalness:0.7}),gCel);}
B(CW0,CW0+0.03,-0.4,-0.34,cz0-2.2,cz0,white,gCel);
// Figuren auf dem Sims
[['#E8D8B0',0.08],['#9DB4C8',0.09],['#C64040',0.09],['#7A8A6A',0.08],['#E9A3B7',0.07]].forEach(([c,h],i)=>{const x=CW0+0.12+i*0.17;deco(B(x,x+0.08,0,h,SU0-0.12,SU0-0.04,M(c,0.6),gCel));});
// Garderobe (links vom Eingang)
tileFloor(CL0,CL1,KZ1+0.3,EDZ,EF);B(CL0,CL1,-0.8,EF,KZ1+0.3,EDZ,baseM);
B(EX,CL1+EWT,-0.8,0,KZ1,KZ1+0.3,wallMat);B(EX+EWT,CL1+EWT,-0.8,LY,EDZ,EDZ+EWT,wallMat,gVS);
const gCE=new THREE.Group();scene.add(gCE);const cw0=8.58,cw1=9.1;
B(CL1,CL1+EWT,-0.8,LY,KZ1+0.3,cw0,wallMat,gCE);B(CL1,CL1+EWT,-0.8,LY,cw1,EDZ+EWT,wallMat,gCE);B(CL1,CL1+EWT,-0.8,EF+1.05,cw0,cw1,wallMat,gCE);B(CL1,CL1+EWT,EF+1.95,LY,cw0,cw1,wallMat,gCE);
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
const KRX0=-1.65,KRX1=1.2,KRZ0=3.84,KRZ1=6.8,PZ0=4.15,PZ1=5.0,KCH=CF+2.2,KBX0=-1.95,KBX1=2.25,KBZ0=0.0,KBZ1=3.54;
const lam=canvasTex(512,512,(x,w,h)=>{x.fillStyle='#C99A62';x.fillRect(0,0,w,h);for(let r=0;r<8;r++){const off=(r*173)%512;for(let k=-1;k<3;k++){const px=off+k*256;const g=x.createLinearGradient(px,0,px+256,0);const b=190+rnd()*30;g.addColorStop(0,`rgb(${b+15},${b-35},${b-95})`);g.addColorStop(1,`rgb(${b},${b-45},${b-105})`);x.fillStyle=g;x.fillRect(px,r*64,256,64);x.fillStyle='rgba(90,55,25,0.45)';x.fillRect(px,r*64,2,64);}x.fillStyle='rgba(90,55,25,0.35)';x.fillRect(0,r*64,w,1.5);for(let i=0;i<14;i++){x.strokeStyle='rgba(140,90,45,0.25)';x.beginPath();const yy=r*64+rnd()*64;x.moveTo(0,yy);x.bezierCurveTo(170,yy+rnd()*8-4,340,yy+rnd()*8-4,512,yy);x.stroke();}}});
const lamFloor=(x0,x1,z0,z1)=>{const t=lam.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set((x1-x0)/2.0,(z1-z0)/1.4);const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),new THREE.MeshStandardMaterial({map:t,roughness:0.45}));m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,CF+0.002,(z0+z1)/2);m.userData.noShadow=1;gCel.add(m);};
lamFloor(KRX0,XE,KRZ0,KRZ1);lamFloor(KBX0,KBX1,KBZ0,KBZ1);lamFloor(0.0,0.85,KBZ1,KRZ0);
B(-2.33,XE,CF-0.2,CF,-0.39,KRZ1+0.3,baseM,gCel);
B(XE-0.02,XE+0.33,CF,CF+0.012,PZ0,PZ1,M('#B98A55',0.5),gCel);
// Wände
B(KRX0-0.3,0.0,CF,0,KBZ1,KRZ0,rough,gCel);B(0.85,1.55,CF,0,KBZ1,KRZ0,rough,gCel);B(2.65,XE,CF,0,KBZ1,KRZ0,rough,gCel);B(1.55,2.65,CF,0,KBZ1,KBZ1+0.06,rough,gCel);B(1.55,2.65,CF+1.04,CF+1.12,KBZ1+0.06,KRZ0+0.03,rough,gCel);B(1.55,1.6,CF+1.12,0,KBZ1+0.06,KRZ0,rough,gCel);B(1.6,1.95,CF+2.0,0,KBZ1+0.06,KRZ0,rough,gCel);B(1.95,2.03,CF+1.12,0,KBZ1+0.06,KRZ0,rough,gCel);B(2.03,2.62,CF+1.92,0,KBZ1+0.06,KRZ0,rough,gCel);B(2.62,2.65,CF+1.12,0,KBZ1+0.06,KRZ0,rough,gCel);B(0.0,0.85,CF+2.0,0,KBZ1,KRZ0,rough,gCel);B(0.0,0.85,CF,CF+0.012,KBZ1,KRZ0,M('#C8A050',0.3,{metalness:0.6}),gCel);
B(-2.33,XE,CF,0,KRZ1,KRZ1+0.3,rough,gCel);
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
const WKZ1=3.63,WKD0=3.98,WKD1=4.58,VX0=2.55,VX1=5.05,VZ0=0.0,VZ1=3.72,KFX1=5.8,KFZ0=2.3,WX0=5.95,WX1=7.95,WZ0=2.45,WZ1=3.42,PX0=6.25,PX1=8.41,PZ0b=4.83,PZ1b=6.7;
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
B(CRX0,CRX1,CF-0.2,CF,CRZ0,CRZ1,cfM,gCel);B(CRX1,8.86,CF,0,CRZ0-0.3,CRZ1+0.4,cwM,gCel);B(CRX0,CRX1,CRH,0,CRZ0,CRZ1,concM(4,1),gCel);
B(CRX0+0.7,CRX0+1.0,CRH-0.18,CRH,CRZ0,CRZ1,cwM,gCel);B(CRX1-0.5,CRX1,CF,CRH,CRZ1-0.4,CRZ1,brickM,gCel);
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
B(CX0-EWT-0.02,dx0-0.06,-1.3,EF+0.02,FZ,FZ+0.025,stoneM);B(dx1+0.06,CL1+EWT+0.02,-1.3,EF+0.02,FZ,FZ+0.025,stoneM);
B(CX0-EWT-0.025,CX0-EWT,-1.3,EF+0.02,HZ1,FZ+0.025,stoneM);B(CL1+EWT,CL1+EWT+0.025,-1.3,EF+0.02,HZ1,FZ+0.025,stoneM);
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
const lpw0=8.36,lpw1=8.8,lpy0=LY+0.95,lpy1=LY+1.8;B(CX0-EWT,CX0,LY,UE,HZ1,lpw0,wallMat,gUp);B(CX0-EWT,CX0,LY,UE,lpw1,FZ,wallMat,gUp);B(CX0-EWT,CX0,LY,lpy0,lpw0,lpw1,wallMat,gUp);B(CX0-EWT,CX0,lpy1,UE,lpw0,lpw1,wallMat,gUp);const wcw0=8.55,wcw1=9.1,wcy0=LY+0.9,wcy1=LY+1.65;B(CL1,CL1+EWT,LY,UE,HZ1,wcw0,wallMat,gUp);B(CL1,CL1+EWT,LY,UE,wcw1,FZ,wallMat,gUp);B(CL1,CL1+EWT,LY,wcy0,wcw0,wcw1,wallMat,gUp);B(CL1,CL1+EWT,wcy1,UE,wcw0,wcw1,wallMat,gUp);
const lw0=exc-0.5,lw1=exc+0.5,ly0=LY+0.85,ly1=LY+1.7;
B(CX0-EWT,lw0,LY,UE,EDZ,FZ,wallMat,gUp);B(lw1,CL1+EWT,LY,UE,EDZ,FZ,wallMat,gUp);B(lw0,lw1,LY,ly0,EDZ,FZ,wallMat,gUp);B(lw0,lw1,ly1,UE,EDZ,FZ,wallMat,gUp);
win({ax:'z',f:EDZ,s:1,a0:lw0,a1:lw1,y0:ly0,y1:ly1,g:gUp,rows:[],frost:1,noBox:1});
B(lw0-0.03,lw1+0.03,ly0-0.04,ly0,FZ,FZ+0.06,sillM,gUp);
B(CX0-EWT,CL1+EWT,UE-0.2,UE,HZ1,FZ,M('#F4F1EA',0.9),gUp);
(function(){const x0=CX0-EWT-0.3,x1=CL1+EWT+0.3,zf=FZ+0.3,zb=HZ1,run=zf-zb,rh=0.2,y0=UE;
  const A=[x0,y0,zf],Bv=[x1,y0,zf],C=[x1,y0,zb],D=[x0,y0,zb],R1=[x0+run,y0+rh,zb],R2=[x1-run,y0+rh,zb];
  const tri=[A,Bv,R2, A,R2,R1, D,A,R1, Bv,C,R2];const pos=[],uv=[];tri.forEach(p=>{pos.push(...p);uv.push(p[0]*1.2,(p[1]-y0)*3+p[2]*0.4);});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();
  const tileT=canvasTex(128,128,(x,w,h)=>{x.fillStyle='#6A4A3E';x.fillRect(0,0,w,h);for(let r=0;r<4;r++){x.fillStyle='rgba(30,18,12,0.55)';x.fillRect(0,r*32+28,w,4);for(let c=0;c<4;c++){x.fillStyle=`rgba(${120+rnd()*40},${80+rnd()*20},${60+rnd()*20},0.35)`;x.fillRect(c*32+(r%2)*16,r*32,30,28);}}},[1,1]);
  const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({map:tileT,roughness:0.8,side:THREE.DoubleSide}));gVRoof.add(m);
  B(x0,x1,y0-0.06,y0,zf-0.12,zf,M('#9AA0A4',0.4,{metalness:0.5}),gVRoof);})();


// ===================== OBERGESCHOSS =====================
const OGF=U1,OGH=2.59,gOG=new THREE.Group();scene.add(gOG);let floorOG=false;
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
win({ax:'z',f:JZ0,s:-1,a0:jn0,a1:jn1,y0:OGF+jy0,y1:OGF+jy1,g:gJN,rows:[0.53],noBox:1});
ogB(jn0-0.1,jn1+0.1,jy1+0.04,jy1+0.3,JZ0,JZ0+0.2,white,gJN);
// Westwand mit Fenster zum Holzbalkon
const jw0=1.6,jw1=2.45,jch=1.36;
ogB(JX0-0.38,JX0,0,OGH,JZ0,jw0,wallMat,gJW);ogB(JX0-0.38,JX0,0,OGH,jw1,JZ1,wallMat,gJW);ogB(JX0-0.38,JX0,0,jy0,jw0,jw1,wallMat,gJW);ogB(JX0-0.38,JX0,jy1,OGH,jw0,jw1,wallMat,gJW);
win({ax:'x',f:JX0,s:-1,a0:jw0,a1:jw1,y0:OGF+jy0,y1:OGF+jy1,g:gJW,rows:[0.34,0.67],noBox:1});
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
win({ax:'z',f:KZ0w,s:-1,a0:nw0,a1:nw1,y0:OGF+jy0,y1:OGF+jy1,g:gWN,rows:[0.53],noBox:1});
const shutM=M('#7E8486',0.5);ogB(nw0+0.05,nw1-0.05,jy0+0.75,jy1,KZ0w-0.27,KZ0w-0.255,shutM,gWN);ogB(nw0-0.15,nw1+0.15,jy1+0.02,OGH-0.02,KZ0w,KZ0w+0.24,white,gWN);
// Ostwand mit Fenster und Vorhängen
ogB(KX1w,KX1w+0.38,0,OGH,KZ0w,ew0,wallMat,gWE);ogB(KX1w,KX1w+0.38,0,OGH,ew1,KZ1w+0.18,wallMat,gWE);ogB(KX1w,KX1w+0.38,0,jy0,ew0,ew1,wallMat,gWE);ogB(KX1w,KX1w+0.38,jy1,OGH,ew0,ew1,wallMat,gWE);
win({ax:'x',f:KX1w,s:1,a0:ew0,a1:ew1,y0:OGF+jy0,y1:OGF+jy1,g:gWE,rows:[0.55],noBox:1});
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
shelf(LX0+0.75,LX0+1.55,LZ0o,LZ0o+0.32,2.0,6);shelf(LX0+1.57,LX0+2.37,LZ0o,LZ0o+0.32,2.0,6);
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
B(EX,CL1,LY-0.03,LY-0.002,HZ1,EDZ,stairTop,gUp);B(EX,CL1,LY-0.2,LY-0.03,HZ1,HZ1+0.3,wallMat,gUp);B(EX,CL1+EWT,LY,UE,HZ1,HZ1+0.3,wallMat,gUp);
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


// ---- Außenansicht: Hauptdach (Walmdach) mit Gauben + Schornstein, Natursteinsockel, Kellerfassade Gartenseite ----
const gRoof=new THREE.Group();scene.add(gRoof);gRoof.visible=false;let facadeMode=false;
const rx0=-0.83,rx1=9.28,rz0=-0.83,rz1=8.83,ry=OGF+OGH+0.05,rh=4.3,rdz=(rz1-rz0)/2,ridgeZ=(rz0+rz1)/2;
const roofTileT=canvasTex(256,256,(x,w,h)=>{x.fillStyle='#4E3A34';x.fillRect(0,0,w,h);for(let r=0;r<8;r++){x.fillStyle='rgba(20,12,8,0.6)';x.fillRect(0,r*32+26,w,6);for(let c=0;c<8;c++){x.fillStyle=`rgba(${100+rnd()*40},${74+rnd()*25},${62+rnd()*20},0.45)`;x.fillRect(c*32+(r%2)*16,r*32,28,26);}}},[1,1]);
const roofM=new THREE.MeshStandardMaterial({map:roofTileT,roughness:0.85,side:THREE.DoubleSide});
const gut=M('#7A8084',0.4,{metalness:0.5});
{const rxa=rx0+rdz,rxb=rx1-rdz;const P=[[rx0,ry,rz1],[rx1,ry,rz1],[rx1,ry,rz0],[rx0,ry,rz0],[rxa,ry+rh,ridgeZ],[rxb,ry+rh,ridgeZ]];
 const tris=[[0,1,5],[0,5,4],[2,3,4],[2,4,5],[1,2,5],[3,0,4]];const pos=[],uv=[];
 tris.forEach(t=>t.forEach(k=>{const p=P[k];pos.push(...p);uv.push((p[0]+p[2])*0.9,(p[1]-ry)*2.4);}));
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();
 gRoof.add(new THREE.Mesh(g,roofM));
 B(rx0,rx1,ry-0.22,ry,rz0,rz1,M('#F2F0EA',0.8),gRoof);
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
const gx0=5.3,gx1=8.2,kd0=3.55,kd1=4.4,ks0=3.08,ks1=3.45,r5kw0=0.03,r5kw1=1.77;
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
{const pl=M('#F4F2EC',0.85);B(-0.39,8.86,H,OGF+0.01,-0.39,8.41,pl,gRoof);B(XW-RV2,-0.38,H,OGF+0.01,Z0-0.38,S+0.39,pl,gRoof);B(HX0,KX1+0.38,H,OGF+0.01,KZ0,S+0.39,pl,gRoof);}

// ---- Vorgarten zur Straße: Natursteinmauer mit Pfeilern, Tor, Zaun, Briefkasten, Gehweg, Einfahrtstor ----
{const yG=EF-0.4,wz=FZ+3.2,sandT=canvasTex(256,128,(x,w,h)=>{x.fillStyle='#8A7A62';x.fillRect(0,0,w,h);for(let r=0;r<5;r++)for(let c=0;c<7;c++){const v=rnd();x.fillStyle=v<0.35?'#C8B898':v<0.7?'#B0A080':'#D8C8A8';x.fillRect(c*40+(r%2)*18+rnd()*4,r*26+2,30+rnd()*8,22);}},[1,1]);
 const sMat=(w,h)=>{const t=sandT.clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/0.9,h/0.45);return new THREE.MeshStandardMaterial({map:t,roughness:0.9});};
 const g0=exc-0.6,g1=exc+0.6,wx0=-2.5,dr0=9.0,dr1=12.5;
 B(wx0,g0-0.45,yG,yG+0.55,wz,wz+0.35,sMat(g0-wx0,0.55),gRoof);B(g1+0.45,dr0-0.45,yG,yG+0.55,wz,wz+0.35,sMat(dr0-g1,0.55),gRoof);
 [[g0-0.45,g0],[g1,g1+0.45],[dr0-0.45,dr0]].forEach(([a,b])=>B(a,b,yG,yG+1.15,wz-0.03,wz+0.4,sMat(0.45,1.15),gRoof));
 const iron=M('#2E4A3A',0.5,{metalness:0.4});
 const fence=(a,b,y0,y1)=>{B(a,b,y1-0.03,y1,wz+0.16,wz+0.19,iron,gRoof);B(a,b,y0,y0+0.03,wz+0.16,wz+0.19,iron,gRoof);for(let x=a+0.06;x<b;x+=0.12)B(x,x+0.015,y0,y1,wz+0.165,wz+0.185,iron,gRoof);};
 fence(wx0,g0-0.45,yG+0.55,yG+1.08);fence(g1+0.45,dr0-0.45,yG+0.55,yG+1.08);
 fence(g0,g1,yG+0.05,yG+1.0);fence(dr0,dr1,yG-0.35,yG+1.25);B((dr0+dr1)/2-0.03,(dr0+dr1)/2+0.03,yG-0.35,yG+1.25,wz+0.15,wz+0.2,iron,gRoof);
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

// Esstisch verschieben/drehen: jetzt allgemein für alle Möbel im Einrichtungsmodus (einrichten.js)

// ---- Deko ein/aus ----
const decoMats=new Set([lampOn,rattan.material,shade.material,leafM,stemM,potM,potW,stalk,leaf2,leaf3]);
const decoHex=new Set(['5e9a55','7baf5a','4e8a4a','6fa35e','c0663f','e9e6df','4a3a2a']);
const hexOf=m=>{const c=m.color.clone().convertLinearToSRGB();return c.getHexString();};
{const gb=new THREE.Box3(new THREE.Vector3(5.36,CF-0.15,-0.3),new THREE.Vector3(8.84,-0.05,4.5));window.__garConf=gCel.children.filter(o=>{const b=new THREE.Box3().setFromObject(o);return !b.isEmpty()&&b.intersectsBox(gb);});}
const decoMeshes=[];
scene.traverse(o=>{if(!o.isMesh||!o.material||Array.isArray(o.material))return;if(o.userData.deco||decoMats.has(o.material)||(o.material.color&&decoHex.has(hexOf(o.material))))decoMeshes.push(o);});
const decoBtn=document.getElementById('deco');
const furnBtn=document.getElementById('furn');let furnList=null;
const isStruct=o=>{let q=o;while(q){if(q.userData&&q.userData.struct)return true;if(q===gRoof||q===dimG)return true;q=q.parent;}return false;};
function buildFurn(){const SM=new Set([wallMat,glass,baseM,plinthM,rough]),FL=window.__FLIGHTS||[],out=[],b=new THREE.Box3();scene.updateMatrixWorld(true);
  scene.traverse(o=>{if(!o.isMesh||!o.material)return;if(o.userData.deco||isStruct(o))return;const m=Array.isArray(o.material)?o.material[0]:o.material;if(SM.has(m)||(m.transparent&&m.opacity<0.5))return;
    b.setFromObject(o);if(b.isEmpty())return;const h=b.max.y-b.min.y,dx=b.max.x-b.min.x,dz=b.max.z-b.min.z,w=Math.max(dx,dz),t=Math.min(dx,dz);
    if(h>2.3||(w>2.6&&t>1.2)||(h<0.03&&w>1.2)||(t<0.12&&h>1.8))return;if(m===white&&t<0.12)return;
    const c=b.getCenter(new THREE.Vector3());if(FL.some(f=>c.x>f.box[0]-0.15&&c.x<f.box[1]+0.15&&c.y>f.box[2]-0.2&&c.y<f.box[3]+1.2&&c.z>f.box[4]-0.15&&c.z<f.box[5]+0.15))return;out.push(o);});return out;}
furnBtn.addEventListener('click',()=>{if(!furnList)furnList=buildFurn();const on=furnBtn.getAttribute('aria-pressed')!=='true';furnBtn.setAttribute('aria-pressed',String(on));furnBtn.textContent=on?'Möbel ein':'Möbel aus';furnList.forEach(m=>m.visible=!on);});
decoBtn.addEventListener('click',()=>{const on=decoBtn.getAttribute('aria-pressed')!=='true';decoBtn.setAttribute('aria-pressed',String(on));decoMeshes.forEach(m=>m.visible=!on);});

// ---- Wände ein/aus ----
const wallSet=new Set([wallMat,pvc,glass,sillM,trim,white,leaf,backing,hMat]);
const wallMeshes=[];
scene.traverse(o=>{if(o.isMesh&&(o.userData.wall||wallSet.has(o.material))){wallMeshes.push(o);o.userData.navBlocker=1;}});
const wallBtn=document.getElementById('walls');
wallBtn.addEventListener('click',()=>{const on=wallBtn.getAttribute('aria-pressed')!=='true';wallBtn.setAttribute('aria-pressed',String(on));wallMeshes.forEach(m=>m.visible=!on);wallsHidden=on;shutters.forEach(shutApply);});

const VIEWS={
  overview:{p:[13.5,12.5,15],t:[3.0,0.3,4.2]},
  kitchen:{p:[5.5,1.6,6.3],t:[8.4,0.9,6.6]},
  bath:{p:[4.65,1.65,4.37],t:[8.4,1.0,4.2]},
  bedroom:{p:[4.6,1.7,3.2],t:[7.4,0.7,0.7]},
  hall:{p:[3.95,1.6,3.9],t:[3.6,1.0,8.6]},
  stairs:{p:[3.2,2.9,7.9],t:[4.4,0.4,4.2]},
  vcorr:{p:[EX-0.12,EF+1.65,HZ1+EWT+0.35],t:[CX0,EF+0.95,EDZ-0.2]},
  vcloset:{p:[SDX+0.2,EF+1.55,EDZ-0.25],t:[CL1,EF+0.9,KZ1+0.6]},
  kg:{p:[3.2,7.5,-6.5],t:[3.0,CF+0.5,3.6],fl:-1},kcab:{p:[3.5,CF+1.6,5.0],t:[3.5,CF+1.0,3.5]},kroom:{p:[2.9,CF+1.6,4.45],t:[-1.6,CF+1.0,5.5]},kroom2:{p:[-0.6,CF+1.6,5.9],t:[2.3,CF+1.2,4.0]},kbuero:{p:[2.2,CF+1.7,3.05],t:[-1.8,CF+1.0,0.9]},kbuero2:{p:[0.9,CF+1.65,3.1],t:[-0.6,CF+1.0,-0.3]},
  kvest:{p:[4.6,CF+1.6,3.3],t:[3.3,CF+1.0,-0.3]},kvestDoor:{p:[3.6,CF+1.6,2.5],t:[5.8,CF+1.2,2.78],fl:-1,facade:1},kvest2:{p:[4.6,CF+1.65,0.35],t:[3.2,CF+1.1,3.6]},
  kcorr:{p:[3.55,CF+1.55,3.35],t:[5.9,CF+1.0,2.6]},
  kwc:{p:[4.3,CF+1.55,7.5],t:[6.7,CF+0.5,7.45]},
  kpantry:{p:[6.55,CF+1.65,6.45],t:[8.41,CF+1.35,5.3]},
  kcrawl:{p:[CRX0+0.3,CF+1.1,7.55],t:[CRX1,CF+0.4,7.55]},
  kcrawl2:{p:[CRX0+0.9,CF+1.1,7.8],t:[CRX1,CF+0.7,7.4]},
  cellar:{p:[3.5,0.45,8.3],t:[3.5,-2.6,4.3]},
  estairs:{p:[exc+0.9,EF+1.15,FZ+3.0],t:[exc-0.1,EF+0.25,FZ+0.2],facade:1},outside:{p:[exc+0.6,EF+1.8,17.0],t:[exc,EF+2.6,9.6],facade:1},
  street:{p:[exc,1.1,25.5],t:[exc,2.6,6.0],facade:1},
  street2:{p:[exc-7.5,1.0,21.5],t:[exc,2.4,6.0],facade:1},
  hof:{p:[2.8,CF+1.9,-10.5],t:[2.6,CF+1.5,0],facade:1},garage:{p:[6.75,CF+1.6,NF+0.6],t:[6.75,CF+0.7,NF+4.9],fl:-1,facade:1},garageDoor:{p:[6.4,CF+1.6,2.78],t:[4.5,CF+1.2,2.78],fl:-1,facade:1},hofstairs:{p:[-1.2,CF+1.75,NF-3.4],t:[-3.9,CF+0.6,NF+0.4],facade:1},
  garden:{p:[4.0,CF+1.2,-22.0],t:[4.0,1.4,3.0],facade:1},
  terraceside:{p:[-16,0.6,-6.0],t:[1.5,2.8,3.5],facade:1},
  stairup:{p:[4.35,1.6,4.0],t:[3.5,1.6,8.6]},
  landwin:{p:[CX0+1.35,LY+1.5,9.2],t:[CX0,LY+1.15,8.5]},
  stairdown:{p:[(SDX+EX)/2,OGF+1.5,U1Z-0.3],t:[exc-0.1,LY+0.8,EDZ]},
  landing:{p:[(SDX+EX)/2-0.15,LY+1.55,HZ1+0.3+1.0],t:[(SDX+EX)/2,OGF+0.7,U1Z-0.6]},
  ogover:{p:[11.5,14.5,13],t:[2.6,3.2,3.0],fl:1},
  janina:{p:[3.35,OGF+1.6,3.25],t:[1.6,OGF+0.9,0.2],fl:1},
  janina2:{p:[3.6,OGF+1.55,1.2],t:[0.0,OGF+1.0,2.3],fl:1},
  janina3:{p:[0.7,OGF+2.2,3.1],t:[3.5,OGF+0.6,0.6],fl:1},
  wichtel:{p:[4.65,OGF+1.6,3.15],t:[7.6,OGF+0.8,0.6],fl:1},
  wichtel2:{p:[6.4,OGF+1.6,0.75],t:[6.9,OGF+0.8,3.4],fl:1},
  wichtel3:{p:[7.7,OGF+1.6,2.3],t:[4.1,OGF+1.0,1.0],fl:1},
  lese1:{p:[2.5,OGF+1.6,4.05],t:[0.0,OGF+0.9,7.7],fl:1},
  lese2:{p:[1.2,OGF+1.6,7.6],t:[1.2,OGF+1.0,3.7],fl:1},
  bastel1:{p:[-1.0,OGF+1.55,4.0],t:[-1.0,OGF+0.9,8.0],fl:1},
  bastel2:{p:[-0.6,OGF+1.55,7.6],t:[-1.5,OGF+0.8,3.8],fl:1},
  ogstair:{p:[4.75,OGF+1.6,5.1],t:[3.9,OGF+1.15,HZ1],fl:1},
  ogdoor:{p:[3.35,OGF+1.55,5.2],t:[2.9,OGF+1.1,3.0],fl:1},
  aupair1:{p:[AUX0+0.15,OGF+1.75,AUZ0+0.7],t:[AUX1-0.5,OGF+0.35,AUZ0+2.1],fl:1},
  aupair2:{p:[AUX1-0.4,OGF+1.6,AUZ0+0.9],t:[AUX0,OGF+1.0,AUZ1-1.0],fl:1},
  bathog:{p:[OBX0+0.45,OGF+1.75,OBZ1-0.25],t:[OBX1,OGF+0.6,OBZ0+0.3],fl:1},
  bathog2:{p:[OBX1-0.35,OGF+1.6,OBZ1-0.3],t:[OBX0,OGF+0.9,OBZ0+0.4],fl:1},
  wcz:{p:[EX-0.7,LY+1.6,(wcd0+wcd1)/2],t:[CL1,LY+0.6,(WCZ0+WCZ1)/2],fl:1},
  abstell:{p:[EX-0.15,OGF+1.3,6.25],t:[HX0,OGF+0.45,5.6],fl:1},
  dgover:{p:[11.5,DGF+8.5,13],t:[4.0,DGF,4.0],fl:2},
  dgtop:{p:[exc-0.1,DGF+1.55,5.75],t:[exc,DGF+1.3,7.75],fl:2},
  dgflur:{p:[4.3,DGF+1.6,7.0],t:[3.9,DGF+0.9,3.3],fl:2},
  yoga:{p:[7.2,DGF+1.45,2.9],t:[0.8,DGF+0.9,1.6],fl:2},
  yoga2:{p:[2.3,DGF+1.6,2.95],t:[7.4,DGF+0.6,1.4],fl:2},
  dgbath:{p:[6.6,DGF+1.6,5.2],t:[6.6,DGF+0.6,3.5],fl:2},
  dgbath2:{p:[6.0,DGF+1.6,4.3],t:[7.0,DGF+0.7,6.9],fl:2},
  dgstore:{p:[1.9,DGF+1.6,3.6],t:[0.6,DGF+0.7,6.4],fl:2},
  entrance:{p:[(SDX+EX)/2,1.6,SD0-1.5],t:[(SDX+EX)/2,-0.35,9.2]},
  dining:{p:[1.9,1.65,3.95],t:[-1.8,0.8,7.2]},
  top:{p:[3.0,19,4.2],t:[3.0,0,4.2]},
  slide:{p:[0.7,1.6,3.35],t:[2.3,0.7,0.6]},
  entry:{p:[3.4,1.6,3.35],t:[1.0,0.7,0.8]},
  kapok:{p:[3.3,0.95,1.05],t:[0.2,0.85,0.9]}
};
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let tween=null;
let kgMode=false;const kgClip=[new THREE.Plane(new THREE.Vector3(0,-1,0),CF+2.12)];
function setLevel(l){kgMode=l===-1;renderer.clippingPlanes=kgMode?kgClip:[];floorOG=l>=1;floorDG=l>=2;const v=['kg','eg','og','dg'][l+1];const fs=document.getElementById('floorSel');if(fs)fs.value=v;document.querySelectorAll('.seg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.floor===v)));}
function setFloor(on){setLevel(on?1:0);}
function goTo(key){
  const v=VIEWS[key];const p=new THREE.Vector3(...v.p),t=new THREE.Vector3(...v.t);setLevel(v.fl===-1?-1:(v.fl===2?2:(v.fl?1:0)));facadeMode=!!v.facade;
  if(reduce){camera.position.copy(p);controls.target.copy(t);return;}
  tween={p0:camera.position.clone(),t0:controls.target.clone(),p,t,start:performance.now(),dur:900};
}
camera.position.set(...VIEWS.overview.p);controls.target.set(...VIEWS.overview.t);

const viewSel=document.getElementById('viewSel');
viewSel.addEventListener('change',()=>goTo(viewSel.value));
const floorSel=document.getElementById('floorSel');floorSel.addEventListener('change',()=>{if(floorSel.value==='kg'){goTo('kg');return;}setLevel({eg:0,og:1,dg:2}[floorSel.value]);});
controls.addEventListener('start',()=>{tween=null;});
// Drehen im Raum: Kamera bleibt am Standpunkt (Umsehen statt Umkreisen), damit sie nicht durch Wände wandert
let pivot=null,camIn=false;const touchIds=new Set();
renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')touchIds.add(e.pointerId);
  const rot=e.pointerType==='touch'?touchIds.size===1:(e.button===0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey),c=camera.position;
  pivot=rot&&(camIn||(window.__roomAt&&window.__roomAt(c.x,c.y-0.5,c.z)))?c.clone():null;},true);
['pointerup','pointercancel'].forEach(n=>window.addEventListener(n,e=>touchIds.delete(e.pointerId),true));
renderer.domElement.addEventListener('wheel',()=>{pivot=null;},{capture:true,passive:true});
{const upd=controls.update.bind(controls);controls.update=function(){
  if(pivot&&!camera.position.equals(pivot))pivot=null; // Kamera wurde anderweitig bewegt (Ansichtswechsel o. Ä.)
  const r=upd();
  if(pivot){const d=controls.target.clone().sub(camera.position);camera.position.copy(pivot);controls.target.copy(pivot).add(d);}
  return r;};}

// ===== Ansichts-Menü (Bottom-Sheet) =====
(function(){
  const sheet=document.getElementById('viewSheet'),btn=document.getElementById('viewBtn'),tabs=document.getElementById('sheetTabs'),grid=document.getElementById('sheetGrid'),nameEl=document.getElementById('viewName'),sub=document.querySelector('.head p');
  const groups=[...viewSel.querySelectorAll('optgroup')].map(g=>({label:g.label,opts:[...g.querySelectorAll('option')].map(o=>({v:o.value,t:o.textContent}))}));
  let cur=0;
  const findGroup=v=>Math.max(0,groups.findIndex(g=>g.opts.some(o=>o.v===v)));
  function renderGrid(){grid.innerHTML='';groups[cur].opts.forEach(o=>{const b=document.createElement('button');b.textContent=o.t;if(o.v===viewSel.value)b.setAttribute('aria-current','true');b.addEventListener('click',()=>{choose(o.v);});grid.appendChild(b);});}
  function renderTabs(){tabs.innerHTML='';groups.forEach((g,i)=>{const b=document.createElement('button');b.setAttribute('role','tab');b.textContent=g.label;b.setAttribute('aria-selected',String(i===cur));b.addEventListener('click',()=>{cur=i;renderTabs();renderGrid();});tabs.appendChild(b);});}
  function open(){cur=findGroup(viewSel.value);renderTabs();renderGrid();sheet.hidden=false;btn.setAttribute('aria-expanded','true');}
  function close(){sheet.hidden=true;btn.setAttribute('aria-expanded','false');}
  function label(v){for(const g of groups)for(const o of g.opts)if(o.v===v)return o.t;return v;}
  window.__setViewLabel=t=>{nameEl.textContent=t;if(sub)sub.textContent=t;};
  function choose(v){viewSel.value=v;viewSel.dispatchEvent(new Event('change'));close();}
  viewSel.addEventListener('change',()=>window.__setViewLabel(label(viewSel.value)));
  btn.addEventListener('click',()=>sheet.hidden?open():close());
  document.getElementById('sheetClose').addEventListener('click',close);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sheet.hidden)close();});
  renderer.domElement.addEventListener('pointerdown',()=>{if(!sheet.hidden)close();});
  document.querySelectorAll('.seg button').forEach(b=>b.addEventListener('click',()=>{floorSel.value=b.dataset.floor;floorSel.dispatchEvent(new Event('change'));}));
  window.__setViewLabel(label(viewSel.value));
})();
// ===== Doppelklick / Doppeltipp: Raum wechseln, hingehen, Treppe hoch/runter =====
(function(){
  const EYE=1.6,toastEl=document.getElementById('toast');let tt=null;
  const toast=t=>{toastEl.textContent=t;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('on'),1600);};
  const shown=o=>{while(o){if(!o.visible)return false;o=o.parent;}return true;};
  const ROOMS=[
    ['Wohnzimmer','slide',0,W,0,D,0],['Esszimmer','dining',XW,XE,Z0,S,0],['Flur','hall',HX0,HX1,Z0,HZ1,0],['Küche','kitchen',KX0,KX1,KZ0,KZ1,0],['Bad','bath',BX0,BX1,BZ0,BZ1,0],['Schlafzimmer','bedroom',RX0,RX1,RZ0,RZ1,0],
    ['Windfang','vcorr',CX0,CL1,HZ1,EDZ,EF],
    ['Treppenpodest','landing',CX0,EX,HZ1+0.25,EDZ,LY],['WC (Zwischentreppe)','wcz',WCX0,CL1,WCZ0,WCZ1,LY],
    ['Janinas Zimmer','janina',JX0,JX1,JZ0,JZ1,OGF],['Wichtelzimmer','wichtel',KX0w,KX1w,KZ0w,KZ1w,OGF],['Lesezimmer','lese1',LX0,LX1,LZ0o,LZ1o,OGF],['Bastelzimmer','bastel1',GX0,GX1,LZ0o,LZ1o,OGF],['Au-pair-Zimmer','aupair1',AUX0,AUX1,AUZ0,AUZ1,OGF],['Bad oben','bathog',OBX0,OBX1,OBZ0,OBZ1,OGF],
    ['Bogenzimmer','kroom',KRX0,XE,KRZ0,KRZ1,CF],['Kellerbüro','kbuero',KBX0,KBX1,KBZ0,KBZ1,CF],['Waschküche','kvest',VX0,VX1,VZ0,WKZ1,CF],['Garage','garage',gx0,gx1,NF+0.32,NF+4.92,CF],['Vorratsraum','kpantry',PX0,PX1,PZ0b,PZ1b,CF],['Keller-WC','kwc',WX0-1.2,WX1-1.2,WZ0+4.55,WZ1+4.55,CF],['Kellerflur','kcab',CW1,6.1,4.53,6.55,CF],
    ['Yogazimmer','yoga',DKX0,DKX1,DKZ0,3.3,DGF],['Flur (DG)','dgflur',2.96,5.15,3.42,DKZ1,DGF],['Bad (DG)','dgbath',5.27,DKX1,3.42,DKZ1,DGF],['Abstellkammer','dgstore',DKX0,2.84,3.42,DKZ1,DGF]];
  window.__ROOMS=ROOMS;window.__toast=t=>toast(t);
  const roomAt=window.__roomAt=(x,y,z)=>ROOMS.find(r=>x>r[2]&&x<r[3]&&z>r[4]&&z<r[5]&&y>r[6]-0.35&&y<r[6]+(r[6]===0?H:2.45));
  // Treppenläufe: Bereich + unterer/oberer Standpunkt mit Blickrichtung
  const SM=(HX0+SUX)/2,S2=(SDX+EX)/2;
  const FLIGHTS=[
    {n:'Kellertreppe',box:[CW0,CW1,CF-0.1,EF+0.3,cz0-2.4,HZ1+0.4],lo:[3.5,CF,4.9,0,-1],hi:[3.5,EF,HZ1+EWT+0.35,0,-1]},
    {n:'Eingangstreppe',box:[SDX,EX,EF-0.1,0.3,SD0-0.1,SD0+NSD*SDT+0.1],lo:[exc,EF,EDZ-0.8,0,1],hi:[exc,0,SD0-0.45,0,1]},
    {n:'Treppe zum Podest',box:[HX0,SUX+0.05,-0.1,LY+0.3,SU0-0.1,LZ+0.05],lo:[SM,0,SU0-0.55,0,1],hi:[(HX0+EX)/2,LY,(HZ1+0.3+EDZ)/2,1,0]},
    {n:'Treppe ins Dachgeschoss',box:[AX0,AX1+0.05,OGF-0.1,DGF+0.3,ATZ0-0.1,ATZ0+NAT*ATS+0.05],lo:[(AX0+AX1)/2,OGF,ATZ0-0.55,0,1],hi:[3.75,DGF,6.95,0.3,1]},
    {n:'Treppe ins Obergeschoss',box:[SDX,EX,LY-0.1,OGF+0.3,U1Z-0.1,HZ1+0.35],lo:[S2,LY,(HZ1+0.3+EDZ)/2,0,-1],hi:[S2,OGF,U1Z-0.7,0,-1]}];
  window.__FLIGHTS=FLIGHTS;
  const inBox=(p,b)=>p.x>b[0]-0.05&&p.x<b[1]+0.05&&p.y>b[2]&&p.y<b[3]&&p.z>b[4]-0.05&&p.z<b[5]+0.05;
  const inGar=(x,y,z)=>x>gx0-0.02&&x<gx1+0.02&&z>NF-0.25&&z<NF+4.95&&y>CF-0.2&&y<CF+2.4;
  function moveTo(pos,look,lbl){const p=new THREE.Vector3(...pos),t=new THREE.Vector3(...look);facadeMode=inGar(pos[0],pos[1]-1,pos[2]);{const fy=pos[1]-EYE;setLevel(fy>DGF-0.4?2:(fy>OGF-0.4?1:0));}
    if(reduce){camera.position.copy(p);controls.target.copy(t);}else tween={p0:camera.position.clone(),t0:controls.target.clone(),p,t,start:performance.now(),dur:900};
    if(lbl){window.__setViewLabel(lbl);}toast(lbl||'');}
  const stand=(x,y,z,dx,dz,lbl)=>{const target=new THREE.Vector3(x,y+EYE,z);if(pathBlocked(target)){toast('Wand im Weg');return;}moveTo([x,y+EYE,z],[x+dx*2,y+EYE-0.25,z+dz*2],lbl);};
  const rc=new THREE.Raycaster(),v2=new THREE.Vector2();
  function hitAt(e){const r=renderer.domElement.getBoundingClientRect();v2.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);rc.setFromCamera(v2,camera);
    const hs=rc.intersectObjects(scene.children,true);
    for(const h of hs){const o=h.object;if(!o.isMesh||!shown(o))continue;const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||m.wireframe||(m.transparent&&m.opacity<0.7))continue;return h;}return null;}
  function floorBelow(x,y,z){const r2=new THREE.Raycaster(new THREE.Vector3(x,y,z),new THREE.Vector3(0,-1,0),0,4);r2.camera=camera;const hs=r2.intersectObjects(scene.children,true);for(const h of hs){if(h.object.isMesh&&shown(h.object))return h.point.y;}return y-EYE;}
  const clampIn=(r,x,z)=>[Math.min(Math.max(x,r[2]+0.35),r[3]-0.35),Math.min(Math.max(z,r[4]+0.35),r[5]-0.35)];
  function pathBlocked(target){
    const direction=target.clone().sub(camera.position),distance=direction.length();if(distance<0.12)return false;
    const pathRay=new THREE.Raycaster(camera.position.clone(),direction.normalize(),0.05,distance-0.08);pathRay.camera=camera;
    return pathRay.intersectObjects(scene.children,true).some(hit=>shown(hit.object)&&hit.object.userData.navBlocker);
  }
  function onDouble(e){const h=hitAt(e);if(!h)return;const p=h.point.clone(),c=camera.position;
    const n=h.face?h.face.normal.clone().transformDirection(h.object.matrixWorld):new THREE.Vector3(0,1,0);
    window.__lastHit=[p.x.toFixed(2),p.y.toFixed(2),p.z.toFixed(2),n.y.toFixed(2)];
    const portal=h.object.userData.navPortal;
    if(portal){const from=roomAt(c.x,c.y-0.5,c.z),target=portal.rooms[from&&from[1]];if(!target){toast('Kein angrenzender Raum');return;}if(!portal.isOpen()){toast('Tür ist geschlossen');return;}viewSel.value=target;viewSel.dispatchEvent(new Event('change'));return;}
    const camEye=c.y-EYE;
    const fl=FLIGHTS.find(f=>inBox(p,f.box));
    if(fl){const goUp=Math.abs(camEye-fl.lo[1])<=Math.abs(camEye-fl.hi[1]);const s=goUp?fl.hi:fl.lo;stand(s[0],s[1],s[2],s[3],s[4],fl.n+(goUp?' – oben':' – unten'));return;}
    const q=p.clone();if(Math.abs(n.y)<0.5)q.addScaledVector(n,0.06);
    const room=roomAt(q.x,q.y,q.z);
    const camRoom=roomAt(c.x,c.y-0.5,c.z);
    if(!room){toast('Kein Raum erkannt');return;}
    if(camRoom!==room){if(h.object.userData.navBlocker||pathBlocked(p)){toast('Wand oder geschlossene Tür im Weg');return;}viewSel.value=room[1];viewSel.dispatchEvent(new Event('change'));toast(room[0]);return;}
    const fy=room[6];
    const dir=new THREE.Vector3().subVectors(controls.target,c);dir.y=0;if(dir.lengthSq()<1e-4)dir.set(0,0,-1);dir.normalize();
    if(n.y>0.6&&p.y-fy<0.15){const [x,z]=clampIn(room,p.x,p.z);stand(x,fy,z,dir.x,dir.z,room[0]);return;}
    // Wand oder Möbel: 1,3 m davor in Richtung Kamera hinstellen und hinschauen
    const away=new THREE.Vector3(c.x-p.x,0,c.z-p.z);if(away.lengthSq()<1e-4)away.copy(dir).negate();away.normalize();
    const [x,z]=clampIn(room,p.x+away.x*1.3,p.z+away.z*1.3);
    if(pathBlocked(new THREE.Vector3(x,fy+EYE,z))){toast('Wand im Weg');return;}
    moveTo([x,fy+EYE,z],[p.x,Math.max(p.y,fy+1.0),p.z],room[0]);}
  let last=0,lx=0,ly=0,dx0=0,dy0=0;
  renderer.domElement.addEventListener('pointerdown',e=>{dx0=e.clientX;dy0=e.clientY;});
  renderer.domElement.addEventListener('dblclick',e=>{e.preventDefault();if(window.HAUS&&HAUS.navBlock&&HAUS.navBlock())return;onDouble(e);});
  window.__dblAt=(x,y)=>onDouble({clientX:x,clientY:y});
  renderer.domElement.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')return;if(window.HAUS&&HAUS.navBlock&&HAUS.navBlock())return;if(Math.hypot(e.clientX-dx0,e.clientY-dy0)>8)return;const now=performance.now();
    if(now-last<400&&Math.hypot(e.clientX-lx,e.clientY-ly)<40){last=0;onDouble(e);}else{last=now;lx=e.clientX;ly=e.clientY;}});
})();


const eveBtn=document.getElementById('evening');
eveBtn.addEventListener('click',()=>{
  const on=eveBtn.getAttribute('aria-pressed')!=='true';eveBtn.setAttribute('aria-pressed',String(on));
  scene.background=(on?NIGHT_BG:DAY_BG).clone();
  sun.intensity=on?0.08:1.7;side.intensity=on?0.05:0.45;hemi.intensity=on?0.08:0.6;amb.intensity=on?0.05:0.12;
  lampOn.emissiveIntensity=on?1.6:0.15;ledMat.emissiveIntensity=on?2.5:0.3;dLight.intensity=on?1.4:0;hLight.intensity=on?1.3:0;kLight.intensity=on?1.6:0;shade.material.emissiveIntensity=on?1.2:0.1;lampLight.intensity=on?2.2:0;pendLight.intensity=on?1.8:0;
  renderer.toneMappingExposure=on?1.25:1.05;
});

function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(stage);resize();

function loop(now){
  doorTick();
  if(tween){
    const k=Math.min(1,(now-tween.start)/tween.dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    camera.position.lerpVectors(tween.p0,tween.p,e);controls.target.lerpVectors(tween.t0,tween.t,e);
    if(k>=1)tween=null;
  }
  controls.update();
  const c=camera.position;
  const inside=(c.y<H&&((c.x>0&&c.x<W&&c.z>0&&c.z<D)||(c.x>XW&&c.x<XE&&c.z>Z0&&c.z<S)))||(c.y<3.6&&c.x>HX0&&c.x<HX1&&c.z>Z0&&c.z<HZ1)||(c.y<OGF+OGH&&c.x>CX0&&c.x<CL1&&c.z>HZ1-0.1&&c.z<EDZ)||(c.y>LY&&c.y<OGF+OGH&&c.x>HX0&&c.x<EX&&c.z>U1Z-1.4&&c.z<HZ1+0.4)||(c.y<0.9&&c.x>CW0&&c.x<CW1&&c.z>Z0&&c.z<HZ1+0.35)||(c.y<-0.3&&c.x>KRX0&&c.x<CW1&&c.z>KRZ0&&c.z<KRZ1)||(c.y<-0.3&&c.x>KBX0&&c.x<KBX1&&c.z>KBZ0-0.1&&c.z<KRZ0)||(c.y<-0.3&&c.x>VX0-0.3&&c.x<VX1+0.2&&c.z>-0.1&&c.z<VZ1)||(c.y<-0.3&&c.x>CW1-0.05&&c.x<8.45&&c.z>3.7&&c.z<8.0)||(c.y<-0.3&&c.x>WX1-0.05&&c.x<CRX1&&c.z>CRZ0&&c.z<CRZ1)||(c.y<H&&c.x>KX0&&c.x<KX1&&c.z>KZ0&&c.z<KZ1)||(c.y<H&&c.x>BX0&&c.x<BX1&&c.z>BZ0&&c.z<BZ1)||(c.y<H&&c.x>RX0&&c.x<RX1&&c.z>RZ0&&c.z<RZ1);
  gWin.visible=inside||c.z>-0.05;gLeft.visible=inside||!(c.x<0&&c.z<D);gRight.visible=inside||c.x<W+0.05;gBack.visible=inside||c.z<D+0.05;
  gDW.visible=inside||c.x>XW;gDS.visible=inside||c.z<S;gDE.visible=inside||c.x<XE;gHE.visible=inside||c.x<HX1;gHS.visible=inside||c.z<HZ1;gVS.visible=inside||c.z<EDZ||c.y<2.2;const inOG=(c.y>LY+0.5&&c.y<OGF+OGH&&c.x>HX0-0.1&&c.x<CL1&&c.z>Z0&&c.z<FZ)||c.y>OGF&&c.y<OGF+OGH&&((c.x>JX0&&c.x<JX1&&c.z>JZ0&&c.z<JZ1)||(c.x>KX0w&&c.x<KX1w&&c.z>KZ0w&&c.z<KZ1w)||(c.x>GX0&&c.x<LX1&&c.z>LZ0o&&c.z<LZ1o)||(c.x>AUX0&&c.x<AUX1&&c.z>AUZ0&&c.z<AUZ1)||(c.x>OBX0&&c.x<OBX1&&c.z>OBZ0&&c.z<OBZ1)||(c.x>HX0&&c.x<EX&&c.z>JZ1&&c.z<U1Z+0.3));
  const inWG=c.y>OGF&&c.y<OGF+WGH&&c.x>GX0&&c.x<GX1&&c.z>LZ0o&&c.z<LZ1o;gVR.visible=inside||c.y<4.5;gUp.visible=inside||c.y<4.5||floorOG;gVRoof.visible=inside||c.y<4.5;gOG.visible=floorOG||inOG;const inDG=c.y>DGF+0.2&&c.y<DGF+2.45&&c.x>DKX0&&c.x<DKX1&&c.z>DKZ0&&c.z<DKZ1;gDG.visible=floorDG||inDG;camIn=inside||inOG||inDG;gDGshell.visible=inDG;if(inDG)gOG.visible=true;jLab.visible=gOG.visible;wLab.visible=gOG.visible;lLab.visible=gOG.visible;aLab.visible=gOG.visible;obLab.visible=gOG.visible;gOBE.visible=inOG||c.x<OBX1;gOBW.visible=inOG||c.x>OBX0;gAW.visible=inOG||c.x>AUX0;gAS.visible=inOG||c.z<AUZ1;gAE.visible=inOG||c.x<AUX1;gAN.visible=inOG||c.z>AUZ0;gLab.visible=gOG.visible;gGW.visible=inOG||c.x>GX0;gGS.visible=inOG||c.z<LZ1o;gGN.visible=inOG||c.z>LZ0o;gLS.visible=inOG||c.z<LZ1o;gLE.visible=inOG||c.x<LX1;gGC.visible=inWG||c.y<OGF+WGH;gWN.visible=inOG||c.z>KZ0w;gWE.visible=inOG||c.x<KX1w;gWS.visible=inOG||c.z<KZ1w;gJN.visible=inOG||c.z>JZ0;gJW.visible=inOG||c.x>JX0;gJE.visible=inOG||c.x<JX1;gJS.visible=inOG||c.z<JZ1;gVW.visible=inside||c.x>CX0-EWT;gCE.visible=inside||c.x<CL1;gCel.visible=inside;gKE.visible=inside||c.x<KX1;gKS.visible=inside||c.z<KZ1;gKN.visible=inside||c.z<KZ0;gBaE.visible=inside||c.x<BX1;gBN.visible=inside||c.z>RZ0;gBE.visible=inside||c.x<RX1;
  if(facadeMode&&c.y>11)facadeMode=false;
  gMid.visible=facadeMode||floorOG||(c.x>HX0-0.1&&c.x<CL1&&c.z>Z0&&c.z<FZ&&c.y>1.2&&c.y<OGF+OGH);gRoof.visible=facadeMode;if(window.__atticRail)window.__atticRail.visible=!facadeMode;if(facadeMode){facadeGroups.forEach(g=>g.visible=true);gCel.visible=c.y<1.2&&Math.hypot(c.x-3,c.z-3)<16;}(window.__garConf||[]).forEach(m=>m.visible=!facadeMode);if(facadeMode){dimG.visible=false;}else dimG.visible=document.getElementById('dims').getAttribute('aria-pressed')==='true';
  dgLabs.forEach(l=>l.visible=gDG.visible);if(gDG.visible)[jLab,wLab,lLab,gLab,aLab,obLab].forEach(l=>l.visible=false);
  if(kgMode){gCel.visible=true;gRoof.visible=true;(window.__garConf||[]).forEach(m=>m.visible=false);}
  if(!window.__pls){window.__pls=[];scene.traverse(o=>{if(o.isPointLight){let q=o,out=false;while(q){if(q===gRoof||q===gVS)out=true;q=q.parent;}window.__pls.push([o,out]);}});}
  {const fm=facadeMode||kgMode,key=fm?1:0;if(window.__plk!==key){window.__plk=key;window.__pls.forEach(([l,out])=>{l.visible=!fm||out||kgMode;});__shF=0;}}
  if(__shF<3||(__shF%20===0)){renderer.shadowMap.needsUpdate=true;}__shF++;
  renderer.render(scene,camera);
  // Auflösung an die Geräteleistung anpassen (flüssig drehen hat Vorrang)
  {const tn=performance.now();__ft+=tn-__fl;__fl=tn;if(++__fn>=45){const avg=__ft/__fn;__ft=0;__fn=0;let np=__pr;if(avg>30&&__pr>1)np=Math.max(1,__pr-0.25);else if(avg<17&&__pr<__prMax)np=Math.min(__prMax,__pr+0.25);if(np!==__pr){__pr=np;renderer.setPixelRatio(__pr);resize();}}}
  requestAnimationFrame(loop);
}
scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='PlaneGeometry'&&Math.abs(o.rotation.x+Math.PI/2)<1e-3){if(!Array.isArray(o.material)&&!o.material.polygonOffset)o.material=o.material.clone();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{m.polygonOffset=true;m.polygonOffsetFactor=-1;m.polygonOffsetUnits=-4;});}});
// ---- Performance: unbewegliche Teile je Gruppe, Material und Rolle (Deko/Möbel/Wand) zu wenigen Objekten zusammenfassen ----
(function(){
  scene.updateMatrixWorld(true);
  const fixed=new Set();const add=(S,o)=>o&&o.traverse&&o.traverse(m=>{if(m.isMesh)S.add(m);});
  acts.forEach(o=>add(fixed,o));shutters.forEach(sh=>{add(fixed,sh.m);add(fixed,sh.grp);});doors.forEach(d=>add(fixed,d.g));sashes.forEach(sh=>add(fixed,sh.pv));
  try{add(fixed,diningSet);}catch(e){}try{add(fixed,lever);}catch(e){}try{slices.forEach(o=>add(fixed,o));}catch(e){}
  const TOG=new Set([(typeof gAE!=='undefined'?gAE:null),(typeof gAN!=='undefined'?gAN:null),(typeof gAS!=='undefined'?gAS:null),(typeof gAW!=='undefined'?gAW:null),(typeof gBE!=='undefined'?gBE:null),(typeof gBN!=='undefined'?gBN:null),(typeof gBaE!=='undefined'?gBaE:null),(typeof gBack!=='undefined'?gBack:null),(typeof gCE!=='undefined'?gCE:null),(typeof gCel!=='undefined'?gCel:null),(typeof gDE!=='undefined'?gDE:null),(typeof gDG!=='undefined'?gDG:null),(typeof gDGshell!=='undefined'?gDGshell:null),(typeof gDS!=='undefined'?gDS:null),(typeof gDW!=='undefined'?gDW:null),(typeof gGC!=='undefined'?gGC:null),(typeof gGN!=='undefined'?gGN:null),(typeof gGS!=='undefined'?gGS:null),(typeof gGW!=='undefined'?gGW:null),(typeof gHE!=='undefined'?gHE:null),(typeof gHS!=='undefined'?gHS:null),(typeof gJE!=='undefined'?gJE:null),(typeof gJN!=='undefined'?gJN:null),(typeof gJS!=='undefined'?gJS:null),(typeof gJW!=='undefined'?gJW:null),(typeof gKE!=='undefined'?gKE:null),(typeof gKN!=='undefined'?gKN:null),(typeof gKS!=='undefined'?gKS:null),(typeof gLE!=='undefined'?gLE:null),(typeof gLS!=='undefined'?gLS:null),(typeof gLab!=='undefined'?gLab:null),(typeof gLeft!=='undefined'?gLeft:null),(typeof gMid!=='undefined'?gMid:null),(typeof gOBE!=='undefined'?gOBE:null),(typeof gOBW!=='undefined'?gOBW:null),(typeof gOG!=='undefined'?gOG:null),(typeof gRight!=='undefined'?gRight:null),(typeof gRoof!=='undefined'?gRoof:null),(typeof gUp!=='undefined'?gUp:null),(typeof gVR!=='undefined'?gVR:null),(typeof gVRoof!=='undefined'?gVRoof:null),(typeof gVS!=='undefined'?gVS:null),(typeof gVW!=='undefined'?gVW:null),(typeof gWE!=='undefined'?gWE:null),(typeof gWN!=='undefined'?gWN:null),(typeof gWS!=='undefined'?gWS:null),(typeof gWin!=='undefined'?gWin:null),window.__atticRail].filter(Boolean));
  try{if(!furnList)furnList=buildFurn();}catch(e){furnList=furnList||[];}
  const furnSrc=furnList.slice(),decoSrc=decoMeshes.slice(),srcRec=new Map();
  const dS=new Set(decoMeshes),fS=new Set(furnList),wS=new Set(wallMeshes),gS=new Set(window.__garConf||[]);
  const meshes=[];scene.traverse(o=>{if(o.isMesh)meshes.push(o);});
  const snap=meshes.map(m=>m.matrixWorld.clone());
  anims.forEach(a=>{const c=a.get();try{a.set(a.open||1);}catch(e){return;}scene.updateMatrixWorld(true);meshes.forEach((m,k)=>{if(!m.matrixWorld.equals(snap[k]))fixed.add(m);});a.set(c);});
  scene.updateMatrixWorld(true);
  const isId=g=>g.position.lengthSq()===0&&g.rotation.x===0&&g.rotation.y===0&&g.rotation.z===0&&g.scale.x===1&&g.scale.y===1&&g.scale.z===1;
  const chainOk=par=>{let q=par;while(q&&q!==scene){if(!isId(q)||q.isMesh)return false;q=q.parent;}return q===scene;};
  const tgt=new Map();const targetOf=par=>{if(tgt.has(par))return tgt.get(par);let q=par,r=null;while(q&&q!==scene){if(chainOk(q)){r=q;break;}if(TOG.has(q)){r=false;break;}q=q.parent;}if(r===null&&q===scene)r=scene;tgt.set(par,r);return r;};
  const buckets=new Map();
  meshes.forEach(m=>{if(!m.parent)return;if(m.material===breadM)return;const par=targetOf(m.parent);if(!par)return;
    if(fixed.has(m)||!m.visible||Array.isArray(m.material)||!m.material||m.material.transparent||m.userData.sash||m.userData.navPortal||m.isInstancedMesh)return;
    const g=m.geometry;if(!g||!g.attributes||!g.attributes.position||(g.morphAttributes&&Object.keys(g.morphAttributes).length))return;
    const sig=(dS.has(m)?'d':'')+(fS.has(m)?'f':'')+(wS.has(m)?'w':'')+(gS.has(m)?'g':'');
    const k=par.uuid+'|'+m.material.uuid+'|'+(m.castShadow?1:0)+(m.receiveShadow?1:0)+'|'+sig;let b=buckets.get(k);if(!b){b={par,mat:m.material,cs:m.castShadow,rs:m.receiveShadow,sig,list:[]};buckets.set(k,b);}b.list.push(m);});
  let merged=0;const rm=new Set(),nd=[],nf=[],nw=[],ng=[];
  buckets.forEach(b=>{if(b.list.length<2)return;const pos=[],nor=[],uv=[],recs=[];const inv=new THREE.Matrix4().copy(b.par.matrixWorld).invert();
    b.list.forEach(m=>{const g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();recs.push({src:m,parent:m.parent,start:pos.length/3,count:g.attributes.position.count,groups:g.groups.map(q=>[q.start,q.count,q.materialIndex||0])});g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld));if(!g.attributes.normal)g.computeVertexNormals();
      const P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv;for(let i=0;i<P.count;i++){pos.push(P.getX(i),P.getY(i),P.getZ(i));nor.push(N.getX(i),N.getY(i),N.getZ(i));if(U)uv.push(U.getX(i),U.getY(i));else uv.push(0,0);}g.dispose();});
    const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));G.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));G.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));G.computeBoundingSphere();G.computeBoundingBox();
    const big=new THREE.Mesh(G,b.mat);big.castShadow=b.cs;big.receiveShadow=b.rs;big.userData.merged=1;b.par.add(big);
    big.userData.recs=recs;recs.forEach(r=>{r.big=big;srcRec.set(r.src,r);});
    b.list.forEach(m=>{m.parent.remove(m);rm.add(m);});merged+=b.list.length;
    if(b.sig.includes('d'))nd.push(big);if(b.sig.includes('f'))nf.push(big);if(b.sig.includes('w'))nw.push(big);if(b.sig.includes('g'))ng.push(big);});
  const fix=(arr,extra)=>{const keep=arr.filter(m=>!rm.has(m));arr.length=0;arr.push(...keep,...extra);};
  fix(decoMeshes,nd);fix(wallMeshes,nw);furnList=furnList.filter(m=>!rm.has(m)).concat(nf);if(window.__garConf)fix(window.__garConf,ng);
  window.__merged=merged;__shF=0;
  // Schnittstelle für den Einrichtungsmodus (einrichten.js)
  window.HAUS={scene,camera,renderer,controls,col,M,Mu,H,OGF,DGF,CF,editMode:false,furnSrc,decoSrc,srcRec,diningSet,dLight,wallMeshes,decoMeshes,
    rooms:()=>window.__ROOMS||[],toast:t=>window.__toast&&window.__toast(t),dirty:()=>{__shF=0;},
    addFurn:a=>{furnList.push(...a);const hid=furnBtn.getAttribute('aria-pressed')==='true';a.forEach(m=>m.visible=!hid);},
    addDeco:a=>{decoMeshes.push(...a);const hid=decoBtn.getAttribute('aria-pressed')==='true';a.forEach(m=>m.visible=!hid);},
    removeFurn:a=>{const S=new Set(a);furnList=furnList.filter(m=>!S.has(m));},
    // Türen (Drehflügel, Einrichtungsmodus "Türen") und Garagentor
    anims,doors,toggleDoor,B,canvasTex,clickable,swing,tog,gRoof,NF,gx0,gx1,garPans:window.__garPans||[],white,
    isFacade:()=>facadeMode||kgMode};
})();
requestAnimationFrame(loop);
})();
