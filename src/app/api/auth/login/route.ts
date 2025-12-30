import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth'
import { LoginInput } from '@/lib/validations'

type Role = 'SUPER_ADMIN' | 'RESTAURANT_ADMIN'

type BootstrapAccount = {
  password: string
  role: Role
  restaurant?: { name: string; location: string; description?: string }
}

const BOOTSTRAP_ACCOUNTS: Record<string, BootstrapAccount> = {
  danger: {
    password: '12345',
    role: 'SUPER_ADMIN'
  },
  resto1: {
    password: '12345',
    role: 'RESTAURANT_ADMIN',
    restaurant: {
      name: 'Burger Palace',
      location: 'City Center',
      description: 'Juicy burgers, crispy fries, and fast service.'
    }
  },
  resto2: {
    password: '12345',
    role: 'RESTAURANT_ADMIN',
    restaurant: {
      name: 'Pizza Express',
      location: 'Downtown',
      description: 'Freshly baked pizzas, pasta, and more.'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginInput = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    let user = await prisma.user.findUnique({
      where: { username },
      include: {
        restaurant: true
      }
    })

    if (!user) {
      const bootstrap = BOOTSTRAP_ACCOUNTS[username]
      if (bootstrap && password === bootstrap.password) {
        const created = await prisma.user.create({
          data: {
            username,
            password: await hashPassword(bootstrap.password),
            role: bootstrap.role as any
          }
        })

        if (bootstrap.restaurant) {
          await prisma.restaurant.create({
            data: {
              name: bootstrap.restaurant.name,
              location: bootstrap.restaurant.location,
              description: bootstrap.restaurant.description,
              adminId: created.id
            }
          })
        }

        user = await prisma.user.findUnique({
          where: { id: created.id },
          include: { restaurant: true }
        })
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      restaurantId: user.restaurant?.id
    })

    const response = NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        restaurantId: user.restaurant?.id || null,
        restaurant: user.restaurant
      }
    })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)

    const isProd = process.env.NODE_ENV === 'production'
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      isProd ? { error: 'Internal server error' } : { error: 'Internal server error', details: message },
      { status: 500 }
    )
  }
}
