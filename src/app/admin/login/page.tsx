'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, ShieldCheck, User, LayoutDashboard, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('user_data', JSON.stringify(data.user))

        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-orange-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-background rounded-[2rem] shadow-2xl shadow-orange-500/10 overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px] border border-orange-100">

        {/* Login Section */}
        <div className="p-8 md:p-12 flex flex-col justify-center relative">
          <Link href="/" className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-600 transition font-medium">
            ← Return Home
          </Link>

          <div className="mb-10 mt-8">
            <div className="h-12 w-12 bg-orange-100/50 rounded-2xl flex items-center justify-center text-2xl mb-6">
              🦁
            </div>
            <h1 className="text-3xl font-bold mb-3 tracking-tight text-foreground">Admin Portal</h1>
            <p className="text-muted-foreground">Sign in to manage SIMBA restaurant operations.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition group-focus-within:text-orange-500" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="admin"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="pl-10 h-10 bg-muted/30 border-muted-foreground/20 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition group-focus-within:text-orange-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 h-10 bg-muted/30 border-muted-foreground/20 focus-visible:ring-orange-500 focus-visible:border-orange-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center gap-2 border border-red-100">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : (
                <span className="flex items-center gap-2">
                  Sign In <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-auto pt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3" />
            <span>Secured by SIMBA Systems</span>
          </div>
        </div>

        {/* Visual Section */}
        <div className="relative hidden md:flex flex-col justify-between p-12 text-white overflow-hidden">
          {/* Dynamic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 z-0" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay" />

          {/* Floating Elements */}
          <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-20%] w-[300px] h-[300px] bg-yellow-400/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full text-xs font-semibold mb-8 backdrop-blur-md border border-white/10 shadow-lg">
              <ShieldCheck className="h-3 w-3 text-orange-200" />
              Authorized Personnel Only
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white drop-shadow-sm">
              Command<br />
              Center.
            </h2>
            <p className="text-orange-50/90 text-lg max-w-sm leading-relaxed">
              Complete control over orders, deliveries, and menu management.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/15 transition cursor-default">
                <LayoutDashboard className="h-6 w-6 text-orange-200 mb-3" />
                <div className="text-2xl font-bold">128+</div>
                <div className="text-xs text-orange-200/80">Daily Orders</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/15 transition cursor-default">
                <User className="h-6 w-6 text-orange-200 mb-3" />
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs text-orange-200/80">Support Active</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
