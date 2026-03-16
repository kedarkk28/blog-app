import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const CAT_COLORS = {
  travel: '#ff6584', food: '#ffa94d', 'health-fitness': '#51cf66',
  lifestyle: '#cc5de8', business: '#339af0', technology: '#6c63ff'
}
const CAT_ICONS = {
  Travel: '✈️', Food: '🍜', 'Health & Fitness': '💪',
  Lifestyle: '✨', Business: '💼', Technology: '💻'
}

export default function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    axios.get(`/api/blogs/${id}`)
      .then(r => setBlog(r.data))
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted)' }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>😕</div>
      Blog not found.{' '}
      <a href="/" style={{ color: 'var(--accent)' }}>Back to home</a>
    </div>
  )

  if (!blog) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted)' }}>Loading…</div>
  )

  const slug = blog.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
  const color = CAT_COLORS[slug] || 'var(--accent)'
  const icon  = CAT_ICONS[blog.category] || '📝'
  const wordCount = blog.content.trim().split(/\s+/).length
  const readTime  = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>

      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none', border: '1px solid var(--border)',
          color: 'var(--muted)', borderRadius: 8, padding: '7px 16px',
          cursor: 'pointer', marginBottom: 28, fontSize: 13,
          transition: 'border-color .2s, color .2s'
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text)'; e.currentTarget.style.color = 'var(--text)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
      >
        ← Back
      </button>

      {/* Cover Image */}
      {blog.coverImage?.contentType ? (
        <img
          src={`/api/image/${blog._id}`}
          alt={blog.title}
          style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: 32, display: 'block' }}
        />
      ) : (
        <div style={{
          width: '100%', height: 220, background: `${color}15`,
          borderRadius: 'var(--radius)', marginBottom: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64
        }}>
          {icon}
        </div>
      )}

      {/* Category badge */}
      <a
        href={`/category/${slug}`}
        style={{
          display: 'inline-block', fontSize: 11, fontWeight: 700,
          color, textTransform: 'uppercase', letterSpacing: 1.2,
          background: `${color}18`, padding: '4px 12px', borderRadius: 20
        }}
      >
        {blog.category}
      </a>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(1.7rem, 4vw, 2.5rem)',
        fontWeight: 700, lineHeight: 1.2, margin: '14px 0 20px'
      }}>
        {blog.title}
      </h1>

      {/* Author bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        paddingBottom: 28, marginBottom: 32,
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: `${color}28`, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 16, color
        }}>
          {blog.author[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{blog.author}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
            })}
            {' · '}
            {readTime} min read
          </div>
        </div>
      </div>

      {/* Content */}
      <article style={{
        fontSize: 16, lineHeight: 1.9,
        color: '#cbcbd8',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {blog.content}
      </article>

      {/* Footer */}
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 14 }}>Enjoyed this post? Read more like it.</p>
        <a
          href={`/category/${slug}`}
          style={{
            display: 'inline-block',
            background: `${color}22`, color,
            padding: '9px 22px', borderRadius: 8,
            fontWeight: 600, fontSize: 13
          }}
        >
          More {blog.category} posts →
        </a>
      </div>
    </main>
  )
}