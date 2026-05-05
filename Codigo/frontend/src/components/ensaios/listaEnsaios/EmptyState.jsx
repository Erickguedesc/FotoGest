import Icon from './Icon'

export default function EmptyState({ onCreate }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#141414] px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white/25">
        <Icon name="search" size={22} />
      </div>
      <h3 className="font-serif text-[24px] font-light tracking-[0.04em] text-white">Nenhum ensaio encontrado</h3>
      <p className="mx-auto mt-1 max-w-md text-[13px] text-white/45">
        Ajuste os filtros ou cadastre um novo ensaio para começar a acompanhar a produção.
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
