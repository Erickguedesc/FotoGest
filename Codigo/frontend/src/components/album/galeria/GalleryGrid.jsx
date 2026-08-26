import HeartIcon from './HeartIcon'
import { getFotoUrl } from '../../../services/galeriaUtils'

export default function GalleryGrid({
  fotos,
  favoritas,
  onOpenLightbox,
  onToggleFavorita,
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-10 pb-28">
      {fotos.length === 0 ? (
        <div className="rounded-3xl border border-[#ddd5c5] bg-[#faf8f4] p-10 text-center">
          <h2 className="font-serif text-3xl font-light">
            Nenhuma foto disponível
          </h2>
          <p className="mt-2 text-sm text-[#5c5248]">
            Este álbum ainda não possui fotos publicadas.
          </p>
        </div>
      ) : (
        <div className="columns-2 gap-2 md:columns-3 lg:columns-4">
          {fotos.map((foto, index) => {
            const selecionada = favoritas.includes(foto.id)
            const url = getFotoUrl(foto, { width: 720 })

            return (
              <article
                key={foto.id}
                className={`group relative mb-2 break-inside-avoid overflow-hidden rounded-md bg-[#ede6d8] shadow-sm transition hover:shadow-2xl ${
                  selecionada
                    ? 'outline outline-[3px] outline-[#bf5c68] outline-offset-[-3px]'
                    : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => onOpenLightbox(index, 'galeria')}
                  className="block w-full cursor-zoom-in"
                >
                  <img
                    src={url}
                    alt={`Foto ${index + 1}`}
                    loading="lazy"
                    className="h-auto w-full select-none object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-75"
                  />
                </button>

                <span className="absolute left-3 top-3 text-[10px] tracking-[0.12em] text-white/50 opacity-0 transition group-hover:opacity-100">
                  #{String(index + 1).padStart(3, '0')}
                </span>

                <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-b from-transparent to-black/45 p-3 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onToggleFavorita(foto.id)
                    }}
                    className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#faf8f4]/95 text-[#bf5c68] transition hover:scale-110"
                    title="Favoritar"
                  >
                    <HeartIcon filled={selecionada} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
