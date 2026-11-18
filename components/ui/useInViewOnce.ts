"use client"

import { useEffect, useRef, useState } from "react"

export function useInViewOnce<T extends HTMLElement>(threshold: number, enabled = true) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || !enabled || visible) return
    if (!("IntersectionObserver" in window)) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < threshold) return
      observer.disconnect()
      setVisible(true)
    }, { threshold })
    observer.observe(element)
    return () => observer.disconnect()
  }, [enabled, threshold, visible])

  return [ref, visible] as const
}
