import { Link, useLocation } from 'react-router-dom'
// AQUI É O HEADER DE TODAS AS TELAS //
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
  { label: 'Dashboard',   to: '/dashboard' },
  { label: 'Ensaios',     to: '/ensaios' },
  {label: 'Novo Ensaio', to: '/novo-ensaio'},
  { label: 'Relatórios',  to: '/relatorios' },
  { label: 'Solicitações',to: '/solicitacoes' },
]

export default function Header() {
  const location = useLocation()

  const isActive = (to) =>
    to === '/ensaios'
      ? location.pathname.startsWith('/ensaios')
      : location.pathname === to

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] z-[100] flex items-center px-8 gap-0
                       bg-[rgba(14,14,14,0.94)] backdrop-blur-[14px]
                       border-b border-[rgba(255,255,255,0.07)]">

      <Link to="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
        <OlhariIcon />
        <span className="font-serif text-[20px] font-light tracking-[0.22em] text-white">
          OLHARI
        </span>
      </Link>

      <nav className="flex items-center gap-0.5 mx-auto">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`
              relative no-underline px-4 py-1.5 text-[12px] tracking-[0.08em] rounded-md
              transition-colors duration-200
              ${isActive(link.to)
                ? 'text-[var(--gold)] bg-[var(--gold-dim)]'
                : 'text-white/70 hover:text-white hover:bg-white/[0.04]'}
            `}
          >
            {link.label}
            {isActive(link.to) && (
              <span className="absolute bottom-[-1px] left-4 right-4 h-[1.5px] bg-[var(--gold)] rounded-sm" />
            )}
          </Link>
        ))}
      </nav>

      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                      text-[11px] font-medium text-[var(--gold)]
                      bg-[var(--gold-dim)] border border-[var(--gold-border)]">
        MC 
      </div>
    </header>
    // aqui onde tem MC a gente ve se será um caminho pra alguma pagina etc ou se mantem, se cria algo... //

  )
}