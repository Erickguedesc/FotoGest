export default function BaseModal({
  open,
  title,
  children,
  footer,
  onClose,
  maxWidth = 'max-w-[720px]',
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className={`theme-card flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl border shadow-2xl`}>
        <div className="theme-divider flex items-center justify-between border-b px-7 py-5">
          <h2 className="theme-title font-serif text-[28px] font-light tracking-[0.04em]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="theme-icon-button flex h-10 w-10 items-center justify-center rounded-lg border text-xl transition hover:bg-[var(--gold-dim)]"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          {children}
        </div>

        {footer && (
          <div className="theme-divider flex justify-end gap-3 border-t bg-[var(--card)] px-7 py-5">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
