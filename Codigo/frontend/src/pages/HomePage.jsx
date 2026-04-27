import Navbar from '../components/homepage/Navbar'
import Footer from '../components/homepage/Footer'
import HeroSection from '../components/homepage/HeroSection'
import AboutSection from '../components/homepage/AboutSection'
import PortfolioSection from '../components/homepage/PortfolioSection'
import ContactSection from '../components/homepage/ContactSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}