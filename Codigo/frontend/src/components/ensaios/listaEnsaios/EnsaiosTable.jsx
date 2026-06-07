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

const sortOptions = [
  { key: 'dataEnsaio', label: 'Data' },
  { key: 'clienteNome', label: 'Cliente' },
  { key: 'status', label: 'Status' },
  { key: 'valorPacote', label: 'Valor' },
]

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
  sort,
  onSort,
  onView,
  onEdit,
  onStatus,
  onDelete,
  onPreContrato,
}) {
  return (
    <section className="space-y-3">
      <div className="theme-card flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3">
        <p className="theme-muted text-[11px] uppercase tracking-[0.16em]">
          Lista de ensaios
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="theme-muted text-[11px]">Ordenar por</span>

          {sortOptions.map((option) => {
            const active = sort.key === option.key

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onSort(option.key)}
                className={`rounded-lg border px-3 py-1.5 text-[11px] transition ${
                  active
                    ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold-border)] hover:text-[var(--text)]'
                }`}
              >
                {option.label}
                {active ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ''}
              </button>
            )
          })}
        </div>
      </div>

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
  const isCapaPadrao = hasImage && totalFotos === 0

  return (
    <article className="theme-card group grid overflow-hidden rounded-xl border transition hover:-translate-y-0.5 hover:border-[var(--gold-border)] max-lg:grid-cols-1 lg:h-[128px] lg:grid-cols-[170px_minmax(0,1fr)_176px]">
      <button
        type="button"
        onClick={() => onView(ensaio)}
        className="theme-panel relative h-full min-h-0 overflow-hidden text-left max-lg:h-[180px] max-sm:h-[148px]"
      >
        {hasImage ? (
          <img
            src={ensaio.capaUrl}
            alt={ensaio.clienteNome || 'Capa do ensaio'}
            className={`h-full w-full transition duration-500 group-hover:scale-[1.03] ${
              isCapaPadrao ? 'object-contain p-5 opacity-85' : 'object-cover'
            }`}
          />
        ) : (
          <div className="theme-panel flex h-full items-center justify-center">
            <span className="theme-soft flex h-14 w-14 items-center justify-center rounded-full border font-serif text-lg text-[var(--text-muted)]">
              {getInitials(ensaio.clienteNome)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/35" />
      </button>

      <button
        type="button"
        onClick={() => onView(ensaio)}
        className="flex min-w-0 flex-col justify-center overflow-hidden px-5 py-3 text-left max-md:px-4"
      >
        <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
          <h3 className="theme-title max-w-full truncate text-[16px] font-medium">
            {ensaio.clienteNome || 'Cliente sem nome'}
          </h3>

          <StatusBadge status={ensaio.status} />

          <span className="theme-soft rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {getTipoExibicao(ensaio)}
          </span>
        </div>

        <div className="theme-text mb-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px]">
          <Meta icon={<CalendarDays size={15} />} value={formatDate(ensaio.dataEnsaio)} />
          <Meta icon={<Clock3 size={15} />} value={formatTime(ensaio.dataEnsaio)} />
          <Meta icon={<MapPin size={15} />} value={ensaio.local || 'Local nao informado'} />
          <Meta
            icon={<Images size={15} />}
            value={totalFotos > 0 ? `${totalFotos} foto${totalFotos === 1 ? '' : 's'}` : 'Sem fotos'}
          />
        </div>

        <div className="grid items-end gap-4 md:grid-cols-[minmax(180px,1fr)_auto]">
          <div>
            <ProgressBar value={ensaio.progresso} compact={false} />
          </div>

          <div className="font-serif text-[20px] text-[var(--gold)]">
            {formatCurrency(valorExibido)}
          </div>
        </div>
      </button>

      <div
        className="theme-divider flex items-center justify-center border-l px-3 py-2.5 max-lg:border-l-0 max-lg:border-t"
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
      <span className="shrink-0 text-[var(--gold)]/80">{icon}</span>
      <span className="truncate">{value}</span>
    </span>
  )
}
