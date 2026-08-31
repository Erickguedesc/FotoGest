const sortOptions = [
  { key: 'dataEnsaio', label: 'Data' },
  { key: 'clienteNome', label: 'Cliente' },
  { key: 'status', label: 'Status' },
  { key: 'valorPacote', label: 'Valor' },
]

export default function EnsaiosListHeader({ sort, onSort }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-[var(--border)] bg-[rgba(250,248,244,0.72)] px-5 py-4 shadow-[0_14px_34px_rgba(92,82,72,0.08)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
        Lista de ensaios
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-[var(--text-muted)]">Ordenar por</span>

        {sortOptions.map((option) => {
          const active = sort.key === option.key

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onSort(option.key)}
              className={`rounded-[8px] border px-3.5 py-2 text-[12px] transition ${
                active
                  ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]'
                  : 'border-[var(--border)] bg-white/35 text-[var(--text)] hover:border-[var(--gold-border)] hover:text-[var(--gold)]'
              }`}
            >
              {option.label}
              {active ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ''}
            </button>
          )
        })}
      </div>
    </div>
  )
}
