import { useRef, useState } from 'react'

import SectionTitle from './SectionTitle'

export default function AlbumUpload({
  totalFotos = 0,
  loading,
  disabled,
  uploadProgress = 0,
  uploadTotal = 0,
  onUpload,
}) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const isFinalizando = loading && uploadProgress >= 100

  const handleFiles = (fileList) => {
    if (disabled || loading) return

    const arquivos = Array.from(fileList || [])

    if (!arquivos.length) return

    onUpload(arquivos)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--gold-border)] bg-[#121212]">
      <SectionTitle title="Álbum do cliente" rightText={`${totalFotos} fotos`} />

      <div className="p-6">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={disabled || loading}
          onChange={(event) => handleFiles(event.target.files)}
        />

        <button
          type="button"
          disabled={loading || disabled}
          onClick={() => {
            if (!disabled && !loading) inputRef.current?.click()
          }}
          onDragEnter={(event) => {
            event.preventDefault()
            if (!disabled && !loading) setDragActive(true)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            if (!disabled && !loading) setDragActive(true)
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            setDragActive(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragActive(false)
            handleFiles(event.dataTransfer.files)
          }}
          className={`flex min-h-[170px] w-full flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center transition disabled:cursor-not-allowed ${
            disabled
              ? 'border-emerald-400/25 bg-emerald-400/5 opacity-80'
              : dragActive
                ? 'border-[var(--gold-border)] bg-[var(--gold-dim)]'
                : 'border-white/[0.12] bg-black/10 hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)]'
          }`}
        >
          <div
            className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full border ${
              disabled
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                : 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]'
            }`}
          >
            {disabled ? '✓' : loading ? '...' : '↑'}
          </div>

          <p
            className={`text-[13px] ${
              disabled
                ? 'text-emerald-300/80'
                : loading
                  ? 'text-[var(--gold)]'
                  : 'text-white/70'
            }`}
          >
            {disabled
              ? 'Álbum publicado'
              : loading
                ? isFinalizando
                  ? 'Finalizando envio de fotos...Aguarde!!'
                  : `Enviando ${uploadTotal || ''} foto${uploadTotal === 1 ? '' : 's'}...`
                : 'Arraste fotos aqui'}
          </p>

          <p className="mt-1 text-[12px] text-white/35">
            {disabled
              ? 'Uploads bloqueados para não alterar a galeria enviada.'
              : loading
                ? 'Não feche a página até o envio terminar.'
                : 'ou clique para selecionar arquivos — JPG, PNG, WEBP'}
          </p>

          {loading && (
            <div className="mt-5 w-full max-w-[420px]">
              <div className="mb-2 flex items-center justify-between text-[11px] text-white/35">
                <span>
                  {isFinalizando ? 'Processando imagens' : 'Progresso do upload'}
                </span>

                <span className="text-[var(--gold)]">
                  {uploadProgress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full rounded-full bg-emerald-500/80 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
              </div>
            </div>
          )}
        </button>
      </div>
    </section>
  )
}