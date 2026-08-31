import { useMemo, useState } from 'react'
import { ImageIcon, LayoutGrid } from 'lucide-react'

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
        className={`group overflow-hidden rounded-xl border bg-white/55 transition ${
          selecionada
            ? 'border-[var(--gold-border)] ring-1 ring-[var(--gold-border)]'
            : 'border-[var(--border)]'
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
                  ? 'border-[var(--gold-border)] bg-[#a65f00] text-white'
                  : 'border-[var(--border)] bg-white/80 text-[var(--text-muted)] hover:border-[var(--gold-border)] hover:text-[var(--gold)]'
              }`}
              title={selecionada ? 'Desmarcar foto' : 'Selecionar foto'}
            >
              {selecionada ? '✓' : ''}
            </button>
          )}

          {foto.ehCapa && (
            <span className="absolute left-2 top-2 rounded-full border border-[var(--gold-border)] bg-white/90 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--gold)]">
              Capa
            </span>
          )}
        </div>

        <div className="p-3">
          <p className="truncate text-[12px] text-[var(--text)]">
            {getNomeFoto(foto)}
          </p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={disabled || foto.ehCapa}
              onClick={() => onDefinirCapa(foto.id)}
              className="flex-1 rounded-lg border border-[var(--border)] px-2 py-2 text-[11px] text-[var(--text-muted)] transition enabled:hover:border-[var(--gold-border)] enabled:hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Capa
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onRemoverFoto(foto.id)}
              className="flex-1 rounded-lg border border-red-200 px-2 py-2 text-[11px] text-red-700 transition enabled:hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-35"
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
      <section className="rounded-[14px] border border-[var(--border)] bg-white/78 p-5 text-[13px] text-[var(--text-muted)] shadow-[0_14px_34px_rgba(78,56,35,0.07)]">
        Carregando fotos...
      </section>
    )
  }

  if (!fotos.length) {
    return (
      <section className="rounded-[14px] border border-[var(--border)] bg-white/78 p-4 shadow-[0_14px_34px_rgba(78,56,35,0.07)]">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--gold-dim)] text-[var(--gold)]">
            <LayoutGrid size={16} strokeWidth={1.8} />
          </span>

          <h2 className="text-[15px] font-semibold text-[var(--text)]">
            Galeria do álbum
          </h2>
        </div>

        <div className="grid gap-3 rounded-xl border border-[var(--border)] bg-white/45 p-3 md:grid-cols-[minmax(0,1fr)_minmax(260px,1.4fr)]">
          <div className="grid grid-cols-5 gap-2 max-sm:hidden" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex min-h-[70px] items-center justify-center rounded-[8px] bg-[linear-gradient(135deg,#f6f3ee,#ebe5dc)] text-[#d8d0c6]"
              >
                <ImageIcon size={28} strokeWidth={1.5} />
              </div>
            ))}
          </div>

          <div className="flex min-h-[82px] flex-col items-center justify-center rounded-[10px] border border-dashed border-[var(--border)] bg-white/55 px-5 text-center">
            <p className="text-[13px] text-[var(--text-muted)]">
              Nenhuma foto enviada ainda.
            </p>

            <p className="mt-1 text-[11px] text-[var(--text-muted)] opacity-75">
              As imagens aparecerão aqui após o upload.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-white/78 p-5 shadow-[0_14px_34px_rgba(78,56,35,0.07)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[12px] uppercase tracking-[0.08em] text-[var(--gold)]">
            Fotos do álbum
          </p>

          <p className="mt-1 text-[13px] text-[var(--text-muted)]">
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
              className="rounded-lg border border-[var(--border)] bg-white/55 px-4 py-2 text-[11px] font-medium text-[var(--text-muted)] transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]"
            >
              {todasSelecionadas ? 'Desmarcar todas' : 'Selecionar todas'}
            </button>

            {totalSelecionadas > 0 && (
              <>
                <button
                  type="button"
                  onClick={limparSelecao}
                  className="rounded-lg border border-[var(--border)] bg-white/55 px-4 py-2 text-[11px] font-medium text-[var(--text-muted)] transition hover:border-[var(--gold-border)] hover:text-[var(--text)]"
                >
                  Limpar seleção
                </button>

                <button
                  type="button"
                  onClick={removerSelecionadas}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-[11px] font-medium text-red-700 transition hover:bg-red-100"
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
        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-white/55 p-4 max-sm:flex-col max-sm:items-start">
          <p className="text-[13px] text-[var(--text-muted)]">
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
