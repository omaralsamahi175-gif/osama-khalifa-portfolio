"use client"

import { Fragment, createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { motion } from "framer-motion"
import { ScrambleText } from "./ScrambleText"
import { useInViewOnce } from "./useInViewOnce"

const CardOpening = createContext(false)
const CORNERS = ["tl", "tr", "bl", "br"]

type Props = {
  children: ReactNode
  className: string
  color: string
  layoutId?: string
}

export function MatrixCard({ children, className, color, layoutId }: Props) {
  const [ref, visible] = useInViewOnce<HTMLElement>(0.25)
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    const card = ref.current
    if (!visible || !card || opening) return
    const stagger = Number.parseFloat(getComputedStyle(card).getPropertyValue("--card-stagger")) || 0
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = window.setTimeout(() => setOpening(true), reduced ? 0 : stagger)
    return () => window.clearTimeout(timer)
  }, [opening, ref, visible])

  return (
    <motion.article
      ref={ref}
      className={`osk-matrix ${className}`}
      layoutId={layoutId}
      data-opening={opening || undefined}
      onFocusCapture={() => setOpening(true)}
    >
      <div className="osk-matrix-frame" aria-hidden="true" />
      <div className="osk-matrix-ticks" style={{ "--matrix-status": color } as CSSProperties} aria-hidden="true">
        {CORNERS.map((corner) => <i key={corner} className={`osk-matrix-tick ${corner}`} />)}
      </div>
      <CardOpening.Provider value={opening}>{children}</CardOpening.Provider>
    </motion.article>
  )
}

export function MatrixText({ text, delay = 620, title = false }: { text: string; delay?: number; title?: boolean }) {
  return <ScrambleText text={text} play={useContext(CardOpening)} delay={delay} duration={title ? undefined : 235} />
}

export function MatrixCopy({ text }: { text: string }) {
  const opening = useContext(CardOpening)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const paragraph = ref.current
    if (!opening || !paragraph || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const words = Array.from(paragraph.children) as HTMLElement[]
    const lines = Array.from(new Set(words.map((word) => word.offsetTop)))
    const stagger = Math.min(48, 180 / Math.max(1, lines.length - 1))
    words.forEach((word) => {
      const line = lines.indexOf(word.offsetTop)
      word.style.animationDelay = `${845 + line * stagger}ms`
    })
  }, [opening])

  return (
    <p className="osk-matrix-copy" ref={ref}>
      {text.split(" ").map((word, index) => (
        <Fragment key={index}>{index > 0 && " "}<span>{word}</span></Fragment>
      ))}
    </p>
  )
}
