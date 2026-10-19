import { ref, uploadBytesResumable } from 'firebase/storage'
import { uploadConfig } from '../config/uploadConfig'
import { ensureUploadAuth, getFirebaseStorage } from './firebase'

export type UploadProgress = {
  percent: number
  state: 'running' | 'success' | 'error'
  error?: string
}

function safeSlug(text: string): string {
  return text
    .trim()
    .slice(0, 40)
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function randomId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

async function uploadBlob(
  path: string,
  data: Blob | File,
  onProgress: (p: UploadProgress) => void,
): Promise<void> {
  await ensureUploadAuth()
  const storage = getFirebaseStorage()
  if (!storage) throw new Error('Firebase Storage ยังไม่พร้อม')

  const storageRef = ref(storage, path)
  const task = uploadBytesResumable(storageRef, data, {
    contentType: data.type || undefined,
  })

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => {
        const percent = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
        onProgress({ percent, state: 'running' })
      },
      (err) => {
        onProgress({ percent: 0, state: 'error', error: err.message })
        reject(err)
      },
      () => {
        onProgress({ percent: 100, state: 'success' })
        resolve()
      },
    )
  })
}

export async function uploadGuestPhoto(
  file: File,
  guestName: string,
  onProgress: (p: UploadProgress) => void,
): Promise<void> {
  if (file.size > uploadConfig.maxPhotoBytes) {
    throw new Error(`รูปใหญ่เกิน ${uploadConfig.maxPhotoBytes / 1024 / 1024} MB`)
  }
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const slug = safeSlug(guestName) || 'guest'
  const path = `${uploadConfig.storageRoot}/photos/${slug}_${randomId()}.${ext}`
  await uploadBlob(path, file, onProgress)
}

export async function uploadGuestVideo(
  blob: Blob,
  guestName: string,
  onProgress: (p: UploadProgress) => void,
): Promise<void> {
  if (blob.size > uploadConfig.maxVideoBytes) {
    throw new Error(`วิดีโอใหญ่เกิน ${uploadConfig.maxVideoBytes / 1024 / 1024} MB`)
  }
  const ext = blob.type.includes('mp4') ? 'mp4' : 'webm'
  const slug = safeSlug(guestName) || 'guest'
  const path = `${uploadConfig.storageRoot}/videos/${slug}_${randomId()}.${ext}`
  await uploadBlob(path, blob, onProgress)
}
