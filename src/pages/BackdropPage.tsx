import { MediaAlbumSection } from '../components/MediaAlbumSection'
import { PageLayout } from '../components/PageLayout'
import { siteContent } from '../config/siteContent'

export function BackdropPage() {
  const album = siteContent.backdropAlbum

  return (
    <PageLayout title="ทางเข้า" contentClassName="page page--gallery">
      <header className="hero compact gallery-hero">
        <p className="eyebrow">Entrance</p>
        <h1>ทางเข้า</h1>
        <p className="sub">ภาพ Backdrop ทางเข้างาน — แตะรูปเพื่อดูใหญ่และบันทึกได้</p>
      </header>

      <section className="gallery-sheet" aria-label={album.title}>
        <p className="gallery-kicker">{album.title}</p>
        <p className="gallery-caption">{album.description}</p>
        <MediaAlbumSection album={album} />
      </section>
    </PageLayout>
  )
}
