"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createElement as h } from 'react'
import { Heart, Shield, ShoppingCart, Store } from 'lucide-react'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function SiteHeader() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const readCart = () => {
      try {
        const raw = localStorage.getItem('cart')
        if (!raw) {
          setCartCount(0)
          return
        }
        const cart = JSON.parse(raw) as Array<{ quantity?: number }>
        const count = cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0)
        setCartCount(count)
      } catch {
        setCartCount(0)
      }
    }

    readCart()
    window.addEventListener('storage', readCart)
    return () => window.removeEventListener('storage', readCart)
  }, [])

  if (pathname?.startsWith('/admin') && pathname !== '/admin/login') return null

  const restaurantsActive = pathname === '/restaurants'
  const favoritesActive = pathname === '/favorites'
  const cartActive = pathname === '/cart'

  return h(
    'header',
    {
      className:
        'sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/60 backdrop-blur-xl'
    },
    h(
      'div',
      {
        className:
          'mx-auto flex h-16 max-w-6xl items-center justify-between px-4'
      },
      h(
        Link,
        { href: '/', className: 'group inline-flex items-center gap-2' },
        h(
          'span',
          {
            className:
              'inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 transition group-hover:bg-white/15'
          },
          h('span', { className: 'text-lg' }, '🍔')
        ),
        h(
          'span',
          { className: 'text-lg font-semibold tracking-tight text-white' },
          'FastaFasta'
        )
      ),
      h(
        'nav',
        { className: 'hidden items-center gap-2 md:flex' },
        h(
          Link,
          {
            href: '/restaurants',
            className: cx(
              'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-white/10 hover:text-white',
              restaurantsActive
                ? 'bg-white/10 text-white ring-1 ring-white/15'
                : 'text-zinc-200'
            )
          },
          h(Store, { className: 'h-4 w-4' }),
          'Restaurants'
        ),
        h(
          Link,
          {
            href: '/favorites',
            className: cx(
              'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-white/10 hover:text-white',
              favoritesActive
                ? 'bg-white/10 text-white ring-1 ring-white/15'
                : 'text-zinc-200'
            )
          },
          h(Heart, { className: 'h-4 w-4' }),
          'Favorites'
        ),
        h(
          Link,
          {
            href: '/cart',
            className: cx(
              'relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-white/10 hover:text-white',
              cartActive
                ? 'bg-white/10 text-white ring-1 ring-white/15'
                : 'text-zinc-200'
            )
          },
          h(ShoppingCart, { className: 'h-4 w-4' }),
          'Cart',
          h(
            'span',
            {
              className:
                'ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500/15 px-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/25'
            },
            String(cartCount)
          )
        )
      ),
      h(
        'div',
        { className: 'flex items-center gap-2' },
        h(
          Link,
          {
            href: '/restaurants',
            className:
              'inline-flex items-center justify-center rounded-xl p-2 text-zinc-200 transition hover:bg-white/10 hover:text-white md:hidden',
            'aria-label': 'Browse restaurants'
          },
          h(Store, { className: 'h-5 w-5' })
        ),
        h(
          Link,
          {
            href: '/favorites',
            className:
              'inline-flex items-center justify-center rounded-xl p-2 text-zinc-200 transition hover:bg-white/10 hover:text-white md:hidden',
            'aria-label': 'Favorites'
          },
          h(Heart, { className: 'h-5 w-5' })
        ),
        h(
          Link,
          {
            href: '/cart',
            className:
              'relative inline-flex items-center justify-center rounded-xl p-2 text-zinc-200 transition hover:bg-white/10 hover:text-white md:hidden',
            'aria-label': 'Cart'
          },
          h(ShoppingCart, { className: 'h-5 w-5' }),
          cartCount > 0
            ? h(
                'span',
                {
                  className:
                    'absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-semibold text-zinc-950'
                },
                String(cartCount)
              )
            : null
        ),
        h(
          Link,
          {
            href: '/admin/login',
            className:
              'inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-zinc-950 shadow-sm transition hover:shadow-md'
          },
          h(Shield, { className: 'h-4 w-4' }),
          'Admin Login'
        )
      )
    )
  )
}
