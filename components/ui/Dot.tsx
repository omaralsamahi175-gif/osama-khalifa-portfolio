export function Dot({ color = "#7BC86C" }: { color?: string }) {
  return <span className="osk-dot" style={{ background: color }} aria-hidden="true" />
}
