export default function Pagination({ page, totalPages, pageSize, total, onPageChange, onPageSizeChange }) {
  if (!total) return null

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[12px] text-white/40">
      <span>
        Página {page} de {totalPages} • {total} registro{total === 1 ? '' : 's'}
      </span>

      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-lg border border-white/[0.10] bg-[#181818] px-2.5 py-2 text-[12px] text-white/65 outline-none"
        >
          {[6, 10, 15, 20].map((size) => <option key={size} value={size}>{size} por página</option>)}
        </select>
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-white/[0.10] px-3 py-2 transition enabled:hover:border-[var(--gold-border)] enabled:hover:text-white disabled:opacity-30"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-white/[0.10] px-3 py-2 transition enabled:hover:border-[var(--gold-border)] enabled:hover:text-white disabled:opacity-30"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}
