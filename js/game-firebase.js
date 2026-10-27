import {firebaseConfig} from "./firebase-config.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, query, orderBy, limit, getDocs} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


if(!firebaseConfig.apiKey.startsWith("PASTE")){
  const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
  const authReady=new Promise(res=>{const un=onAuthStateChanged(auth,u=>{un();res(u)})});
  const ref=uid=>doc(db,"players",uid);
  const timeout=ms=>new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout")),ms));
  window.TFcloud={
    async signIn(){const p=new GoogleAuthProvider();p.setCustomParameters({prompt:"select_account"});return (await signInWithPopup(auth,p)).user},
    async pull(uid){const s=await Promise.race([getDoc(ref(uid)),timeout(6000)]);return s.exists()?s.data():null},
    async push(uid,data){await authReady;if(!auth.currentUser||auth.currentUser.uid!==uid)return;const {_lb,...rest}=data;await setDoc(ref(uid),{...rest,updatedAt:serverTimestamp()},{merge:true});if(_lb)await setDoc(doc(db,"leaderboard",uid),{..._lb,updatedAt:serverTimestamp()})},
    async top(){await authReady;const q=query(collection(db,"leaderboard"),orderBy("points","desc"),limit(10));const sn=await Promise.race([getDocs(q),timeout(8000)]);return sn.docs.map(d=>({id:d.id,...d.data()}))},
    async all(){await authReady;if(!auth.currentUser)await this.signIn();const sn=await Promise.race([getDocs(collection(db,"players")),timeout(15000)]);return sn.docs.map(d=>({id:d.id,...d.data()}))},
    signOut(){return signOut(auth)}
  };
}
