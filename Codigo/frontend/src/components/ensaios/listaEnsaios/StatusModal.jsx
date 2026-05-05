import BaseModal from './BaseModal'
import Icon from './Icon'
import { STATUS_OPTIONS } from './ensaioHelpers'

export default function StatusModal({ ensaio, open, loading, onClose, onConfirm }) {
  return (
    <BaseModal open={open} title="Atualizar status" onClose={onClose} maxWidth="max-w-[380px]">
      <div className="space-y-1">
        {STATUS_OPTIONS.map((status) => {
          const active = ensaio?.status === status.value
          return (
            <button
              key={status.value}
              type="button"
              disabled={loading}
              onClick={() => onConfirm(status.value)}
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-[13px] transition disabled:opacity-50 ${active ? 'bg-[var(--gold-dim)] text-[var(--gold)]' : 'text-white/65 hover:bg-white/[0.04] hover:text-white'}`}
            >
              <span className={`h-2 w-2 rounded-full border ${status.chipClass}`} />
              {status.label}
              {active && <span className="ml-auto"><Icon name="check" size={14} /></span>}
            </button>
          )
        })}
      </div>
    </BaseModal>
  )
}
