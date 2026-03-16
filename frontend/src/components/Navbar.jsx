import { Link, useNavigate } from 'react-router-dom'

const CATEGORIES = ['Travel','Food','Health & Fitness','Lifestyle','Business','Technology']

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <nav style={{
      background: 'rgba(15,15,19,0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
      padding: '0 2rem'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 32 }}>
        <Link to="/" style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>
          BlogSphere
        </Link>
        <div style={{ display: 'flex', gap: 20, flex: 1, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <Link key={cat}
              to={`/category/${cat.toLowerCase().replace(/ & /g,'-').replace(/ /g,'-')}`}
              style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap', transition: 'color .2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}
            >
              {cat}
            </Link>
          ))}
        </div>
        <button onClick={() => navigate('/create')} style={{
          background: 'var(--accent)', color: '#fff', border: 'none',
          borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600
        }}>
          + Write
        </button>
      </div>
    </nav>
  )
}