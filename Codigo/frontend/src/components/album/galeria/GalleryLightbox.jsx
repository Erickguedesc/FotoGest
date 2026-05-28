import HeartIcon from './HeartIcon'
import { getFotoUrl } from '../../../services/galeriaUtils'

export default function GalleryLightbox({
  foto,
  fotos,
  index,
  favoritas,
  observacoesPorFoto,
  selecaoEnviada,
  onClose,
  onMove,
  onToggleFavorita,
  onObservacaoChange,
}) {
  if (!foto) return null

  const favoritada = favoritas.includes(foto.id)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0a0806]/95 p-4 pt-16 xl:items-center xl:overflow-hidden"
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
        className="absolute left-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/70 text-3xl leading-none text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition hover:border-white/70 hover:bg-black/85 md:flex"
        aria-label="Foto anterior"
      >
        ‹
      </button>

      <div
        className="relative max-h-[52vh] max-w-[92vw] overflow-hidden rounded-lg shadow-2xl xl:max-h-[82vh] xl:max-w-[calc(86vw-380px)]"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={getFotoUrl(foto)}
          alt="Foto ampliada"
          className="max-h-[52vh] max-w-[92vw] object-contain xl:max-h-[82vh] xl:max-w-[calc(86vw-380px)]"
        />

        <div className="pointer-events-none absolute inset-0 grid grid-cols-4 opacity-70">
          {Array.from({ length: 16 }).map((_, item) => (
            <span
              key={item}
              className="rotate-[-35deg] select-none self-center text-center font-serif text-sm italic tracking-[0.18em] text-black/15"
            >
              © FotoGest fotografia
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
        className="absolute right-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/70 text-3xl leading-none text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition hover:border-white/70 hover:bg-black/85 md:flex xl:right-[370px]"
        aria-label="Próxima foto"
      >
        ›
      </button>

      <aside
        className="absolute left-4 right-4 top-[calc(52vh+5rem)] max-h-[36vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#15110d] p-5 text-[#e8dfd4] shadow-2xl xl:bottom-6 xl:left-auto xl:right-6 xl:top-20 xl:w-[340px] xl:max-h-none"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#887e74]">
          Foto {(index || 0) + 1} / {fotos.length}
        </p>

        <h2 className="mt-2 font-serif text-2xl font-light">
          Observação da foto
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#887e74]">
          Se desejar, use este espaço para indicar ajustes, preferências ou
          detalhes importantes para a fotógrafa.
        </p>

        <button
          type="button"
          onClick={() => onToggleFavorita(foto.id)}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3 text-xs uppercase tracking-[0.14em] transition ${
            favoritada
              ? 'border-[#bf5c68]/40 bg-[#bf5c68]/15 text-[#df8b96]'
              : 'border-white/10 bg-white/10 text-white/70 hover:text-white'
          }`}
        >
          <HeartIcon filled={favoritada} />
          {favoritada ? 'Favoritada' : 'Favoritar foto'}
        </button>

        <label
          htmlFor={`lightbox-observacao-${foto.id}`}
          className="mt-5 block text-[10px] uppercase tracking-[0.16em] text-[#c9a96e]"
        >
          Observação
        </label>

        <textarea
          id={`lightbox-observacao-${foto.id}`}
          value={observacoesPorFoto[foto.id] || ''}
          onChange={(event) => onObservacaoChange(foto.id, event.target.value)}
          disabled={!favoritada || selecaoEnviada}
          maxLength={500}
          rows={7}
          placeholder={
            favoritada
              ? 'Ex.: gostei da expressão, ajustar cabelo, preferir em PB...'
              : 'Favorite esta foto para adicionar uma observação.'
          }
          className="mt-2 min-h-[150px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-6 text-[#e8dfd4] outline-none transition placeholder:text-[#887e74] focus:border-[#c9a96e] disabled:cursor-not-allowed disabled:opacity-55"
        />

        <p className="mt-2 text-right text-[10px] text-[#887e74]">
          {(observacoesPorFoto[foto.id] || '').length} / 500
        </p>

        {selecaoEnviada ? (
          <p className="mt-4 rounded-xl border border-[#5a9468]/20 bg-[#5a9468]/10 px-4 py-3 text-sm leading-6 text-[#7db88a]">
            Seleção já enviada. As observações não podem mais ser alteradas.
          </p>
        ) : null}
      </aside>
    </div>
  )
}
