'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Smartphone, Wallet } from 'lucide-react'

interface Food {
  id: string
  name: string
  price: number
  image?: string
  restaurant: {
    id: string
    name: string
  }
}

interface CartItem {
  food: Food
  quantity: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
    paymentMethod: 'CARD' as 'CARD' | 'MOMO' | 'PAYPAL'
  })

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setLoading(false)
  }, [])

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.food.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Group cart items by restaurant
      const restaurantGroups = cart.reduce((groups, item) => {
        const restaurantId = item.food.restaurant.id
        if (!groups[restaurantId]) {
          groups[restaurantId] = {
            restaurant: item.food.restaurant,
            items: []
          }
        }
        groups[restaurantId].items.push(item)
        return groups
      }, {} as Record<string, { restaurant: Food['restaurant'], items: CartItem[] }>)

      // Create separate orders for each restaurant
      const orderPromises = Object.entries(restaurantGroups).map(([restaurantId, group]) => {
        const orderData = {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          notes: formData.notes,
          restaurantId,
          items: group.items.map(item => ({
            foodId: item.food.id,
            quantity: item.quantity
          })),
          totalAmount: group.items.reduce((total, item) => total + (item.food.price * item.quantity), 0),
          paymentMethod: formData.paymentMethod
        }

        return fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        })
      })

      const responses = await Promise.all(orderPromises)
      
      if (responses.every(response => response.ok)) {
        // Clear cart
        localStorage.removeItem('cart')
        setCart([])
        
        // Redirect to order confirmation
        router.push('/order-confirmation')
      } else {
        throw new Error('Some orders failed')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 bg-muted rounded"></div>
                ))}
              </div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/restaurants" className="text-primary hover:underline">
            ← Back to restaurants
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const deliveryFee = 2.99
  const serviceFee = 1.99
  const total = subtotal + deliveryFee + serviceFee

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              🍔 FastaFasta
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/restaurants" className="text-foreground hover:text-primary">
                Restaurants
              </Link>
              <Link href="/favorites" className="text-foreground hover:text-primary">
                Favorites
              </Link>
              <Link href="/cart" className="text-foreground hover:text-primary">
                Cart ({getTotalItems()})
              </Link>
              <Link href="/admin/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="customerEmail" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="customerPhone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">Order Notes</h2>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Special instructions, allergies, etc."
                />
              </div>

              {/* Payment Method */}
              <div className="border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-muted">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={formData.paymentMethod === 'CARD'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
                      className="text-primary"
                    />
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-muted">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="MOMO"
                      checked={formData.paymentMethod === 'MOMO'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
                      className="text-primary"
                    />
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <span>MTN MoMo</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-muted">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PAYPAL"
                      checked={formData.paymentMethod === 'PAYPAL'}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
                      className="text-primary"
                    />
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                    <span>PayPal</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !formData.customerName}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-4">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.food.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.food.name}</span>
                    <span>${(item.food.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                <p>• Estimated delivery: 25-35 minutes</p>
                <p>• You'll receive order updates via email</p>
                <p>• Payment will be processed after order confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
