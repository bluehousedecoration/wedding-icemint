/**
 * ผังและตำแหน่งโต๊ะ — sync กับ Bluehouse ERP (weddingFloorLayout.ts)
 */

export type FloorTablePosition = {
  table_no: number
  pos_x: number
  pos_y: number
  is_vip: boolean
}

export const FLOOR_PLAN_ASPECT = 786 / 1217
export const FLOOR_PLAN_REF_WIDTH = 786
export const FLOOR_PLAN_REF_HEIGHT = 1217

export const FLOOR_PLAN_IMAGE = '/floor-plan-ava.png'

/** ทางเข้า-ออก (มุมล่างขวาบนผัง v3) */
export const FLOOR_ENTRANCE = { x: 78, y: 94 }

/** แกนกลางทางเดิน */
export const FLOOR_AISLE_X = 50

export const FLOOR_TABLE_POSITIONS: FloorTablePosition[] = [
  { table_no: 15, pos_x: 19, pos_y: 17, is_vip: false },
  { table_no: 13, pos_x: 19, pos_y: 24, is_vip: false },
  { table_no: 14, pos_x: 31, pos_y: 24, is_vip: false },
  { table_no: 1, pos_x: 19, pos_y: 31, is_vip: false },
  { table_no: 2, pos_x: 31, pos_y: 31, is_vip: false },
  { table_no: 5, pos_x: 19, pos_y: 38, is_vip: false },
  { table_no: 3, pos_x: 31, pos_y: 38, is_vip: true },
  { table_no: 6, pos_x: 19, pos_y: 45, is_vip: false },
  { table_no: 4, pos_x: 31, pos_y: 45, is_vip: true },
  { table_no: 7, pos_x: 19, pos_y: 52, is_vip: false },
  { table_no: 16, pos_x: 31, pos_y: 52, is_vip: false },
  { table_no: 8, pos_x: 19, pos_y: 59, is_vip: false },
  { table_no: 17, pos_x: 31, pos_y: 59, is_vip: false },
  { table_no: 9, pos_x: 19, pos_y: 66, is_vip: false },
  { table_no: 11, pos_x: 31, pos_y: 66, is_vip: false },
  { table_no: 10, pos_x: 19, pos_y: 73, is_vip: false },
  { table_no: 12, pos_x: 31, pos_y: 73, is_vip: false },
  { table_no: 19, pos_x: 19, pos_y: 80, is_vip: false },
  { table_no: 18, pos_x: 31, pos_y: 80, is_vip: false },
  { table_no: 20, pos_x: 19, pos_y: 87, is_vip: false },
  { table_no: 29, pos_x: 70, pos_y: 17, is_vip: false },
  { table_no: 28, pos_x: 70, pos_y: 24, is_vip: false },
  { table_no: 21, pos_x: 58, pos_y: 24, is_vip: true },
  { table_no: 22, pos_x: 70, pos_y: 31, is_vip: false },
  { table_no: 26, pos_x: 58, pos_y: 31, is_vip: true },
  { table_no: 23, pos_x: 70, pos_y: 38, is_vip: false },
  { table_no: 25, pos_x: 58, pos_y: 38, is_vip: false },
  { table_no: 24, pos_x: 70, pos_y: 45, is_vip: false },
  { table_no: 27, pos_x: 58, pos_y: 45, is_vip: false },
  { table_no: 31, pos_x: 70, pos_y: 52, is_vip: false },
  { table_no: 30, pos_x: 58, pos_y: 52, is_vip: false },
  { table_no: 32, pos_x: 70, pos_y: 59, is_vip: false },
  { table_no: 33, pos_x: 58, pos_y: 59, is_vip: false },
  { table_no: 35, pos_x: 70, pos_y: 66, is_vip: false },
  { table_no: 34, pos_x: 58, pos_y: 66, is_vip: false },
  { table_no: 36, pos_x: 70, pos_y: 73, is_vip: false },
  { table_no: 37, pos_x: 58, pos_y: 73, is_vip: false },
  { table_no: 38, pos_x: 70, pos_y: 80, is_vip: false },
  { table_no: 39, pos_x: 58, pos_y: 80, is_vip: false },
  { table_no: 40, pos_x: 70, pos_y: 87, is_vip: false },
]

export const VIP_TABLE_NUMBERS = new Set([3, 4, 21, 26])

const tableByNo = new Map(FLOOR_TABLE_POSITIONS.map((t) => [t.table_no, t]))

export function getFloorTablePosition(tableNo: number): FloorTablePosition | undefined {
  return tableByNo.get(tableNo)
}

export const CHAIRS_PER_TABLE = 10
const CHAIR_RADIUS_PCT = 2.8

export function chairOffsetPercent(seatNo: number, radiusPct: number = CHAIR_RADIUS_PCT) {
  const deg = (seatNo - 1) * 36 - 90
  const rad = (deg * Math.PI) / 180
  return {
    x: Math.cos(rad) * radiusPct,
    y: Math.sin(rad) * radiusPct,
  }
}
