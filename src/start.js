// Start: Abendstimmung, Fenstergröße, Zeichenschleife loop() mit Sichtbarkeit der Gruppen, Zusammenfassen der
// unbeweglichen Teile (Performance) und Schnittstelle window.HAUS für einrichten.js. Muss als letztes Modellskript laden.
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
  window.HAUS={scene,camera,renderer,controls,col,M,Mu,H,OGF,DGF,CF,konst:KONST,raeume:RAEUME,editMode:false,furnSrc,decoSrc,srcRec,diningSet,dLight,wallMeshes,decoMeshes,
    rooms:()=>window.__ROOMS||[],toast:t=>window.__toast&&window.__toast(t),dirty:()=>{__shF=0;},
    addFurn:a=>{furnList.push(...a);const hid=furnBtn.getAttribute('aria-pressed')==='true';a.forEach(m=>m.visible=!hid);},
    addDeco:a=>{decoMeshes.push(...a);const hid=decoBtn.getAttribute('aria-pressed')==='true';a.forEach(m=>m.visible=!hid);},
    removeFurn:a=>{const S=new Set(a);furnList=furnList.filter(m=>!S.has(m));},
    // Türen (Drehflügel, Einrichtungsmodus "Türen") und Garagentor
    anims,doors,toggleDoor,B,canvasTex,clickable,swing,tog,gRoof,NF,gx0,gx1,garPans:window.__garPans||[],white,
    isFacade:()=>facadeMode||kgMode};
})();
requestAnimationFrame(loop);
