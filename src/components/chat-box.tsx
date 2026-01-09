'use client'

import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'

interface Message {
    id: string
    content: string
    sender: 'CUSTOMER' | 'ADMIN'
    createdAt: string
}

export function ChatBox({ orderId, senderType }: { orderId: string, senderType: 'CUSTOMER' | 'ADMIN' }) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchMessages()
        const interval = setInterval(fetchMessages, 3000) // Polling every 3s
        return () => clearInterval(interval)
    }, [orderId])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const fetchMessages = async () => {
        const res = await fetch(`/api/chats/${orderId}`)
        if (res.ok) {
            const data = await res.json()
            if (data.messages) {
                // Only update if different count to avoid flicker/loops? Or simplified:
                setMessages(data.messages)
            }
        }
    }

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        try {
            const res = await fetch(`/api/chats/${orderId}`, {
                method: 'POST',
                body: JSON.stringify({
                    content: input,
                    sender: senderType
                })
            })
            if (res.ok) {
                setInput('')
                fetchMessages()
            }
        } catch (error) {
            console.error('Failed to send', error)
        }
    }

    return (
        <div className="flex flex-col h-[400px] border border-white/10 rounded-xl bg-black/20 overflow-hidden">
            <div className="bg-white/5 p-3 border-b border-white/10 font-semibold text-sm">
                Order Chat
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                    <p className="text-zinc-500 text-center text-sm my-auto">No messages yet.</p>
                )}
                {messages.map((msg) => {
                    const isMe = msg.sender === senderType
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${isMe
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-zinc-700 text-zinc-200'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    )
                })}
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
                <input
                    className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-emerald-500"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="p-2 bg-emerald-600 rounded-lg text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    )
}
