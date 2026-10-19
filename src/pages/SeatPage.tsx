import { Link, useSearchParams } from 'react-router-dom'
import { FloorPlanView } from '../components/FloorPlanView'
import { PageLayout } from '../components/PageLayout'
import { findGuestByCode, useGuests } from '../hooks/useGuests'
import { normalizeGuestCode } from '../lib/guestCode'

function SeatDetail({
  label,
  table,
  zone,
  seats,
}: {
  label: string
  table: number
  zone: string
  seats: number
}) {
  return (
    <>
      <header className="hero compact">
        <p className="eyebrow">Welcome</p>
        <h1>{label}</h1>
      </header>

      <dl className="seat-card">
        <div>
          <dt>โต๊ะ</dt>
          <dd className="table-num">Table {table}</dd>
        </div>
        <div>
          <dt>โซน</dt>
          <dd>{zone}</dd>
        </div>
        <div>
          <dt>จำนวนที่นั่ง</dt>
          <dd>{seats} Seats</dd>
        </div>
      </dl>

      <FloorPlanView table={table} />
    </>
  )
}

export function SeatPage() {
  const [params] = useSearchParams()
  const raw = params.get('g') ?? params.get('guest') ?? ''
  const code = raw ? normalizeGuestCode(raw) : null
  const { data, error, loading } = useGuests()
  const guest = findGuestByCode(data, code)

  return (
    <PageLayout title="โต๊ะของฉัน">
      {!code ? (
        <>
          <header className="hero compact">
            <p className="eyebrow">Find My Seat</p>
            <h1>โต๊ะของฉัน</h1>
          </header>
          <p className="sub">
            สแกน QR บนการ์ดเชิญ หรือเปิดลิงก์ที่มีรหัสแขก เช่น{' '}
            <code>?g=ICE0284</code>
          </p>
          <p className="hint">
            ตัวอย่างทดสอบ:{' '}
            <Link to="/seat?g=ICE0284">เปิดรหัส ICE0284</Link>
          </p>
        </>
      ) : loading ? (
        <p className="status">กำลังโหลดที่นั่ง...</p>
      ) : error ? (
        <p className="status error">{error}</p>
      ) : !guest ? (
        <>
          <p className="status error">ไม่พบรหัสแขก — ตรวจสอบ QR บนการ์ดอีกครั้ง</p>
          <Link className="action back" to="/seat">
            ลองใหม่
          </Link>
        </>
      ) : (
        <SeatDetail
          label={guest.label}
          table={guest.table}
          zone={guest.zone}
          seats={guest.seats}
        />
      )}
    </PageLayout>
  )
}
