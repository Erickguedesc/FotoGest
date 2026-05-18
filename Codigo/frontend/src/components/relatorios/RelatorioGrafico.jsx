import { Loader2 } from 'lucide-react'
import { formatMoney } from '../../utils/relatoriosUtils'

export default function RelatorioGrafico({ periodos = [], loading }) {
  const maiorTotal = Math.max(
    1,
    ...periodos.map((item) => item.totalLiquido || 0)
  )

  const maiorQuantidade = Math.max(
    1,
    ...periodos.map((item) => item.quantidadeEnsaios || 0)
  )

  return (
    <section className="rounded-2xl border border-[var(--gold-border)] bg-[#111111] p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="font-serif text-2xl font-light text-white">
            Faturamento por período
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Comparação entre total líquido e quantidade de ensaios.
          </p>
        </div>

        <div className="flex gap-4 text-xs text-white/50">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
            Faturamento
          </span>

          <span className="flex items-center gap-2">
<span className="h-2 w-2 rounded-full bg-white/80" />            
Nº de Ensaios
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-white/50">
          <Loader2 className="mr-2 animate-spin" size={20} />
          Carregando gráfico...
        </div>
      ) : periodos.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-white/40">
          Nenhum período retornado para esse filtro.
        </div>
      ) : (
        <div className="flex h-80 items-end gap-3 px-2 pb-8 pt-12">
  {periodos.map((item) => {
    const alturaReceita = Math.max(
      6,
      ((item.totalLiquido || 0) / maiorTotal) * 100
    )

    const alturaEnsaios = Math.max(
      6,
      ((item.quantidadeEnsaios || 0) / maiorQuantidade) * 100
    )

    return (
      <div
        key={`${item.label}-${item.inicio}`}
        className="flex min-w-[70px] flex-1 flex-col items-center justify-end"
      >
        <div className="flex h-56 w-full items-end justify-center gap-1">
          <div
            className="group relative w-5 rounded-t-md bg-[var(--gold)]/90 transition hover:bg-[var(--gold-light)]"
            style={{ height: `${alturaReceita}%` }}
          >
            <Tooltip
              label={item.label}
              value={formatMoney(item.totalLiquido)}
              variant="gold"
            />
          </div>

        <div
  className="group relative w-5 rounded-t-md bg-white/80 transition hover:bg-white"
  style={{ height: `${alturaEnsaios}%` }}
>
            <Tooltip
              label={item.label}
              value={`${item.quantidadeEnsaios || 0} ensaio(s)`}
              variant="white"
            />
          </div>
        </div>

        <span className="mt-3 text-xs text-white/45">
          {item.label}
        </span>
      </div>
    )
  })}
</div>
      )}
    </section>
  )
}

function Tooltip({ label, value, variant = 'gold' }) {
  const valueColor =
    variant === 'gold' ? 'text-[var(--gold)]' : 'text-white'

  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-xs text-white opacity-0 shadow-2xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
      <span className="block text-[10px] uppercase tracking-[0.12em] text-white/40">
        {label}
      </span>

      <span className={`font-medium ${valueColor}`}>
        {value}
      </span>

      <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-white/10 bg-[#111111]" />
    </div>
  )
}