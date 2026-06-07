import { STATUS_OPTIONS } from './ensaioHelpers'

function CountBadge({ count, active }) {
  return (
    <span
      className={`ensaios-filter-count ${active ? 'is-active' : ''}`}
    >
      {count || 0}
    </span>
  )
}

export default function StatusTabs({ activeStatus, counts = {}, options = STATUS_OPTIONS, onChange }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange('')}
        className={`ensaios-filter-tab ${!activeStatus ? 'is-active' : ''}`}
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
            className={`ensaios-filter-tab ${active ? 'is-active' : ''}`}
          >
            <span>{status.label}</span>
            <CountBadge count={counts[status.value]} active={active} />
          </button>
        )
      })}
    </div>
  )
}
