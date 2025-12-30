import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const enabled = searchParams.get('enabled')
    
    const restaurants = await prisma.restaurant.findMany({
      where: {
        enabled: enabled === 'false' ? undefined : true
      },
      include: {
        _count: {
          select: {
            foods: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(restaurants)
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    const isProd = process.env.NODE_ENV === 'production'
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      isProd ? { error: 'Internal server error' } : { error: 'Internal server error', details: message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, location, description, logo, banner, adminId } = body

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Name and location are required' },
        { status: 400 }
      )
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        location,
        description,
        logo,
        banner,
        adminId,
      },
    })

    return NextResponse.json(restaurant, { status: 201 })
  } catch (error) {
    console.error('Error creating restaurant:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
