import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Moon,
  PlusCircle,
  Settings,
  Sun,
  Users,
} from 'lucide-react'

import { configuracoesService } from '../../services/configuracoesService'
import { getPreservedOnboardingEntries } from '../../utils/onboarding'
import {
  getCurrentAuthSessionKey,
  isCurrentAuthSession,
  isStaleSessionError,
  normalizeAccountEmail,
} from '../../utils/authSession'
import { invalidateOnboardingRouteCache } from '../../utils/onboardingRouteCache'
import NotificationBell from './NotificationBell'

const LOGIN_DISPLAY_NAME_KEY = 'fotolhar-login-display-name'
const USER_PROFILE_CACHE_KEY = 'fotolhar-usuario-perfil'

function readStoredUsuarioIdentity() {
  const nome = localStorage.getItem('usuarioNome') || ''
  const email = localStorage.getItem('usuarioEmail') || ''

  return nome || email ? { nome, email } : null
}

function isCachedUsuarioForCurrentAccount(usuario) {
  const currentEmail = normalizeAccountEmail(localStorage.getItem('usuarioEmail') || '')
  const cachedEmail = normalizeAccountEmail(usuario?.email || '')

  return !currentEmail || !cachedEmail || currentEmail === cachedEmail
}

function readCachedUsuario() {
  try {
    const cached = localStorage.getItem(USER_PROFILE_CACHE_KEY)
    const usuario = cached ? JSON.parse(cached) : null

    if (usuario && isCachedUsuarioForCurrentAccount(usuario)) {
      return usuario
    }

    if (usuario) {
      localStorage.removeItem(USER_PROFILE_CACHE_KEY)
    }

    return readStoredUsuarioIdentity()
  } catch {
    localStorage.removeItem(USER_PROFILE_CACHE_KEY)
    return readStoredUsuarioIdentity()
  }
}

function cacheUsuario(usuario) {
  if (!usuario) {
    localStorage.removeItem(USER_PROFILE_CACHE_KEY)
    return
  }

  const usuarioCache = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone,
    cidade: usuario.cidade,
    fotoPerfilUrl: usuario.fotoPerfilUrl,
  }

  localStorage.setItem(USER_PROFILE_CACHE_KEY, JSON.stringify(usuarioCache))
  if (usuarioCache.nome) localStorage.setItem('usuarioNome', usuarioCache.nome)
  if (usuarioCache.email) localStorage.setItem('usuarioEmail', usuarioCache.email)
}

function isGenericLoginDisplayName(name = '') {
  const normalized = name.trim().toLowerCase()
  return [
    'seu estudio',
    'seu estúdio',
    'seu estudio fotografico',
    'seu estúdio fotográfico',
  ].includes(normalized)
}

function ApertureLogoMark() {
  return (
    <svg className="h-[22px] w-[22px] shrink-0" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <mask id="fotolhar-header-aperture">
          <rect width="64" height="64" fill="white" />
          <circle cx="32" cy="32" r="11" fill="black" />
          <path d="M31 3 39 21" stroke="black" strokeWidth="3" strokeLinecap="round" />
          <path d="M55 14 42 28" stroke="black" strokeWidth="3" strokeLinecap="round" />
          <path d="M59 40 44 36" stroke="black" strokeWidth="3" strokeLinecap="round" />
          <path d="M39 61 35 45" stroke="black" strokeWidth="3" strokeLinecap="round" />
          <path d="M12 55 25 40" stroke="black" strokeWidth="3" strokeLinecap="round" />
          <path d="M3 28 20 31" stroke="black" strokeWidth="3" strokeLinecap="round" />
          <path d="M17 8 28 20" stroke="black" strokeWidth="3" strokeLinecap="round" />
        </mask>
      </defs>
      <circle cx="32" cy="32" r="29" fill="currentColor" mask="url(#fotolhar-header-aperture)" />
    </svg>
  )
}

function FotolharLogo() {
  return (
    <span className="header-code-logo" aria-label="Fotolhar">
      <span>F</span>
      <span>O</span>
      <span>T</span>
      <ApertureLogoMark />
      <span>L</span>
      <span>H</span>
      <span>A</span>
      <span>R</span>
    </span>
  )
}

const navLinks = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Ensaios', to: '/ensaios', icon: CalendarDays },
  { label: 'Clientes', to: '/clientes', icon: Users },
  { label: 'Novo Ensaio', to: '/novo-ensaio', icon: PlusCircle },
  { label: 'Relatórios', to: '/relatorios' },
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
  const [usuario, setUsuario] = useState(() => readCachedUsuario())
  const [theme, setTheme] = useState(() => localStorage.getItem('fotolhar-theme') || 'dark')

  useEffect(() => {
    const nextTheme = theme === 'light' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('fotolhar-theme', nextTheme)
  }, [theme])

  useEffect(() => {
    let isMounted = true

    async function carregarUsuario() {
      const sessionKey = getCurrentAuthSessionKey()

      try {
        const data = await configuracoesService.buscar()
        if (isMounted && isCurrentAuthSession(sessionKey)) {
          const nextUsuario = data?.usuario || null
          setUsuario(nextUsuario)
          cacheUsuario(nextUsuario)
        }
      } catch (error) {
        if (isMounted && !isStaleSessionError(error) && isCurrentAuthSession(sessionKey)) {
          setUsuario(null)
        }
      }
    }

    function handleUsuarioAtualizado(event) {
      if (event.detail) {
        setUsuario(event.detail)
        cacheUsuario(event.detail)
        return
      }

      carregarUsuario()
    }

    carregarUsuario()

    window.addEventListener('fotolhar:usuario-atualizado', handleUsuarioAtualizado)

    return () => {
      isMounted = false
      window.removeEventListener('fotolhar:usuario-atualizado', handleUsuarioAtualizado)
    }
  }, [])

  useEffect(() => {
    if (!usuario?.fotoPerfilUrl) return

    const image = new Image()
    image.src = usuario.fotoPerfilUrl
  }, [usuario?.fotoPerfilUrl])

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

  const initials = useMemo(() => getInitials(usuario?.nome), [usuario])

  const isActive = (to) =>
    to === '/ensaios'
      ? location.pathname.startsWith('/ensaios')
      : to === '/clientes'
        ? location.pathname.startsWith('/clientes')
      : location.pathname === to

  const handleLogout = () => {
    const currentTheme = localStorage.getItem('fotolhar-theme')
    const usuarioEmail = usuario?.email || localStorage.getItem('usuarioEmail') || ''
    const loginDisplayName = usuario?.nome || localStorage.getItem('usuarioNome')
    const onboardingEntries = getPreservedOnboardingEntries()

    configuracoesService.invalidateAllUserCaches()
    invalidateOnboardingRouteCache()
    localStorage.clear()

    if (currentTheme) localStorage.setItem('fotolhar-theme', currentTheme)
    onboardingEntries.forEach(([key, value]) => localStorage.setItem(key, value))
    if (usuarioEmail && loginDisplayName && !isGenericLoginDisplayName(loginDisplayName)) {
      localStorage.setItem(`${LOGIN_DISPLAY_NAME_KEY}:${usuarioEmail.trim().toLowerCase()}`, loginDisplayName)
    }

    setMenuOpen(false)
    navigate('/login')
  }

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] flex h-[60px] items-center gap-0 border-b border-[var(--border)] bg-[var(--header-bg)] px-8 backdrop-blur-[14px]">
      <Link to="/" className="flex w-[210px] flex-shrink-0 items-center no-underline">
        <FotolharLogo />
      </Link>

      <nav className="theme-soft mx-auto flex items-center gap-1 rounded-full border px-1.5 py-1 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        {navLinks.map((link) => {
          const active = isActive(link.to)
          const Icon = link.icon || BarChart3

          return (
            <Link
              key={link.to}
              to={link.to}
              className={`
                inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.10em] no-underline
                transition-all duration-200
                ${
                  active
                    ? 'bg-[var(--card)] text-[var(--gold)] shadow-[0_6px_18px_rgba(0,0,0,0.10)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--card-hover)] hover:text-[var(--text)]'
                }
              `}
            >
              <Icon size={15} strokeWidth={active ? 2.2 : 1.9} />
              <span>{link.label}</span>
            </Link>
          )
        })}
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

      <NotificationBell />

      <div ref={menuRef} className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          title="Seus Dados"
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[11px] font-medium text-[var(--gold)] transition hover:bg-[var(--gold-dim)]/80"
        >
          {usuario?.fotoPerfilUrl ? (
            <img
              src={usuario.fotoPerfilUrl}
              alt={usuario?.nome || 'Usuário'}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </button>

        {menuOpen && (
          <div className="theme-card header-popover absolute right-0 top-11 w-[286px] overflow-hidden rounded-2xl border shadow-2xl shadow-black/30">
            <div className="border-b border-[var(--border)] px-4 py-4">
              <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]">
                Conta
              </p>

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] font-serif text-[15px] text-[var(--gold)]">
                  {usuario?.fotoPerfilUrl ? (
                    <img
                      src={usuario.fotoPerfilUrl}
                      alt={usuario?.nome || 'Usuário'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="min-w-0">
              <p className="theme-title truncate text-sm font-semibold">
                {usuario?.nome || 'Usuário'}
              </p>

              <p className="theme-muted mt-0.5 truncate text-xs">
                {usuario?.email || 'Conta administrativa'}
              </p>
                </div>
              </div>
            </div>

            <Link
              to="/configuracoes"
              onClick={() => setMenuOpen(false)}
              className="group mx-2 mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text-muted)] transition hover:bg-[var(--card-hover)] hover:text-[var(--text)]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] transition group-hover:border-[var(--gold-border)] group-hover:text-[var(--gold)]">
                <Settings size={15} />
              </span>
              Configurações
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="group mx-2 mb-2 mt-2 flex w-[calc(100%-16px)] items-center gap-3 rounded-xl border-t border-[var(--border)] px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-400/10 hover:text-red-200"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/10 text-red-300 transition group-hover:text-red-200">
                <LogOut size={15} />
              </span>
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
