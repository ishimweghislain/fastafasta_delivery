import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

export async function GET(request: NextRequest) {
    const settings = await prisma.restaurantSettings.findFirst()
    return NextResponse.json(settings)
}

export async function PUT(request: NextRequest) {
    const token = getTokenFromHeaders(request.headers) || request.cookies.get('admin_token')?.value
    if (!token || !(await verifyToken(token))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    // handle upsert
    const settings = await prisma.restaurantSettings.findFirst()
    const updated = await prisma.restaurantSettings.upsert({
        where: { id: settings?.id || 'new' }, // 'new' relies on DB logic if ID is uuid()
        create: body,
        update: body
    })
    return NextResponse.json(updated)
}
