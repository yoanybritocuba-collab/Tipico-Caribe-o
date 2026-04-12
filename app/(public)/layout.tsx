import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Gaby's Club | Coctelería y Picaderas",
  description: "El mejor lugar para disfrutar de cócteles y picaderas en Barcelona",
  icons: {
    icon: '/logo.png',
  },
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}