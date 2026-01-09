'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const raw = localStorage.getItem('cart')
    if (raw) setCart(JSON.parse(raw))

    const handleStorage = () => {
      const raw = localStorage.getItem('cart')
      if (raw) setCart(JSON.parse(raw))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta)
        return { ...item, quantity: newQty }
      }
      return item
    })
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-orange-50/30 text-foreground py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-orange-400" />
            </div>
            <p className="text-gray-500 mb-8 text-xl font-medium">Your cart is currently empty.</p>
            <Link href="/menu">
              <Button size="lg" className="rounded-full px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/20">
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-gray-100" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400 font-medium">No Img</div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                    <p className="text-orange-600 font-bold text-lg">${item.price}</p>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1.5 border border-gray-100">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition text-gray-600"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity || 1}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition text-gray-600"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 transition rounded-xl"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-3xl p-8 sticky top-24 shadow-lg shadow-orange-500/5">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h3>
                <div className="space-y-4 mb-8 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (Est. 10%)</span>
                    <span className="font-medium text-gray-900">${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 my-2 pt-4 flex justify-between font-extrabold text-gray-900 text-xl">
                    <span>Total</span>
                    <span className="text-orange-600">${(total * 1.1).toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full block">
                  <Button className="w-full rounded-2xl py-7 text-lg font-bold shadow-xl shadow-orange-500/20 bg-orange-500 hover:bg-orange-600 text-white transition-transform hover:-translate-y-1">
                    Proceed to Checkout <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
