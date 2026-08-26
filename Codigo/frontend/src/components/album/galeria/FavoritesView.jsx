import HeartIcon from './HeartIcon'
import SelectionSummary from './SelectionSummary'
import { getFotoUrl } from '../../../services/galeriaUtils'

export default function FavoritesView({
  fotosFavoritas,
  totalSelecionadas,
  limite,
  excedente,
  cobraFotoExtra,
  valorFotoExtra,
  valorExcedente,
  progresso,
  erroEnvio,
  enviando,
  selecaoEnviada,
  observacoesPorFoto,
  onExploreGallery,
  onOpenLightbox,
  onToggleFavorita,
  onOpenConfirm,
  onObservacaoChange,
}) {
  return (
    <section className="mx-auto max-w-[1300px] px-5 py-12 pb-28">
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#a8783a]">
          Suas escolhas
        </p>
        <h2 className="font-serif text-5xl font-light">
          Fotos <em className="text-[#a8783a]">favoritas</em>
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#5c5248]">
          Estas são as memórias que você escolheu guardar para sempre.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
        <div>
          {fotosFavoritas.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-[#ddd5c5] bg-[#faf8f4] p-10 text-center">
              <div className="mb-3 text-5xl opacity-30">♡</div>
              <h3 className="font-serif text-3xl italic text-[#998f83]">
                Nenhuma favorita ainda
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-[#998f83]">
                Volte à galeria e toque no coração das fotos que mais tocaram
                você.
              </p>
              <button
                type="button"
                onClick={onExploreGallery}
                className="mt-6 rounded-full border border-[#ddd5c5] px-7 py-3 text-xs uppercase tracking-[0.16em] text-[#998f83] transition hover:border-[#a8783a] hover:text-[#a8783a]"
              >
                Explorar galeria
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between border-b border-[#ddd5c5] pb-4">
                <h3 className="text-lg font-medium">
                  {fotosFavoritas.length} foto
                  {fotosFavoritas.length > 1 ? 's' : ''} selecionada
                  {fotosFavoritas.length > 1 ? 's' : ''}
                </h3>
                <span className="rounded-full border border-[#a8783a]/20 bg-[#a8783a]/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.12em] text-[#a8783a]">
                  clique no x para remover
                </span>
              </div>

              <div className="columns-2 gap-2 md:columns-3">
                {fotosFavoritas.map((foto, index) => (
                  <article
                    key={foto.id}
                    className="group relative mb-2 break-inside-avoid overflow-hidden rounded-md border-2 border-[#bf5c68]/45 bg-[#ede6d8]"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenLightbox(index, 'favoritas')}
                      className="block w-full"
                    >
                      <img
                        src={getFotoUrl(foto, { width: 720 })}
                        alt="Foto favorita"
                        loading="lazy"
                        className="h-auto w-full object-cover transition group-hover:brightness-75"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleFavorita(foto.id)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white/70 opacity-0 transition hover:bg-[#bf4f4f] hover:text-white group-hover:opacity-100"
                      title="Remover"
                    >
                      ×
                    </button>

                    <div className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#bf5c68]/40 bg-[#bf5c68]/15 text-[#bf5c68] backdrop-blur">
                      <HeartIcon filled />
                    </div>

                    <div className="border-t border-[#d7cbb9] bg-[#faf8f4] p-3">
                      <label
                        htmlFor={`observacao-${foto.id}`}
                        className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-[#a8783a]"
                      >
                        Observação
                      </label>

                      <textarea
                        id={`observacao-${foto.id}`}
                        value={observacoesPorFoto[foto.id] || ''}
                        onChange={(event) =>
                          onObservacaoChange(foto.id, event.target.value)
                        }
                        disabled={selecaoEnviada}
                        maxLength={500}
                        rows={3}
                        placeholder="Ex.: gostei da expressão, ajustar cabelo, preferir em PB..."
                        className="min-h-[84px] w-full resize-none rounded-xl border border-[#ddd5c5] bg-white/70 px-3 py-2 text-sm leading-5 text-[#1a1610] outline-none transition placeholder:text-[#998f83] focus:border-[#a8783a] disabled:cursor-not-allowed disabled:opacity-55"
                      />

                      <p className="mt-1 text-right text-[10px] text-[#998f83]">
                        {(observacoesPorFoto[foto.id] || '').length} / 500
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        <SelectionSummary
          totalSelecionadas={totalSelecionadas}
          limite={limite}
          excedente={excedente}
          cobraFotoExtra={cobraFotoExtra}
          valorFotoExtra={valorFotoExtra}
          valorExcedente={valorExcedente}
          progresso={progresso}
          erroEnvio={erroEnvio}
          enviando={enviando}
          selecaoEnviada={selecaoEnviada}
          onOpenConfirm={onOpenConfirm}
        />
      </div>
    </section>
  )
}
