import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FB_APPID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const coverStorage  = getStorage(app, "nuristanidict.appspot.com/bookcovers")
export { db, storage,coverStorage };