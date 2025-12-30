'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Star, Clock, MapPin, Filter } from 'lucide-react'

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

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState('')

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants')
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data)
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !filterLocation || 
                           restaurant.location.toLowerCase().includes(filterLocation.toLowerCase())
    return matchesSearch && matchesLocation
  })

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
        <h1 className="text-3xl font-semibold tracking-tight mb-8">All Restaurants</h1>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder:text-zinc-400 outline-none ring-0 transition focus:border-white/20 focus:bg-white/10"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by location..."
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder:text-zinc-400 outline-none ring-0 transition focus:border-white/20 focus:bg-white/10 md:w-64"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-zinc-400">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Restaurants Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-300 text-lg">No restaurants found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`}>
                <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl">
                  <div className="bg-linear-to-tr from-orange-400/20 to-red-600/20">
                    {restaurant.logo && (
                      <div className="absolute top-4 left-4 h-12 w-12 bg-white rounded-full p-2">
                        <img 
                          src={restaurant.logo} 
                          alt={restaurant.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
