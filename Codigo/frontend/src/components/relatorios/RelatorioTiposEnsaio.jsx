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
  OUTRO: '#C08457',
}

const getTipoColor = (tipo, index = 0) =>
  CORES_TIPOS[tipo] || Object.values(CORES_TIPOS)[index % Object.values(CORES_TIPOS).length]

export default function RelatorioTiposEnsaio({ tipos = [] }) {
  const [visualizacao, setVisualizacao] = useState('lista')
  const ranking = Array.isArray(tipos) ? tipos : []
  const principal = ranking[0]
  const precisaRolagem = ranking.length > 5
  const percentualPrincipal = Number(principal?.percentualReceita || 0)

  return (
    <section className="theme-card relatorio-tipos-ensaio rounded-2xl border p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="theme-muted text-xs uppercase tracking-[0.22em]">
            Receita por tipo de ensaio
          </p>

          <h2 className="theme-title mt-2 font-serif text-2xl font-light">
            Onde o faturamento está concentrado
          </h2>

          {principal ? (
            <p className="theme-muted mt-2 text-sm">
              {(principal.tipoExibicao || getTipoLabel(principal.tipo))} lidera com{' '}
              <span className="text-[var(--gold)]">
                {percentualPrincipal.toLocaleString('pt-BR', {
                  maximumFractionDigits: 1,
                })}%
              </span>{' '}
              da receita no período.
            </p>
          ) : null}
        </div>

        {principal ? (
          <div className="flex flex-wrap items-center gap-3">
            <div className="theme-panel inline-flex rounded-full border p-1">
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
          </div>
        ) : null}
      </div>

      {ranking.length && visualizacao === 'lista' ? (
        <div
          className={`theme-scrollbar space-y-4 pr-2 ${
            precisaRolagem ? 'max-h-[640px] overflow-y-auto' : ''
          }`}
        >
          {ranking.map((item) => {
            const percentual = Number(item.percentualReceita || 0)

            return (
              <article
                key={item.tipoExibicao || item.tipo}
                className="rounded-xl border border-[var(--border)] bg-black/10 p-4"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="theme-title text-base font-semibold">
                      {item.tipoExibicao || getTipoLabel(item.tipo)}
                    </h3>

                    <p className="theme-muted mt-1 text-xs">
                      {item.quantidadeEnsaios || 0} ensaio{item.quantidadeEnsaios === 1 ? '' : 's'} · ticket médio {formatMoney(item.ticketMedio)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-serif text-2xl text-[var(--gold)]">
                      {percentual.toLocaleString('pt-BR', {
                        maximumFractionDigits: 1,
                      })}%
                    </p>

                    <p className="theme-muted text-xs">
                      {formatMoney(item.faturamento)}
                    </p>
                  </div>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-black/15">
                  <div
                    className="h-full rounded-full bg-[var(--gold)] transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, percentual))}%` }}
                  />
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
              <p className="theme-muted text-[10px] uppercase tracking-[0.18em]">
                Líder
              </p>

              <p className="theme-title mt-1 max-w-[150px] truncate text-lg font-semibold">
                {principal.tipoExibicao || getTipoLabel(principal.tipo)}
              </p>

              <p className="font-serif text-4xl text-[var(--gold)]">
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
                  className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-black/10 px-4 py-3"
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
                      <p className="theme-title truncate text-sm font-semibold">
                        {item.tipoExibicao || getTipoLabel(item.tipo)}
                      </p>

                      <p className="theme-muted text-xs">
                        {item.quantidadeEnsaios || 0} ensaio{item.quantidadeEnsaios === 1 ? '' : 's'} · {formatMoney(item.faturamento)}
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
      ) : (
        <div className="rounded-xl border border-[var(--border)] p-6 text-center">
          <p className="theme-title text-sm">
            Ainda não há receita finalizada para comparar os tipos de ensaio.
          </p>

          <p className="theme-muted mt-2 text-xs">
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
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'bg-[var(--report-accent)] text-[#1a1200] hover:bg-[var(--report-accent-hover)]'
          : 'theme-muted hover:bg-[var(--report-accent-soft)] hover:text-[var(--text)]'
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
        stroke="rgba(0,0,0,0.10)"
        strokeWidth="5"
      />

      {ranking.map((item, index) => {
        const percentual = Math.max(0, Number(item.percentualReceita || 0))
        const dashOffset = -offset
        offset += percentual

        return (
          <circle
            key={item.tipoExibicao || item.tipo}
            className="cursor-pointer opacity-90 transition duration-200 hover:opacity-100 hover:[filter:saturate(1.28)_brightness(1.08)]"
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
