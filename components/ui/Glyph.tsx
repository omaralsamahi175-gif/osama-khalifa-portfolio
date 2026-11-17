const PATHS = [
  "M8 8h48v34H8z M24 54h16 M32 42v12 M15 15h34v20H15z",
  "M11 12h16v16H11z M37 36h16v16H37z M19 28v16h18 M45 36V20H27",
  "M10 15c0-10 44-10 44 0v34c0 10-44 10-44 0z M10 15c0 10 44 10 44 0 M10 31c0 10 44 10 44 0 M10 44c0 10 44 10 44 0",
  "M32 8v18 M12 18l16 12 M52 18L36 30 M12 48l16-12 M52 48L36 36 M32 38v18 M26 26h12v12H26z M6 12h12v12H6z M46 12h12v12H46z M6 42h12v12H6z M46 42h12v12H46z",
]

/** Layer glyphs: 0 monitor (Frontend), 1 nodes (API), 2 database (Data), 3 network (AI). */
export function Glyph({ index = 0 }: { index?: number }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" aria-hidden="true">
      <path d={PATHS[index]} />
    </svg>
  )
}
