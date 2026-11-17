import { forwardRef } from "react"
import type { Post } from "@/lib/types"
import { Reveal } from "./ui/Reveal"
import { Strip } from "./ui/Strip"
import { WritingRow } from "./WritingRow"

export const WritingSection = forwardRef<HTMLElement, { posts: Post[] }>(function WritingSection({ posts }, ref) {
  return (
    <section id="writing" ref={ref} className="osk-section osk-light">
      <div className="osk-container">
        <Strip number="04" title="WRITING · NOTES ON BACKEND DESIGN" extra="OBSERVATIONS FROM PRODUCTION" />
        <Reveal className="osk-writing-intro">
          <h2>
            Notes from the layer
            <br />
            nobody watches<span className="osk-heading-dot">.</span>
          </h2>
        </Reveal>
        <div className="osk-writing-slot">
          {posts.map((post) => (
            <WritingRow key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
})
