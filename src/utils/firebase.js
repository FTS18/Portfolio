import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA6vu0G0qglFmAVdMqf9xVDXqRLE0xwdGs",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "views-4576f.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "views-4576f",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "views-4576f.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "666092567983",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:666092567983:web:f377e366ba0dd3a9b6435a"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export { app, database }
