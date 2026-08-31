import EnsaioActions from './EnsaioActions'
import Icon from './Icon'
import ProgressBar from './ProgressBar'
import { formatCurrency, getInitials, getStatusInfo, getTipoExibicao } from './ensaioHelpers'

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
const MONTH_FORMATTER = new Intl.DateTimeFormat('pt-BR', { month: 'short' })
const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

function getDateParts(value) {
  if (!value) {
    return {
      day: '--',
      month: '---',
      weekday: '---',
      time: '--:--',
    }
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return {
      day: '--',
      month: '---',
      weekday: '---',
      time: '--:--',
    }
  }

  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: MONTH_FORMATTER.format(date).replace('.', '').toUpperCase(),
    weekday: WEEKDAY_FORMATTER.format(date).replace('.', '').toUpperCase(),
    time: TIME_FORMATTER.format(date),
  }
}

export default function EnsaioCard({ ensaio, onView, onEdit, onStatus, onDelete, onPreContrato }) {
  const dateParts = getDateParts(ensaio.dataEnsaio)
  const totalFotos = Number(ensaio.totalFotos ?? 0)
  const valorExibido = ensaio.valorFinalEnsaio ?? ensaio.valorPacote
  const capaUrl = ensaio.capaUrl || ensaio.fotoCapaUrl || ensaio.capa?.urlWatermark || ensaio.capa?.urlOriginal
  const statusInfo = getStatusInfo(ensaio.status)

  return (
    <article className="group overflow-hidden rounded-[8px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] shadow-[0_14px_34px_rgba(92,82,72,0.08)] transition hover:-translate-y-0.5 hover:border-[var(--gold-border)] hover:bg-white">
      <button
        type="button"
        onClick={() => onView(ensaio)}
        className="relative block h-[188px] w-full overflow-hidden bg-[#eee8df] text-left"
        aria-label={`Abrir ensaio de ${ensaio.clienteNome || 'cliente sem nome'}`}
      >
        {capaUrl ? (
          <img
            src={capaUrl}
            alt={ensaio.clienteNome || 'Capa do ensaio'}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#f5f0e8,#e8ded1)]">
            <span className="flex h-[86px] w-[86px] items-center justify-center rounded-full border border-[var(--border)] bg-white/45 font-serif text-[25px] text-[var(--text-muted)]">
              {getInitials(ensaio.clienteNome)}
            </span>
          </div>
        )}

        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.04)_48%,rgba(0,0,0,0.44)_100%)]" />

        <span className="absolute left-4 top-4 flex h-[70px] w-[54px] flex-col items-center justify-center rounded-[8px] border border-white/[0.16] bg-[#2c241d]/82 text-center shadow-[0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur">
          <span className="font-serif text-[25px] leading-none text-[var(--gold)]">{dateParts.day}</span>
          <span className="mt-1 text-[9px] font-bold uppercase leading-none tracking-normal text-white/72">{dateParts.month}</span>
          <span className="mt-1 text-[9px] font-bold uppercase leading-none tracking-normal text-white/48">{dateParts.weekday}</span>
        </span>

        <span className="absolute bottom-4 right-4 rounded-full border border-white/[0.12] bg-black/42 px-3 py-1 text-[11px] text-white/72 backdrop-blur">
          {totalFotos > 0 ? `${totalFotos} foto${totalFotos === 1 ? '' : 's'}` : 'Sem fotos'}
        </span>
      </button>

      <div className="p-4">
        <button type="button" onClick={() => onView(ensaio)} className="block w-full text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-serif text-[22px] leading-tight text-[var(--text)]">
                {ensaio.clienteNome || 'Cliente sem nome'}
              </h3>
              <span className="mt-2 inline-flex max-w-full rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-normal text-[var(--gold)]">
                <span className="truncate">{getTipoExibicao(ensaio)}</span>
              </span>
            </div>

            <span className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-[11px] font-medium leading-none ${statusInfo.chipClass}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="mt-4 grid gap-2 text-[12px] text-[var(--text)]">
            <span className="flex items-center gap-2">
              <Icon name="calendar" size={13} />
              {dateParts.time}
            </span>
            <span className="flex min-w-0 items-center gap-2">
              <Icon name="location" size={13} />
              <span className="truncate">{ensaio.local || 'Local não informado'}</span>
            </span>
          </div>

          <div className="mt-4 grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <ProgressBar ensaio={ensaio} />
            <span className="font-serif text-[20px] leading-none text-[var(--gold)]">
              {formatCurrency(valorExibido)}
            </span>
          </div>
        </button>

        <div className="mt-4 flex justify-end border-t border-[var(--border)] pt-3" onClick={(event) => event.stopPropagation()}>
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
      </div>
    </article>
  )
}
