import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Settings } from 'lucide-react'

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

  useEffect(() => {
    async function carregarFotografa() {
      try {
        const data = await configuracoesService.buscar()
        setFotografa(data?.fotografa || null)
      } catch {
        setFotografa(null)
      }
    }

    carregarFotografa()
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
    localStorage.clear()
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] flex h-[60px] items-center gap-0 border-b border-[rgba(255,255,255,0.07)] bg-[rgba(14,14,14,0.94)] px-8 backdrop-blur-[14px]">
      <Link to="/" className="flex flex-shrink-0 items-center gap-2.5 no-underline">
        <OlhariIcon />

        <span className="font-serif text-[20px] font-light tracking-[0.22em] text-white">
          OLHARI
        </span>
      </Link>

      <nav className="mx-auto flex items-center gap-0.5">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`
              relative rounded-md px-4 py-1.5 text-[12px] tracking-[0.08em] no-underline
              transition-colors duration-200
              ${
                isActive(link.to)
                  ? 'bg-[var(--gold-dim)] text-[var(--gold)]'
                  : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
              }
            `}
          >
            {link.label}

            {isActive(link.to) && (
              <span className="absolute bottom-[-1px] left-4 right-4 h-[1.5px] rounded-sm bg-[var(--gold)]" />
            )}
          </Link>
        ))}
      </nav>

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
