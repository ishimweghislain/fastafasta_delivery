'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChatBox } from '@/components/chat-box'
import { Check, Clock, Truck, ChefHat, ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export default function TrackingPage() {
    const params = useParams()
    const orderId = params.id as string
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${orderId}`)
                if (res.ok) {
                    setOrder(await res.json())
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
        const interval = setInterval(fetchOrder, 10000) // Poll order status
        return () => clearInterval(interval)
    }, [orderId])

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading order details...</div>
    if (!order) return <div className="min-h-screen bg-background flex items-center justify-center text-destructive">Order not found.</div>

    return (
        <div className="min-h-screen bg-background text-foreground py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back Home
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        <Card className="p-8 border shadow-sm bg-card">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">Order #{order.id.slice(-6)}</h1>
                                    <p className="text-muted-foreground">Thank you for your order, {order.customerName}</p>
                                </div>
                                <Badge variant="outline" className={`text-lg px-4 py-1 uppercase ${getStatusColor(order.status)}`}>
                                    {order.status.replace('_', ' ')}
                                </Badge>
                            </div>

                            <div className="bg-muted/30 p-6 rounded-xl border border-dashed text-center">
                                <OrderStatusStepper status={order.status} />
                            </div>
                        </Card>

                        <Card className="p-8 border shadow-sm bg-card">
                            <h2 className="text-xl font-bold mb-6">Order Details</h2>
                            <div className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-0 border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {item.quantity}x
                                            </div>
                                            <span className="font-medium">{item.food.name}</span>
                                        </div>
                                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center font-bold mt-6 pt-6 border-t border-border text-2xl">
                                <span>Total</span>
                                <span className="text-primary">${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </Card>

                        {order.type === 'DELIVERY' && order.delivery && (
                            <Card className="p-6 border shadow-sm bg-card">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-muted-foreground" /> Delivery Address
                                </h3>
                                <p className="text-muted-foreground ml-7">{order.delivery.address}</p>
                            </Card>
                        )}
                    </div>

                    <div className="w-full lg:w-[400px]">
                        <div className="sticky top-8">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                Live Support
                            </h3>
                            <div className="border rounded-2xl overflow-hidden shadow-sm bg-card h-[600px] flex flex-col">
                                <ChatBox orderId={orderId} senderType="CUSTOMER" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function getStatusColor(status: string) {
    switch (status) {
        case 'PENDING': return 'bg-orange-100 text-orange-700 border-orange-200'
        case 'ACCEPTED': return 'bg-blue-100 text-blue-700 border-blue-200'
        case 'PREPARING': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
        case 'DELIVERING': return 'bg-purple-100 text-purple-700 border-purple-200'
        case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200'
        default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
}

function OrderStatusStepper({ status }: { status: string }) {
    const steps = [
        { key: 'PENDING', label: 'Placed', icon: Clock },
        { key: 'ACCEPTED', label: 'Accepted', icon: Check },
        { key: 'PREPARING', label: 'Cooking', icon: ChefHat },
        { key: 'DELIVERING', label: 'Delivering', icon: Truck },
        { key: 'COMPLETED', label: 'Delivered', icon: Check },
    ]

    const currentIndex = steps.findIndex(s => s.key === status)
    const activeIndex = currentIndex === -1 ? 0 : currentIndex // Default to 0 if status not found

    return (
        <div className="flex justify-between items-center relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full" />
            <div
                className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, index) => {
                const isActive = index <= activeIndex
                const isCurrent = index === activeIndex
                return (
                    <div key={step.key} className="flex flex-col items-center gap-2 bg-background p-2 rounded-xl">
                        <div className={`
                            h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                            ${isActive ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg' : 'bg-background border-muted text-muted-foreground'}
                        `}>
                            <step.icon className="h-5 w-5" />
                        </div>
                        <span className={`text-xs font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</span>
                    </div>
                )
            })}
        </div>
    )
}
