import { STATUS_NEXT } from './solicitacaoHelpers'

export default function SolicitacaoActions({ solicitacao, onWhatsApp, onStatusChange, onPreContrato, loading }) {
  const nextStatus = STATUS_NEXT[solicitacao.statusLead] || 'ATENDIDO'
  const buttonLabel = nextStatus === 'ATENDIDO' ? 'Mudar p/ Atendido' : 'Mudar p/ Solicitação'

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onWhatsApp(solicitacao.whatsapp)}
        className="rounded-lg border border-white/10 bg-transparent px-4 py-2 text-xs font-medium text-white/60 transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]"
      >
        WhatsApp
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() => onStatusChange(solicitacao, nextStatus)}
        className="rounded-lg border border-white/10 bg-transparent px-4 py-2 text-xs font-medium text-white/60 transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-45"
      >
        {loading ? 'Salvando...' : buttonLabel}
      </button>

      <button
        type="button"
        onClick={() => onPreContrato(solicitacao)}
        className="rounded-lg border border-[var(--gold)] bg-[var(--gold)] px-4 py-2 text-xs font-semibold text-[#1A1200] transition hover:-translate-y-0.5 hover:bg-[#FCE8B0]"
      >
        Gerar Pré-Contrato
      </button>
    </div>
  )
}
