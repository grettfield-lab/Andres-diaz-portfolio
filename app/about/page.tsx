import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import AboutPageContent from '@/components/AboutPageContent'

export const metadata: Metadata = {
  title: 'About — Andres Díaz',
  description:
    'Cinematographer and photographer. A decade of cinematic work across documentary, narrative film, and editorial photography.',
}

export default function AboutPage() {
  return (
    <main>
      <Nav />
      <AboutPageContent />
      <Footer />
    </main>
  )
}
