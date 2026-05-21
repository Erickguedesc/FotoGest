import { useState } from 'react'

import SectionTitle from './SectionTitle'

const LIMITE_PREVIA = 6

export default function AlbumPublicadoResumo({
  fotos = [],
}) {
  const [mostrarFotos, setMostrarFotos] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)

  const capa = fotos.find((foto) => foto.ehCapa) || fotos[0]
  const capaUrl = capa?.urlWatermark || capa?.urlOriginal
  const fotosPrevias = fotos.slice(0, LIMITE_PREVIA)
  const temMaisFotos = fotos.length > LIMITE_PREVIA

  const renderFotoCard = (foto) => {
    const url = foto.urlWatermark || foto.urlOriginal

    return (
      <article
        key={foto.id}
        className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/20"
      >
        <div className="relative">
          <img
            src={url}
            alt={foto.cloudinaryId || 'Foto do álbum'}
            className="h-40 w-full object-cover"
          />

          {foto.ehCapa && (
            <span className="absolute left-2 top-2 rounded-full border border-[var(--gold-border)] bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--gold)]">
              Capa
            </span>
          )}

          <span className="absolute right-2 top-2 rounded-full border border-emerald-400/30 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-emerald-300">
            Publicado
          </span>
        </div>

        <div className="p-3">
          <p className="truncate text-[12px] text-white/70">
            {foto.cloudinaryId || foto.id}
          </p>
        </div>
      </article>
    )
  }

  return (
    <section className="rounded-2xl border border-[var(--gold-border)] bg-[#121212]">
      <SectionTitle
        title="Álbum do cliente"
        rightText={`${fotos.length} foto${fotos.length === 1 ? '' : 's'}`}
      />

      <div className="p-6">
        <div className="overflow-hidden rounded-2xl border border-emerald-400/25 bg-emerald-400/5">
          <div className="grid grid-cols-[220px_1fr] max-md:grid-cols-1">
            <div className="min-h-[180px] bg-black/30">
              {capaUrl ? (
                <img
                  src={capaUrl}
                  alt="Capa do álbum publicado"
                  className="h-full min-h-[180px] w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[180px] items-center justify-center text-[12px] uppercase tracking-[0.18em] text-white/25">
                  Sem capa
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center p-5">
              <div className="mb-3 inline-flex w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300">
                Álbum publicado
              </div>

              <h3 className="font-serif text-[26px] font-light tracking-[0.04em] text-white">
                Galeria enviada para a cliente
              </h3>

              <p className="mt-2 max-w-[620px] text-[13px] leading-6 text-white/45">
                As fotos foram agrupadas em um álbum e estão bloqueadas para preservar
                a galeria enviada. O link e a senha ficam disponíveis no card de publicação
                ao lado.
              </p>

              <div className="mt-5 grid max-w-[520px] grid-cols-3 gap-3 max-sm:grid-cols-1">
                <ResumoItem
                  label="Fotos"
                  value={fotos.length}
                />

                <ResumoItem
                  label="Capa"
                  value={capa ? 'Definida' : 'Pendente'}
                />

                <ResumoItem
                  label="Status"
                  value="Publicado"
                  success
                />
              </div>

              {fotos.length > 0 && (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setMostrarFotos((prev) => !prev)}
                    className="rounded-lg border border-[var(--gold-border)] px-4 py-2 text-[12px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
                  >
                    {mostrarFotos ? 'Ocultar fotos do álbum' : 'Ver fotos do álbum'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {mostrarFotos && fotos.length > 0 && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {fotosPrevias.map(renderFotoCard)}
            </div>

            {temMaisFotos ? (
              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-4 max-sm:flex-col max-sm:items-start">
                <p className="text-[13px] text-white/45">
                  Exibindo {LIMITE_PREVIA} de {fotos.length} fotos publicadas.
                </p>

                <button
                  type="button"
                  onClick={() => setModalAberto(true)}
                  className="rounded-lg border border-[var(--gold-border)] px-4 py-2 text-[12px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
                >
                  Ver todas as fotos do álbum
                </button>
              </div>
            ) : null}
          </>
        )}

        {modalAberto && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-8 backdrop-blur max-sm:p-4">
            <div className="flex max-h-[84vh] w-full max-w-5xl flex-col rounded-2xl border border-[var(--gold-border)] bg-[#121212] shadow-2xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-7 py-6 max-sm:px-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--gold)]">
                    Álbum publicado
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-light text-white">
                    Todas as fotos do álbum
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xl text-white/55 transition hover:border-white/25 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="overflow-y-auto px-7 py-6 max-sm:px-5">
                <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                  {fotos.map(renderFotoCard)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function ResumoItem({ label, value, success }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3">
      <p className={success ? 'text-[13px] text-emerald-300' : 'text-[13px] text-white'}>
        {value}
      </p>

      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
    </div>
  )
}
