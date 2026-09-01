import { useState } from 'react'
import { getTipoLabel } from '../ensaios/listaEnsaios/ensaioHelpers'
import { formatMoney } from '../../utils/relatoriosUtils'

const CORES_TIPOS = {
  NEWBORN: '#00A7C2',
  GESTANTE: '#A855F7',
  FAMILIA: '#22B573',
  INFANTIL: '#F2B705',
  FEMININO: '#E85D75',
  CASAL: '#0F7A5F',
  BOOK: '#3B82F6',
  BATIZADO: '#14B8A6',
  EXTERNO: '#F97316',
  FORMATURA: '#8B5CF6',
  EVENTO: '#EC4899',
  DEBUTANTE: '#84CC16',
  OUTRO: '#C84F32',
}

const getTipoColor = (tipo, index = 0) =>
  CORES_TIPOS[tipo] || Object.values(CORES_TIPOS)[index % Object.values(CORES_TIPOS).length]

export default function RelatorioTiposEnsaio({ tipos = [] }) {
  const [visualizacao, setVisualizacao] = useState('lista')
  const ranking = Array.isArray(tipos) ? tipos : []
  const principal = ranking[0]
  const precisaRolagem = ranking.length > 6
  const percentualPrincipal = Number(principal?.percentualReceita || 0)

  return (
    <section className="rounded-[18px] border border-[#E8E3DF] bg-white p-5 shadow-[0_16px_46px_rgba(31,31,33,0.05)] md:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="font-serif text-3xl font-light leading-tight text-[#1F1F21]">
            Receita por tipo de ensaio
          </h2>

          <p className="mt-1 text-sm text-[#6F6D6B]">
            Onde o faturamento está concentrado.
          </p>
        </div>

        {principal ? (
          <div className="inline-flex w-fit rounded-full border border-[#E8E3DF] bg-[#F5F3F1] p-1">
            <ToggleButton
              active={visualizacao === 'lista'}
              onClick={() => setVisualizacao('lista')}
            >
              Lista
            </ToggleButton>

            <ToggleButton
              active={visualizacao === 'donut'}
              onClick={() => setVisualizacao('donut')}
            >
              Donut
            </ToggleButton>
          </div>
        ) : null}
      </div>

      {ranking.length && visualizacao === 'lista' ? (
        <div
          className={`theme-scrollbar space-y-3 pr-2 ${
            precisaRolagem ? 'max-h-[620px] overflow-y-auto' : ''
          }`}
        >
          {ranking.map((item, index) => {
            const percentual = Number(item.percentualReceita || 0)
            const nome = item.tipoExibicao || getTipoLabel(item.tipo)
            const color = getTipoColor(item.tipo, index)

            return (
              <article
                key={item.tipoExibicao || item.tipo}
                className="grid gap-3 rounded-[14px] border border-transparent px-1 py-1 sm:grid-cols-[minmax(190px,0.55fr)_minmax(180px,1fr)_92px] sm:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                    style={{
                      backgroundColor: `${color}18`,
                      color,
                    }}
                  >
                    <span className="text-sm font-semibold leading-none">
                      {index + 1}
                    </span>
                  </span>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#2b2520]">
                      {nome}
                    </h3>

                    <p className="truncate text-xs text-[#6F6D6B]">
                      {item.quantidadeEnsaios || 0} ensaio{item.quantidadeEnsaios === 1 ? '' : 's'} · ticket médio {formatMoney(item.ticketMedio)}
                    </p>
                  </div>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#eee8e1]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(0, percentual))}%`,
                      backgroundColor: '#c9872b',
                    }}
                  />
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-serif text-2xl leading-none text-[#b5741d]">
                    {percentual.toLocaleString('pt-BR', {
                      maximumFractionDigits: 1,
                    })}%
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#6F6D6B]">
                    {formatMoney(item.faturamento)}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      ) : ranking.length && visualizacao === 'donut' ? (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-center">
          <div className="relative mx-auto h-72 w-72">
            <DonutChart ranking={ranking} />

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a7e73]">
                Líder
              </p>

              <p className="mt-1 max-w-[150px] truncate text-lg font-semibold text-[#2b2520]">
                {principal.tipoExibicao || getTipoLabel(principal.tipo)}
              </p>

              <p className="font-serif text-4xl text-[#AE3F28]">
                {percentualPrincipal.toLocaleString('pt-BR', {
                  maximumFractionDigits: 1,
                })}%
              </p>
            </div>
          </div>

          <div
            className={`theme-scrollbar space-y-3 pr-2 ${
              precisaRolagem ? 'max-h-[360px] overflow-y-auto' : ''
            }`}
          >
            {ranking.map((item, index) => {
              const percentual = Number(item.percentualReceita || 0)

              return (
                <div
                  key={item.tipoExibicao || item.tipo}
                  className="flex items-center justify-between gap-4 rounded-[12px] border border-[#E8E3DF] bg-[#F5F3F1] px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      title={`${item.tipoExibicao || getTipoLabel(item.tipo)} · ${percentual.toLocaleString('pt-BR', {
                        maximumFractionDigits: 1,
                      })}% · ${formatMoney(item.faturamento)}`}
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: getTipoColor(item.tipo, index) }}
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#2b2520]">
                        {item.tipoExibicao || getTipoLabel(item.tipo)}
                      </p>

                      <p className="text-xs text-[#6F6D6B]">
                        {item.quantidadeEnsaios || 0} ensaio{item.quantidadeEnsaios === 1 ? '' : 's'} · {formatMoney(item.faturamento)}
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
      ) : (
        <div className="rounded-[14px] border border-dashed border-[#E8E3DF] bg-[#F5F3F1] p-8 text-center">
          <p className="text-sm font-medium text-[#2b2520]">
            Ainda não há receita finalizada para comparar os tipos de ensaio.
          </p>

          <p className="mt-2 text-xs text-[#6F6D6B]">
            Quando houver ensaios entregues no período, a distribuição aparecerá aqui.
          </p>
        </div>
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

function DonutChart({ ranking }) {
  let offset = 0

  return (
    <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
      <circle
        cx="21"
        cy="21"
        r="15.915"
        fill="transparent"
        stroke="#eee7df"
        strokeWidth="5"
      />

      {ranking.map((item, index) => {
        const percentual = Math.max(0, Number(item.percentualReceita || 0))
        const dashOffset = -offset
        offset += percentual

        return (
          <circle
            key={item.tipoExibicao || item.tipo}
            className="cursor-pointer opacity-90 transition duration-200 hover:opacity-100 hover:[filter:saturate(1.24)_brightness(1.06)]"
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke={getTipoColor(item.tipo, index)}
            strokeWidth="5"
            strokeDasharray={`${percentual} ${100 - percentual}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
          >
            <title>
              {`${item.tipoExibicao || getTipoLabel(item.tipo)} · ${percentual.toLocaleString('pt-BR', {
                maximumFractionDigits: 1,
              })}% · ${formatMoney(item.faturamento)} · ${item.quantidadeEnsaios || 0} ensaio${item.quantidadeEnsaios === 1 ? '' : 's'}`}
            </title>
          </circle>
        )
      })}
    </svg>
  )
}
