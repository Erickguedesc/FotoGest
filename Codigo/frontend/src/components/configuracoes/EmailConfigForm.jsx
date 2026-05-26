import { Mail, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormField, TextareaField } from './FormField'
import InfoBox from './InfoBox'

const emptyForm = {
  ativo: false,
  nomeRemetente: '',
  emailResposta: '',
  emailFotografaAvisos: '',
  enviarAlbumPublicado: true,
  avisarSelecaoRecebida: true,
  enviarMudancaStatus: false,
  mensagemAlbumPublicado: '',
  mensagemSelecaoRecebida: '',
}

function ToggleField({ label, description, checked, onChange }) {
  return (
    <label className="theme-panel flex items-start justify-between gap-4 rounded-2xl border p-4">
      <span>
        <span className="block text-sm font-medium text-[var(--text)]">
          {label}
        </span>
        <span className="theme-muted mt-1 block text-xs leading-5">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-[var(--gold)]"
      />
    </label>
  )
}

export default function EmailConfigForm({ data, loading, onSubmit }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    setForm({
      ativo: Boolean(data?.ativo),
      nomeRemetente: data?.nomeRemetente || '',
      emailResposta: data?.emailResposta || '',
      emailFotografaAvisos: data?.emailFotografaAvisos || '',
      enviarAlbumPublicado: data?.enviarAlbumPublicado !== false,
      avisarSelecaoRecebida: data?.avisarSelecaoRecebida !== false,
      enviarMudancaStatus: Boolean(data?.enviarMudancaStatus),
      mensagemAlbumPublicado: data?.mensagemAlbumPublicado || '',
      mensagemSelecaoRecebida: data?.mensagemSelecaoRecebida || '',
    })
  }, [data])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleToggle(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-[var(--gold-border)] bg-[var(--gold-dim)] p-5">
        <div className="flex items-start gap-3">
          <span className="rounded-xl border border-[var(--gold-border)] p-2 text-[var(--gold)]">
            <Mail size={18} />
          </span>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text)]">
              E-mails transacionais
            </h3>
            <p className="theme-muted mt-2 text-sm leading-6">
              Configure aqui os avisos automáticos enviados durante o atendimento. 
              Você pode ativar o envio do link do álbum via e-mail para a cliente, receber aviso quando a seleção for concluída e controlar quais comunicações ficam habilitadas.
            </p>
          </div>
        </div>
      </div>

      <ToggleField
        label="Ativar envio automatico de e-mails"
        description="Quando desligado, nenhum e-mail automatico sera enviado."
        checked={form.ativo}
        onChange={(value) => handleToggle('ativo', value)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Nome do remetente"
          name="nomeRemetente"
          value={form.nomeRemetente}
          onChange={handleChange}
          placeholder="nome do remetente"
        />

        <FormField
          label="E-mail de resposta"
          name="emailResposta"
          type="email"
          value={form.emailResposta}
          onChange={handleChange}
          placeholder="user@email.com"
        />

        <div className="md:col-span-2">
          <FormField
            label="Seu E-mail para receber avisos"
            name="emailFotografaAvisos"
            type="email"
            value={form.emailFotografaAvisos}
            onChange={handleChange}
            placeholder="user@email.com"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <ToggleField
          label="Album publicado"
          description="Envia link, senha e validade para a cliente."
          checked={form.enviarAlbumPublicado}
          onChange={(value) => handleToggle('enviarAlbumPublicado', value)}
        />

        <ToggleField
          label="Selecao recebida"
          description="Avisa a fotografa quando a cliente enviar a selecao."
          checked={form.avisarSelecaoRecebida}
          onChange={(value) => handleToggle('avisarSelecaoRecebida', value)}
        />

        <ToggleField
          label="Mudanca de status"
          description="Envia um aviso simples para a cliente ao alterar status."
          checked={form.enviarMudancaStatus}
          onChange={(value) => handleToggle('enviarMudancaStatus', value)}
        />
      </div>

      <TextareaField
        label="Mensagem para a cliente quando o album publicado"
        name="mensagemAlbumPublicado"
        value={form.mensagemAlbumPublicado}
        onChange={handleChange}
        rows={4}
      />

      <TextareaField
        label="Mensagem da selecao recebida"
        name="mensagemSelecaoRecebida"
        value={form.mensagemSelecaoRecebida}
        onChange={handleChange}
        rows={4}
      />

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={16} />
        {loading ? 'Salvando...' : 'Salvar configuracoes de e-mail'}
      </button>

      <InfoBox
        title="Sobre o envio de e-mails"
        description="Os avisos serão enviados apenas quando o envio automático estiver ativado e os dados de e-mail do sistema estiverem configurados corretamente."
        items={[
          'Publicar album envia link e senha para a cliente.',
          'Selecao recebida envia um aviso para o e-mail da fotografa.',
          'Falhas de e-mail nao bloqueiam publicacao, selecao ou mudanca de status.',
          'Lembrete automatico do ensaio exige agendador e deve entrar em uma proxima etapa.',
        ]}
      />
    </form>
  )
}
