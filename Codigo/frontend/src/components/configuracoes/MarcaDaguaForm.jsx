import { Image as ImageIcon, RotateCcw, Save, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ConfirmActionModal from '../ui/ConfirmActionModal'
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

const fontesTexto = [
  { value: 'MODERNA', label: 'Moderna' },
  { value: 'ELEGANTE', label: 'Elegante' },
  { value: 'CLASSICA', label: 'Clássica' },
]

const coresTexto = [
  { value: 'BRANCO', label: 'Branco' },
  { value: 'PRETO', label: 'Preto' },
  { value: 'DOURADO', label: 'Dourado' },
]

const estilosTexto = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'NEGRITO', label: 'Negrito' },
  { value: 'ITALICO', label: 'Itálico' },
]

const emptyTextoForm = {
  texto: '',
  fonte: 'MODERNA',
  cor: 'BRANCO',
  estilo: 'NORMAL',
}

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
  gerarTextoLoading,
  reprocessLoading,
  onSubmit,
  onUploadImagem,
  onGerarTexto,
  onRemoverImagem,
  onReprocessar,
}) {
  const [form, setForm] = useState(emptyForm)
  const fileInputRef = useRef(null)
  const [textoForm, setTextoForm] = useState(emptyTextoForm)
  const [confirmModal, setConfirmModal] = useState(null)

  useEffect(() => {
    setForm({
      marcaDaguaUrl: data?.marcaDaguaUrl || '',
      marcaDaguaAtiva: Boolean(data?.marcaDaguaAtiva),
      marcaDaguaPosicao: data?.marcaDaguaPosicao || 'INFERIOR_DIREITA',
      marcaDaguaOpacidade: data?.marcaDaguaOpacidade ?? 35,
      marcaDaguaTamanho: data?.marcaDaguaTamanho || 'MEDIA',
      marcaDaguaMargem: data?.marcaDaguaMargem ?? 30,
    })

    setTextoForm({
  texto: data?.marcaDaguaTexto || '',
  fonte: data?.marcaDaguaFonte || 'MODERNA',
  cor: data?.marcaDaguaCor || 'BRANCO',
  estilo: data?.marcaDaguaEstilo || 'NORMAL',
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

  function handleTextoChange(event) {
  const { name, value } = event.target

  setTextoForm((current) => ({
    ...current,
    [name]: value,
  }))
}

function handleGerarTexto() {
  const texto = textoForm.texto.trim()

  if (!texto) return

  onGerarTexto?.({
    texto,
    fonte: textoForm.fonte,
    cor: textoForm.cor,
    estilo: textoForm.estilo,
  })
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
  Você pode enviar uma imagem/logo (preferencialmente PNG) ou criar uma marca d’água por texto.
  A imagem original continua preservada, e a cliente visualiza apenas a versão protegida.
</p>

<ul className="mt-4 grid gap-2 text-sm text-white/45">
  <li>• Protege as fotos antes da entrega final.</li>
  <li>• Permite usar uma imagem/logo como marca d’água.</li>
  <li>• Permite criar uma marca d’água digitando um texto personalizado.</li>
  <li>• Será aplicada nas novas fotos enviadas.</li>
  <li>• Fotos antigas podem ser reprocessadas com a nova configuração de marca d'água.</li>
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
            'ENVIAR MARCA'
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
              onClick={() => setConfirmModal('remover')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/25 px-4 py-2 text-sm text-red-200 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={15} />
              Remover
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
  <div className="mb-5">
    <h3 className="text-sm font-medium text-white">
      Criar marca d’água por texto
    </h3>

    <p className="mt-1 text-sm text-white/40">
      Digite um texto para o sistema gerar uma imagem transparente e usar como marca d’água.
    </p>

    {data?.marcaDaguaTipo === 'TEXTO' && data?.marcaDaguaTexto && (
      <p className="mt-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
        Marca atual criada por texto: {data.marcaDaguaTexto}
      </p>
    )}
  </div>

  <div className="grid gap-4 md:grid-cols-2">
    <div className="md:col-span-2">
      <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-white/35">
        Texto da marca d’água
      </label>

      <input
        type="text"
        name="texto"
        value={textoForm.texto}
        onChange={handleTextoChange}
        placeholder="Ex: © Olhari Fotografia"
        maxLength={200}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[var(--gold-border)]"
      />
    </div>

    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-white/35">
        Fonte
      </label>

      <select
        name="fonte"
        value={textoForm.fonte}
        onChange={handleTextoChange}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--gold-border)]"
      >
        {fontesTexto.map((fonte) => (
          <option key={fonte.value} value={fonte.value}>
            {fonte.label}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-white/35">
        Cor
      </label>

      <select
        name="cor"
        value={textoForm.cor}
        onChange={handleTextoChange}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--gold-border)]"
      >
        {coresTexto.map((cor) => (
          <option key={cor.value} value={cor.value}>
            {cor.label}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-white/35">
        Estilo
      </label>

      <select
        name="estilo"
        value={textoForm.estilo}
        onChange={handleTextoChange}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--gold-border)]"
      >
        {estilosTexto.map((estilo) => (
          <option key={estilo.value} value={estilo.value}>
            {estilo.label}
          </option>
        ))}
      </select>
    </div>

    <div className="flex items-end">
      <button
        type="button"
        disabled={gerarTextoLoading || !textoForm.texto.trim()}
        onClick={handleGerarTexto}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--gold-border)] bg-[var(--gold-dim)] px-5 py-3 text-sm font-medium text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-black disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/30"
      >
        {gerarTextoLoading ? 'Gerando...' : 'Gerar marca por texto'}
      </button>
    </div>
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

<label
  className={`flex items-center gap-3 ${
    temMarcaDagua ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
  }`}
>  <span
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
          onClick={() => setConfirmModal('reprocessar')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/65 transition hover:border-[var(--gold-border)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw size={16} />
          {reprocessLoading ? 'Reprocessando...' : 'Reprocessar fotos já enviadas'}
        </button>
      </div>

      <ConfirmActionModal
  open={confirmModal === 'remover'}
  type="danger"
  title="Remover marca d’água?"
  description="A marca atual será removida das configurações. As fotos novas deixarão de receber essa proteção até que uma nova marca seja enviada ou criada por texto."
  confirmText="Remover"
  cancelText="Cancelar"
  loading={uploadLoading}
  onClose={() => setConfirmModal(null)}
  onConfirm={() => {
    setConfirmModal(null)
    onRemoverImagem?.()
  }}
/>

<ConfirmActionModal
  open={confirmModal === 'reprocessar'}
  type="gold"
  title="Reprocessar fotos?"
  description="As fotos já enviadas serão atualizadas com a configuração atual da marca d’água. Isso pode alterar a visualização da galeria da cliente."
  confirmText="Reprocessar"
  cancelText="Cancelar"
  loading={reprocessLoading}
  onClose={() => setConfirmModal(null)}
  onConfirm={() => {
    setConfirmModal(null)
    onReprocessar?.()
  }}
/>

      
    </form>
  )
}