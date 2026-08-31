import { ChevronLeft, ChevronRight } from 'lucide-react'

function getVisiblePages(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, 'end-ellipsis', totalPages]
  }

  if (page >= totalPages - 3) {
    return [1, 'start-ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'start-ellipsis', page - 1, page, page + 1, 'end-ellipsis', totalPages]
}

export default function Pagination({
  page,
  totalPages,
  pageSize,
  total,
  itemLabel = 'ensaio',
  ariaLabel = 'Paginacao dos ensaios',
  onPageChange,
  onPageSizeChange,
}) {
  if (!total) return null

  const firstItem = (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, total)
  const visiblePages = getVisiblePages(page, totalPages)
  const pluralLabel = total === 1 ? itemLabel : `${itemLabel}s`

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[8px] border border-[var(--border)] bg-[rgba(255,255,255,0.68)] px-4 py-3 text-[12px] text-[var(--text-muted)] shadow-[0_14px_34px_rgba(92,82,72,0.08)]">
      <span>
        Exibindo {firstItem}-{lastItem} de {total} {pluralLabel}
      </span>

      <nav className="flex flex-wrap items-center justify-center gap-2" aria-label={ariaLabel}>
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border)] bg-white/45 text-[var(--text)] transition enabled:hover:border-[var(--gold-border)] enabled:hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Pagina anterior"
        >
          <ChevronLeft size={15} strokeWidth={1.9} />
        </button>

        {visiblePages.map((item) => {
          if (typeof item === 'string') {
            return (
              <span key={item} className="flex h-9 w-7 items-center justify-center text-[var(--text-muted)]">
                ...
              </span>
            )
          }

          const active = item === page

          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={active ? 'page' : undefined}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-[12px] font-medium transition ${
                active
                  ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)] shadow-[0_10px_24px_rgba(92,82,72,0.10)]'
                  : 'border-[var(--border)] bg-white/45 text-[var(--text)] hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]'
              }`}
            >
              {item}
            </button>
          )
        })}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border)] bg-white/45 text-[var(--text)] transition enabled:hover:border-[var(--gold-border)] enabled:hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Proxima pagina"
        >
          <ChevronRight size={15} strokeWidth={1.9} />
        </button>
      </nav>

      <label className="flex items-center gap-2">
        <span>Itens por pagina</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-[8px] border border-[var(--border)] bg-white/55 px-2.5 py-2 text-[12px] text-[var(--text)] outline-none transition focus:border-[var(--gold-border)]"
        >
          {[6, 10, 15, 20].map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
    </div>
  )
}
