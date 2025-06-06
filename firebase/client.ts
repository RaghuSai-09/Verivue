
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBdvPWoCX-hU2uyp13JoQlC9HiOcfFWNUA",
  authDomain: "verivue-ccece.firebaseapp.com",
  projectId: "verivue-ccece",
  storageBucket: "verivue-ccece.firebasestorage.app",
  messagingSenderId: "935297512233",
  appId: "1:935297512233:web:f5bfa70ffd3a0bcd8c3d38",
  measurementId: "G-5PJKHHXSLE"
};


const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
