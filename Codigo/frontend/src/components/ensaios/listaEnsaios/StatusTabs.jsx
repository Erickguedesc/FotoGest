import { STATUS_OPTIONS } from './ensaioHelpers'

export default function StatusTabs({ activeStatus, onChange }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange('')}
        className={`rounded-full border px-3.5 py-1.5 text-[11px] tracking-[0.08em] transition ${!activeStatus ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]' : 'border-transparent bg-white/[0.04] text-white/45 hover:text-white/70'}`}
      >
        Todos
      </button>
      {STATUS_OPTIONS.map((status) => (
        <button
          key={status.value}
          type="button"
          onClick={() => onChange(status.value)}
          className={`rounded-full border px-3.5 py-1.5 text-[11px] tracking-[0.08em] transition ${activeStatus === status.value ? `${status.chipClass}` : 'border-transparent bg-white/[0.04] text-white/45 hover:text-white/70'}`}
        >
          {status.label}
        </button>
      ))}
    </div>
  )
}
