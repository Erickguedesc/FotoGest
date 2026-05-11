import { AlertTriangle, X } from 'lucide-react'

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
}

export default function ConfirmActionModal({
  open,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null

  const style = TYPE_STYLES[type] || TYPE_STYLES.warning

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-[var(--gold-border)] bg-[#121212] shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/[0.08] p-5">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border ${style.icon}`}
            >
              <AlertTriangle size={20} />
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
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-end gap-3 p-5">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg border border-white/[0.10] px-5 py-2.5 text-[12px] font-medium tracking-[0.08em] text-white/55 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {cancelText}
          </button>

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