
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  "projectId": "studio-7666699268-e6154",
  "appId": "1:158356073721:web:1b9210f077d19a24a9c628",
  "apiKey": "AIzaSyBKWjJSKSoaZTZO8ozpcw-6H6Clh3QhlLc",
  "authDomain": "studio-7666699268-e6154.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "158356073721",
  "storageBucket": "studio-7666699268-e6154.appspot.com"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
