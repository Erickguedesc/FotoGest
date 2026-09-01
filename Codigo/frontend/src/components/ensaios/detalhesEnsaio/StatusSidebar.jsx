import { STATUS_OPTIONS } from '../listaEnsaios/ensaioHelpers'

const STATUS_DOT_COLORS = {
  AGENDADO: 'bg-[var(--status-scheduled)]',
  REALIZADO: 'bg-[var(--status-completed)]',
  EM_SELECAO: 'bg-[var(--status-selection)]',
  EM_EDICAO: 'bg-[var(--status-editing)]',
  FINALIZADO: 'bg-[var(--status-delivered)]',
  CANCELADO: 'bg-[var(--status-cancelled)]',
}

const STATUS_TEXT_COLORS = {
  AGENDADO: 'text-[var(--status-scheduled)]',
  REALIZADO: 'text-[var(--status-completed)]',
  EM_SELECAO: 'text-[var(--status-selection)]',
  EM_EDICAO: 'text-[var(--status-editing)]',
  FINALIZADO: 'text-[var(--status-delivered)]',
  CANCELADO: 'text-[var(--status-cancelled)]',
}

const STATUS_ACTIVE_BG = {
  AGENDADO: 'bg-[rgba(113,103,232,0.10)] border-[rgba(113,103,232,0.22)]',
  REALIZADO: 'bg-[rgba(98,168,62,0.10)] border-[rgba(98,168,62,0.22)]',
  EM_SELECAO: 'bg-[rgba(242,154,46,0.12)] border-[rgba(242,154,46,0.24)]',
  EM_EDICAO: 'bg-[rgba(59,130,246,0.10)] border-[rgba(59,130,246,0.22)]',
  FINALIZADO: 'bg-[rgba(32,184,166,0.10)] border-[rgba(32,184,166,0.22)]',
  CANCELADO: 'bg-[rgba(239,83,80,0.10)] border-[rgba(239,83,80,0.24)]',
}

export default function StatusSidebar({ ensaio, loading, onStatusChange }) {
  return (
    <section
      id="status-sidebar"
      className="rounded-[14px] border border-[var(--border)] bg-white/78 shadow-[0_14px_34px_rgba(31,31,33,0.055)]"
    >
      <div className="flex items-center gap-3 px-4 pt-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-[7px] border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[10px] text-[var(--gold)]">
          ○
        </span>

        <h2 className="text-[13px] font-semibold text-[var(--text)]">
          Status atual
        </h2>
      </div>

      <div className="px-4 pb-3 pt-2.5">
        <div className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-white/45">
          {STATUS_OPTIONS.map((status) => {
            const active = ensaio.status === status.value
            const dotColor = STATUS_DOT_COLORS[status.value] || 'bg-white/40'
            const textColor = STATUS_TEXT_COLORS[status.value] || 'text-[var(--text)]'
            const activeBg = STATUS_ACTIVE_BG[status.value] || 'bg-white/55 border-[var(--border)]'

            return (
              <button
                key={status.value}
                type="button"
                disabled={loading}
                onClick={() => onStatusChange(status.value)}
                className={`flex w-full items-center justify-between border-b px-3 py-2.5 text-left text-[12.5px] transition last:border-b-0 disabled:cursor-not-allowed disabled:opacity-60 ${
                  active
                    ? `${activeBg} ${textColor}`
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--card-hover)] hover:text-[var(--text)]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                  <span className={active ? textColor : 'text-[var(--text)]'}>
                    {status.label}
                  </span>
                </span>

                {active && (
                  <span className={textColor}>
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
