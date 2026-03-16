import { useEffect, useState } from 'react'
import axios from 'axios'
import CategoryCard, { CATS } from '../components/CategoryCard'
import BlogCard from '../components/BlogCard'

export default function Home() {
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/blogs?limit=7').then(r => { setRecent(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '3rem 0 3.5rem' }}>
        <div style={{ display: 'inline-block', background: 'var(--accent)22', color: 'var(--accent)', fontSize: 12, fontWeight: 700, letterSpacing: 2, padding: '4px 14px', borderRadius: 20, marginBottom: 16 }}>DISCOVER · READ · SHARE</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>
          Stories that <span style={{ color: 'var(--accent)' }}>Inspire</span>,<br />Ideas that <span style={{ color: '#ff6584' }}>Matter</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
          Explore curated blogs across travel, food, health, lifestyle, business, and technology.
        </p>
      </section>

      {/* Categories */}
      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Browse by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14 }}>
          {CATS.map(cat => <CategoryCard key={cat.slug} cat={cat} />)}
        </div>
      </section>

      {/* Recent */}
      <section style={{ marginTop: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Recently Added</h2>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading blogs…</div>
        ) : recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
            No blogs yet. <a href="/create" style={{ color: 'var(--accent)' }}>Be the first to write one!</a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {recent.map((blog, i) => <BlogCard key={blog._id} blog={blog} featured={i === 0} />)}
          </div>
        )}
      </section>
    </main>
  )
}