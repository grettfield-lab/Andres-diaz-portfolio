import type { Metadata, Viewport } from 'next'
import { Outfit, Space_Mono } from 'next/font/google'
import './globals.css'
import TransitionProvider from '@/components/TransitionProvider'
import DotField from '@/components/DotField'
import ScrollFade from '@/components/ScrollFade'
import BackToTop from '@/components/BackToTop'
import LocaleWrapper from '@/components/LocaleWrapper'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '900'],
  variable: '--font-outfit',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Andres Diaz - Cinematographer & Photographer',
  description:
    'Portfolio of Andres Díaz, cinematographer and photographer working across documentary, narrative film, and commercial production.',
  openGraph: {
    title: 'Andres Diaz - Cinematographer & Photographer',
    description:
      'Portfolio of Andres Díaz, cinematographer and photographer working across documentary, narrative film, and commercial production.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${outfit.variable} ${spaceMono.variable}`}>
      <body>
        <DotField />
        <ScrollFade />
        <LocaleWrapper>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <TransitionProvider>{children}</TransitionProvider>
          </div>
        </LocaleWrapper>
        <BackToTop />
      </body>
    </html>
  )
}
