import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const available = searchParams.get('available')

    const foods = await prisma.food.findMany({
      where: {
        restaurantId: params.id,
        categoryId: categoryId || undefined,
        available: available === 'false' ? false : true,
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(foods)
  } catch (error) {
    console.error('Error fetching foods:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, price, image, available, categoryId } = body

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      )
    }

    const food = await prisma.food.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        available: available !== false,
        categoryId,
        restaurantId: params.id,
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(food, { status: 201 })
  } catch (error) {
    console.error('Error creating food:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
