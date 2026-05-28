import { useEffect, useState } from 'react'

import '../styles/home.css'
import Navbar from '../components/homepage/Navbar'
import HeroSection from '../components/homepage/HeroSection'
import AboutSection from '../components/homepage/AboutSection'
import PortfolioSection from '../components/homepage/PortfolioSection'
import ContactSection from '../components/homepage/ContactSection'
import Footer from '../components/homepage/Footer'
import HomepageEditModal from '../components/homepage/HomepageEditModal'
import AdminModeNoticeModal, {
  ADMIN_NOTICE_STORAGE_KEY,
} from '../components/homepage/AdminModeNoticeModal'
import { useHomepageConfig } from '../hooks/useHomepageConfig'

export default function HomePage() {
  const { config, atualizarConfig } = useHomepageConfig()
  const [editingSection, setEditingSection] = useState(null)
  const [showAdminNotice, setShowAdminNotice] = useState(false)

  useEffect(() => {
    const isLogged = Boolean(localStorage.getItem('token'))
    const alreadySeen = sessionStorage.getItem(ADMIN_NOTICE_STORAGE_KEY) === 'true'

    setShowAdminNotice(isLogged && !alreadySeen)
  }, [])

  const handleEdit = (section) => {
    setEditingSection(section)
  }

  return (
    <div className="theme-static bg-[#0b0b0b] text-white">
      <Navbar />
      <HeroSection config={config} onEdit={() => handleEdit('hero')} />
      <AboutSection config={config} onEdit={() => handleEdit('about')} />
      <PortfolioSection config={config} onEdit={() => handleEdit('portfolio')} />
      <ContactSection config={config} onEdit={() => handleEdit('contact')} />
      <Footer config={config} onEdit={() => handleEdit('footer')} />

      <AdminModeNoticeModal
        open={showAdminNotice}
        onClose={() => setShowAdminNotice(false)}
      />

      <HomepageEditModal
        open={Boolean(editingSection)}
        section={editingSection}
        config={config}
        onClose={() => setEditingSection(null)}
        onSave={atualizarConfig}
      />
    </div>
  )
}

