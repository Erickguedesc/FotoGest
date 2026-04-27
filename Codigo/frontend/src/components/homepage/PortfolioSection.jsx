const photos = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600',
    alt: 'Newborn',
    label: 'Ana Clara — Newborn',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600',
    alt: 'Gestante',
    label: 'Família Silva',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1543342384-1f1350e27861?w=600',
    alt: 'Casal',
    label: 'Ensaio Gestante',
  },
]

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="min-h-[80vh] px-[10%] py-28 bg-[#0f0f0f]">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--gold)] mb-4">
          Galeria
        </p>
        <h2
          className="font-serif font-light leading-[1.1]"
          style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
        >
          Olhares{' '}
          <span className="text-[var(--gold)] italic">Capturados</span>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1a1a1a] cursor-pointer group"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover transition-all duration-500 filter grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-90 group-hover:scale-105"
            />

            {/* Label */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="absolute bottom-5 left-5 font-serif text-2xl text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              {photo.label}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      
    </section>
  )
}