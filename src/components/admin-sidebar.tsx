'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    Package,
    ShoppingCart,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    Truck
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('user_data')
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        router.push('/admin/login')
    }

    const links = [
        { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
        { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { href: '/admin/deliveries', icon: Truck, label: 'Deliveries' },
        { href: '/admin/foods', icon: Package, label: 'Foods' },
        { href: '/admin/chats', icon: MessageSquare, label: 'Chats' },
        { href: '/admin/employees', icon: Users, label: 'Employees' },
        { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ]

    return (
        <div className="w-64 bg-card border-r min-h-screen flex flex-col">
            <div className="p-6">
                <h2 className="text-xl font-bold text-primary mb-6">
                    SIMBA Admin
                </h2>
                <nav className="space-y-2">
                    {links.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition ${isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                    }`}
                            >
                                <link.icon className="h-5 w-5" />
                                <span>{link.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent text-red-500 w-full transition"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}
