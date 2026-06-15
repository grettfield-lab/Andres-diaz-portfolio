import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import WorkGallery from '@/components/WorkGallery'

export const metadata: Metadata = {
  title: 'Cinematography — Andres Díaz',
  description: 'Feature films, documentaries, and short films photographed by Andres Díaz.',
}

export default function CinematographyPage() {
  return (
    <main>
      <Nav />
      <WorkGallery category="cinematography" />
      <Footer />
    </main>
  )
}
