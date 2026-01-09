import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const employees = await prisma.employee.findMany({
        orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(employees)
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, position, salary, email, phone } = body
        // @ts-ignore
        const emp = await prisma.employee.create({
            data: { name, position, salary: parseFloat(salary), email, phone }
        })
        return NextResponse.json(emp)
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        await prisma.employee.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, name, position, salary, email, phone } = body
        // @ts-ignore
        const emp = await prisma.employee.update({
            where: { id },
            data: { name, position, salary: parseFloat(salary), email, phone }
        })
        return NextResponse.json(emp)
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
