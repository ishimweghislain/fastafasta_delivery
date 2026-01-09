'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash, ToggleLeft, ToggleRight, Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export default function FoodsPage() {
    const [foods, setFoods] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchFoods()
    }, [])

    const fetchFoods = async () => {
        const res = await fetch('/api/foods')
        if (res.ok) {
            setFoods(await res.json())
        }
        setLoading(false)
    }

    const deleteFood = async (id: string) => {
        if (!confirm('Are you sure you want to delete this food item?')) return
        // Assuming we add a DELETE endpoint logic in route.ts or handle it here
        // For now, let's assume we would wire it up eventually. 
        // Currently API doesn't fully support DELETE on this resource without modification, but sticking to UI request.
        alert('Delete functionality to be implemented in API')
    }

    // Toggle availability could be another feature to add
    const toggleAvailability = async (food: any) => {
        // Placeholder for update logic
        alert(`Toggling availability for ${food.name}`)
    }

    const filteredFoods = foods.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.category?.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Food Menu</h1>
                    <p className="text-muted-foreground mt-1">Manage your restaurant's menu items.</p>
                </div>
                <Link href="/admin/foods/new">
                    <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
                        <Plus className="h-4 w-4" />
                        Add New Item
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 bg-background p-1 rounded-xl w-full sm:w-96 border border-input focus-within:ring-2 ring-primary/20 transition-all">
                <Search className="h-4 w-4 text-muted-foreground ml-3" />
                <input
                    placeholder="Search foods..."
                    className="flex-1 bg-transparent border-none outline-none h-9 text-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <Card className="border shadow-sm overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="bg-muted/50 [&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Item</th>
                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Price</th>
                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0 bg-card">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <span>Loading menu...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredFoods.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No menu items found.</td></tr>
                            ) : (
                                filteredFoods.map((food) => (
                                    <tr key={food.id} className="border-b transition-colors hover:bg-muted/10">
                                        <td className="p-4 px-6 align-middle">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-muted border overflow-hidden shrink-0">
                                                    {food.image ? (
                                                        <img src={food.image} alt={food.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground bg-secondary">No img</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{food.name}</div>
                                                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">{food.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 px-6 align-middle">
                                            <Badge variant="secondary" className="font-normal">{food.category?.name || 'Uncategorized'}</Badge>
                                        </td>
                                        <td className="p-4 px-6 align-middle font-semibold text-primary">${food.price}</td>
                                        <td className="p-4 px-6 align-middle">
                                            <Badge variant={food.available ? "default" : "destructive"} className="hover:bg-primary/80">
                                                {food.available ? 'Available' : 'Unavailable'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 px-6 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => toggleAvailability(food)} title="Toggle Availability">
                                                    {food.available ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                                                </Button>
                                                <Button size="icon" variant="ghost" className="hover:text-blue-600 hover:bg-blue-50">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="hover:text-red-600 hover:bg-red-50" onClick={() => deleteFood(food.id)}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
