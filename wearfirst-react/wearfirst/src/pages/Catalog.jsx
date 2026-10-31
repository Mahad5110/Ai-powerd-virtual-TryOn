import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductVisual from '../components/ProductVisual'
import {
  PRODUCTS,
  CATEGORIES,
  BRANDS,
  PRICE_PRESETS,
  SORT_OPTIONS,
  MIN_CATALOG_PRICE,
  MAX_CATALOG_PRICE,
  formatPrice,
} from '../data/products'
import { useShop } from '../context/ShopContext'

function HighlightText({ text, query }) {
  if (!query || !query.trim()) return <>{text}</>
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark key={i} className="wf-hl">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

export default function Catalog() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { addToCart, savedIds, toggleSaved } = useShop()

  // Initial states synced from URL query params
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get('category') || 'All'
  )
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get('q') || ''
  )
  const [selectedBrands, setSelectedBrands] = useState(() => {
    const b = searchParams.get('brand')
    return b ? b.split(',').filter(Boolean) : []
  })
  const [minPrice, setMinPrice] = useState(() => {
    const v = Number(searchParams.get('minPrice'))
    return Number.isFinite(v) && v >= MIN_CATALOG_PRICE ? v : MIN_CATALOG_PRICE
  })
  const [maxPrice, setMaxPrice] = useState(() => {
    const v = Number(searchParams.get('maxPrice'))
    return Number.isFinite(v) && v > 0 ? v : MAX_CATALOG_PRICE
  })
  const [sortBy, setSortBy] = useState(
    () => searchParams.get('sort') || 'newest'
  )
  const [onlySaved, setOnlySaved] = useState(
    () => searchParams.get('saved') === '1'
  )
  const [onlyNew, setOnlyNew] = useState(false)

  // View modes: 'grid' | 'editorial' | 'compact' | 'multi-category'
  const [viewMode, setViewMode] = useState('grid')

  // Browsing mode: 'pagination' | 'infinite'
  const [browseMode, setBrowseMode] = useState('pagination')
  const [pageSize, setPageSize] = useState(8)
  const [currentPage, setCurrentPage] = useState(1)
  const [infiniteCount, setInfiniteCount] = useState(8)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Per-card active color selection
  const [selectedColors, setSelectedColors] = useState({})
  // Quick view modal product
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  const sentinelRef = useRef(null)
  const catalogTopRef = useRef(null)

  // Sync URL -> state when user clicks Header or Footer links
  useEffect(() => {
    const urlCat = searchParams.get('category') || 'All'
    const urlQ = searchParams.get('q') || ''
    const urlSaved = searchParams.get('saved') === '1'
    const urlSort = searchParams.get('sort')
    const urlMaxPrice = searchParams.get('maxPrice')

    setSelectedCategory(urlCat)
    if (urlQ !== searchQuery) setSearchQuery(urlQ)
    setOnlySaved(urlSaved)
    if (urlSort) setSortBy(urlSort)
    if (urlMaxPrice) setMaxPrice(Number(urlMaxPrice))
  }, [searchParams])

  // Update URL search params cleanly when primary category changes
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId)
    setCurrentPage(1)
    setInfiniteCount(pageSize)
    const next = new URLSearchParams(searchParams)
    if (catId === 'All') {
      next.delete('category')
    } else {
      next.set('category', catId)
    }
    setSearchParams(next, { replace: true })
  }

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
    setCurrentPage(1)
    setInfiniteCount(pageSize)
  }

  const applyPricePreset = (preset) => {
    setMinPrice(preset.min)
    setMaxPrice(preset.max)
    setCurrentPage(1)
    setInfiniteCount(pageSize)
  }

  const clearAllFilters = () => {
    setSelectedCategory('All')
    setSearchQuery('')
    setSelectedBrands([])
    setMinPrice(MIN_CATALOG_PRICE)
    setMaxPrice(MAX_CATALOG_PRICE)
    setOnlySaved(false)
    setOnlyNew(false)
    setSortBy('newest')
    setCurrentPage(1)
    setInfiniteCount(pageSize)
    setSearchParams({}, { replace: true })
  }

  // Category counts (before category filter, respecting search/price/brand)
  const categoryCounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const base = PRODUCTS.filter((p) => {
      if (q) {
        const hay = `${p.name} ${p.brand} ${p.category} ${p.material} ${p.description}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false
      }
      if (p.price < minPrice || p.price > maxPrice) return false
      if (onlySaved && !savedIds.includes(p.id)) return false
      if (onlyNew && !p.isNew) return false
      return true
    })

    const counts = { All: base.length, Watches: 0, Jewelry: 0, Bags: 0, Shoes: 0 }
    base.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [searchQuery, selectedBrands, minPrice, maxPrice, onlySaved, onlyNew, savedIds])

  // Brand counts (respecting active category, search, and price)
  const brandCounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const counts = {}
    BRANDS.forEach((b) => {
      counts[b] = 0
    })
    PRODUCTS.forEach((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return
      if (q) {
        const hay = `${p.name} ${p.brand} ${p.category} ${p.material} ${p.description}`.toLowerCase()
        if (!hay.includes(q)) return
      }
      if (p.price < minPrice || p.price > maxPrice) return
      if (onlySaved && !savedIds.includes(p.id)) return
      if (onlyNew && !p.isNew) return
      counts[p.brand] = (counts[p.brand] || 0) + 1
    })
    return counts
  }, [selectedCategory, searchQuery, minPrice, maxPrice, onlySaved, onlyNew, savedIds])

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const list = PRODUCTS.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false
      }
      if (q) {
        const hay = `${p.name} ${p.brand} ${p.category} ${p.material} ${p.description}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false
      }
      if (p.price < minPrice || p.price > maxPrice) {
        return false
      }
      if (onlySaved && !savedIds.includes(p.id)) {
        return false
      }
      if (onlyNew && !p.isNew) {
        return false
      }
      return true
    })

    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'popular') return b.reviews - a.reviews || b.rating - a.rating
      // default 'newest'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [
    selectedCategory,
    searchQuery,
    selectedBrands,
    minPrice,
    maxPrice,
    onlySaved,
    onlyNew,
    sortBy,
    savedIds,
  ])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
    setInfiniteCount(pageSize)
  }, [
    selectedCategory,
    searchQuery,
    selectedBrands,
    minPrice,
    maxPrice,
    onlySaved,
    onlyNew,
    sortBy,
    pageSize,
  ])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))

  // Visible slice depending on pagination vs infinite scroll
  const displayedProducts = useMemo(() => {
    if (browseMode === 'infinite') {
      return filteredProducts.slice(0, infiniteCount)
    }
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, browseMode, infiniteCount, currentPage, pageSize])

  // Infinite scroll IntersectionObserver
  useEffect(() => {
    if (browseMode !== 'infinite') return
    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (
          first.isIntersecting &&
          infiniteCount < filteredProducts.length &&
          !isLoadingMore
        ) {
          setIsLoadingMore(true)
          window.setTimeout(() => {
            setInfiniteCount((prev) =>
              Math.min(filteredProducts.length, prev + pageSize)
            )
            setIsLoadingMore(false)
          }, 260)
        }
      },
      { rootMargin: '180px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [browseMode, infiniteCount, filteredProducts.length, pageSize, isLoadingMore])

  const activeCategoryMeta =
    CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0]

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    selectedBrands.length > 0 ||
    minPrice > MIN_CATALOG_PRICE ||
    maxPrice < MAX_CATALOG_PRICE ||
    onlySaved ||
    onlyNew

  const handlePageChange = (page) => {
    const clamped = Math.max(1, Math.min(totalPages, page))
    setCurrentPage(clamped)
    if (catalogTopRef.current) {
      catalogTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const renderProductCard = (product, idx) => {
    const activeColorName =
      selectedColors[product.id] || product.colors[0]?.name
    const activeColorObj =
      product.colors.find((c) => c.name === activeColorName) ||
      product.colors[0]
    const isSaved = savedIds.includes(product.id)
    const isEditorial = viewMode === 'editorial'
    const isCompact = viewMode === 'compact'
    // Apply content-visibility: auto to cards below the initial fold (> 5)
    const deferredClass = idx >= 6 ? 'catalog-card-deferred' : ''

    return (
      <article
        key={product.id}
        className={`product-card ${isEditorial ? 'editorial-row' : ''} ${deferredClass}`}
      >
        <div
          className="ph"
          onClick={() => setQuickViewProduct(product)}
          style={{
            height: isEditorial ? 'auto' : isCompact ? 240 : 320,
            minHeight: isEditorial ? 260 : undefined,
            width: isEditorial ? 300 : '100%',
            flexShrink: 0,
            border: 'none',
            borderBottom: isEditorial ? 'none' : '1px solid #2B2A28',
            borderRight: isEditorial ? '1px solid #2B2A28' : 'none',
            cursor: 'pointer',
          }}
        >
          {product.badge && (
            <span className={`badge-pill ${product.isNew ? 'new' : ''}`}>
              {product.badge}
            </span>
          )}

          <button
            type="button"
            className={`save-icon-btn ${isSaved ? 'saved' : ''}`}
            aria-label={isSaved ? 'Remove from saved looks' : 'Save look'}
            onClick={(e) => {
              e.stopPropagation()
              toggleSaved(product.id)
            }}
          >
            {isSaved ? '♥' : '♡'}
          </button>

          <ProductVisual
            category={product.category}
            variant={product.variant}
            accentHex={activeColorObj.hex}
            size={isCompact ? 95 : 130}
          />

          <span className="cap">
            {product.category} · {activeColorObj.name}
          </span>
        </div>

        <div
          style={{
            padding: isCompact ? 16 : 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span className="ey" style={{ fontSize: 10 }}>
                <HighlightText text={product.brand} query={searchQuery} />
              </span>
              <span className="mu" style={{ fontSize: 11 }}>
                ★ {product.rating.toFixed(1)} ({product.reviews})
              </span>
            </div>

            <h3
              className="h"
              onClick={() => setQuickViewProduct(product)}
              style={{
                fontSize: isCompact ? 21 : 25,
                lineHeight: 1.15,
                cursor: 'pointer',
              }}
            >
              <HighlightText text={product.name} query={searchQuery} />
            </h3>

            {!isCompact && (
              <p
                className="mu"
                style={{
                  margin: '2px 0 0',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                <HighlightText text={product.material} query={searchQuery} />
              </p>
            )}

            {isEditorial && (
              <p className="mu" style={{ margin: '6px 0 0', fontSize: 14 }}>
                {product.description} — <span style={{ color: '#ECE9E2' }}>{product.fitNote}</span>
              </p>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              marginTop: 8,
              paddingTop: 12,
              borderTop: '1px solid #22211F',
            }}
          >
            {/* Swatches + Price */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                {product.colors.map((c) => {
                  const isSelected = c.name === activeColorObj.name
                  return (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      aria-label={`Select ${c.name}`}
                      onClick={() =>
                        setSelectedColors((prev) => ({
                          ...prev,
                          [product.id]: c.name,
                        }))
                      }
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: c.hex,
                        border: isSelected
                          ? '2px solid #ECE9E2'
                          : '1px solid #55524C',
                        outline: isSelected ? '1px solid #0F0F0E' : 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    />
                  )
                })}
              </div>

              <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.02em' }}>
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Action Sequence Buttons: Try On -> Add to Bag */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn2"
                style={{
                  flex: 1,
                  height: 40,
                  padding: '0 12px',
                  fontSize: 11,
                }}
                onClick={() =>
                  navigate(
                    `/try-on?product=${encodeURIComponent(
                      product.id
                    )}&color=${encodeURIComponent(activeColorObj.name)}`
                  )
                }
              >
                Try On
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  flex: 1,
                  height: 40,
                  padding: '0 12px',
                  fontSize: 11,
                }}
                onClick={() =>
                  addToCart(product, { colorObj: activeColorObj })
                }
              >
                + Bag
              </button>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <div className="w">
      <Header />

      {/* Category Editorial Banner + Multi-Category View Switcher */}
      <section
        ref={catalogTopRef}
        style={{
          padding: '44px 56px 28px',
          borderBottom: '1px solid #2B2A28',
          background:
            'linear-gradient(180deg, rgba(24,24,23,0.75) 0%, rgba(15,15,14,1) 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: 24,
            marginBottom: 28,
          }}
        >
          <div>
            <span className="ey">
              Archive Catalog · {filteredProducts.length} of {PRODUCTS.length} Pieces
            </span>
            <h1
              className="h"
              style={{ fontSize: 56, lineHeight: 1.02, marginTop: 10 }}
            >
              {activeCategoryMeta.label}
            </h1>
            <p
              className="mu"
              style={{ maxWidth: 620, margin: '10px 0 0', fontSize: 16 }}
            >
              {activeCategoryMeta.tagline}
            </p>
          </div>

          {/* Real-Time Search Input in Hero */}
          <div style={{ minWidth: 320, flex: '0 1 420px' }}>
            <label className="lb" htmlFor="catalog-realtime-search">
              Real-time catalog search
            </label>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                marginTop: 6,
              }}
            >
              <input
                id="catalog-realtime-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by piece, atelier, titanium, loafer, gold..."
                style={{
                  width: '100%',
                  height: 48,
                  background: '#181817',
                  border: '1px solid #55524C',
                  borderRadius: 2,
                  color: '#ECE9E2',
                  padding: '0 40px 0 16px',
                  fontSize: 14,
                  fontFamily: 'inherit',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search query"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: 10,
                    background: 'transparent',
                    border: 'none',
                    color: '#9B978D',
                    cursor: 'pointer',
                    fontSize: 16,
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            {/* Quick Search Suggestion Chips */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                marginTop: 10,
                alignItems: 'center',
              }}
            >
              <span className="ey" style={{ fontSize: 9 }}>
                Popular:
              </span>
              {['Titanium', 'Signet', 'Calfskin', 'Chronos', 'Loafer'].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() =>
                      setSearchQuery((prev) => (prev === term ? '' : term))
                    }
                    style={{
                      background:
                        searchQuery.toLowerCase() === term.toLowerCase()
                          ? '#ECE9E2'
                          : '#181817',
                      color:
                        searchQuery.toLowerCase() === term.toLowerCase()
                          ? '#0F0F0E'
                          : '#9B978D',
                      border: '1px solid #2B2A28',
                      borderRadius: 2,
                      padding: '2px 8px',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Multi-Category Tabs */}
        <div className="cat-tabs" role="tablist" aria-label="Product categories">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id
            const count = categoryCounts[cat.id] ?? 0
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`cat-tab ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectCategory(cat.id)}
              >
                <span>{cat.label}</span>
                <span className="cat-tab-count">{count}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Main Catalog Workspace: Attribute Filter Sidebar + Listing Area */}
      <div className="catalog-layout">
        {/* Left Attribute Filter Sidebar */}
        <aside className="filter-panel" aria-label="Attribute filters">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="ey" style={{ color: '#ECE9E2' }}>
              Attribute Filters
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                className="lk"
                style={{ fontSize: 12 }}
                onClick={clearAllFilters}
              >
                Reset all
              </button>
            )}
          </div>

          {/* 1. Category Attribute Filter */}
          <div className="filter-group" style={{ paddingTop: 14 }}>
            <span className="ey">Category</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {CATEGORIES.map((cat) => {
                const checked = selectedCategory === cat.id
                return (
                  <label key={cat.id} className="filter-check-label">
                    <span className="filter-check-left">
                      <input
                        type="radio"
                        name="sidebar-category"
                        checked={checked}
                        onChange={() => handleSelectCategory(cat.id)}
                      />
                      <span>{cat.label}</span>
                    </span>
                    <span className="mu" style={{ fontSize: 12 }}>
                      {categoryCounts[cat.id] ?? 0}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* 2. Price Range Attribute Filter */}
          <div className="filter-group">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span className="ey">Price Range</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#C9A96E' }}>
                {formatPrice(minPrice)} – {formatPrice(maxPrice)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label className="lb" style={{ fontSize: 10 }}>
                Minimum: {formatPrice(minPrice)}
                <input
                  type="range"
                  min={MIN_CATALOG_PRICE}
                  max={MAX_CATALOG_PRICE - 250}
                  step={50}
                  value={minPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setMinPrice(Math.min(val, maxPrice - 100))
                  }}
                />
              </label>

              <label className="lb" style={{ fontSize: 10 }}>
                Maximum: {formatPrice(maxPrice)}
                <input
                  type="range"
                  min={MIN_CATALOG_PRICE + 250}
                  max={MAX_CATALOG_PRICE}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setMaxPrice(Math.max(val, minPrice + 100))
                  }}
                />
              </label>
            </div>

            {/* Quick Price Tiers */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {PRICE_PRESETS.map((preset) => {
                const isSelected =
                  minPrice === preset.min && maxPrice === preset.max
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPricePreset(preset)}
                    style={{
                      padding: '5px 9px',
                      fontSize: 11,
                      borderRadius: 2,
                      border: isSelected
                        ? '1px solid #ECE9E2'
                        : '1px solid #2B2A28',
                      background: isSelected ? '#ECE9E2' : '#181817',
                      color: isSelected ? '#0F0F0E' : '#9B978D',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. Brand / Atelier Attribute Filter */}
          <div className="filter-group">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className="ey">Atelier / Brand</span>
              {selectedBrands.length > 0 && (
                <button
                  type="button"
                  className="lk"
                  style={{ fontSize: 11 }}
                  onClick={() => setSelectedBrands([])}
                >
                  Clear ({selectedBrands.length})
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {BRANDS.map((brand) => {
                const isChecked = selectedBrands.includes(brand)
                const count = brandCounts[brand] || 0
                return (
                  <label
                    key={brand}
                    className="filter-check-label fallback-check"
                    style={{ opacity: count === 0 && !isChecked ? 0.45 : 1 }}
                  >
                    <span className="filter-check-left">
                      <input
                        type="checkbox"
                        className="visually-hidden"
                        checked={isChecked}
                        onChange={() => toggleBrand(brand)}
                      />
                      <span>{brand}</span>
                    </span>
                    <span className="mu" style={{ fontSize: 12 }}>
                      {count}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* 4. Curated Attributes */}
          <div className="filter-group">
            <span className="ey">Collection Status</span>
            <label className="filter-check-label fallback-check">
              <span className="filter-check-left">
                <input
                  type="checkbox"
                  className="visually-hidden"
                  checked={onlyNew}
                  onChange={(e) => setOnlyNew(e.target.checked)}
                />
                <span>New Season Releases Only</span>
              </span>
            </label>
            <label className="filter-check-label fallback-check">
              <span className="filter-check-left">
                <input
                  type="checkbox"
                  className="visually-hidden"
                  checked={onlySaved}
                  onChange={(e) => setOnlySaved(e.target.checked)}
                />
                <span>Saved Try-On Looks ({savedIds.length})</span>
              </span>
            </label>
          </div>
        </aside>

        {/* Right Main Catalog View */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Toolbar: Sorting, View Mode (Grid / Editorial / Compact / Multi-Category), Browsing Mode (Pagination vs Infinite Scroll) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
              padding: '16px 20px',
              background: '#141413',
              border: '1px solid #2B2A28',
              borderRadius: 2,
            }}
          >
            {/* Left: Result summary + View mode buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span className="ey" style={{ color: '#ECE9E2' }}>
                View:
              </span>
              {[
                { id: 'grid', label: 'Gallery Grid' },
                { id: 'editorial', label: 'Editorial List' },
                { id: 'compact', label: 'Compact 4-Col' },
                { id: 'multi-category', label: 'Category Sections' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`sel ${viewMode === v.id ? 'on' : ''}`}
                  style={{ height: 36, padding: '0 12px', fontSize: 12 }}
                  onClick={() => setViewMode(v.id)}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* Right: Browsing Mode (Pagination vs Infinite Scroll) + Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'inline-flex',
                  border: '1px solid #3E3C38',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
                role="group"
                aria-label="Catalog browsing mode"
              >
                <button
                  type="button"
                  onClick={() => setBrowseMode('pagination')}
                  style={{
                    height: 36,
                    padding: '0 12px',
                    border: 'none',
                    background:
                      browseMode === 'pagination' ? '#ECE9E2' : 'transparent',
                    color: browseMode === 'pagination' ? '#0F0F0E' : '#9B978D',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Pages
                </button>
                <button
                  type="button"
                  onClick={() => setBrowseMode('infinite')}
                  style={{
                    height: 36,
                    padding: '0 12px',
                    border: 'none',
                    borderLeft: '1px solid #3E3C38',
                    background:
                      browseMode === 'infinite' ? '#ECE9E2' : 'transparent',
                    color: browseMode === 'infinite' ? '#0F0F0E' : '#9B978D',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Infinite Scroll
                </button>
              </div>

              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  color: '#9B978D',
                }}
              >
                <span className="ey">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                  style={{
                    height: 36,
                    background: '#181817',
                    color: '#ECE9E2',
                    border: '1px solid #55524C',
                    borderRadius: 2,
                    padding: '0 12px',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="chip-list" aria-label="Active filters">
              <span className="ey" style={{ fontSize: 10 }}>
                Active filters:
              </span>
              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => handleSelectCategory('All')}
                >
                  <span>Category: {selectedCategory}</span>
                  <span>✕</span>
                </button>
              )}
              {searchQuery.trim() && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setSearchQuery('')}
                >
                  <span>Search: “{searchQuery.trim()}”</span>
                  <span>✕</span>
                </button>
              )}
              {(minPrice > MIN_CATALOG_PRICE ||
                maxPrice < MAX_CATALOG_PRICE) && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => {
                    setMinPrice(MIN_CATALOG_PRICE)
                    setMaxPrice(MAX_CATALOG_PRICE)
                  }}
                >
                  <span>
                    Price: {formatPrice(minPrice)} – {formatPrice(maxPrice)}
                  </span>
                  <span>✕</span>
                </button>
              )}
              {selectedBrands.map((b) => (
                <button
                  key={b}
                  type="button"
                  className="filter-chip"
                  onClick={() => toggleBrand(b)}
                >
                  <span>{b}</span>
                  <span>✕</span>
                </button>
              ))}
              {onlyNew && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setOnlyNew(false)}
                >
                  <span>New Arrivals</span>
                  <span>✕</span>
                </button>
              )}
              {onlySaved && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() => setOnlySaved(false)}
                >
                  <span>Saved Looks</span>
                  <span>✕</span>
                </button>
              )}
              <button
                type="button"
                className="lk"
                style={{ fontSize: 12, marginLeft: 6 }}
                onClick={clearAllFilters}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Empty State if no products match */}
          {filteredProducts.length === 0 ? (
            <div
              style={{
                padding: '72px 32px',
                border: '1px solid #2B2A28',
                background: '#141413',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span className="ey">No matching pieces</span>
              <h2 className="h" style={{ fontSize: 38 }}>
                No pieces match your current filter combination.
              </h2>
              <p className="mu" style={{ maxWidth: 440, margin: 0 }}>
                Try expanding your price range, clearing a brand filter, or
                searching for a broader term.
              </p>
              <button
                type="button"
                className="btn"
                onClick={clearAllFilters}
              >
                Reset all filters
              </button>
            </div>
          ) : viewMode === 'multi-category' ? (
            /* Multi-Category Grouped Listing View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
              {['Watches', 'Jewelry', 'Bags', 'Shoes'].map((catName) => {
                const itemsInCat = filteredProducts.filter(
                  (p) => p.category === catName
                )
                if (itemsInCat.length === 0) return null
                const catMeta = CATEGORIES.find((c) => c.id === catName)
                return (
                  <section
                    key={catName}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 20,
                      paddingBottom: 32,
                      borderBottom: '1px solid #2B2A28',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div>
                        <span className="ey">{itemsInCat.length} Pieces</span>
                        <h2 className="h" style={{ fontSize: 40, marginTop: 4 }}>
                          {catName}
                        </h2>
                        {catMeta && (
                          <p className="mu" style={{ margin: '4px 0 0', fontSize: 14 }}>
                            {catMeta.tagline}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="lk"
                        onClick={() => {
                          handleSelectCategory(catName)
                          setViewMode('grid')
                        }}
                      >
                        Focus only on {catName} →
                      </button>
                    </div>
                    <div className="product-grid">
                      {itemsInCat.map((p, idx) => renderProductCard(p, idx))}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : (
            /* Standard Grid / Editorial / Compact Listing + Pagination or Infinite Scroll */
            <>
              <div
                className={`product-grid ${
                  viewMode === 'compact'
                    ? 'view-compact'
                    : viewMode === 'editorial'
                    ? 'view-editorial'
                    : ''
                }`}
              >
                {displayedProducts.map((product, idx) =>
                  renderProductCard(product, idx)
                )}
              </div>

              {/* Footer Controls: Pagination vs Infinite Scroll */}
              {browseMode === 'pagination' ? (
                <div
                  style={{
                    marginTop: 20,
                    padding: '24px 28px',
                    background: '#141413',
                    border: '1px solid #2B2A28',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span className="mu" style={{ fontSize: 13 }}>
                      Showing{' '}
                      <b style={{ color: '#ECE9E2' }}>
                        {(currentPage - 1) * pageSize + 1}–
                        {Math.min(
                          currentPage * pageSize,
                          filteredProducts.length
                        )}
                      </b>{' '}
                      of <b style={{ color: '#ECE9E2' }}>{filteredProducts.length}</b>{' '}
                      pieces
                    </span>

                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        color: '#9B978D',
                      }}
                    >
                      <span>Per page:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        style={{
                          height: 32,
                          background: '#181817',
                          color: '#ECE9E2',
                          border: '1px solid #3E3C38',
                          padding: '0 8px',
                          fontFamily: 'inherit',
                        }}
                      >
                        <option value={6}>6</option>
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                        <option value={16}>16</option>
                      </select>
                    </label>
                  </div>

                  <nav
                    aria-label="Catalog pagination"
                    style={{ display: 'flex', gap: 8, alignItems: 'center' }}
                  >
                    <button
                      type="button"
                      className="sel"
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      style={{
                        height: 38,
                        opacity: currentPage <= 1 ? 0.4 : 1,
                        cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      ← Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          className={`sel ${
                            pageNum === currentPage ? 'on' : ''
                          }`}
                          onClick={() => handlePageChange(pageNum)}
                          style={{ height: 38, minWidth: 38, padding: '0 12px' }}
                        >
                          {pageNum}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      className="sel"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      style={{
                        height: 38,
                        opacity: currentPage >= totalPages ? 0.4 : 1,
                        cursor:
                          currentPage >= totalPages ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Next →
                    </button>
                  </nav>
                </div>
              ) : (
                /* Infinite Scroll Status + Sentinel */
                <div
                  ref={sentinelRef}
                  style={{
                    marginTop: 20,
                    padding: '32px 24px',
                    background: '#141413',
                    border: '1px solid #2B2A28',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <span className="ey">
                    Showing {displayedProducts.length} of{' '}
                    {filteredProducts.length} pieces
                  </span>
                  <div
                    style={{
                      width: 240,
                      height: 3,
                      background: '#2B2A28',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (displayedProducts.length /
                              filteredProducts.length) *
                              100
                          )
                        )}%`,
                        height: '100%',
                        background: '#C9A96E',
                        transition: 'width 0.25s ease',
                      }}
                    />
                  </div>

                  {infiniteCount < filteredProducts.length ? (
                    <button
                      type="button"
                      className="btn2"
                      onClick={() =>
                        setInfiniteCount((prev) =>
                          Math.min(filteredProducts.length, prev + pageSize)
                        )
                      }
                    >
                      {isLoadingMore
                        ? 'Loading archive pieces...'
                        : `Load more pieces (${
                            filteredProducts.length - displayedProducts.length
                          } remaining)`}
                    </button>
                  ) : (
                    <span className="mu" style={{ fontSize: 13 }}>
                      You have reached the end of the current selection.
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Quick-View Product Modal for Seamless Inspection -> Try-On or Checkout */}
      {quickViewProduct && (
        <div
          className="wf-modal-backdrop"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="wf-modal-card"
            role="dialog"
            aria-modal="true"
            aria-label={quickViewProduct.name}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close quick view"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10,
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid #3E3C38',
                background: '#181817',
                color: '#ECE9E2',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <div
              className="ph"
              style={{
                flex: '1 1 340px',
                minHeight: 420,
                border: 'none',
                borderRight: '1px solid #2B2A28',
              }}
            >
              <ProductVisual
                category={quickViewProduct.category}
                variant={quickViewProduct.variant}
                accentHex={
                  (
                    quickViewProduct.colors.find(
                      (c) =>
                        c.name ===
                        (selectedColors[quickViewProduct.id] ||
                          quickViewProduct.colors[0].name)
                    ) || quickViewProduct.colors[0]
                  ).hex
                }
                size={190}
              />
              <span className="cap">
                {quickViewProduct.brand} · {quickViewProduct.category}
              </span>
            </div>

            <div
              style={{
                flex: '1 1 360px',
                padding: 36,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
              }}
            >
              <span className="ey">
                {quickViewProduct.brand} · Released {quickViewProduct.createdAt}
              </span>
              <h2 className="h" style={{ fontSize: 38, lineHeight: 1.05 }}>
                {quickViewProduct.name}
              </h2>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#C9A96E' }}>
                {formatPrice(quickViewProduct.price)}
              </div>
              <p className="mu" style={{ margin: 0 }}>
                {quickViewProduct.description}
              </p>

              <div className="ln" style={{ paddingTop: 14 }}>
                <span className="ey">Material & Craft</span>
                <p style={{ margin: '6px 0 0', fontSize: 14 }}>
                  {quickViewProduct.material}
                </p>
              </div>

              <div className="ln" style={{ paddingTop: 14 }}>
                <span className="ey">AR Fit Calibration</span>
                <p className="mu" style={{ margin: '6px 0 0', fontSize: 14 }}>
                  {quickViewProduct.fitNote}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn"
                  style={{ flex: 1 }}
                  onClick={() => {
                    const colorName =
                      selectedColors[quickViewProduct.id] ||
                      quickViewProduct.colors[0].name
                    setQuickViewProduct(null)
                    navigate(
                      `/try-on?product=${encodeURIComponent(
                        quickViewProduct.id
                      )}&color=${encodeURIComponent(colorName)}`
                    )
                  }}
                >
                  Try On in AR Studio
                </button>
                <button
                  type="button"
                  className="btn2"
                  style={{ flex: 1 }}
                  onClick={() => {
                    const colorObj =
                      quickViewProduct.colors.find(
                        (c) =>
                          c.name ===
                          (selectedColors[quickViewProduct.id] ||
                            quickViewProduct.colors[0].name)
                      ) || quickViewProduct.colors[0]
                    addToCart(quickViewProduct, { colorObj })
                    setQuickViewProduct(null)
                  }}
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

