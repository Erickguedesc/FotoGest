import Icon from './Icon'
import { getStatusInfo } from './ensaioHelpers'

function getEmptyCopy(filters = {}) {
  if (filters.status) {
    const status = getStatusInfo(filters.status)

    return {
      title: `Nenhum ensaio ${status.label.toLowerCase()}`,
      description: 'Não há ensaios neste status no momento.',
    }
  }

  if (filters.grupo === 'ativos') {
    return {
      title: 'Nenhum ensaio ativo',
      description: 'Agendados, realizados, em seleção e em edição aparecerão aqui.',
    }
  }

  if (filters.clienteNome || filters.tipo || filters.dataInicio || filters.dataFim) {
    return {
      title: 'Nenhum resultado para os filtros',
      description: 'Ajuste os filtros para encontrar outros ensaios.',
    }
  }

  return {
    title: 'Nenhum ensaio encontrado',
    description: 'Cadastre um novo ensaio para começar a acompanhar a produção.',
  }
}

export default function EmptyState({ onCreate, filters }) {
  const copy = getEmptyCopy(filters)

  return (
    <div className="rounded-[8px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] px-6 py-14 text-center shadow-[0_14px_34px_rgba(92,82,72,0.08)]">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)]">
        <Icon name="search" size={22} />
      </div>

      <h3 className="font-serif text-[24px] font-light tracking-normal text-[var(--text)]">
        {copy.title}
      </h3>

      <p className="mx-auto mt-1 max-w-md text-[13px] text-[var(--text-muted)]">
        {copy.description}
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[linear-gradient(180deg,#c57a08,#a96200)] px-5 py-2.5 text-[13px] font-medium text-white transition hover:brightness-110"
      >
        <Icon name="plus" size={14} />
        Novo Ensaio
      </button>
    </div>
  )
}
