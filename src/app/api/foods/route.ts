import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const categoryId = searchParams.get('categoryId')

        const foods = await prisma.food.findMany({
            where: categoryId ? { categoryId } : {},
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(foods)
    } catch (error) {
        console.error('Error fetching foods:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        // Auth Check
        const token = getTokenFromHeaders(request.headers) || request.cookies.get('admin_token')?.value
        if (!token || !(await verifyToken(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, description, price, image, categoryId, prepTime } = body

        if (!name || !price || !categoryId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const food = await prisma.food.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
                categoryId,
                prepTime: prepTime ? parseInt(prepTime) : undefined,
            }
        })

        return NextResponse.json(food)
    } catch (error) {
        console.error('Error creating food:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
