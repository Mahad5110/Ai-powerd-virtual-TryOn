import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ShopProvider } from './context/ShopContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import TryOn from './pages/TryOn'
import Checkout from './pages/Checkout'
import Done from './pages/Done'

export default function App() {
  return (
    <ShopProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/try-on" element={<TryOn />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/done" element={<Done />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </ShopProvider>
  )
}
