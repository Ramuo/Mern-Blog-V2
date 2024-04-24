// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-4dcf6.firebaseapp.com",
  projectId: "mern-blog-4dcf6",
  storageBucket: "mern-blog-4dcf6.appspot.com",
  messagingSenderId: "230801785446",
  appId: "1:230801785446:web:11f6db58aca74191c963a7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);