export type MediaAlbumKey =
  | 'vdo-present'
  | 'vdo-wedding-day'
  | 'prewedding'
  | 'wedding-day'

export type MediaListItem = {
  id: string
  name: string
  mime: string
  viewUrl: string
  downloadUrl: string
  thumbUrl: string
}

export type MediaListResponse = {
  album: string
  page: number
  pageSize: number
  hasMore: boolean
  items: MediaListItem[]
}

/** ค่า default สำหรับ GitHub Pages — override ได้ด้วย VITE_MEDIA_API_BASE */
const PRODUCTION_MEDIA_API_BASE =
  'https://asia-southeast1-ice-mint-wedding.cloudfunctions.net/mediaApi'

export function getMediaApiBase(): string {
  const fromEnv = import.meta.env.VITE_MEDIA_API_BASE?.trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (import.meta.env.PROD) return PRODUCTION_MEDIA_API_BASE
  return ''
}

export function isMediaApiConfigured(): boolean {
  return Boolean(getMediaApiBase())
}

export async function fetchMediaList(
  album: MediaAlbumKey,
  page: number,
  pageSize = 10,
): Promise<MediaListResponse> {
  const base = getMediaApiBase()
  if (!base) throw new Error('media_api_not_configured')

  const params = new URLSearchParams({
    album,
    page: String(page),
    pageSize: String(pageSize),
  })

  const res = await fetch(`${base}/media/list?${params}`, { cache: 'no-store' })
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(err.error ?? `list_failed_${res.status}`)
  }
  return res.json() as Promise<MediaListResponse>
}

export async function uploadGuestShare(
  type: 'photo' | 'video',
  sourceLabel: string,
  file: Blob,
  fileName: string,
  onProgress?: (percent: number) => void,
): Promise<void> {
  const base = getMediaApiBase()
  if (!base) throw new Error('media_api_not_configured')

  const form = new FormData()
  form.append('type', type)
  form.append('sourceLabel', sourceLabel.trim())
  form.append('file', file, fileName)

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${base}/media/share`)
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100)
        resolve()
        return
      }
      try {
        const body = JSON.parse(xhr.responseText) as { error?: string }
        reject(new Error(body.error ?? 'upload_failed'))
      } catch {
        reject(new Error('upload_failed'))
      }
    }
    xhr.onerror = () => reject(new Error('network_error'))
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        onProgress?.(Math.round((ev.loaded / ev.total) * 100))
      }
    }
    xhr.send(form)
  })
}
