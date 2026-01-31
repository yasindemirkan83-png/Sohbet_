// app.js
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded, remove, update, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { app } from "./firebaseConfig.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

// Elements
const splash = document.getElementById("splash");
const login = document.getElementById("login");
const appDiv = document.getElementById("app");
const userName = document.getElementById("userName");
const settings = document.getElementById("settings");
const settingsBtn = document.getElementById("settingsBtn");

const taskInput = document.getElementById("taskInput");
const taskStart = document.getElementById("taskStart");
const taskEnd = document.getElementById("taskEnd");
const taskList = document.getElementById("taskList");

const msgInput = document.getElementById("msgInput");
const chatBox = document.getElementById("chatBox");

// Splash -> Login
setTimeout(()=>{
    splash.style.display="none";
    login.style.display="flex";
},5000);

// Google Login
document.getElementById("googleLogin").onclick = () => {
    signInWithPopup(auth, provider);
};

// Auth
onAuthStateChanged(auth, (user)=>{
    if(user){
        login.style.display="none";
        appDiv.style.display="block";
        userName.innerText = user.displayName;
        loadTasks(user.uid);
        loadMessages(user.uid);
    }
});

// Logout
window.logout = () => {
    signOut(auth);
    location.reload();
};

// SETTINGS
settingsBtn.onclick = () => {
    settings.style.display = settings.style.display==='block'?'none':'block';
};
window.backHome = () => {
    settings.style.display = 'none';
};

// FIREBASE TASKS
function addTask(){
    const desc = taskInput.value.trim();
    const start = taskStart.value;
    const end = taskEnd.value;
    if(!desc || !start || !end) return alert("Tüm alanları doldurun!");
    const user = auth.currentUser;
    const taskRef = ref(db,'tasks/'+user.uid);
    push(taskRef,{
        desc,start,end,done:false
    });
    taskInput.value=''; taskStart.value=''; taskEnd.value='';
}

// Load tasks
function loadTasks(uid){
    const taskRef = ref(db,'tasks/'+uid);
    taskList.innerHTML='';
    onChildAdded(taskRef, (snap)=>{
        const task = snap.val();
        const li = document.createElement("li");
        li.dataset.key = snap.key;
        li.className = task.done ? 'selected':'';
        li.innerHTML = `<b>${task.desc}</b><br>
        <small>${task.start} - ${task.end}</small>
        <div style="margin-top:5px;">
        <button onclick="toggleDone('${snap.key}')">✔</button>
        <button onclick="deleteTask('${snap.key}')">🗑️</button>
        <button onclick="addAlarm('${snap.key}')">⏰</button>
        </div>`;
        taskList.prepend(li);
    });
}

// Toggle done
window.toggleDone = (key)=>{
    const user = auth.currentUser;
    const tRef = ref(db,'tasks/'+user.uid+'/'+key);
    update(tRef,{done:true});
};

// Delete task
window.deleteTask = (key)=>{
    const user = auth.currentUser;
    const tRef = ref(db,'tasks/'+user.uid+'/'+key);
    remove(tRef);
};

// Add alarm (simple alert for now)
window.addAlarm = (key)=>{
    const user = auth.currentUser;
    const tRef = ref(db,'tasks/'+user.uid+'/'+key);
    setTimeout(()=>{
        alert("Görev zamanı geldi!");
    },10000); // test için 10 saniye
};

// FIREBASE CHAT
function sendMsg(){
    const text = msgInput.value.trim();
    if(!text) return;
    const user = auth.currentUser;
    const msgRef = ref(db,'messages/');
    const now = new Date().toLocaleString();
    push(msgRef,{
        text,user:user.displayName,time:now
    });
    msgInput.value='';
}

function loadMessages(uid){
    const msgRef = ref(db,'messages/');
    chatBox.innerHTML='';
    onChildAdded(msgRef,(snap)=>{
        const msg = snap.val();
        const div = document.createElement("div");
        div.dataset.key = snap.key;
        div.className = 'message';
        div.innerHTML = `<div class="message-header">${msg.user} • ${msg.time}</div>
                         <div class="message-text">${msg.text}</div>
                         <button onclick="deleteMsg('${snap.key}')">🗑️</button>`;
        chatBox.prepend(div);
    });
}

// Delete message
window.deleteMsg = (key)=>{
    const mRef = ref(db,'messages/'+key);
    remove(mRef);
}

// Send feedback
window.sendFeedback = ()=>{
    const text = document.getElementById('feedbackText').value;
    window.location.href = `mailto:yasindemirkan83@gmail.com?subject=Görüş & Öneri&body=${encodeURIComponent(text)}`;
};
