import { db, auth, provider } from "./firebaseConfig.js";
import { ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-database.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-auth.js";

// Açılış videosu 5 sn
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('splash').style.display='none';
    document.getElementById('login').style.display='flex';
  },5000);
});

// Gmail login
window.login = function(){
  signInWithPopup(auth,provider)
  .then(()=>{document.getElementById('login').style.display='none'; document.getElementById('app').style.display='flex';})
  .catch(console.error);
};

// Logout
window.logout = function(){
  signOut(auth).then(()=>{
    document.getElementById('app').style.display='none';
    document.getElementById('login').style.display='flex';
  });
};

// Auth state
onAuthStateChanged(auth,user=>{
  if(user){
    document.getElementById('userName').innerText='Hoşgeldin, '+user.displayName;
    loadTasks();
    loadMsgs();
  }
});

// Görev fonksiyonları
window.addTask = async function(){
  const tInput = document.getElementById('taskInput');
  const tStart = document.getElementById('taskStart');
  const tEnd = document.getElementById('taskEnd');
  const user = auth.currentUser;
  if(!user || !tInput.value) return alert("Giriş yapın ve görev adı girin!");
  const newRef = push(ref(db,'tasks'));
  await set(newRef,{
    name: tInput.value,
    start: tStart.value,
    end: tEnd.value,
    user:user.uid,
    completed:false
  });
  tInput.value=''; tStart.value=''; tEnd.value='';
};

window.loadTasks = function(){
  const tasksDiv = document.getElementById('tasks');
  const user = auth.currentUser;
  if(!user) return;
  onValue(ref(db,'tasks'),snapshot=>{
    tasksDiv.innerHTML='';
    snapshot.forEach(snap=>{
      const t = snap.val();
      if(t.user===user.uid){
        const div = document.createElement('div');
        div.className='task-item';
        div.innerText=`${t.name} [${t.start} - ${t.end}] ${t.completed?'✔':'❌'}`;
        div.onclick=()=>{div.classList.toggle('selected')};
        tasksDiv.appendChild(div);
      }
    });
  });
};

// Mesaj fonksiyonları
window.addMsg = async function(){
  const mInput = document.getElementById('msgInput');
  const user = auth.currentUser;
  if(!user || !mInput.value) return alert("Giriş yapın ve mesaj yazın!");
  const newRef = push(ref(db,'messages'));
  await set(newRef,{
    text:mInput.value,
    user:user.displayName,
    time:new Date().toISOString()
  });
  mInput.value='';
};

window.loadMsgs = function(){
  const chatDiv = document.getElementById('chatBox');
  onValue(ref(db,'messages'),snapshot=>{
    chatDiv.innerHTML='';
    snapshot.forEach(snap=>{
      const m = snap.val();
      const div = document.createElement('div');
      div.className='msg-item';
      div.innerHTML=`<span>${m.user}: ${m.text}</span><span class="msg-meta">${new Date(m.time).toLocaleString()}</span>`;
      div.onclick=()=>{div.remove()};
      chatDiv.appendChild(div);
    });
  });
};

// Ayarlar paneli
window.openSettings = ()=>{document.getElementById('settings').style.display='block'};
window.closeSettings = ()=>{document.getElementById('settings').style.display='none'};
window.sendFeedback = ()=>{
  const text = document.getElementById('feedbackText').value;
  if(text) alert('Görüşünüz gönderildi: '+text);
  document.getElementById('feedbackText').value='';
};

// Alarm, Sil, Tamamlandı placeholder
window.deleteTask=()=>alert("Görev silme eklenecek");
window.completeTask=()=>alert("Görev tamamlandı eklenecek");
window.setAlarm=()=>alert("Alarm kurulacak");
window.deleteMsg=()=>alert("Mesaj silme eklenecek");
