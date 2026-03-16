import { useNavigate } from 'react-router-dom'

const CAT_COLORS = {
  travel: '#ff6584',
  food: '#ffa94d',
  'health-fitness': '#51cf66',
  lifestyle: '#cc5de8',
  business: '#339af0',
  technology: '#6c63ff'
}

const CAT_ICONS = {
  Travel: '✈️', Food: '🍜', 'Health & Fitness': '💪',
  Lifestyle: '✨', Business: '💼', Technology: '💻'
}

export default function BlogCard({ blog, featured = false }) {
  const navigate = useNavigate()
  const slug = blog.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
  const color = CAT_COLORS[slug] || 'var(--accent)'

  return (
    <div
      onClick={() => navigate(`/blog/${blog._id}`)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform .2s, box-shadow .2s',
        ...(featured ? { gridColumn: 'span 2' } : {})
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 14px 40px ${color}22`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Cover */}
      {blog.coverImage?.contentType ? (
        <img
          src={`/api/image/${blog._id}`}
          alt={blog.title}
          style={{ width: '100%', height: featured ? 290 : 185, objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{
          width: '100%', height: featured ? 290 : 185,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 54
        }}>
          {CAT_ICONS[blog.category] || '📝'}
        </div>
      )}

      <div style={{ padding: '1rem 1.2rem 1.3rem' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 1 }}>
          {blog.category}
        </span>
        <h3 style={{
          marginTop: 7, fontSize: featured ? 20 : 16, fontWeight: 700,
          lineHeight: 1.3, color: 'var(--text)'
        }}>
          {blog.title}
        </h3>
        <p style={{
          marginTop: 8, fontSize: 13, color: 'var(--muted)', lineHeight: 1.65,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
        }}>
          {blog.content}
        </p>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: `${color}28`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color
          }}>
            {blog.author[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{blog.author}</span>
          <span style={{ fontSize: 11, color: 'var(--border)', marginLeft: 'auto' }}>
            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  )
}