'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Star, Truck, UtensilsCrossed, ShoppingBag, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RestaurantSettings {
  name: string
  description: string
  openingTime: string
  closingTime: string
  logo?: string
  banner?: string
}

export default function Home() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null)
  const [foods, setFoods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(res => res.json()),
      fetch('/api/foods').then(res => res.json())
    ]).then(([settingsData, foodsData]) => {
      setSettings(settingsData)
      // Store only available foods, maybe limit to 6 for home page
      setFoods(Array.isArray(foodsData) ? foodsData.filter((f: any) => f.available).slice(0, 6) : [])
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [])

  const scrollToProducts = () => {
    const section = document.getElementById('products')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const addToCart = (food: any) => {
    const raw = localStorage.getItem('cart')
    const cart = raw ? JSON.parse(raw) : []
    const existing = cart.find((i: any) => i.id === food.id)

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1
    } else {
      cart.push({ ...food, quantity: 1 })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    alert('Added to cart')
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 lg:pt-12">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-orange-100/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-rose-100/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 mb-6 transition-transform hover:scale-105">
              <Sparkles className="h-4 w-4" />
              <span>{settings ? `Welcome to ${settings.name}` : 'Welcome to SIMBA'}</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4">
              Taste the <span className="text-orange-500">Difference.</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              {settings?.description || 'Experience the finest dining in town. Fresh ingredients, authentic flavors, delivered right to your door.'}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-200">
              <Link
                href="/menu"
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full sm:w-auto h-auto px-8 py-5 text-lg font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105 hover:-translate-y-1">
                  Order Now <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button
                onClick={scrollToProducts}
                size="lg"
                className="w-full sm:w-auto h-auto px-8 py-5 text-lg font-bold rounded-xl bg-white text-orange-600 border-2 border-orange-100 hover:bg-orange-50 hover:border-orange-200 shadow-lg shadow-orange-500/10 transition-all hover:scale-105 hover:-translate-y-1"
              >
                View Our Products
              </Button>
            </div>

            {/* Stats/Features */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div>
                <div className="font-bold text-2xl text-foreground">30m</div>
                <div className="text-sm text-muted-foreground">Avg. Delivery</div>
              </div>
              <div>
                <div className="font-bold text-2xl text-foreground">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
              <div>
                <div className="font-bold text-2xl text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Fresh</div>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] animate-in fade-in slide-in-from-right-6 duration-700 delay-200 flex items-center">
            {/* Abstract Shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-200 rounded-full blur-3xl opacity-30 -z-10" />

            {/* Image Placeholder or Actual Image */}
            <div className="relative z-10 w-full flex items-center justify-center transform -translate-y-8 lg:-translate-y-12">
              {settings?.banner ? (
                <img src={settings.banner} alt="Restaurant Banner" className="rounded-3xl shadow-2xl object-cover max-h-[500px] w-full" />
              ) : (
                // Fallback visual
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 translate-y-8">
                    <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-xl border border-orange-100/50">
                      <img src="/appicon.jpg" alt="Food 1" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="aspect-[4/5] bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl overflow-hidden shadow-xl border border-orange-200/50 flex items-center justify-center">
                      <ShoppingBag className="h-16 w-16 text-orange-500/50" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-orange-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-orange-600 font-bold tracking-wider uppercase text-sm bg-orange-100 px-3 py-1 rounded-full">Our Menu</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Popular Dishes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore our top-rated dishes, crafted with passion and the finest ingredients.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading delicious items...</div>
          ) : foods.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground bg-white rounded-3xl border border-dashed border-gray-200">
              <p>No food items available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {foods.map((food, index) => (
                <div
                  key={food.id}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                    {food.image ? (
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-50">
                        <UtensilsCrossed className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <Button onClick={() => addToCart(food)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 shadow-lg border-0">
                        <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{food.name}</h3>
                      <span className="text-lg font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">${food.price}</span>
                    </div>
                    <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed mb-4">{food.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link href="/menu">
              <Button variant="outline" size="lg" className="rounded-full px-8 border-orange-200 text-orange-700 hover:bg-orange-50 text-lg h-14 font-semibold">
                View Full Menu <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-orange-50/50 p-8 rounded-2xl border border-orange-100/50 hover:bg-orange-50 transition-colors">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6 shadow-sm">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-500">We ensure your food arrives hot and fresh, right when you need it.</p>
            </div>
            <div className="bg-rose-50/50 p-8 rounded-2xl border border-rose-100/50 hover:bg-rose-50 transition-colors">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 mb-6 shadow-sm">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Expert Chefs</h3>
              <p className="text-gray-500">Our culinary team prepares every dish with passion and expertise.</p>
            </div>
            <div className="bg-indigo-50/50 p-8 rounded-2xl border border-indigo-100/50 hover:bg-indigo-50 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Premium Quality</h3>
              <p className="text-gray-500">We use only the finest ingredients to create unforgettable meals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">{settings?.name || 'SIMBA'}</h2>
          <p className="text-gray-500 mb-8">{settings?.description || 'The best food in town.'}</p>
          <div className="flex justify-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/menu" className="hover:text-orange-600 transition">Menu</Link>
            <Link href="/cart" className="hover:text-orange-600 transition">Cart</Link>
            <Link href="/admin/login" className="hover:text-orange-600 transition">Admin</Link>
          </div>
          <div className="mt-8 text-xs text-gray-400">
            © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
