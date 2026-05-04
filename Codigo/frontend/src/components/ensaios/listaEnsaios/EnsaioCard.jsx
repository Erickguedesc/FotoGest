import EnsaioActions from './EnsaioActions'
import Icon from './Icon'
import ProgressBar from './ProgressBar'
import StatusBadge from './StatusBadge'
import { formatCurrency, formatDate, getInitials, getTipoLabel } from './ensaioHelpers'

export default function EnsaioCard({ ensaio, onView, onEdit, onStatus, onDelete }) {
  return (
    <article className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#141414] transition hover:-translate-y-0.5 hover:border-[var(--gold-border)]">
      <button type="button" onClick={() => onView(ensaio)} className="block w-full p-4 text-left">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.10] bg-[#222] text-[12px] text-white/45">
              {getInitials(ensaio.clienteNome)}
            </span>
            <div>
              <h3 className="text-[15px] text-white">{ensaio.clienteNome || 'Cliente sem nome'}</h3>
              <p className="text-[11.5px] text-white/35">{getTipoLabel(ensaio.tipo)}</p>
            </div>
          </div>
          <StatusBadge status={ensaio.status} />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 text-[12px] text-white/45">
          <span className="flex items-center gap-1.5"><Icon name="calendar" size={12} />{formatDate(ensaio.dataEnsaio)}</span>
          <span className="flex items-center gap-1.5 truncate"><Icon name="location" size={12} />{ensaio.local || '—'}</span>
          <span className="col-span-2 text-[var(--gold)]">{formatCurrency(ensaio.valorPacote)}</span>
        </div>

        <ProgressBar value={ensaio.progresso} />
      </button>
      <div className="border-t border-white/[0.06] px-4 py-3">
        <EnsaioActions ensaio={ensaio} onView={onView} onEdit={onEdit} onStatus={onStatus} onDelete={onDelete} />
      </div>
    </article>
  )
}
