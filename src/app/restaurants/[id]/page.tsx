'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, Clock, MapPin, ShoppingCart, Plus, Minus, Heart } from 'lucide-react'

interface Food {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  available: boolean
  category: {
    id: string
    name: string
  }
}

interface Restaurant {
  id: string
  name: string
  location: string
  description?: string
  logo?: string
  banner?: string
  enabled: boolean
  categories: {
    id: string
    name: string
  }[]
}

interface CartItem {
  food: Food
  quantity: number
}

export default function RestaurantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (params.id) {
      fetchRestaurantData()
      loadCart()
      loadFavorites()
    }
  }, [params.id])

  const fetchRestaurantData = async () => {
    try {
      const [restaurantRes, foodsRes] = await Promise.all([
        fetch(`/api/restaurants/${params.id}`),
        fetch(`/api/restaurants/${params.id}/foods`)
      ])

      if (restaurantRes.ok && foodsRes.ok) {
        const restaurantData = await restaurantRes.json()
        const foodsData = await foodsRes.json()
        
        setRestaurant(restaurantData)
        setFoods(foodsData)
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }

  const addToCart = (food: Food) => {
    const existingItem = cart.find(item => item.food.id === food.id)
    let newCart: CartItem[]

    if (existingItem) {
      newCart = cart.map(item =>
        item.food.id === food.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      newCart = [...cart, { food, quantity: 1 }]
    }

    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeFromCart = (foodId: string) => {
    const newCart = cart.filter(item => item.food.id !== foodId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
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

  const toggleFavorite = (restaurantId: string) => {
    let newFavorites: string[]
    if (favorites.includes(restaurantId)) {
      newFavorites = favorites.filter(id => id !== restaurantId)
    } else {
      newFavorites = [...favorites, restaurantId]
    }
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartItemQuantity = (foodId: string) => {
    const item = cart.find(item => item.food.id === foodId)
    return item ? item.quantity : 0
  }

  const filteredFoods = selectedCategory === 'all' 
    ? foods 
    : foods.filter(food => food.category.id === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-64 bg-muted"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant not found</h1>
          <Link href="/restaurants" className="text-primary hover:underline">
            ← Back to restaurants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary">
                🍔 FastaFasta
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/restaurants" className="text-foreground hover:text-primary">
                Restaurants
              </Link>
              <Link href="/favorites" className="text-foreground hover:text-primary">
                Favorites
              </Link>
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-foreground" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </Link>
              <Link href="/admin/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Restaurant Header */}
      <div className="bg-linear-to-r from-emerald-500 to-teal-600 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative">
          <div className="text-white">
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center space-x-2 hover:opacity-80"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg opacity-90">{restaurant.description}</p>
          </div>
          <button
            onClick={() => toggleFavorite(restaurant.id)}
            className="absolute top-8 right-8 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30"
          >
            <Heart 
              className={`h-6 w-6 ${favorites.includes(restaurant.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} 
            />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Menu</h2>
            
            {/* Category Filter */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                All Items
              </button>
              {restaurant.categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Food Items */}
            <div className="space-y-4">
              {filteredFoods.map(food => {
                const quantity = getCartItemQuantity(food.id)
                return (
                  <div key={food.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                          {food.image ? (
                            <img src={food.image} alt={food.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-2xl">🍽️</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{food.name}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{food.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-primary">${food.price.toFixed(2)}</span>
                            {!food.available && (
                              <span className="text-sm text-muted-foreground">Unavailable</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {food.available && (
                      <div className="flex items-center space-x-2 ml-4">
                        {quantity > 0 ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(food.id, quantity - 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(food.id, quantity + 1)}
                              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(food)}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center space-x-2"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Restaurant Info & Cart Summary */}
          <div className="space-y-6">
            {/* Restaurant Info */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Restaurant Info</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {restaurant.location}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  25-35 min delivery
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 mr-2 text-yellow-500 fill-current" />
                  4.5 (120 reviews)
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="border rounded-lg p-6 sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Your Cart</h3>
                <div className="space-y-2 mb-4">
                  {cart.map(item => (
                    <div key={item.food.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.food.name}</span>
                      <span>${(item.food.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold mb-4">
                    <span>Total</span>
                    <span>${cart.reduce((total, item) => total + (item.food.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                  <Link href="/checkout" className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 block text-center">
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
