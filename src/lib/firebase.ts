import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBf1C2eqGRUxBLpxeBaERZy5Af-2Fnj",
  authDomain: "football-e3f7e.firebaseapp.com",
  projectId: "football-e3f7e",
  storageBucket: "football-e3f7e.firebasestorage.app",
  messagingSenderId: "730531451260",
  appId: "1:730531451260:web:b3d92a7c9e4ff59760de69",
  measurementId: "G-N04981YQ03",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
