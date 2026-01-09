'use client'

import { useState, useEffect } from 'react'

export default function DeliveriesPage() {
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        // Reuse orders API but filter locally or create dedicated endpoint
        // Assuming GET /api/admin/orders includes delivery info
        fetch('/api/admin/orders').then(r => r.json()).then(data => {
            setOrders(data.filter((o: any) => o.type === 'DELIVERY'))
        })
    }, [])

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Delivery Management</h1>
            <div className="bg-card border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted">
                        <tr>
                            <th className="p-3">Order #</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Address</th>
                            <th className="p-3">Delivery Status</th>
                            <th className="p-3">Driver</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id} className="border-b">
                                <td className="p-3">#{o.id.slice(-6)}</td>
                                <td className="p-3">{o.customer.name}</td>
                                <td className="p-3">{o.delivery?.address}</td>
                                <td className="p-3">
                                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 font-bold text-xs">
                                        {o.delivery?.status || o.status}
                                    </span>
                                </td>
                                <td className="p-3 italic text-muted-foreground">Unassigned</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
