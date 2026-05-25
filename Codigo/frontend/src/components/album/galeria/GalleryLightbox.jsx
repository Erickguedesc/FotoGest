import HeartIcon from './HeartIcon'
import { getFotoUrl } from '../../../services/galeriaUtils'

export default function GalleryLightbox({
  foto,
  fotos,
  index,
  favoritas,
  onClose,
  onMove,
  onToggleFavorita,
}) {
  if (!foto) return null

  const favoritada = favoritas.includes(foto.id)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0806]/95 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onClose()
        }}
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/60 hover:text-white"
        aria-label="Fechar foto ampliada"
      >
        ×
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onMove(-1)
        }}
        className="absolute left-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/60 hover:text-white md:flex"
        aria-label="Foto anterior"
      >
        ‹
      </button>

      <div
        className="relative max-h-[82vh] max-w-[86vw] overflow-hidden rounded-lg shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={getFotoUrl(foto)}
          alt="Foto ampliada"
          className="max-h-[82vh] max-w-[86vw] object-contain"
        />

        <div className="pointer-events-none absolute inset-0 grid grid-cols-4 opacity-70">
          {Array.from({ length: 16 }).map((_, item) => (
            <span
              key={item}
              className="rotate-[-35deg] select-none self-center text-center font-serif text-sm italic tracking-[0.18em] text-black/15"
            >
              © olhari fotografia
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onMove(1)
        }}
        className="absolute right-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/60 hover:text-white md:flex"
        aria-label="Próxima foto"
      >
        ›
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onToggleFavorita(foto.id)
          }}
          className={`flex items-center gap-2 rounded-full border px-6 py-3 text-xs uppercase tracking-[0.14em] ${
            favoritada
              ? 'border-[#bf5c68]/40 bg-[#bf5c68]/15 text-[#bf5c68]'
              : 'border-white/10 bg-white/10 text-white/70'
          }`}
        >
          <HeartIcon filled={favoritada} />
          {favoritada ? 'Favoritada' : 'Favoritar'}
        </button>

        <span className="text-xs uppercase tracking-[0.18em] text-white/30">
          {(index || 0) + 1} / {fotos.length}
        </span>
      </div>
    </div>
  )
}
