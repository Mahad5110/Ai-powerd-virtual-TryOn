import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { PRODUCTS, formatPrice } from '../data/products'

const ShopContext = createContext(null)

const INITIAL_CART = [
  {
    product: PRODUCTS[0], // Calibre 09 Monolith Automatic
    color: PRODUCTS[0].colors[0].name,
    colorHex: PRODUCTS[0].colors[0].hex,
    fit: 'Regular',
    qty: 1,
  },
  {
    product: PRODUCTS[24], // Corso Hand-Welted Penny Loafer
    color: PRODUCTS[24].colors[0].name,
    colorHex: PRODUCTS[24].colors[0].hex,
    fit: 'Regular',
    qty: 1,
  },
]

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(INITIAL_CART)
  const [savedIds, setSavedIds] = useState(['w-01', 'j-01', 'b-01'])
  const [toast, setToast] = useState(null)
  const [lastOrder, setLastOrder] = useState({
    id: 'WF-84920',
    placedAt: 'Oct 29, 2026',
    customer: {
      name: 'Elena Rostova',
      email: 'elena.rostova@atelier.com',
      city: 'Milan',
      address: 'Via Monte Napoleone 14',
    },
    paymentMethod: 'Card',
    items: INITIAL_CART,
    subtotal: 4630,
    discount: 0,
    delivery: 0,
    total: 4630,
  })

  const notify = useCallback((message) => {
    setToast(message)
    window.clearTimeout(window.__wfToastTimer)
    window.__wfToastTimer = window.setTimeout(() => {
      setToast(null)
    }, 2800)
  }, [])

  const addToCart = useCallback(
    (product, options = {}) => {
      const colorObj =
        options.colorObj ||
        product.colors?.find((c) => c.name === options.color) ||
        product.colors?.[0] || { name: 'Standard', hex: '#D4D4D8' }
      const fit = options.fit || 'Regular'
      const qtyToAdd = options.qty || 1

      setCart((prev) => {
        const idx = prev.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.color === colorObj.name &&
            item.fit === fit
        )
        if (idx > -1) {
          const updated = [...prev]
          updated[idx] = { ...updated[idx], qty: updated[idx].qty + qtyToAdd }
          return updated
        }
        return [
          ...prev,
          {
            product,
            color: colorObj.name,
            colorHex: colorObj.hex,
            fit,
            qty: qtyToAdd,
          },
        ]
      })

      notify(`Added ${product.name} (${colorObj.name}) to bag`)
    },
    [notify]
  )

  const updateCartQty = useCallback((index, delta) => {
    setCart((prev) =>
      prev
        .map((item, idx) =>
          idx === index ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    )
  }, [])

  const removeFromCart = useCallback((index) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index))
  }, [])

  const toggleSaved = useCallback(
    (productId) => {
      const product = PRODUCTS.find((p) => p.id === productId)
      setSavedIds((prev) => {
        const exists = prev.includes(productId)
        const next = exists
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
        if (product) {
          notify(
            exists
              ? `Removed ${product.name} from Saved Looks`
              : `Saved ${product.name} to your Try-On Looks`
          )
        }
        return next
      })
    },
    [notify]
  )

  const placeOrder = useCallback(
    ({ customer, paymentMethod, discount = 0 }) => {
      const subtotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.qty,
        0
      )
      const delivery = subtotal > 1000 || subtotal === 0 ? 0 : 35
      const total = Math.max(0, subtotal - discount + delivery)
      const orderNum = `WF-${Math.floor(10000 + Math.random() * 89999)}`

      const newOrder = {
        id: orderNum,
        placedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        customer,
        paymentMethod,
        items: cart.length > 0 ? [...cart] : INITIAL_CART,
        subtotal: subtotal || 4630,
        discount,
        delivery,
        total: total || 4630,
      }
      setLastOrder(newOrder)
      notify(`Order ${orderNum} confirmed — Total ${formatPrice(newOrder.total)}`)
      return newOrder
    },
    [cart, notify]
  )

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  )

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [cart]
  )

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      cartSubtotal,
      savedIds,
      lastOrder,
      toast,
      addToCart,
      updateCartQty,
      removeFromCart,
      toggleSaved,
      placeOrder,
      notify,
    }),
    [
      cart,
      cartCount,
      cartSubtotal,
      savedIds,
      lastOrder,
      toast,
      addToCart,
      updateCartQty,
      removeFromCart,
      toggleSaved,
      placeOrder,
      notify,
    ]
  )

  return (
    <ShopContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="wf-toast"
        >
          <span className="wf-toast-dot" />
          <span>{toast}</span>
        </div>
      )}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) {
    throw new Error('useShop must be used within a ShopProvider')
  }
  return ctx
}

