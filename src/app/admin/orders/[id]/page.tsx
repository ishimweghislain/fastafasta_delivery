'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChatBox } from '@/components/chat-box'
import { ArrowLeft, Printer } from 'lucide-react'
import Link from 'next/link'

export default function AdminOrderDetailPage() {
    const { id } = useParams()
    const [order, setOrder] = useState<any>(null)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        fetchOrder()
    }, [])

    const fetchOrder = async () => {
        const res = await fetch(`/api/orders/${id}`)
        if (res.ok) setOrder(await res.json())
    }

    const updateStatus = async (status: string) => {
        setUpdating(true)
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                fetchOrder()
            }
        } catch (e) { console.error(e) }
        finally { setUpdating(false) }
    }

    if (!order) return <div className="p-8">Loading...</div>

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/orders" className="p-2 hover:bg-muted rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold">Order #{order.id.slice(-6)}</h1>
                <div className="ml-auto flex gap-2">
                    <button className="px-4 py-2 border rounded-md hover:bg-muted flex items-center gap-2">
                        <Printer className="h-4 w-4" /> Print Receipt
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <span className="text-sm text-muted-foreground block">Customer</span>
                                <span className="font-medium">{order.customer.name}</span>
                                <div className="text-sm">{order.customer.phone}</div>
                                <div className="text-sm">{order.customer.email}</div>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground block">Status</span>
                                <span className="font-bold text-lg">{order.status}</span>
                            </div>
                        </div>

                        {order.type === 'DELIVERY' && order.delivery && (
                            <div className="bg-muted p-4 rounded-md mb-4">
                                <span className="text-sm font-bold block mb-1">Delivery Address</span>
                                <p>{order.delivery.address}</p>
                            </div>
                        )}

                        <table className="w-full text-sm mt-4">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-2 text-left">Item</th>
                                    <th className="p-2 text-right">Qty</th>
                                    <th className="p-2 text-right">Price</th>
                                    <th className="p-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item: any) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-2">{item.food.name}</td>
                                        <td className="p-2 text-right">{item.quantity}</td>
                                        <td className="p-2 text-right">${item.price}</td>
                                        <td className="p-2 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} className="p-2 text-right font-bold">Total Amount</td>
                                    <td className="p-2 text-right font-bold text-lg">${order.totalAmount.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <div className="mt-8">
                            <h3 className="font-semibold mb-3">Update Status</h3>
                            <div className="flex flex-wrap gap-2">
                                {['ACCEPTED', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED', 'CANCELLED'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => updateStatus(s)}
                                        disabled={updating || order.status === s}
                                        className={`px-4 py-2 rounded-md text-sm font-medium border ${order.status === s
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background hover:bg-muted'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-card border rounded-lg overflow-hidden">
                        <ChatBox orderId={order.id} senderType="ADMIN" />
                    </div>
                </div>
            </div>
        </div>
    )
}
