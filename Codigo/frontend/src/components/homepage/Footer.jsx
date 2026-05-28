import EditableButton from './EditableButton'

function hasValue(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function getWhatsappLink(value) {
  const digits = value?.replace(/\D/g, '')

  return digits?.length >= 10 ? `https://wa.me/${digits}` : null
}

function getInstagramLink(value) {
  if (!hasValue(value)) return null

  const trimmed = value.trim()

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://instagram.com/${trimmed.replace('@', '')}`
}

function FooterLink({ href, children, external = false }) {
  if (!href || !children) return null

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="no-underline text-sm leading-7 text-[var(--text-muted)] transition-colors hover:text-[var(--gold)]"
    >
      {children}
    </a>
  )
}

export default function Footer({ config, onEdit }) {
  const whatsappLink = getWhatsappLink(config?.footerWhatsapp)
  const instagramLink = getInstagramLink(config?.footerInstagram)

  return (
    <footer className="relative border-t border-white/10 bg-[#080808] px-[10%] py-14">
      <EditableButton onClick={onEdit} className="absolute right-4 top-3 z-10" />

      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl tracking-[0.3em] text-[var(--gold)]">
            {config?.footerEstudioNome || 'FOTOGEST'}
          </p>

          {hasValue(config?.footerSlogan) ? (
            <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--text-muted)]">
              {config.footerSlogan}
            </p>
          ) : null}
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            Contato
          </p>

          <div className="flex flex-col">
            <FooterLink href={whatsappLink} external>
              {config?.footerWhatsapp}
            </FooterLink>

            <FooterLink href={hasValue(config?.footerEmail) ? `mailto:${config.footerEmail}` : null}>
              {config?.footerEmail}
            </FooterLink>

            {hasValue(config?.footerCidade) ? (
              <span className="text-sm leading-7 text-[var(--text-muted)]">
                {config.footerCidade}
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            Social
          </p>

          <div className="flex flex-col">
            <FooterLink href={instagramLink} external>
              {config?.footerInstagram}
            </FooterLink>
          </div>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            Administração
          </p>

          <a
            href={config?.footerAdminLink || '/Login'}
            className="group inline-flex items-center gap-2 text-sm leading-7 text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--gold)]"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-colors group-hover:stroke-[var(--gold)]"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {config?.footerAdminTexto || 'Área Administrativa'}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <span>{config?.footerTexto}</span>
      </div>
    </footer>
  )
}
