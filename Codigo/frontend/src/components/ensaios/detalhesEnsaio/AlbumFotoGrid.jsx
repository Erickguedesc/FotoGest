export default function AlbumFotoGrid({
  fotos = [],
  loading,
  onDefinirCapa,
  onRemoverFoto,
}) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-[var(--gold-border)] bg-[#121212] p-5 text-[13px] text-white/45">
        Carregando fotos...
      </section>
    )
  }

  if (!fotos.length) {
    return (
      <section className="rounded-2xl border border-[var(--gold-border)] bg-[#121212] p-6 text-center">
        <p className="text-[13px] text-white/55">
          Nenhuma foto enviada ainda.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-[var(--gold-border)] bg-[#121212] p-5">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {fotos.map((foto) => {
          const url = foto.urlWatermark || foto.urlOriginal

          return (
            <article
              key={foto.id}
              className="group overflow-hidden rounded-xl border border-white/[0.08] bg-black/20"
            >
              <div className="relative">
                <img
                  src={url}
                  alt={foto.cloudinaryId || 'Foto do ensaio'}
                  className="h-40 w-full object-cover"
                />

                {foto.ehCapa && (
                  <span className="absolute left-2 top-2 rounded-full border border-[var(--gold-border)] bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--gold)]">
                    Capa
                  </span>
                )}
              </div>

              <div className="p-3">
                <p className="truncate text-[12px] text-white/70">
                  {foto.cloudinaryId || foto.id}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={foto.ehCapa}
                    onClick={() => onDefinirCapa(foto.id)}
                    className="flex-1 rounded-lg border border-white/[0.10] px-2 py-2 text-[11px] text-white/55 transition enabled:hover:border-[var(--gold-border)] enabled:hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Capa
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoverFoto(foto.id)}
                    className="flex-1 rounded-lg border border-red-400/30 px-2 py-2 text-[11px] text-red-300 transition hover:bg-red-400/10"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}