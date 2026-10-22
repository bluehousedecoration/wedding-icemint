import { useEffect, useRef, useState } from 'react'
import { useVideoRecorder } from '../hooks/useVideoRecorder'
import { isMediaApiConfigured } from '../config/mediaApi'
import { uploadGuestVideo, type UploadProgress } from '../lib/guestUpload'

type GuestVideoRecorderProps = {
  disabled?: boolean
}

export function GuestVideoRecorder({ disabled }: GuestVideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [name, setName] = useState('')
  const [sourceLabel, setSourceLabel] = useState('')
  const requireSource = isMediaApiConfigured()
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [done, setDone] = useState(false)

  const rec = useVideoRecorder()

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (rec.previewStream && !rec.recordedUrl) {
      el.srcObject = rec.previewStream
      void el.play().catch(() => {})
    } else {
      el.srcObject = null
    }
  }, [rec.previewStream, rec.recordedUrl])

  async function onSubmit() {
    if (!rec.recordedBlob || disabled) return
    if (requireSource && !sourceLabel.trim()) {
      setProgress({
        percent: 0,
        state: 'error',
        error: 'กรุณาระบุชื่อกล้อง / แหล่งที่มา',
      })
      return
    }
    setProgress({ percent: 0, state: 'running' })
    setDone(false)
    try {
      await uploadGuestVideo(rec.recordedBlob, name, sourceLabel, setProgress)
      setDone(true)
      rec.clearRecorded()
      rec.stopCamera()
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
      <label className="field-label" htmlFor="guest-video-source">
        ชื่อกล้อง / แหล่งที่มา {requireSource ? '(จำเป็น)' : '(แนะนำ)'}
      </label>
      <input
        id="guest-video-source"
        className="field-input"
        type="text"
        placeholder="เช่น iPhone 14 Pro, Samsung S24"
        value={sourceLabel}
        onChange={(e) => setSourceLabel(e.target.value)}
        disabled={disabled}
        required={requireSource}
      />

      <label className="field-label" htmlFor="guest-video-name">
        ชื่อของคุณ (ไม่บังคับ)
      </label>
      <input
        id="guest-video-name"
        className="field-input"
        type="text"
        placeholder="เช่น คุณไอซ์"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled}
      />

      <p className="hint">
        อัดคลิปอวยพรได้ไม่เกิน {rec.maxSeconds} วินาที — ใช้ HTTPS (หรือ localhost)
      </p>

      {rec.error ? <p className="status error">{rec.error}</p> : null}

      {!rec.previewStream && !rec.recordedUrl ? (
        <button
          type="button"
          className="action primary"
          disabled={disabled}
          onClick={() => void rec.startCamera()}
        >
          เปิดกล้องเพื่ออัดวิดีโอ
        </button>
      ) : null}

      {(rec.previewStream || rec.recordedUrl) && (
        <div className="video-record-wrap">
          {rec.recordedUrl ? (
            <video className="video-record-preview" src={rec.recordedUrl} controls playsInline />
          ) : (
            <video
              ref={videoRef}
              className="video-record-preview"
              muted
              playsInline
              autoPlay
            />
          )}

          {rec.isRecording ? (
            <p className="record-timer" aria-live="polite">
              ● กำลังอัด {rec.seconds}s / {rec.maxSeconds}s
            </p>
          ) : null}

          <div className="record-actions">
            {rec.previewStream && !rec.recordedUrl ? (
              <>
                {!rec.isRecording ? (
                  <button
                    type="button"
                    className="action primary record-btn"
                    disabled={disabled}
                    onClick={rec.startRecording}
                  >
                    เริ่มอัด
                  </button>
                ) : (
                  <button
                    type="button"
                    className="action primary record-btn recording"
                    onClick={rec.stopRecording}
                  >
                    หยุดอัด
                  </button>
                )}
                <button type="button" className="action" onClick={rec.stopCamera}>
                  ปิดกล้อง
                </button>
              </>
            ) : null}

            {rec.recordedUrl ? (
              <>
                <button type="button" className="action primary" disabled={disabled} onClick={onSubmit}>
                  ส่งคลิปอวยพร
                </button>
                <button
                  type="button"
                  className="action"
                  onClick={() => {
                    rec.clearRecorded()
                    void rec.startCamera()
                  }}
                >
                  อัดใหม่
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}

      {progress?.state === 'running' ? (
        <p className="upload-status">กำลังอัปโหลด… {progress.percent}%</p>
      ) : null}
      {progress?.state === 'error' ? (
        <p className="status error">{progress.error}</p>
      ) : null}
      {done ? (
        <p className="upload-success" role="status">
          ขอบคุณค่ะ/ครับ — ส่งคลิปอวยพรถึงบ่าวสาวแล้ว
        </p>
      ) : null}
    </div>
  )
}
