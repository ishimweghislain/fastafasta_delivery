import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName, customerEmail, customerPhone,
      items, type,
      address, // For Delivery
      paymentMethod,
      notes
    } = body

    if (!customerEmail || !customerPhone || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Find or Create Customer
    let customer = await prisma.customer.findUnique({
      where: { email: customerEmail }
    })

    if (!customer) {
      // Check phone
      customer = await prisma.customer.findUnique({
        where: { phone: customerPhone }
      })
    }

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: customerEmail,
          phone: customerPhone,
          name: customerName
        }
      })
    }

    // 2. Calculate Total
    let totalAmount = 0
    // Verify prices from DB
    const foodIds = items.map((i: any) => i.foodId || i.id)
    const foods = await prisma.food.findMany({
      where: { id: { in: foodIds } }
    })

    const orderItemsData = items.map((item: any) => {
      const food = foods.find(f => f.id === (item.foodId || item.id))
      if (!food) throw new Error(`Food not found: ${item.foodId}`)
      const price = food.price
      const quantity = item.quantity || 1
      totalAmount += price * quantity
      return {
        foodId: food.id,
        quantity,
        price
      }
    })

    // 3. Create Order
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        totalAmount,
        status: 'PENDING',
        type: type || 'DINE_IN',
        notes,
        items: {
          create: orderItemsData
        }
      }
    })

    // 4. Create Delivery if needed
    if (type === 'DELIVERY' && address) {
      await prisma.delivery.create({
        data: {
          orderId: order.id,
          customerId: customer.id,
          address,
          status: 'PENDING',
          paymentMethod: paymentMethod || 'CARD' // logic mismatch in schema? fixed via delivery fields
        }
      })
    }

    // 5. Create Payment Record (Pending)
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        method: paymentMethod || 'CARD',
        status: 'PENDING'
      }
    })

    // 6. Create Chat for Order
    await prisma.chat.create({
      data: {
        orderId: order.id
      }
    })

    return NextResponse.json({ success: true, orderId: order.id })

  } catch (error) {
    console.error('Create Order Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
