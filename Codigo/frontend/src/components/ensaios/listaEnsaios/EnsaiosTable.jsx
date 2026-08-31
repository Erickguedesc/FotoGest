import { CalendarDays, Clock3, Images, MapPin } from 'lucide-react'

import EnsaioActions from './EnsaioActions'
import ProgressBar from './ProgressBar'
import StatusBadge from './StatusBadge'
import {
  formatCurrency,
  formatDate,
  getInitials,
  getTipoExibicao,
} from './ensaioHelpers'

const formatTime = (value) => {
  if (!value) return '--:--'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--:--'

  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function EnsaiosTable({
  ensaios,
  onView,
  onEdit,
  onStatus,
  onDelete,
  onPreContrato,
}) {
  return (
    <section>
      <div className="space-y-3">
        {ensaios.map((ensaio) => (
          <EnsaioListCard
            key={ensaio.id}
            ensaio={ensaio}
            onView={onView}
            onEdit={onEdit}
            onStatus={onStatus}
            onDelete={onDelete}
            onPreContrato={onPreContrato}
          />
        ))}
      </div>
    </section>
  )
}

function EnsaioListCard({
  ensaio,
  onView,
  onEdit,
  onStatus,
  onDelete,
  onPreContrato,
}) {
  const totalFotos = Number(ensaio.totalFotos ?? 0)
  const valorExibido = ensaio.valorFinalEnsaio ?? ensaio.valorPacote
  const hasImage = Boolean(ensaio.capaUrl)

  const handleOpen = () => {
    onView(ensaio)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpen()
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      className="group grid cursor-pointer overflow-hidden rounded-[8px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] outline-none shadow-[0_14px_34px_rgba(92,82,72,0.08)] transition hover:-translate-y-0.5 hover:border-[var(--gold-border)] hover:bg-white focus-visible:border-[var(--gold-border)] focus-visible:ring-2 focus-visible:ring-[var(--gold)]/20 max-lg:grid-cols-1 lg:h-[128px] lg:grid-cols-[172px_minmax(0,1fr)_240px]"
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          handleOpen()
        }}
        className="relative h-full min-h-0 overflow-hidden bg-[#eee8df] text-left max-lg:h-[180px] max-sm:h-[148px]"
      >
        {hasImage ? (
          <img
            src={ensaio.capaUrl}
            alt={ensaio.clienteNome || 'Capa do ensaio'}
           className="block h-full max-h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#f5f0e8,#e8ded1)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-white/45 font-serif text-lg text-[var(--text-muted)]">
              {getInitials(ensaio.clienteNome)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-white/4 via-transparent to-black/10" />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          handleOpen()
        }}
        className="flex min-h-0 min-w-0 flex-col justify-center overflow-hidden px-6 py-3 text-left max-md:px-4"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <h3 className="max-w-full truncate text-[17px] font-medium text-[var(--text)]">
            {ensaio.clienteNome || 'Cliente sem nome'}
          </h3>

          <StatusBadge status={ensaio.status} />

          <span className="rounded-full border border-[var(--border)] bg-[#f3eee7] px-2.5 py-1 text-[10px] uppercase tracking-normal text-[var(--text-muted)]">
            {getTipoExibicao(ensaio)}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-[var(--text)]">
          <Meta icon={<CalendarDays size={15} />} value={formatDate(ensaio.dataEnsaio)} />
          <Meta icon={<Clock3 size={15} />} value={formatTime(ensaio.dataEnsaio)} />
          <Meta icon={<MapPin size={15} />} value={ensaio.local || 'Local não informado'} />
          <Meta
            icon={<Images size={15} />}
            value={totalFotos > 0 ? `${totalFotos} foto${totalFotos === 1 ? '' : 's'}` : 'Sem fotos'}
          />
        </div>

        <div className="grid items-end gap-4 md:grid-cols-[minmax(180px,1fr)_auto]">
          <div>
            <ProgressBar ensaio={ensaio} compact={false} />
          </div>

          <div className="font-serif text-[21px] text-[var(--gold)]">
            {formatCurrency(valorExibido)}
          </div>
        </div>
      </button>

      <div
        className="flex items-center justify-center border-l border-[var(--border)] bg-[rgba(250,248,244,0.58)] px-4 py-2.5 max-lg:border-l-0 max-lg:border-t"
        onClick={(event) => event.stopPropagation()}
      >
        <EnsaioActions
          ensaio={ensaio}
          onView={onView}
          onEdit={onEdit}
          onStatus={onStatus}
          onDelete={onDelete}
          onPreContrato={onPreContrato}
          showView={false}
        />
      </div>
    </article>
  )
}

function Meta({ icon, value }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <span className="shrink-0 text-[var(--gold)]">{icon}</span>
      <span className="truncate">{value}</span>
    </span>
  )
}
