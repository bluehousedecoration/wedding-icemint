import type { SearchIndexEntry } from '../types/seating'

export function displayGuestLabel(label: string): string {
  return label.replace(/^คุณ\s*/i, '').trim() || label.trim()
}

function scoreEntryMatch(entry: SearchIndexEntry, query: string): number {
  const q = query.trim().toLowerCase()
  if (!q) return 0

  const name = displayGuestLabel(entry.displayName).toLowerCase()
  const zone = (entry.zone ?? '').toLowerCase()
  const tableName = (entry.tableName ?? '').toLowerCase()
  const source = (entry.guestSource ?? '').toLowerCase()
  const category = (entry.category ?? '').toLowerCase()

  let score = 0
  if (name === q) score += 200
  else if (name.startsWith(q)) score += 120
  else if (name.includes(q)) score += 80

  const tokens = q.split(/\s+/).filter(Boolean)
  if (tokens.length > 1 && tokens.every((t) => name.includes(t))) score += 90

  if (source.includes(q)) score += 40
  if (zone.includes(q)) score += 25
  if (tableName.includes(q)) score += 25
  if (category.includes(q)) score += 20

  if (!entry.tableNo) score -= 30

  return score
}

export function filterSearchIndex(
  entries: SearchIndexEntry[],
  query: string,
  limit = 12,
): SearchIndexEntry[] {
  const q = query.trim()
  if (q.length < 1) return []

  return entries
    .map((entry) => ({ entry, score: scoreEntryMatch(entry, q) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return displayGuestLabel(a.entry.displayName).localeCompare(
        displayGuestLabel(b.entry.displayName),
        'th',
      )
    })
    .slice(0, limit)
    .map((row) => row.entry)
}
