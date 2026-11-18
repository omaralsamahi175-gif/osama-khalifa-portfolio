import { forwardRef } from "react"
import type { SiteConfig } from "@/lib/types"
import { Arrow } from "./ui/Arrow"
import { Dot } from "./ui/Dot"
import { Reveal } from "./ui/Reveal"
import { Strip } from "./ui/Strip"
import { ScrambleText } from "./ui/ScrambleText"

type Props = { site: SiteConfig; copied: boolean; copyError: boolean; onCopy: () => void }

export const ContactSection = forwardRef<HTMLElement, Props>(function ContactSection({ site, copied, copyError, onCopy }, ref) {
  const { email, linkedin, github, cv, sourceRepo } = site
  return (
    <section id="contact" ref={ref} className="osk-section osk-contact">
      <div className="osk-container">
        <Strip number="05" title="CONTACT · OPEN A CHANNEL" extra="RECEIVING TRANSMISSIONS" />
        <Reveal>
          <div className="osk-contact-heading">
            <h2><ScrambleText text={"Open a\nchannel"} accent="_" /></h2>
            <span className="osk-label">
              <Dot /> OPEN TO WORK
              <br />
              EGYPT / KSA / REMOTE
            </span>
          </div>
          <div className="osk-terminal">
            <span className="osk-label">&gt; ping osama</span>
            <div className="osk-email-row">
              <a href={`mailto:${email}`}>{email}</a>
              <button className="osk-button" onClick={onCopy}>
                {copied ? "COPIED ●" : "COPY [C]"}
              </button>
            </div>
            <span className="osk-sr" role="status">
              {copied ? "Email copied to clipboard" : copyError ? `Copy unavailable. Email ${email}.` : ""}
            </span>
            {copyError && <p className="osk-copy-help">Select the email address to copy it, or open your email app.</p>}
            <div className="osk-contact-links">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                  LINKEDIN <Arrow />
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer">
                  GITHUB <Arrow />
                </a>
              )}
              {cv && (
                <a href={cv} download="Osama-Khalifa-CV.pdf">
                  CV / PDF ↓
                </a>
              )}
              {sourceRepo && (
                <a href={sourceRepo} target="_blank" rel="noopener noreferrer">
                  SITE SOURCE <Arrow />
                </a>
              )}
              <a href={`mailto:${email}`}>
                SEND AN EMAIL <Arrow />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
})
