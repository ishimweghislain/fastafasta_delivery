"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createElement as h } from 'react'
import { Heart, Shield, ShoppingCart, UtensilsCrossed, Menu } from 'lucide-react'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function SiteHeader() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    window.addEventListener('cart-updated', readCart)
    return () => {
      window.removeEventListener('storage', readCart)
      window.removeEventListener('cart-updated', readCart)
    }
  }, [])

  if (pathname?.startsWith('/admin') && pathname !== '/admin/login') return null

  const menuActive = pathname === '/menu'
  const cartActive = pathname === '/cart'

  return h(
    'header',
    {
      className: cx(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b shadow-sm'
          : 'bg-transparent'
      )
    },
    h(
      'div',
      {
        className:
          'mx-auto flex h-16 max-w-6xl items-center justify-between px-4'
      },
      // Logo
      h(
        Link,
        { href: '/', className: 'group inline-flex items-center gap-2' },
        h(
          'span',
          {
            className:
              'inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition group-hover:bg-primary/90'
          },
          h('span', { className: 'text-lg' }, '🦁')
        ),
        h(
          'span',
          { className: 'text-lg font-bold tracking-tight text-foreground' },
          'SIMBA'
        )
      ),
      // Desktop Nav
      h(
        'nav',
        { className: 'hidden items-center gap-2 md:flex' },
        h(
          Link,
          {
            href: '/menu',
            className: cx(
              'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition',
              menuActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )
          },
          h(UtensilsCrossed, { className: 'h-4 w-4' }),
          'Menu'
        ),
        h(
          Link,
          {
            href: '/cart',
            className: cx(
              'relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition',
              cartActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )
          },
          h(ShoppingCart, { className: 'h-4 w-4' }),
          'Cart',
          cartCount > 0 && h(
            'span',
            {
              className:
                'absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-sm ring-2 ring-background'
            },
            String(cartCount)
          )
        ),
        h(
          Link,
          {
            href: '/admin/login',
            className:
              'ml-2 inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium transition hover:bg-primary/90 shadow-sm'
          },
          h(Shield, { className: 'h-4 w-4' }),
          'Admin'
        )
      ),
      // Mobile Nav
      h(
        'div',
        { className: 'flex items-center gap-2 md:hidden' },
        h(
          Link,
          {
            href: '/cart',
            className: 'relative p-2 text-foreground hover:bg-muted rounded-xl transition',
            'aria-label': 'Cart'
          },
          h(ShoppingCart, { className: 'h-5 w-5' }),
          cartCount > 0 && h(
            'span',
            {
              className: 'absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center'
            },
            String(cartCount)
          )
        ),
        h(
          Link,
          {
            href: '/menu',
            className: 'p-2 text-foreground hover:bg-muted rounded-xl transition',
          },
          h(Menu, { className: 'h-5 w-5' })
        )
      )
    )
  )
}
