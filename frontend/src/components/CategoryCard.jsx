import { useNavigate } from 'react-router-dom'

const CATS = [
  { name: 'Travel', icon: '✈️', color: '#ff6584', slug: 'travel', desc: 'Adventures around the globe' },
  { name: 'Food', icon: '🍜', color: '#ffa94d', slug: 'food', desc: 'Recipes and culinary stories' },
  { name: 'Health & Fitness', icon: '💪', color: '#51cf66', slug: 'health-fitness', desc: 'Wellness and workout guides' },
  { name: 'Lifestyle', icon: '✨', color: '#cc5de8', slug: 'lifestyle', desc: 'Living your best life' },
  { name: 'Business', icon: '💼', color: '#339af0', slug: 'business', desc: 'Strategy and entrepreneurship' },
  { name: 'Technology', icon: '💻', color: '#6c63ff', slug: 'technology', desc: 'Tech news and insights' },
]

export default function CategoryCard({ cat }) {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/category/${cat.slug}`)}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '1.4rem', cursor: 'pointer',
        transition: 'all .2s', textAlign: 'center'
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
    >
      <div style={{ fontSize: 36, marginBottom: 10 }}>{cat.icon}</div>
      <div style={{ fontWeight: 700, fontSize: 15 }}>{cat.name}</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{cat.desc}</div>
    </div>
  )
}

export { CATS }