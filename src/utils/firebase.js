// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFXPR9q_i8GWAreg__JQiCT8FXTLJTi9o",
  authDomain: "deus-filter-bd.firebaseapp.com",
  projectId: "deus-filter-bd",
  storageBucket: "deus-filter-bd.appspot.com",
  messagingSenderId: "403512187842",
  appId: "1:403512187842:web:5724a587138b636ea1945b"
};


// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const fireStore = getFirestore(firebase);

export { fireStore }