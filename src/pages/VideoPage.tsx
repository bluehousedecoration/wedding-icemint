import { MediaVideoList } from '../components/MediaVideoList'
import { PageLayout } from '../components/PageLayout'
import { siteContent } from '../config/siteContent'

export function VideoPage() {
  const { video, eventRecap } = siteContent

  return (
    <PageLayout title="วิดีโอ">
      <header className="hero compact">
        <p className="eyebrow">Video</p>
        <h1>วิดีโอ</h1>
        <p className="sub">ชมและดาวน์โหลดบนหน้านี้ — ไม่เปิดลิงก์ Drive</p>
      </header>

      <section className="video-section">
        <h2 className="section-heading">{video.title}</h2>
        <p className="sub">{video.subtitle}</p>
        {video.mediaAlbumKey ? (
          <MediaVideoList albumKey={video.mediaAlbumKey} />
        ) : (
          <p className="coming-soon">วิดีโอจะเปิดให้ชมเร็ว ๆ นี้</p>
        )}
      </section>

      <section className="video-section">
        <h2 className="section-heading">{eventRecap.title}</h2>
        <p className="sub">{eventRecap.subtitle}</p>
        {eventRecap.mediaAlbumKey ? (
          <MediaVideoList albumKey={eventRecap.mediaAlbumKey} />
        ) : (
          <p className="coming-soon">วิดีโอจะเปิดให้ชมเร็ว ๆ นี้</p>
        )}
      </section>
    </PageLayout>
  )
}
