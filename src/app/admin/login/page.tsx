'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, ShieldCheck, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
        
        if (data.user.role === 'SUPER_ADMIN') {
          router.push('/admin/super')
        } else {
          router.push('/admin/dashboard')
        }
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-stretch gap-0 px-4 py-10 md:grid-cols-2">
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-white/10 bg-white/5 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                </span>
                Admin Login
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Sign in to manage your restaurant dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-zinc-200">Username</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="danger / resto1 / resto2"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-200">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="12345"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 w-full rounded-2xl bg-white text-zinc-950 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
              
                <div className="mt-2 text-xs text-zinc-400">
                  Tip: Don't Share your credentials with anyone else !! It may lead to securtiy issues .
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/10"
                >
                  ← Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative hidden overflow-hidden rounded-3xl border border-white/10 bg-white/5 md:block">
          <img
            src="/images/Delivery Motorcycle Stock Photos, Pictures….jpg"
            alt="Delivery"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/70 to-emerald-950/40" />

          <div className="relative flex h-full flex-col justify-end p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-zinc-100 ring-1 ring-white/15">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Secure admin access
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-white">
              Manage orders.
              <br />
              Track revenue.
              <br />
              Run your kitchen smarter.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-200">
              A clean dashboard experience with smooth animations and a modern dark theme.
              Your restaurants, your control.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
