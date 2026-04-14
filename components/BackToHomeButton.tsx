'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home } from 'lucide-react'

export function BackToHomeButton() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const isHome = pathname === '/'
    const isAdmin = pathname.startsWith('/admin')
    const showButton = !isHome && !isAdmin && pathname !== '/'
    setShow(showButton)
  }, [pathname])

  if (!show) return null

  return (
    <Link
      href="/"
      className="fixed bottom-6 left-6 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-black border border-gold text-gold transition-all duration-300 hover:scale-110 hover:bg-gold/10 focus:outline-none"
      aria-label="Volver al inicio"
    >
      <Home className="h-3 w-3" />
    </Link>
  )
}