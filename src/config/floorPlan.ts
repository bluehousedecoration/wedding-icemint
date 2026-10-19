/**
 * ผังที่นั่งจาก Bluehouse / Canva
 * 1. วางไฟล์ PNG ที่ public/floor-plan.png แล้วตั้ง imageUrl เป็น '/floor-plan.png'
 * 2. ตั้งพิกัดไฮไลต์โต๊ะใน tableMarkers (เปอร์เซ็นต์จากมุมซ้ายบนของภาพ)
 */

export type TableMarker = {
  xPercent: number
  yPercent: number
}

export const floorPlanConfig = {
  /** ว่าง = ใช้กริดโต๊ะชั่วคราว */
  imageUrl: '' as string,
  imageAlt: 'ผังที่นั่งงานแต่ง Ice & Mint',
  /** จำนวนโต๊ะสำหรับ fallback grid */
  tableCount: 40,
  gridColumns: 5,
  /**
   * ตัวอย่าง: 8: { xPercent: 42, yPercent: 55 }
   * เติมเมื่อ export ผังจาก Bluehouse แล้ว
   */
  tableMarkers: {} as Record<number, TableMarker>,
}

export function getTableMarker(tableNumber: number): TableMarker | undefined {
  return floorPlanConfig.tableMarkers[tableNumber]
}
