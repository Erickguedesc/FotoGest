import { AlertCircle, CheckCircle2, Mail, Save, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormField, TextareaField } from './FormField'
import InfoBox from './InfoBox'
import ConfirmActionModal from '../ui/ConfirmActionModal'

const emptyForm = {
  ativo: false,
  nomeRemetente: '',
  emailFotografaAvisos: '',
  enviarAlbumPublicado: true,
  avisarSelecaoRecebida: true,
  enviarConfirmacaoSelecaoCliente: true,
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

export default function EmailConfigForm({
  data,
  loading,
  testLoading = false,
  onSubmit,
  onTest,
}) {
  const [form, setForm] = useState(emptyForm)
  const [confirmAction, setConfirmAction] = useState(null)

  useEffect(() => {
    setForm({
      ativo: Boolean(data?.ativo),
      nomeRemetente: data?.nomeRemetente || '',
      emailFotografaAvisos: data?.emailFotografaAvisos || '',
      enviarAlbumPublicado: data?.enviarAlbumPublicado !== false,
      avisarSelecaoRecebida: data?.avisarSelecaoRecebida !== false,
      enviarConfirmacaoSelecaoCliente:
        data?.enviarConfirmacaoSelecaoCliente !== false,
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
    setConfirmAction({
      type: 'gold',
      title: 'Salvar configurações de e-mail?',
      description:
        'As próximas comunicações automáticas passarão a usar estas configurações.',
      confirmText: 'Salvar',
      action: 'save',
      payload: { ...form },
    })
  }

  function handleRequestTest() {
    setConfirmAction({
      type: 'warning',
      title: 'Enviar e-mail de teste?',
      description:
        'O sistema enviara uma mensagem de teste para o e-mail configurado para receber avisos.',
      confirmText: 'Enviar teste',
      action: 'test',
    })
  }

  function handleCloseConfirm() {
    if (loading || testLoading) return
    setConfirmAction(null)
  }

  function handleConfirmAction() {
    if (!confirmAction) return

    if (confirmAction.action === 'save') {
      onSubmit(confirmAction.payload)
      setConfirmAction(null)
      return
    }

    if (confirmAction.action === 'test') {
      onTest()
      setConfirmAction(null)
    }
  }

  const smtpConfigurado = Boolean(data?.smtpConfigurado)
  const envioDisponivel = Boolean(form.ativo && smtpConfigurado)
  const motivoIndisponivel =
    form.ativo
      ? data?.motivoIndisponivel ||
        'Os avisos automaticos nao serao enviados ate a configuracao ser concluida.'
      : '(Envio automático desativado.)'

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
              Configure os avisos automaticos enviados durante o atendimento,
              como link do album, selecao recebida e mudanca de status.
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

      <div
        className={`rounded-2xl border p-4 ${
          envioDisponivel
            ? 'border-emerald-400/35 bg-emerald-500/10'
            : 'border-amber-400/35 bg-amber-500/10'
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`mt-0.5 ${
              envioDisponivel ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {envioDisponivel ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--text)]">
              {envioDisponivel
                ? 'E-mail pronto para envio'
                : 'Envio de e-mail desativado'}
            </p>
            <p className="theme-muted mt-1 text-sm leading-6">
              {envioDisponivel
                ? 'Os avisos automáticos já podem ser enviados pelo sistema.'
                : motivoIndisponivel}
            </p>
            {!smtpConfigurado && (
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                Entre em contato com o suporte responsavel pelo sistema.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Nome do remetente"
          name="nomeRemetente"
          value={form.nomeRemetente}
          onChange={handleChange}
          placeholder="nome do remetente"
        />

        <FormField
          label="Seu e-mail para receber avisos"
          name="emailFotografaAvisos"
          type="email"
          value={form.emailFotografaAvisos}
          onChange={handleChange}
          placeholder="user@email.com"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ToggleField
          label="Album publicado"
          description="Envia link, senha e validade para a cliente."
          checked={form.enviarAlbumPublicado}
          onChange={(value) => handleToggle('enviarAlbumPublicado', value)}
        />

        <ToggleField
          label="Selecao recebida"
          description="Avisa voce quando a cliente enviar a selecao."
          checked={form.avisarSelecaoRecebida}
          onChange={(value) => handleToggle('avisarSelecaoRecebida', value)}
        />

        <ToggleField
          label="Confirmacao para cliente"
          description="Envia e-mail com PDF depois que a cliente finaliza a selecao."
          checked={form.enviarConfirmacaoSelecaoCliente}
          onChange={(value) =>
            handleToggle('enviarConfirmacaoSelecaoCliente', value)
          }
        />

        <ToggleField
          label="Mudanca de status"
          description="Envia aviso ao agendar e ao alterar status."
          checked={form.enviarMudancaStatus}
          onChange={(value) => handleToggle('enviarMudancaStatus', value)}
        />
      </div>

      <TextareaField
        label="Mensagem para a cliente quando o album for publicado"
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

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} />
          {loading ? 'Salvando...' : 'Salvar configurações de e-mail'}
        </button>

        <button
          type="button"
          disabled={testLoading}
          onClick={handleRequestTest}
          className="theme-button inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
          {testLoading ? 'Enviando teste...' : 'Enviar e-mail de teste'}
        </button>
      </div>

      <InfoBox
        title="Sobre o envio de e-mails"
        description="Use esta area para confirmar quais avisos o sistema pode enviar automaticamente durante o atendimento."
        items={[
          'Publicar album envia link, senha e validade para a cliente.',
          'Confirmacao para cliente envia um e-mail com PDF do resumo da selecao.',
          'Mudanca de status tambem avisa a cliente quando um novo ensaio e cadastrado como agendado.',
          'O e-mail de teste confirma se os envios estao chegando antes de voce usar com clientes.',
          'Seu e-mail para receber avisos tambem recebe respostas das clientes aos e-mails do sistema.',
        ]}
      />

      <ConfirmActionModal
        open={Boolean(confirmAction)}
        type={confirmAction?.type}
        title={confirmAction?.title}
        description={confirmAction?.description}
        confirmText={confirmAction?.confirmText}
        loading={
          confirmAction?.action === 'save'
            ? loading
            : confirmAction?.action === 'test'
              ? testLoading
              : false
        }
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmAction}
      />
    </form>
  )
}
