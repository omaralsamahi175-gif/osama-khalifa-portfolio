type Props = { number: string; title: string; extra?: string; level?: number }

/** Section label row: "// 01  THE STACK …" with optional right-hand annotation. */
export function Strip({ number, title, extra, level }: Props) {
  return (
    <div className="osk-strip">
      <span role={level ? "heading" : undefined} aria-level={level}>
        {"// "}<b className="osk-pixel-number">{number}</b> &nbsp;{title}
      </span>
      <span className="osk-strip-extra">{extra}</span>
    </div>
  )
}
