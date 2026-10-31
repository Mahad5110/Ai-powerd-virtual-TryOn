import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductVisual from '../components/ProductVisual'
import { PRODUCTS, CATEGORIES, formatPrice } from '../data/products'
import { useShop } from '../context/ShopContext'

const LIGHTING_MODES = [
  { id: 'studio', label: 'Studio Warm', bg: 'radial-gradient(circle at 50% 42%, #2B2620 0%, #131211 75%)' },
  { id: 'daylight', label: 'Daylight', bg: 'radial-gradient(circle at 50% 42%, #282B2E 0%, #121314 75%)' },
  { id: 'noir', label: 'Evening Noir', bg: 'radial-gradient(circle at 50% 42%, #1E1E22 0%, #0D0D0E 78%)' },
]

export default function TryOn() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { addToCart, savedIds, toggleSaved, notify } = useShop()

  const productParam = searchParams.get('product')
  const colorParam = searchParams.get('color')

  const initialProduct = useMemo(() => {
    return PRODUCTS.find((p) => p.id === productParam) || PRODUCTS[0]
  }, [productParam])

  const [selectedProduct, setSelectedProduct] = useState(initialProduct)
  const [activeCategory, setActiveCategory] = useState(initialProduct.category)
  const [selectedColor, setSelectedColor] = useState(
    () =>
      initialProduct.colors.find((c) => c.name === colorParam) ||
      initialProduct.colors[0]
  )
  const [fitValue, setFitValue] = useState(50) // 0..100
  const [cameraMode, setCameraMode] = useState('camera') // 'camera' | 'upload'
  const [isFlipped, setIsFlipped] = useState(false)
  const [lighting, setLighting] = useState(LIGHTING_MODES[0])
  const [snapshots, setSnapshots] = useState([])

  useEffect(() => {
    if (productParam) {
      const found = PRODUCTS.find((p) => p.id === productParam)
      if (found) {
        setSelectedProduct(found)
        setActiveCategory(found.category)
        const c =
          found.colors.find((col) => col.name === colorParam) ||
          found.colors[0]
        setSelectedColor(c)
      }
    }
  }, [productParam, colorParam])

  const categoryProducts = useMemo(
    () => PRODUCTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  )

  const handleCategorySwitch = (cat) => {
    setActiveCategory(cat)
    const firstInCat = PRODUCTS.find((p) => p.category === cat)
    if (firstInCat) {
      setSelectedProduct(firstInCat)
      setSelectedColor(firstInCat.colors[0])
      setSearchParams({ product: firstInCat.id }, { replace: true })
    }
  }

  const handleProductSwitch = (prod) => {
    setSelectedProduct(prod)
    setSelectedColor(prod.colors[0])
    setSearchParams({ product: prod.id }, { replace: true })
  }

  const fitLabel =
    fitValue < 35 ? 'Snug' : fitValue > 65 ? 'Loose / Statement' : 'Regular'

  const fitResultText = useMemo(() => {
    if (fitValue < 35) {
      return `Snug Tailored Fit — High skin contact, sits securely under buttoned cuffs. (${selectedProduct.fitNote})`
    }
    if (fitValue > 65) {
      return `Relaxed Statement Fit — Generous drape and movement with bold visual presence. (${selectedProduct.fitNote})`
    }
    return `98% Optimal Proportion — Balanced atelier fit calibrated for everyday comfort. (${selectedProduct.fitNote})`
  }, [fitValue, selectedProduct])

  const handleSnapshot = () => {
    const snap = {
      id: Date.now(),
      productName: selectedProduct.name,
      color: selectedColor.name,
      fit: fitLabel,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setSnapshots((prev) => [snap, ...prev.slice(0, 2)])
    notify(`Captured AR snapshot of ${selectedProduct.name} (${selectedColor.name})`)
  }

  const categoryMeta =
    CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[1]
  const isSaved = savedIds.includes(selectedProduct.id)
  const scaleFactor = 0.85 + (fitValue / 100) * 0.32

  return (
    <div className="w">
      <Header />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 36,
          padding: '36px 56px 72px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column: Category & Piece Switcher */}
        <div
          style={{
            width: 260,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div>
            <span className="ey">Step 3 · AR Studio</span>
            <h2 className="h" style={{ fontSize: 30, marginTop: 4 }}>
              Select Category
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Watches', 'Jewelry', 'Bags', 'Shoes'].map((cat) => {
              const isOn = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySwitch(cat)}
                  className={`sel ${isOn ? 'on' : ''}`}
                  style={{
                    height: 54,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0 16px',
                  }}
                >
                  <span>{cat}</span>
                  <span style={{ fontSize: 11, opacity: 0.75 }}>8 pieces</span>
                </button>
              )
            })}
          </div>

          {/* Piece selector within active category */}
          <div
            className="ln"
            style={{
              paddingTop: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className="ey">{activeCategory} Lineup</span>
              <Link
                to={`/catalog?category=${encodeURIComponent(activeCategory)}`}
                className="lk"
                style={{ fontSize: 11 }}
              >
                Filter in Catalog →
              </Link>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                maxHeight: 340,
                overflowY: 'auto',
              }}
            >
              {categoryProducts.map((prod) => {
                const active = prod.id === selectedProduct.id
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleProductSwitch(prod)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: 2,
                      border: active
                        ? '1px solid #C9A96E'
                        : '1px solid #2B2A28',
                      background: active ? '#1F1E1C' : '#141413',
                      color: '#ECE9E2',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <div
                        style={{
                          fontSize: 10,
                          color: '#9B978D',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        {prod.brand}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {prod.name}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: active ? '#C9A96E' : '#9B978D',
                        fontWeight: 600,
                      }}
                    >
                      {formatPrice(prod.price)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Center Column: Interactive AR Camera Stage */}
        <div
          style={{
            flex: 2,
            minWidth: 440,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div
            className="ph"
            style={{
              height: 600,
              background: lighting.bg,
              transform: isFlipped ? 'scaleX(-1)' : 'none',
              transition: 'transform 0.3s ease, background 0.3s ease',
            }}
          >
            {/* Camera Framing Guides */}
            <svg
              viewBox="0 0 400 420"
              width="100%"
              height="100%"
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0 }}
              preserveAspectRatio="xMidYMid slice"
              fill="none"
              stroke="#ECE9E2"
              strokeWidth="1.2"
            >
              <path d="M40 90V50h40M320 50h40v40M360 330v40h-40M80 370H40v-40" />
              <circle
                cx="200"
                cy="210"
                r="88"
                stroke="#C9A96E"
                strokeOpacity="0.55"
                strokeDasharray="4 6"
              />
            </svg>

            {/* Scaled Live Product Overlay */}
            <div
              style={{
                transform: `scale(${scaleFactor.toFixed(2)})`,
                transition: 'transform 0.2s ease',
                zIndex: 2,
              }}
            >
              <ProductVisual
                category={selectedProduct.category}
                variant={selectedProduct.variant}
                accentHex={selectedColor.hex}
                size={220}
              />
            </div>

            <span
              className="cap"
              style={{
                left: 18,
                top: 16,
                bottom: 'auto',
                color: cameraMode === 'camera' ? '#E4572E' : '#C9A96E',
                transform: isFlipped ? 'scaleX(-1)' : 'none',
              }}
            >
              ● {cameraMode === 'camera' ? 'Live AR Camera Feed' : 'Studio Reference Mode'} ·{' '}
              {lighting.label}
            </span>

            <span
              style={{
                position: 'absolute',
                bottom: 18,
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: 14,
                color: '#ECE9E2',
                transform: isFlipped ? 'scaleX(-1)' : 'none',
              }}
            >
              {categoryMeta.frameHint} — Scale: {Math.round(scaleFactor * 100)}%
            </span>
          </div>

          {/* Camera Controls & Lighting Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`sel ${cameraMode === 'camera' ? 'on' : ''}`}
                onClick={() => setCameraMode('camera')}
              >
                Live Camera
              </button>
              <button
                type="button"
                className={`sel ${cameraMode === 'upload' ? 'on' : ''}`}
                onClick={() => setCameraMode('upload')}
              >
                Studio Photo Mode
              </button>
              <button
                type="button"
                className={`sel ${isFlipped ? 'on' : ''}`}
                onClick={() => setIsFlipped((f) => !f)}
              >
                Flip Mirror
              </button>
              <button
                type="button"
                className="sel"
                onClick={handleSnapshot}
              >
                Capture Snapshot
              </button>
            </div>

            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className="ey" style={{ fontSize: 10 }}>
                Light:
              </span>
              {LIGHTING_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`sel ${lighting.id === m.id ? 'on' : ''}`}
                  style={{ height: 36, padding: '0 12px', fontSize: 11 }}
                  onClick={() => setLighting(m)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Snapshots Strip */}
          {snapshots.length > 0 && (
            <div
              style={{
                padding: '12px 16px',
                background: '#141413',
                border: '1px solid #2B2A28',
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <span className="ey" style={{ color: '#C9A96E' }}>
                Session Snapshots:
              </span>
              {snapshots.map((s) => (
                <span key={s.id} className="mu" style={{ fontSize: 12 }}>
                  {s.productName} ({s.color}, {s.fit}) at {s.time}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Configuration, Fit Calibration & Checkout Actions */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            background: '#141413',
            border: '1px solid #2B2A28',
            padding: 28,
          }}
        >
          <div>
            <span className="ey">
              {selectedProduct.brand} · {selectedProduct.category}
            </span>
            <h1
              className="h"
              style={{ fontSize: 40, lineHeight: 1.05, marginTop: 6 }}
            >
              {selectedProduct.name}
            </h1>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: '#C9A96E' }}>
              {formatPrice(selectedProduct.price)}
            </span>
            <span className="mu" style={{ fontSize: 12 }}>
              ★ {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviews} reviews)
            </span>
          </div>

          <p className="mu" style={{ margin: 0, fontSize: 14 }}>
            {selectedProduct.description}
          </p>

          {/* Colour Finish Selector */}
          <div className="ln" style={{ paddingTop: 18 }}>
            <span className="ey">Colour Finish — {selectedColor.name}</span>
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              {selectedProduct.colors.map((c) => {
                const isSelected = c.name === selectedColor.name
                return (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(c)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      border: isSelected
                        ? '2px solid #ECE9E2'
                        : '1px solid #55524C',
                      outline: isSelected ? '2px solid #C9A96E' : 'none',
                      outlineOffset: 3,
                      background: c.hex,
                      cursor: 'pointer',
                    }}
                  />
                )
              })}
            </div>
          </div>

          {/* Fit Slider */}
          <div className="ln" style={{ paddingTop: 18 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className="ey">Fit Calibration</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#ECE9E2' }}>
                {fitLabel}
              </span>
            </div>
            <input
              type="range"
              aria-label="Fit calibration"
              min={0}
              max={100}
              value={fitValue}
              onChange={(e) => setFitValue(Number(e.target.value))}
              style={{ width: '100%', margin: '14px 0 6px' }}
            />
            <div
              className="mu"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
              }}
            >
              <span>Snug</span>
              <span>Regular</span>
              <span>Loose</span>
            </div>
          </div>

          {/* Live Fit Telemetry Result */}
          <div className="ln" style={{ paddingTop: 18 }}>
            <span className="ey" style={{ color: '#C9A96E' }}>
              AR Fit Analysis
            </span>
            <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.55 }}>
              {fitResultText}
            </p>
          </div>

          {/* Primary Actions: Add to Cart & Proceed to Checkout OR Save Look */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 6,
            }}
          >
            <button
              type="button"
              className="btn"
              onClick={() => {
                addToCart(selectedProduct, {
                  colorObj: selectedColor,
                  fit: fitLabel,
                })
                navigate('/checkout')
              }}
            >
              Add to Bag & Proceed to Checkout →
            </button>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn2"
                style={{ flex: 1, padding: '0 14px' }}
                onClick={() =>
                  addToCart(selectedProduct, {
                    colorObj: selectedColor,
                    fit: fitLabel,
                  })
                }
              >
                + Add to Bag
              </button>
              <button
                type="button"
                className="btn2"
                style={{
                  flex: 1,
                  padding: '0 14px',
                  borderColor: isSaved ? '#C9A96E' : undefined,
                  color: isSaved ? '#C9A96E' : undefined,
                }}
                onClick={() => toggleSaved(selectedProduct.id)}
              >
                {isSaved ? '♥ Look Saved' : '♡ Save Look'}
              </button>
            </div>

            <Link
              to="/catalog"
              className="lk"
              style={{ textAlign: 'center', marginTop: 8 }}
            >
              ← Return to Product Catalog & Filters
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
