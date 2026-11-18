"use client"

import { Fragment, useEffect, useRef } from "react"
import { useInViewOnce } from "./useInViewOnce"

const SYMBOLS = "!<>-_\\/[]{}=+*^?#01"

type Props = {
  text: string
  accent?: string
  duration?: number
  delay?: number
  play?: boolean
  onComplete?: () => void
}

export function ScrambleText({ text, accent = "", duration = 570, delay = 0, play, onComplete }: Props) {
  const [ref, visible] = useInViewOnce<HTMLSpanElement>(0.3, play === undefined)
  const characters = useRef<(HTMLSpanElement | null)[]>([])
  const started = play ?? visible

  useEffect(() => {
    if (!started) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete?.()
      return
    }

    const letters = characters.current.filter((character): character is HTMLSpanElement => character !== null)
    const original = letters.map((letter) => letter.dataset.letter ?? "")
    const start = performance.now() + delay
    const scrambleTime = duration * 0.24
    const stagger = (duration - scrambleTime) / Math.max(1, letters.length - 1)
    const element = ref.current
    let nextUpdate = start
    let resolved = 0
    let frame: number

    function draw(now: number) {
      if (now >= nextUpdate) {
        while (resolved < letters.length && now - start >= scrambleTime + resolved * stagger) {
          const letter = letters[resolved]
          letter.textContent = original[resolved]
          delete letter.dataset.scrambling
          resolved += 1
        }
        for (let i = resolved; i < letters.length; i += 1) {
          letters[i].dataset.scrambling = ""
          letters[i].textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        }
        if (nextUpdate === start) element?.setAttribute("data-playing", "")
        nextUpdate = now + 34
      }
      if (resolved === letters.length) onComplete?.()
      else frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [delay, duration, onComplete, ref, started, text, accent])

  let index = 0
  const accentStart = Array.from(text.replace(/[ \n]/g, "")).length
  return (
    <span className="osk-scramble" ref={ref} data-visible={started || undefined}>
      <span className="osk-sr">{text.replace(/\n/g, " ")}{accent}</span>
      <span className="osk-scramble-visual" aria-hidden="true">
        {(text + accent).split("\n").map((line, lineIndex) => (
          <Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {line.split(/( +)/).map((word, wordIndex) =>
              word.startsWith(" ") ? word : (
                <span className="osk-scramble-word" key={wordIndex}>
                  {Array.from(word, (character) => {
                    const slot = index++
                    const isAccent = slot >= accentStart
                    return (
                      <span className="osk-scramble-cell" key={slot}>
                        <span className="osk-scramble-space">{character}</span>
                        <span
                          className={isAccent ? "osk-scramble-letter osk-heading-dot" : "osk-scramble-letter"}
                          data-letter={character}
                          ref={(node) => { characters.current[slot] = node }}
                        >
                          {character}
                        </span>
                      </span>
                    )
                  })}
                </span>
              ),
            )}
          </Fragment>
        ))}
      </span>
    </span>
  )
}
