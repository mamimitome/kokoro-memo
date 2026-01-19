import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey:"AIzaSyCPVHdmq0ReWLEsCi5Veuel85-dogksVWY",
    authDomain:"kokoro-memo-2e1b7.firebaseapp.com",
    projectId:"kokoro-memo-2e1b7",
    storageBucket:"kokoro-memo-2e1b7.firebasestorage.app",
    messagingSenderId:"54315250312",
    appId:"1:54315250312:web:ccd2c15b1d571355a3a53d"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);