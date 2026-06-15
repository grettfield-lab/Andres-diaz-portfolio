import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ContactPageContent from '@/components/ContactPageContent'

export const metadata: Metadata = {
  title: 'Contact — Andres Díaz',
  description:
    'Start a project with Andres Díaz — cinematographer and photographer open for collaborations in 2025.',
}

export default function ContactPage() {
  return (
    <main>
      <Nav />
      <ContactPageContent />
      <Footer />
    </main>
  )
}
