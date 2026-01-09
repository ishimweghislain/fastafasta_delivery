'use client'

import { useState, useEffect } from 'react'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MenuPage() {
    const [foods, setFoods] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState<string>('all')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [foodsRes, catsRes] = await Promise.all([
                fetch('/api/foods'),
                fetch('/api/categories')
            ])

            if (foodsRes.ok) setFoods(await foodsRes.json())
            if (catsRes.ok) setCategories(await catsRes.json())
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
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
        // Dispatch event for Header to update
        window.dispatchEvent(new Event('cart-updated'))
    }

    const filteredFoods = activeCategory === 'all'
        ? foods
        : foods.filter(f => f.categoryId === activeCategory)

    return (
        <div className="min-h-screen bg-orange-50/30 text-foreground pb-20">
            {/* Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 px-4 shadow-lg">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">Our Menu</h1>
                    <p className="text-orange-100 text-lg font-medium opacity-90">Freshly prepared, just for you. Choose from our delicious categories below.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-12 flex flex-col md:flex-row gap-8">
                {/* Categories Sidebar */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="sticky top-24 space-y-3 bg-white p-4 rounded-2xl shadow-sm border border-orange-100">
                        <h3 className="font-bold text-gray-900 px-2 mb-2 uppercase text-xs tracking-wider">Categories</h3>
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${activeCategory === 'all' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' : 'hover:bg-orange-50 text-gray-600 hover:text-orange-700'}`}
                        >
                            All Items
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${activeCategory === cat.id ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' : 'hover:bg-orange-50 text-gray-600 hover:text-orange-700'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Food Grid */}
                <main className="flex-1">
                    {loading ? (
                        <div className="text-center py-20 text-muted-foreground">Loading menu...</div>
                    ) : filteredFoods.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground bg-white rounded-2xl border border-dashed border-gray-200">
                            No items found in this category.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredFoods.map(food => (
                                <div key={food.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 group hover:-translate-y-1">
                                    <div className="aspect-video relative bg-gray-100">
                                        {food.image ? (
                                            <img src={food.image} alt={food.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">No Image</div>
                                        )}
                                        {!food.available && (
                                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center text-destructive font-bold backdrop-blur-sm border-2 border-destructive m-2 rounded-xl">
                                                Sold Out
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-orange-600 transition-colors">{food.name}</h3>
                                            <span className="font-extrabold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">${food.price}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{food.description}</p>
                                        <Button
                                            onClick={() => addToCart(food)}
                                            disabled={!food.available}
                                            className="w-full rounded-xl font-bold shadow-md bg-orange-500 hover:bg-orange-600 text-white border-0 py-5"
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
