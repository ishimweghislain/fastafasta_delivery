import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                items: { include: { food: true } },
                delivery: true,
                customer: true,
                chat: { include: { messages: true } }
            }
        })
        return NextResponse.json(order)
    } catch (e) { return NextResponse.json({}, { status: 500 }) }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = getTokenFromHeaders(request.headers) || request.cookies.get('admin_token')?.value
        if (!token || !(await verifyToken(token))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { status } = body

        const order = await prisma.order.update({
            where: { id: params.id },
            data: { status }
        })

        if (status === 'DELIVERING' && order.type === 'DELIVERY') {
            const delivery = await prisma.delivery.findUnique({ where: { orderId: params.id } })
            if (delivery) {
                await prisma.delivery.update({
                    where: { id: delivery.id },
                    data: { status: 'ON_THE_WAY' }
                })
            }
        }
        if (status === 'COMPLETED' && order.type === 'DELIVERY') {
            const delivery = await prisma.delivery.findUnique({ where: { orderId: params.id } })
            if (delivery) {
                await prisma.delivery.update({
                    where: { id: delivery.id },
                    data: { status: 'DELIVERED' }
                })
            }
        }

        return NextResponse.json(order)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
