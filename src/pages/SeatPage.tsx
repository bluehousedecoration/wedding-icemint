import { useState } from 'react'
import { GuestInteractiveFloorPlan } from '../components/GuestInteractiveFloorPlan'
import { GuestNameSearch } from '../components/GuestNameSearch'
import { PageLayout } from '../components/PageLayout'
import { useSeatingSnapshot } from '../hooks/useSeatingSnapshot'
import { entryToSelectedGuest } from '../lib/seatingSnapshot'
import type { SearchIndexEntry, SelectedGuest } from '../types/seating'

function SeatInfoCard({
  guest,
  isVip,
}: {
  guest: SelectedGuest
  isVip: boolean
}) {

  return (
    <>
      <header className="hero compact">
        <p className="eyebrow">Welcome</p>
        <h1>{guest.displayName}</h1>
      </header>

      <dl className="seat-card">
        <div>
          <dt>โต๊ะ</dt>
          <dd className="table-num">
            Table {guest.tableNo}
            {isVip ? <span className="seat-vip-badge"> VIP</span> : null}
          </dd>
        </div>
        {guest.tableName ? (
          <div>
            <dt>ชื่อโต๊ะ</dt>
            <dd>{guest.tableName}</dd>
          </div>
        ) : null}
        {guest.seatNo ? (
          <div>
            <dt>ที่นั่ง</dt>
            <dd>
              โต๊ะ{guest.tableNo}-ที่นั่ง{guest.seatNo}
            </dd>
          </div>
        ) : null}
        {guest.zone ? (
          <div>
            <dt>โซน</dt>
            <dd>{guest.zone}</dd>
          </div>
        ) : null}
        {guest.guestSource ? (
          <div>
            <dt>ที่มา</dt>
            <dd>{guest.guestSource}</dd>
          </div>
        ) : null}
      </dl>
    </>
  )
}

export function SeatPage() {
  const { data, loading, error } = useSeatingSnapshot({ poll: true })
  const [selected, setSelected] = useState<SelectedGuest | null>(null)

  const onPick = (entry: SearchIndexEntry) => {
    const guest = entryToSelectedGuest(entry)
    if (!guest) {
      alert('ยังไม่ได้จัดโต๊ะ — ติดต่อเจ้าภาพ')
      return
    }
    setSelected(guest)
  }

  const hasMap = data.tables.length > 0

  return (
    <PageLayout title="โต๊ะของฉัน" contentClassName="page page--seat">
      {!selected ? (
        <header className="hero compact">
          <p className="eyebrow">Find My Seat</p>
          <h1>โต๊ะของฉัน</h1>
        </header>
      ) : null}

      <GuestNameSearch
        searchIndex={data.searchIndex}
        loading={loading}
        onSelect={onPick}
      />

      {!selected ? (
        <p className="sub seat-intro">
          พิมพ์ชื่อให้ตรงกับ<strong>ซองเชิญ</strong> แล้วเลือกจากรายการ — เส้นแดงจะนำไปโต๊ะของคุณ
        </p>
      ) : null}

      {error ? <p className="status error">{error}</p> : null}

      {selected ? (
        <SeatInfoCard
          guest={selected}
          isVip={Boolean(data.tables.find((t) => t.tableNo === selected.tableNo)?.isVip)}
        />
      ) : null}

      {loading && !hasMap ? (
        <p className="status">กำลังโหลดผัง...</p>
      ) : hasMap ? (
        <GuestInteractiveFloorPlan
          snapshot={data}
          highlightTableNo={selected?.tableNo ?? null}
          showNavigation={Boolean(selected)}
        />
      ) : (
        <p className="status">ยังโหลดผังไม่ได้ — ลองรีเฟรช</p>
      )}
    </PageLayout>
  )
}
