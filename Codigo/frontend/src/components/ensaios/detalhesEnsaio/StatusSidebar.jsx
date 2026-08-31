import { STATUS_OPTIONS } from '../listaEnsaios/ensaioHelpers'

const STATUS_DOT_COLORS = {
  AGENDADO: 'bg-indigo-300',
  REALIZADO: 'bg-lime-300',
  EM_SELECAO: 'bg-amber-300',
  EM_EDICAO: 'bg-sky-300',
  FINALIZADO: 'bg-emerald-300',
  CANCELADO: 'bg-red-300',
}

const STATUS_TEXT_COLORS = {
  AGENDADO: 'text-indigo-700',
  REALIZADO: 'text-lime-700',
  EM_SELECAO: 'text-amber-700',
  EM_EDICAO: 'text-sky-700',
  FINALIZADO: 'text-emerald-700',
  CANCELADO: 'text-red-700',
}

const STATUS_ACTIVE_BG = {
  AGENDADO: 'bg-indigo-50 border-indigo-100',
  REALIZADO: 'bg-lime-50 border-lime-100',
  EM_SELECAO: 'bg-amber-50 border-amber-100',
  EM_EDICAO: 'bg-sky-50 border-sky-100',
  FINALIZADO: 'bg-emerald-50 border-emerald-100',
  CANCELADO: 'bg-red-50 border-red-100',
}

export default function StatusSidebar({ ensaio, loading, onStatusChange }) {
  return (
    <section
      id="status-sidebar"
      className="rounded-[14px] border border-[var(--border)] bg-white/78 shadow-[0_14px_34px_rgba(78,56,35,0.07)]"
    >
      <div className="flex items-center gap-3 px-5 pt-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-[7px] border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[10px] text-[var(--gold)]">
          ○
        </span>

        <h2 className="text-[14px] font-semibold text-[var(--text)]">
          Status atual
        </h2>
      </div>

      <div className="px-5 pb-4 pt-3">
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
                className={`flex w-full items-center justify-between border-b px-3 py-3 text-left text-[13px] transition last:border-b-0 disabled:cursor-not-allowed disabled:opacity-60 ${
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
