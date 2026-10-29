import { google, type drive_v3 } from 'googleapis'

type DriveOAuthConfig = {
  client_id: string
  client_secret: string
  refresh_token: string
}

let uploadDrive: drive_v3.Drive | null = null

export function getDriveForUpload(): drive_v3.Drive | null {
  if (uploadDrive) return uploadDrive
  const raw = process.env.GOOGLE_DRIVE_OAUTH_JSON
  if (!raw?.trim()) return null
  try {
    const cfg = JSON.parse(raw) as DriveOAuthConfig
    if (!cfg.client_id || !cfg.client_secret || !cfg.refresh_token) return null
    const oauth2 = new google.auth.OAuth2(cfg.client_id, cfg.client_secret)
    oauth2.setCredentials({ refresh_token: cfg.refresh_token })
    uploadDrive = google.drive({ version: 'v3', auth: oauth2 })
    return uploadDrive
  } catch {
    return null
  }
}

export function isDriveUploadConfigured(): boolean {
  return Boolean(getDriveForUpload())
}
