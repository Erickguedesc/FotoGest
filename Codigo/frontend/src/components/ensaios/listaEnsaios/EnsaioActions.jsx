import Icon from './Icon'
import { canDeleteEnsaio } from './ensaioHelpers'

export default function EnsaioActions({ ensaio, onView, onEdit, onStatus, onDelete }) {
  const deletable = canDeleteEnsaio(ensaio)

  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={() => onView(ensaio)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.10] text-white/35 transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]" title="Visualizar">
        <Icon name="eye" />
      </button>
      <button type="button" onClick={() => onEdit(ensaio)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.10] text-white/35 transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]" title="Editar">
        <Icon name="edit" />
      </button>
      <button type="button" onClick={() => onStatus(ensaio)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.10] text-white/35 transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]" title="Alterar status">
        <Icon name="check" />
      </button>
      <button
        type="button"
        disabled={!deletable}
        onClick={() => deletable && onDelete(ensaio)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.10] text-white/35 transition enabled:hover:border-red-400/40 enabled:hover:bg-red-400/10 enabled:hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-25"
        title={deletable ? 'Deletar' : 'Só é possível excluir ensaios agendados ou cancelados'}
      >
        <Icon name="trash" />
      </button>
    </div>
  )
}
