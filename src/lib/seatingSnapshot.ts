import {
  FLOOR_AISLE_X,
  FLOOR_ENTRANCE,
  FLOOR_PLAN_IMAGE,
  FLOOR_TABLE_POSITIONS,
  VIP_TABLE_NUMBERS,
} from '../config/weddingFloorLayout'
import type { GuestDatabase } from '../types/guest'
import type {
  PublicSeatingSnapshot,
  PublicTablePosition,
  SearchIndexEntry,
  SelectedGuest,
} from '../types/seating'

function isNewSnapshot(json: unknown): json is PublicSeatingSnapshot {
  if (typeof json !== 'object' || json === null) return false
  const s = json as PublicSeatingSnapshot
  return Array.isArray(s.tables) && Array.isArray(s.searchIndex) && !!s.layout
}

function legacyToSnapshot(db: GuestDatabase): PublicSeatingSnapshot {
  const tables: PublicTablePosition[] = FLOOR_TABLE_POSITIONS.map((t) => ({
    tableNo: t.table_no,
    tableName: null,
    posX: t.pos_x,
    posY: t.pos_y,
    capacity: 10,
    isVip: t.is_vip || VIP_TABLE_NUMBERS.has(t.table_no),
  }))

  const searchIndex: SearchIndexEntry[] = db.guests.map((g) => ({
    displayName: g.label.replace(/^คุณ\s*/i, '').trim() || g.label,
    tableNo: g.table,
    seatNo: null,
    tableName: g.tableName ?? null,
    guestSource: null,
    zone: g.zone ?? null,
    category: null,
  }))

  const assignments = db.guests
    .filter((g) => g.table >= 1)
    .map((g) => ({
      tableNo: g.table,
      seatNo: 1,
      displayName: g.label.replace(/^คุณ\s*/i, '').trim() || g.label,
      guestSource: null,
      tableName: g.tableName ?? null,
      category: null,
    }))

  return {
    updatedAt: db.updatedAt,
    source: db.source ?? 'legacy',
    layout: {
      floorPlanImage: FLOOR_PLAN_IMAGE,
      entrance: { ...FLOOR_ENTRANCE },
      aisleX: FLOOR_AISLE_X,
    },
    tables,
    assignments,
    searchIndex,
  }
}

export function normalizeSeatingPayload(json: unknown): PublicSeatingSnapshot | null {
  if (isNewSnapshot(json)) return json
  if (typeof json === 'object' && json !== null && Array.isArray((json as GuestDatabase).guests)) {
    const db = json as GuestDatabase
    if (db.guests.length === 0) return null
    return legacyToSnapshot(db)
  }
  return null
}

export function entryToSelectedGuest(entry: SearchIndexEntry): SelectedGuest | null {
  if (!entry.tableNo) return null
  return {
    displayName: entry.displayName,
    tableNo: entry.tableNo,
    seatNo: entry.seatNo,
    tableName: entry.tableName,
    guestSource: entry.guestSource,
    zone: entry.zone ?? null,
  }
}

export function getTableFromSnapshot(
  snapshot: PublicSeatingSnapshot,
  tableNo: number,
): PublicTablePosition | undefined {
  return snapshot.tables.find((t) => t.tableNo === tableNo)
}

export function assignmentsForTable(
  snapshot: PublicSeatingSnapshot,
  tableNo: number,
): PublicSeatingSnapshot['assignments'] {
  return snapshot.assignments
    .filter((a) => a.tableNo === tableNo)
    .sort((a, b) => a.seatNo - b.seatNo)
}
