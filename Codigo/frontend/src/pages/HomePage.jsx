import '../styles/home.css'
import Navbar from '../components/homepage/Navbar'
import HeroSection from '../components/homepage/HeroSection'
import AboutSection from '../components/homepage/AboutSection'
import PortfolioSection from '../components/homepage/PortfolioSection'
import CursosSection from '../components/homepage/CursosSection'
import ContactSection from '../components/homepage/ContactSection'
import Footer from '../components/homepage/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <CursosSection />
      <ContactSection />
      <Footer />
    </>
  )
}