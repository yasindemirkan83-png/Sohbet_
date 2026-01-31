import { auth, provider, db } from './firebaseConfig.js';
import { signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

function loginWithGmail() {
  signInWithPopup(auth, provider)
    .then(result => {
      document.getElementById('login').style.display = 'none';
      document.getElementById('app').style.display = 'flex';
      document.getElementById('userName').innerText = `Hoşgeldin ${result.user.displayName}`;
      loadTasks();
      loadMsgs();
    })
    .catch(console.error);
}

function logout() {
  signOut(auth).then(() => location.reload());
}

// Görev Fonksiyonları
function addTask() {
  const task = document.getElementById('taskInput').value;
  const start = document.getElementById('taskStart').value;
  const end = document.getElementById('taskEnd').value;
  if (!task) return;
  const taskRef = push(ref(db, 'tasks'));
  set(taskRef, { task, start, end, completed: false });
}

function loadTasks() {
  const tasksEl = document.getElementById('tasks');
  onValue(ref(db, 'tasks'), snapshot => {
    tasksEl.innerHTML = '';
    snapshot.forEach(snap => {
      const data = snap.val();
      const div = document.createElement('div');
      div.classList.add('task-item');
      div.innerText = `${data.task} (${data.start} - ${data.end})`;
      tasksEl.appendChild(div);
    });
  });
}

// Mesaj Fonksiyonları
function sendMsg() {
  const msg = document.getElementById('msgInput').value;
  if (!msg) return;
  const msgRef = push(ref(db, 'messages'));
  set(msgRef, { msg, user: auth.currentUser.displayName, time: new Date().toLocaleString() });
  document.getElementById('msgInput').value = '';
}

function loadMsgs() {
  const chatBox = document.getElementById('chatBox');
  onValue(ref(db, 'messages'), snapshot => {
    chatBox.innerHTML = '';
    snapshot.forEach(snap => {
      const data = snap.val();
      const div = document.createElement('div');
      div.classList.add('msg-item');
      div.innerHTML = `<span>${data.user}: ${data.msg}</span><span class="msg-meta">${data.time}</span>`;
      chatBox.appendChild(div);
    });
  });
}

// Ayarlar
function openSettings() { document.getElementById('settings').style.display = 'block'; }
function backHome() { document.getElementById('settings').style.display = 'none'; }
function sendFeedback() {
  const text = document.getElementById('feedbackText').value;
  if (!text) return;
  const feedbackRef = push(ref(db, 'feedback'));
  set(feedbackRef, { text, user: auth.currentUser.displayName, time: new Date().toLocaleString() });
  document.getElementById('feedbackText').value = '';
}
