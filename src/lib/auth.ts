import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export type UserRole = 'SUPER_ADMIN' | 'RESTAURANT_ADMIN'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export interface JWTPayload {
  userId: string
  username: string
  role: UserRole
  restaurantId?: string
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export function getTokenFromHeaders(headers: Headers): string | null {
  const authHeader = headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}
