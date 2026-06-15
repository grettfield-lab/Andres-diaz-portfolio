import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Reel from '@/components/Reel'
import Work from '@/components/Work'
import About from '@/components/About'
import Services from '@/components/Services'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Reel />
      <Work />
      <About />
      <Services />
      <Contact />
      <Footer />
    </main>
  )
}
