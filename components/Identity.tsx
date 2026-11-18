"use client"

import Image from "next/image"
import { useReducedMotion } from "framer-motion"
import { useEffect, useRef } from "react"
import type { ProcessedImage } from "@/lib/types"
import { PixelMark } from "./ui/PixelMark"

type Props = { image?: ProcessedImage; alt?: string; sharp?: boolean }

const DESK_SRC = "/images/pixel-desk-knight.png"
const DESK_SIZES = "(max-width: 478px) calc(100vw - 48px), (max-width: 767px) 430px, (max-width: 1360px) 36vw, 530px"
const DESK_ALT = "Pixel art of a developer desk with a knight figurine and a coffee cup"
const SCAN_WIDTH = 0.42
const SCAN_HEIGHT = 0.38

export function Identity({ image, alt, sharp = false }: Props) {
  const photo = useRef<HTMLDivElement>(null)
  const scan = useRef<HTMLDivElement>(null)
  const color = useRef<HTMLImageElement>(null)
  const leader = useRef<SVGSVGElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const frame = photo.current
    if (!frame || reduced) return

    const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches
    let raf = 0
    let active = false
    let x = 0.47
    let y = 0.44
    let tx = x
    let ty = y
    let area = -1

    function draw(time: number) {
      if (!active || document.hidden) return

      if (!fine) {
        tx = 0.5 + Math.sin(time / 4000) * 0.24
        ty = 0.53 + Math.cos(time / 5300) * 0.16
      }

      x += (tx - x) * 0.15
      y += (ty - y) * 0.15
      const left = Math.max(0.025, Math.min(0.975 - SCAN_WIDTH, x - SCAN_WIDTH / 2))
      const top = Math.max(0.14, Math.min(0.975 - SCAN_HEIGHT, y - SCAN_HEIGHT / 2))

      if (scan.current) {
        scan.current.style.transform = `translate(${left / SCAN_WIDTH * 100}%, ${top / SCAN_HEIGHT * 100}%)`
      }
      if (color.current) {
        color.current.style.clipPath = `inset(${top * 100}% ${(1 - left - SCAN_WIDTH) * 100}% ${(1 - top - SCAN_HEIGHT) * 100}% ${left * 100}%)`
      }

      const nextArea = Math.floor(x * 3) + 3 * Math.floor(y * 3)
      if (leader.current && nextArea !== area) {
        if (area >= 0) {
          leader.current.classList.remove("osk-leader-draw")
          void leader.current.getBoundingClientRect()
          leader.current.classList.add("osk-leader-draw")
        }
        area = nextArea
      }

      raf = requestAnimationFrame(draw)
    }

    function update() {
      cancelAnimationFrame(raf)
      if (active && !document.hidden) raf = requestAnimationFrame(draw)
    }

    function move(event: PointerEvent) {
      if (!frame || !fine) return
      const bounds = frame.getBoundingClientRect()
      tx = (event.clientX - bounds.left) / bounds.width
      ty = (event.clientY - bounds.top) / bounds.height
    }

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting
      update()
    })
    observer.observe(frame)
    frame.addEventListener("pointermove", move)
    document.addEventListener("visibilitychange", update)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
      frame.removeEventListener("pointermove", move)
      document.removeEventListener("visibilitychange", update)
    }
  }, [reduced])

  return (
    <div className={`osk-identity ${sharp ? "osk-identity-sharp" : "osk-identity-hero"}`}>
      <div className="osk-identity-grid" aria-hidden="true" />
      {!sharp && (
        <div className="osk-desk" ref={photo}>
          <Image src={DESK_SRC} sizes={DESK_SIZES} quality={90} fill priority className="osk-desk-base" alt={DESK_ALT} />
          <Image src={DESK_SRC} sizes={DESK_SIZES} quality={90} fill ref={color} className="osk-desk-color" alt="" aria-hidden="true" />
          <div className="osk-scan" ref={scan} aria-hidden="true">
            <div className="osk-scan-color" />
            <span className="osk-scan-label">OSK / OPERATOR SCAN</span>
            <b>+</b>
          </div>
          <div className="osk-callout">
            <span>every layer connected</span>
            <svg ref={leader} viewBox="0 0 110 70" aria-hidden="true">
              <path d="M106 2H84L28 52" />
            </svg>
            <i aria-hidden="true">+</i>
          </div>
        </div>
      )}
      {sharp && image ? (
        <Image src={image.color.src} width={image.color.width} height={image.color.height}
          alt={alt || "Osama Khalifa"} sizes="(max-width: 767px) 100vw, 40vw" />
      ) : (
        <div className="osk-monogram"><PixelMark /></div>
      )}
      <div className="osk-identity-meta">
        <span>30.04° N<br />31.24° E</span>
        <span>{sharp ? "OSK—00" : "OSK-0"}<br />{sharp ? "OPERATOR" : "SYSTEM / ONLINE"}</span>
      </div>
    </div>
  )
}
