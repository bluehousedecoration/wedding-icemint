/** จบ intro แล้วในแท็บนี้ (ไม่ใช้ sessionStorage — รีโหลดหน้า = เล่น intro ใหม่) */
let introFinishedThisDocument = false

export function hasIntroFinishedThisDocument(): boolean {
  return introFinishedThisDocument
}

export function markIntroFinishedThisDocument(): void {
  introFinishedThisDocument = true
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
