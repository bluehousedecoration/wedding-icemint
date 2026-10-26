export type FloorLayoutConfig = {
  floorPlanImage: string
  entrance: { x: number; y: number }
  aisleX: number
}

export type PublicTablePosition = {
  tableNo: number
  tableName: string | null
  posX: number
  posY: number
  capacity: number
  isVip: boolean
}

export type SeatAssignment = {
  tableNo: number
  seatNo: number
  displayName: string
  guestSource: string | null
  side?: string
  category?: string | null
  tableName?: string | null
}

export type SearchIndexEntry = {
  displayName: string
  tableNo: number | null
  seatNo: number | null
  tableName: string | null
  guestSource: string | null
  zone?: string | null
  category?: string | null
}

/** ข้อมูลที่นั่งจาก Bluehouse ERP (guest-seating.json) */
export type PublicSeatingSnapshot = {
  updatedAt: string
  source?: string
  layout: FloorLayoutConfig
  tables: PublicTablePosition[]
  assignments: SeatAssignment[]
  searchIndex: SearchIndexEntry[]
}

export type SelectedGuest = {
  displayName: string
  tableNo: number
  seatNo: number | null
  tableName: string | null
  guestSource: string | null
  zone: string | null
}
