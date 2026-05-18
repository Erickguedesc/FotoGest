import { useState } from 'react'

import '../styles/home.css'
import Navbar from '../components/homepage/Navbar'
import HeroSection from '../components/homepage/HeroSection'
import AboutSection from '../components/homepage/AboutSection'
import PortfolioSection from '../components/homepage/PortfolioSection'
import CursosSection from '../components/homepage/CursosSection'
import ContactSection from '../components/homepage/ContactSection'
import Footer from '../components/homepage/Footer'
import HomepageEditModal from '../components/homepage/HomepageEditModal'
import { useHomepageConfig } from '../hooks/useHomepageConfig'

export default function HomePage() {
  const { config, atualizarConfig } = useHomepageConfig()
  const [editingSection, setEditingSection] = useState(null)

  const handleEdit = (section) => {
    setEditingSection(section)
  }

  return (
    <>
      <Navbar />
      <HeroSection config={config} onEdit={() => handleEdit('hero')} />
      <AboutSection config={config} onEdit={() => handleEdit('about')} />
      <PortfolioSection config={config} onEdit={() => handleEdit('portfolio')} />
      <CursosSection />
      <ContactSection config={config} onEdit={() => handleEdit('contact')} />
      <Footer config={config} onEdit={() => handleEdit('footer')} />

      <HomepageEditModal
        open={Boolean(editingSection)}
        section={editingSection}
        config={config}
        onClose={() => setEditingSection(null)}
        onSave={atualizarConfig}
      />
    </>
  )
}
