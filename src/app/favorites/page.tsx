'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, ShoppingCart, ArrowLeft, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Food {
    id: string
    name: string
    description: string
    price: number
    image?: string
    categoryId: string
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Food[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Load favorites from local storage (ids) and then fetch details
        // For simplicity in this demo, we'll store full objects in LS or fetch all foods and filter.
        // Let's assume we store IDs in 'favoriteFoods'
        const loadFavorites = async () => {
            const favIds = JSON.parse(localStorage.getItem('favoriteFoods') || '[]')

            if (favIds.length === 0) {
                setFavorites([])
                setLoading(false)
                return
            }

            // Fetch all foods or verify existence. 
            // Since we don't have a bulk fetch by IDs endpoint efficiently yet without complex query,
            // we'll try to fetch all foods from accessible categories.
            // OPTIMIZATION: Just fetch from /api/foods logic on client side is hard without category.
            // We will assume for now we storing full objects in LS for speed or just IDs and we can't show details easily.
            // Let's change strategy: Store full object in LS for favorites to avoid n+1 requests.

            // If we only have IDs, we might be stuck. 
            // Let's rely on the user having stored full objects if they used the new menu.
            // If not, we might need a new API endpoint.
            // A simple implementation:

            // Let's check for 'favoriteFoods' which contains objects.
            const stored = localStorage.getItem('favoriteFoodsObjects')
            if (stored) {
                setFavorites(JSON.parse(stored))
            }
            setLoading(false)
        }

        loadFavorites()
    }, [])

    const removeFromFavorites = (id: string) => {
        const updated = favorites.filter(f => f.id !== id)
        setFavorites(updated)
        localStorage.setItem('favoriteFoodsObjects', JSON.stringify(updated))
        // Also update IDs list if we maintain it
        const ids = updated.map(f => f.id)
        localStorage.setItem('favoriteFoods', JSON.stringify(ids))
        window.dispatchEvent(new Event('favorites-updated'))
    }

    const addToCart = (food: Food) => {
        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]')
        const existingItem = currentCart.find((item: any) => item.foodId === food.id)

        if (existingItem) {
            existingItem.quantity += 1
        } else {
            currentCart.push({
                foodId: food.id,
                quantity: 1,
                // We might need price/name for display in cart if we don't fetch there
                price: food.price,
                name: food.name,
                image: food.image
            })
        }

        localStorage.setItem('cart', JSON.stringify(currentCart))
        window.dispatchEvent(new Event('cart-updated'))
        alert('Added to cart')
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 hover:bg-muted rounded-full transition">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-3xl font-bold">Your Favorites</h1>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-3xl">
                        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
                        <p className="text-muted-foreground mb-6">Start exploring our menu to add some!</p>
                        <Link href="/menu">
                            <Button>Browse Menu</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((food) => (
                            <div key={food.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
                                {food.image && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={food.image} alt={food.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                                    </div>
                                )}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{food.name}</h3>
                                        <span className="font-semibold text-primary">${food.price.toFixed(2)}</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{food.description}</p>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                                            onClick={() => removeFromFavorites(food.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            className="flex-1"
                                            onClick={() => addToCart(food)}
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
