import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAb3_xLr9ksUuT3dPvfrGDjMsjS2KeTAw",
  authDomain: "cmt322taskrunner.firebaseapp.com",
  projectId: "cmt322taskrunner",
  storageBucket: "cmt322taskrunner.appspot.com",
  messagingSenderId: "138212373837",
  appId: "1:138212373837:web:d629e06a8e5de20983f304",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
