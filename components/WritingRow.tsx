import type { Post } from "@/lib/types"

/** One writing entry. Plain text until a real post URL exists. */
export function WritingRow({ post }: { post: Post }) {
  const content = (
    <>
      <span className="note-number">{post.number}</span>
      <span className="note-title">{post.title}</span>
      <span className="note-topic">{post.topic}</span>
      {post.readTime && <span className="note-read">{post.readTime}</span>}
      {post.url && (
        <span className="note-arrow" aria-hidden="true">
          ↗
        </span>
      )}
    </>
  )
  return (
    <div className={`osk-note ${post.readTime ? "osk-note-timed" : ""}`}>
      {post.url ? (
        <a href={post.url} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <div>{content}</div>
      )}
    </div>
  )
}
