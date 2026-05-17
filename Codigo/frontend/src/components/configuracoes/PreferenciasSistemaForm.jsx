import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormField, TextareaField } from './FormField'
import InfoBox from './InfoBox'

const emptyForm = {
  qtdFotosPadrao: '',
  valorFotoExtraPadrao: '',
  prazoExpiracaoAlbumDias: '',
  cidadePadrao: '',
  mensagemEnvioAlbum: '',
  mensagemSelecaoRecebida: '',
}

export default function PreferenciasSistemaForm({ data, loading, onSubmit }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    setForm({
      qtdFotosPadrao: data?.qtdFotosPadrao ?? '',
      valorFotoExtraPadrao: data?.valorFotoExtraPadrao ?? '',
      prazoExpiracaoAlbumDias: data?.prazoExpiracaoAlbumDias ?? '',
      cidadePadrao: data?.cidadePadrao || '',
      mensagemEnvioAlbum: data?.mensagemEnvioAlbum || '',
      mensagemSelecaoRecebida: data?.mensagemSelecaoRecebida || '',
    })
  }, [data])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit({
      ...form,
      qtdFotosPadrao: form.qtdFotosPadrao ? Number(form.qtdFotosPadrao) : null,
      valorFotoExtraPadrao: form.valorFotoExtraPadrao
        ? Number(String(form.valorFotoExtraPadrao).replace(',', '.'))
        : null,
      prazoExpiracaoAlbumDias: form.prazoExpiracaoAlbumDias
        ? Number(form.prazoExpiracaoAlbumDias)
        : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Fotos padrão no pacote" name="qtdFotosPadrao" value={form.qtdFotosPadrao} onChange={handleChange} />
        <FormField label="Valor padrão por foto extra" name="valorFotoExtraPadrao" value={form.valorFotoExtraPadrao} onChange={handleChange} />
        <FormField label="Expiração padrão do álbum em dias" name="prazoExpiracaoAlbumDias" value={form.prazoExpiracaoAlbumDias} onChange={handleChange} />
        <FormField label="Cidade padrão" name="cidadePadrao" value={form.cidadePadrao} onChange={handleChange} />
      </div>

      <TextareaField
        label="Mensagem padrão para envio do álbum"
        name="mensagemEnvioAlbum"
        value={form.mensagemEnvioAlbum}
        onChange={handleChange}
      />

      <TextareaField
        label="Mensagem padrão após seleção recebida"
        name="mensagemSelecaoRecebida"
        value={form.mensagemSelecaoRecebida}
        onChange={handleChange}
      />

      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <h3 className="text-sm font-medium text-white">Importante</h3>

        <p className="mt-2 text-sm leading-relaxed text-white/40">
          Esses valores são apenas padrões automáticos. Na criação de cada
          ensaio, a fotógrafa ainda pode alterar valor do pacote, quantidade de
          fotos e cobrança por excedentes.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={16} />
        {loading ? 'Salvando...' : 'Salvar preferências'}
      </button>

      <InfoBox
  title="Sobre as preferências do sistema"
  description="Use esta área para definir valores padrão usados automaticamente em outras telas."
  items={[
    'A quantidade de fotos e o valor por foto extra são usados como sugestão ao criar novos ensaios.',
    'A expiração do álbum define por quantos dias o link do cliente ficará válido.',
    'As mensagens padrão são usadas no envio do álbum e em fluxos de comunicação com a cliente.',
    'Esses valores são apenas padrões: ainda podem ser alterados manualmente em cada ensaio.',
  ]}
/>
    </form>
  )
}