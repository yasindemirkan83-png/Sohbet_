// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDE5-fq9ifhtBlXTVOR1PhzD3XuVOWSVeE",
  authDomain: "studio-3972799448-609d1.firebaseapp.com",
  databaseURL: "https://studio-3972799448-609d1-default-rtdb.firebaseio.com",
  projectId: "studio-3972799448-609d1",
  storageBucket: "studio-3972799448-609d1.firebasestorage.app",
  messagingSenderId: "210449601127",
  appId: "1:210449601127:web:b3339666a09822b40c7ac2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);
