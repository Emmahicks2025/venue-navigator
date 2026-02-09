import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBtV2b6qUMXaWDlqvwm8aGM2Hy0Af-2Yzg",
  authDomain: "football-e3f7e.firebaseapp.com",
  projectId: "football-e3f7e",
  storageBucket: "football-e3f7e.firebasestorage.app",
  messagingSenderId: "735531453260",
  appId: "1:735531453260:web:b1692a7c7be4f55986dde9",
  measurementId: "G-N84BRT93DY",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
