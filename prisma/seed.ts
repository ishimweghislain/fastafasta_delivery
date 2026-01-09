import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Default Admin
  const hashedPassword = await bcrypt.hash('12345', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: hashedPassword },
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log({ admin })

  // 2. Create Restaurant Settings
  // Use deleteMany + create to ensure we reset to SIMBA defaults if needed, 
  // or use upsert if we had an ID. Since we want to ensure SIMBA settings exist:
  await prisma.restaurantSettings.deleteMany()
  const settings = await prisma.restaurantSettings.create({
    data: {
      name: 'SIMBA',
      description: 'The best food in town.',
      openingTime: '08:00',
      closingTime: '22:00',
    },
  })
  console.log({ settings })

  // 3. Create Basic Categories
  const categories = ['Fast Food', 'Drinks', 'Main Courses', 'Snacks']
  for (const cat of categories) {
    await prisma.foodCategory.upsert({
      where: { name: cat },
      update: {},
      create: { name: cat },
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
