import { getStatusInfo } from './ensaioHelpers'

export default function StatusBadge({ status }) {
  const info = getStatusInfo(status)
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] tracking-[0.05em] ${info.chipClass}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {info.label}
    </span>
  )
}
