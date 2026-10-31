import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductVisual from '../components/ProductVisual'
import { formatPrice } from '../data/products'
import { useShop } from '../context/ShopContext'

const TRACKING_STEPS = [
  {
    title: 'Order confirmed & allocated',
    detail: 'Piece serial numbers reserved in Geneva & Milan vaults.',
  },
  {
    title: 'Quality & AR fit inspection',
    detail: 'Calibrated to your selected finish and proportion profile.',
  },
  {
    title: 'Dispatched via insured air courier',
    detail: 'Signature-required armored parcel with live GPS telemetry.',
  },
  {
    title: 'Delivered to client address',
    detail: 'Includes 30-day complimentary return or exchange seal.',
  },
]

export default function Done() {
  const navigate = useNavigate()
  const { lastOrder } = useShop()
  const [activeStage, setActiveStage] = useState(1)

  return (
    <div className="w">
      <Header />

      <div
        className="row"
        style={{ gap: 64, padding: '64px 56px 80px', alignItems: 'flex-start' }}
      >
        {/* Left: Confirmation Details & Ordered Pieces */}
        <div
          style={{
            flex: 1.3,
            minWidth: 420,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            alignItems: 'flex-start',
          }}
        >
          <span className="ey" style={{ color: '#C9A96E' }}>
            Step 5 · Order {lastOrder.id} · {lastOrder.placedAt}
          </span>
          <h1 className="h" style={{ fontSize: 68, lineHeight: 0.98 }}>
            Thank you, {lastOrder.customer.name.split(' ')[0]}. Your order is
            confirmed.
          </h1>
          <p className="mu" style={{ maxWidth: 520, margin: 0, fontSize: 17 }}>
            A dossier with your piece certificates and courier tracking link has
            been dispatched to{' '}
            <b style={{ color: '#ECE9E2' }}>{lastOrder.customer.email}</b> for
            delivery to{' '}
            <b style={{ color: '#ECE9E2' }}>
              {lastOrder.customer.address}, {lastOrder.customer.city}
            </b>
            .
          </p>

          {/* Ordered Pieces Card */}
          <div
            style={{
              width: '100%',
              background: '#141413',
              border: '1px solid #2B2A28',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginTop: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className="ey">Allocated Pieces</span>
              <span style={{ fontWeight: 700, color: '#C9A96E' }}>
                Total Paid: {formatPrice(lastOrder.total)} ({lastOrder.paymentMethod})
              </span>
            </div>

            {lastOrder.items.map((item, i) => (
              <div
                key={i}
                className="ln"
                style={{
                  paddingTop: 14,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                }}
              >
                <div
                  className="ph"
                  style={{ width: 64, height: 74, flex: 'none' }}
                >
                  <ProductVisual
                    category={item.product.category}
                    variant={item.product.variant}
                    accentHex={item.colorHex}
                    size={46}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="ey" style={{ fontSize: 9 }}>
                    {item.product.brand}
                  </div>
                  <b>{item.product.name}</b>
                  <div className="mu" style={{ fontSize: 12 }}>
                    Finish: {item.color} · Fit: {item.fit} · Qty {item.qty}
                  </div>
                </div>
                <span style={{ fontWeight: 600 }}>
                  {formatPrice(item.product.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 8 }}>
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/catalog')}
            >
              Keep Shopping Catalog →
            </button>
            <button
              type="button"
              className="btn2"
              onClick={() =>
                setActiveStage((prev) =>
                  prev < TRACKING_STEPS.length - 1 ? prev + 1 : 1
                )
              }
            >
              Simulate Courier Progress
            </button>
          </div>
        </div>

        {/* Right: Live Dispatch Timeline */}
        <div
          style={{
            flex: 1,
            minWidth: 340,
            maxWidth: 480,
            background: '#141413',
            border: '1px solid #2B2A28',
            padding: 32,
          }}
        >
          <span className="ey">Live Courier Telemetry</span>
          <h2 className="h" style={{ fontSize: 32, margin: '8px 0 18px' }}>
            Dispatch Status
          </h2>

          <div>
            {TRACKING_STEPS.map((step, idx) => {
              const isCompleted = idx <= activeStage
              const isCurrent = idx === activeStage
              return (
                <div
                  key={step.title}
                  className="ln"
                  style={{
                    display: 'flex',
                    gap: 16,
                    alignItems: 'flex-start',
                    padding: '18px 0',
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      marginTop: 5,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: isCompleted ? '#C9A96E' : '#3A3A42',
                      boxShadow: isCurrent
                        ? '0 0 0 4px rgba(201, 169, 110, 0.22)'
                        : 'none',
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: isCompleted ? '#ECE9E2' : '#9B978D',
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      className="mu"
                      style={{ fontSize: 13, marginTop: 4 }}
                    >
                      {step.detail}
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="ln" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
