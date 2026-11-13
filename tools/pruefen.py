#!/usr/bin/env python3
"""Prüft das Hausmodell im unsichtbaren Chrome (headless). Voraussetzung: `python server.py` läuft auf Port 8000.

Aufruf:  python tools/pruefen.py fingerabdruck   -> Kennzahlen des Modells (vor und nach einem Umbau vergleichen)
         python tools/pruefen.py funktion        -> Drehen, Zoomen, Schalter, Doppelklick, Einrichtungsmodus
         python tools/pruefen.py laufen          -> Laufmodus: Start, Wände halten, außen laufen, alle Treppen
         python tools/pruefen.py                 -> alles

Fingerabdruck: Anzahl der Bauteile und je eine Prüfsumme über alle Bauteile (Lage, sämtliche Eckpunkte, Farbe,
Sichtbarkeit – unabhängig von der Reihenfolge), über Räume/Treppen (ROOMS, FLIGHTS) und über die Ansichten (VIEWS).
Bleiben die Zahlen bei einer reinen Umsortierung gleich, ist das Modell unverändert.

Technik: Die Testseite wird kurz als src/__pruefen.html abgelegt und lädt index.html in einem Rahmen. Chrome gibt
die Seite erst aus, wenn alles geladen ist; ein absichtlich langsames Bild (Port 8017) hält sie so lange offen,
bis der Test fertig ist.
"""
import os, re, subprocess, sys, threading, time, urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "src" / "__pruefen.html"
URL = "http://localhost:8000"
CHROME = [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
          r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
          "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]

KOPF = r"""<!doctype html><meta charset=utf-8><body><div id=o>läuft</div><img src="http://127.0.0.1:8017/x.gif"><iframe id=f width=900 height=600></iframe><script>
const w=ms=>new Promise(r=>setTimeout(r,ms));const O=document.getElementById('o'),out=[];const log=t=>{out.push(t);O.textContent=out.join(' | ');};window.errs=[];
const f=document.getElementById('f');
const laden=async()=>{const html=await (await fetch('index.html',{cache:'no-store'})).text();const p=new Promise(r=>{f.onload=()=>setTimeout(r,3000);});
 f.srcdoc=html.replace('<head>','<head><base href="/"><script>addEventListener("error",e=>parent.errs.push(e.message+" @"+(e.filename||"").split("/").pop()+":"+e.lineno))<\/script>');await p;
 const W=f.contentWindow;if(!W.HAUS)throw new Error('Modell nicht geladen: '+errs.join(' ; '));return W;};
const fehler=()=>'Ladefehler='+errs.length+(errs.length?' '+errs.slice(0,4).join(' ; '):'');
"""

FINGERABDRUCK = KOPF + r"""
(async()=>{try{const W=await laden(),H=W.HAUS;await w(1500);const L=[];H.scene.updateMatrixWorld(true);
 H.scene.traverse(o=>{if(!o.isMesh)return;let h=0;const add=v=>{h=(Math.imul(h,31)+Math.round(v*1000))|0;};o.matrixWorld.elements.forEach(add);
  const p=o.geometry&&o.geometry.attributes.position;if(p){add(p.count);for(let i=0;i<p.count*3;i++)add(p.array[i]);}
  const m=Array.isArray(o.material)?o.material[0]:o.material;if(m&&m.color)add(m.color.getHex());add(o.visible?1:0);L.push(h);});
 L.sort((a,b)=>a-b);const hs=s=>{let h=0;for(let i=0;i<s.length;i++)h=(Math.imul(h,31)+s.charCodeAt(i))|0;return h;};
 const rund=(k,v)=>typeof v==='number'?Math.round(v*1e6)/1e6:v;
 log('Bauteile='+L.length+' Modell='+hs(L.join())+' Raeume='+hs(JSON.stringify([W.__ROOMS,W.__FLIGHTS],rund))+' Ansichten='+hs(W.eval('JSON.stringify(VIEWS)'))
  +' Moebel='+W.__einrichten.pieces().length+' Tueren='+W.__einrichten.doors().length+' '+fehler());
}catch(e){log('FEHLER '+e.message);}})();
</script>"""

FUNKTION = KOPF + r"""
(async()=>{try{const W=await laden(),H=W.HAUS,cv=H.renderer.domElement,D=W.document,s=D.getElementById('viewSel');W.localStorage.clear();
 const ziehen=async()=>{const o={bubbles:true,pointerId:1,pointerType:'mouse',button:0,buttons:1,clientX:400,clientY:300};cv.dispatchEvent(new W.PointerEvent('pointerdown',o));
  for(let i=1;i<=15;i++){D.dispatchEvent(new W.PointerEvent('pointermove',{...o,clientX:400+i*15}));await w(25);}D.dispatchEvent(new W.PointerEvent('pointerup',{...o,buttons:0}));await w(700);};
 const rad=async(dy,n)=>{for(let i=0;i<n;i++){cv.dispatchEvent(new W.WheelEvent('wheel',{bubbles:true,cancelable:true,deltaY:dy,clientX:400,clientY:300}));await w(20);}await w(300);};
 const raum=()=>{const c=H.camera.position,r=W.__roomAt(c.x,c.y-0.5,c.z);return r?r[0]:'keiner';};
 s.value='janina';s.dispatchEvent(new W.Event('change'));await w(1800);const p0=H.camera.position.clone(),d0=H.controls.target.clone().sub(p0).normalize();await ziehen();
 log('Drehen im Raum: Kamera bewegt='+H.camera.position.distanceTo(p0).toFixed(3)+' m (soll 0), gedreht='+(d0.angleTo(H.controls.target.clone().sub(H.camera.position).normalize())*57.3).toFixed(0)+' Grad');
 await rad(120,30);log('Herauszoomen: Raum='+raum()+' (soll Janinas Zimmer)');
 D.getElementById('walls').click();await w(200);await rad(120,30);log('mit Waende aus: Raum='+raum()+' (soll keiner)');D.getElementById('walls').click();
 s.value='overview';s.dispatchEvent(new W.Event('change'));await w(1800);const q=H.camera.position.clone();await ziehen();log('Uebersicht umkreisen: bewegt='+(H.camera.position.distanceTo(q)>1));
 D.querySelector('[data-floor=dg]').click();await w(300);log('Etage DG='+D.querySelector('[data-floor=dg]').getAttribute('aria-pressed'));
 D.getElementById('evening').click();await w(200);log('Abend='+D.getElementById('evening').getAttribute('aria-pressed'));
 s.value='janina';s.dispatchEvent(new W.Event('change'));await w(1800);W.__dblAt(450,350);await w(1500);log('Doppelklick: Ansicht="'+D.getElementById('viewName').textContent+'"');
 D.getElementById('editBtn').click();await w(300);D.querySelector('[data-tool=move]').click();await w(600);log('Einrichten: Moebel='+W.__einrichten.pieces().length+' '+fehler());
}catch(e){log('FEHLER '+e.message+' '+errs.join(' ; '));}})();
</script>"""

LAUFEN = KOPF + r"""
(async()=>{try{const W=await laden(),H=W.HAUS,D=W.document,s=D.getElementById('viewSel'),L=W.__laufen,R=W.__ROOMS;
 const ansicht=async v=>{s.value=v;s.dispatchEvent(new W.Event('change'));await w(1800);};
 const geh=async(code,ms)=>{L.taste(code,true);await w(ms);L.taste(code,false);await w(150);};
 const f=v=>v.toFixed(2),raum=p=>{const r=W.__roomAt(p.x,p.fuss+1,p.z);return r?r[0]:'keiner';};
 await ansicht('slide');const t0=performance.now();L.start();const bau=performance.now()-t0;await w(400);const z=L.zahl(),a=L.stand();
 log('Start im Wohnzimmer: Aufbau '+bau.toFixed(0)+' ms, Dreiecke fest='+z.fest+' beweglich='+z.beweglich+' davon Moebel='+z.moebel+', Fuss='+f(a.fuss)+' (soll 0.00), Regler aus='+(!H.controls.enabled));
 await geh('KeyW',4000);const b=L.stand();
 log('4 s geradeaus: '+f(Math.hypot(b.x-a.x,b.z-a.z))+' m gelaufen, Raum='+raum(b)+' (soll Wohnzimmer), Fuss='+f(b.fuss));
 await geh('KeyS',1500);await geh('KeyD',4000);const c=L.stand();log('zurueck und 4 s seitwaerts: Raum='+raum(c)+' x='+f(c.x)+' z='+f(c.z));
 L.stop();await w(300);log('Beendet: Regler an='+H.controls.enabled+', Leiste sichtbar='+(W.getComputedStyle(D.querySelector('.dock')).display!=='none'));
 await ansicht('overview');L.start();await w(400);const d=L.stand();await geh('KeyW',3000);const e=L.stand();
 log('Start aussen: x='+f(d.x)+' z='+f(d.z)+' Fuss='+f(d.fuss)+'; 3 s geradeaus: '+f(Math.hypot(e.x-d.x,e.z-d.z))+' m, Fuss='+f(e.fuss));
 await geh('KeyW',5000);const g=L.stand();log('weiter aufs Haus zu (5 s): x='+f(g.x)+' z='+f(g.z)+' Fuss='+f(g.fuss)+' Raum='+raum(g));
 L.stop();await ansicht('hall');L.start();await w(400);
 // Tür zur Kellertreppe öffnen (Klick-Teil vom Windfang aus suchen), dann jede Treppe hinauf und hinunter gehen
 {const T3=W.THREE,rc=new T3.Raycaster(new T3.Vector3(3.5,0.2,8.75),new T3.Vector3(0,0,-1),0,1.5);rc.camera=H.camera;const h=rc.intersectObjects(H.scene.children,true).find(h=>h.object.userData.act||h.object.userData.door);if(h){const u=h.object.userData;if(u.act)u.act();else W.eval('toggleDoor')(u.door);}await w(1500);}
 const weg=async(a,b)=>{L.setze(a[0],a[2],a[1],0);await w(150);L.taste('KeyW',true);let ok=false;
  for(let i=0;i<45&&!ok;i++){const p=L.stand(),dx=b[0]-p.x,dz=b[2]-p.z;ok=Math.hypot(dx,dz)<0.3&&Math.abs(p.fuss-b[1])<0.2;if(!ok){L.setze(p.x,p.z,undefined,Math.atan2(-dx,-dz));await w(200);}}
  L.taste('KeyW',false);return ok;};
 const tr=[];for(const F of W.__FLIGHTS){const up=await weg(F.lo,F.hi),dn=await weg(F.hi,F.lo);tr.push(F.n+': '+(up?'hoch ok':'HOCH HAENGT')+', '+(dn?'runter ok':'RUNTER HAENGT'));}
 log((tr.join('; ').includes('HAENGT')?'FEHLER ':'')+'Treppen: '+tr.join('; '));
 L.stop();log(fehler());
}catch(e){log('FEHLER '+e.message+' '+errs.join(' ; '));}})();
</script>"""

TESTS = {"fingerabdruck": (FINGERABDRUCK, 14), "funktion": (FUNKTION, 34), "laufen": (LAUFEN, 130)}


class Langsam(BaseHTTPRequestHandler):
    wartezeit = 10

    def do_GET(self):
        time.sleep(self.wartezeit)
        self.send_response(200)
        self.send_header("Content-Type", "image/gif")
        self.end_headers()

    def log_message(self, *a):
        pass


def lauf(name):
    html, sekunden = TESTS[name]
    Langsam.wartezeit = sekunden
    srv = HTTPServer(("127.0.0.1", 8017), Langsam)
    threading.Thread(target=srv.handle_request, daemon=True).start()
    PAGE.write_text(html, encoding="utf-8")
    try:
        chrome = next(c for c in CHROME if os.path.exists(c))
        r = subprocess.run([chrome, "--headless=new", "--enable-unsafe-swiftshader", "--window-size=1000,700",
                            "--dump-dom", f"{URL}/{PAGE.name}"], capture_output=True, timeout=sekunden + 60)
        m = re.search(r'<div id="o">([^<]*)', r.stdout.decode("utf-8", "replace"))
        text = m.group(1) if m else "keine Ausgabe"
    finally:
        PAGE.unlink(missing_ok=True)
        srv.server_close()
    print(f"[{name}]")
    for teil in text.split(" | "):
        print("  " + teil)
    return "FEHLER" not in text and "läuft" != text and "Ladefehler=0" in text


if __name__ == "__main__":
    try:
        urllib.request.urlopen(f"{URL}/api/info", timeout=3)
    except Exception:
        sys.exit("Der lokale Server läuft nicht – bitte zuerst `python server.py` starten.")
    namen = sys.argv[1:] or list(TESTS)
    ok = all([lauf(n) for n in namen])
    sys.exit(0 if ok else 1)
