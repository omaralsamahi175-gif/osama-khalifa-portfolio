"use client"
import Image from "next/image"
import { useState } from "react"
import type { CaseScreen } from "@/lib/types"

type Props = { screen: CaseScreen; index: number; total: number; title: string }

const pad = (n: number) => String(n).padStart(2, "0")

/** Silver preview; the colour original mounts on pointer intent and wipes in over 500ms. */
export function ProductScreen({ screen, index, total, title }: Props) {
  const [intent, setIntent] = useState(false)
  const [show, setShow] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { image } = screen
  return (
    <figure
      className="osk-screen"
      onPointerEnter={() => {
        setIntent(true)
        setShow(true)
      }}
      onPointerLeave={() => setShow(false)}
    >
      <div className={`osk-screen-images ${show && loaded ? "revealed" : ""}`}>
        <Image src={image.silver.src} width={image.silver.width} height={image.silver.height} unoptimized alt={screen.alt || `${title} product interface`} className="osk-screen-silver" />
        {intent && (
          <Image className="osk-screen-color" src={image.color.src} width={image.color.width} height={image.color.height} sizes="(max-width: 1140px) 100vw, 1010px" alt="" onLoad={() => setLoaded(true)} />
        )}
      </div>
      <figcaption>
        SCREEN {pad(index + 1)} / {pad(total)} · {(screen.caption || title).toUpperCase()}{" "}
        <button
          onClick={() => {
            setIntent(true)
            setShow((s) => !s)
          }}
        >
          {show ? "SILVER VIEW" : "FULL COLOR"} ↗
        </button>
      </figcaption>
    </figure>
  )
}
