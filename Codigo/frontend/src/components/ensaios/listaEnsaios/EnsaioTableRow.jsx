import EnsaioActions from './EnsaioActions'
import ProgressBar from './ProgressBar'
import StatusBadge from './StatusBadge'
import { formatCurrency, formatDate, getInitials, getTipoLabel } from './ensaioHelpers'

export default function EnsaioTableRow({ ensaio, onView, onEdit, onStatus, onDelete, onPreContrato }) {
  return (
    <tr className="border-b border-white/[0.06] transition hover:bg-white/[0.025]">
      <td className="px-4 py-4">
        <button type="button" onClick={() => onView(ensaio)} className="flex items-center gap-3 text-left">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.10] bg-[#222] text-[11px] text-white/45">
            {getInitials(ensaio.clienteNome)}
          </span>
          <span>
            <span className="block text-[13.5px] text-white">{ensaio.clienteNome || 'Cliente sem nome'}</span>
            <span className="block text-[11px] text-white/30">Clique para abrir detalhes</span>
          </span>
        </button>
      </td>
      <td className="px-4 py-4 text-[13px] text-white/65">{getTipoLabel(ensaio.tipo)}</td>
      <td className="px-4 py-4 text-[13px] text-white/65">{formatDate(ensaio.dataEnsaio)}</td>
      <td className="max-w-[190px] truncate px-4 py-4 text-[13px] text-white/65" title={ensaio.local}>{ensaio.local || '—'}</td>
      <td className="px-4 py-4"><StatusBadge status={ensaio.status} /></td>
      <td className="px-4 py-4"><ProgressBar value={ensaio.progresso} compact /></td>
      <td className="px-4 py-4 text-[13px] text-white">{formatCurrency(ensaio.valorPacote)}</td>
      <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
        <EnsaioActions ensaio={ensaio} onView={onView} onEdit={onEdit} onStatus={onStatus} onDelete={onDelete} onPreContrato={onPreContrato} />
      </td>
    </tr>
  )
}
