import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductVisual from '../components/ProductVisual'
import { formatPrice } from '../data/products'
import { useShop } from '../context/ShopContext'

export default function Checkout() {
  const navigate = useNavigate()
  const {
    cart,
    cartSubtotal,
    updateCartQty,
    removeFromCart,
    placeOrder,
    notify,
  } = useShop()

  const [email, setEmail] = useState('elena.rostova@atelier.com')
  const [phone, setPhone] = useState('+39 02 7600 4812')
  const [fullName, setFullName] = useState('Elena Rostova')
  const [city, setCity] = useState('Milan')
  const [address, setAddress] = useState('Via Monte Napoleone 14, Suite 3B')
  const [paymentMethod, setPaymentMethod] = useState('Card')
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)

  const discount = appliedPromo ? Math.round(cartSubtotal * 0.1) : 0
  const delivery = cartSubtotal > 1000 || cartSubtotal === 0 ? 0 : 35
  const total = Math.max(0, cartSubtotal - discount + delivery)

  const handleApplyPromo = (e) => {
    e.preventDefault()
    const code = promoInput.trim().toUpperCase()
    if (code === 'WEARFIRST10' || code === 'ATELIER10') {
      setAppliedPromo(code)
      notify(`Applied ${code} — 10% privilege privilege discount`)
    } else {
      notify('Try promo code WEARFIRST10 for 10% off your order')
    }
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault()
    placeOrder({
      customer: {
        name: fullName || 'Valued Client',
        email: email || 'client@wearfirst.com',
        phone,
        city: city || 'Milan',
        address: address || 'Via Monte Napoleone 14',
      },
      paymentMethod,
      discount,
    })
    navigate('/done')
  }

  return (
    <div className="w">
      <Header />

      <form
        onSubmit={handleSubmitOrder}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 64,
          padding: '48px 56px 80px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left: Customer & Payment Steps */}
        <div style={{ flex: 2, minWidth: 440 }}>
          <div className="ey" style={{ display: 'flex', gap: 14 }}>
            <Link to="/catalog" style={{ color: '#9B978D', textDecoration: 'none' }}>
              Catalog
            </Link>
            <span>/</span>
            <Link to="/try-on" style={{ color: '#9B978D', textDecoration: 'none' }}>
              Try-On
            </Link>
            <span>/</span>
            <span style={{ color: '#C9A96E' }}>Checkout Details</span>
            <span>/</span>
            <span>Confirmation</span>
          </div>

          <h1 className="h" style={{ fontSize: 52, margin: '16px 0 12px' }}>
            Insured Express Checkout
          </h1>
          <p className="mu" style={{ margin: '0 0 24px' }}>
            Every timepiece, jewel, bag, and pair of shoes ships sealed from our
            atelier with full transit insurance and 30-day complimentary returns.
          </p>

          {/* 1. Contact */}
          <div
            className="ln"
            style={{
              padding: '28px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span className="h" style={{ fontSize: 28, color: '#C9A96E' }}>
                1
              </span>
              <b style={{ fontSize: 17 }}>Client Contact</b>
            </div>
            <div className="row">
              <label className="lb" style={{ flex: 1, minWidth: 220 }}>
                Email Address
                <input
                  className="in"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label className="lb" style={{ flex: 1, minWidth: 220 }}>
                Phone Number (Courier Updates)
                <input
                  className="in"
                  type="tel"
                  name="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 / +39 ..."
                />
              </label>
            </div>
          </div>

          {/* 2. Delivery */}
          <div
            className="ln"
            style={{
              padding: '28px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span className="h" style={{ fontSize: 28, color: '#C9A96E' }}>
                2
              </span>
              <b style={{ fontSize: 17 }}>Insured Courier Destination</b>
            </div>
            <div className="row">
              <label className="lb" style={{ flex: 1, minWidth: 220 }}>
                Full Name
                <input
                  className="in"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Recipient full name"
                />
              </label>
              <label className="lb" style={{ flex: 1, minWidth: 220 }}>
                City
                <input
                  className="in"
                  type="text"
                  name="address-level2"
                  autoComplete="address-level2"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </label>
            </div>
            <label className="lb">
              Street Address & Suite
              <input
                className="in"
                type="text"
                name="street-address"
                autoComplete="street-address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Building, street, district"
              />
            </label>
          </div>

          {/* 3. Payment */}
          <div
            className="ln"
            style={{
              padding: '28px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <span className="h" style={{ fontSize: 28, color: '#C9A96E' }}>
                3
              </span>
              <b style={{ fontSize: 17 }}>Payment Method</b>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Card', 'Cash on delivery', 'Private Wire'].map((method) => (
                <button
                  key={method}
                  type="button"
                  className={`sel ${paymentMethod === method ? 'on' : ''}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </button>
              ))}
            </div>

            {paymentMethod === 'Card' && (
              <div
                style={{
                  display: 'flex',
                  gap: 20,
                  flexWrap: 'wrap',
                  padding: 20,
                  background: '#141413',
                  border: '1px solid #2B2A28',
                }}
              >
                <label className="lb" style={{ flex: 2, minWidth: 220 }}>
                  Card Number
                  <input
                    className="in"
                    type="text"
                    defaultValue="•••• •••• •••• 4829"
                    placeholder="Card number"
                  />
                </label>
                <label className="lb" style={{ flex: 1, minWidth: 110 }}>
                  Expiry
                  <input
                    className="in"
                    type="text"
                    defaultValue="08 / 29"
                    placeholder="MM / YY"
                  />
                </label>
                <label className="lb" style={{ flex: 1, minWidth: 90 }}>
                  CVC
                  <input
                    className="in"
                    type="password"
                    defaultValue="849"
                    placeholder="CVC"
                  />
                </label>
              </div>
            )}
          </div>

          <div
            className="ln"
            style={{
              paddingTop: 28,
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button type="submit" className="btn">
              Place Order — {formatPrice(total)} →
            </button>
            <Link to="/catalog" className="lk">
              ← Continue browsing catalog
            </Link>
          </div>
        </div>

        {/* Right: Live Order Summary */}
        <aside
          style={{
            flex: 1,
            minWidth: 360,
            background: '#181817',
            border: '1px solid #2B2A28',
            borderRadius: 2,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="ey">Order Summary</span>
            <span className="mu" style={{ fontSize: 12 }}>
              {cart.reduce((s, i) => s + i.qty, 0)} pieces
            </span>
          </div>

          {cart.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <p className="mu">Your bag is currently empty.</p>
              <Link to="/catalog" className="btn2" style={{ marginTop: 8 }}>
                Explore Catalog
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.color}-${item.fit}`}
                  style={{
                    display: 'flex',
                    gap: 16,
                    alignItems: 'center',
                    paddingBottom: 16,
                    borderBottom: '1px solid #2B2A28',
                  }}
                >
                  <div
                    className="ph"
                    style={{ width: 78, height: 92, flex: 'none' }}
                  >
                    <ProductVisual
                      category={item.product.category}
                      variant={item.product.variant}
                      accentHex={item.colorHex}
                      size={56}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div className="ey" style={{ fontSize: 9 }}>
                      {item.product.brand}
                    </div>
                    <b style={{ fontSize: 15, display: 'block', marginTop: 2 }}>
                      {item.product.name}
                    </b>
                    <div className="mu" style={{ fontSize: 12, marginTop: 2 }}>
                      {item.color} · Fit: {item.fit}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => updateCartQty(idx, -1)}
                        style={{
                          width: 24,
                          height: 24,
                          background: '#141413',
                          border: '1px solid #3E3C38',
                          color: '#ECE9E2',
                          cursor: 'pointer',
                        }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(idx, 1)}
                        style={{
                          width: 24,
                          height: 24,
                          background: '#141413',
                          border: '1px solid #3E3C38',
                          color: '#ECE9E2',
                          cursor: 'pointer',
                        }}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(idx)}
                        className="lk"
                        style={{ fontSize: 11, marginLeft: 6, color: '#9B978D' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <span style={{ fontWeight: 700 }}>
                    {formatPrice(item.product.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Promo Code */}
          <div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="in"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo code (try WEARFIRST10)"
                aria-label="Promo code"
              />
              <button
                type="button"
                className="btn2"
                style={{ height: 48, padding: '0 20px' }}
                onClick={handleApplyPromo}
              >
                Apply
              </button>
            </div>
            {appliedPromo && (
              <div
                style={{
                  fontSize: 12,
                  color: '#C9A96E',
                  marginTop: 6,
                }}
              >
                ✓ Code {appliedPromo} active (−10%)
              </div>
            )}
          </div>

          <div
            className="ln"
            style={{
              paddingTop: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="mu">Subtotal</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>
            {discount > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#C9A96E',
                }}
              >
                <span>Atelier Privilege (10%)</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="mu">Insured Express Delivery</span>
              <span>{delivery === 0 ? 'Complimentary' : formatPrice(delivery)}</span>
            </div>
          </div>

          <div
            className="ln"
            style={{
              paddingTop: 18,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            <span>Total</span>
            <span style={{ color: '#C9A96E' }}>{formatPrice(total)}</span>
          </div>
        </aside>
      </form>

      <Footer />
    </div>
  )
}
