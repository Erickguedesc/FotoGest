import { getStatusInfo } from './ensaioHelpers'
import {
  CalendarDays,
  Camera,
  Image as ImageIcon,
  PackageCheck,
  PencilLine,
  XCircle,
} from 'lucide-react'

const STATUS_ICONS = {
  AGENDADO: CalendarDays,
  REALIZADO: Camera,
  EM_SELECAO: ImageIcon,
  EM_EDICAO: PencilLine,
  FINALIZADO: PackageCheck,
  CANCELADO: XCircle,
}

export default function StatusBadge({ status }) {
  const info = getStatusInfo(status)
  const StatusIcon = STATUS_ICONS[status] || CalendarDays

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
      <StatusIcon size={13} strokeWidth={1.9} className="shrink-0" />
      {info.label}
    </span>
  )
}
