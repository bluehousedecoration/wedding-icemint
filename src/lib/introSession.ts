export const INTRO_SESSION_KEY = 'ice-mint-intro-seen'

export function hasSeenIntroThisSession(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function markIntroSeenThisSession(): void {
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
  } catch {
    /* private mode */
  }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
