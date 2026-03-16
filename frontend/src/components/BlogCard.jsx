import { useNavigate } from 'react-router-dom'

const CAT_COLORS = {
  travel: '#ff6584', food: '#ffa94d', 'health-fitness': '#51cf66',
  lifestyle: '#cc5de8', business: '#339af0', technology: '#6c63ff'
}

export default function BlogCard({ blog, featured = false }) {
  const navigate = useNavigate()
  const slug = blog.category.toLowerCase().replace(/ & /g,'-').replace(/ /g,'-')
  const color = CAT_COLORS[slug] || 'var(--accent)'

  return (
    <div onClick={() => navigate(`/blog/${blog._id}`)} style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform .2s, box-shadow .2s',
      ...(featured ? { gridColumn: 'span 2' } : {})
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${color}22` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {blog.coverImage && (
        <img src={`/api/image/${blog._id}`} alt={blog.title}
          style={{ width: '100%', height: featured ? 280 : 180, objectFit: 'cover' }} />
      )}
      {!blog.coverImage && (
        <div style={{ width: '100%', height: featured ? 280 : 180, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 48 }}>{blog.category === 'Travel' ? '✈️' : blog.category === 'Food' ? '🍜' : blog.category === 'Health & Fitness' ? '💪' : blog.category === 'Lifestyle' ? '✨' : blog.category === 'Business' ? '💼' : '💻'}</span>
        </div>
      )}
      <div style={{ padding: '1rem 1.2rem 1.2rem' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: 1 }}>{blog.category}</span>
        <h3 style={{ marginTop: 6, fontSize: featured ? 20 : 16, fontWeight: 700, lineHeight: 1.3, color: 'var(--text)' }}>{blog.title}</h3>
        <p style={{ marginTop: 8, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {blog.content}
        </p>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color }}>
            {blog.author[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{blog.author}</span>
          <span style={{ fontSize: 12, color: 'var(--border)', marginLeft: 'auto' }}>
            {new Date(blog.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
          </span>
        </div>
      </div>
    </div>
  )
}