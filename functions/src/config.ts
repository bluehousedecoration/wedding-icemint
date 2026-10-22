export const LIST_ALBUM_KEYS = [
  'vdo-present',
  'vdo-wedding-day',
  'prewedding',
  'wedding-day',
] as const

export const UPLOAD_ALBUM_KEYS = ['guest-photos', 'guest-videos'] as const

export type ListAlbumKey = (typeof LIST_ALBUM_KEYS)[number]
export type UploadAlbumKey = (typeof UPLOAD_ALBUM_KEYS)[number]

export function getAlbumsMap(): Record<string, string> {
  const raw = process.env.DRIVE_ALBUMS_JSON
  if (!raw?.trim()) return {}
  try {
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

export function getAllowedOrigins(): string[] {
  const raw =
    process.env.ALLOWED_ORIGINS ??
    'https://icemintwedding20dec26.com,http://127.0.0.1:5173,http://localhost:5173'
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024
export const MAX_VIDEO_BYTES = 80 * 1024 * 1024
