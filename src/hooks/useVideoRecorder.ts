import { useCallback, useEffect, useRef, useState } from 'react'
import { uploadConfig } from '../config/uploadConfig'

function pickMimeType(): string {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ]
  for (const t of candidates) {
    if (MediaRecorder.isTypeSupported(t)) return t
  }
  return ''
}

export function useVideoRecorder(maxSeconds = uploadConfig.maxVideoSeconds) {
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<number | null>(null)

  const clearRecorded = useCallback(() => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl)
    setRecordedBlob(null)
    setRecordedUrl(null)
    setSeconds(0)
  }, [recordedUrl])

  const stopCamera = useCallback(() => {
    previewStream?.getTracks().forEach((t) => t.stop())
    setPreviewStream(null)
  }, [previewStream])

  const startCamera = useCallback(async () => {
    setError(null)
    clearRecorded()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      setPreviewStream(stream)
    } catch {
      setError('ไม่สามารถเปิดกล้อง/ไมค์ได้ — อนุญาตในเบราว์เซอร์แล้วลองใหม่')
    }
  }, [clearRecorded])

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    recorderRef.current?.stop()
    setIsRecording(false)
  }, [])

  const startRecording = useCallback(() => {
    if (!previewStream) return
    clearRecorded()
    chunksRef.current = []
    const mimeType = pickMimeType()
    const recorder = mimeType
      ? new MediaRecorder(previewStream, { mimeType })
      : new MediaRecorder(previewStream)
    recorderRef.current = recorder

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || 'video/webm',
      })
      setRecordedBlob(blob)
      setRecordedUrl(URL.createObjectURL(blob))
    }

    recorder.start(250)
    setIsRecording(true)
    setSeconds(0)
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s + 1 >= maxSeconds) stopRecording()
        return s + 1
      })
    }, 1000)
  }, [previewStream, clearRecorded, maxSeconds, stopRecording])

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      recorderRef.current?.stop()
      previewStream?.getTracks().forEach((t) => t.stop())
    }
  }, [previewStream])

  return {
    previewStream,
    recordedBlob,
    recordedUrl,
    isRecording,
    seconds,
    maxSeconds,
    error,
    startCamera,
    stopCamera,
    startRecording,
    stopRecording,
    clearRecorded,
  }
}
