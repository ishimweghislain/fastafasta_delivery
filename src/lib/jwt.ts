import { SignJWT, jwtVerify } from 'jose'

export type UserRole = 'ADMIN' | 'STAFF'

export interface JWTPayload {
    userId: string
    username: string
    role: UserRole
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')

export async function generateToken(payload: JWTPayload): Promise<string> {
    return new SignJWT({ ...payload, sub: payload.userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload as unknown as JWTPayload
    } catch (error) {
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
