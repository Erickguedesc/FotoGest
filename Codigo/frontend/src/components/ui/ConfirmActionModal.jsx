import { useEffect, useId, useRef } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react'

const TYPE_STYLES = {
  warning: {
    icon: 'border-orange-200 bg-orange-50 text-orange-600',
    confirm: 'bg-[#C84F32] text-white hover:bg-[#AE3F28]',
    Icon: AlertTriangle,
  },
  danger: {
    icon: 'border-red-200 bg-red-50 text-red-600',
    confirm: 'bg-red-600 text-white hover:bg-red-700',
    Icon: Trash2,
  },
  gold: {
    icon: 'border-[#E6D2C7] bg-[#F8EDE8] text-[#C84F32]',
    confirm: 'bg-[#C84F32] text-white hover:bg-[#AE3F28]',
    Icon: Info,
  },
  success: {
    icon: 'border-emerald-200 bg-emerald-50 text-emerald-600',
    confirm: 'bg-[#C84F32] text-white hover:bg-[#AE3F28]',
    Icon: CheckCircle2,
  },
  restore: {
    icon: 'border-emerald-200 bg-emerald-50 text-emerald-600',
    confirm: 'bg-[#C84F32] text-white hover:bg-[#AE3F28]',
    Icon: RotateCcw,
  },
}

export default function ConfirmActionModal({
  open,
  title,
  description,
  children,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loadingText = 'Processando...',
  type = 'warning',
  loading = false,
  disabled = false,
  showCancel = true,
  icon: CustomIcon,
  onConfirm,
  onClose,
}) {
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        if (!loading) onClose?.()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )
      const items = Array.from(focusable || [])
      if (!items.length) return

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [loading, onClose, open])

  if (!open) return null

  const style = TYPE_STYLES[type] || TYPE_STYLES.warning
  const Icon = CustomIcon || style.Icon
  const actionDisabled = loading || disabled

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#111315]/68 px-4 py-6 backdrop-blur-[2px]">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className="w-full max-w-[420px] overflow-hidden rounded-[14px] border border-[#E5E0DC] bg-white text-[#2F3033] shadow-[0_24px_70px_rgba(17,19,21,0.28)] outline-none"
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${style.icon}`}
            >
              <Icon size={21} strokeWidth={1.8} />
            </div>

            <div className="min-w-0 pt-0.5">
              <h2
                id={titleId}
                className="font-serif text-[24px] font-light leading-tight text-[#1F1F21]"
              >
                {title}
              </h2>

              {description ? (
                <div
                  id={descriptionId}
                  className="mt-3 text-[13px] leading-6 text-[#65605C]"
                >
                  {description}
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[#8A8580] transition hover:bg-[#F4F1EE] hover:text-[#1F1F21] disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Fechar"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </div>

        {children ? <div className="px-5 pt-4">{children}</div> : null}

        <div className="mt-5 h-px bg-[#EEEAE7]" />

        <div className="flex justify-end gap-3 px-5 py-4 max-sm:grid max-sm:grid-cols-1">
          {showCancel && (
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="h-10 rounded-[8px] border border-[#DED8D2] bg-white px-5 text-[12px] font-semibold text-[#2F3033] transition hover:bg-[#F7F7F8] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            disabled={actionDisabled}
            onClick={onConfirm}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-5 text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${style.confirm}`}
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading ? loadingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
