'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CartItem = {
  tourId: string
  tourTitle: string
  tourSlug: string
  tourImage: string
  priceAdult: number
  priceChild: number
  duration: string
  destination: string
  adults: number
  children: number
  departureDate: string
  totalPrice: number
}

type CartContextType = {
  cart: CartItem | null
  addToCart: (item: CartItem) => void
  clearCart: () => void
  updateCart: (updates: Partial<CartItem>) => void
}

const CartContext = createContext<CartContextType>({
  cart: null,
  addToCart: () => {},
  clearCart: () => {},
  updateCart: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('viettravel-cart')
    if (stored) {
      try {
        setCart(JSON.parse(stored))
      } catch {}
    }
  }, [])

  const addToCart = (item: CartItem) => {
    setCart(item)
    localStorage.setItem('viettravel-cart', JSON.stringify(item))
  }

  const clearCart = () => {
    setCart(null)
    localStorage.removeItem('viettravel-cart')
  }

  const updateCart = (updates: Partial<CartItem>) => {
    if (!cart) return
    const updated = { ...cart, ...updates }
    // Recalculate total
    updated.totalPrice = updated.adults * updated.priceAdult + updated.children * updated.priceChild
    setCart(updated)
    localStorage.setItem('viettravel-cart', JSON.stringify(updated))
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, updateCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
