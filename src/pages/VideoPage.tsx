import { ComingSoon, ExternalButton, PageLayout } from '../components/PageLayout'
import { siteContent, type VideoSection } from '../config/siteContent'

function VideoBlock({ section }: { section: VideoSection }) {
  const hasEmbed = Boolean(section.embedUrl.trim())
  const hasLink = Boolean(section.openUrl.trim())

  return (
    <section className="video-section">
      <h2 className="section-heading">{section.title}</h2>
      <p className="sub">{section.subtitle}</p>

      {hasEmbed ? (
        <div className="video-wrap">
          <iframe
            title={section.title}
            src={section.embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <ComingSoon message="วิดีโอจะเปิดให้ชมเร็ว ๆ นี้" />
      )}

      <div className="stack-actions">
        <ExternalButton
          href={section.openUrl}
          label="เปิดดู / ดาวน์โหลด (YouTube / Drive)"
          disabled={!hasLink}
        />
      </div>
    </section>
  )
}

export function VideoPage() {
  const { video, eventRecap } = siteContent

  return (
    <PageLayout title="วิดีโอ">
      <header className="hero compact">
        <p className="eyebrow">Video</p>
        <h1>วิดีโอ</h1>
      </header>

      <VideoBlock section={video} />
      <VideoBlock section={eventRecap} />
    </PageLayout>
  )
}
