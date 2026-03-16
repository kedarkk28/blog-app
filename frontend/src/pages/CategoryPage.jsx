import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import BlogCard from '../components/BlogCard'
import { CATS } from '../components/CategoryCard'

export default function CategoryPage() {
  const { slug } = useParams()
  const cat = CATS.find(c => c.slug === slug)
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/blogs?category=${cat?.name}`).then(r => { setBlogs(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [slug])

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <span style={{ fontSize: 48 }}>{cat?.icon}</span>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700 }}>{cat?.name}</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4 }}>{cat?.desc}</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading…</div>
      ) : blogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
          No blogs in this category yet. <a href="/create" style={{ color: 'var(--accent)' }}>Write one!</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
          {blogs.map(b => <BlogCard key={b._id} blog={b} />)}
        </div>
      )}
    </main>
  )
}