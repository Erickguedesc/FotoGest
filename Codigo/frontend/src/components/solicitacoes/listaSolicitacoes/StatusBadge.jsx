import { STATUS_LABEL } from './solicitacaoHelpers'

export default function StatusBadge({ status }) {
  const isDone = status === 'ATENDIDO'

  return (
    <span
      className={`inline-flex min-w-[130px] items-center justify-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.05em] ${
        isDone
          ? 'border-[#34D399]/30 bg-[#34D399]/10 text-[#34D399]'
          : 'border-[rgba(226,185,99,0.30)] bg-[rgba(226,185,99,0.12)] text-[var(--gold)]'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isDone ? 'bg-[#34D399]' : 'bg-[var(--gold)]'}`} />
      {STATUS_LABEL[status] || status}
    </span>
  )
}
