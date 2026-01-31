import { auth, db } from "./firebaseConfig.js";
import { ref, set, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* -------------------- GÖREVLER -------------------- */
const tasksDiv = document.getElementById("tasks");
const taskInput = document.getElementById("taskInput");
const taskStart = document.getElementById("taskStart");
const taskEnd = document.getElementById("taskEnd");

let tasks = {};

export function addTask(){
  if(!taskInput.value || !taskStart.value || !taskEnd.value) return alert("Tüm alanları doldurun");
  const newTaskRef = push(ref(db, "tasks"));
  set(newTaskRef, {
    uid: auth.currentUser.uid,
    name: taskInput.value,
    start: taskStart.value,
    end: taskEnd.value,
    completed: false
  });
  taskInput.value=""; taskStart.value=""; taskEnd.value="";
}

/* Sil veya tamamlandı için seçilen görev */
export function deleteTask(){
  const sel = document.querySelector('input[name="taskRadio"]:checked');
  if(sel) remove(ref(db,"tasks/"+sel.value));
}
export function completeTask(){
  const sel = document.querySelector('input[name="taskRadio"]:checked');
  if(sel) update(ref(db,"tasks/"+sel.value), {completed:true});
}

/* Alarm */
export function setAlarm(){
  const sel = document.querySelector('input[name="taskRadio"]:checked');
  if(!sel) return alert("Görev seçin");
  const task = tasks[sel.value];
  const alarmTime = new Date(task.start).getTime() - Date.now();
  if(alarmTime>0){
    setTimeout(()=>alert(`Alarm: ${task.name}`), alarmTime);
    alert("Alarm kuruldu");
  } else alert("Geçmiş bir zaman seçemezsiniz");
}

/* Görevleri yükle ve görüntüle */
export function loadTasks(){
  const tasksRef = ref(db,"tasks");
  onValue(tasksRef, snapshot=>{
    tasksDiv.innerHTML="";
    tasks = {};
    snapshot.forEach(s=>{
      const t = s.val(); t.id = s.key;
      tasks[s.key] = t;
      const div = document.createElement("div");
      div.style.background = t.completed ? "#10b981" : "#334155";
      div.style.padding="6px"; div.style.margin="4px 0"; div.style.borderRadius="6px";
      div.innerHTML = `<input type="radio" name="taskRadio" value="${s.key}"> ${t.name} (${t.start} - ${t.end})`;
      tasksDiv.prepend(div);
    });
  });
}

/* -------------------- MESAJLAR -------------------- */
const chatBox = document.getElementById("chatBox");
const msgInput = document.getElementById("msgInput");
let messages = {};

export function sendMsg(){
  if(!msgInput.value) return;
  const newMsgRef = push(ref(db,"messages"));
  const now = new Date();
  set(newMsgRef,{
    uid: auth.currentUser.uid,
    name: auth.currentUser.displayName,
    msg: msgInput.value,
    timestamp: now.getTime()
  });
  msgInput.value="";
}

export function deleteMsg(){
  const sel = document.querySelector('input[name="msgRadio"]:checked');
  if(sel) remove(ref(db,"messages/"+sel.value));
}

/* Mesajları yükle ve görüntüle */
export function loadMessages(){
  const msgRef = ref(db,"messages");
  onValue(msgRef, snapshot=>{
    chatBox.innerHTML="";
    messages={};
    let arr = [];
    snapshot.forEach(s=>{
      const m = s.val(); m.id=s.key;
      messages[s.key] = m;
      arr.push(m);
    });
    // Tarihe göre sırala, en yeni en üstte
    arr.sort((a,b)=>b.timestamp - a.timestamp);
    arr.forEach(m=>{
      const div = document.createElement("div");
      div.style.background="#334155"; div.style.margin="4px 0"; div.style.padding="6px"; div.style.borderRadius="6px";
      const date = new Date(m.timestamp).toLocaleString();
      div.innerHTML = `<input type="radio" name="msgRadio" value="${m.id}"> <b>${m.name}</b> <small>${date}</small><br>${m.msg}`;
      chatBox.appendChild(div);
    });
  });
}

/* -------------------- YÖNETİCİ PANELİ -------------------- */
const usersList = document.getElementById("usersList");
export function loadUsers(){
  const usersRef = ref(db,"users");
  onValue(usersRef, snapshot=>{
    usersList.innerHTML="";
    snapshot.forEach(s=>{
      const u = s.val(); u.id = s.key;
      const div = document.createElement("div");
      div.className="user-item";
      div.innerHTML=`<span>${u.name}</span><span>${u.uid}</span>`;
      usersList.appendChild(div);
    });
  });
}

/* -------------------- GÖRÜŞ & ÖNERİ -------------------- */
export function sendFeedback(){
  const txt = document.getElementById("feedbackText").value;
  if(!txt) return;
  const newRef = push(ref(db,"feedback"));
  set(newRef,{
    uid: auth.currentUser.uid,
    name: auth.currentUser.displayName,
    msg: txt,
    timestamp: Date.now()
  });
  alert("Mesajınız gönderildi");
  document.getElementById("feedbackText").value="";
}
