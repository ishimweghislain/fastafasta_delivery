import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

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

    const restaurantId = user?.restaurant?.id

    if (!user || !restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Get dashboard stats
    const [
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalFoods,
      totalEmployees,
      recentOrders
    ] = await Promise.all([
      prisma.order.count({
        where: { restaurantId }
      }),
      prisma.order.aggregate({
        where: { 
          restaurantId,
          status: 'COMPLETED'
        },
        _sum: { totalAmount: true }
      }),
      prisma.order.count({
        where: { 
          restaurantId,
          status: 'PENDING'
        }
      }),
      prisma.food.count({
        where: { restaurantId }
      }),
      prisma.employee.count({
        where: { restaurantId }
      }),
      prisma.order.findMany({
        where: { restaurantId },
        include: {
          items: {
            include: {
              food: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      })
    ])

    const dashboardData = {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingOrders,
      totalFoods,
      totalEmployees,
      recentOrders
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
