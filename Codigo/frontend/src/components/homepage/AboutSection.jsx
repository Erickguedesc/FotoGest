export default function AboutSection() {
  return (
    <section
      id="sobre"
      className="min-h-[80vh] px-[10%] py-28 grid md:grid-cols-2 gap-16 items-center"
    >
      {/* Photo */}
      <div className="w-full aspect-[4/5] rounded-xl border border-white/10 overflow-hidden bg-[#1a1a1a]">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600" // mudar depois //
          alt="Fotógrafa Olhari"
          className="w-full h-full object-cover opacity-80 transition-all duration-700 hover:opacity-100 hover:scale-105"
        />
      </div>

      {/* Text */}
      <div>
        <h2
          className="font-serif font-light leading-[1.1] mb-8"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
        >
          Prazer,{' '}
          <span className="text-[var(--gold)] italic">sua fotógrafa.</span>
        </h2>

        <p className="text-[var(--text-muted)] text-base mb-6 leading-relaxed">
          Acredito que a fotografia vai além de um clique técnico; é sobre capturar a
          essência da conexão humana. Na Olhari, meu objetivo é criar um legado visual
          para sua família.
        </p>

        <p className="text-[var(--text-muted)] text-base mb-10 leading-relaxed">
          Especialista em ensaios Newborn, Gestante e Família, busco a luz natural e a
          verdade em cada olhar.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
          {[
            { value: '10', label: 'Famílias' },
            { value: '1', label: 'Anos de experiência' },
            { value: '100%', label: 'Amor em cada click' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-[var(--gold)] text-3xl font-light mb-1">
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}