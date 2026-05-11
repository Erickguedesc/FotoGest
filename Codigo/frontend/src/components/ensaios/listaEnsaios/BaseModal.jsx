export default function BaseModal({
  open,
  title,
  children,
  footer,
  onClose,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl border border-white/[0.10] bg-[#151515] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-7 py-5">
          <h2 className="font-serif text-[28px] font-light tracking-[0.04em] text-white">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] text-xl text-white/35 transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-3 border-t border-white/[0.08] bg-[#151515] px-7 py-5">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}