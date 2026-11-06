import { Storage, type Bucket, type File } from '@google-cloud/storage'
import { LIST_ALBUM_KEYS, UPLOAD_ALBUM_KEYS } from './config'

export const MEDIA_BUCKET = process.env.MEDIA_BUCKET?.trim() || 'ice-mint-wedding-media'

const URL_TTL_MS = 12 * 60 * 60 * 1000
const ALBUMS = new Set<string>([...LIST_ALBUM_KEYS, ...UPLOAD_ALBUM_KEYS])

let bucket: Bucket | null = null

function credentials(): { client_email?: string; private_key?: string; project_id?: string } | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw?.trim()) return null
  try {
    return JSON.parse(raw) as { client_email?: string; private_key?: string; project_id?: string }
  } catch {
    return null
  }
}

export function getMediaBucket(): Bucket | null {
  if (bucket) return bucket
  const creds = credentials()
  if (!creds?.client_email || !creds.private_key) return null
  const storage = new Storage({
    credentials: creds,
    projectId: creds.project_id,
  })
  bucket = storage.bucket(MEDIA_BUCKET)
  return bucket
}

export function isMediaBucketConfigured(): boolean {
  return getMediaBucket() !== null
}

export function albumPrefix(album: string): string {
  return `${album}/`
}

/** รหัสไฟล์คือ path ในถัง เช่น prewedding/photo.jpg */
export function objectNameFromId(fileId: string): string | null {
  let name = fileId
  try {
    name = decodeURIComponent(fileId)
  } catch {
    return null
  }
  if (!name || name.startsWith('/') || name.includes('\\') || name.includes('..')) return null
  const album = name.split('/')[0] ?? ''
  if (!ALBUMS.has(album) || !name.startsWith(`${album}/`) || name.endsWith('/')) return null
  return name
}

export function fileDisplayName(objectName: string): string {
  return objectName.split('/').pop() || 'file'
}

export function mimeOf(file: File): string {
  const fromMeta = file.metadata.contentType
  if (fromMeta && fromMeta !== 'application/octet-stream') return fromMeta
  const name = file.name.toLowerCase()
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg'
  if (name.endsWith('.png')) return 'image/png'
  if (name.endsWith('.webp')) return 'image/webp'
  if (name.endsWith('.gif')) return 'image/gif'
  if (name.endsWith('.heic')) return 'image/heic'
  if (name.endsWith('.mp4')) return 'video/mp4'
  if (name.endsWith('.mov')) return 'video/quicktime'
  if (name.endsWith('.webm')) return 'video/webm'
  return fromMeta || 'application/octet-stream'
}

function disposition(kind: 'inline' | 'attachment', objectName: string): string {
  const ascii = fileDisplayName(objectName).replace(/[^\w.\-]+/g, '_') || 'file'
  return `${kind}; filename="${ascii}"`
}

export async function signedReadUrl(file: File, kind: 'inline' | 'attachment'): Promise<string> {
  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + URL_TTL_MS,
    responseDisposition: disposition(kind, file.name),
  })
  return url
}
