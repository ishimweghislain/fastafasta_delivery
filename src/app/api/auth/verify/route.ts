import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeaders(request.headers) || 
                  request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        restaurant: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        restaurantId: user.restaurant?.id || null,
        restaurant: user.restaurant
      }
    })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
