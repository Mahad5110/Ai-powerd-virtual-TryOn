import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductVisual from '../components/ProductVisual'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('elena.rostova@atelier.com')
  const [password, setPassword] = useState('••••••••••••')

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/home')
  }

  return (
    <div className="w">
      <div
        style={{
          display: 'flex',
          flex: 1,
          minHeight: '100vh',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: 380, padding: 24, display: 'flex' }}>
          <div
            className="ph"
            style={{
              flex: 1,
              minHeight: 680,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              padding: 40,
            }}
          >
            <span className="badge-pill new" style={{ top: 24, left: 24 }}>
              WearFirst Private Archive
            </span>
            <ProductVisual
              category="Watches"
              variant={1}
              accentHex="#C9A96E"
              size={200}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 28,
                left: 28,
                right: 28,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}
            >
              <div>
                <div className="ey">Featured Timepiece</div>
                <div className="h" style={{ fontSize: 28, marginTop: 4 }}>
                  Calibre 09 Monolith Automatic
                </div>
              </div>
              <Link to="/catalog" className="lk" style={{ color: '#C9A96E' }}>
                Skip to Catalog →
              </Link>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            width: 560,
            maxWidth: '100%',
            padding: '56px 72px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 22,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="wm" style={{ fontSize: 22 }}>
              WEARFIRST
            </span>
            <Link to="/catalog" className="lk" style={{ fontSize: 12 }}>
              Browse as Guest →
            </Link>
          </div>

          <div style={{ height: 8 }} />
          <span className="ey">Client Portal</span>
          <h1 className="h" style={{ fontSize: 48 }}>
            Log in
          </h1>
          <p className="mu" style={{ margin: 0 }}>
            Welcome back. Your saved AR try-on looks and curated archive pieces
            are waiting.
          </p>

          <label className="lb">
            Email
            <input
              className="in"
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="lb">
            Password
            <input
              className="in"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </label>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label
              className="mu fallback-check"
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                fontSize: 13,
              }}
            >
              <input
                type="checkbox"
                className="visually-hidden"
                defaultChecked
                style={{ margin: 0 }}
              />
              <span>Keep me logged in</span>
            </label>
            <Link to="/home" className="lk">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn">
            Enter WearFirst →
          </button>
          <button
            type="button"
            className="btn2"
            onClick={() => navigate('/catalog')}
          >
            Explore Product Catalog Directly
          </button>

          <p className="mu" style={{ margin: 0, fontSize: 13 }}>
            No account yet?{' '}
            <Link to="/signup" className="lk">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
