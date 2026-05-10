import { STATUS_LABEL } from './solicitacaoHelpers'

export default function StatusBadge({ status }) {
  const isDone = status === 'ATENDIDO'

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] whitespace-nowrap ${
        isDone
          ? 'border-[#34D399]/30 bg-[#34D399]/10 text-[#34D399]'
          : 'border-[rgba(226,185,99,0.30)] bg-[rgba(226,185,99,0.12)] text-[var(--gold)]'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isDone ? 'bg-[#34D399]' : 'bg-[var(--gold)]'
        }`}
      />
      {STATUS_LABEL[status] || status}
    </span>
  )
}