import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { formatMoney } from '../../utils/relatoriosUtils'

const CORES_PERIODOS = [
  '#2563EB',
  '#F97316',
  '#16A34A',
  '#DC2626',
  '#9333EA',
  '#EAB308',
  '#0891B2',
  '#DB2777',
  '#65A30D',
  '#02b9de',
  '#0F766E',
  '#C2410C',
]

export default function RelatorioGrafico({ periodos = [], loading }) {
  const [modo, setModo] = useState('barras')

  const periodosComReceita = periodos.filter(
    (item) => Number(item.totalLiquido || 0) > 0,
  )

  return (
    <section className="theme-card rounded-2xl border border-[var(--gold-border)] p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="theme-title font-serif text-2xl font-light">
            Valores por período
          </h2>

          <p className="theme-muted mt-1 text-sm">
            Compare receita, volume e concentração dos períodos filtrados.
          </p>
        </div>

        <div className="theme-panel inline-flex w-fit rounded-full border p-1">
          <ToggleButton active={modo === 'barras'} onClick={() => setModo('barras')}>
            Barras
          </ToggleButton>

          <ToggleButton active={modo === 'donut'} onClick={() => setModo('donut')}>
            Donut
          </ToggleButton>

          <ToggleButton active={modo === 'linha'} onClick={() => setModo('linha')}>
            Linha
          </ToggleButton>
        </div>
      </div>

      {loading ? (
        <div className="theme-muted flex h-64 items-center justify-center">
          <Loader2 className="mr-2 animate-spin" size={20} />
          Carregando gráfico...
        </div>
      ) : periodos.length === 0 ? (
        <EmptyState>Nenhum período retornado para esse filtro.</EmptyState>
      ) : modo === 'barras' ? (
        <BarrasChart periodos={periodos} />
      ) : modo === 'donut' ? (
        periodosComReceita.length ? (
          <DonutChart periodos={periodosComReceita} />
        ) : (
          <EmptyState>Sem receita para montar o donut nesse filtro.</EmptyState>
        )
      ) : (
        <LinhaChart periodos={periodos} />
      )}
    </section>
  )
}

function ToggleButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'bg-[var(--gold)] text-[#1a1200]'
          : 'theme-muted hover:bg-[var(--gold-dim)] hover:text-[var(--text)]'
      }`}
    >
      {children}
    </button>
  )
}

function BarrasChart({ periodos }) {
  const maiorTotal = Math.max(
    1,
    ...periodos.map((item) => Number(item.totalLiquido || 0)),
  )

  const maiorQuantidade = Math.max(
    1,
    ...periodos.map((item) => Number(item.quantidadeEnsaios || 0)),
  )

  return (
    <>
      <div className="theme-text mb-4 flex gap-4 text-xs">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
          Valor previsto
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--chart-count)]" />
          Nº de Ensaios
        </span>
      </div>

      <div className="theme-scrollbar flex h-80 items-end gap-3 overflow-x-visible px-2 pb-8 pt-12 max-sm:overflow-x-auto">
        {periodos.map((item) => {
          const alturaReceita = Math.max(
            6,
            ((item.totalLiquido || 0) / maiorTotal) * 100,
          )

          const alturaEnsaios = Math.max(
            6,
            ((item.quantidadeEnsaios || 0) / maiorQuantidade) * 100,
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
                  className="group relative w-5 rounded-t-md bg-[var(--chart-count)] opacity-80 transition hover:opacity-100"
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
    </>
  )
}

function DonutChart({ periodos }) {
  const total = periodos.reduce(
    (acc, item) => acc + Number(item.totalLiquido || 0),
    0,
  )
  let offset = 0
  const principal = periodos.reduce(
    (maior, item) =>
      Number(item.totalLiquido || 0) > Number(maior?.totalLiquido || 0)
        ? item
        : maior,
    periodos[0],
  )
  const percentualPrincipal = total
    ? (Number(principal?.totalLiquido || 0) / total) * 100
    : 0

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-center">
      <div className="relative mx-auto h-72 w-72">
        <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
          <circle
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke="rgba(0,0,0,0.10)"
            strokeWidth="6"
          />

          {periodos.map((item, index) => {
            const percentual = total
              ? (Number(item.totalLiquido || 0) / total) * 100
              : 0
            const dashOffset = -offset
            offset += percentual

            return (
              <circle
                key={`${item.label}-${item.inicio}`}
                className="cursor-pointer opacity-90 transition duration-200 hover:opacity-100 hover:[filter:saturate(1.2)_brightness(1.06)]"
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={CORES_PERIODOS[index % CORES_PERIODOS.length]}
                strokeWidth="6"
                strokeDasharray={`${percentual} ${100 - percentual}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
              >
                <title>
                  {`${item.label} · ${percentual.toLocaleString('pt-BR', {
                    maximumFractionDigits: 1,
                  })}% · ${formatMoney(item.totalLiquido)}`}
                </title>
              </circle>
            )
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="theme-muted text-[10px] uppercase tracking-[0.18em]">
            Maior fatia
          </p>

          <p className="theme-title mt-1 max-w-[150px] truncate text-lg font-semibold">
            {principal?.label}
          </p>

          <p className="font-serif text-4xl text-[var(--gold)]">
            {percentualPrincipal.toLocaleString('pt-BR', {
              maximumFractionDigits: 1,
            })}%
          </p>
        </div>
      </div>

      <div className="theme-scrollbar max-h-[360px] space-y-3 overflow-y-auto pr-2">
        {periodos.map((item, index) => {
          const percentual = total
            ? (Number(item.totalLiquido || 0) / total) * 100
            : 0

          return (
            <div
              key={`${item.label}-${item.inicio}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-black/10 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: CORES_PERIODOS[index % CORES_PERIODOS.length] }}
                />

                <div className="min-w-0">
                  <p className="theme-title truncate text-sm font-semibold">
                    {item.label}
                  </p>

                  <p className="theme-muted text-xs">
                    {formatMoney(item.totalLiquido)} · {item.quantidadeEnsaios || 0} ensaio{item.quantidadeEnsaios === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <span className="font-serif text-xl text-[var(--gold)]">
                {percentual.toLocaleString('pt-BR', {
                  maximumFractionDigits: 1,
                })}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LinhaChart({ periodos }) {
  const maiorTotal = Math.max(
    1,
    ...periodos.map((item) => Number(item.totalLiquido || 0)),
  )
  const largura = 640
  const altura = 260
  const paddingX = 34
  const paddingY = 28
  const larguraUtil = largura - paddingX * 2
  const alturaUtil = altura - paddingY * 2
  const divisor = Math.max(1, periodos.length - 1)

  const pontos = periodos.map((item, index) => {
    const x = paddingX + (index / divisor) * larguraUtil
    const y = paddingY + alturaUtil - (Number(item.totalLiquido || 0) / maiorTotal) * alturaUtil
    return { x, y, item }
  })

  const path = pontos
    .map((ponto, index) => `${index === 0 ? 'M' : 'L'} ${ponto.x} ${ponto.y}`)
    .join(' ')

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${largura} ${altura}`}
        className="min-h-[320px] min-w-[680px]"
        role="img"
        aria-label="Linha de receita por período"
      >
        <line
          x1={paddingX}
          y1={altura - paddingY}
          x2={largura - paddingX}
          y2={altura - paddingY}
          stroke="var(--border)"
          strokeWidth="1"
        />

        <path
          d={path}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {pontos.map((ponto) => (
          <g key={`${ponto.item.label}-${ponto.item.inicio}`} className="group">
            <circle
              cx={ponto.x}
              cy={ponto.y}
              r="5"
              fill="var(--gold)"
              className="cursor-pointer transition group-hover:r-[7px]"
            >
              <title>
                {`${ponto.item.label} · ${formatMoney(ponto.item.totalLiquido)}`}
              </title>
            </circle>

            <text
              x={ponto.x}
              y={altura - 8}
              textAnchor="middle"
              className="fill-[var(--text-muted)] text-[11px]"
            >
              {ponto.item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function EmptyState({ children }) {
  return (
    <div className="theme-muted flex h-64 items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-sm">
      {children}
    </div>
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
