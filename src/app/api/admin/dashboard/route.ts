import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeaders(request.headers) ||
      request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get dashboard stats (Global)
    const [
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalFoods,
      totalEmployees,
      recentOrders
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED'
        },
        _sum: { totalAmount: true }
      }),
      prisma.order.count({
        where: {
          status: 'PENDING'
        }
      }),
      prisma.food.count(),
      prisma.employee.count(),
      prisma.order.findMany({
        include: {
          items: {
            include: {
              food: true
            }
          },
          customer: true
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
      recentOrders: recentOrders.map(order => ({
        ...order,
        customerName: order.customer.name || order.customer.email || 'Unknown'
      }))
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
