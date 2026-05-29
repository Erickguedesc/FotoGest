import { STATUS_OPTIONS } from './ensaioHelpers'

function CountBadge({ count, active }) {
  return (
    <span
      className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-medium leading-none ${
        active
          ? 'bg-[var(--gold-dim)] text-[var(--gold)]'
          : 'bg-[var(--card-hover)] text-[var(--text-muted)]'
      }`}
    >
      {count || 0}
    </span>
  )
}

export default function StatusTabs({ activeStatus, counts = {}, options = STATUS_OPTIONS, onChange }) {
  const baseClass =
    'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] tracking-[0.08em] transition'

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange('')}
        className={`${baseClass} ${
          !activeStatus
            ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]'
            : 'border-transparent bg-[var(--card)] text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text)]'
        }`}
      >
        <span>Todos</span>
        <CountBadge count={counts.total} active={!activeStatus} />
      </button>

      {options.map((status) => {
        const active = activeStatus === status.value

        return (
          <button
            key={status.value}
            type="button"
            onClick={() => onChange(status.value)}
            className={`${baseClass} ${
              active
                ? status.chipClass
                : 'border-transparent bg-[var(--card)] text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            <span>{status.label}</span>
            <CountBadge count={counts[status.value]} active={active} />
          </button>
        )
      })}
    </div>
  )
}
