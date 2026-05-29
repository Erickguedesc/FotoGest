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
    <div className="rounded-xl border border-white/[0.08] bg-[#141414] px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white/25">
        <Icon name="search" size={22} />
      </div>

      <h3 className="font-serif text-[24px] font-light tracking-[0.04em] text-white">
        {copy.title}
      </h3>

      <p className="mx-auto mt-1 max-w-md text-[13px] text-white/45">
        {copy.description}
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--gold)] px-5 py-2.5 text-[12px] font-medium tracking-[0.1em] text-[#1A1200] transition hover:bg-[var(--gold-light)]"
      >
        <Icon name="plus" size={14} />
        Novo Ensaio
      </button>
    </div>
  )
}
