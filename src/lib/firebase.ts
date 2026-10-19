import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, signInAnonymously, type Auth } from 'firebase/auth'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { isFirebaseConfigured } from '../config/uploadConfig'

let app: FirebaseApp | null = null
let auth: Auth | null = null
let storage: FirebaseStorage | null = null

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null
  if (!app) {
    app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    })
  }
  return app
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) return null
  if (!storage) storage = getStorage(firebaseApp)
  return storage
}

/** ใช้ anonymous auth เพื่อให้ Storage rules ปลอดภัยขึ้น */
export async function ensureUploadAuth(): Promise<void> {
  const firebaseApp = getFirebaseApp()
  if (!firebaseApp) {
    throw new Error('ยังไม่ได้ตั้งค่า Firebase — ดู docs/GUEST-UPLOAD.md')
  }
  if (!auth) auth = getAuth(firebaseApp)
  if (!auth.currentUser) {
    await signInAnonymously(auth)
  }
}
