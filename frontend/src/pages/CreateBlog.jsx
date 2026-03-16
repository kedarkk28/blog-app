import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CATS = ['Travel','Food','Health & Fitness','Lifestyle','Business','Technology']

export default function CreateBlog() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', category: '', content: '', author: '' })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImage = e => {
    const f = e.target.files[0]
    if (f) { setImage(f); setPreview(URL.createObjectURL(f)) }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title || !form.category || !form.content || !form.author) { setError('All fields are required.'); return }
    setLoading(true); setError('')
    const fd = new FormData()
    Object.entries(form).forEach(([k,v]) => fd.append(k, v))
    if (image) fd.append('coverImage', image)
    try {
      const res = await axios.post('/api/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate(`/blog/${res.data._id}`)
    } catch { setError('Failed to publish blog. Please try again.') }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '12px 14px', color: 'var(--text)', fontSize: 14,
    outline: 'none', transition: 'border-color .2s', fontFamily: 'inherit'
  }

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700 }}>Write a New Blog</h1>
        <p style={{ color: 'var(--muted)', marginTop: 6 }}>Share your story with the world</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Title */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Blog Title *</label>
          <input style={inputStyle} placeholder="Write a compelling title…"
            value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>

        {/* Category */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Category *</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }}
            value={form.category} onChange={e => setForm({...form, category: e.target.value})}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}>
            <option value="">Select a category</option>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Cover Image */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Cover Image (JPEG/PNG)</label>
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: '2px dashed var(--border)', borderRadius: 12, minHeight: preview ? 'auto' : 140,
            cursor: 'pointer', transition: 'border-color .2s', overflow: 'hidden', background: 'var(--surface2)'
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            {preview ? (
              <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 13 }}>Click to upload cover image</div>
                <div style={{ fontSize: 11, marginTop: 4 }}>JPEG or PNG, max 5MB</div>
              </div>
            )}
            <input type="file" accept="image/jpeg,image/png" onChange={handleImage} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Content */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Content *</label>
          <textarea style={{ ...inputStyle, minHeight: 240, resize: 'vertical', lineHeight: 1.7 }}
            placeholder="Write your blog content here…"
            value={form.content} onChange={e => setForm({...form, content: e.target.value})}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>

        {/* Author */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, display: 'block' }}>Author *</label>
          <input style={inputStyle} placeholder="Your name"
            value={form.author} onChange={e => setForm({...form, author: e.target.value})}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>

        {error && <div style={{ color: '#ff6584', fontSize: 13, background: '#ff658422', padding: '10px 14px', borderRadius: 8 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{
          background: loading ? 'var(--border)' : 'var(--accent)',
          color: '#fff', border: 'none', borderRadius: 10, padding: '14px',
          fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity .2s'
        }}>
          {loading ? 'Publishing…' : 'Publish Blog'}
        </button>
      </form>
    </main>
  )
}