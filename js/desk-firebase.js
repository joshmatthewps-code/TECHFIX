import {firebaseConfig as cfg} from "./firebase-config.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getFirestore, collection, addDoc, serverTimestamp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const app=initializeApp(cfg),auth=getAuth(app),db=getFirestore(app);
const ready=new Promise(res=>{const un=onAuthStateChanged(auth,u=>{un();res(u)})});
// Saves every finished problem as its own record (guests are skipped; they have no account)
window.TFdesk={async save(r){const u=await ready;if(!u)return;let pid="",grp="",ok=false;
 try{const p=JSON.parse(localStorage.getItem(localStorage.getItem("tf:last"))).P;if(p.research&&p.research.joined){pid=p.research.id;grp=p.research.group;ok=true}}catch(e){}
 if(!ok)return;
 try{await addDoc(collection(db,"players",u.uid,"desk"),{problem:r.index+1,name:r.problem,score:r.score,stars:r.stars,wasted:r.wasted,hints:r.hints,secs:r.secs,pid,group:grp,uid:u.uid,clientTime:Date.now(),at:serverTimestamp()});console.log("TechFix: simulator result saved")}
 catch(e){console.error("TechFix simulator save failed:",e&&e.code,e&&e.message)}}};
