"use client"
import Image from "next/image"
import { useReducedMotion } from "framer-motion"
import { useEffect, useRef } from "react"
import type { ProcessedImage } from "@/lib/types"
import { PixelMark } from "./ui/PixelMark"

type Props = { image?: ProcessedImage; alt?: string; sharp?: boolean }

/**
 * Hero "operator scan": a silver ordered-dither portrait (pre-rendered by
 * scripts/dither.mjs) with a false-colour layer revealed only inside the moving
 * scan frame. Pointer-driven on fine pointers, a slow Lissajous drift on touch.
 * `sharp` is the About-section variant: plain colour image, no scan.
 */
export function Identity({ image, alt, sharp = false }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const scan = useRef<HTMLDivElement>(null)
  const thermal = useRef<HTMLImageElement>(null)
  const leader = useRef<SVGSVGElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = wrap.current
    if (!el || sharp) return
    let raf = 0
    let active = false
    let visible = !document.hidden
    let last = 0
    let x = 0.6
    let y = 0.45
    let tx = x
    let ty = y
    const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches
    let area = -1
    // Spec §5: re-draw the dashed callout leader whenever the scan moves into a new area.
    const redraw = (px: number, py: number) => {
      const next = Math.min(2, Math.floor(px * 3)) + 3 * Math.min(2, Math.floor(py * 3))
      if (next === area) return
      const first = area === -1
      area = next
      const svg = leader.current
      if (!svg || first) return
      svg.classList.remove("osk-leader-draw")
      void svg.getBoundingClientRect()
      svg.classList.add("osk-leader-draw")
    }
    const place = (px: number, py: number) => {
      redraw(px, py)
      if (scan.current) scan.current.style.transform = `translate(${px * 100 - 25}%, ${py * 100 - 25}%)`
      if (thermal.current) {
        const left = 0.1 + (px - 0.25) * 0.57
        const top = 0.16 + (py - 0.25) * 0.34
        thermal.current.style.clipPath = `inset(${((top - 0.025) / 0.95) * 100}% ${(1 - (left + 0.57 - 0.075) / 0.85) * 100}% ${(1 - (top + 0.34 - 0.025) / 0.95) * 100}% ${((left - 0.075) / 0.85) * 100}%)`
      }
    }
    const draw = (t: number) => {
      if (!active || !visible) return
      if (t - last < 1000 / 60) {
        raf = requestAnimationFrame(draw)
        return
      }
      last = t
      if (!fine) {
        tx = 0.5 + Math.sin(t / 4000) * 0.24
        ty = 0.5 + Math.cos(t / 5300) * 0.2
      }
      x += (tx - x) * (reduced ? 1 : 0.15)
      y += (ty - y) * (reduced ? 1 : 0.15)
      place(x, y)
      raf = requestAnimationFrame(draw)
    }
    const start = () => {
      cancelAnimationFrame(raf)
      if (active && visible && !reduced) raf = requestAnimationFrame(draw)
    }
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting
      start()
    })
    observer.observe(el)
    const onVisibility = () => {
      visible = !document.hidden
      start()
    }
    document.addEventListener("visibilitychange", onVisibility)
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      tx = Math.max(0.2, Math.min(0.75, (e.clientX - r.left) / r.width))
      ty = Math.max(0.2, Math.min(0.75, (e.clientY - r.top) / r.height))
      if (reduced) place(tx, ty)
    }
    el.addEventListener("pointermove", move)
    place(x, y)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
      document.removeEventListener("visibilitychange", onVisibility)
      el.removeEventListener("pointermove", move)
    }
  }, [reduced, sharp])

  const hasImage = !!image
  return (
    <div className={`osk-identity ${sharp ? "osk-identity-sharp" : ""}`} ref={wrap}>
      <div className="osk-identity-grid" aria-hidden="true" />
      {image ? (
        sharp ? (
          <Image src={image.color.src} width={image.color.width} height={image.color.height} alt={alt || "Osama Khalifa"} sizes="(max-width: 767px) 100vw, 40vw" />
        ) : (
          <>
            {/* Pre-dithered at build time; `unoptimized` keeps the 1-bit pattern intact. */}
            <Image src={image.silver.src} width={image.silver.width} height={image.silver.height} unoptimized priority className="osk-portrait-base" alt={alt || "Silver dithered portrait of Osama Khalifa"} />
            {image.thermal && (
              <Image ref={thermal} src={image.thermal.src} width={image.thermal.width} height={image.thermal.height} unoptimized className="osk-portrait-thermal" alt="" aria-hidden="true" />
            )}
          </>
        )
      ) : (
        <div className="osk-monogram">
          <PixelMark />
        </div>
      )}
      {!sharp && (
        <>
          <div className="osk-scan" ref={scan} aria-hidden="true">
            <span className="osk-scan-corner" />
            <div className="osk-scan-color" />
            <span className="osk-scan-label">OSK / {hasImage ? "IDENTITY" : "OPERATOR"} SCAN</span>
            <b>+</b>
          </div>
          <div className="osk-callout">
            <span>{hasImage ? "identity verified" : "every layer connected"}</span>
            <svg ref={leader} viewBox="0 0 110 70" aria-hidden="true">
              <path d="M0 0H45L105 65" />
            </svg>
            <i>+</i>
          </div>
        </>
      )}
      <div className="osk-identity-meta">
        <span>
          30.04° N
          <br />
          31.24° E
        </span>
        <span>
          OSK—00
          <br />
          {sharp ? "OPERATOR" : "SYSTEM / ONLINE"}
        </span>
      </div>
    </div>
  )
}
