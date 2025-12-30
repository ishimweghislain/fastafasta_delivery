'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalFoods: number
  totalEmployees: number
  recentOrders: any[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {
      const response = await fetch('/api/auth/verify')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        
        if (data.user.role === 'SUPER_ADMIN') {
          router.push('/admin/super')
        }
      } else {
        localStorage.removeItem('admin_token')
        router.push('/admin/login')
      }
    } catch (error) {
      localStorage.removeItem('admin_token')
      router.push('/admin/login')
    }
  }

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('user_data')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <div className="w-64 bg-muted h-screen animate-pulse"></div>
          <div className="flex-1 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <Link href="/admin/login" className="text-primary hover:underline">
            Please login to continue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-primary mb-6">
              🍔 {user.restaurant?.name || 'Admin Panel'}
            </h2>
            <nav className="space-y-2">
              <Link 
                href="/admin/dashboard" 
                className="flex items-center space-x-3 px-3 py-2 rounded-md bg-primary text-primary-foreground"
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/admin/foods" 
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent"
              >
                <Package className="h-5 w-5" />
                <span>Foods</span>
              </Link>
              <Link 
                href="/admin/orders" 
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Orders</span>
              </Link>
              <Link 
                href="/admin/chats" 
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Chats</span>
              </Link>
              <Link 
                href="/admin/employees" 
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent"
              >
                <Users className="h-5 w-5" />
                <span>Employees</span>
              </Link>
              <Link 
                href="/admin/settings" 
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
          
          <div className="absolute bottom-0 w-64 p-6 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="border-b bg-card">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <p className="text-muted-foreground">
                    Welcome back, {user.username}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Restaurant</p>
                  <p className="font-medium">{user.restaurant?.name}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                    <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Foods</p>
                    <p className="text-2xl font-bold">{stats.totalFoods}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-card border rounded-lg">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent Orders</h2>
                  <Link href="/admin/orders" className="text-primary hover:underline text-sm">
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {stats.recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No orders yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {stats.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} items • ${order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                            order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'DELIVERING' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
