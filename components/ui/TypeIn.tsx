"use client"

import { useEffect, useRef } from "react"

type Props = { text: string; play: boolean; delay?: number; cursor?: boolean }

export function TypeIn({ text, play, delay = 0, cursor = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !play) return
    const letters = Array.from(element.querySelectorAll<HTMLElement>(".osk-typein-cell"))
    const end = element.querySelector<HTMLElement>(".osk-typein-end")
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.dataset.reduced = ""
      return
    }

    const speed = Math.min(18, 1180 / Math.max(1, letters.length))
    const start = performance.now() + delay
    let count = 0
    let frame: number
    function tick(now: number) {
      if (!element || now < start) {
        frame = requestAnimationFrame(tick)
        return
      }

      delete letters[count]?.dataset.cursor
      const next = Math.min(letters.length, Math.floor((now - start) / speed))
      while (count < next) letters[count++].dataset.typed = ""
      if (count < letters.length) {
        if (cursor) letters[count].dataset.cursor = "active"
        frame = requestAnimationFrame(tick)
      } else if (end && cursor) {
        end.dataset.cursor = "blink"
      }
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      letters.forEach((letter) => {
        delete letter.dataset.typed
        delete letter.dataset.cursor
      })
      if (end) delete end.dataset.cursor
    }
  }, [cursor, delay, play, text])

  const tokens = text.split(/( +)/)
  return (
    <span className="osk-typein" ref={ref}>
      <span className="osk-sr">{text}</span>
      <span aria-hidden="true">
        {tokens.map((word, index) => (
          <span className={word.startsWith(" ") ? "osk-typein-space" : "osk-typein-word"} key={index}>
            {Array.from(word, (character, slot) => (
              <span key={slot} className="osk-typein-cell">{character}</span>
            ))}
            {index === tokens.length - 1 && <span className="osk-typein-end" />}
          </span>
        ))}
      </span>
    </span>
  )
}
