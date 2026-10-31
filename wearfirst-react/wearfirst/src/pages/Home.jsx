import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductVisual from '../components/ProductVisual'
import { PRODUCTS, CATEGORIES, formatPrice } from '../data/products'
import { useShop } from '../context/ShopContext'

const FEATURED_HERO_PRODUCTS = [
  PRODUCTS[0],  // Calibre 09 Monolith Automatic (Watches)
  PRODUCTS[8],  // Celeste Emerald-Cut Signet (Jewelry)
  PRODUCTS[16], // L’Arche Structured Top-Handle (Bags)
  PRODUCTS[24], // Corso Hand-Welted Penny Loafer (Shoes)
]

const CATEGORY_CARDS = [
  {
    id: 'Watches',
    subtitle: 'Mechanical & Dress Calibres',
    fromPrice: 740,
    count: 8,
    accentHex: '#D4D4D8',
  },
  {
    id: 'Jewelry',
    subtitle: '18k Gold & Platinum Castings',
    fromPrice: 540,
    count: 8,
    accentHex: '#B8934A',
  },
  {
    id: 'Bags',
    subtitle: 'Box Calfskin & Bridle Leather',
    fromPrice: 890,
    count: 8,
    accentHex: '#8A5438',
  },
  {
    id: 'Shoes',
    subtitle: 'Hand-Welted Milanese Craft',
    fromPrice: 520,
    count: 8,
    accentHex: '#E5E0D5',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const { addToCart } = useShop()
  const [heroIndex, setHeroIndex] = useState(0)
  const activeHeroProduct = FEATURED_HERO_PRODUCTS[heroIndex]

  return (
    <div className="w">
      <Header />

      {/* Hero Section */}
      <section style={{ display: 'flex', flexWrap: 'wrap', minHeight: 680 }}>
        <div
          style={{
            flex: 1,
            minWidth: 420,
            padding: '72px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 26,
            alignItems: 'flex-start',
          }}
        >
          <span className="ey" style={{ color: '#C9A96E' }}>
            Step 1 · Discover & Preview in Real Time
          </span>
          <h1 className="h" style={{ fontSize: 78, lineHeight: 0.98 }}>
            See how it looks on you before it is yours.
          </h1>
          <p
            className="mu"
            style={{ margin: 0, maxWidth: 480, fontSize: 17 }}
          >
            Browse 32 architectural pieces across four categories, filter by
            atelier and price, and launch our live AR camera studio to check
            proportion and fit before you order.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: 6,
            }}
          >
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/catalog')}
            >
              Explore Product Catalog
            </button>
            <button
              type="button"
              className="btn2"
              onClick={() =>
                navigate(`/try-on?product=${activeHeroProduct.id}`)
              }
            >
              Start a Try-On
            </button>
          </div>

          {/* Interactive Hero Piece Selector */}
          <div
            className="ln"
            style={{
              width: '100%',
              paddingTop: 22,
              marginTop: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <span className="ey" style={{ fontSize: 10 }}>
              Previewing on stage: {activeHeroProduct.brand} —{' '}
              {activeHeroProduct.name} ({formatPrice(activeHeroProduct.price)})
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FEATURED_HERO_PRODUCTS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  className={`sel ${idx === heroIndex ? 'on' : ''}`}
                  style={{ height: 36, padding: '0 14px', fontSize: 12 }}
                  onClick={() => setHeroIndex(idx)}
                >
                  {item.category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 420,
            padding: '24px 56px 24px 0',
            display: 'flex',
          }}
        >
          <div
            className="ph"
            style={{
              flex: 1,
              minHeight: 620,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              padding: 36,
            }}
          >
            <span
              className="badge-pill new"
              style={{ top: 20, left: 20 }}
            >
              AR Calibrated · {activeHeroProduct.category}
            </span>

            <ProductVisual
              category={activeHeroProduct.category}
              variant={activeHeroProduct.variant}
              accentHex={activeHeroProduct.colors[0].hex}
              size={220}
            />

            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                right: 24,
                padding: '18px 22px',
                background: 'rgba(15, 15, 14, 0.88)',
                border: '1px solid #2B2A28',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div className="ey" style={{ fontSize: 10 }}>
                  {activeHeroProduct.brand}
                </div>
                <div
                  className="h"
                  style={{ fontSize: 24, marginTop: 2 }}
                >
                  {activeHeroProduct.name}
                </div>
                <div className="mu" style={{ fontSize: 12 }}>
                  {activeHeroProduct.fitNote}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 17 }}>
                  {formatPrice(activeHeroProduct.price)}
                </span>
                <button
                  type="button"
                  className="btn"
                  style={{ height: 38, padding: '0 16px', fontSize: 11 }}
                  onClick={() =>
                    navigate(`/try-on?product=${activeHeroProduct.id}`)
                  }
                >
                  Try On →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category — Links directly to Multi-Category Catalog Views */}
      <section className="sec ln">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <span className="ey">Multi-Category Archive</span>
            <h2 className="h" style={{ fontSize: 46, marginTop: 6 }}>
              Shop by category
            </h2>
          </div>
          <Link to="/catalog" className="lk">
            Open full catalog & filters (32 pieces) →
          </Link>
        </div>

        <div className="row">
          {CATEGORY_CARDS.map((cat) => (
            <div
              key={cat.id}
              onClick={() =>
                navigate(`/catalog?category=${encodeURIComponent(cat.id)}`)
              }
              style={{
                flex: 1,
                minWidth: 230,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                cursor: 'pointer',
              }}
            >
              <div
                className="ph"
                style={{ height: 360, flex: 1, minWidth: 200 }}
              >
                <span className="badge-pill">{cat.count} Pieces</span>
                <ProductVisual
                  category={cat.id}
                  variant={1}
                  accentHex={cat.accentHex}
                  size={125}
                />
                <span className="cap">
                  From {formatPrice(cat.fromPrice)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <div>
                  <b style={{ fontSize: 18 }}>{cat.id}</b>
                  <div className="mu" style={{ fontSize: 12 }}>
                    {cat.subtitle}
                  </div>
                </div>
                <span className="lk">Browse →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — Seamless Sequence */}
      <section className="sec ln heavy-section-deferred">
        <div className="row" style={{ gap: 72, alignItems: 'center' }}>
          <div
            className="ph"
            style={{ flex: 1, minWidth: 380, height: 520 }}
          >
            <svg
              viewBox="0 0 400 420"
              width="100%"
              height="100%"
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0 }}
              preserveAspectRatio="xMidYMid slice"
              fill="none"
              stroke="#ECE9E2"
              strokeWidth="1.5"
            >
              <path d="M40 90V50h40M320 50h40v40M360 330v40h-40M80 370H40v-40" />
              <circle
                cx="200"
                cy="210"
                r="76"
                stroke="#C9A96E"
                strokeDasharray="4 6"
              />
            </svg>
            <ProductVisual
              category="Watches"
              variant={1}
              accentHex="#C9A96E"
              size={145}
            />
            <span
              className="cap"
              style={{ left: 'auto', right: 14, color: '#C9A96E' }}
            >
              Live camera · 1:1 scale calibration
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 380 }}>
            <span className="ey">Seamless Sequence</span>
            <h2
              className="h"
              style={{ fontSize: 52, margin: '14px 0 28px', lineHeight: 1.05 }}
            >
              Three steps, about a minute.
            </h2>

            <div
              className="ln"
              style={{ display: 'flex', gap: 28, padding: '24px 0' }}
            >
              <span
                className="h"
                style={{ fontSize: 34, width: 48, color: '#C9A96E' }}
              >
                1
              </span>
              <div>
                <b style={{ fontSize: 17 }}>
                  Filter & compare in the Archive Catalog
                </b>
                <div className="mu" style={{ marginTop: 4 }}>
                  Search in real time, narrow by price range and atelier brand,
                  and sort by newest arrivals or price.
                </div>
              </div>
            </div>

            <div
              className="ln"
              style={{ display: 'flex', gap: 28, padding: '24px 0' }}
            >
              <span
                className="h"
                style={{ fontSize: 34, width: 48, color: '#C9A96E' }}
              >
                2
              </span>
              <div>
                <b style={{ fontSize: 17 }}>
                  Try it on in the AR Studio
                </b>
                <div className="mu" style={{ marginTop: 4 }}>
                  Use your live camera or studio presets. Switch metal/leather
                  finishes and calibrate wrist, finger, or foot fit.
                </div>
              </div>
            </div>

            <div
              className="ln"
              style={{ display: 'flex', gap: 28, padding: '24px 0' }}
            >
              <span
                className="h"
                style={{ fontSize: 34, width: 48, color: '#C9A96E' }}
              >
                3
              </span>
              <div>
                <b style={{ fontSize: 17 }}>Order when you are sure</b>
                <div className="mu" style={{ marginTop: 4 }}>
                  Add your calibrated configuration directly to your bag and
                  complete insured express checkout.
                </div>
              </div>
            </div>
            <div className="ln" style={{ paddingTop: 24 }}>
              <button
                type="button"
                className="btn"
                onClick={() => navigate('/catalog')}
              >
                Begin Step 1: Browse Catalog →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular to Try On — Real Products with Direct Try-On & Add to Bag */}
      <section className="sec ln heavy-section-deferred">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <span className="ey">Most Requested in AR Studio</span>
            <h2 className="h" style={{ fontSize: 44, marginTop: 6 }}>
              Popular to try on
            </h2>
          </div>
          <Link to="/catalog?sort=popular" className="lk">
            View all popular pieces →
          </Link>
        </div>

        <div className="row">
          {FEATURED_HERO_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="product-card"
              style={{
                flex: 1,
                minWidth: 240,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                className="ph"
                style={{
                  height: 320,
                  border: 'none',
                  borderBottom: '1px solid #2B2A28',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/try-on?product=${product.id}`)}
              >
                {product.badge && (
                  <span className="badge-pill new">{product.badge}</span>
                )}
                <ProductVisual
                  category={product.category}
                  variant={product.variant}
                  accentHex={product.colors[0].hex}
                  size={125}
                />
                <span className="cap">
                  {product.brand} · {product.category}
                </span>
              </div>

              <div
                style={{
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  flex: 1,
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span className="ey" style={{ fontSize: 10 }}>
                    {product.brand}
                  </span>
                  <h3 className="h" style={{ fontSize: 24, marginTop: 4 }}>
                    {product.name}
                  </h3>
                  <p className="mu" style={{ fontSize: 12, margin: '4px 0 0' }}>
                    {product.material}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 12,
                    borderTop: '1px solid #22211F',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 16 }}>
                    {formatPrice(product.price)}
                  </span>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="lk"
                      onClick={() => addToCart(product)}
                    >
                      + Bag
                    </button>
                    <Link
                      to={`/try-on?product=${product.id}`}
                      className="lk"
                      style={{ color: '#C9A96E' }}
                    >
                      Try on →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
