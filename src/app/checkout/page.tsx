'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Smartphone, Wallet, Truck, Store, Utensils, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [orderType, setOrderType] = useState<'DELIVERY' | 'PICKUP' | 'DINE_IN'>('DELIVERY')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: 'CARD'
  })

  useEffect(() => {
    setMounted(true)
    const raw = localStorage.getItem('cart')
    if (raw) setCart(JSON.parse(raw))
  }, [])

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          address: formData.address,
          notes: formData.notes,
          paymentMethod: formData.paymentMethod,
          type: orderType,
          items: cart
        })
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.removeItem('cart')
        window.dispatchEvent(new Event('cart-updated'))
        router.push(`/tracking/${data.orderId}`)
      } else {
        alert('Order failed. Please try again.')
      }
    } catch (error) {
      console.error(error)
      alert('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!mounted) return null

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-orange-50/30 text-foreground flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-3xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Cart is Empty</h2>
          <Link href="/menu">
            <Button variant="link" className="text-orange-600 hover:text-orange-700 text-lg font-semibold">Go to Menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50/30 text-foreground py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="p-2 hover:bg-white rounded-full transition shadow-sm bg-white/50 border border-transparent hover:border-orange-100">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Order Type Selection */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Order Method</h2>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${orderType === 'DELIVERY' ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm' : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-600'}`}
                >
                  <Truck className={`h-8 w-8 ${orderType === 'DELIVERY' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <span className="font-bold text-sm">Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('PICKUP')}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${orderType === 'PICKUP' ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm' : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-600'}`}
                >
                  <Store className={`h-8 w-8 ${orderType === 'PICKUP' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <span className="font-bold text-sm">Pickup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('DINE_IN')}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${orderType === 'DINE_IN' ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm' : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-600'}`}
                >
                  <Utensils className={`h-8 w-8 ${orderType === 'DINE_IN' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <span className="font-bold text-sm">Dine-in</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Your Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block font-semibold text-gray-700">Name</Label>
                    <Input
                      required
                      className="bg-gray-50 border-gray-200 h-12 rounded-xl focus:ring-orange-500/20"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block font-semibold text-gray-700">Phone</Label>
                    <Input
                      required
                      className="bg-gray-50 border-gray-200 h-12 rounded-xl focus:ring-orange-500/20"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+123..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="mb-2 block font-semibold text-gray-700">Email</Label>
                    <Input
                      required
                      type="email"
                      className="bg-gray-50 border-gray-200 h-12 rounded-xl focus:ring-orange-500/20"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {orderType === 'DELIVERY' && (
                  <div>
                    <Label className="mb-2 block font-semibold text-gray-700">Delivery Address</Label>
                    <textarea
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-orange-500/10 outline-none min-h-[100px] transition-all"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street, City, Zip Code"
                    />
                  </div>
                )}

                <div>
                  <Label className="mb-2 block font-semibold text-gray-700">Notes (Optional)</Label>
                  <textarea
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Allergies, door codes, etc."
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Payment Method</h2>
                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'CARD' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="CARD"
                      checked={formData.paymentMethod === 'CARD'}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="accent-orange-600 h-5 w-5"
                    />
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-gray-800">Credit / Debit Card</span>
                    {formData.paymentMethod === 'CARD' && <CheckCircle2 className="ml-auto h-5 w-5 text-orange-600" />}
                  </label>
                  <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'MOMO' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="MOMO"
                      checked={formData.paymentMethod === 'MOMO'}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="accent-orange-600 h-5 w-5"
                    />
                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-gray-800">MTN Mobile Money</span>
                    {formData.paymentMethod === 'MOMO' && <CheckCircle2 className="ml-auto h-5 w-5 text-orange-600" />}
                  </label>
                  <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'PAYPAL' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="PAYPAL"
                      checked={formData.paymentMethod === 'PAYPAL'}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="accent-orange-600 h-5 w-5"
                    />
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-gray-800">PayPal</span>
                    {formData.paymentMethod === 'PAYPAL' && <CheckCircle2 className="ml-auto h-5 w-5 text-orange-600" />}
                  </label>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 sticky top-24 shadow-lg shadow-orange-500/5">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h3>
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600"><span className="font-bold text-gray-900">{item.quantity}x</span> {item.name}</span>
                    <span className="font-semibold text-gray-900">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3 text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
                </div>
                {orderType === 'DELIVERY' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-gray-900">$2.00</span>
                  </div>
                )}
                <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between font-extrabold text-gray-900 text-xl">
                  <span>Total</span>
                  <span className="text-orange-600">${(total + (orderType === 'DELIVERY' ? 2 : 0)).toFixed(2)}</span>
                </div>
              </div>

              <Button
                form="checkout-form"
                disabled={submitting}
                className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white py-7 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-orange-500/20 hover:-translate-y-1"
              >
                {submitting ? 'Processing...' : `Place ${orderType === 'DELIVERY' ? 'Delivery' : 'Order'}`}
              </Button>

              <p className="mt-6 text-xs text-center text-gray-400">
                Data is encrypted and secured.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
