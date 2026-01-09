'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        if (pathname === '/admin/login') {
            setIsAuthorized(true)
            return
        }

        const token = localStorage.getItem('admin_token')
        if (!token) {
            router.push('/admin/login')
        } else {
            setIsAuthorized(true)
        }
    }, [pathname, router])

    if (!isAuthorized) {
        return null
    }

    if (pathname === '/admin/login') {
        return <div className="min-h-screen bg-background text-foreground">{children}</div>
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <AdminSidebar />
            <main className="flex-1 overflow-auto bg-muted/10">
                {children}
            </main>
        </div>
    )
}
