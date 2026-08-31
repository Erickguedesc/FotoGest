import { useState } from 'react'
import { ArrowRight, CheckCircle2, ImageIcon, Images } from 'lucide-react'

import useBodyScrollLock from '../../../hooks/useBodyScrollLock'
import FotoPreviewImage from './FotoPreviewImage'

const LIMITE_PREVIA = 6

export default function AlbumPublicadoResumo({
  fotos = [],
}) {
  const [mostrarFotos, setMostrarFotos] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)

  useBodyScrollLock(modalAberto)

  const capa = fotos.find((foto) => foto.ehCapa) || fotos[0]
  const fotosPrevias = fotos.slice(0, LIMITE_PREVIA)
  const temMaisFotos = fotos.length > LIMITE_PREVIA

  const getNomeFoto = (foto) => {
    if (foto.nomeOriginal) return foto.nomeOriginal

    if (foto.cloudinaryId) {
      const partes = foto.cloudinaryId.split('/')
      return partes[partes.length - 1]
    }

    return foto.id
  }

  const renderFotoCard = (foto) => {
    return (
      <article
        key={foto.id}
        className="overflow-hidden rounded-xl border border-[var(--border)] bg-white/55"
      >
        <div className="relative">
          <FotoPreviewImage
            foto={foto}
            alt={foto.cloudinaryId || 'Foto do álbum'}
          />

          {foto.ehCapa && (
            <span className="absolute left-2 top-2 rounded-full border border-[var(--gold-border)] bg-white/90 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--gold)]">
              Capa
            </span>
          )}

          <span className="absolute right-2 top-2 rounded-full border border-emerald-200 bg-white/90 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-emerald-700">
            Publicado
          </span>
        </div>

        <div className="p-3">
          <p className="truncate text-[12px] text-[var(--text)]">
            {getNomeFoto(foto)}
          </p>
        </div>
      </article>
    )
  }

  return (
    <section className="rounded-[16px] border border-[var(--border)] bg-white/82 p-4 shadow-[0_14px_34px_rgba(78,56,35,0.07)]">
      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(220px,320px)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-[12px] bg-[#f1e8dd] shadow-[0_10px_22px_rgba(78,56,35,0.07)]">
          {capa ? (
            <FotoPreviewImage
              foto={capa}
              alt="Capa do álbum publicado"
              className="aspect-[4/3] h-full min-h-[260px] w-full object-cover max-md:min-h-[220px]"
            />
          ) : (
            <div className="flex aspect-[4/3] min-h-[260px] items-center justify-center text-[12px] uppercase tracking-[0.18em] text-[var(--text-muted)] max-md:min-h-[220px]">
              Sem capa
            </div>
          )}

          <span className="absolute bottom-4 left-4 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-white/86 text-[var(--text-muted)] shadow-[0_8px_18px_rgba(78,56,35,0.10)]">
            <ImageIcon size={18} strokeWidth={1.7} />
          </span>
        </div>

        <div className="flex min-w-0 flex-col justify-center py-3 pr-3 max-xl:pr-0">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-[13px] font-semibold text-emerald-700">
            <CheckCircle2 size={15} strokeWidth={1.9} />
            Álbum publicado
          </div>

          <h3 className="max-w-[560px] font-serif text-[31px] font-light leading-[1.12] tracking-normal text-[var(--text)] max-md:text-[28px]">
            Galeria enviada para a cliente
          </h3>

          <p className="mt-4 max-w-[620px] text-[14px] leading-6 text-[var(--text-muted)]">
            As fotos foram agrupadas em um álbum e estão bloqueadas para preservar
            a galeria enviada. O link e a senha ficam disponíveis no card de publicação
            ao lado.
          </p>

          <div className="mt-5 grid max-w-[560px] grid-cols-3 gap-3 max-sm:grid-cols-1">
            <ResumoItem
              icon={Images}
              label="Fotos"
              value={fotos.length}
            />

            <ResumoItem
              icon={ImageIcon}
              label="Capa"
              value={capa ? 'Definida' : 'Pendente'}
            />

            <ResumoItem
              icon={CheckCircle2}
              label="Status"
              value="Publicado"
              success
            />
          </div>

          {fotos.length > 0 && (
            <button
              type="button"
              onClick={() => setMostrarFotos((prev) => !prev)}
              className="mt-5 inline-flex w-fit items-center gap-3 rounded-[9px] bg-[#b97804] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_12px_24px_rgba(166,95,0,0.16)] transition hover:bg-[#a65f00] max-sm:w-full max-sm:justify-center"
            >
              {mostrarFotos ? 'Ocultar fotos do álbum' : 'Ver fotos do álbum'}
              <ArrowRight size={20} strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>

        {mostrarFotos && fotos.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {fotosPrevias.map(renderFotoCard)}
            </div>

            {temMaisFotos ? (
              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-white/55 p-4 max-sm:flex-col max-sm:items-start">
                <p className="text-[13px] text-[var(--text-muted)]">
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
          <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-black/80 p-8 backdrop-blur max-sm:p-4">
            <div className="flex max-h-[84vh] w-full max-w-5xl flex-col rounded-2xl border border-[var(--gold-border)] bg-[#121212] shadow-2xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-7 py-6 max-sm:px-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--gold)]">
                    Álbum publicado
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-light text-white">
                    Todas as fotos enviadas para seleção.
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

              <div className="min-h-0 flex-1 overscroll-contain overflow-y-auto px-7 py-6 max-sm:px-5">
                <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                  {fotos.map(renderFotoCard)}
                </div>
              </div>
            </div>
          </div>
        )}
    </section>
  )
}

function ResumoItem({ icon: Icon, label, value, success }) {
  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-white/72 px-4 py-3.5 shadow-[0_8px_18px_rgba(78,56,35,0.05)]">
      <div className="flex items-center gap-3">
        <Icon
          size={23}
          strokeWidth={1.7}
          className={success ? 'shrink-0 text-emerald-700' : 'shrink-0 text-emerald-700'}
        />

        <div className="min-w-0">
          <p className={success ? 'truncate text-[15px] font-semibold capitalize text-emerald-700' : 'truncate text-[15px] font-semibold text-[var(--text)]'}>
            {value}
          </p>

          <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}
