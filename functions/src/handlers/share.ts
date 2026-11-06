import Busboy from 'busboy'
import type { Request, Response } from 'express'
import { MAX_PHOTO_BYTES, MAX_VIDEO_BYTES } from '../config'
import { slugSourceLabel } from '../drive'
import { albumPrefix, getMediaBucket } from '../gcsMedia'

type ShareType = 'photo' | 'video'

function todayBangkok(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date())
}

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

export async function handleShare(req: Request, res: Response): Promise<void> {
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
    const bb = Busboy({ headers: req.headers, limits: { fileSize: MAX_VIDEO_BYTES + 1024 } })
    let type: ShareType | null = null
    let sourceLabel = ''
    let guestKey = ''
    let guestName = ''
    let fileBuffer: Buffer | null = null
    let fileMime = 'application/octet-stream'
    let fileName = 'upload.bin'
    let fileTooLarge = false

    bb.on('field', (name, val) => {
      if (name === 'type') type = val === 'video' ? 'video' : val === 'photo' ? 'photo' : null
      if (name === 'sourceLabel') sourceLabel = String(val)
      if (name === 'guestKey') guestKey = String(val).trim().toLowerCase()
      if (name === 'guestName') guestName = String(val).trim().slice(0, 80)
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
      console.error('[share] busboy parse error:', err)
      res.status(400).json({ error: 'upload_parse_failed' })
      resolve()
    })

    bb.on('finish', async () => {
      try {
        if (fileTooLarge) {
          res.status(413).json({ error: 'file_too_large' })
          resolve()
          return
        }

        if (!type || !fileBuffer) {
          res.status(400).json({ error: 'missing_file_or_type' })
          resolve()
          return
        }

        const label = sourceLabel.trim()
        if (!label) {
          res.status(400).json({ error: 'source_label_required' })
          resolve()
          return
        }

        const max = type === 'photo' ? MAX_PHOTO_BYTES : MAX_VIDEO_BYTES
        if (fileBuffer.length > max) {
          res.status(413).json({ error: 'file_too_large' })
          resolve()
          return
        }

        if (type === 'photo' && !fileMime.startsWith('image/')) {
          res.status(400).json({ error: 'invalid_mime' })
          resolve()
          return
        }
        if (type === 'video' && !fileMime.startsWith('video/')) {
          res.status(400).json({ error: 'invalid_mime' })
          resolve()
          return
        }

        const albumKey = type === 'photo' ? 'guest-photos' : 'guest-videos'
        const folderName = `${slugSourceLabel(label)}-${todayBangkok()}`
        const device =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(guestKey)
            ? `d/${guestKey}/`
            : ''
        const objectName = `${albumPrefix(albumKey)}${device}${folderName}/${Date.now()}-${safeFileName(fileName)}`

        await bucket.file(objectName).save(fileBuffer, {
          contentType: fileMime,
          resumable: false,
          metadata: {
            cacheControl: 'private, max-age=3600',
            metadata: {
              guestKey: device ? guestKey : '',
              guestName,
              sourceLabel: label.slice(0, 120),
            },
          },
        })

        res.json({
          ok: true,
          fileId: objectName,
          folderName,
        })
      } catch (err) {
        console.error('[share] upload error:', err)
        res.status(500).json({ error: 'upload_failed' })
      }
      resolve()
    })

    bb.end(body)
  })
}
