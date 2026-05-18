import { useState, useEffect } from 'react'

const navLinks = [
  { href: '#sobre', label: 'Sobre Mim' },
  { href: '#portfolio', label: 'Olhares Capturados' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isLogged = Boolean(localStorage.getItem('token'))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full h-20 flex items-center justify-between px-[5%] z-[1000] transition-all duration-300 border-b border-white/10 backdrop-blur-[10px] ${
        scrolled ? 'bg-black/95' : 'bg-[rgba(12,12,12,0.9)]'
      }`}
    >
      {/* Logo */}
      <a
        href="#home"
        className="font-serif text-2xl tracking-[0.3em] no-underline"
        style={{ color: 'var(--gold)' }}
      >
        OLHARI
      </a>

      {/* Desktop Links + CTA */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="no-underline text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 hover:text-[var(--gold)]"
            style={{ color: 'var(--text-muted)' }}
          >
            {link.label}
          </a>
        ))}

        {isLogged && (
          <a
            href="/solicitacoes"
            className="no-underline px-4 py-2 rounded-full border border-white/15 text-[11px] uppercase tracking-[0.15em] font-semibold transition-all duration-300 hover:border-[var(--gold)] hover:text-[var(--gold)]"
            style={{ color: 'var(--text-muted)' }}
          >
            Solicitações
          </a>
        )}

        <a
          href="#contato"
          className="no-underline px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          style={{ background: 'var(--gold)', color: '#1A1200' }}
        >
          Agendar Ensaio
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-[5px] cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
        <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="absolute top-20 left-0 w-full backdrop-blur-xl border-b border-white/10 flex flex-col py-6 px-[5%] gap-6 md:hidden"
          style={{ background: 'rgba(0,0,0,0.95)' }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="no-underline text-[12px] uppercase tracking-[0.15em] transition-colors hover:text-[var(--gold)]"
              style={{ color: 'var(--text-muted)' }}
            >
              {link.label}
            </a>
          ))}

          {isLogged && (
            <a
              href="/solicitacoes"
              onClick={() => setMenuOpen(false)}
              className="no-underline text-center px-5 py-3 rounded-full border border-white/15 text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
              style={{ color: 'var(--text-muted)' }}
            >
              Solicitações
            </a>
          )}

          <a
            href="#contato"
            onClick={() => setMenuOpen(false)}
            className="no-underline text-center px-5 py-3 rounded-full text-[11px] uppercase tracking-[0.15em] font-semibold"
            style={{ background: 'var(--gold)', color: '#1A1200' }}
          >
            Agendar Ensaio
          </a>
        </div>
      )}
    </nav>
  )
}
