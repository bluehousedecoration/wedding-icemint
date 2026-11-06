import type { Request, Response } from 'express'
import { LIST_ALBUM_KEYS } from '../config'
import { albumPrefix, getMediaBucket, mimeOf, signedReadUrl } from '../gcsMedia'

const IMAGE_PREFIX = 'image/'
const VIDEO_PREFIX = 'video/'

function isListAlbum(album: string): album is (typeof LIST_ALBUM_KEYS)[number] {
  return (LIST_ALBUM_KEYS as readonly string[]).includes(album)
}

function wantsVideo(album: string): boolean {
  return album.startsWith('vdo-')
}

export async function handleList(req: Request, res: Response, _publicBase: string): Promise<void> {
  const album = String(req.query.album ?? '')
  const pageSize = Math.min(20, Math.max(1, Number(req.query.pageSize) || 10))
  const page = Math.max(1, Number(req.query.page) || 1)

  if (!isListAlbum(album)) {
    res.status(400).json({ error: 'invalid_album' })
    return
  }

  const bucket = getMediaBucket()
  if (!bucket) {
    res.status(503).json({ error: 'storage_not_configured' })
    return
  }

  const videoMode = wantsVideo(album)
  const [files] = await bucket.getFiles({ prefix: albumPrefix(album) })
  const matched = files.filter((file) => {
    if (!file.name || file.name.endsWith('/')) return false
    const mime = mimeOf(file)
    if (videoMode) return mime.startsWith(VIDEO_PREFIX)
    return mime.startsWith(IMAGE_PREFIX)
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
        name: file.name.split('/').pop() || 'file',
        mime,
        viewUrl,
        downloadUrl,
        thumbUrl: viewUrl,
      }
    }),
  )

  res.json({
    album,
    page,
    pageSize,
    hasMore: start + pageSize < matched.length,
    items,
  })
}
