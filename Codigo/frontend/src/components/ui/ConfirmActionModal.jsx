const TYPE_STYLES = {
  warning: {
    icon: 'text-orange-300 border-orange-400/30 bg-orange-400/10',
    confirm:
      'bg-orange-400 text-[#1A1200] hover:bg-orange-300',
  },
  danger: {
    icon: 'text-red-300 border-red-400/30 bg-red-400/10',
    confirm:
      'bg-red-400 text-white hover:bg-red-300',
  },
  gold: {
    icon: 'text-[var(--gold)] border-[var(--gold-border)] bg-[var(--gold-dim)]',
    confirm:
      'bg-[var(--gold)] text-[#1A1200] hover:bg-[var(--gold-light)]',
  },

  success: {
  icon: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  confirm:
    'bg-emerald-400 text-[#1A1200] hover:bg-emerald-300',
},
}

function CheckCircleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}

function AlertTriangleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m21.7 18-8.9-15.4a1 1 0 0 0-1.7 0L2.3 18a1 1 0 0 0 .9 1.5h17.6a1 1 0 0 0 .9-1.5z" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export default function ConfirmActionModal({
  open,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  loading = false,
  showCancel = true,
  onConfirm,
  onClose,
}) {
  if (!open) return null

  const style = TYPE_STYLES[type] || TYPE_STYLES.warning
  const Icon = type === 'success' ? CheckCircleIcon : AlertTriangleIcon

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-[var(--gold-border)] bg-[#121212] shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/[0.08] p-5">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border ${style.icon}`}
            >
                <Icon />
            </div>

            <div>
              <h2 className="font-serif text-[22px] font-light tracking-[0.03em] text-white">
                {title}
              </h2>

              <p className="mt-2 text-[13px] leading-6 text-white/50">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/35 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Fechar"
          >
            <CloseIcon />
          </button>
        </div>

     <div className="flex justify-end gap-3 p-5">
  {showCancel && (
    <button
      type="button"
      disabled={loading}
      onClick={onClose}
      className="rounded-lg border border-white/[0.10] px-5 py-2.5 text-[12px] font-medium tracking-[0.08em] text-white/55 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      {cancelText}
    </button>
  )}

  <button
    type="button"
    disabled={loading}
    onClick={onConfirm}
    className={`rounded-lg px-5 py-2.5 text-[12px] font-semibold tracking-[0.08em] transition disabled:cursor-not-allowed disabled:opacity-60 ${style.confirm}`}
  >
    {loading ? 'Processando...' : confirmText}
  </button>
</div>
      </div>
    </div>
  )
}
