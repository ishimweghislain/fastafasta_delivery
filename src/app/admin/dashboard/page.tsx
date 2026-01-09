'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalFoods: number
  totalEmployees: number
  recentOrders: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

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

  if (loading) {
    return <div className="p-8">Loading stats...</div>
  }

  if (!stats) {
    return <div className="p-8">Error loading dashboard stats.</div>
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of SIMBA Restaurant performance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<ShoppingCart className="h-6 w-6 text-white" />}
          label="Total Orders"
          value={stats.totalOrders}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<DollarSign className="h-6 w-6 text-white" />}
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-white" />}
          label="Pending Orders"
          value={stats.pendingOrders}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
        <StatCard
          icon={<Package className="h-6 w-6 text-white" />}
          label="Total Foods"
          value={stats.totalFoods}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Recent Orders */}
      <div className="relative group rounded-2xl border bg-card p-6 shadow-sm overflow-hidden">
        {/* Animated Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <p className="text-sm text-muted-foreground">Latest transactions from your customers.</p>
          </div>
          <Link href="/admin/orders">
            <Button className="gap-2">
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="relative z-10">
          {stats.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-12 bg-muted/30 rounded-xl border border-dashed">
              No orders yet
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="group/item flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition hover:shadow-sm hover:border-primary/20 bg-background/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {order.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground group-hover/item:text-primary transition-colors">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} items • ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <Badge status={order.status} />
                    <p className="text-xs text-muted-foreground">
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
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className="relative overflow-hidden bg-card border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className={`absolute top-0 right-0 p-4 opacity-5 pointer-events-none scale-150 transform translate-x-1/4 -translate-y-1/4`}>
        <div className={`h-24 w-24 rounded-full ${color}`} />
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-3xl font-bold mt-2 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl shadow-lg ${color}`}>
          {icon}
        </div>
      </div>

      {/* Decorative Line */}
      <div className="w-full bg-muted h-1 rounded-full overflow-hidden mt-2">
        <div className={`h-full w-2/3 ${color} opacity-50`} />
      </div>
    </div>
  )
}

function Badge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-orange-100 text-orange-700 border-orange-200',
    ACCEPTED: 'bg-blue-100 text-blue-700 border-blue-200',
    PREPARING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    DELIVERING: 'bg-purple-100 text-purple-700 border-purple-200',
    COMPLETED: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
      {status}
    </span>
  )
}
