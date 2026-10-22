import { defineSecret } from 'firebase-functions/params'
import { onRequest } from 'firebase-functions/v2/https'
import express from 'express'
import { getAllowedOrigins } from './config'
import { handleFile } from './handlers/file'
import { handleList } from './handlers/list'
import { handleShare } from './handlers/share'

const uploadCounts = new Map<string, { count: number; reset: number }>()
const UPLOAD_LIMIT = 30
const UPLOAD_WINDOW_MS = 60 * 60 * 1000

function clientIp(req: express.Request): string {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string') return fwd.split(',')[0]?.trim() ?? 'unknown'
  return req.ip ?? 'unknown'
}

function rateLimitUpload(req: express.Request, res: express.Response): boolean {
  const ip = clientIp(req)
  const now = Date.now()
  const entry = uploadCounts.get(ip)
  if (!entry || now > entry.reset) {
    uploadCounts.set(ip, { count: 1, reset: now + UPLOAD_WINDOW_MS })
    return true
  }
  if (entry.count >= UPLOAD_LIMIT) {
    res.status(429).json({ error: 'rate_limited' })
    return false
  }
  entry.count++
  return true
}

function publicBaseFromReq(req: express.Request): string {
  const envBase = process.env.MEDIA_PUBLIC_BASE?.replace(/\/$/, '')
  if (envBase) return envBase
  const host = req.get('host')
  const proto = req.get('x-forwarded-proto') ?? 'https'
  const path = req.originalUrl || req.url
  const idx = path.indexOf('/media/')
  if (idx >= 0) {
    return `${proto}://${host}${path.slice(0, idx)}`
  }
  return `${proto}://${host}`
}

function createApp(): express.Express {
  const app = express()

  app.use((req, res, next) => {
    const origin = req.headers.origin
    const allowed = getAllowedOrigins()
    if (origin && allowed.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') {
      res.status(204).end()
      return
    }
    next()
  })

  app.get('/media/list', async (req, res) => {
    try {
      await handleList(req, res, publicBaseFromReq(req))
    } catch {
      res.status(500).json({ error: 'list_failed' })
    }
  })

  app.get('/media/file', async (req, res) => {
    try {
      await handleFile(req, res)
    } catch {
      if (!res.headersSent) res.status(500).send('stream_failed')
    }
  })

  app.post('/media/share', async (req, res) => {
    if (!rateLimitUpload(req, res)) return
    try {
      await handleShare(req, res)
    } catch {
      if (!res.headersSent) res.status(500).json({ error: 'share_failed' })
    }
  })

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  return app
}

const googleServiceAccountJson = defineSecret('GOOGLE_SERVICE_ACCOUNT_JSON')
const driveAlbumsJson = defineSecret('DRIVE_ALBUMS_JSON')
const allowedOrigins = defineSecret('ALLOWED_ORIGINS')

const mediaApp = createApp()

export const mediaApi = onRequest(
  {
    region: 'asia-southeast1',
    memory: '512MiB',
    timeoutSeconds: 120,
    cors: false,
    secrets: [googleServiceAccountJson, driveAlbumsJson, allowedOrigins],
  },
  mediaApp,
)
