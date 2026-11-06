import type { Request, Response } from 'express'
import { teamTokenMatches } from '../teamAccess'
import { getMediaBucket, mimeOf, signedReadUrl } from '../gcsMedia'
import type { File } from '@google-cloud/storage'

const DEVICE_KEY = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

function kindOf(value: unknown): 'photo' | 'video' {
  return value === 'video' ? 'video' : 'photo'
}

function albumFor(kind: 'photo' | 'video'): 'guest-photos' | 'guest-videos' {
  return kind === 'video' ? 'guest-videos' : 'guest-photos'
}

function customMeta(file: File): Record<string, string> {
  const raw = file.metadata.metadata
  if (!raw || typeof raw !== 'object') return {}
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'string') out[key] = value
  }
  return out
}

function captionOf(file: File): string {
  const meta = customMeta(file)
  const who = meta.guestName?.trim()
  const source = meta.sourceLabel?.trim()
  if (who && source) return `${who} · ${source}`
  if (source) return source
  if (who) return who
  const parts = file.name.split('/')
  return parts[parts.length - 2] || 'แขก'
}

async function listPrefix(
  prefix: string,
  video: boolean,
  page: number,
  pageSize: number,
) {
  const bucket = getMediaBucket()
  if (!bucket) return null
  const [files] = await bucket.getFiles({ prefix })
  const matched = files.filter((file) => {
    if (!file.name || file.name.endsWith('/')) return false
    const mime = mimeOf(file)
    if (mime === 'text/plain') return false
    return video ? mime.startsWith('video/') : mime.startsWith('image/')
  })
  matched.sort((a, b) => {
    const ta = Date.parse(a.metadata.updated ?? '') || 0
    const tb = Date.parse(b.metadata.updated ?? '') || 0
    return tb - ta
  })
  const start = (page - 1) * pageSize
  const slice = matched.slice(start, start + pageSize)
  const items = await Promise.all(
    slice.map(async (file) => {
      const mime = mimeOf(file)
      const viewUrl = await signedReadUrl(file, 'inline')
      const downloadUrl = await signedReadUrl(file, 'attachment')
      return {
        id: file.name,
        name: captionOf(file),
        mime,
        viewUrl,
        downloadUrl,
        thumbUrl: viewUrl,
      }
    }),
  )
  return {
    page,
    pageSize,
    hasMore: start + pageSize < matched.length,
    items,
  }
}

/** เจ้าภาพดูไฟล์แขกทั้งหมด ต้องมีรหัสทีมงาน */
export async function handleGuestLibrary(req: Request, res: Response): Promise<void> {
  const token = String(req.query.k ?? '')
  if (!teamTokenMatches(token)) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }
  const kind = kindOf(req.query.kind)
  const pageSize = Math.min(24, Math.max(1, Number(req.query.pageSize) || 12))
  const page = Math.max(1, Number(req.query.page) || 1)
  const listed = await listPrefix(`${albumFor(kind)}/`, kind === 'video', page, pageSize)
  if (!listed) {
    res.status(503).json({ error: 'storage_not_configured' })
    return
  }
  res.json({ album: albumFor(kind), kind, ...listed })
}

/** แขกดูเฉพาะไฟล์ที่เครื่องนี้ส่ง */
export async function handleMine(req: Request, res: Response): Promise<void> {
  const key = String(req.query.key ?? '').trim().toLowerCase()
  if (!DEVICE_KEY.test(key)) {
    res.status(400).json({ error: 'invalid_key' })
    return
  }
  const kind = kindOf(req.query.kind)
  const pageSize = Math.min(24, Math.max(1, Number(req.query.pageSize) || 12))
  const page = Math.max(1, Number(req.query.page) || 1)
  const listed = await listPrefix(
    `${albumFor(kind)}/d/${key}/`,
    kind === 'video',
    page,
    pageSize,
  )
  if (!listed) {
    res.status(503).json({ error: 'storage_not_configured' })
    return
  }
  res.json({ album: albumFor(kind), kind, ...listed })
}
