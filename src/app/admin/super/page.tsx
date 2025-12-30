'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, LogOut, Shield, Store, Users } from 'lucide-react'

export default function SuperAdminPage() {
  const router = useRouter()
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user_data')
      if (!raw) {
        router.push('/admin/login')
        return
      }
      const user = JSON.parse(raw) as { username?: string; role?: string }
      if (user.role !== 'SUPER_ADMIN') {
        router.push('/admin/dashboard')
        return
      }
      setUsername(user.username || 'Super Admin')
    } catch {
      router.push('/admin/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('user_data')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200 ring-1 ring-white/10">
              <Shield className="h-4 w-4 text-emerald-300" />
              SUPER ADMIN
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Welcome, {username}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-300">
              This is the starting point for the Super Admin dashboard. From here you’ll be able to manage restaurants and admin accounts.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="/admin/dashboard"
            className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Store className="h-4 w-4 text-indigo-300" />
              Restaurant dashboard
            </div>
            <p className="mt-2 text-sm text-zinc-300">View metrics and manage orders for a restaurant admin account.</p>
            <div className="mt-4 text-sm font-semibold text-indigo-200 transition group-hover:translate-x-0.5">Open →</div>
          </Link>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Building2 className="h-4 w-4 text-emerald-300" />
              Restaurants (coming next)
            </div>
            <p className="mt-2 text-sm text-zinc-300">Create restaurants, assign admins, enable/disable stores.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Users className="h-4 w-4 text-amber-300" />
              Admin accounts (coming next)
            </div>
            <p className="mt-2 text-sm text-zinc-300">Invite admins, reset passwords, and manage roles.</p>
          </div>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm text-zinc-300 hover:text-white">
            ← Back to customer site
          </Link>
        </div>
      </div>
    </div>
  )
}
