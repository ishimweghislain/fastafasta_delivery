import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
    try {
        const chat = await prisma.chat.findUnique({
            where: { orderId: params.orderId },
            include: {
                messages: { orderBy: { createdAt: 'asc' } }
            }
        })

        if (!chat) {
            // Create if missing?
            return NextResponse.json({ messages: [] })
        }

        return NextResponse.json(chat)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest, { params }: { params: { orderId: string } }) {
    try {
        const body = await request.json()
        const { content, sender } = body // Sender: 'CUSTOMER' or 'ADMIN'

        let chat = await prisma.chat.findUnique({
            where: { orderId: params.orderId }
        })

        if (!chat) {
            chat = await prisma.chat.create({
                data: { orderId: params.orderId }
            })
        }

        const message = await prisma.message.create({
            data: {
                chatId: chat.id,
                content,
                sender: sender // 'CUSTOMER' | 'ADMIN'
            }
        })

        return NextResponse.json(message)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
