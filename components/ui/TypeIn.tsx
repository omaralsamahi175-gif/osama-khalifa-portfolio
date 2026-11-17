"use client"
import { useEffect, useState } from "react"

type Props = { text: string; play: boolean; delay?: number; speed?: number }

/**
 * Types `text` in one character at a time (spec §5). The full string is laid out
 * invisibly underneath so surrounding layout never shifts, and screen readers get
 * the whole text at once. Once finished (or when `play` is false) later text
 * changes render instantly.
 */
export function TypeIn({ text, play, delay = 0, speed = 20 }: Props) {
  const [count, setCount] = useState(play ? 0 : Infinity)
  useEffect(() => {
    if (!play) return
    let timer = 0
    let i = 0
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        i += 1
        if (i >= text.length) {
          window.clearInterval(timer)
          setCount(Infinity)
        } else setCount(i)
      }, speed)
    }, delay)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(timer)
    }
    // Plays once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (count === Infinity) return <>{text}</>
  return (
    <span className="osk-typein">
      <span className="osk-typein-ghost" aria-hidden="true">
        {text}
      </span>
      <span className="osk-typein-text" aria-hidden="true">
        {text.slice(0, count)}
      </span>
      <span className="osk-sr">{text}</span>
    </span>
  )
}
