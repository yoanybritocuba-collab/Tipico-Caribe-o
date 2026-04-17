import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { StoreProvider } from '@/lib/store'
import { I18nProvider } from '@/lib/i18n'
import { BackButtonHandler } from '@/components/back-button-handler'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: "Tipico Caribeño | Cocktail Bar",
  description: "Auténtico bar en el corazón de Barcelona",
  icons: {
    icon: '/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1816',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <I18nProvider>
            <StoreProvider>
              {children}
              <BackButtonHandler />
            </StoreProvider>
          </I18nProvider>
        </ThemeProvider>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  )
}