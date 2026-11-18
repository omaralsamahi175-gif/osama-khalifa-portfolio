"use client"
import { useEffect, useState } from "react"

const cairo = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Cairo",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
})

export const formatCairo = (date = new Date()) => `${cairo.format(date)} CAIRO`

/**
 * Header clock in Cairo time. Renders "CAIRO / EGYPT" on the server and until
 * mount (no hydration mismatch), ticks every second, pauses while the tab is hidden.
 */
export function useCairoClock() {
  const [clock, setClock] = useState("CAIRO / EGYPT")
  useEffect(() => {
    const tick = () => setClock(formatCairo())
    tick()
    let timer = window.setInterval(tick, 1000)
    const onVisibility = () => {
      window.clearInterval(timer)
      if (!document.hidden) {
        tick()
        timer = window.setInterval(tick, 1000)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])
  return clock
}
