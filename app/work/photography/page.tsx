import type { Metadata } from 'next'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import WorkGallery from '@/components/WorkGallery'

export const metadata: Metadata = {
  title: 'Photography — Andres Díaz',
  description: 'Portrait, editorial, and fine art photography by Andres Díaz.',
}

export default function PhotographyPage() {
  return (
    <main>
      <Nav />
      <WorkGallery category="photography" />
      <Footer />
    </main>
  )
}
