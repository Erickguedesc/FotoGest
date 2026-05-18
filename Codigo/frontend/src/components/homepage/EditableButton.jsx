export default function EditableButton({ onClick, className = '' }) {
  const isLogged = Boolean(localStorage.getItem('token'))

  if (!isLogged) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80 shadow-lg backdrop-blur transition-all duration-200 hover:border-[var(--gold)] hover:text-[var(--gold)] ${className}`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
      Editar
    </button>
  )
}
