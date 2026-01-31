// Firebase Config ve Başlatma
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDE5-fq9ifhtBlXTVOR1PhzD3XuVOWSVeE",
  authDomain: "studio-3972799448-609d1.firebaseapp.com",
  databaseURL: "https://studio-3972799448-609d1-default-rtdb.firebaseio.com",
  projectId: "studio-3972799448-609d1",
  storageBucket: "studio-3972799448-609d1.firebasestorage.app",
  messagingSenderId: "210449601127",
  appId: "1:210449601127:web:b3339666a09822b40c7ac2"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
