
import React, { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useShop } from '../context/ShopContext'

const NAV_CATEGORIES = ['Watches', 'Jewelry', 'Bags', 'Shoes']

const JOURNEY_STEPS = [
  { step: 1, label: 'Discover', path: '/home' },
  { step: 2, label: 'Catalog & Filter', path: '/catalog' },
  { step: 3, label: 'Virtual Try-On', path: '/try-on' },
  { step: 4, label: 'Checkout', path: '/checkout' },
  { step: 5, label: 'Confirmed', path: '/done' },
]

export default function Header() {
  const { cartCount, savedIds } = useShop()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || ''
  const [quickQuery, setQuickQuery] = useState(searchParams.get('q') || '')

  const currentStepIndex = JOURNEY_STEPS.findIndex((s) =>
    location.pathname.startsWith(s.path)
  )

  const handleQuickSearch = (e) => {
    e.preventDefault()
    const trimmed = quickQuery.trim()
    if (trimmed) {
      navigate(`/catalog?q=${encodeURIComponent(trimmed)}`)
    } else {
      navigate('/catalog')
    }
  }

  return (
    <>
      <div className="bar">
        <span>Complimentary insured express delivery on orders over $1,000</span>
        <span style={{ color: '#ECE9E2', fontWeight: 600 }}>
          AR Virtual Try-On Studio — Inspect proportion & fit before you order
        </span>
        <Link
          to="/catalog?saved=1"
          style={{ color: '#C9A96E', textDecoration: 'none', fontWeight: 600 }}
        >
          Saved Looks ({savedIds.length})
        </Link>
      </div>

      <header className="top">
        <nav
          aria-label="Primary categories"
          style={{ flex: 1, display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Link
            to="/catalog"
            className={
              location.pathname === '/catalog' && !activeCategory ? 'active-nav' : ''
            }
          >
            All Pieces
          </Link>
          {NAV_CATEGORIES.map((c) => {
            const isActive =
              location.pathname === '/catalog' && activeCategory === c
            return (
              <Link
                key={c}
                to={`/catalog?category=${encodeURIComponent(c)}`}
                className={isActive ? 'active-nav' : ''}
              >
                {c}
              </Link>
            )
          })}
        </nav>

        <Link
          to="/home"
          className="wm"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          WEARFIRST
        </Link>

        <nav
          aria-label="Utility navigation"
          style={{
            flex: 1,
            display: 'flex',
            gap: 20,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {location.pathname !== '/catalog' && (
            <form
              onSubmit={handleQuickSearch}
              role="search"
              style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
            >
              <input
                type="search"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search catalog..."
                aria-label="Quick search catalog"
                style={{
                  height: 34,
                  width: 165,
                  background: '#181817',
                  border: '1px solid #2B2A28',
                  borderRadius: 2,
                  color: '#ECE9E2',
                  padding: '0 12px',
                  fontSize: 12,
                  fontFamily: 'inherit',
                }}
              />
            </form>
          )}
          <Link
            to="/try-on"
            className={location.pathname === '/try-on' ? 'active-nav' : ''}
          >
            Try-On Studio
          </Link>
          <Link
            to="/"
            className={location.pathname === '/' ? 'active-nav' : ''}
          >
            Account
          </Link>
          <Link
            to="/checkout"
            className={location.pathname === '/checkout' ? 'active-nav' : ''}
            style={{
              padding: '7px 14px',
              border: '1px solid #3E3C38',
              borderRadius: 2,
              background: '#181817',
            }}
          >
            Bag ({cartCount})
          </Link>
        </nav>
      </header>

      {/* Seamless Sequence Flow Bar */}
      <div className="seq-bar" aria-label="Shopping journey sequence">
        <div className="seq-steps">
          {JOURNEY_STEPS.map((item, idx) => {
            const isCurrent = idx === currentStepIndex
            const isDone = currentStepIndex > idx
            return (
              <React.Fragment key={item.path}>
                <Link
                  to={item.path}
                  className={`seq-step ${isCurrent ? 'current' : isDone ? 'done' : ''}`}
                >
                  <span className="seq-num">{isDone ? '✓' : item.step}</span>
                  <span>{item.label}</span>
                </Link>
                {idx < JOURNEY_STEPS.length - 1 && (
                  <span style={{ color: '#3E3C38', fontSize: 11 }}>→</span>
                )}
              </React.Fragment>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span className="ey" style={{ fontSize: 10 }}>
            32 Curated Pieces · 8 Ateliers
          </span>
        </div>
      </div>
    </>
  )
}
