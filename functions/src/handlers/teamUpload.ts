import Busboy from 'busboy'
import type { Request, Response } from 'express'
import { MAX_VIDEO_BYTES } from '../config'
import { albumPrefix, getMediaBucket } from '../gcsMedia'
import {
  isTeamAlbum,
  MAX_TEAM_PHOTO_BYTES,
  TEAM_ALBUMS,
  teamTokenMatches,
} from '../teamAccess'

function safeFileName(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? 'upload'
  const cleaned = base.replace(/[^\w.\-]+/g, '_').slice(0, 80)
  return cleaned || 'upload'
}

async function requestBodyBuffer(req: Request): Promise<Buffer> {
  const raw = (req as Request & { rawBody?: Buffer }).rawBody
  if (raw?.length) return raw
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

export async function handleTeamUpload(req: Request, res: Response): Promise<void> {
  const bucket = getMediaBucket()
  if (!bucket) {
    res.status(503).json({ error: 'storage_not_configured' })
    return
  }

  const body = await requestBodyBuffer(req)
  if (!body.length) {
    res.status(400).json({ error: 'empty_body' })
    return
  }

  return new Promise((resolve) => {
    const bb = Busboy({
      headers: req.headers,
      limits: { fileSize: MAX_VIDEO_BYTES + 1024 },
    })
    let album = ''
    let token = ''
    let fileBuffer: Buffer | null = null
    let fileMime = 'application/octet-stream'
    let fileName = 'upload.jpg'
    let fileTooLarge = false

    bb.on('field', (name, val) => {
      if (name === 'album') album = String(val)
      if (name === 'token') token = String(val)
    })

    bb.on('file', (_name, stream, info) => {
      fileMime = info.mimeType
      fileName = info.filename || fileName
      const chunks: Buffer[] = []
      stream.on('data', (d: Buffer) => chunks.push(d))
      stream.on('limit', () => {
        fileTooLarge = true
      })
      stream.on('end', () => {
        fileBuffer = Buffer.concat(chunks)
      })
    })

    bb.on('error', (err) => {
      console.error('[team] busboy parse error:', err)
      res.status(400).json({ error: 'upload_parse_failed' })
      resolve()
    })

    bb.on('finish', async () => {
      try {
        const albumMeta = isTeamAlbum(album) ? TEAM_ALBUMS[album] : null
        const maxBytes = albumMeta?.kind === 'video' ? MAX_VIDEO_BYTES : MAX_TEAM_PHOTO_BYTES
        if (!teamTokenMatches(token) || !albumMeta) {
          res.status(404).json({ error: 'not_found' })
          resolve()
          return
        }
        if (fileTooLarge || (fileBuffer && fileBuffer.length > maxBytes)) {
          res.status(413).json({ error: 'file_too_large' })
          resolve()
          return
        }
        if (!fileBuffer) {
          res.status(400).json({ error: 'missing_file' })
          resolve()
          return
        }
        const expect = albumMeta.kind === 'video' ? 'video/' : 'image/'
        if (!fileMime.startsWith(expect)) {
          res.status(400).json({ error: 'invalid_mime' })
          resolve()
          return
        }

        const objectName = `${albumPrefix(album)}${Date.now()}-${safeFileName(fileName)}`
        await bucket.file(objectName).save(fileBuffer, {
          contentType: fileMime,
          resumable: false,
          metadata: { cacheControl: 'private, max-age=3600' },
        })

        res.json({ ok: true, fileId: objectName, name: fileName })
      } catch (err) {
        console.error('[team] upload error:', err)
        res.status(500).json({ error: 'upload_failed' })
      }
      resolve()
    })

    bb.end(body)
  })
}
