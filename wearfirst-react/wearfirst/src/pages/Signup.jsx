import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductVisual from '../components/ProductVisual'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
              minHeight: 720,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              padding: 40,
            }}
          >
            <span className="badge-pill new" style={{ top: 24, left: 24 }}>
              Client Membership
            </span>
            <ProductVisual
              category="Jewelry"
              variant={1}
              accentHex="#B8934A"
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
                <div className="ey">Lumière Atelier</div>
                <div className="h" style={{ fontSize: 28, marginTop: 4 }}>
                  Celeste Emerald-Cut Signet
                </div>
              </div>
              <Link to="/catalog" className="lk" style={{ color: '#C9A96E' }}>
                Browse Catalog →
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
          <span className="wm" style={{ fontSize: 22 }}>
            WEARFIRST
          </span>
          <div style={{ height: 8 }} />
          <span className="ey">New Client Profile</span>
          <h1 className="h" style={{ fontSize: 46 }}>
            Create an account
          </h1>
          <p className="mu" style={{ margin: 0 }}>
            Save your AR camera try-ons, filter preferences, and check out
            faster.
          </p>

          <label className="lb">
            Full name
            <input
              className="in"
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </label>

          <label className="lb">
            Email
            <input
              className="in"
              type="email"
              name="email"
              autoComplete="email"
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
              name="new-password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />
          </label>

          <label
            className="mu fallback-check"
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              fontSize: 13,
            }}
          >
            <input
              type="checkbox"
              className="visually-hidden"
              defaultChecked
              style={{ margin: '3px 0 0' }}
            />
            <span>
              I agree to the Terms and Privacy Policy, and allow camera access
              for virtual try-on.
            </span>
          </label>

          <button type="submit" className="btn">
            Create account →
          </button>

          <p className="mu" style={{ margin: 0, fontSize: 13 }}>
            Already registered?{' '}
            <Link to="/" className="lk">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
