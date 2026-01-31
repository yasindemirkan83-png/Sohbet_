// app.js
import { auth, provider, db } from "./firebaseConfig.js";
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* LOGIN */
const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");
const userName = document.getElementById("userName");
const googleLogin = document.getElementById("googleLogin");

googleLogin.onclick = ()=>{
    signInWithPopup(auth,provider);
};

onAuthStateChanged(auth, user=>{
    if(user){
        loginDiv.style.display="none";
        appDiv.style.display="flex";
        userName.innerText = user.displayName;
        loadTasks();
        loadMessages();
        loadUsers();
    }else{
        loginDiv.style.display="flex";
        appDiv.style.display="none";
    }
});

/* LOGOUT */
window.logout = ()=>{
    signOut(auth);
};

/* GÖREVLER */
const tasksRef = ref(db, "tasks");
function addTask(){
    const name = document.getElementById("taskInput").value;
    const start = document.getElementById("taskStart").value;
    const end = document.getElementById("taskEnd").value;
    if(!name) return alert("Görev adı gerekli");
    push(tasksRef,{
        name,start,end,completed:false,user:auth.currentUser.displayName
    });
    document.getElementById("taskInput").value="";
    document.getElementById("taskStart").value="";
    document.getElementById("taskEnd").value="";
}

function deleteTask(){
    const selected = document.querySelector(".task-item.selected");
    if(selected){
        remove(ref(db,"tasks/"+selected.dataset.key));
    }
}

function completeTask(){
    const selected = document.querySelector(".task-item.selected");
    if(selected){
        update(ref(db,"tasks/"+selected.dataset.key), {completed:true});
    }
}

function setAlarm(){
    const selected = document.querySelector(".task-item.selected");
    if(selected){
        const taskTime = new Date(selected.dataset.start).getTime();
        const now = Date.now();
        const delay = taskTime - now;
        if(delay>0){
            setTimeout(()=>alert(`Alarm! Görev: ${selected.innerText}`),delay);
        } else alert("Görev zamanı geçmiş!");
    }
}

function loadTasks(){
    const tasksDiv = document.getElementById("tasks");
    onValue(tasksRef, snapshot=>{
        tasksDiv.innerHTML="";
        snapshot.forEach(child=>{
            const t = child.val();
            const div = document.createElement("div");
            div.className="task-item";
            if(t.completed) div.style.background="rgba(16,185,129,0.4)";
            div.dataset.key = child.key;
            div.dataset.start = t.start;
            div.innerText=`${t.name} | ${t.start} - ${t.end}`;
            div.onclick = ()=>{document.querySelectorAll(".task-item").forEach(x=>x.classList.remove("selected")); div.classList.add("selected");}
            tasksDiv.prepend(div);
        });
    });
}

/* MESAJ */
const msgRef = ref(db,"messages");
function sendMsg(){
    const text = document.getElementById("msgInput").value;
    if(!text) return;
    push(msgRef,{
        text,user:auth.currentUser.displayName,time:new Date().toISOString()
    });
    document.getElementById("msgInput").value="";
}

function deleteMsg(){
    const selected = document.querySelector(".msg-item.selected");
    if(selected){
        remove(ref(db,"messages/"+selected.dataset.key));
    }
}

function loadMessages(){
    const chatDiv = document.getElementById("chatBox");
    onValue(msgRef, snapshot=>{
        chatDiv.innerHTML="";
        snapshot.forEach(child=>{
            const m = child.val();
            const div = document.createElement("div");
            div.className="msg-item";
            div.dataset.key = child.key;
            div.innerHTML=`<span>${m.user}: ${m.text}</span><span class="msg-meta">${new Date(m.time).toLocaleString()}</span>`;
            div.onclick = ()=>{document.querySelectorAll(".msg-item").forEach(x=>x.classList.remove("selected")); div.classList.add("selected");}
            chatDiv.prepend(div);
        });
    });
}

/* USERS ADMIN PANEL */
function loadUsers(){
    const usersDiv = document.getElementById("usersList");
    // Firebase realtime DB kullanıcıları göster (basit demo)
    usersDiv.innerHTML="";
    onValue(ref(db,"tasks"), snapshot=>{
        const users = new Set();
        snapshot.forEach(c=>users.add(c.val().user));
        usersDiv.innerHTML="";
        users.forEach(u=>{
            const div = document.createElement("div");
            div.className="user-item";
            div.innerText=u;
            usersDiv.appendChild(div);
        });
    });
}

/* FEEDBACK */
function sendFeedback(){
    const msg = document.getElementById("feedbackText").value;
    if(!msg) return;
    push(ref(db,"feedbacks"),{
        user:auth.currentUser.displayName,text:msg,time:new Date().toISOString()
    });
    document.getElementById("feedbackText").value="";
}
