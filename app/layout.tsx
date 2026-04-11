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
  title: 'Gavi-Club | Bar en Barcelona',
  description: 'Auténtico bar en el corazón de Barcelona. Disfruta de picaderas y cócteles en un ambiente acogedor.',
  keywords: ['bar', 'cócteles', 'picaderas', 'Barcelona', 'Gavi-Club'],
  authors: [{ name: 'Gavi-Club' }],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Gavi-Club | Bar en Barcelona',
    description: 'Auténtico bar en el corazón de Barcelona',
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_US',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1a1816' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1816' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
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