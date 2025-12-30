import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
      include: {
        categories: {
          orderBy: {
            name: 'asc'
          }
        },
        _count: {
          select: {
            foods: true
          }
        }
      }
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, location, description, logo, banner, enabled } = body

    const restaurant = await prisma.restaurant.update({
      where: { id: params.id },
      data: {
        name,
        location,
        description,
        logo,
        banner,
        enabled,
      },
    })

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Error updating restaurant:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.restaurant.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Restaurant deleted successfully' })
  } catch (error) {
    console.error('Error deleting restaurant:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
