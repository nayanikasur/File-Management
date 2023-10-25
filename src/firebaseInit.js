import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDvkCTTGUB0w4gvWpQVrt55_qWGEyvErn0",
    authDomain: "downloadandupload-e5977.firebaseapp.com",
    projectId: "downloadandupload-e5977",
    storageBucket: "downloadandupload-e5977.appspot.com",
    messagingSenderId: "916634867206",
    appId: "1:916634867206:web:09ee7fd6e493cae7719587"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
