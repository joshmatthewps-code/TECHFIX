// Pre-test gate: students must choose research option / finish the pre-test on the main page first
try{const k=localStorage.getItem("tf:last"),d=k&&JSON.parse(localStorage.getItem(k)),p=d&&d.P;if(!p||(p.uid&&!p.research)||(p.research&&p.research.joined&&!(p.tests&&p.tests.pre)))(parent!==window?parent.postMessage({type:"techfix-desktop-exit"},"*"):location.replace("index.html"))}catch(e){}
// Each problem changes the computer's state. The student must find the cause and fix it.
// s=setup, g=goal, fx=allowed fixing actions, w=message for a wrong try.
const PR=[
{n:"No internet",c:1,a:"Settings → Network & internet. Check the simple switches first.",t:'A student says: "I can\'t open any website."',h:"Open Settings and look at Network & internet.",s:s=>{s.air=1;s.net=null},g:s=>!s.air&&s.wifi&&s.net==="School-WiFi",fx:["tog:air:0","tog:wifi:1","net:School-WiFi"],w:"That setting is not the problem. Think about what the ticket says.",l:"Airplane mode turns off all wireless. Check the simple settings first, then connect to the school network."},
{n:"Frozen app",c:0,a:"Task Manager → Processes. Look for the one that is Not responding.",t:"Notes froze and the whole computer is slow.",h:"Open Task Manager and look for the app that is Not responding.",s:s=>{s.procs.Notes={cpu:91,frozen:1}},g:s=>!s.procs.Notes,fx:["end:Notes"],w:"That is not the stuck app.",l:"Close only the stuck app. Never end System or other programs you do not need to touch."},
{n:"Slow start-up",c:2,a:"Task Manager → Startup tab. Look for High impact.",t:"A teacher says the computer takes minutes to start and is slow all day.",h:"In Task Manager, open the Startup tab and look at the High impact apps.",s:s=>{s.start.Game=1;s.start.Sync=1},g:s=>!s.start.Game&&!s.start.Sync&&s.start.Anti,fx:["st:Game:0","st:Sync:0"],w:"That one has low impact. Look for High impact.",l:"Turn off start-up apps with a High impact. Keep the antivirus on."},
{n:"Pop-up ads",c:0,a:"Browser → Add-ons.",t:"Ads keep popping up in the browser.",h:"Open Browser and look at its Add-ons.",s:s=>{s.ext.FreeCoupons=1},g:s=>!s.ext.FreeCoupons&&s.ext.AdBlock&&s.ext.Dictionary,fx:["extx:FreeCoupons"],w:"That add-on is useful. Keep it.",l:"A bad add-on can cause pop-ups. Remove the one you do not trust and keep the helpful ones."},
{n:"Too many tabs",c:2,a:"Browser → Tabs.",t:"A browser with lots of tabs is very slow.",h:"Open Browser and look at its Tabs.",s:s=>{s.tabs=["Homework","Games","Videos","Shop","News","Memes"]},g:s=>s.tabs.length===1&&s.tabs[0]==="Homework",fx:["tabx:Games","tabx:Videos","tabx:Shop","tabx:News","tabx:Memes"],w:"You still need that tab.",l:"Many open tabs slow the PC. Close the ones you do not need and keep your work."},
{n:"Power saver mode",c:2,a:"Settings → Power.",t:"A new laptop is slow, even for simple things.",h:"Open Settings and look at Power.",s:s=>{s.pw="saver"},g:s=>s.pw!=="saver",fx:["pw:bal","pw:best"],w:"That does not help. Look at the power mode.",l:"Power saver slows the PC to save battery. Use Balanced for school work."},
{n:"Printer offline",c:4,a:"Settings → Printers.",t:"The printer shows Offline and nothing prints.",h:"Open Settings and look at Printers.",s:s=>{s.cable=0},g:s=>s.cable,fx:["tog:cable:1"],w:"That is not the fix. Check the simple things first.",l:"Check the cable and plug first. Do not remove a printer that is not broken."},
{n:"Hidden program",c:2,a:"Task Manager → Processes. Find a program you do not know that uses lots of power.",t:"The PC is slow and a strange app is using a lot of power.",h:"In Task Manager, find a program you do not know that uses lots of power.",s:s=>{s.procs.xq_miner={cpu:88}},g:s=>!s.procs.xq_miner,fx:["end:xq_miner"],w:"That is not the strange one.",l:"An unknown program using lots of power may be harmful. End it, then scan the PC."},
{n:"Wrong Wi-Fi password",c:1,a:"Files has a note. Then Settings → Network & internet.",t:"A laptop says \"Can't connect to this network\".",h:"Open Files and read the note. Then connect to School-WiFi in Settings. Capital letters matter.",s:s=>{s.net=null;s.pr=1;s.note=1},g:s=>s.net==="School-WiFi"&&!s.pr,fx:["net:School-WiFi"],w:"That is not the school network.",l:"Check the password first. Capital letters matter."},
{n:"Router stuck",c:1,a:"Router app.",t:"Nobody in the room can get online.",h:"If nobody can get online, look at the router, not just this PC.",s:s=>{s.rt=1},g:s=>!s.rt,fx:["rtr"],w:"The router is working fine.",l:"When all devices are offline, restart the router, not the PC."},
{n:"No network address",c:1,a:"Command Prompt.",t:"The PC says \"Limited connection\" and has no network address.",h:"Open Command Prompt and ask the router for a new address.",s:s=>{s.ip0=1},g:s=>!s.ip0,fx:["cmd:renew"],w:"That command does not fix this. Think about the address.",l:"The command ipconfig /renew asks the router for a new network address."},
{n:"Websites not loading",c:1,a:"Command Prompt. Test first, then clear the old addresses.",t:"Wi-Fi says connected, but websites will not open.",h:"Open Command Prompt. Test with ping, then clear the old saved website addresses.",s:s=>{s.dns=1},g:s=>!s.dns,fx:["cmd:dns"],w:"That command does not fix this. Test the internet first.",l:"The command ipconfig /flushdns clears old saved website addresses. Wi-Fi can be connected and still not open websites."},
{n:"Forgot PIN",c:3,a:"Settings → Accounts.",t:"A student forgot the PIN and can't sign in.",h:"Open Settings and look at Accounts.",s:s=>{s.pin=1},g:s=>!s.pin,fx:[],w:"That will not get you back in.",l:"Use 'I forgot my PIN' to reset it. Never reinstall Windows for this."},
{n:"Update failed",c:3,a:"Settings → Windows Update.",t:"Windows Update stops and shows an error.",h:"Open Settings and look at Windows Update. Let Windows find the problem first.",s:s=>{s.upd=1},g:s=>!s.upd,fx:[],w:"That does not help. Try the automatic fixer first.",l:"Try the update troubleshooter first, then restart to finish. Do not erase the PC."},
{n:"Broken Windows files",c:3,a:"Command Prompt.",t:"Windows shows random errors and some apps crash.",h:"Open Command Prompt and use the Windows file checker.",s:s=>{s.sfc=1},g:s=>!s.sfc,fx:["cmd:sfc"],w:"That command does not fix this. Think about broken Windows files.",l:"The command sfc /scannow finds and fixes broken Windows files."},
{n:"Crash after part update",c:3,a:"Settings → Device Manager.",t:"A blue screen appears after a PC part helper program (driver) was installed.",h:"Open Settings and look at Device Manager.",s:s=>{s.drv=1},g:s=>!s.drv,fx:[],w:"That does not fix it. Go back to the old version.",l:"Undo the bad driver update to go back to the old version of the PC part's helper program."},
{n:"PC won't start",c:3,a:"Repair Mode app.",t:"The PC shows a blue screen and keeps restarting.",h:"Open Repair Mode. Try Auto Repair first.",s:s=>{s.bs=1},g:s=>!s.bs,fx:[],w:"Restarting only repeats the loop. Use the repair screen.",l:"Use the repair screen. Try Auto Repair first, then Undo Recent Changes."},
{n:"App won't open",c:0,a:"Files. Find the app and run it with more permission.",t:"A student double-clicks an app but nothing opens.",h:"Open Files. Find the app that says Access denied. Some apps need more permission.",s:s=>{s.ao=1},g:s=>!s.ao,fx:[],w:"That will not fix it. The app only needs more permission.",l:"Some apps need more permission to open. Use Run as admin, and only click Yes for apps you trust."},
{n:"Problem after update",c:0,a:"Settings → Windows Update. The problem began after the update.",t:"The printer app crashes right after an update.",h:"Open Settings and look at Windows Update. The problem began after the update.",s:s=>{s.uu=1},g:s=>!s.uu,fx:[],w:"That is not the fix. The problem began after the update.",l:"If a new update causes problems, uninstall it. Restart to finish, then pause updates until a fix is out."},
{n:"Missing file error",c:0,a:"Settings → Apps. Try Repair first.",t:"A student opens Photo Editor and it says a file is missing.",h:"Open Settings and look at Apps. Try the safest fix first.",s:s=>{s.mf=1},g:s=>!s.mf,fx:[],w:"That is not the safest fix. Try Repair first. It keeps your data.",l:"Repair fixes broken app files without erasing your data. Try it before you uninstall."},
{n:"Hot and dusty PC",c:2,a:"Task Manager → Performance. Then the PC Case app.",t:"The PC is hot, loud and slows down after 10 minutes.",h:"In Task Manager, open Performance and check the heat. Then open PC Case.",s:s=>{s.dust=1},g:s=>!s.dust,fx:[],w:"That does not help. Dust blocks the air, so clean the air holes.",l:"Dust blocks the air, so the PC gets too hot and slows down. Clean the air holes with the PC turned off."},
{n:"No signal on monitor",c:4,a:"Monitor app. Check the cable, then the input.",t:'The monitor says "No signal".',h:"Open Monitor. Check the cable first, then check the input source.",s:s=>{s.mcab=0;s.minp="VGA"},g:s=>s.mcab&&s.minp==="HDMI",fx:["tog:mcab:1","inp:HDMI"],w:"That does not bring the picture back. Check the cable, then the input.",l:"Check the cable first, then check the input. The monitor needs both to show a picture."},
{n:"Mouse and keyboard",c:4,a:"Settings → Mouse & keyboard.",t:"The mouse does not move and the keyboard types the wrong letters.",h:"Open Settings and look at Mouse & keyboard. Check the plug first.",s:s=>{s.mou=0;s.kl="FR"},g:s=>s.mou&&s.kl==="US",fx:["tog:mou:1","kl:US"],w:"That is not the fix. Check the plug, then the keyboard layout.",l:"For devices, check the plug first. Wrong letters usually mean the wrong keyboard layout."},
{n:"Stuck print queue",c:4,a:"Settings → Printers. Look at the print queue.",t:"One document will not print and blocks all the others.",h:"Open Settings and look at Printers. Find the print queue.",s:s=>{s.pq=["Report.docx","Quiz.docx"]},g:s=>s.pq&&s.pq.length===1&&s.pq[0]==="Quiz.docx",fx:["pcx:Report.docx"],w:"That is not the problem. Look at the print queue. Cancel only the stuck document.",l:"One stuck document can block all the others. Cancel only the stuck document so the rest can print."},
{n:"USB not detected",c:4,a:"PC Case app. Look at the USB ports.",t:"A flash drive does not show in Files.",h:"Open PC Case and look at the USB ports. Try another port.",s:s=>{s.usb=1},g:s=>!s.usb,fx:[],w:"That will not help. Try another USB port.",l:"Try another USB port. Always eject the drive before you unplug it."}];
const $=id=>document.getElementById(id);
let i=0,S,W=[],z=10,waste=0,hints=0,t0,done=0,res=[],best={},tbH="",touched=0;
try{best=JSON.parse(localStorage.getItem(DKEY))||{}}catch(e){}
function fresh(){S={air:0,wifi:1,bt:1,net:"School-WiFi",procs:{Notes:{cpu:1},Browser:{cpu:2},Music:{cpu:1},System:{cpu:3}},start:{Game:0,Sync:0,Chat:1,Anti:1},tabs:["Homework"],ext:{AdBlock:1,Dictionary:1},pw:"bal",cable:1,tab:"p",pg:"net",bp:"pg",sel:null,out:[],ask:0,pr:0,note:0,rt:0,ip0:0,dns:0,pin:0,upd:0,sfc:0,drv:0,bs:0,ar:0,ao:0,uac:0,uu:0,mf:0,dust:0,mcab:1,minp:"HDMI",mou:1,kl:"US",pq:0,usb:0};if(i>=0)PR[i].s(S)}
const online=()=>!S.air&&S.wifi&&S.net&&!S.rt&&!S.ip0&&!S.dns;
function busy(){let b=6;for(const k in S.procs)if(S.procs[k].cpu>20)b+=S.procs[k].cpu-6;if(S.start.Game)b+=42;if(S.start.Sync)b+=36;b+=(S.tabs.length-1)*8;if(S.pw==="saver")b+=30;if(S.dust)b+=34;return Math.min(99,b)}
function toast(m){const e=$("toast");e.textContent=m;e.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display="none",4500)}
function begin(){fresh();W.forEach(w=>w.el.remove());W=[];$("wins").textContent="";waste=0;hints=0;done=0;touched=0;t0=Date.now();ticket();taskbar()}
function ticket(){if(i<0){$("tk").innerHTML=`<h4>LESSONS</h4><p><b>Pick a lesson</b><br><span class="mut">Open the Lessons List and choose what to practice.</span></p>`;return}$("tk").innerHTML=`<h4>PROBLEM ${i+1} OF ${PR.length}</h4><p><b>${PR[i].n}</b><br><span class="mut">${PR[i].t}</span></p><button class="btn g" id="hint">💡 Hint (−5)</button>`;$("hint").onclick=()=>{hints++;toast("💡 "+PR[i].h)}}
function taskbar(){const h=W.map(w=>`<span class="app${w.min?"":" on"}" data-w="${w.id}">${w.t}</span>`).join("");if(h!==tbH){tbH=h;$("apps").innerHTML=h}const b=busy();$("busy").textContent="Busy "+b+"%";$("busy").className=b>70?"bad":"";$("net").textContent=S.air?"✈️":S.wifi&&S.net?online()?"📶":"⚠️":"🚫"}
const APPS={settings:["⚙️ Settings",66,68],tm:["📊 Task Manager",60,66],web:["🌐 Browser",60,66],files:["📁 Files",50,56],lessons:["📚 Lessons List",54,72],router:["📡 Router",48,50],cmd:["⌨️ Command Prompt",58,58],rec:["🛟 Repair Mode",50,52],case:["🧰 PC Case",52,60],mon:["🖥️ Monitor",46,58]};
function openApp(a){let w=W.find(x=>x.a===a);if(!w){const d=APPS[a],el=document.createElement("div"),D=$("desk");el.className="win";el.style.cssText=`width:${d[1]}%;height:${d[2]}%`;
 el.innerHTML=`<div class="wt"><span>${d[0]}</span><b data-x="1">✕</b></div><div class="wb"></div>`;$("wins").appendChild(el);
 w={id:a,a,t:d[0],el,min:0,h:"",x:D.clientWidth*(.12+W.length*.03),y:D.clientHeight*(.06+W.length*.04)};el.style.transform=`translate3d(${w.x}px,${w.y}px,0)`;W.push(w);drag(w)}
 w.el.style.zIndex=++z;w.el.style.display="flex";w.min=0;paint(w);taskbar()}
function drag(w){const t=w.el.firstChild;let sx,sy,ox,oy,on=0,raf=0;
 const ap=()=>{raf=0;w.el.style.transform=`translate3d(${w.x}px,${w.y}px,0)`};
 t.addEventListener("pointerdown",e=>{if(e.target.dataset.x){closeW(w);return}on=1;w.el.style.zIndex=++z;w.el.classList.add("mv");sx=e.clientX;sy=e.clientY;ox=w.x;oy=w.y;t.setPointerCapture(e.pointerId)});
 t.addEventListener("pointermove",e=>{if(!on)return;const D=$("desk");w.x=Math.max(0,Math.min(D.clientWidth-60,ox+e.clientX-sx));w.y=Math.max(0,Math.min(D.clientHeight-60,oy+e.clientY-sy));if(!raf)raf=requestAnimationFrame(ap)});
 const up=()=>{on=0;w.el.classList.remove("mv")};t.addEventListener("pointerup",up);t.addEventListener("pointercancel",up)}
function closeW(w){w.el.remove();W=W.filter(x=>x!==w);taskbar()}
const sw=(on,a,k)=>`<span class="sw${on?" on":""}" data-act="${a}" data-k="${k}"></span>`,
row=(a,b)=>`<div class="row"><span>${a}</span>${b}</div>`,
side=(items,cur,a)=>`<div class="side">`+items.map(x=>`<span class="${cur===x[0]?"on":""}" data-act="${a}" data-k="${x[0]}">${x[1]}</span>`).join("")+`</div>`;
function pSet(){const g=S.pg;let h=side([["net","🌐 Network & internet"],["bt","🔵 Bluetooth"],["dp","🖥️ Display"],["pw","🔋 Power"],["pr","🖨️ Printers"],["mk","🖱️ Mouse & keyboard"],["apps","📦 Apps"],["acc","👤 Accounts"],["upd","🔄 Windows Update"],["dm","🖥️ Device Manager"]],g,"pg")+`<div class="main">`;
 if(g==="net")h+=row("✈️ Airplane mode",sw(S.air,"tog","air"))+row("📶 Wi-Fi",sw(S.wifi,"tog","wifi"))+(S.air?'<p class="bad">Airplane mode is ON. All wireless is off.</p>':S.wifi?S.ask?pwUi():(S.ip0?'<p class="bad">Limited connection. No network address.</p>':"")+["School-WiFi","Home-5G","Guest"].map(x=>`<div class="row" data-act="net" data-k="${x}"><span>${x}</span><span class="${S.net===x?"ok":"mut"}">${S.net===x?"Connected":"Connect"}</span></div>`).join(""):'<p class="mut">Wi-Fi is off.</p>');
 else if(g==="bt")h+=row("Bluetooth",sw(S.bt,"tog","bt"))+'<p class="mut">Mouse and headphones connect here.</p>';
 else if(g==="pw")h+=[["saver","Power saver","Longer battery, slower PC"],["bal","Balanced","Good for school work"],["best","Best performance","Fastest, uses more battery"]].map(x=>`<div class="row" data-act="pw" data-k="${x[0]}"><span>${x[1]} <span class="mut">${x[2]}</span></span><span class="ok">${S.pw===x[0]?"✔":""}</span></div>`).join("");
 else if(g==="pr")h+=row("🖨️ Classroom Printer",`<span class="${S.cable?"ok":"bad"}">${S.cable?"Ready":"Offline"}</span>`)+row("🔌 Cable connected",sw(S.cable,"tog","cable"))+'<div class="row" data-act="prrm"><span class="bad">🗑️ Remove printer</span></div>'+pQ();
 else if(g==="mk")h+=pMk();else if(g==="apps")h+=pApps();else if(g==="acc")h+=pAcc();else if(g==="upd")h+=pUpd();else if(g==="dm")h+=pDm();
 else h+='<p class="mut">Brightness and screen size. Nothing to change here.</p>';
 return h+`</div>`}
function pTm(){const p=S.tab==="p",tb=(k,l,on)=>`<span class="tab${on?" on":""}" data-act="tab" data-k="${k}">${l}</span>`;
 return `<div class="main"><div class="bt">${tb("p","Processes",p)}${tb("s","Startup",S.tab==="s")}${tb("f","Performance",S.tab==="f")}<span class="mut" style="margin-left:auto">Computer busy: ${busy()}%</span></div>`+
 (p?Object.keys(S.procs).map(k=>{const o=S.procs[k],hi=o.cpu>50;return `<div class="row${S.sel===k?" sel":""}" data-act="sel" data-k="${k}"><span>${k}${o.frozen?' <span class="bad">Not responding</span>':""}</span><span class="${hi?"bad":"mut"}">${o.cpu}%</span></div>`}).join("")+'<div><button class="btn" data-act="end">End task</button></div>':S.tab==="f"?pPerf():
 [["Game","Game Launcher","High"],["Sync","Cloud Sync","High"],["Chat","Chat app","Low"],["Anti","Antivirus","Low"]].map(x=>row(`${x[1]} <span class="${x[2]==="High"?"bad":"mut"}">${x[2]} impact</span>`,sw(S.start[x[0]],"st",x[0]))).join(""))+`</div>`}
function pWeb(){const on=online(),p=S.bp,t=(k,l)=>`<span class="tab${p===k?" on":""}" data-act="bp" data-k="${k}">${l}</span>`;let h=`<div class="main"><div class="bt">${t("pg","🌐 Page")}${t("tabs","🗂️ Tabs ("+S.tabs.length+")")}${t("ext","🧩 Add-ons")}</div>`;
 if(p==="tabs")h+=S.tabs.map(x=>row("🗂️ "+x,`<b class="xb" data-act="tabx" data-k="${x}">✕</b>`)).join("");
 else if(p==="ext")h+=Object.keys(S.ext).map(x=>row("🧩 "+x,`<b class="xb" data-act="extx" data-k="${x}">Remove</b>`)).join("");
 else h+=`<div style="text-align:center;margin:auto"><div style="font-size:calc(var(--u)*5)">${S.ext.FreeCoupons?"🚨":on?"✅":"🚫"}</div><b class="${on&&!S.ext.FreeCoupons?"ok":"bad"}">${S.ext.FreeCoupons?"Ads keep popping up!":on?"Websites open. You are online.":!S.wifi||S.air||!S.net?"No internet connection.":S.dns?"Website not found.":"The page will not load."}</b></div>`;
 return h+`</div>`}
const CAT=[["🧩","Software"],["🌐","Internet"],["🐢","Slow Computer"],["💿","Windows"],["⌨️","Devices"]],stars=n=>"★".repeat(n>=90?3:n>=70?2:1);
function pLes(){const nx=PR.findIndex((_,k)=>best[k]==null);return `<div class="main">`+CAT.map((c,ci)=>PR.map((p,k)=>p.c===ci?`<div class="row${k===i?" sel":""}" data-act="les" data-k="${k}"><span>${p.n}${k===nx?' <span class="ok">NEXT</span>':""}</span><span class="${best[k]!=null?"ok":"mut"}">${best[k]!=null?stars(best[k]):"Start"}</span></div>`:"").join("")).map((h,ci)=>h?`<b class="mut">${CAT[ci][0]} ${CAT[ci][1]}</b>`+h:"").join("")+`</div>`}
function ask(h,p,a,b,fn){if($("ask"))return;const c=document.createElement("div");c.className="cover";c.id="ask";c.style.zIndex=9700;c.innerHTML=`<h1>${h}</h1><p>${p}</p><div style="display:flex;gap:12px"><button class="btn g" id="stay" style="font-size:12px">${a}</button><button class="btn" id="yes" style="font-size:12px">${b}</button></div>`;document.body.appendChild(c);$("stay").onclick=()=>c.remove();$("yes").onclick=()=>{c.remove();fn()}}
function pick(k){if(k===i&&!done){toast("You are already on this lesson.");return}if(i>=0&&touched&&!done)ask("LEAVE THIS LESSON?","Your progress on this lesson will not be saved.","STAY","LEAVE",()=>pick2(k));else pick2(k)}
function pick2(k){i=k;begin();toast("Lesson started. Open the apps you need.")}
const pwUi=()=>'<p>Enter the password for <b>School-WiFi</b></p>'+["Tech2026","tech2026","Tech2025"].map(x=>`<div class="row" data-act="pwd" data-k="${x}"><span>${x}</span></div>`).join("")+'<div class="row" data-act="pwd" data-k=""><span class="mut">← Back</span></div>',
pRt=()=>`<div class="main">`+row("Internet light",`<span class="${S.rt?"bad":"ok"}">${S.rt?"🔴 Blinking red":"🟢 Green"}</span>`)+row("Devices online",`<span class="${S.rt?"bad":"ok"}">${S.rt?"0 of 12":"12 of 12"}</span>`)+'<div class="bt"><button class="btn" data-act="rtr">🔌 Restart router</button><button class="btn g" data-act="rpc">🔄 Restart this PC</button></div></div>',
CM=[["renew","ipconfig /renew"],["dns","ipconfig /flushdns"],["ping","ping 8.8.8.8"],["sfc","sfc /scannow"],["fmt","format C:"]],CK={renew:["ip0","New address received."],dns:["dns","Old website addresses cleared."],sfc:["sfc","Windows files repaired. No more errors."]},
bt2=(a,l,c)=>`<div class="row" data-act="${a}"><span class="${c||""}">${l}</span></div>`,
pAcc=()=>S.pin?row("Sign-in",'<span class="bad">❌ Wrong PIN</span>')+bt2("pinx","🔢 Try the PIN again")+bt2("fpin","🔑 I forgot my PIN")+bt2("reinst","💣 Reinstall Windows","bad"):'<p class="ok">Signed in. Nothing to fix.</p>',
pUpd=()=>S.uu?pUU():S.upd===1?row("Windows Update",'<span class="bad">❌ Update failed</span>')+bt2("updf","🛠️ Run update troubleshooter")+bt2("reinst","💣 Reset this PC","bad"):S.upd===2?row("Windows Update",'<span class="ok">Update ready</span>')+bt2("updr","🔄 Restart now to finish"):'<p class="ok">Windows is up to date.</p>',
pDm=()=>S.drv?row("⚠️ Screen Card",'<span class="bad">New driver crashes</span>')+bt2("drvu","⏪ Undo driver update")+bt2("drvw","⬆️ Update driver again")+bt2("drvw","🚫 Disable the device"):row("🖥️ Screen Card",'<span class="ok">Working</span>'),
pRec=()=>S.bs?'<div class="main"><p class="bad">:( Your PC ran into a problem. It cannot start Windows.</p>'+bt2("recA","🛠️ Auto Repair")+bt2("recU","🕘 Undo Recent Changes")+bt2("rstx","🔄 Restart")+bt2("reinst","💣 Reset PC","bad")+'</div>':'<div class="main"><p class="ok">The PC is working. Nothing to repair.</p></div>',
pCmd=()=>`<div class="main"><div class="row" style="cursor:default;display:block;min-height:calc(var(--u)*13);background:#05080f;font-family:ui-monospace,monospace"><div>${S.out.slice(-7).join("</div><div>")||"C:\\&gt; _"}</div></div><div class="bt">`+CM.map(x=>`<button class="btn g" data-act="cmd" data-k="${x[0]}">${x[1]}</button>`).join("")+`</div></div>`,
pFiles=()=>{let h='<div class="main"><div class="row">📄 Homework.docx</div><div class="row">🖼️ Photo.png</div>',x=0;
 if(S.note){x=1;h+='<div class="row">📝 Wi-Fi note: School-WiFi password is Tech2026 (capital T)</div>'}
 if(S.ao){x=1;h+=S.uac?'<p>Allow this app to change your PC?</p><div class="row">🧮 GradeTool.exe · Publisher: School ICT ✔ Trusted</div>'+bt2("uacy","✅ Yes")+bt2("uacn","❌ No"):row("🧮 GradeTool.exe",'<span class="bad">Access denied</span>')+bt2("aopen","▶ Open the app")+bt2("aadm","🔑 Run as admin")+bt2("nope","🗑️ Delete the app","bad")}
 if(S.usb===1){x=1;h+='<div class="row"><span class="bad">💾 USB drive not detected</span></div>'}else if(S.usb===2){x=1;h+='<div class="row">💾 Flash Drive (E:)</div>'}
 return h+(x?"":'<p class="mut">Nothing here fixes the problem.</p>')+'</div>'},PNL={rec:pRec,router:pRt,cmd:pCmd,lessons:pLes,settings:pSet,tm:pTm,web:pWeb,files:pFiles};
function pPerf(){return row("🌡️ Temperature",`<span class="${S.dust?"bad":"ok"}">${S.dust?"🔥 95°C":"55°C"}</span>`)+row("🌀 Fan",`<span class="${S.dust?"bad":"ok"}">${S.dust?"Very loud":"Quiet"}</span>`)+(S.dust?'<p class="bad">Too hot. The PC slows itself down to stay safe.</p>':'<p class="ok">The PC is cool.</p>')}
function pUU(){return S.uu===1?row("🖨️ Printer app",'<span class="bad">Crashes</span>')+row("Newest update",'<span class="bad">Printer App Update 4.2 · 10 minutes ago</span>')+bt2("uun","↩️ Uninstall the newest update")+bt2("nope","🔁 Install the update again","bad")+bt2("reinst","💣 Reset this PC","bad"):S.uu===2?row("Printer App Update 4.2",'<span class="ok">Removed</span>')+bt2("uur","🔄 Restart now to finish"):row("Windows Update",'<span class="mut">Updates install again tonight</span>')+bt2("upau","⏸️ Pause updates for now")+bt2("nope","⬆️ Install updates now","bad")}
function pApps(){return '<div class="main">'+row("📷 Photo Editor",S.mf?'<span class="bad">❌ A file is missing</span>':'<span class="ok">Works</span>')+row("📝 Notes",'<span class="ok">Works</span>')+(S.mf?bt2("rep","🛠️ Repair Photo Editor")+bt2("nope","🗑️ Uninstall Photo Editor (erases its data)","bad")+bt2("reinst","💣 Reset this PC","bad"):'<p class="mut">All apps work.</p>')+'</div>'}
function pMk(){const L=[["US","English (US)"],["FR","French (AZERTY)"],["DE","German (QWERTZ)"]],T={US:"A Z",FR:"Q W",DE:"A Y"};return '<div class="main">'+row("🖱️ Mouse plug",sw(S.mou,"tog","mou"))+`<p class="${S.mou?"ok":"bad"}">${S.mou?"The pointer moves.":"The pointer does not move."}</p><b class="mut">⌨️ Keyboard layout</b>`+L.map(x=>`<div class="row" data-act="kl" data-k="${x[0]}"><span>${x[1]}</span><span class="ok">${S.kl===x[0]?"✔":""}</span></div>`).join("")+`<p>You press <b>A Z</b>. It types: <b class="${S.kl==="US"?"ok":"bad"}">${T[S.kl]}</b></p></div>`}
function pQ(){return S.pq?'<b class="mut">🗂️ Print queue</b>'+S.pq.map(x=>{const st=x==="Report.docx"?'<span class="bad">⚠️ Error</span>':S.pq.includes("Report.docx")?'<span class="mut">Waiting</span>':'<span class="ok">Printing…</span>';return row("📄 "+x,`<span>${st} <b class="xb" data-act="pcx" data-k="${x}">Cancel</b></span>`)}).join(""):""}
function pCase(){let h='<div class="main"><b class="mut">🌬️ Air holes and fan</b>'+row("Air holes",`<span class="${S.dust?"bad":"ok"}">${S.dust?"Full of dust":"Clean"}</span>`);
 if(S.dust)h+=bt2("dust","🌬️ Clean the air holes (PC off)")+bt2("nope","🔄 Restart the PC")+bt2("spray","💦 Spray water inside","bad");
 h+='<b class="mut">🔌 USB ports</b>';
 if(S.usb===1)h+=row("Port 1 · flash drive",'<span class="bad">❌ Not detected</span>')+'<div class="row" data-act="usbm" data-k="2"><span>↪ Move the drive to Port 2</span></div><div class="row" data-act="usbm" data-k="3"><span>↪ Move the drive to Port 3</span></div>'+bt2("nope","🔄 Restart the PC");
 else if(S.usb===2)h+=row("💾 Flash Drive (E:)",'<span class="ok">Detected</span>')+bt2("ej","⏏️ Safely eject")+bt2("pull","✋ Pull it out now","bad");
 else h+='<p class="mut">Nothing is plugged in.</p>';
 return h+'</div>'}
function pMon(){const ok=S.mcab&&S.minp==="HDMI";return '<div class="main"><div style="text-align:center;margin:auto"><div style="font-size:calc(var(--u)*5)">'+(ok?"🖥️":"⬛")+'</div><b class="'+(ok?"ok":"bad")+'">'+(ok?"Picture OK":"No signal")+'</b></div>'+row("🔌 HDMI cable plugged in",sw(S.mcab,"tog","mcab"))+'<b class="mut">Input source</b>'+["VGA","HDMI","DisplayPort"].map(x=>`<div class="row" data-act="inp" data-k="${x}"><span>${x}</span><span class="ok">${S.minp===x?"✔":""}</span></div>`).join("")+'</div>'}
PNL.case=pCase;PNL.mon=pMon;
function paint(w){const h=PNL[w.a](),b=w.el.lastChild;if(h===w.h)return;const s=b.scrollTop;b.innerHTML=h;b.scrollTop=s;w.h=h}
function repaint(){W.forEach(w=>{if(!w.min)paint(w)});taskbar();if(!done&&i>=0&&PR[i].g(S))solved()}
function wrong(m){waste++;const a=PR[i]&&PR[i].a;toast("✖ "+m+(a&&waste>=2?" 💡 Clue: "+a:""))}
const NAV={pg:"pg",tab:"tab",bp:"bp",sel:"sel"};
function act(a,k){if(a==="les"){pick(+k);return}if(i<0&&!NAV[a]){toast("Pick a lesson in the Lessons List first.");return}const f=PR[i]?PR[i].fx:[],P=PR[i]||{};if(!NAV[a])touched=1;
 if(NAV[a])S[NAV[a]]=k;
 else if(a==="tog"){const v=S[k]?0:1;S[k]=v;if(k==="air"&&v||k==="wifi"&&!v)S.net=null;if(!f.includes("tog:"+k+":"+v))wrong(P.w)}
 else if(a==="net"){if(S.pr&&k==="School-WiFi")S.ask=1;else{S.net=k;if(!f.includes("net:"+k))wrong("That is not the school network.")}}
 else if(a==="pwd"){if(k==="Tech2026"){S.net="School-WiFi";S.pr=0;S.ask=0}else if(k==="")S.ask=0;else wrong("Wrong password. Capital letters matter.")}
 else if(a==="rtr"){if(f.includes("rtr")){S.rt=0;toast("✔ Router restarted.")}else wrong(P.w)}
 else if(a==="rpc")wrong("Other devices are offline too. The problem is not this PC.")
 else if(a==="cmd"){const o=S.out,c=CM.find(x=>x[0]===k);o.push("C:\\&gt; "+c[1]);
  if(k==="ping")o.push(!S.wifi||S.air||!S.net?"Cannot send: no connection.":S.ip0?"No network address.":S.rt?"Request timed out.":S.dns?"Reply OK. Internet works, but names fail.":"Reply OK. Internet works.");
  else if(k==="fmt"){o.push("Cancelled.");wrong("That would erase the whole PC! Never use it for this.")}
  else if(f.includes("cmd:"+k)){S[CK[k][0]]=0;o.push(CK[k][1])}
  else{o.push("Nothing changed.");wrong(P.w)}}
 else if(a==="pw"){S.pw=k;if(!f.includes("pw:"+k))wrong(P.w)}
 else if(a==="st"){const v=S.start[k]?0:1;S.start[k]=v;if(!f.includes("st:"+k+":"+v))wrong(k==="Anti"&&!v?"Antivirus protects the PC. Keep it on.":P.w)}
 else if(a==="end"){const p=S.sel;if(!p)toast("Tap a program first.");else if(p==="System")wrong("Windows needs System. It cannot be ended.");else if(f.includes("end:"+p)){delete S.procs[p];S.sel=null;toast("✔ "+p+" closed.")}else wrong(p+" is working fine. Leave it alone.")}
 else if(a==="fpin"){S.pin=0;toast("✔ New PIN created. Signed in.")}
 else if(a==="pinx")wrong("Wrong PIN. Guessing will not help.")
 else if(a==="reinst")wrong("That erases everything. Never do this for a simple problem.")
 else if(a==="updf"){S.upd=2;toast("✔ Update problem fixed. Restart to finish.")}
 else if(a==="updr"){S.upd=0;toast("✔ Restarted. Update installed.")}
 else if(a==="drvu"){S.drv=0;toast("✔ Old version restored. No more crashes.")}
 else if(a==="drvw")wrong(P.w)
 else if(a==="recA"){S.ar=1;toast("Auto Repair could not fix it. A new update may be the cause.")}
 else if(a==="recU"){if(S.ar){S.bs=0;toast("✔ Your PC went back to how it was yesterday.")}else wrong("Try the safest fix first: Auto Repair.")}
 else if(a==="rstx")wrong("Restarting only repeats the loop. Use the repair screen.")
 else if(a==="tabx"){if(f.includes("tabx:"+k))S.tabs=S.tabs.filter(x=>x!==k);else wrong(P.w)}
 else if(a==="extx"){if(f.includes("extx:"+k))delete S.ext[k];else wrong(P.w)}
 else if(a==="prrm")wrong("Removing the printer will not fix it. The printer is not broken.");
 else if(a==="nope")wrong(P.w)
 else if(a==="spray")wrong("Water can break the PC! Never spray water inside.")
 else if(a==="aopen")toast("Access denied. This app needs more permission.")
 else if(a==="aadm")S.uac=1
 else if(a==="uacn")S.uac=0
 else if(a==="uacy"){S.uac=0;S.ao=0;toast("✔ The app opens normally.")}
 else if(a==="uun"){S.uu=2;toast("✔ Update removed. Restart to finish.")}
 else if(a==="uur"){S.uu=3;toast("✔ Restarted. No more crashes.")}
 else if(a==="upau"){S.uu=0;toast("✔ Updates paused until a fix is out.")}
 else if(a==="rep"){S.mf=0;toast("✔ Repair finished. The files are back.")}
 else if(a==="dust"){S.dust=0;toast("✔ Air holes cleaned. The PC is cool again.")}
 else if(a==="inp"){S.minp=k;if(!f.includes("inp:"+k))wrong(P.w)}
 else if(a==="kl"){S.kl=k;if(!f.includes("kl:"+k))wrong(P.w)}
 else if(a==="pcx"){if(f.includes("pcx:"+k)){S.pq=S.pq.filter(x=>x!==k);toast("✔ Stuck document removed. The next one prints.")}else wrong(P.w)}
 else if(a==="usbm"){S.usb=2;toast("✔ The drive appeared in Files.")}
 else if(a==="ej"){S.usb=0;toast("✔ Ejected safely. No lost files.")}
 else if(a==="pull")wrong("Pulling it out can lose files. Eject it the safe way.");
 repaint()}
function solved(){done=1;const score=Math.max(30,100-waste*10-hints*5),stars=score>=90?3:score>=70?2:1,secs=Math.round((Date.now()-t0)/1000),r={problem:PR[i].n,score,stars,wasted:waste,hints,secs};res.push(r);
 best[i]=Math.max(best[i]||0,score);try{localStorage.setItem(DKEY,JSON.stringify(best))}catch(e){}
 emit("techfix-desktop-ticket",{index:i,result:r});try{window.TFdesk&&TFdesk.save(Object.assign({index:i},r))}catch(e){}const all=PR.every((_,k)=>best[k]!=null),nx=PR.findIndex((_,k)=>best[k]==null),c=document.createElement("div");c.className="cover";
 c.innerHTML=`<h1>PROBLEM SOLVED!</h1><p>${"★".repeat(stars)}${"☆".repeat(3-stars)} · ${score} points<br>${waste} wrong tries · ${hints} hints · ${secs}s</p><p>${PR[i].l}</p><div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center"><button class="btn" id="nx" style="font-size:12px">${all?"SEE FINAL SCORE":"CONTINUE ▶"}</button>${all?"":`<button class="btn g" id="ll" style="font-size:12px">📚 LESSONS LIST</button>`}${FROMQ?`<button class="btn g" id="bq" style="font-size:12px">🎯 BACK TO QUIZ</button>`:""}</div>${all?"":`<p class="mut" style="font-size:14px">Next: <b>${PR[nx].n}</b></p>`}`;document.body.appendChild(c);if($("bq"))$("bq").onclick=leave;if($("ll"))$("ll").onclick=()=>{c.remove();toLessons()};
 $("nx").onclick=()=>{c.remove();if(all)final();else pick2(nx)}}
function toLessons(){i=-1;begin();openApp("lessons")}
function final(){const tot=PR.reduce((a,_,k)=>a+(best[k]||0),0),c=document.createElement("div");c.className="cover";c.innerHTML=`<h1>ALL DONE</h1><p>${tot} / ${PR.length*100} points</p><button class="btn" id="ag" style="font-size:12px">BACK TO LESSONS</button>`;document.body.appendChild(c);emit("techfix-desktop-complete",{total:tot,results:res});$("ag").onclick=()=>{c.remove();toLessons()}}
function emit(type,d){d.type=type;try{parent.postMessage(d,"*")}catch(e){}}
$("desk").addEventListener("click",e=>{const ic=e.target.closest("[data-app]"),ap=e.target.closest("[data-w]"),ac=e.target.closest("[data-act]"),wn=e.target.closest(".win");
 if(ic){openApp(ic.dataset.app);return}
 if(ap){const w=W.find(x=>x.id===ap.dataset.w);if(w){w.min=!w.min;w.el.style.display=w.min?"none":"flex";w.el.style.zIndex=++z;if(!w.min)paint(w);taskbar()}return}
 if(wn){const w=W.find(x=>x.el===wn);if(w&&+w.el.style.zIndex!==z)w.el.style.zIndex=++z}
 if(ac)act(ac.dataset.act,ac.dataset.k)});
const H0=(window.__TFH||location.hash),L0=(H0.match(/lesson=(\d+)/)||[])[1],FROMQ=/from=quiz/.test(H0),EXIT_URL=FROMQ?"index.html#quiz":"index.html";
function leave(){try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}try{screen.orientation.unlock()}catch(e){}emit("techfix-desktop-exit",{});if(parent!==window)return;location.href=EXIT_URL}
$("exit").onclick=()=>{if($("start").style.display!=="none"){leave();return}if($("ask"))return;const c=document.createElement("div");c.className="cover";c.id="ask";c.style.zIndex=9700;c.innerHTML=`<h1>LEAVE THE SIMULATOR?</h1><p>Your progress on this problem will not be saved.</p><div style="display:flex;gap:12px"><button class="btn g" id="stay" style="font-size:12px">STAY</button><button class="btn" id="yes" style="font-size:12px">LEAVE</button></div>`;document.body.appendChild(c);$("stay").onclick=()=>c.remove();$("yes").onclick=leave};
$("go").onclick=async()=>{$("start").style.display="none";try{await document.documentElement.requestFullscreen()}catch(e){}try{await screen.orientation.lock("landscape")}catch(e){}toLessons();if(L0!==undefined&&PR[+L0])pick2(+L0)};
