export interface LoginInput {
  username: string
  password: string
}

export interface FoodCategoryInput {
  name: string
}

export interface FoodInput {
  name: string
  description?: string
  price: number
  image?: string
  available?: boolean
  categoryId: string
  prepTime?: number
}

export interface OrderInput {
  customerName: string
  customerEmail: string
  customerPhone: string
  address?: string
  notes?: string
  items: {
    foodId: string
    quantity: number
  }[]
  type?: 'DELIVERY' | 'PICKUP' | 'DINE_IN'
  paymentMethod?: string
}

export interface EmployeeInput {
  name: string
  email?: string
  phone?: string
  position: string
  salary: number
}

export interface MessageInput {
  content: string
}
