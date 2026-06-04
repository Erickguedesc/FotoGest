import { useMemo, useState } from 'react'

import useBodyScrollLock from '../../../hooks/useBodyScrollLock'
import FotoPreviewImage from './FotoPreviewImage'

const LIMITE_PREVIA = 9

export default function AlbumFotoGrid({
  fotos = [],
  loading,
  disabled = false,
  onDefinirCapa,
  onRemoverFoto,
  onRemoverFotos,
}) {
  const [selectedIds, setSelectedIds] = useState([])
  const [modalAberto, setModalAberto] = useState(false)

  useBodyScrollLock(modalAberto)

  const totalSelecionadas = selectedIds.length
  const fotosPrevias = fotos.slice(0, LIMITE_PREVIA)
  const temMaisFotos = fotos.length > LIMITE_PREVIA

  const todasSelecionadas = useMemo(() => {
    return fotos.length > 0 && selectedIds.length === fotos.length
  }, [fotos.length, selectedIds.length])

  const toggleFoto = (fotoId) => {
    setSelectedIds((prev) =>
      prev.includes(fotoId)
        ? prev.filter((id) => id !== fotoId)
        : [...prev, fotoId]
    )
  }

  const selecionarTodas = () => {
    if (todasSelecionadas) {
      setSelectedIds([])
      return
    }

    setSelectedIds(fotos.map((foto) => foto.id))
  }

  const limparSelecao = () => {
    setSelectedIds([])
  }

  const removerSelecionadas = () => {
    if (!selectedIds.length) return
    onRemoverFotos(selectedIds)
    setSelectedIds([])
  }

  const getNomeFoto = (foto) => {
    if (foto.nomeOriginal) return foto.nomeOriginal

    if (foto.cloudinaryId) {
      const partes = foto.cloudinaryId.split('/')
      return partes[partes.length - 1]
    }

    return foto.id
  }

  const renderFotoCard = (foto) => {
    const selecionada = selectedIds.includes(foto.id)

    return (
      <article
        key={foto.id}
        className={`group overflow-hidden rounded-xl border bg-black/20 transition ${
          selecionada
            ? 'border-[var(--gold-border)] ring-1 ring-[var(--gold-border)]'
            : 'border-white/[0.08]'
        }`}
      >
        <div className="relative">
          <FotoPreviewImage foto={foto} alt={getNomeFoto(foto)} />

          {!disabled && (
            <button
              type="button"
              onClick={() => toggleFoto(foto.id)}
              className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border text-[12px] transition ${
                selecionada
                  ? 'border-[var(--gold-border)] bg-[var(--gold)] text-[#1A1200]'
                  : 'border-white/25 bg-black/60 text-white/45 hover:border-[var(--gold-border)] hover:text-[var(--gold)]'
              }`}
              title={selecionada ? 'Desmarcar foto' : 'Selecionar foto'}
            >
              {selecionada ? '✓' : ''}
            </button>
          )}

          {foto.ehCapa && (
            <span className="absolute left-2 top-2 rounded-full border border-[var(--gold-border)] bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--gold)]">
              Capa
            </span>
          )}
        </div>

        <div className="p-3">
          <p className="truncate text-[12px] text-white/70">
            {getNomeFoto(foto)}
          </p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={disabled || foto.ehCapa}
              onClick={() => onDefinirCapa(foto.id)}
              className="flex-1 rounded-lg border border-white/[0.10] px-2 py-2 text-[11px] text-white/55 transition enabled:hover:border-[var(--gold-border)] enabled:hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Capa
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onRemoverFoto(foto.id)}
              className="flex-1 rounded-lg border border-red-400/30 px-2 py-2 text-[11px] text-red-300 transition enabled:hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Remover
            </button>
          </div>
        </div>
      </article>
    )
  }

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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[12px] uppercase tracking-[0.16em] text-white/35">
            Fotos do álbum
          </p>

          <p className="mt-1 text-[13px] text-white/55">
            {totalSelecionadas > 0
              ? `${totalSelecionadas} foto${totalSelecionadas === 1 ? '' : 's'} selecionada${totalSelecionadas === 1 ? '' : 's'}`
              : `${fotos.length} foto${fotos.length === 1 ? '' : 's'} enviada${fotos.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {!disabled && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={selecionarTodas}
              className="rounded-lg border border-white/[0.10] px-4 py-2 text-[11px] font-medium text-white/55 transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]"
            >
              {todasSelecionadas ? 'Desmarcar todas' : 'Selecionar todas'}
            </button>

            {totalSelecionadas > 0 && (
              <>
                <button
                  type="button"
                  onClick={limparSelecao}
                  className="rounded-lg border border-white/[0.10] px-4 py-2 text-[11px] font-medium text-white/55 transition hover:border-white/20 hover:text-white"
                >
                  Limpar seleção
                </button>

                <button
                  type="button"
                  onClick={removerSelecionadas}
                  className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-[11px] font-medium text-red-300 transition hover:bg-red-400/15"
                >
                  Apagar selecionadas
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {fotosPrevias.map(renderFotoCard)}
      </div>

      {temMaisFotos && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-4 max-sm:flex-col max-sm:items-start">
          <p className="text-[13px] text-white/45">
            Exibindo {LIMITE_PREVIA} de {fotos.length} fotos neste card.
          </p>

          <button
            type="button"
            onClick={() => setModalAberto(true)}
            className="rounded-lg border border-[var(--gold-border)] px-4 py-2 text-[12px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
          >
            Ver todas as fotos
          </button>
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-black/80 p-8 backdrop-blur max-sm:p-4">
          <div className="flex max-h-[84vh] w-full max-w-5xl flex-col rounded-2xl border border-[var(--gold-border)] bg-[#121212] shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-7 py-6 max-sm:px-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--gold)]">
                  Conferência do álbum
                </p>
                <h3 className="mt-1 font-serif text-2xl font-light text-white">
                  Todas as fotos enviadas
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
