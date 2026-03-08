import AsyncStorage from '@react-native-async-storage/async-storage'
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth'
import { FirebaseStorage, getStorage } from 'firebase/storage'
import { Firestore, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA541GQcMTs1uS0YUQJIoBGx_RY5vLEZ7k',
  authDomain: 'mindful-muslim-3a3ca.firebaseapp.com',
  projectId: 'mindful-muslim-3a3ca',
  storageBucket: 'mindful-muslim-3a3ca.firebasestorage.app',
  messagingSenderId: '940649901095',
  appId: '1:940649901095:web:6483b80c2409b6e3fe3202'
}

let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage

if (!getApps().length) {
  app = initializeApp(firebaseConfig)
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
} else {
  app = getApp()
  auth = getAuth(app)
}

storage = getStorage(app)
db = getFirestore(app)

export { db, auth, storage }
