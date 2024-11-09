// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-26bd8.firebaseapp.com",
  projectId: "mern-blog-26bd8",
  storageBucket: "mern-blog-26bd8.firebasestorage.app",
  messagingSenderId: "261322932168",
  appId: "1:261322932168:web:632c1eae3a098564814afd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

