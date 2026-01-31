// Firebase Konfigürasyonu
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase Ayarları
const firebaseConfig = {
  apiKey: "AIzaSyDE5-fq9ifhtBlXTVOR1PhzD3XuVOWSVeE",
  authDomain: "studio-3972799448-609d1.firebaseapp.com",
  databaseURL: "https://studio-3972799448-609d1-default-rtdb.firebaseio.com",
  projectId: "studio-3972799448-609d1",
  storageBucket: "studio-3972799448-609d1.firebasestorage.app",
  messagingSenderId: "210449601127",
  appId: "1:210449601127:web:b3339666a09822b40c7ac2"
};

// Firebase Başlat
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);

// Kullanıcı giriş durumu kontrolü
export function checkAuth(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user);
    } else {
      callback(null);
    }
  });
}

// Google ile giriş
export function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}

// Çıkış
export function logoutUser() {
  signOut(auth);
}

// Görev ekleme
export function addTaskToDB(userId, task) {
  const tasksRef = ref(db, `tasks/${userId}`);
  const newTaskRef = push(tasksRef);
  set(newTaskRef, task);
}

// Görev silme
export function deleteTaskFromDB(userId, taskId) {
  remove(ref(db, `tasks/${userId}/${taskId}`));
}

// Mesaj ekleme
export function addMsgToDB(userId, msg) {
  const msgRef = ref(db, `messages/${userId}`);
  const newMsgRef = push(msgRef);
  set(newMsgRef, msg);
}

// Mesaj silme
export function deleteMsgFromDB(userId, msgId) {
  remove(ref(db, `messages/${userId}/${msgId}`));
}

// Kullanıcıları çek
export function getUsers(callback) {
  const usersRef = ref(db, `users`);
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}

// Geri bildirim
export function sendFeedbackEmail(feedback) {
  window.location.href = `mailto:yasindemirkan83@gmail.com?subject=Geri Bildirim&body=${encodeURIComponent(feedback)}`;
}
