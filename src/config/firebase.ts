
import { initializeApp } from 'firebase/app';
import 'dotenv/config'

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "expense-management-198b3.firebaseapp.com",
    projectId: "expense-management-198b3",
    storageBucket: "expense-management-198b3.firebasestorage.app",
    messagingSenderId: "601003293266",
    appId: "1:601003293266:web:dafc51137189286145bd8b"
  };

export const app = initializeApp(firebaseConfig);
