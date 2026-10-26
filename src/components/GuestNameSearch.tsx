import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { displayGuestLabel, filterSearchIndex } from '../lib/guestSearch'
import type { SearchIndexEntry } from '../types/seating'

type GuestNameSearchProps = {
  searchIndex: SearchIndexEntry[]
  loading?: boolean
  disabled?: boolean
  onSelect: (entry: SearchIndexEntry) => void
}

export function GuestNameSearch({
  searchIndex,
  loading,
  disabled,
  onSelect,
}: GuestNameSearchProps) {
  const listId = useId()
  const inputId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const matches = useMemo(
    () => filterSearchIndex(searchIndex, query),
    [searchIndex, query],
  )

  useEffect(() => {
    setActiveIndex(0)
  }, [query, matches.length])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const pick = (entry: SearchIndexEntry) => {
    setOpen(false)
    setQuery(displayGuestLabel(entry.displayName))
    onSelect(entry)
  }

  const showList = open && query.trim().length > 0 && !loading && !disabled

  return (
    <div className="guest-search" ref={rootRef}>
      <label className="guest-search-label" htmlFor={inputId}>
        ค้นหาชื่อบนซองเชิญ
      </label>
      <input
        id={inputId}
        className="guest-search-input"
        type="search"
        autoComplete="off"
        role="combobox"
        aria-expanded={showList && matches.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder="พิมพ์ชื่อ เช่น ไอซ์"
        value={query}
        disabled={disabled || loading}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!showList || matches.length === 0) return
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((i) => Math.min(i + 1, matches.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((i) => Math.max(i - 1, 0))
          } else if (e.key === 'Enter') {
            e.preventDefault()
            const entry = matches[activeIndex]
            if (entry) pick(entry)
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
      />
      {loading ? <p className="guest-search-status">กำลังโหลดรายชื่อ...</p> : null}
      {showList && matches.length === 0 ? (
        <p className="guest-search-empty">ไม่พบชื่อ — ตรวจสอบให้ตรงกับซองเชิญ</p>
      ) : null}
      {showList && matches.length > 0 ? (
        <ul id={listId} className="guest-search-list" role="listbox">
          {matches.map((entry, i) => {
            const title = displayGuestLabel(entry.displayName)
            const meta = [
              entry.guestSource?.trim(),
              entry.tableName?.trim(),
              entry.tableNo ? `โต๊ะ ${entry.tableNo}` : 'ยังไม่จัดโต๊ะ',
            ]
              .filter(Boolean)
              .join(' · ')
            return (
              <li key={`${title}-${entry.tableNo}-${entry.seatNo}-${i}`} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  className={`guest-search-option${i === activeIndex ? ' guest-search-option-active' : ''}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(entry)}
                >
                  <span className="guest-search-option-name">{title}</span>
                  <span className="guest-search-option-meta">{meta}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
