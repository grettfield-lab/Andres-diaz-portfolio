import type { Metadata } from 'next'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import WorkGallery from '@/components/WorkGallery'

export const metadata: Metadata = {
  title: 'Other Projects — Andres Díaz',
  description: 'Commercial work, visual direction, and experimental projects by Andres Díaz.',
}

export default function OtherProjectsPage() {
  return (
    <main>
      <Nav />
      <WorkGallery category="other-projects" />
      <Footer />
    </main>
  )
}
