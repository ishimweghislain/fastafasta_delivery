export interface LoginInput {
  username: string
  password: string
}

export interface RestaurantInput {
  name: string
  location: string
  description?: string
  logo?: string
  banner?: string
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
}

export interface OrderInput {
  customerName: string
  customerEmail?: string
  customerPhone?: string
  notes?: string
  items: {
    foodId: string
    quantity: number
  }[]
  restaurantId: string
  paymentMethod?: string
}

export interface EmployeeInput {
  name: string
  email?: string
  phone?: string
  role: string
  salary: number
}

export interface MessageInput {
  content: string
}
