import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { InvitationIntro } from '../components/InvitationIntro'
import { PageLayout } from '../components/PageLayout'
import { WeddingCountdown } from '../components/WeddingCountdown'
import { siteContent } from '../config/siteContent'
import { hasSeenIntroThisSession, markIntroSeenThisSession } from '../lib/introSession'

function HomeMainContent() {
  return (
    <>
      <header className="hero">
        <p className="eyebrow">{siteContent.tagline}</p>
        <h1>{siteContent.couple}</h1>
        <p className="sub couple-names">{siteContent.coupleFullNames}</p>
        <p className="sub">
          ทุกช่วงเวลาที่ผ่านมา...ทำให้เราได้พบกัน
          <br />
          และทุกช่วงเวลาจากนี้... เราขอใช้ชีวิตกันไปในเส้นทางเดียวกันตลอดไป
        </p>
        <p className="date">{siteContent.weddingDate}</p>
        <p className="venue">{siteContent.venue}</p>
      </header>

      <WeddingCountdown />

      <nav className="actions" aria-label="เมนูหลัก">
        <Link className="action primary" to="/video">
          VDO Present
        </Link>
        <Link className="action" to="/photos">
          รูปภาพ / Pre-Wedding
        </Link>
        <Link className="action" to="/seat">
          โต๊ะของฉัน
        </Link>
        <Link className="action" to="/schedule">
          กำหนดการ
        </Link>
        <Link className="action" to="/share">
          แชร์ความประทับใจ
        </Link>
        {siteContent.venueMapUrl ? (
          <a className="action" href={siteContent.venueMapUrl} target="_blank" rel="noreferrer">
            แผนที่
          </a>
        ) : (
          <span className="action disabled">แผนที่ — เร็ว ๆ นี้</span>
        )}
      </nav>

      <section className="hint">
        <p>
          สแกน QR บนการ์ดเชิญ → เปิดหน้าโต๊ะทันที (รหัสแขกไม่เปลี่ยนเมื่อย้ายโต๊ะ)
        </p>
      </section>
    </>
  )
}

export function HomePage() {
  const cardUrl = siteContent.invitationCardUrl.trim()
  const introEnabled = siteContent.introEnabled !== false
  const shouldPlayIntro = introEnabled && cardUrl && !hasSeenIntroThisSession()

  const [introDone, setIntroDone] = useState(!shouldPlayIntro)

  const onIntroComplete = useCallback(() => {
    markIntroSeenThisSession()
    setIntroDone(true)
  }, [])

  return (
    <PageLayout>
      {!introDone && cardUrl ? (
        <InvitationIntro cardUrl={cardUrl} onComplete={onIntroComplete} />
      ) : null}
      {introDone ? <HomeMainContent /> : null}
    </PageLayout>
  )
}
