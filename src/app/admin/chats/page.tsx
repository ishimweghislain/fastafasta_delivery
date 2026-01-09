'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ChatsPage() {
    const [chats, setChats] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/admin/chats').then(r => r.json()).then(setChats)
    }, [])

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Support Chats</h1>
            <div className="bg-card border rounded-lg overflow-hidden">
                {chats.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No active chats.</div>
                ) : (
                    <div className="divide-y">
                        {chats.map(chat => (
                            <Link key={chat.id} href={`/admin/orders/${chat.orderId}`} className="block p-4 hover:bg-muted/50 transition">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold">{chat.order?.customer?.name || 'Unknown Customer'}</span>
                                    <span className="text-xs text-muted-foreground">{new Date(chat.updatedAt).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-foreground/80 truncate max-w-md">
                                        {chat.messages[0]?.content || 'Start of conversation'}
                                    </p>
                                    <span className="text-xs bg-muted px-2 py-1 rounded">Order #{chat.order?.id.slice(-6)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
