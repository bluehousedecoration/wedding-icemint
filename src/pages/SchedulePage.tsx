import { ExternalButton, PageLayout } from '../components/PageLayout'
import { siteContent, type ScheduleItem } from '../config/siteContent'

function Timeline({
  items,
  id,
}: {
  items: ScheduleItem[]
  id: string
}) {
  return (
    <ol className="timeline" aria-labelledby={id}>
      {items.map((item) => (
        <li key={`${item.time}-${item.title}`} className="timeline-item">
          <time dateTime={item.time}>{item.time}</time>
          <div>
            <strong>{item.title}</strong>
            {item.detail ? <span>{item.detail}</span> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function SchedulePage() {
  const mapReady = Boolean(siteContent.venueMapUrl.trim())

  const scheduleTop = siteContent.scheduleTopImageUrl?.trim() ?? ''
  const scheduleBottom = siteContent.scheduleBottomImageUrl?.trim() ?? ''

  return (
    <PageLayout title="กำหนดการ">
      {scheduleTop ? (
        <figure className="schedule-hero-banner">
          <img
            src={scheduleTop}
            alt="ไฮไลต์กำหนดการจากการ์ดเชิญ"
            width={1080}
            height={280}
            decoding="async"
          />
        </figure>
      ) : null}

      <header className="hero compact">
        <p className="eyebrow">Schedule</p>
        <h1>กำหนดการ</h1>
        <p className="date">{siteContent.weddingDate}</p>
        <p className="venue">{siteContent.venue}</p>
      </header>

      <section className="schedule-block" aria-labelledby="schedule-full-heading">
        <h2 id="schedule-full-heading" className="section-heading">
          กำหนดการบ่าย–เย็น
        </h2>
        <Timeline items={siteContent.scheduleFull} id="schedule-full-heading" />
      </section>

      {scheduleBottom ? (
        <figure className="schedule-hero-banner">
          <img
            src={scheduleBottom}
            alt="Theme colors และ QR เว็บไซต์"
            width={1080}
            height={280}
            decoding="async"
          />
        </figure>
      ) : null}

      {siteContent.themeColors.items.length > 0 ||
      siteContent.themeColors.subtitle ? (
        <section
          className="theme-block"
          aria-labelledby={scheduleBottom ? undefined : 'theme-heading'}
          aria-label={scheduleBottom ? siteContent.themeColors.title : undefined}
        >
          {scheduleBottom ? null : (
            <h2 id="theme-heading" className="section-heading">
              {siteContent.themeColors.title}
            </h2>
          )}
          {siteContent.themeColors.subtitle ? (
            <p className="sub">{siteContent.themeColors.subtitle}</p>
          ) : null}
          {siteContent.themeColors.items.length > 0 ? (
            <ul className="dress-list">
              {siteContent.themeColors.items.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <section className="venue-block" aria-labelledby="venue-heading">
        <h2 id="venue-heading" className="section-heading">
          สถานที่
        </h2>
        <p className="sub">{siteContent.venueAddress}</p>
        <div className="stack-actions">
          <ExternalButton
            href={siteContent.venueMapUrl}
            label="เปิดแผนที่ / นำทาง"
            disabled={!mapReady}
          />
        </div>
      </section>
    </PageLayout>
  )
}
