import Icon from './Icon'
import { canDeleteEnsaio } from './ensaioHelpers'

export default function EnsaioActions({
  ensaio,
  onView,
  onEdit,
  onStatus,
  onDelete,
  onPreContrato,
  orientation = 'horizontal',
  showView,
}) {
  const deletable = canDeleteEnsaio(ensaio)
  const vertical = orientation === 'vertical'
  const shouldShowView = showView ?? !vertical
  const baseButtonClass = `${
    vertical ? 'h-9 w-9 rounded-xl' : 'h-8 w-8 rounded-lg'
  } theme-icon-button flex items-center justify-center border transition hover:bg-[var(--gold-dim)]`
  const dangerButtonClass = `${
    vertical ? 'h-9 w-9 rounded-xl' : 'h-8 w-8 rounded-lg'
  } theme-icon-button flex items-center justify-center border transition enabled:hover:border-red-400/40 enabled:hover:bg-red-400/10 enabled:hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-25`
  const iconSize = vertical ? 14 : 14

  return (
    <div className={`flex ${vertical ? 'flex-col' : 'items-center'} gap-1.5`}>
      {shouldShowView && (
        <button
          type="button"
          onClick={() => onView(ensaio)}
          className={baseButtonClass}
          title="Visualizar"
        >
          <Icon name="eye" size={iconSize} />
        </button>
      )}

      <button
        type="button"
        onClick={() => onEdit(ensaio)}
        className={baseButtonClass}
        title="Editar"
      >
        <Icon name="edit" size={iconSize} />
      </button>

      <button
        type="button"
        onClick={() => onStatus(ensaio)}
        className={baseButtonClass}
        title="Alterar status"
      >
        <Icon name="check" size={iconSize} />
      </button>

      <button
        type="button"
        onClick={() => onPreContrato(ensaio)}
        className={baseButtonClass}
        title="Gerar pre-contrato"
      >
        <Icon name="file" size={iconSize} />
      </button>

      <button
        type="button"
        disabled={!deletable}
        onClick={() => deletable && onDelete(ensaio)}
        className={dangerButtonClass}
        title={deletable ? 'Deletar' : 'So e possivel excluir ensaios agendados ou cancelados'}
      >
        <Icon name="trash" size={iconSize} />
      </button>
    </div>
  )
}
