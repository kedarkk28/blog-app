import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const CAT_COLORS = {
  travel:'#ff6584',food:'#ffa94d','health-fitness':'#51cf66',lifestyle:'#cc5de8',business:'#339af0',technology:'#6c63ff'
}

export default function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    axios.get(`/api/blogs/${id}`).then(r => setBlog(r.data))
  }, [id])

  if (!blog) return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted)' }}>Loading…</div>

  const slug = blog.category.toLowerCase().replace(/ & /g,'-').replace(/ /g,'-')
  const color = CAT_COLORS[slug] || 'var(--accent)'

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', marginBottom: 24, fontSize: 13 }}>
        ← Back
      </button>

      {blog.coverImage && (
        <img src={`/api/image/${blog._id}`} alt={blog.title}
          style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: 28 }} />
      )}

      <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 1 }}>{blog.category}</span>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, lineHeight: 1.2, margin: '10px 0 16px' }}>
        {blog.title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color }}>
          {blog.author[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{blog.author}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            {new Date(blog.createdAt).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 16, lineHeight: 1.9, color: '#ccccd8', whiteSpace: 'pre-wrap' }}>
        {blog.content}
      </div>
    </main>
  )
}