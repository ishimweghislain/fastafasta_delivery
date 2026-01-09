'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewFoodPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        image: '',
        prepTime: ''
    })

    useEffect(() => {
        fetch('/api/categories').then(res => res.json()).then(setCategories)
    }, [])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        setUploading(true)
        const file = e.target.files[0]
        const data = new FormData()
        data.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            })
            if (res.ok) {
                const json = await res.json()
                setFormData(prev => ({ ...prev, image: json.url }))
            } else {
                alert('Upload failed')
            }
        } catch (err) {
            console.error(err)
            alert('Upload error')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/foods', {
                method: 'POST',
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                router.push('/admin/foods')
            } else {
                alert('Failed to create food')
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Link href="/admin/foods" className="flex items-center text-muted-foreground mb-6 hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Foods
            </Link>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h1 className="text-2xl font-bold mb-6">Add New Food</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Simba Burger"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="w-full min-h-[100px] border border-input rounded-md px-3 py-2 bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the dish..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prepTime">Prep Time (mins)</Label>
                                <Input
                                    id="prepTime"
                                    type="number"
                                    value={formData.prepTime}
                                    onChange={e => setFormData({ ...formData, prepTime: e.target.value })}
                                    placeholder="15"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                required
                                className="w-full h-10 border border-input rounded-md px-3 bg-background text-sm"
                                value={formData.categoryId}
                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <Label>Food Image</Label>

                            <div className="flex items-center gap-4">
                                <div className="relative w-32 h-32 bg-muted rounded-xl flex items-center justify-center border border-dashed border-muted-foreground/30 overflow-hidden">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="mb-2"
                                        disabled={uploading}
                                    />
                                    <p className="text-xs text-muted-foreground">Upload a JPG, PNG or WEBP image.</p>
                                    {uploading && (
                                        <div className="flex items-center gap-2 text-xs text-primary mt-2">
                                            <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Hidden URL input fallback or debugging */}
                            <Input
                                type="hidden"
                                value={formData.image}
                                name="image_url"
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={loading || uploading} className="w-full">
                        {loading ? 'Creating...' : 'Create Food Item'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
