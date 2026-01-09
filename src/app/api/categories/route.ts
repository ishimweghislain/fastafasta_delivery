import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const categories = await prisma.foodCategory.findMany({
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    // Add auth check here if needed
    const body = await request.json()
    const { name } = body
    const category = await prisma.foodCategory.create({
        data: { name }
    })
    return NextResponse.json(category)
}
