export const uploadConfig = {
  maxPhotoBytes: 8 * 1024 * 1024,
  maxVideoBytes: 80 * 1024 * 1024,
  maxVideoSeconds: 90,
  storageRoot: 'ice-mint-wedding',
}

export function isFirebaseConfigured(): boolean {
  const e = import.meta.env
  return Boolean(
    e.VITE_FIREBASE_API_KEY &&
      e.VITE_FIREBASE_PROJECT_ID &&
      e.VITE_FIREBASE_STORAGE_BUCKET &&
      e.VITE_FIREBASE_APP_ID,
  )
}
