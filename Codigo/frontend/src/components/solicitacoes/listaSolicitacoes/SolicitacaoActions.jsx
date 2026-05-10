import { STATUS_NEXT } from './solicitacaoHelpers'

export default function SolicitacaoActions({
  solicitacao,
  onWhatsApp,
  onStatusChange,
  //onPreContrato,
  onDelete,
  loading
}) {
  const nextStatus = STATUS_NEXT[solicitacao.statusLead] || 'ATENDIDO'
  const canDelete = solicitacao.statusLead === 'ATENDIDO'

  const buttonLabel =
    nextStatus === 'ATENDIDO'
      ? 'Mudar p/ Atendido'
      : 'Mudar p/ Solicitação'

  return (
    <div className="flex items-center gap-3 whitespace-nowrap">
      <button
        type="button"
        onClick={() => onWhatsApp(solicitacao.whatsapp)}
        className="rounded-lg border border-white/10 bg-transparent px-5 py-2 text-xs font-medium text-white/60 transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]"
      >
        WhatsApp
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() => onStatusChange(solicitacao, nextStatus)}
        className="rounded-lg border border-white/10 bg-transparent px-5 py-2 text-xs font-medium text-white/60 transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-45"
      >
        {loading ? 'Salvando...' : buttonLabel}
      </button>

{/* 
<button
  type="button"
  onClick={() => onPreContrato(solicitacao)}
  className="rounded-lg border border-[var(--gold)] bg-[var(--gold)] px-5 py-2 text-xs font-semibold text-[#1A1200] transition hover:-translate-y-0.5 hover:bg-[#FCE8B0]"
>
  Gerar Pré-Contrato
</button>
*/}

{canDelete && (
  <button
    type="button"
    disabled={loading}
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      onDelete(solicitacao.id)
    }}
    className="rounded-lg border border-red-500/20 bg-red-500/10 px-5 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-40"
  >
    Apagar
  </button>
)}
    </div>
  )
}