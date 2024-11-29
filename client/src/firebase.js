// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-22819.firebaseapp.com",
  projectId: "mern-auth-22819",
  storageBucket: "mern-auth-22819.appspot.com",
  messagingSenderId: "505233027809",
  appId: "1:505233027809:web:efb1753a136d0a88097da0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);