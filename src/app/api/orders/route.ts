import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { OrderInput } from '@/lib/validations'

// Local enum types to match schema
enum PaymentMethod {
  MOMO = 'MOMO',
  PAYPAL = 'PAYPAL',
  CARD = 'CARD'
}

enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')
    const status = searchParams.get('status')

    const orders = await prisma.order.findMany({
      where: {
        restaurantId: restaurantId || undefined,
        status: status as any || undefined,
      },
      include: {
        items: {
          include: {
            food: true
          }
        },
        restaurant: true,
        payments: true,
        chat: {
          include: {
            messages: {
              orderBy: {
                createdAt: 'asc'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderInput = await request.json()
    const { customerName, customerEmail, customerPhone, notes, items, restaurantId } = body

    if (!customerName || !items || items.length === 0 || !restaurantId) {
      return NextResponse.json(
        { error: 'Customer name, items, and restaurant ID are required' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const foodIds = items.map(item => item.foodId)
    const foods = await prisma.food.findMany({
      where: { id: { in: foodIds } }
    })

    const foodMap = foods.reduce((map, food) => {
      map[food.id] = food
      return map
    }, {} as Record<string, any>)

    let totalAmount = 0
    for (const item of items) {
      const food = foodMap[item.foodId]
      if (!food) {
        return NextResponse.json(
          { error: `Food with ID ${item.foodId} not found` },
          { status: 404 }
        )
      }
      totalAmount += food.price * item.quantity
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        notes,
        totalAmount,
        restaurantId,
        status: 'PENDING',
      },
      include: {
        items: {
          include: {
            food: true
          }
        },
        restaurant: true
      }
    })

    // Create order items
    for (const item of items) {
      const food = foodMap[item.foodId]
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          foodId: item.foodId,
          quantity: item.quantity,
          price: food.price,
        }
      })
    }

    // Create payment record (pending)
    await prisma.payment.create({
      data: {
        orderId: order.id,
        restaurantId,
        amount: totalAmount,
        method: (body.paymentMethod || 'CARD') as PaymentMethod,
        status: PaymentStatus.PENDING,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }
    })

    // Create chat for this order
    await prisma.chat.create({
      data: {
        orderId: order.id,
        restaurantId,
        customerName,
      }
    })

    // Fetch the complete order with all relations
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            food: true
          }
        },
        restaurant: true,
        payments: true,
        chat: true
      }
    })

    return NextResponse.json(completeOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
