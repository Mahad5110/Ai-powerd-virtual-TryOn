import React from 'react'
import { Link } from 'react-router-dom'

const FOOTER_COLS = [
  [
    'Collections',
    [
      { label: 'All Archive Pieces', to: '/catalog' },
      { label: 'Watches', to: '/catalog?category=Watches' },
      { label: 'Fine Jewelry', to: '/catalog?category=Jewelry' },
      { label: 'Leather Bags', to: '/catalog?category=Bags' },
      { label: 'Hand-Welted Shoes', to: '/catalog?category=Shoes' },
    ],
  ],
  [
    'Catalog & Discovery',
    [
      { label: 'Newest Releases', to: '/catalog?sort=newest' },
      { label: 'Under $1,500 Edit', to: '/catalog?maxPrice=1500' },
      { label: 'Virtual Try-On Studio', to: '/try-on' },
      { label: 'Saved Try-On Looks', to: '/catalog?saved=1' },
    ],
  ],
  [
    'Client Services',
    [
      { label: 'Checkout & Bag', to: '/checkout' },
      { label: 'Order Status', to: '/done' },
      { label: 'Member Sign In', to: '/' },
      { label: 'Create Account', to: '/signup' },
    ],
  ],
]

export default function Footer() {
  return (
    <footer className="sec ln" style={{ gap: 40, paddingBottom: 48 }}>
      <div className="row" style={{ gap: 48 }}>
        <div style={{ flex: 2, minWidth: 260 }}>
          <span className="wm" style={{ fontSize: 22 }}>
            WEARFIRST
          </span>
          <p className="mu" style={{ maxWidth: 340, marginTop: 14 }}>
            Architectural timepieces, fine jewelry, leather goods, and footwear.
            Preview every piece on camera before it becomes yours.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
            <span className="ey">Geneva</span>
            <span className="ey">·</span>
            <span className="ey">Paris</span>
            <span className="ey">·</span>
            <span className="ey">Milan</span>
            <span className="ey">·</span>
            <span className="ey">Tokyo</span>
          </div>
        </div>

        {FOOTER_COLS.map(([title, links]) => (
          <div
            key={title}
            style={{
              flex: 1,
              minWidth: 160,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <span className="ey">{title}</span>
            {links.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                style={{
                  color: '#ECE9E2',
                  textDecoration: 'none',
                  fontSize: 14,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div
        className="ln"
        style={{
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <span className="mu" style={{ fontSize: 12 }}>
          © {new Date().getFullYear()} WearFirst Atelier. All rights reserved.
        </span>
        <span className="mu" style={{ fontSize: 12 }}>
          Insured Global Courier · 30-Day Complimentary Returns · AR Fit Calibrated
        </span>
      </div>
    </footer>
  )
}
