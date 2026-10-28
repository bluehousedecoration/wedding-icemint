import { useCallback, useMemo, useState } from 'react'
import { InvitationCardStack } from '../components/InvitationCardStack'
import { HomeActionMenu } from '../components/HomeActionMenu'
import { InvitationIntro } from '../components/InvitationIntro'
import { InvitationVideoIntro } from '../components/InvitationVideoIntro'
import { PageLayout } from '../components/PageLayout'
import { WeddingCountdown } from '../components/WeddingCountdown'
import { siteContent } from '../config/siteContent'
import { publicAssetUrl } from '../lib/assetUrl'
import { useInvitationPdf } from '../hooks/useInvitationPdf'
import {
  hasIntroFinishedThisDocument,
  markIntroFinishedThisDocument,
} from '../lib/introSession'

function HomeMainContent({
  showInvitationCard,
  frontUrl,
  backUrl,
  pdfLoading,
}: {
  showInvitationCard?: boolean
  frontUrl: string | null
  backUrl: string | null
  pdfLoading: boolean
}) {
  return (
    <>
      <WeddingCountdown />

      {showInvitationCard ? (
        <InvitationCardStack
          frontUrl={frontUrl}
          backUrl={backUrl}
          loading={pdfLoading}
          fallbackImagePath={siteContent.invitationCardUrl}
        />
      ) : null}

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

      <HomeActionMenu />

      <section className="hint">
        <p>
          สแกน QR บนการ์ดเชิญ → เปิดหน้าโต๊ะทันที (รหัสแขกไม่เปลี่ยนเมื่อย้ายโต๊ะ)
        </p>
      </section>
    </>
  )
}

export function HomePage() {
  const pdfPath = siteContent.invitationCardPdfUrl?.trim() ?? ''
  const fallbackPath = siteContent.invitationCardUrl?.trim() ?? ''
  const { frontUrl, backUrl, loading: pdfLoading } = useInvitationPdf(pdfPath || undefined)

  const introImage = useMemo(() => {
    if (frontUrl) return frontUrl
    if (fallbackPath) return publicAssetUrl(fallbackPath)
    return ''
  }, [frontUrl, fallbackPath])

  const introVideoPath = siteContent.introVideoUrl?.trim() ?? ''
  const introEnabled = siteContent.introEnabled !== false
  const [introDone, setIntroDone] = useState(
    () => hasIntroFinishedThisDocument() || siteContent.introEnabled === false,
  )

  const onIntroComplete = useCallback(() => {
    markIntroFinishedThisDocument()
    setIntroDone(true)
  }, [])

  const hasVideoIntro = Boolean(introVideoPath)
  const hasCardIntro = Boolean(introImage)
  const introPlaying =
    !introDone && introEnabled && (hasVideoIntro || hasCardIntro)

  return (
    <PageLayout>
      <div className={introPlaying ? 'home-during-intro' : undefined}>
        <HomeMainContent
          showInvitationCard={introDone}
          frontUrl={frontUrl}
          backUrl={backUrl}
          pdfLoading={pdfLoading}
        />
      </div>
      {introPlaying && hasVideoIntro ? (
        <InvitationVideoIntro videoPath={introVideoPath} onComplete={onIntroComplete} />
      ) : null}
      {introPlaying && !hasVideoIntro && introImage ? (
        <InvitationIntro cardUrl={introImage} onComplete={onIntroComplete} />
      ) : null}
      {!introDone && !hasVideoIntro && pdfLoading && !introImage ? (
        <p className="status intro-wait-card">กำลังเตรียมการ์ดเชิญ…</p>
      ) : null}
    </PageLayout>
  )
}
