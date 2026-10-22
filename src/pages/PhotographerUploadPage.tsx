import { ExternalButton, PageLayout } from '../components/PageLayout'
import { siteContent } from '../config/siteContent'

/** แชร์ URL นี้เฉพาะทีมถ่าย — ไม่ลิงก์จากหน้าแรกแขก */
export function PhotographerUploadPage() {
  const { photographer } = siteContent
  const ready = Boolean(photographer.uploadFolderUrl.trim())

  return (
    <PageLayout title="ทีมถ่ายภาพ">
      <header className="hero compact">
        <p className="eyebrow">Internal</p>
        <h1>{photographer.pageTitle}</h1>
        <p className="sub">อัปโหลดตรง Google Drive — ไม่ผ่านหน้าแชร์ของแขก</p>
      </header>

      <ol className="instruction-list">
        {photographer.instructions.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ol>

      <div className="stack-actions">
        <ExternalButton
          href={photographer.uploadFolderUrl}
          label="เปิดโฟลเดอร์ Drive (อัปโหลดตรง)"
          disabled={!ready}
        />
      </div>

      {!ready ? (
        <p className="hint">
          ใส่ลิงก์โฟลเดอร์ใน <code>siteContent.photographer.uploadFolderUrl</code>{' '}
          (รูปแบบ https://drive.google.com/drive/folders/…)
        </p>
      ) : null}
    </PageLayout>
  )
}
