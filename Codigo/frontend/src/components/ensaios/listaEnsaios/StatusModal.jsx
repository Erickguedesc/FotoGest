import BaseModal from './BaseModal'
import Icon from './Icon'
import { STATUS_OPTIONS } from './ensaioHelpers'

const STATUS_MODAL_TONES = {
  AGENDADO: {
    color: 'var(--status-scheduled)',
    border: 'rgba(113, 103, 232, 0.34)',
    background: 'rgba(113, 103, 232, 0.08)',
  },
  REALIZADO: {
    color: 'var(--status-completed)',
    border: 'rgba(98, 168, 62, 0.34)',
    background: 'rgba(98, 168, 62, 0.08)',
  },
  EM_SELECAO: {
    color: 'var(--status-selection)',
    border: 'rgba(242, 154, 46, 0.38)',
    background: 'rgba(242, 154, 46, 0.12)',
  },
  EM_EDICAO: {
    color: 'var(--status-editing)',
    border: 'rgba(59, 130, 246, 0.34)',
    background: 'rgba(59, 130, 246, 0.08)',
  },
  FINALIZADO: {
    color: 'var(--status-delivered)',
    border: 'rgba(32, 184, 166, 0.34)',
    background: 'rgba(32, 184, 166, 0.08)',
  },
  CANCELADO: {
    color: 'var(--status-cancelled)',
    border: 'rgba(239, 83, 80, 0.36)',
    background: 'rgba(239, 83, 80, 0.08)',
  },
}

export default function StatusModal({ ensaio, open, loading, onClose, onConfirm }) {
  return (
    <BaseModal open={open} title="Atualizar status" onClose={onClose} maxWidth="max-w-[380px]">
      <div className="space-y-1">
        {STATUS_OPTIONS.map((status) => {
          const active = ensaio?.status === status.value
          const tone = STATUS_MODAL_TONES[status.value] || STATUS_MODAL_TONES.AGENDADO

          return (
            <button
              key={status.value}
              type="button"
              disabled={loading}
              aria-pressed={active}
              onClick={() => onConfirm(status.value)}
              className="flex min-h-[50px] w-full items-center gap-3 rounded-[8px] border bg-white px-3.5 py-3 text-left text-[14px] font-medium text-[var(--text)] transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] disabled:cursor-not-allowed disabled:opacity-55"
              style={{
                borderColor: active ? tone.border : 'var(--border)',
                backgroundColor: active ? tone.background : undefined,
                color: active ? tone.color : 'var(--text)',
              }}
            >
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border bg-white"
                style={{ borderColor: tone.color }}
              >
                {active && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: tone.color }}
                  />
                )}
              </span>
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: tone.color }}
              />
              <span className={`min-w-0 flex-1 truncate ${active ? 'font-semibold' : ''}`}>
                {status.label}
              </span>
              {active && (
                <span className="ml-auto shrink-0">
                  <Icon name="check" size={16} />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </BaseModal>
  )
}
