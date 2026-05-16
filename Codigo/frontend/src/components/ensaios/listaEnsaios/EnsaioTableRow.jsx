import EnsaioActions from './EnsaioActions'
import ProgressBar from './ProgressBar'
import StatusBadge from './StatusBadge'
import {
  formatCurrency,
  formatDate,
  getInitials,
  getTipoLabel,
} from './ensaioHelpers'

export default function EnsaioTableRow({
  ensaio,
  onView,
  onEdit,
  onStatus,
  onDelete,
  onPreContrato,
}) {
  return (
    <tr className="border-b border-white/[0.06] transition hover:bg-white/[0.025]">
      <td className="w-[220px] px-4 py-4">
        <button
          type="button"
          onClick={() => onView(ensaio)}
          className="flex w-full items-center gap-3 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.10] bg-[#222] text-[11px] text-white/45">
            {getInitials(ensaio.clienteNome)}
          </span>

          <span className="min-w-0 flex-1">
            <span
              title={ensaio.clienteNome || 'Cliente sem nome'}
              className="block max-w-[145px] truncate text-[13.5px] font-medium text-white"
            >
              {ensaio.clienteNome || 'Cliente sem nome'}
            </span>

            <span className="mt-0.5 block text-[11px] text-white/30">
              Clique para abrir detalhes
            </span>
          </span>
        </button>
      </td>

      <td className="w-[100px] px-4 py-4 text-[13px] text-white/65">
        {getTipoLabel(ensaio.tipo)}
      </td>

      <td className="w-[110px] px-4 py-4 text-[13px] text-white/65">
        {formatDate(ensaio.dataEnsaio)}
      </td>

      <td
        className="w-[140px] px-4 py-4 text-[13px] text-white/65"
        title={ensaio.local}
      >
        <span className="block max-w-[105px] truncate">
          {ensaio.local || '—'}
        </span>
      </td>

      <td className="w-[135px] px-4 py-4">
        <StatusBadge status={ensaio.status} />
      </td>

      <td className="w-[130px] px-4 py-4">
        <ProgressBar value={ensaio.progresso} compact />
      </td>

      <td className="w-[110px] px-4 py-4 text-[13px] text-white">
        {formatCurrency(ensaio.valorPacote)}
      </td>

      <td
        className="w-[210px] px-4 py-4"
        onClick={(event) => event.stopPropagation()}
      >
        <EnsaioActions
          ensaio={ensaio}
          onView={onView}
          onEdit={onEdit}
          onStatus={onStatus}
          onDelete={onDelete}
          onPreContrato={onPreContrato}
        />
      </td>
    </tr>
  )
}