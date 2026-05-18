import EditableButton from './EditableButton'

export default function PortfolioSection({ config, onEdit }) {
  const photos = config?.portfolioFotos || []

  return (
    <section id="portfolio" className="relative min-h-[80vh] px-[10%] py-28 bg-[#0f0f0f]">
      <EditableButton onClick={onEdit} className="absolute right-[10%] top-8 z-10" />

      <div className="text-center mb-16">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--gold)] mb-4">
          {config?.portfolioSelo}
        </p>
        <h2
          className="font-serif font-light leading-[1.1]"
          style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
        >
          {config?.portfolioTitulo}{' '}
          <span className="text-[var(--gold)] italic">{config?.portfolioTituloDestaque}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {photos.map((photo, index) => (
          <div
            key={photo.id || `${photo.src}-${index}`}
            className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1a1a1a] cursor-pointer group"
          >
            <img
              src={photo.src}
              alt={photo.alt || photo.label}
              className="w-full h-full object-cover transition-all duration-500 filter grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-90 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="absolute bottom-5 left-5 font-serif text-2xl text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              {photo.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
