import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

import NotificationBell from './NotificationBell'

export default function AppTopControls({ compact = false, surface = 'default' }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('fotolhar-theme') || 'dark')

  useEffect(() => {
    const nextTheme = theme === 'light' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('fotolhar-theme', nextTheme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  const buttonClassName = surface === 'dark'
    ? `${compact ? 'h-9 w-9' : 'h-11 w-11'} flex items-center justify-center rounded-full border border-[#2A2D2F] bg-[#17191B] text-[#B9B9BA] shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition hover:border-[#C84F32] hover:bg-[#1E2022] hover:text-[#FFFFFF]`
    : `${compact ? 'h-9 w-9' : 'h-11 w-11'} flex items-center justify-center rounded-full border border-[#e3d6c7] bg-white text-[#211b17] shadow-[0_10px_26px_rgba(74,51,28,0.08)] transition hover:border-[#c4863c] hover:text-[#a66f29]`

  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
      <button
        type="button"
        onClick={toggleTheme}
        title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        className={buttonClassName}
      >
        {theme === 'light' ? <Sun size={compact ? 16 : 21} /> : <Moon size={compact ? 16 : 21} />}
      </button>

      <NotificationBell />
    </div>
  )
}
