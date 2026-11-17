"use client"
import { useEffect, useRef } from "react"

/** Shortcuts never fire inside editable fields or with Cmd/Ctrl/Alt held. */
export function shouldIgnoreKey(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null
  return (
    e.defaultPrevented ||
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    !!target?.isContentEditable ||
    /INPUT|TEXTAREA|SELECT/.test(target?.tagName ?? "")
  )
}

/**
 * Registers one window keydown listener for the component's lifetime and always
 * calls the latest handler (so callers don't need to memoise their state).
 */
export function useShortcuts(handler: (e: KeyboardEvent) => void) {
  const latest = useRef(handler)
  latest.current = handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!shouldIgnoreKey(e)) latest.current(e)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
}
