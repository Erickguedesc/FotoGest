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

export default function Pagination({ page, totalPages, pageSize, total, onPageChange, onPageSizeChange }) {
  if (!total) return null

  const firstItem = (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, total)
  const visiblePages = getVisiblePages(page, totalPages)

  return (
    <div className="theme-card mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border px-4 py-3 text-[12px] text-[var(--text-muted)]">
      <span>
        Pagina {page} de {totalPages} - {firstItem}-{lastItem} de {total}
      </span>

      <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Paginacao dos ensaios">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="theme-icon-button flex h-9 w-9 items-center justify-center rounded-lg border transition enabled:hover:border-[var(--gold-border)] enabled:hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-30"
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
                  ? 'border-[var(--gold-border)] bg-[var(--gold)] text-[#1A1200] shadow-[0_10px_24px_rgba(0,0,0,0.16)]'
                  : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]'
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
          className="theme-icon-button flex h-9 w-9 items-center justify-center rounded-lg border transition enabled:hover:border-[var(--gold-border)] enabled:hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-30"
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
          className="theme-panel rounded-lg border px-2.5 py-2 text-[12px] text-[var(--text)] outline-none transition focus:border-[var(--gold-border)]"
        >
          {[6, 10, 15, 20].map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </label>
    </div>
  )
}
