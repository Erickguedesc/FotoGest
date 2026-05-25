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
    <section className="theme-card rounded-2xl border border-[var(--gold-border)] p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="theme-title font-serif text-2xl font-light">
            Valores por período
          </h2>

          <p className="theme-muted mt-1 text-sm">
            Comparação entre total previsto e quantidade de ensaios.
          </p>
        </div>

        <div className="theme-text flex gap-4 text-xs">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
            Valor previsto
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--chart-count)]" />
Nº de Ensaios
          </span>
        </div>
      </div>

      {loading ? (
        <div className="theme-muted flex h-64 items-center justify-center">
          <Loader2 className="mr-2 animate-spin" size={20} />
          Carregando gráfico...
        </div>
      ) : periodos.length === 0 ? (
        <div className="theme-muted flex h-64 items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-sm">
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
  className="group relative w-5 rounded-t-md bg-[var(--chart-count)] transition opacity-80 hover:opacity-100"
  style={{ height: `${alturaEnsaios}%` }}
>
            <Tooltip
              label={item.label}
              value={`${item.quantidadeEnsaios || 0} ensaio(s)`}
              variant="white"
            />
          </div>
        </div>

        <span className="theme-muted mt-3 text-xs">
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
    variant === 'gold' ? 'text-[var(--gold)]' : 'text-[var(--chart-count)]'

  return (
    <div className="theme-card pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-lg border px-3 py-2 text-xs opacity-0 shadow-2xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
      <span className="theme-muted block text-[10px] uppercase tracking-[0.12em]">
        {label}
      </span>

      <span className={`font-medium ${valueColor}`}>
        {value}
      </span>

      <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-[var(--border)] bg-[var(--card)]" />
    </div>
  )
}
