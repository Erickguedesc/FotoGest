import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Moon, Settings, Sun } from 'lucide-react'

import { configuracoesService } from '../../services/configuracoesService'

const OlhariIcon = () => (
  <svg width="26" height="26" viewBox="0 0 42 42" fill="none">
    <circle cx="21" cy="21" r="13" stroke="#C9A459" strokeWidth="1" />
    <circle cx="21" cy="21" r="7" stroke="#C9A459" strokeWidth="0.75" opacity="0.5" />
    <circle cx="21" cy="21" r="2.5" fill="#C9A459" />
    <line x1="21" y1="4" x2="21" y2="8" stroke="#C9A459" strokeWidth="1" strokeLinecap="round" />
    <line x1="21" y1="34" x2="21" y2="38" stroke="#C9A459" strokeWidth="1" strokeLinecap="round" />
    <line x1="4" y1="21" x2="8" y2="21" stroke="#C9A459" strokeWidth="1" strokeLinecap="round" />
    <line x1="34" y1="21" x2="38" y2="21" stroke="#C9A459" strokeWidth="1" strokeLinecap="round" />
  </svg>
)

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Ensaios', to: '/ensaios' },
  { label: 'Clientes', to: '/clientes' },
  { label: 'Novo Ensaio', to: '/novo-ensaio' },
  { label: 'Relatórios', to: '/relatorios' },
  { label: 'Solicitações', to: '/solicitacoes' },
]

function getInitials(nome = '') {
  const initials = nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return initials || 'FT'
}

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const menuRef = useRef(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const [fotografa, setFotografa] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('olhari-theme') || 'dark')

  useEffect(() => {
    const nextTheme = theme === 'light' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('olhari-theme', nextTheme)
  }, [theme])

  useEffect(() => {
    let isMounted = true

    async function carregarFotografa() {
      try {
        const data = await configuracoesService.buscar()
        if (isMounted) {
          setFotografa(data?.fotografa || null)
        }
      } catch {
        if (isMounted) {
          setFotografa(null)
        }
      }
    }

    function handleFotografaAtualizada(event) {
      if (event.detail) {
        setFotografa(event.detail)
        return
      }

      carregarFotografa()
    }

    carregarFotografa()

    window.addEventListener('olhari:fotografa-atualizada', handleFotografaAtualizada)

    return () => {
      isMounted = false
      window.removeEventListener('olhari:fotografa-atualizada', handleFotografaAtualizada)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const initials = useMemo(() => getInitials(fotografa?.nome), [fotografa])

  const isActive = (to) =>
    to === '/ensaios'
      ? location.pathname.startsWith('/ensaios')
      : to === '/clientes'
        ? location.pathname.startsWith('/clientes')
      : location.pathname === to

  const handleLogout = () => {
    const currentTheme = localStorage.getItem('olhari-theme')
    localStorage.clear()
    if (currentTheme) localStorage.setItem('olhari-theme', currentTheme)
    setMenuOpen(false)
    navigate('/login')
  }

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] flex h-[60px] items-center gap-0 border-b border-[var(--border)] bg-[var(--header-bg)] px-8 backdrop-blur-[14px]">
      <Link to="/" className="flex flex-shrink-0 items-center gap-2.5 no-underline">
        <OlhariIcon />

        <span className="font-serif text-[20px] font-light tracking-[0.22em] text-white">
          OLHARI
        </span>
      </Link>

      <nav className="theme-soft mx-auto flex items-center gap-1 rounded-full border px-1.5 py-1 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`
              rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] no-underline
              transition-all duration-200
              ${
                isActive(link.to)
                  ? 'bg-[var(--card)] text-[var(--gold)] shadow-[0_6px_18px_rgba(0,0,0,0.10)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--card-hover)] hover:text-[var(--text)]'
              }
            `}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        onClick={toggleTheme}
        title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        className={`relative mr-3 flex h-8 w-[62px] flex-shrink-0 items-center rounded-full border p-1 transition-all duration-300 ${
          theme === 'light'
            ? 'border-[#d8ccba] bg-[#f3eee6] shadow-[inset_0_1px_2px_rgba(92,82,72,0.12)]'
            : 'border-white/10 bg-[#1b1b1b] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]'
        }`}
      >
        <span
          className={`absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full transition-all duration-300 ${
            theme === 'light'
              ? 'left-[33px] bg-[#1d1d1d] shadow-[0_4px_12px_rgba(0,0,0,0.22)]'
              : 'left-1 bg-[#faf8f4] shadow-[0_4px_12px_rgba(0,0,0,0.35)]'
          }`}
        />

        <span
          className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 ${
            theme === 'light'
              ? 'left-3 text-[#1a1610]'
              : 'right-3 text-[#f5f0e8]'
          }`}
        >
          {theme === 'light' ? <Sun size={15} /> : <Moon size={15} />}
        </span>
      </button>

      <div ref={menuRef} className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          title="Conta da fotógrafa"
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[11px] font-medium text-[var(--gold)] transition hover:bg-[var(--gold-dim)]/80"
        >
          {fotografa?.fotoPerfilUrl ? (
            <img
              src={fotografa.fotoPerfilUrl}
              alt={fotografa?.nome || 'Fotógrafa'}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-11 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-2xl shadow-black/50">
            <div className="border-b border-white/10 px-4 py-3">
              <p className="truncate text-sm font-medium text-white">
                {fotografa?.nome || 'Fotógrafa'}
              </p>

              <p className="mt-0.5 truncate text-xs text-white/40">
                {fotografa?.email || 'Conta administrativa'}
              </p>
            </div>

            <Link
              to="/configuracoes"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-white/65 transition hover:bg-white/[0.04] hover:text-[var(--gold)]"
            >
              <Settings size={16} />
              Configurações
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-300/80 transition hover:bg-red-400/10 hover:text-red-200"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
