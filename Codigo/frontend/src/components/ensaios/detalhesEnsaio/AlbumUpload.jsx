import { useRef, useState } from 'react'

import SectionTitle from './SectionTitle'

export default function AlbumUpload({
  totalFotos = 0,
  loading,
  disabled,
  onUpload,
}) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = (fileList) => {
    if (disabled) return

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
            if (!disabled) inputRef.current?.click()
          }}
          onDragEnter={(event) => {
            event.preventDefault()
            if (!disabled) setDragActive(true)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            if (!disabled) setDragActive(true)
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
          className={`flex min-h-[150px] w-full flex-col items-center justify-center rounded-xl border border-dashed text-center transition disabled:cursor-not-allowed ${
            disabled
              ? 'border-emerald-400/25 bg-emerald-400/5 opacity-80'
              : dragActive
                ? 'border-[var(--gold-border)] bg-[var(--gold-dim)]'
                : 'border-white/[0.12] bg-black/10 hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)]'
          }`}
        >
          <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full border ${
            disabled
              ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
              : 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]'
          }`}>
            {disabled ? '✓' : '↑'}
          </div>

          <p className="text-[13px] text-white/70">
            {disabled
              ? 'Álbum publicado'
              : loading
                ? 'Enviando fotos...'
                : 'Arraste fotos aqui'}
          </p>

          <p className="mt-1 text-[12px] text-white/35">
            {disabled
              ? 'Uploads bloqueados para não alterar a galeria enviada.'
              : 'ou clique para selecionar arquivos — JPG, PNG, WEBP'}
          </p>
        </button>
      </div>
    </section>
  )
}