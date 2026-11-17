import { Fragment } from "react"
import { LAYERS } from "@/lib/layers"

/** Labelled system map, explicitly not a product screen. */
export function Architecture({ number, diagram }: { number: string; diagram: string[] }) {
  return (
    <figure className="osk-architecture">
      <div className="osk-architecture-label">
        <span>FIG. {number} — SYSTEM MAP</span>
        <span>ARCHITECTURE / NOT A PRODUCT SCREEN</span>
      </div>
      <div className="osk-flow">
        {diagram.map((step, i) => (
          <Fragment key={step}>
            <div>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {step}
              <i style={{ background: LAYERS[i % 4].color }} />
            </div>
            {i < diagram.length - 1 && <b aria-hidden="true">→</b>}
          </Fragment>
        ))}
      </div>
      <figcaption>Interfaces are only one part of the system.</figcaption>
    </figure>
  )
}
