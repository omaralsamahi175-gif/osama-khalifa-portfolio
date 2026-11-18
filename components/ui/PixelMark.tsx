import { useId } from "react"

const ROWS = ["0111100011111", "1100110011000", "1100110011000", "1100110001110", "1100110000011", "1100110000011", "0111100011110"]

/** "OS" pixel monogram. Large variant fills each pixel with a 2px dot pattern. */
export function PixelMark({ small = false }: { small?: boolean }) {
  const patternId = useId()
  return (
    <svg className={small ? "osk-mark-small" : "osk-mark-large"} viewBox="0 0 130 70" role="img" aria-label="OS pixel monogram">
      <defs>
        <pattern id={patternId} width="2" height="2" patternUnits="userSpaceOnUse">
          <rect width="1.2" height="1.2" fill="currentColor" />
        </pattern>
      </defs>
      {ROWS.flatMap((row, y) =>
        row.split("").map((p, x) =>
          p === "1" ? <rect key={`${y}-${x}`} x={x * 10} y={y * 10} width="9" height="9" fill={small ? "currentColor" : `url(#${patternId})`} /> : null,
        ),
      )}
    </svg>
  )
}
