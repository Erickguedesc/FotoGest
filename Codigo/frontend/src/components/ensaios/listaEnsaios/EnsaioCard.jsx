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
    <article className="group overflow-hidden rounded-[8px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] shadow-[0_10px_26px_rgba(31,31,33,0.045)] transition hover:-translate-y-0.5 hover:border-[var(--gold-border)] hover:bg-white">
      <button
        type="button"
        onClick={() => onView(ensaio)}
        className="relative block h-[142px] w-full overflow-hidden bg-[#eee8df] text-left"
        aria-label={`Abrir ensaio de ${ensaio.clienteNome || 'cliente sem nome'}`}
      >
        {capaUrl ? (
          <img
            src={capaUrl}
            alt={ensaio.clienteNome || 'Capa do ensaio'}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#FCFCFD,#EEEAE7)]">
            <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-[var(--border)] bg-white/45 font-serif text-[21px] text-[var(--text-muted)]">
              {getInitials(ensaio.clienteNome)}
            </span>
          </div>
        )}

        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.04)_48%,rgba(0,0,0,0.44)_100%)]" />

        <span className="absolute left-3 top-3 flex h-[58px] w-[46px] flex-col items-center justify-center rounded-[8px] border border-white/[0.16] bg-[#2c241d]/82 text-center shadow-[0_8px_18px_rgba(0,0,0,0.16)] backdrop-blur">
          <span className="font-serif text-[21px] leading-none text-[var(--gold)]">{dateParts.day}</span>
          <span className="mt-0.5 text-[8px] font-bold uppercase leading-none tracking-normal text-white/72">{dateParts.month}</span>
          <span className="mt-0.5 text-[8px] font-bold uppercase leading-none tracking-normal text-white/48">{dateParts.weekday}</span>
        </span>

        <span className="absolute bottom-3 right-3 rounded-full border border-white/[0.12] bg-black/42 px-2.5 py-1 text-[10px] text-white/72 backdrop-blur">
          {totalFotos > 0 ? `${totalFotos} foto${totalFotos === 1 ? '' : 's'}` : 'Sem fotos'}
        </span>
      </button>

      <div className="p-3">
        <button type="button" onClick={() => onView(ensaio)} className="block w-full text-left">
          <div className="space-y-2">
            <h3 className="truncate font-serif text-[19px] leading-tight text-[var(--text)]">
              {ensaio.clienteNome || 'Cliente sem nome'}
            </h3>

            <div className="flex min-h-[25px] items-center justify-between gap-2">
              <span className="inline-flex min-w-0 max-w-[58%] rounded-full border border-[var(--border)] bg-white/64 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-normal text-[var(--text-muted)]">
                <span className="truncate">{getTipoExibicao(ensaio)}</span>
              </span>

              <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1.5 text-[10px] font-semibold leading-none ${statusInfo.chipClass}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          <div className="mt-3 grid gap-1.5 text-[11px] text-[var(--text)]">
            <span className="flex items-center gap-2">
              <Icon name="calendar" size={12} />
              {dateParts.time}
            </span>
            <span className="flex min-w-0 items-center gap-2">
              <Icon name="location" size={12} />
              <span className="truncate">{ensaio.local || 'Local não informado'}</span>
            </span>
          </div>

          <div className="mt-3 grid items-end gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <ProgressBar ensaio={ensaio} />
            <span className="font-serif text-[17px] leading-none text-[var(--gold)]">
              {formatCurrency(valorExibido)}
            </span>
          </div>
        </button>

        <div className="mt-3 flex justify-end border-t border-[var(--border)] pt-2.5" onClick={(event) => event.stopPropagation()}>
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
