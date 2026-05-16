import { Calendar, Loader2 } from 'lucide-react'
import { TIPOS_PERIODO } from '../../utils/relatoriosUtils'

export default function RelatorioFiltros({
  tipo,
  ano,
  anosDisponiveis,
  loading,
  onTipoChange,
  onAnoChange,
  onFiltrar,
}) {
  return (
    <>
      <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
        <h2 className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--gold)]">
          Período
        </h2>

        <div className="space-y-2">
          {TIPOS_PERIODO.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onTipoChange(item.value)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                tipo === item.value
                  ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-white'
                  : 'border-white/10 bg-transparent text-white/60 hover:border-white/20 hover:bg-white/[0.03]'
              }`}
            >
              <span className="text-sm">{item.label}</span>
              <span className="text-xs text-white/40">{item.detalhe}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#111111] p-5">
        <h2 className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--gold)]">
          Ano
        </h2>

        <div className="flex flex-wrap gap-2">
          {anosDisponiveis.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onAnoChange(item)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                Number(ano) === Number(item)
                  ? 'border-[var(--gold)] bg-[var(--gold)] text-black'
                  : 'border-white/10 text-white/60 hover:border-[var(--gold-border)] hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={onFiltrar}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Carregando
          </>
        ) : (
          <>
            <Calendar size={16} />
            Filtrar
          </>
        )}
      </button>
    </>
  )
}