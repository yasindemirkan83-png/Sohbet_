// app.js
import { auth, provider, database } from './firebaseConfig.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* --- LOGIN --- */
const googleLoginBtn = document.getElementById("googleLogin");

googleLoginBtn.onclick = () => {
  signInWithPopup(auth, provider);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("userName").innerText = user.displayName;
    loadTasks(user.uid);
    loadMessages(user.uid);
  }
});

window.logout = () => {
  signOut(auth).then(() => location.reload());
};

/* --- TASKS --- */
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

function addTask() {
  const val = taskInput.value;
  if (!val) return;
  const user = auth.currentUser;
  const taskRef = ref(database, `tasks/${user.uid}`);
  const newTaskRef = push(taskRef);
  set(newTaskRef, {
    text: val,
    timestamp: Date.now(),
    done: false
  });
  taskInput.value = "";
}

function loadTasks(uid) {
  const taskRef = ref(database, `tasks/${uid}`);
  onValue(taskRef, (snapshot) => {
    taskList.innerHTML = "";
    const data = snapshot.val();
    if (data) {
      Object.entries(data)
        .sort((a, b) => b[1].timestamp - a[1].timestamp)
        .forEach(([key, task]) => {
          const li = document.createElement("li");
          li.innerText = task.text;
          li.style.cursor = "pointer";
          if (task.done) li.style.textDecoration = "line-through";
          li.onclick = () => toggleDone(uid, key, !task.done);
          li.oncontextmenu = (e) => {
            e.preventDefault();
            remove(ref(database, `tasks/${uid}/${key}`));
          };
          taskList.appendChild(li);
        });
    }
  });
}

function toggleDone(uid, key, done) {
  set(ref(database, `tasks/${uid}/${key}/done`), done);
}

/* --- MESSAGES --- */
const msgInput = document.getElementById("msgInput");
const chatBox = document.getElementById("chatBox");

window.sendMsg = () => {
  const val = msgInput.value;
  if (!val) return;
  const user = auth.currentUser;
  const msgRef = ref(database, `messages/${user.uid}`);
  const newMsgRef = push(msgRef);
  set(newMsgRef, {
    text: val,
    timestamp: Date.now(),
    name: user.displayName
  });
  msgInput.value = "";
};

function loadMessages(uid) {
  const msgRef = ref(database, `messages/${uid}`);
  onValue(msgRef, (snapshot) => {
    chatBox.innerHTML = "";
    const data = snapshot.val();
    if (data) {
      Object.entries(data)
        .sort((a, b) => b[1].timestamp - a[1].timestamp)
        .forEach(([key, msg]) => {
          const div = document.createElement("div");
          div.innerHTML = `<small>${new Date(msg.timestamp).toLocaleString()} - ${msg.name}</small><br>${msg.text}`;
          div.style.borderBottom = "1px solid #333";
          div.style.padding = "5px";
          div.style.cursor = "pointer";
          div.oncontextmenu = (e) => {
            e.preventDefault();
            remove(ref(database, `messages/${uid}/${key}`));
          };
          chatBox.appendChild(div);
        });
    }
  });
}

/* --- SETTINGS --- */
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settings");

settingsBtn.onclick = () => {
  settingsPanel.style.display = settingsPanel.style.display === "block" ? "none" : "block";
};

window.sendFeedback = () => {
  const msg = document.getElementById("feedbackText").value;
  window.location.href = `mailto:yasindemirkan83@gmail.com?subject=Sohbet App Feedback&body=${encodeURIComponent(msg)}`;
};

/* --- ALARMS --- */
window.addAlarm = () => {
  const taskText = prompt("Alarm kurmak istediğiniz görev:");
  const minutes = prompt("Kaç dakika sonra?");
  if (minutes) {
    setTimeout(() => alert(`Alarm! Görev: ${taskText}`), minutes * 60000);
  }
};
