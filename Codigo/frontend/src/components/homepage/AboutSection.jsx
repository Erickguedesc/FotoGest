import EditableButton from './EditableButton'

export default function AboutSection({ config, onEdit }) {
  return (
    <section
      id="sobre"
      className="relative min-h-[80vh] px-[10%] py-28 grid md:grid-cols-2 gap-16 items-center"
    >
      <EditableButton onClick={onEdit} className="absolute right-[10%] top-8 z-10" />

      <div className="w-full aspect-[4/5] rounded-xl border border-white/10 overflow-hidden bg-[#1a1a1a]">
        <img
          src={config?.sobreImagemUrl}
          alt={config?.sobreImagemAlt || 'Fotógrafa FotoGest'}
          className="w-full h-full object-cover opacity-80 transition-all duration-700 hover:opacity-100 hover:scale-105"
        />
      </div>

      <div>
        <h2
          className="font-serif font-light leading-[1.1] mb-8"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
        >
          {config?.sobreTitulo}{' '}
          <span className="text-[var(--gold)] italic">{config?.sobreTituloDestaque}</span>
        </h2>

        <p className="text-[var(--text-muted)] text-base mb-6 leading-relaxed">
          {config?.sobreTexto1}
        </p>

        <p className="text-[var(--text-muted)] text-base mb-10 leading-relaxed">
          {config?.sobreTexto2}
        </p>

        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
          {(config?.sobreEstatisticas || []).map((stat) => (
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
