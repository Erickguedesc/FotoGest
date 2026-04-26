import { useRef, useState, useEffect } from 'react'
import '../styles/global.css'

/* ─── Dados de portfólio (substituir por API futuramente) ─── */
const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: 'Gestante',
    category: 'Ensaio',
    src: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800&q=80',
  },
  {
    id: 2,
    title: 'Família',
    category: 'Ensaio',
    src: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80',
  },
  {
    id: 3,
    title: 'Newborn',
    category: 'Ensaio',
    src: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80',
  },
  {
    id: 4,
    title: 'Corporativo',
    category: 'Ensaio',
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
  },
  {
    id: 5,
    title: 'Smash The Cake',
    category: 'Ensaio',
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
]

const TIPOS_ENSAIO = [
  'Gestante',
  'Newborn',
  'Família',
  'Smash The Cake',
  'Corporativo / Pessoal',
  'Outro',
]

/* ─── Hook: intersection observer para animações on-scroll ─── */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, visible }
}

/* ─── Componente: Section Header ─────────────────────────────── */
function SectionHeader({ label, title, center = false }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{ textAlign: center ? 'center' : 'left' }}>
      <span className={`section-label ${visible ? 'fade-up fade-up-d1' : ''}`}>{label}</span>
      <div style={{ width: 48, height: 1, background: 'var(--gold)', margin: center ? '1rem auto' : '1rem 0', opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.2s' }} />
      <h2 className={`section-title ${visible ? 'fade-up fade-up-d2' : ''}`}>{title}</h2>
    </div>
  )
}

/* ─── Componente: Nav ────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className="nav" style={{
      background: scrolled
        ? 'rgba(5,5,5,0.95)'
        : 'linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, transparent 100%)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'background 0.5s ease, backdrop-filter 0.5s ease',
      borderBottom: scrolled ? '1px solid var(--border-subtle)' : 'none',
    }}>
      <a href="#hero" className="nav-logo">Olhari</a>
      <ul className="nav-links">
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#portfolio">Portfólio</a></li>
        <li><a href="#orcamento">Orçamento</a></li>
      </ul>
      <a href="#orcamento" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.6rem' }}>
        <span>Agendar</span>
      </a>
    </nav>
  )
}

/* ─── Seção: Hero ────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section id="hero" className="hero">
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '35%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(201,164,89,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div className="hero-inner">
        <div className="hero-eyebrow fade-up fade-up-d1">
          <span>Fotografia</span>
        </div>

        <h1 className="display-title fade-up fade-up-d2">
          Olhari
        </h1>

        <p className="hero-subtitle fade-up fade-up-d3">
          O momento que passa, a memória que fica.
        </p>

        <div className="hero-cta fade-up fade-up-d4">
          <a href="#orcamento" className="btn-primary">
            <span>Solicitar Orçamento</span>
          </a>
        </div>
      </div>

      <div className="hero-scroll fade-up fade-up-d5">
        <div className="scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  )
}

/* ─── Seção: Sobre a Fotógrafa ───────────────────────────────── */
function SobreSection() {
  const { ref, visible } = useReveal()

  return (
    <section id="sobre" className="sobre">
      <div className="container">
        <div className="sobre-grid" ref={ref}>
          {/* Imagem */}
          <div className={`sobre-image-wrap ${visible ? 'fade-up fade-up-d1' : ''}`}>
            <div className="sobre-image-frame">
              <img
                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80"
                alt="Fotógrafa Olhari"
                loading="lazy"
              />
            </div>
            <div className="sobre-accent" />
          </div>

          {/* Texto */}
          <div className="sobre-content">
            <span className={`section-label ${visible ? 'fade-up fade-up-d1' : ''}`}>Sobre</span>
            <div style={{ width: 48, height: 1, background: 'var(--gold)', margin: '1rem 0', opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.2s' }} />
            <h2 className={`section-title ${visible ? 'fade-up fade-up-d2' : ''}`}>
              Capturando o que<br />o olho sente
            </h2>

            <p className={`sobre-text ${visible ? 'fade-up fade-up-d3' : ''}`}>
              Cada família carrega uma história única. Meu trabalho é preservar esses capítulos com
              sensibilidade e cuidado — dos primeiros instantes do newborn ao sorriso cúmplice que
              só quem ama de verdade conhece.
            </p>

            <p className={`sobre-text ${visible ? 'fade-up fade-up-d4' : ''}`}>
              Com mais de dez anos de experiência em fotografia documental e ensaios especializados,
              acredito que a melhor fotografia não é posada — é <em>vivida</em>.
            </p>

            <div className={`sobre-signature ${visible ? 'fade-up fade-up-d5' : ''}`}>
              Ana Lima
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Seção: Portfólio ───────────────────────────────────────── */
function PortfolioSection() {
  const { ref, visible } = useReveal()

  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <div className="portfolio-header">
          <SectionHeader label="Portfólio" title="Ensaios em destaque" center />
        </div>

        <div className="portfolio-grid" ref={ref}>
          {PORTFOLIO_ITEMS.map((item, i) => (
            <div
              key={item.id}
              className="portfolio-item"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(24px)',
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
              }}
            >
              <img src={item.src} alt={item.title} loading="lazy" />
              <div className="portfolio-overlay">
                <div className="portfolio-item-title">{item.title}</div>
                <div className="portfolio-item-cat">{item.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Seção: Formulário de Orçamento (RF12) ──────────────────── */
function OrcamentoSection() {
  const { ref, visible } = useReveal()
  const [form, setForm] = useState({ nome: '', whatsapp: '', tipo: '', data: '' })
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const formatWhatsApp = (num) =>
    num.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3') || num

  const handleWhatsAppChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
    setForm((prev) => ({ ...prev, whatsapp: raw }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const numero = '5531900000000' // ← substituir pelo número da fotógrafa
    const texto = encodeURIComponent(
      `Olá! Gostaria de solicitar um orçamento pelo site 📸\n\n` +
      `*Nome:* ${form.nome}\n` +
      `*WhatsApp:* ${formatWhatsApp(form.whatsapp)}\n` +
      `*Tipo de ensaio:* ${form.tipo}\n` +
      `*Data desejada:* ${form.data || 'A combinar'}`
    )

    window.open(`https://wa.me/${numero}?text=${texto}`, '_blank')
    setEnviado(true)
    setTimeout(() => setEnviado(false), 4000)
  }

  const isValid = form.nome && form.whatsapp.length >= 10 && form.tipo

  return (
    <section id="orcamento" className="orcamento">
      <div className="container">
        <div className="orcamento-inner" ref={ref}>
          {/* Info */}
          <div className="orcamento-info">
            <span className={`section-label ${visible ? 'fade-up fade-up-d1' : ''}`}>Orçamento</span>
            <div style={{ width: 48, height: 1, background: 'var(--gold)', margin: '1rem 0', opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.2s' }} />
            <h2 className={`section-title ${visible ? 'fade-up fade-up-d2' : ''}`}>
              Vamos criar<br />memórias juntas?
            </h2>

            <p className={`orcamento-desc ${visible ? 'fade-up fade-up-d3' : ''}`}>
              Preencha o formulário e você será redirecionada para o WhatsApp com todas as
              informações já preenchidas. Respondemos em até 24 horas.
            </p>

            <div className={`orcamento-detail ${visible ? 'fade-up fade-up-d4' : ''}`}>
              {[
                'Orçamento sem compromisso',
                'Atendimento personalizado',
                'Ensaios em BH e região',
                'Entrega de galeria online',
              ].map((item) => (
                <div key={item} className="detail-item">
                  <div className="detail-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <div className={`form-card ${visible ? 'fade-up fade-up-d2' : ''}`}>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  className="form-input"
                  placeholder="Seu nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="whatsapp">WhatsApp</label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  className="form-input"
                  placeholder="(31) 99999-9999"
                  value={formatWhatsApp(form.whatsapp)}
                  onChange={handleWhatsAppChange}
                  required
                  autoComplete="tel"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tipo">Tipo de ensaio</label>
                <select
                  id="tipo"
                  name="tipo"
                  className="form-select"
                  value={form.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Selecione o ensaio</option>
                  {TIPOS_ENSAIO.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="data">Data desejada</label>
                <input
                  id="data"
                  name="data"
                  type="date"
                  className="form-input"
                  value={form.data}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary form-submit"
                disabled={!isValid}
                style={{
                  opacity: isValid ? 1 : 0.45,
                  cursor: isValid ? 'pointer' : 'not-allowed',
                  marginTop: '1rem',
                }}
              >
                <span>{enviado ? '✓ Redirecionando...' : 'Solicitar via WhatsApp'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">Olhari</div>
      <p className="footer-tagline">Fotografia · Memórias · Arte</p>
      <p className="footer-copy">© {new Date().getFullYear()} Olhari. Todos os direitos reservados.</p>
      <a href="/admin/login" className="footer-admin">Área da Fotógrafa</a>
    </footer>
  )
}

/* ─── Página principal ───────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <SobreSection />
        <PortfolioSection />
        <OrcamentoSection />
      </main>
      <Footer />
    </>
  )
}
