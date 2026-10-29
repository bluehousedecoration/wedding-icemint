import { useRef, useState } from 'react'
import { uploadConfig } from '../config/uploadConfig'
import { uploadGuestPhoto, type UploadProgress } from '../lib/guestUpload'
import { uploadErrorMessage } from '../lib/uploadErrorMessage'
import { isMediaApiConfigured } from '../config/mediaApi'

type GuestPhotoUploadProps = {
  disabled?: boolean
}

export function GuestPhotoUpload({ disabled }: GuestPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [sourceLabel, setSourceLabel] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [done, setDone] = useState(false)
  const requireSource = isMediaApiConfigured()

  function onPick(f: File | null) {
    if (preview) URL.revokeObjectURL(preview)
    setFile(f)
    setDone(false)
    setProgress(null)
    if (f) setPreview(URL.createObjectURL(f))
    else setPreview(null)
  }

  async function onSubmit() {
    if (!file || disabled) return
    if (requireSource && !sourceLabel.trim()) {
      setProgress({
        percent: 0,
        state: 'error',
        error: 'กรุณาระบุชื่อกล้อง / แหล่งที่มา',
      })
      return
    }
    setProgress({ percent: 0, state: 'running' })
    try {
      await uploadGuestPhoto(file, name, sourceLabel, setProgress)
      setDone(true)
      onPick(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (e) {
      setProgress({
        percent: 0,
        state: 'error',
        error:
          e instanceof Error ? uploadErrorMessage(e.message) : uploadErrorMessage('upload_failed'),
      })
    }
  }

  return (
    <div className="upload-panel">
      <label className="field-label" htmlFor="guest-photo-source">
        ชื่อกล้อง / แหล่งที่มา {requireSource ? '(จำเป็น)' : '(แนะนำ)'}
      </label>
      <input
        id="guest-photo-source"
        className="field-input"
        type="text"
        placeholder="เช่น iPhone คุณมิ้นท์, กล้อง Canon โต๊ะ 8"
        value={sourceLabel}
        onChange={(e) => setSourceLabel(e.target.value)}
        disabled={disabled}
        required={requireSource}
      />

      <label className="field-label" htmlFor="guest-photo-name">
        ชื่อของคุณ (ไม่บังคับ)
      </label>
      <input
        id="guest-photo-name"
        className="field-input"
        type="text"
        placeholder="เช่น คุณมิ้นท์"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="file-input"
        disabled={disabled}
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />

      <button
        type="button"
        className="action"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        เลือกรูปจากมือถือ / กล้อง
      </button>

      <p className="hint">
        สูงสุด {uploadConfig.maxPhotoBytes / 1024 / 1024} MB ต่อรูป — ส่งตรงถึงบ่าวสาว (ไม่เปิด Drive)
      </p>

      {preview ? (
        <img className="upload-preview" src={preview} alt="ตัวอย่างรูปที่เลือก" />
      ) : null}

      {file ? (
        <button type="button" className="action primary" disabled={disabled} onClick={onSubmit}>
          ส่งรูปให้บ่าวสาว
        </button>
      ) : null}

      {progress?.state === 'running' ? (
        <p className="upload-status">กำลังอัปโหลด… {progress.percent}%</p>
      ) : null}
      {progress?.state === 'error' ? (
        <p className="status error">{progress.error}</p>
      ) : null}
      {done ? (
        <p className="upload-success" role="status">
          ขอบคุณค่ะ/ครับ — ส่งรูปถึงบ่าวสาวแล้ว
        </p>
      ) : null}
    </div>
  )
}
