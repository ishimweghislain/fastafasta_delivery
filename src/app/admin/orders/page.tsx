'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/admin/orders')
            .then(res => res.json())
            .then(setOrders)
            .catch(console.error)
    }, [])

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
            <p className="text-muted-foreground mb-8">Track and manage customer orders.</p>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                        <tr>
                            <th className="p-4 pl-6">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right pr-6">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                                <td className="p-4 pl-6 font-mono text-xs text-muted-foreground">#{order.id.slice(-6)}</td>
                                <td className="p-4">
                                    <div className="font-semibold text-foreground">{order.customerName}</div>
                                    <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                                </td>
                                <td className="p-4">
                                    <Badge variant="outline" className="font-normal bg-background">
                                        {order.type}
                                    </Badge>
                                </td>
                                <td className="p-4 font-bold text-lg text-primary">${order.totalAmount.toFixed(2)}</td>
                                <td className="p-4">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="p-4 text-muted-foreground text-xs">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md">
                                        <Eye className="h-4 w-4" /> View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: 'bg-orange-100 text-orange-700 border-orange-200',
        ACCEPTED: 'bg-blue-100 text-blue-700 border-blue-200',
        PREPARING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        DELIVERING: 'bg-purple-100 text-purple-700 border-purple-200',
        COMPLETED: 'bg-green-100 text-green-700 border-green-200',
        CANCELLED: 'bg-red-100 text-red-700 border-red-200',
        REJECTED: 'bg-red-100 text-red-700 border-red-200'
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
            {status}
        </span>
    )
}
