
import { initializeApp } from 'firebase/app';

export const firebaseConfig = {
    apiKey: "AIzaSyBjVRqDTjKcPOz3EH8xDTLEj6rlvXKOv6c",
    authDomain: "expense-management-198b3.firebaseapp.com",
    projectId: "expense-management-198b3",
    storageBucket: "expense-management-198b3.firebasestorage.app",
    messagingSenderId: "601003293266",
    appId: "1:601003293266:web:4e98cfef70e7514c45bd8b"
};

export const app = initializeApp(firebaseConfig);
