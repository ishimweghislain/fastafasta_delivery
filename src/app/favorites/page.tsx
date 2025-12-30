'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Star, Clock, MapPin, Heart } from 'lucide-react'

interface Restaurant {
  id: string
  name: string
  location: string
  description?: string
  logo?: string
  banner?: string
  enabled: boolean
  _count: {
    foods: number
  }
}

export default function FavoritesPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadFavorites()
    fetchFavoriteRestaurants()
  }, [])

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }

  const fetchFavoriteRestaurants = async () => {
    try {
      const savedFavorites = localStorage.getItem('favorites')
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites)
        
        if (favoriteIds.length > 0) {
          const response = await fetch('/api/restaurants')
          if (response.ok) {
            const allRestaurants = await response.json()
            const favoriteRestaurants = allRestaurants.filter((restaurant: Restaurant) => 
              favoriteIds.includes(restaurant.id)
            )
            setRestaurants(favoriteRestaurants)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching favorite restaurants:', error)
    } finally {
      setLoading(false)
    }
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
    
    // Update the restaurants list
    if (newFavorites.includes(restaurantId)) {
      // Add to favorites - need to fetch the restaurant
      fetchRestaurantById(restaurantId)
    } else {
      // Remove from favorites
      setRestaurants(restaurants.filter(r => r.id !== restaurantId))
    }
  }

  const fetchRestaurantById = async (restaurantId: string) => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`)
      if (response.ok) {
        const restaurant = await response.json()
        setRestaurants(prev => [...prev, restaurant])
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error)
    }
  }

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="container mx-auto px-4 py-10">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <div className="h-48 bg-muted"></div>
                  <div className="p-4">
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Your Favorite Restaurants</h1>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder:text-zinc-400 outline-none transition focus:border-white/20 focus:bg-white/10"
            />
          </div>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-white/10">
              <Heart className="h-12 w-12 text-zinc-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              {searchTerm ? 'No matching favorites found' : 'No favorite restaurants yet'}
            </h2>
            <p className="text-zinc-300 mb-6">
              {searchTerm 
                ? 'Try searching for something else or browse all restaurants.'
                : 'Start adding restaurants to your favorites to see them here!'
              }
            </p>
            <Link href="/restaurants" className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-zinc-400">
                {filteredRestaurants.length} favorite{filteredRestaurants.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl">
                  <div className="relative h-48 bg-gradient-to-tr from-emerald-500/15 via-white/5 to-indigo-500/15">
                    <button
                      onClick={() => toggleFavorite(restaurant.id)}
                      className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm p-2 rounded-full ring-1 ring-white/15 transition hover:bg-white/15"
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{restaurant.name}</h3>
                    <p className="text-zinc-300 text-sm mb-3 line-clamp-2">
                      {restaurant.description || 'Delicious food waiting for you!'}
                    </p>
                    <div className="flex items-center text-sm text-zinc-400 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {restaurant.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm">4.5</span>
                      </div>
                      <div className="flex items-center text-sm text-zinc-400">
                        <Clock className="h-4 w-4 mr-1" />
                        25-35 min
                      </div>
                      <div className="text-sm text-zinc-400">
                        {restaurant._count.foods} items
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link 
                        href={`/restaurants/${restaurant.id}`}
                        className="w-full block text-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        View Menu
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
