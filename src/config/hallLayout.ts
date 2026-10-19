/**
 * ตำแหน่งโต๊ะ 1–40 ตามผัง Bluehouse (เวทีบน · ทางเดินกลาง · 2 ฝั่ง)
 * x,y เป็น % ของ viewBox ผัง
 */
export type HallTablePosition = {
  x: number
  y: number
  vip?: boolean
}

const LEFT_X = 27
const RIGHT_X = 73
const START_Y = 20
const ROW_GAP = 3.35

function buildHallTables(): Record<number, HallTablePosition> {
  const out: Record<number, HallTablePosition> = {}
  for (let row = 0; row < 20; row++) {
    const y = START_Y + row * ROW_GAP
    const left = row * 2 + 1
    const right = row * 2 + 2
    out[left] = { x: LEFT_X, y, vip: left === 21 }
    out[right] = { x: RIGHT_X, y, vip: right === 26 }
  }
  return out
}

export const hallTables = buildHallTables()

export const hallMeta = {
  tableCount: 40,
  vipTables: [21, 26] as number[],
}
