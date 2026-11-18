"use client"

import { useCallback, useState } from "react"
import { ScrambleText } from "./ScrambleText"
import { TypeIn } from "./TypeIn"

type Props = { as?: "h1" | "h2"; title: string; accent?: string; intro: string }

export function TitleIntro({ as: Heading = "h2", title, accent, intro }: Props) {
  const [ready, setReady] = useState(false)
  const startIntro = useCallback(() => setReady(true), [])
  return (
    <>
      <Heading><ScrambleText text={title} accent={accent} onComplete={startIntro} /></Heading>
      <p><TypeIn text={intro} play={ready} /></p>
    </>
  )
}
