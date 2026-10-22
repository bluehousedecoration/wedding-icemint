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

  return (
    <PageLayout title="กำหนดการ">
      <header className="hero compact">
        <p className="eyebrow">Schedule</p>
        <h1>กำหนดการ</h1>
        <p className="date">{siteContent.weddingDate}</p>
        <p className="venue">{siteContent.venue}</p>
      </header>

      <section className="schedule-block" aria-labelledby="schedule-card-heading">
        <h2 id="schedule-card-heading" className="section-heading">
          ไฮไลต์ (บนการ์ดเชิญ)
        </h2>
        <Timeline items={siteContent.scheduleCard} id="schedule-card-heading" />
      </section>

      <section className="schedule-block" aria-labelledby="schedule-full-heading">
        <h2 id="schedule-full-heading" className="section-heading">
          กำหนดการบ่าย–เย็น
        </h2>
        <Timeline items={siteContent.scheduleFull} id="schedule-full-heading" />
      </section>

      <section className="dress-block" aria-labelledby="dress-heading">
        <h2 id="dress-heading" className="section-heading">
          {siteContent.dressCode.title}
        </h2>
        <p className="sub">{siteContent.dressCode.subtitle}</p>
        <ul className="dress-list">
          {siteContent.dressCode.items.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

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
