// app.js
import { app, firebaseConfig } from './firebaseConfig.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

/* SPLASH -> LOGIN */
setTimeout(()=>{
  document.getElementById("splash").style.display="none";
  document.getElementById("login").style.display="flex";
},5000);

/* LOGIN */
document.getElementById("googleLogin").onclick=()=>{
  signInWithPopup(auth,provider);
};

/* AUTH */
onAuthStateChanged(auth,(user)=>{
  if(user){
    document.getElementById("login").style.display="none";
    document.getElementById("app").style.display="flex";
    document.getElementById("userName").innerText=user.displayName;
    loadTasks();
    loadMessages();
  }
});

/* LOGOUT */
window.logout=()=>{
  signOut(auth);
  location.reload();
}

/* SETTINGS */
const settingsBtn = document.getElementById("settingsBtn");
settingsBtn.onclick = ()=>{
  document.getElementById("app").style.display="none";
  document.getElementById("settings").style.display="block";
}
window.backHome=()=>{
  document.getElementById("settings").style.display="none";
  document.getElementById("app").style.display="flex";
}
window.sendFeedback=()=>{
  const msg=document.createElement('textarea').value;
  window.location.href=`mailto:yasindemirkan83@gmail.com?subject=Görüş&body=${encodeURIComponent(msg)}`;
}

/* TASKS */
const taskListEl = document.getElementById("taskList");
const taskInputEl = document.getElementById("taskInput");
const taskStartEl = document.getElementById("taskStart");
const taskEndEl = document.getElementById("taskEnd");

window.addTask = ()=>{
  const val = taskInputEl.value.trim();
  const start = taskStartEl.value;
  const end = taskEndEl.value;
  if(!val || !start || !end) return alert("Tüm alanları doldur!");
  const userId = auth.currentUser.uid;
  push(ref(db,'tasks/'+userId),{
    text: val,
    start,
    end,
    done:false,
    timestamp: Date.now()
  });
  taskInputEl.value='';
  taskStartEl.value='';
  taskEndEl.value='';
}

/* Load tasks */
function loadTasks(){
  const userId = auth.currentUser.uid;
  const tasksRef = ref(db,'tasks/'+userId);
  onValue(tasksRef,(snapshot)=>{
    taskListEl.innerHTML='';
    const data = snapshot.val();
    if(!data) return;
    const arr = Object.entries(data).sort((a,b)=>b[1].timestamp - a[1].timestamp);
    arr.forEach(([key,val])=>{
      const li = document.createElement('div');
      li.className='list-item'+(val.done?' done':'');
      li.innerHTML=`<span>${val.text} <br><small>${val.start} → ${val.end}</small></span>
        <div>
          <button onclick="markDone('${key}')"><i class="fas fa-check"></i></button>
          <button onclick="deleteTask('${key}')"><i class="fas fa-trash"></i></button>
          <button onclick="setAlarm('${val.start}','${val.text}')"><i class="fas fa-bell"></i></button>
        </div>`;
      taskListEl.appendChild(li);
    });
  });
}

window.markDone=(key)=>{
  const userId = auth.currentUser.uid;
  update(ref(db,'tasks/'+userId+'/'+key),{done:true});
}

window.deleteTask=(key)=>{
  const userId = auth.currentUser.uid;
  remove(ref(db,'tasks/'+userId+'/'+key));
}

/* Alarm */
window.setAlarm=(time,text)=>{
  const t = new Date(time).getTime() - Date.now();
  if(t>0) setTimeout(()=>alert("Alarm: "+text),t);
}

/* CHAT */
const chatBoxEl = document.getElementById("chatBox");
const msgInputEl = document.getElementById("msgInput");

window.sendMsg=()=>{
  const val = msgInputEl.value.trim();
  if(!val) return;
  const userId = auth.currentUser.uid;
  push(ref(db,'messages'),{
    user: auth.currentUser.displayName,
    text: val,
    timestamp: Date.now()
  });
  msgInputEl.value='';
}

function loadMessages(){
  const messagesRef = ref(db,'messages');
  onValue(messagesRef,(snapshot)=>{
    chatBoxEl.innerHTML='';
    const data = snapshot.val();
    if(!data) return;
    const arr = Object.entries(data).sort((a,b)=>b[1].timestamp - a[1].timestamp);
    arr.forEach(([key,val])=>{
      const li = document.createElement('div');
      li.className='list-item';
      li.innerHTML=`<span><b>${val.user}</b> <small>${new Date(val.timestamp).toLocaleString()}</small><br>${val.text}</span>
        <div>
          <button onclick="deleteMsg('${key}')"><i class="fas fa-trash"></i></button>
        </div>`;
      chatBoxEl.appendChild(li);
    });
  });
}

window.deleteMsg=(key)=>{
  remove(ref(db,'messages/'+key));
}
