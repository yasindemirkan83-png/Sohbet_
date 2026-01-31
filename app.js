import { auth, provider, signInWithGoogle, logoutUser, checkAuth, db, addTaskToDB, deleteTaskFromDB, addMsgToDB, deleteMsgFromDB, getUsers, sendFeedbackEmail } from './firebaseConfig.js';

const splash = document.getElementById('splash');
const login = document.getElementById('login');
const appDiv = document.getElementById('app');
const settings = document.getElementById('settings');
const settingsBtn = document.getElementById('settingsBtn');
const userName = document.getElementById('userName');

const taskInput = document.getElementById('taskInput');
const taskStart = document.getElementById('taskStart');
const taskEnd = document.getElementById('taskEnd');
const tasksDiv = document.getElementById('tasks');

const msgInput = document.getElementById('msgInput');
const chatBox = document.getElementById('chatBox');

const usersList = document.getElementById('usersList');
const feedbackText = document.getElementById('feedbackText');

let currentUser = null;
let tasksData = {};
let messagesData = {};

// --- SPLASH -> LOGIN ---
setTimeout(() => {
  splash.style.display = 'none';
  login.style.display = 'flex';
}, 5000); // 5 saniye açılış

// --- GOOGLE LOGIN ---
document.querySelector('#login img').onclick = async () => {
  try {
    await signInWithGoogle();
  } catch (err) {
    console.error(err);
    alert('Giriş başarısız!');
  }
};

// --- AUTH DURUMU ---
checkAuth((user) => {
  if (user) {
    currentUser = user;
    login.style.display = 'none';
    appDiv.style.display = 'flex';
    userName.innerText = user.displayName;
    loadTasks();
    loadMessages();
    loadUsers();
  } else {
    currentUser = null;
    appDiv.style.display = 'none';
    login.style.display = 'flex';
  }
});

// --- AYARLAR BUTONU ---
settingsBtn.onclick = () => {
  appDiv.style.display = 'none';
  settings.style.display = 'block';
};
window.backHome = () => {
  settings.style.display = 'none';
  appDiv.style.display = 'flex';
};

// --- GÖREVLER ---
window.addTask = () => {
  if (!taskInput.value) return;
  const task = {
    name: taskInput.value,
    start: taskStart.value || '',
    end: taskEnd.value || '',
    completed: false,
    timestamp: Date.now()
  };
  addTaskToDB(currentUser.uid, task);
  taskInput.value = '';
  taskStart.value = '';
  taskEnd.value = '';
};

window.deleteTask = () => {
  const selected = document.querySelector('.task-item.selected');
  if (selected) {
    deleteTaskFromDB(currentUser.uid, selected.dataset.id);
  }
};

window.completeTask = () => {
  const selected = document.querySelector('.task-item.selected');
  if (selected) {
    const taskRef = db.ref(`tasks/${currentUser.uid}/${selected.dataset.id}`);
    taskRef.update({ completed: true });
  }
};

window.setAlarm = () => {
  const selected = document.querySelector('.task-item.selected');
  if (!selected) return alert('Görev seçin!');
  const start = selected.dataset.start;
  if (!start) return alert('Başlangıç zamanı yok!');
  const alarmTime = new Date(start).getTime() - Date.now();
  if (alarmTime <= 0) return alert('Geçmiş bir tarih seçtiniz!');
  setTimeout(() => alert(`Alarm: ${selected.dataset.name}`), alarmTime);
};

// --- MESAJLAR ---
window.sendMsg = () => {
  if (!msgInput.value) return;
  const msg = {
    text: msgInput.value,
    sender: currentUser.displayName,
    timestamp: Date.now()
  };
  addMsgToDB(currentUser.uid, msg);
  msgInput.value = '';
};

window.deleteMsg = () => {
  const selected = document.querySelector('.msg-item.selected');
  if (selected) {
    deleteMsgFromDB(currentUser.uid, selected.dataset.id);
  }
};

// --- SEÇİM ---
tasksDiv.addEventListener('click', (e) => {
  if (e.target.classList.contains('task-item')) {
    document.querySelectorAll('.task-item').forEach(el => el.classList.remove('selected'));
    e.target.classList.add('selected');
  }
});

chatBox.addEventListener('click', (e) => {
  if (e.target.classList.contains('msg-item')) {
    document.querySelectorAll('.msg-item').forEach(el => el.classList.remove('selected'));
    e.target.classList.add('selected');
  }
});

// --- VERİLERİ YÜKLE ---
function loadTasks() {
  const tasksRef = db.ref(`tasks/${currentUser.uid}`);
  tasksRef.on('value', (snapshot) => {
    tasksData = snapshot.val() || {};
    renderTasks();
  });
}

function renderTasks() {
  tasksDiv.innerHTML = '';
  const sorted = Object.entries(tasksData).sort((a,b) => b[1].timestamp - a[1].timestamp);
  sorted.forEach(([id, task]) => {
    const div = document.createElement('div');
    div.classList.add('task-item');
    if (task.completed) div.style.background = 'rgba(16,185,129,0.4)';
    div.dataset.id = id;
    div.dataset.name = task.name;
    div.dataset.start = task.start;
    div.dataset.end = task.end;
    div.innerText = `${task.name}\n${task.start} → ${task.end}`;
    tasksDiv.appendChild(div);
  });
}

function loadMessages() {
  const msgRef = db.ref(`messages/${currentUser.uid}`);
  msgRef.on('value', (snapshot) => {
    messagesData = snapshot.val() || {};
    renderMessages();
  });
}

function renderMessages() {
  chatBox.innerHTML = '';
  const sorted = Object.entries(messagesData).sort((a,b) => b[1].timestamp - a[1].timestamp);
  sorted.forEach(([id, msg]) => {
    const div = document.createElement('div');
    div.classList.add('msg-item');
    div.dataset.id = id;
    div.innerHTML = `<div>${msg.sender}: ${msg.text}</div><div class="msg-meta">${new Date(msg.timestamp).toLocaleString()}</div>`;
    chatBox.appendChild(div);
  });
}

// --- ADMIN PANEL ---
function loadUsers() {
  getUsers((data) => {
    usersList.innerHTML = '';
    for (const uid in data) {
      const div = document.createElement('div');
      div.classList.add('user-item');
      div.innerText = `${data[uid].name || uid}`;
      usersList.appendChild(div);
    }
  });
}

// --- GERİ BİLDİRİM ---
window.sendFeedback = () => {
  if (!feedbackText.value) return alert('Mesaj boş!');
  sendFeedbackEmail(feedbackText.value);
  feedbackText.value = '';
};

// --- ÇIKIŞ ---
window.logout = () => {
  logoutUser();
};
