import { getStatusInfo } from './ensaioHelpers'

export default function StatusBadge({ status }) {
  const info = getStatusInfo(status)

  return (
    <span
      className={`
        inline-flex items-center gap-2
        whitespace-nowrap
        rounded-full border
        px-4 py-2
        text-[11px] font-medium
        leading-none
        ${info.chipClass}
      `}
    >
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current opacity-80" />
      {info.label}
    </span>
  )
}