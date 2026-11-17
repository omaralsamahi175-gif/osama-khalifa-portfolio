"use client"
import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"
import { EASE } from "@/lib/layers"

/** Fade + 16px rise when 20% in view, once. Reduced motion: opacity only, 150ms. */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: reduced ? "none" : "translateY(16px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0.15 : 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
