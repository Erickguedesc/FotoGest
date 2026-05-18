import { Image as ImageIcon, RotateCcw, Save, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const posicoes = [
  { value: 'SUPERIOR_ESQUERDA', label: 'Superior esquerda' },
  { value: 'SUPERIOR_DIREITA', label: 'Superior direita' },
  { value: 'CENTRO', label: 'Centro' },
  { value: 'INFERIOR_ESQUERDA', label: 'Inferior esquerda' },
  { value: 'INFERIOR_DIREITA', label: 'Inferior direita' },
]

const tamanhos = [
  { value: 'PEQUENA', label: 'Pequena' },
  { value: 'MEDIA', label: 'Média' },
  { value: 'GRANDE', label: 'Grande' },
]

const emptyForm = {
  marcaDaguaUrl: '',
  marcaDaguaAtiva: false,
  marcaDaguaPosicao: 'INFERIOR_DIREITA',
  marcaDaguaOpacidade: 35,
  marcaDaguaTamanho: 'MEDIA',
  marcaDaguaMargem: 30,
}

export default function MarcaDaguaForm({
  data,
  loading,
  uploadLoading,
  reprocessLoading,
  onSubmit,
  onUploadImagem,
  onRemoverImagem,
  onReprocessar,
}) {
  const [form, setForm] = useState(emptyForm)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setForm({
      marcaDaguaUrl: data?.marcaDaguaUrl || '',
      marcaDaguaAtiva: Boolean(data?.marcaDaguaAtiva),
      marcaDaguaPosicao: data?.marcaDaguaPosicao || 'INFERIOR_DIREITA',
      marcaDaguaOpacidade: data?.marcaDaguaOpacidade ?? 35,
      marcaDaguaTamanho: data?.marcaDaguaTamanho || 'MEDIA',
      marcaDaguaMargem: data?.marcaDaguaMargem ?? 30,
    })
  }, [data])

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit({
      marcaDaguaAtiva: form.marcaDaguaAtiva,
      marcaDaguaPosicao: form.marcaDaguaPosicao,
      marcaDaguaOpacidade: Number(form.marcaDaguaOpacidade),
      marcaDaguaTamanho: form.marcaDaguaTamanho,
      marcaDaguaMargem: Number(form.marcaDaguaMargem),
    })
  }

  function handleSelectFile(event) {
    const arquivo = event.target.files?.[0]

    if (!arquivo) return

    onUploadImagem?.(arquivo)

    event.target.value = ''
  }

  const posicaoPreview = {
    SUPERIOR_ESQUERDA: 'items-start justify-start',
    SUPERIOR_DIREITA: 'items-start justify-end',
    CENTRO: 'items-center justify-center',
    INFERIOR_ESQUERDA: 'items-end justify-start',
    INFERIOR_DIREITA: 'items-end justify-end',
  }[form.marcaDaguaPosicao]

  const tamanhoPreview = {
    PEQUENA: 'w-24',
    MEDIA: 'w-36',
    GRANDE: 'w-48',
  }[form.marcaDaguaTamanho]

  const temMarcaDagua = Boolean(form.marcaDaguaUrl)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <h3 className="text-sm font-semibold text-white">
          Sobre a marca d’água
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/45">
          Configure a marca aplicada nas fotos exibidas na galeria da cliente.
          A imagem original continua preservada, e a cliente visualiza apenas a versão protegida.
        </p>

        <ul className="mt-4 grid gap-2 text-sm text-white/45">
          <li>• Protege as fotos antes da entrega final.</li>
          <li>• Será aplicada nas novas fotos enviadas.</li>
          <li>• Fotos antigas podem ser reprocessadas com a nova configuração.</li>
        </ul>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center">
        <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--gold-border)] bg-[var(--gold-dim)] font-serif text-xs tracking-[0.16em] text-[var(--gold)]">
          {form.marcaDaguaUrl ? (
            <img
              src={form.marcaDaguaUrl}
              alt="Marca d’água"
              className="h-full w-full object-contain p-2"
            />
          ) : (
            'MARCA'
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-medium text-white">
            Logo/marca d’água das fotos
          </h3>

          <p className="mt-1 text-sm text-white/40">
            Imagem aplicada sobre as fotos exibidas na galeria da cliente. Preferencialmente PNG
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleSelectFile}
          className="hidden"
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={uploadLoading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-[var(--gold-border)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload size={15} />
            {uploadLoading ? 'Enviando...' : 'Alterar marca'}
          </button>

          {form.marcaDaguaUrl && (
            <button
              type="button"
              disabled={uploadLoading}
              onClick={onRemoverImagem}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/25 px-4 py-2 text-sm text-red-200 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={15} />
              Remover
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <h3 className="text-sm font-medium text-white">
              Aplicação da marca d’água
            </h3>

            <p className="mt-1 text-sm text-white/40">
              Ative ou desative a proteção nas fotos da galeria.
            </p>
          </div>

         <label className="flex cursor-pointer items-center gap-3">
  <span
    className={`text-sm ${
      form.marcaDaguaAtiva ? 'text-emerald-300' : 'text-white/50'
    }`}
  >
    {form.marcaDaguaAtiva ? 'Ativada' : 'Desativada'}
  </span>

  <input
  type="checkbox"
  name="marcaDaguaAtiva"
  checked={form.marcaDaguaAtiva}
  disabled={!temMarcaDagua}
  onChange={handleChange}
  className="sr-only"
/>

  <span
    className={`relative h-7 w-12 rounded-full border transition ${
      form.marcaDaguaAtiva
        ? 'border-emerald-400/40 bg-emerald-400/15'
        : 'border-white/10 bg-white/10'
    }`}
  >
    <span
      className={`absolute top-1 h-5 w-5 rounded-full transition ${
        form.marcaDaguaAtiva
          ? 'left-6 bg-emerald-300'
          : 'left-1 bg-white/50'
      }`}
    />
  </span>
</label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-white/35">
              Posição
            </p>

            <div className="grid gap-2">
              {posicoes.map((posicao) => (
                <label
                  key={posicao.value}
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition ${
                    form.marcaDaguaPosicao === posicao.value
                      ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]'
                      : 'border-white/10 bg-black/10 text-white/55 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="marcaDaguaPosicao"
                    value={posicao.value}
                    checked={form.marcaDaguaPosicao === posicao.value}
                    onChange={handleChange}
                    className="sr-only"
                  />

                  {posicao.label}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  Opacidade
                </p>

                <span className="text-sm text-[var(--gold)]">
                  {form.marcaDaguaOpacidade}%
                </span>
              </div>

              <input
                type="range"
                name="marcaDaguaOpacidade"
                min="10"
                max="100"
                value={form.marcaDaguaOpacidade}
                onChange={handleChange}
                className="w-full accent-[var(--gold)]"
              />
            </div>

            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.14em] text-white/35">
                Tamanho
              </p>

              <div className="grid grid-cols-3 gap-2">
                {tamanhos.map((tamanho) => (

                    
                  <label
                    key={tamanho.value}
                    className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-sm transition ${
                      form.marcaDaguaTamanho === tamanho.value
                        ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]'
                        : 'border-white/10 bg-black/10 text-white/55 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="marcaDaguaTamanho"
                      value={tamanho.value}
                      checked={form.marcaDaguaTamanho === tamanho.value}
                      onChange={handleChange}
                      className="sr-only"
                    />

                    {tamanho.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">
                  Margem da borda
                </p>

                <span className="text-sm text-[var(--gold)]">
                  {form.marcaDaguaMargem}px
                </span>
              </div>

              <input
                type="range"
                name="marcaDaguaMargem"
                min="0"
                max="80"
                step="5"
                value={form.marcaDaguaMargem}
                onChange={handleChange}
                className="w-full accent-[var(--gold)]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="mb-4 flex items-center gap-2">
          <ImageIcon size={17} className="text-[var(--gold)]" />

          <h3 className="text-sm font-medium text-white">
            Pré-visualização na galeria
          </h3>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#181818]">
          <img
            src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=900&q=80"
            alt="Prévia de foto com marca d’água"
            className="h-[320px] w-full object-cover brightness-75"
          />

          {form.marcaDaguaAtiva && (
            <div
              className={`absolute inset-0 flex ${posicaoPreview}`}
              style={{ padding: `${form.marcaDaguaMargem}px` }}
            >
             {form.marcaDaguaUrl && (
  <img
    src={form.marcaDaguaUrl}
    alt="Prévia da marca d’água"
    className={`${tamanhoPreview} object-contain`}
    style={{ opacity: Number(form.marcaDaguaOpacidade) / 100 }}
  />
)}
            </div>
          )}
        </div>

      <p className="mt-3 text-xs leading-5 text-white/35">
  {form.marcaDaguaUrl
    ? 'Esta prévia mostra como a marca d’água aparecerá para a cliente. A imagem original permanece preservada.'
    : 'Envie uma imagem de marca d’água para visualizar e aplicar a proteção nas fotos da galeria.'}
</p>
      </div>

      <div className="flex flex-wrap gap-3">
       <button
        type="submit"
        disabled={loading || !temMarcaDagua}          
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} />
          {loading ? 'Salvando...' : 'Salvar'}
        </button>

        <button
          type="button"
disabled={reprocessLoading || !temMarcaDagua}
          onClick={onReprocessar}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/65 transition hover:border-[var(--gold-border)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw size={16} />
          {reprocessLoading ? 'Reprocessando...' : 'Reprocessar fotos já enviadas'}
        </button>
      </div>
    </form>
  )
}