import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Publisher | Seu cronograma de posts inteligente',
  description: 'Crie posts incríveis com IA e organize seu calendário de publicações em todas as redes sociais.',
  keywords: ['social media', 'posts', 'IA', 'cronograma', 'influenciadores', 'marketing'],
  authors: [{ name: 'Publisher' }],
  openGraph: {
    title: 'Publisher | Seu cronograma de posts inteligente',
    description: 'Crie posts incríveis com IA e organize seu calendário de publicações.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-warm-white antialiased font-sans">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

