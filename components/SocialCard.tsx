/**
 * 1200×630 sharing artwork, ported from the Framer SocialCard for next/og (Satori).
 * Satori needs `display:flex` on every multi-child element and px letter-spacing,
 * so the markup is flatter than the Framer original; the composition is the same.
 */
type Props = { title: string; caption: string; number: string }

const muted = "#aaa99e"
const rule = "1px solid rgba(255,255,255,0.19)"

export function SocialCard({ title, caption, number }: Props) {
  const size = title.replace("\n", "").length > 23 ? 76 : 96
  return (
    <div style={{ width: 1200, height: 630, display: "flex", position: "relative", background: "#0e0f11", color: "#ededeb", fontFamily: "JetBrains Mono", padding: 46 }}>
      <div style={{ position: "absolute", left: 46, right: 46, top: 46, display: "flex", justifyContent: "space-between", fontSize: 13, letterSpacing: 0.78, borderBottom: rule, paddingBottom: 22 }}>
        <span>OSAMA KHALIFA / FULL STACK ENGINEER</span>
        <span style={{ color: muted }}>{`OSK—${number} // CAIRO, EGYPT`}</span>
      </div>
      <div style={{ position: "absolute", left: 46, top: 190, width: 790, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 12, color: "#a5a599", letterSpacing: 0.84, marginBottom: 30 }}>{"// FRONT TO BACK. ONE ENGINEER."}</div>
        {title.split("\n").map((line) => (
          <div key={line} style={{ fontSize: size, lineHeight: 1.07, letterSpacing: -0.065 * size }}>
            {line}
          </div>
        ))}
      </div>
      <svg viewBox="0 0 300 300" width="300" height="300" style={{ position: "absolute", right: 45, top: 160 }} fill="none">
        <g stroke="#7b7b70" opacity="0.5">
          <circle cx="150" cy="150" r="120" />
          <circle cx="150" cy="150" r="80" />
          <circle cx="150" cy="150" r="40" />
          <path d="M150 15v270M15 150h270" />
          {Array.from({ length: 36 }, (_, i) => {
            const a = (i * Math.PI) / 18
            return <line key={i} x1={150 + Math.cos(a) * 128} y1={150 + Math.sin(a) * 128} x2={150 + Math.cos(a) * 134} y2={150 + Math.sin(a) * 134} />
          })}
        </g>
        <path d="M150 150l84-84" stroke="#d2d2c8" />
        <circle cx="150" cy="150" r="3" fill="#ededeb" />
        {([[150, 30, "#7bc86c"], [270, 150, "#4a8fe7"], [150, 270, "#e5484d"], [30, 150, "#e2b341"]] as const).map(([x, y, c]) => (
          <rect key={c} x={x - 4} y={y - 4} width="8" height="8" fill={c} />
        ))}
      </svg>
      <div style={{ position: "absolute", bottom: 44, left: 46, right: 46, borderTop: rule, paddingTop: 20, display: "flex", justifyContent: "space-between", fontSize: 12, color: muted, letterSpacing: 0.48 }}>
        <span>{caption}</span>
        <span style={{ display: "flex" }}>
          EVERY LAYER, ONE ENGINEER.
          {/* Framer used " &nbsp;" before the dot; Satori trims trailing spaces, so the gap is a margin. */}
          <span style={{ color: "#7bc86c", marginLeft: 14 }}>●</span>
        </span>
      </div>
    </div>
  )
}
