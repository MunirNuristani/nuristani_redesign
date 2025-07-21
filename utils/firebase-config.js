import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.FB_APIKEY,
  authDomain: process.env.FB_AUTHDOMAIN,
  databaseURL: process.env.FB_DATABASEURL,
  projectId: process.env.FB_PROJECTID,
  storageBucket: process.env.FB_STORAGEBUCKET,
  messagingSenderId: process.env.FB_MESSAGINGSENDERID,
  appId: process.env.FB_APPID,
  measurementId: process.env.FB_MEASUREMENTID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const recordingStorage = getStorage(
  app,
  "nuristanidict.appspot.com/audioRecordings"
);
const coverStorage  = getStorage(app, "nuristanidict.appspot.com/bookcovers")
const landscapeStorage = getStorage(app, "nuristanidict.appspot.com/nuristanPics")
export { db, storage, coverStorage, recordingStorage, landscapeStorage };



