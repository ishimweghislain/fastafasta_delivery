'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'

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

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setLoading(false)
  }

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId)
      return
    }

    const newCart = cart.map(item =>
      item.food.id === foodId
        ? { ...item, quantity }
        : item
    )
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeFromCart = (foodId: string) => {
    const newCart = cart.filter(item => item.food.id !== foodId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.food.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const groupByRestaurant = (items: CartItem[]) => {
    return items.reduce((groups, item) => {
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
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const groupedCart = groupByRestaurant(cart)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
            <Link href="/restaurants" className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {Object.entries(groupedCart).map(([restaurantId, group]) => (
                <div key={restaurantId} className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{group.restaurant.name}</h3>
                    <Link 
                      href={`/restaurants/${restaurantId}`}
                      className="text-primary hover:underline text-sm"
                    >
                      View Restaurant
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {group.items.map(item => (
                      <div key={item.food.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                            {item.food.image ? (
                              <img 
                                src={item.food.image} 
                                alt={item.food.name} 
                                className="w-full h-full object-cover rounded-lg" 
                              />
                            ) : (
                              <span className="text-2xl">🍽️</span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.food.name}</h4>
                            <p className="text-primary font-medium">${item.food.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.food.id)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={clearCart}
                  className="text-destructive hover:underline"
                >
                  Clear Cart
                </button>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Subtotal ({getTotalItems()} items)</p>
                  <p className="text-2xl font-bold">${getTotalPrice().toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 sticky top-4">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>$2.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>$1.99</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${(getTotalPrice() + 2.99 + 1.99).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-md hover:bg-primary/90 block text-center font-medium"
                >
                  Proceed to Checkout
                </Link>
                
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  <p>Estimated delivery: 25-35 minutes</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
