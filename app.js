import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();

const taskListContainer = document.getElementById('taskListContainer');
const chatBox = document.getElementById('chatBox');

// Görev ekleme
function addTask(){
  const title = document.getElementById('taskInput').value;
  const start = document.getElementById('taskStart').value;
  const end = document.getElementById('taskEnd').value;
  if(!title) return alert("Görev adı girin");
  const user = auth.currentUser;
  push(ref(db,'tasks'), { title, start, end, uid:user.uid, done:false, timestamp:Date.now() });
  document.getElementById('taskInput').value='';
}

// Görevleri çek ve göster
onValue(ref(db,'tasks'), snapshot => {
  taskListContainer.innerHTML='';
  const data = snapshot.val();
  if(!data) return;
  const tasks = Object.entries(data).sort((a,b)=>b[1].timestamp - a[1].timestamp);
  tasks.forEach(([key,val])=>{
    const div = document.createElement('div');
    div.innerText = `${val.title} (${val.start || ''} → ${val.end || ''})`;
    div.dataset.key=key;
    div.style.cursor='pointer';
    div.style.background = val.done?'lightgreen':'transparent';
    div.onclick=()=>div.classList.toggle('selected');
    taskListContainer.appendChild(div);
  });
});

// Görev silme
function deleteSelectedTask(){
  const selected = taskListContainer.querySelectorAll('.selected');
  selected.forEach(s=>{
    remove(ref(db,'tasks/'+s.dataset.key));
  });
}

// Görevi tamamlandı işaretle
function markDoneTask(){
  const selected = taskListContainer.querySelectorAll('.selected');
  selected.forEach(s=>{
    const key = s.dataset.key;
    push(ref(db,'tasks_done'), key); // opsiyonel kayıt
    s.style.background='lightgreen';
  });
}

// Alarm kur
function setTaskAlarm(){
  const selected = taskListContainer.querySelectorAll('.selected');
  selected.forEach(s=>{
    const key = s.dataset.key;
    // Basit alarm için tarih kontrol edilebilir
    alert(`Alarm kuruldu: ${s.innerText}`);
  });
}

// MESAJLAR
function sendMsg(){
  const msg = document.getElementById('msgInput').value;
  if(!msg) return;
  const user = auth.currentUser;
  push(ref(db,'messages'),{ text:msg, uid:user.uid, name:user.displayName, timestamp:Date.now() });
  document.getElementById('msgInput').value='';
}

onValue(ref(db,'messages'), snapshot=>{
  chatBox.innerHTML='';
  const data = snapshot.val();
  if(!data) return;
  const msgs = Object.entries(data).sort((a,b)=>b[1].timestamp - a[1].timestamp);
  msgs.forEach(([key,val])=>{
    const div = document.createElement('div');
    div.innerHTML=`<small>${val.name} - ${new Date(val.timestamp).toLocaleString()}</small><br>${val.text}`;
    div.dataset.key=key;
    div.style.cursor='pointer';
    div.onclick=()=>div.classList.toggle('selected');
    chatBox.appendChild(div);
  });
});

function deleteSelectedMsg(){
  const selected = chatBox.querySelectorAll('.selected');
  selected.forEach(s=>{
    remove(ref(db,'messages/'+s.dataset.key));
  });
}

// Ayarlar
function toggleSettings(){
  const s = document.getElementById('settings');
  s.style.display = s.style.display==='block'?'none':'block';
}

function sendFeedback(){
  const msg=document.getElementById('feedbackText').value;
  window.location.href=`mailto:yasindemirkan83@gmail.com?subject=Geri Bildirim&body=${encodeURIComponent(msg)}`;
}

function logout(){
  auth.signOut();
  location.reload();
}
