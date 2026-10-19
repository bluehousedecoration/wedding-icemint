import { useRef, useState } from 'react'
import { uploadConfig } from '../config/uploadConfig'
import { uploadGuestPhoto, type UploadProgress } from '../lib/guestUpload'

type GuestPhotoUploadProps = {
  disabled?: boolean
}

export function GuestPhotoUpload({ disabled }: GuestPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [done, setDone] = useState(false)

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
    setProgress({ percent: 0, state: 'running' })
    try {
      await uploadGuestPhoto(file, name, setProgress)
      setDone(true)
      onPick(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (e) {
      setProgress({
        percent: 0,
        state: 'error',
        error: e instanceof Error ? e.message : 'อัปโหลดไม่สำเร็จ',
      })
    }
  }

  return (
    <div className="upload-panel">
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
        สูงสุด {uploadConfig.maxPhotoBytes / 1024 / 1024} MB ต่อรูป
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
