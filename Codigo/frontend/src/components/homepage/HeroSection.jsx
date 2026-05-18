import EditableButton from './EditableButton'

export default function HeroSection({ config, onEdit }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-[10%] pt-20"
      style={{
        background: 'radial-gradient(circle at center, #1a1a1a 0%, #0c0c0c 100%)',
      }}
    >
      <EditableButton onClick={onEdit} className="absolute right-6 top-28 z-10" />

      <p className="animate-fade-up tracking-[0.5em] uppercase text-[11px] text-[var(--gold)] mb-6">
        {config?.heroSelo}
      </p>

      <h1
        className="animate-fade-up-delay-1 font-serif font-light leading-[1.1] mb-8"
        style={{ fontSize: 'clamp(40px, 6vw, 70px)' }}
      >
        {config?.heroTitulo}
        <br />
        <span className="text-[var(--gold)] italic">{config?.heroTituloDestaque}</span>
      </h1>

      <p className="animate-fade-up-delay-2 text-[var(--text-muted)] text-sm tracking-wider max-w-md mb-10">
        {config?.heroSubtitulo}
      </p>

      <a
        href={config?.heroBotaoLink || '#portfolio'}
        className="animate-fade-up-delay-2 inline-block px-8 py-4 border border-[var(--gold-border)] text-[var(--gold)] text-[11px] uppercase tracking-[0.2em] rounded-full transition-all duration-300 hover:bg-[var(--gold)] hover:text-black no-underline"
        style={{ '--gold-border': 'rgba(212,175,55,0.4)' }}
      >
        {config?.heroBotaoTexto}
      </a>

      <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          role para ver mais na página
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[var(--text-muted)] to-transparent" />
      </div>
    </section>
  )
}
