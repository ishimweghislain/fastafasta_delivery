import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

// Local enum types to match schema
enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  RESTAURANT_ADMIN = 'RESTAURANT_ADMIN'
}

enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  DELIVERING = 'DELIVERING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

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

enum MessageSender {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT = 'RESTAURANT'
}

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean existing data
  await prisma.message.deleteMany()
  await prisma.chat.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.order.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.salary.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.food.deleteMany()
  await prisma.foodCategory.deleteMany()
  await prisma.restaurant.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleaned existing data')

  // Create Super Admin
  const superAdminPassword = await bcrypt.hash('12345', 12)
  const superAdmin = await prisma.user.create({
    data: {
      username: 'danger',
      password: superAdminPassword,
      role: UserRole.SUPER_ADMIN,
    },
  })
  console.log('👑 Created Super Admin: danger')

  // Create Restaurants and Restaurant Admins
  const restaurants = [
    {
      name: 'Burger Palace',
      location: '123 Main Street, Downtown',
      description: 'Best burgers in town with fresh ingredients and unique recipes.',
      adminUsername: 'resto1',
      categories: [
        { name: 'Burgers' },
        { name: 'Sides' },
        { name: 'Drinks' },
        { name: 'Desserts' }
      ],
      foods: [
        { name: 'Classic Burger', description: 'Juicy beef patty with lettuce, tomato, and our special sauce', price: 12.99, category: 'Burgers' },
        { name: 'Cheese Burger', description: 'Classic burger with melted cheddar cheese', price: 14.99, category: 'Burgers' },
        { name: 'Bacon Burger', description: 'Classic burger topped with crispy bacon', price: 16.99, category: 'Burgers' },
        { name: 'French Fries', description: 'Crispy golden french fries with sea salt', price: 4.99, category: 'Sides' },
        { name: 'Onion Rings', description: 'Crispy breaded onion rings', price: 5.99, category: 'Sides' },
        { name: 'Coca Cola', description: 'Refreshing cola drink', price: 2.99, category: 'Drinks' },
        { name: 'Lemonade', description: 'Fresh squeezed lemonade', price: 3.99, category: 'Drinks' },
        { name: 'Chocolate Cake', description: 'Rich chocolate cake with frosting', price: 6.99, category: 'Desserts' },
      ]
    },
    {
      name: 'Pizza Express',
      location: '456 Oak Avenue, Westside',
      description: 'Authentic Italian pizza with fresh ingredients and traditional recipes.',
      adminUsername: 'resto2',
      categories: [
        { name: 'Pizza' },
        { name: 'Pasta' },
        { name: 'Salads' },
        { name: 'Beverages' }
      ],
      foods: [
        { name: 'Margherita Pizza', description: 'Classic pizza with tomato sauce, mozzarella, and basil', price: 18.99, category: 'Pizza' },
        { name: 'Pepperoni Pizza', description: 'Pizza topped with pepperoni and mozzarella', price: 20.99, category: 'Pizza' },
        { name: 'Hawaiian Pizza', description: 'Pizza with ham, pineapple, and mozzarella', price: 19.99, category: 'Pizza' },
        { name: 'Spaghetti Carbonara', description: 'Classic pasta with bacon, eggs, and parmesan', price: 15.99, category: 'Pasta' },
        { name: 'Penne Arrabiata', description: 'Spicy pasta with tomato sauce and chili', price: 14.99, category: 'Pasta' },
        { name: 'Caesar Salad', description: 'Fresh romaine lettuce with caesar dressing and croutons', price: 8.99, category: 'Salads' },
        { name: 'Greek Salad', description: 'Fresh vegetables with feta cheese and olives', price: 9.99, category: 'Salads' },
        { name: 'Mineral Water', description: 'Still mineral water', price: 1.99, category: 'Beverages' },
      ]
    }
  ]

  for (const restaurantData of restaurants) {
    // Create Restaurant Admin
    const adminPassword = await bcrypt.hash('12345', 12)
    const restaurantAdmin = await prisma.user.create({
      data: {
        username: restaurantData.adminUsername,
        password: adminPassword,
        role: UserRole.RESTAURANT_ADMIN,
      },
    })

    // Create Restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantData.name,
        location: restaurantData.location,
        description: restaurantData.description,
        adminId: restaurantAdmin.id,
      },
    })

    // Update Restaurant Admin with restaurant
    await prisma.user.update({
      where: { id: restaurantAdmin.id },
      data: { restaurant: { connect: { id: restaurant.id } } },
    })

    // Create Categories
    const categories = await Promise.all(
      restaurantData.categories.map(category =>
        prisma.foodCategory.create({
          data: {
            name: category.name,
            restaurantId: restaurant.id,
          },
        })
      )
    )

    // Create Foods
    for (const foodData of restaurantData.foods) {
      const category = categories.find(c => c.name === foodData.category)!
      await prisma.food.create({
        data: {
          name: foodData.name,
          description: foodData.description,
          price: foodData.price,
          categoryId: category.id,
          restaurantId: restaurant.id,
          available: true,
        },
      })
    }

    // Create Employees
    const employees = [
      { name: 'John Smith', role: 'Chef', salary: 3500 },
      { name: 'Sarah Johnson', role: 'Delivery', salary: 2500 },
      { name: 'Mike Wilson', role: 'Cashier', salary: 2000 },
    ]

    for (const empData of employees) {
      await prisma.employee.create({
        data: {
          name: empData.name,
          role: empData.role,
          salary: empData.salary,
          restaurantId: restaurant.id,
        },
      })
    }

    console.log(`🍽️ Created restaurant: ${restaurantData.name} with admin: ${restaurantData.adminUsername}`)
  }

  // Create some sample orders
  const burgerPalace = await prisma.restaurant.findFirst({ where: { name: 'Burger Palace' } })
  const pizzaExpress = await prisma.restaurant.findFirst({ where: { name: 'Pizza Express' } })

  if (burgerPalace) {
    const burgerFoods = await prisma.food.findMany({ 
      where: { restaurantId: burgerPalace.id },
      take: 3
    })

    if (burgerFoods.length > 0) {
      const order = await prisma.order.create({
        data: {
          customerName: 'Alice Johnson',
          customerEmail: 'alice@email.com',
          customerPhone: '+1234567890',
          totalAmount: 25.97,
          status: OrderStatus.COMPLETED,
          restaurantId: burgerPalace.id,
        },
      })

      for (let i = 0; i < Math.min(2, burgerFoods.length); i++) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            foodId: burgerFoods[i].id,
            quantity: 1,
            price: burgerFoods[i].price,
          },
        })
      }

      await prisma.payment.create({
        data: {
          orderId: order.id,
          restaurantId: burgerPalace.id,
          amount: order.totalAmount,
          method: PaymentMethod.CARD,
          status: PaymentStatus.COMPLETED,
          transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
        },
      })

      console.log('📦 Created sample order for Burger Palace')
    }
  }

  console.log('✅ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
