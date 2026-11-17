/**
 * Radar sweep for the Live Log section.
 *
 * The compass (rings, ticks, degree labels) is static SVG. Only the moving part
 * (a 90° conic wedge plus the sweep line) is painted on a 600×600 canvas laid
 * over it. One revolution takes 8 s of *active* time, so each quarter-turn is
 * 2 s; every time the sweep enters a new quarter `onQuarter(layer, quarter)`
 * fires (0 = N/Frontend, 1 = E/API, 2 = S/Data, 3 = W/AI).
 *
 * Time only advances while the radar is on screen and the tab is visible:
 * an IntersectionObserver and `visibilitychange` stop the rAF loop, and each
 * frame's delta is capped at 40 ms so resuming never jumps ahead.
 */
export const RADAR_SIZE = 600
export const REVOLUTION_MS = 8000
export const QUARTER_MS = REVOLUTION_MS / 4
const RADIUS = 221
const FRAME_MS = 1000 / 60
const MAX_DELTA = 40

export function drawSweep(ctx: CanvasRenderingContext2D, elapsed: number) {
  const phase = (elapsed % REVOLUTION_MS) / REVOLUTION_MS
  const angle = phase * Math.PI * 2 - Math.PI / 2
  const half = RADAR_SIZE / 2
  ctx.clearRect(0, 0, RADAR_SIZE, RADAR_SIZE)
  ctx.save()
  ctx.translate(half, half)
  // Trailing wedge: transparent → faint green just behind the line, cut at the line.
  const gradient = ctx.createConicGradient(angle - Math.PI / 2, 0, 0)
  gradient.addColorStop(0, "rgba(166,190,165,0)")
  gradient.addColorStop(0.245, "rgba(166,190,165,.12)")
  gradient.addColorStop(0.25, "rgba(166,190,165,0)")
  gradient.addColorStop(1, "rgba(166,190,165,0)")
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(0, 0, RADIUS, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = "rgba(199,217,196,.55)"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(Math.cos(angle) * RADIUS, Math.sin(angle) * RADIUS)
  ctx.stroke()
  ctx.restore()
}

type RadarOptions = {
  canvas: HTMLCanvasElement
  /** Element whose visibility gates the animation. */
  root: HTMLElement
  onQuarter: (layer: number, quarter: number) => void
}

/** Starts the sweep; returns a cleanup function that cancels everything. */
export function startRadar({ canvas, root, onQuarter }: RadarOptions): () => void {
  const ctx = canvas.getContext("2d")
  if (!ctx) return () => {}
  canvas.width = RADAR_SIZE
  canvas.height = RADAR_SIZE
  let raf = 0
  let last = 0
  let elapsed = 0
  let active = false
  let visible = !document.hidden
  let lastQuarter = -1

  const render = (t: number) => {
    if (!active || !visible) return
    if (!last) last = t
    const delta = Math.min(t - last, MAX_DELTA)
    // Cap at ~60 fps on high-refresh displays.
    if (delta < FRAME_MS) {
      raf = requestAnimationFrame(render)
      return
    }
    last = t
    elapsed += delta
    drawSweep(ctx, elapsed)
    const quarter = Math.floor(elapsed / QUARTER_MS)
    if (quarter !== lastQuarter) {
      lastQuarter = quarter
      onQuarter(quarter % 4, quarter)
    }
    raf = requestAnimationFrame(render)
  }

  const sync = () => {
    cancelAnimationFrame(raf)
    last = 0
    if (active && visible) raf = requestAnimationFrame(render)
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      active = entry.isIntersecting
      sync()
    },
    { threshold: 0.1 },
  )
  observer.observe(root)
  const onVisibility = () => {
    visible = !document.hidden
    sync()
  }
  document.addEventListener("visibilitychange", onVisibility)

  return () => {
    cancelAnimationFrame(raf)
    observer.disconnect()
    document.removeEventListener("visibilitychange", onVisibility)
  }
}
