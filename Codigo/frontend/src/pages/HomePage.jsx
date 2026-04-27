import '../styles/home.css'

import Navbar from '../components/homepage/Navbar'
import HeroSection from '../components/homepage/HeroSection'
import AboutSection from '../components/homepage/AboutSection'
import PortfolioSection from '../components/homepage/PortfolioSection'
import ContactSection from '../components/homepage/ContactSection'
import Footer from '../components/homepage/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
    </>
  )
}