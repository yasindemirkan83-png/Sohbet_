import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
apiKey: "AIzaSyDE5-fq9ifhtBlXTVOR1PhzD3XuVOWSVeE",
authDomain: "studio-3972799448-609d1.firebaseapp.com",
databaseURL: "https://studio-3972799448-609d1-default-rtdb.firebaseio.com",
projectId: "studio-3972799448-609d1",
storageBucket: "studio-3972799448-609d1.firebasestorage.app",
messagingSenderId: "210449601127",
appId: "1:210449601127:web:b3339666a09822b40c7ac2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

const splash = document.getElementById("splash");
const login = document.getElementById("login");
const appDiv = document.getElementById("app");
const userName = document.getElementById("userName");
const settings = document.getElementById("settings");
const settingsBtn = document.getElementById("settingsBtn");

let currentUser = null;

// Splash -> Login
setTimeout(()=>{splash.style.display="none"; login.style.display="flex"},5000);

// Login
document.getElementById("googleLogin").onclick=()=>signInWithPopup(auth,provider);

// Auth
onAuthStateChanged(auth,(user)=>{
if(user){
currentUser=user;
login.style.display="none";
appDiv.style.display="block";
userName.innerText=user.displayName;

// Load tasks
const taskRef = ref(db,'tasks');
onChildAdded(taskRef,(data)=>{
const li=document.createElement("li");
li.innerText=data.val().text;
document.getElementById("taskList").appendChild(li);
});

// Load messages
const msgRef = ref(db,'messages');
onChildAdded(msgRef,(data)=>{
const div=document.createElement("div");
div.innerText=data.val().text;
document.getElementById("chatBox").appendChild(div);
});
}
});

// Logout
window.logout=()=>{signOut(auth); location.reload()}

// Settings
settingsBtn.onclick=()=>{appDiv.style.display="none"; settings.style.display="block"}
window.backHome=()=>{settings.style.display="none"; appDiv.style.display="block"}

// Task
window.addTask=()=>{
let val=document.getElementById("taskInput").value;
if(!val) return;
push(ref(db,'tasks'),{text:val});
document.getElementById("taskInput").value="";
}

// Message
window.sendMsg=()=>{
let val=document.getElementById("msgInput").value;
if(!val) return;
push(ref(db,'messages'),{text:val});
document.getElementById("msgInput").value="";
}

// Alarm
window.addAlarm=()=>{
let t=prompt("Dakika gir:");
if(t) setTimeout(()=>alert("Alarm!"),t*60000);
}

// Feedback
window.sendFeedback=()=>{
const msg=prompt("Mesajınızı yazın:");
if(msg) window.location.href=`mailto:yasindemirkan83@gmail.com?subject=Görüş & Öneri&body=${encodeURIComponent(msg)}`;
}
