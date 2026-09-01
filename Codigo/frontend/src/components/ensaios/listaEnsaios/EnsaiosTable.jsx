import EnsaioActions from './EnsaioActions'
import ProgressBar from './ProgressBar'
import {
  formatCurrency,
  formatDate,
  getInitials,
  getStatusInfo,
  getTipoExibicao,
} from './ensaioHelpers'

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })

const formatTime = (value) => {
  if (!value) return '--:--'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--:--'

  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatWeekday = (value) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return WEEKDAY_FORMATTER.format(date).replace('.', '').toLowerCase()
}

const formatPhotos = (value) => {
  const total = Number(value ?? 0)

  if (!total) return 'Sem fotos'

  return `${total.toLocaleString('pt-BR')} foto${total === 1 ? '' : 's'}`
}

const getCapaUrl = (ensaio) =>
  ensaio?.capaUrl ||
  ensaio?.fotoCapaUrl ||
  ensaio?.capa?.urlWatermark ||
  ensaio?.capa?.urlOriginal ||
  ''

export default function EnsaiosTable({
  ensaios,
  onView,
  onEdit,
  onStatus,
  onDelete,
  onPreContrato,
}) {
  return (
    <section className="overflow-hidden rounded-[8px] border border-[var(--border)] bg-white shadow-[0_14px_34px_rgba(31,31,33,0.045)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[#FBFAF9]">
              <TableHead className="w-[230px]">Cliente</TableHead>
              <TableHead className="w-[120px]">Tipo</TableHead>
              <TableHead className="w-[116px]">Data</TableHead>
              <TableHead className="w-[86px]">Horário</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
              <TableHead className="w-[104px]">Fotos</TableHead>
              <TableHead className="w-[112px]">Valor</TableHead>
              <TableHead className="w-[150px]">Progresso</TableHead>
              <TableHead className="w-[160px] text-right">Ações</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {ensaios.map((ensaio) => (
              <EnsaioTableLine
                key={ensaio.id}
                ensaio={ensaio}
                onView={onView}
                onEdit={onEdit}
                onStatus={onStatus}
                onDelete={onDelete}
                onPreContrato={onPreContrato}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function EnsaioTableLine({
  ensaio,
  onView,
  onEdit,
  onStatus,
  onDelete,
  onPreContrato,
}) {
  const totalFotos = Number(ensaio.totalFotos ?? 0)
  const valorExibido = ensaio.valorFinalEnsaio ?? ensaio.valorPacote
  const capaUrl = totalFotos > 0 ? getCapaUrl(ensaio) : ''
  const tipo = getTipoExibicao(ensaio)
  const weekday = formatWeekday(ensaio.dataEnsaio)

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
    <tr
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      className="cursor-pointer outline-none transition hover:bg-[#F8F5F2] focus-visible:bg-[#F8F5F2]"
    >
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[var(--border)] bg-[#F5F1EE] text-[11px] font-semibold text-[var(--gold)]">
            {capaUrl ? (
              <img
                src={capaUrl}
                alt={ensaio.clienteNome || 'Capa do ensaio'}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(ensaio.clienteNome)
            )}
          </span>

          <span className="min-w-0">
            <span
              title={ensaio.clienteNome || 'Cliente sem nome'}
              className="block max-w-[170px] truncate text-[13px] font-semibold text-[var(--text)]"
            >
              {ensaio.clienteNome || 'Cliente sem nome'}
            </span>
          </span>
        </div>
      </td>

      <td className="px-4 py-3">
        <span title={tipo} className="block max-w-[104px] truncate text-[12px] text-[var(--text)]">
          {tipo}
        </span>
      </td>

      <td className="px-4 py-3 text-[12px] text-[var(--text)]">
        <span className="block whitespace-nowrap">{formatDate(ensaio.dataEnsaio)}</span>
        {weekday && (
          <span className="mt-0.5 block text-[10px] text-[var(--text-muted)]">
            {weekday}.
          </span>
        )}
      </td>

      <td className="px-4 py-3 text-[12px] text-[var(--text)]">
        {formatTime(ensaio.dataEnsaio)}
      </td>

      <td className="px-4 py-3">
        <TableStatusBadge status={ensaio.status} />
      </td>

      <td className="px-4 py-3 text-[12px] text-[var(--text)]">
        <span className="whitespace-nowrap">{formatPhotos(ensaio.totalFotos)}</span>
      </td>

      <td className="px-4 py-3 text-[12px] font-medium text-[var(--text)]">
        <span className="whitespace-nowrap">{formatCurrency(valorExibido)}</span>
      </td>

      <td className="px-4 py-3">
        <ProgressBar ensaio={ensaio} compact />
      </td>

      <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
        <div className="flex justify-end">
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
      </td>
    </tr>
  )
}

function TableHead({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-normal text-[var(--text-muted)] ${className}`}>
      {children}
    </th>
  )
}

function TableStatusBadge({ status }) {
  const info = getStatusInfo(status)

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium leading-none ${info.chipClass}`}>
      {info.label}
    </span>
  )
}
