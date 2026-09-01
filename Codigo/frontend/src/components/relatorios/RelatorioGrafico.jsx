import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { formatMoney } from '../../utils/relatoriosUtils'

const CORES_PERIODOS = [
  '#C84F32',
  '#3b82f6',
  '#22c55e',
  '#ef4444',
  '#8b5cf6',
  '#eab308',
  '#0891b2',
  '#ec4899',
  '#65a30d',
  '#14b8a6',
  '#64748b',
  '#f97316',
]

export default function RelatorioGrafico({ periodos = [], loading }) {
  const [modo, setModo] = useState('barras')

  const periodosComReceita = periodos.filter(
    (item) => Number(item.totalLiquido || 0) > 0,
  )

  return (
    <section className="rounded-[18px] border border-[#E8E3DF] bg-white p-5 shadow-[0_16px_46px_rgba(31,31,33,0.055)] md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="font-serif text-3xl font-light leading-tight text-[#1F1F21]">
            Valores por período
          </h2>

          <p className="mt-1 text-sm text-[#6F6D6B]">
            Compare receita, volume e concentração dos períodos filtrados.
          </p>
        </div>

        <div className="inline-flex w-fit rounded-full border border-[#E8E3DF] bg-[#F5F3F1] p-1">
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
        <div className="flex h-[300px] items-center justify-center text-sm text-[#6F6D6B]">
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
      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
        active
          ? 'bg-[#C84F32] text-white shadow-[0_8px_18px_rgba(200,79,50,0.14)]'
          : 'text-[#6F6D6B] hover:bg-white hover:text-[#C84F32]'
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

  const marcas = [1, 0.75, 0.5, 0.25, 0]

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-[#6d6258]">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#d49a45]" />
          Valor previsto
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#9ca3af]" />
          Nº de ensaios
        </span>
      </div>

      <div className="theme-scrollbar overflow-x-auto pb-1">
        <div className="relative min-w-[720px] px-3 pt-20">
          <div className="absolute inset-x-3 top-20 h-[178px]">
            {marcas.map((marca) => (
              <div
                key={marca}
                className="absolute left-0 right-0 border-t border-dashed border-[#e9e1d7]"
                style={{ top: `${(1 - marca) * 100}%` }}
              />
            ))}
          </div>

          <div className="relative z-10 flex h-[178px] items-end gap-3">
            {periodos.map((item) => {
              const alturaReceita = Math.max(
                3,
                ((item.totalLiquido || 0) / maiorTotal) * 100,
              )

              const alturaEnsaios = Math.max(
                3,
                ((item.quantidadeEnsaios || 0) / maiorQuantidade) * 100,
              )

              return (
                <div
                  key={`${item.label}-${item.inicio}`}
                  className="flex min-w-[62px] flex-1 flex-col items-center justify-end"
                >
                  <div className="flex h-[178px] w-full items-end justify-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`${item.label}: ${formatMoney(item.totalLiquido)} previstos`}
                      className="group relative w-6 rounded-t-[6px] bg-gradient-to-b from-[#E9A08B] to-[#C84F32] shadow-[0_8px_16px_rgba(200,79,50,0.12)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C84F32]"
                      style={{ height: `${alturaReceita}%` }}
                    >
                      <Tooltip
                        label={item.label}
                        value={formatMoney(item.totalLiquido)}
                        description="Valor previsto"
                        variant="gold"
                      />
                    </button>

                    <button
                      type="button"
                      aria-label={`${item.label}: ${item.quantidadeEnsaios || 0} ensaio(s)`}
                      className="group relative w-3 rounded-t-[5px] bg-[#d7d1ca] transition hover:bg-[#9ca3af] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9ca3af]"
                      style={{ height: `${alturaEnsaios}%` }}
                    >
                      <Tooltip
                        label={item.label}
                        value={`${item.quantidadeEnsaios || 0} ensaio(s)`}
                        description="Ensaios realizados"
                        variant="gray"
                      />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-3 flex gap-3">
            {periodos.map((item) => (
              <span
                key={`${item.label}-${item.inicio}-label`}
                className="min-w-[62px] flex-1 text-center text-xs font-medium text-[#6F6D6B]"
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
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
            stroke="#eee7df"
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
                className="cursor-pointer opacity-90 transition duration-200 hover:opacity-100 hover:[filter:saturate(1.16)_brightness(1.04)]"
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a7e73]">
            Maior fatia
          </p>

          <p className="mt-1 max-w-[150px] truncate text-lg font-semibold text-[#2b2520]">
            {principal?.label}
          </p>

          <p className="font-serif text-4xl text-[#AE3F28]">
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
              className="flex items-center justify-between gap-4 rounded-[12px] border border-[#E8E3DF] bg-[#F5F3F1] px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: CORES_PERIODOS[index % CORES_PERIODOS.length] }}
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#2b2520]">
                    {item.label}
                  </p>

                  <p className="text-xs text-[#6F6D6B]">
                    {formatMoney(item.totalLiquido)} · {item.quantidadeEnsaios || 0} ensaio{item.quantidadeEnsaios === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <span className="font-serif text-xl text-[#AE3F28]">
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
  const [tooltip, setTooltip] = useState(null)

  const maiorTotal = Math.max(
    1,
    ...periodos.map((item) => Number(item.totalLiquido || 0)),
  )
  const largura = 700
  const altura = 230
  const paddingX = 44
  const paddingY = 34
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
    <div className="theme-scrollbar overflow-x-auto">
      <div className="relative min-w-[720px]">
        <svg
          viewBox={`0 0 ${largura} ${altura}`}
          className="min-h-[270px] min-w-[720px]"
          role="img"
          aria-label="Linha de receita por período"
        >
          {[0.25, 0.5, 0.75, 1].map((marca) => (
            <line
              key={marca}
              x1={paddingX}
              y1={paddingY + alturaUtil - marca * alturaUtil}
              x2={largura - paddingX}
              y2={paddingY + alturaUtil - marca * alturaUtil}
              stroke="#e9e1d7"
              strokeDasharray="5 5"
              strokeWidth="1"
            />
          ))}

          <line
            x1={paddingX}
            y1={altura - paddingY}
            x2={largura - paddingX}
            y2={altura - paddingY}
            stroke="#E8E3DF"
            strokeWidth="1"
          />

          <path
            d={path}
            fill="none"
            stroke="#C84F32"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {pontos.map((ponto) => (
            <g key={`${ponto.item.label}-${ponto.item.inicio}`} className="group">
              <circle
                cx={ponto.x}
                cy={ponto.y}
                r="7"
                fill="transparent"
                className="cursor-pointer"
                tabIndex={0}
                onMouseEnter={() =>
                  setTooltip({
                    description: `${ponto.item.quantidadeEnsaios || 0} ensaio(s)`,
                    label: ponto.item.label,
                    placement: ponto.y < 80 ? 'below' : 'above',
                    value: formatMoney(ponto.item.totalLiquido),
                    x: `${(ponto.x / largura) * 100}%`,
                    y: `${(ponto.y / altura) * 100}%`,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
                onFocus={() =>
                  setTooltip({
                    description: `${ponto.item.quantidadeEnsaios || 0} ensaio(s)`,
                    label: ponto.item.label,
                    placement: ponto.y < 80 ? 'below' : 'above',
                    value: formatMoney(ponto.item.totalLiquido),
                    x: `${(ponto.x / largura) * 100}%`,
                    y: `${(ponto.y / altura) * 100}%`,
                  })
                }
                onBlur={() => setTooltip(null)}
              />

              <circle
                cx={ponto.x}
                cy={ponto.y}
                r="5"
                fill="#C84F32"
                className="pointer-events-none transition group-hover:r-[7px]"
              />

              <text
                x={ponto.x}
                y={altura - 8}
                textAnchor="middle"
                className="fill-[#6F6D6B] text-[11px]"
              >
                {ponto.item.label}
              </text>
            </g>
          ))}
        </svg>

        {tooltip ? (
          <div
            className={`pointer-events-none absolute z-20 min-w-[150px] rounded-[10px] border border-[#e2d7cb] bg-white px-3 py-2 text-xs shadow-[0_12px_26px_rgba(82,58,35,0.12)] ${
              tooltip.placement === 'below'
                ? '-translate-x-1/2 translate-y-3'
                : '-translate-x-1/2 -translate-y-[calc(100%+10px)]'
            }`}
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a6a2d]">
              {tooltip.label}
            </span>

            <span className="mt-0.5 block font-semibold text-[#AE3F28]">
              {tooltip.value}
            </span>

            <span className="block text-[11px] text-[#6F6D6B]">
              {tooltip.description}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function EmptyState({ children }) {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-[14px] border border-dashed border-[#E8E3DF] bg-[#F5F3F1] text-sm text-[#6F6D6B]">
      {children}
    </div>
  )
}

function Tooltip({ label, value, description, variant = 'gold' }) {
  const valueColor = variant === 'gold' ? 'text-[#AE3F28]' : 'text-[#4b5563]'

  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[10px] border border-[#e2d7cb] bg-white px-3 py-2 text-left text-xs opacity-0 shadow-[0_12px_26px_rgba(82,58,35,0.12)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a6a2d]">
        {label}
      </span>

      <span className={`mt-0.5 block font-semibold ${valueColor}`}>
        {value}
      </span>

      <span className="block text-[11px] text-[#6F6D6B]">
        {description}
      </span>
    </span>
  )
}
