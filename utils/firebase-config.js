import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTHDOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FB_DATABASEURL,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FB_APPID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENTID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const recordingStorage = getStorage(
  app,
  "nuristanidict.appspot.com/audioRecordings"
);
const coverStorage  = getStorage(app, "nuristanidict.appspot.com/bookcovers")
const landscapeStorage = getStorage(app, "nuristanidict.appspot.com/nuristanPics")
export { db, auth, storage, coverStorage, recordingStorage, landscapeStorage };



