import { useMemo, useState } from 'react'

import Icon from './Icon'
import StatusBadge from './StatusBadge'
import { formatCurrency, getStatusInfo, getTipoExibicao } from './ensaioHelpers'

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const MONTH_OPTIONS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const MONTH_LABEL = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

const DAY_LABEL = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
})

const CONFLICT_DATE_LABEL = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const STATUS_DOT = {
  AGENDADO: 'bg-indigo-300',
  REALIZADO: 'bg-lime-300',
  EM_SELECAO: 'bg-amber-300',
  EM_EDICAO: 'bg-sky-300',
  FINALIZADO: 'bg-emerald-300',
  CANCELADO: 'bg-red-300',
}

const MIN_YEAR = 2000
const MAX_YEAR = 2100

const pad = (value) => String(value).padStart(2, '0')

const isValidDate = (date) =>
  date instanceof Date && !Number.isNaN(date.getTime())

const clampYear = (year) =>
  Math.min(MAX_YEAR, Math.max(MIN_YEAR, year))

const toDateKey = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const toInputDate = (date) =>
  isValidDate(date)
    ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    : ''

const formatTime = (value) => {
  if (!value) return '--:--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--:--'
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const buildMonthDays = (monthDate) => {
  if (!isValidDate(monthDate)) return []

  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const start = new Date(year, month, 1 - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

export default function CalendarioEnsaios({
  ensaios = [],
  onView,
  onCreateForDate,
}) {
  const hoje = new Date()
  const [mesAtual, setMesAtual] = useState(
    new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  )
  const [anoDigitado, setAnoDigitado] = useState(String(hoje.getFullYear()))
  const [diaSelecionado, setDiaSelecionado] = useState(toInputDate(hoje))

  const ensaiosPorDia = useMemo(() => {
    return ensaios.reduce((acc, ensaio) => {
      const key = toDateKey(ensaio.dataEnsaio)
      if (!key) return acc

      if (!acc[key]) acc[key] = []
      acc[key].push(ensaio)
      return acc
    }, {})
  }, [ensaios])

  const diasDoMes = useMemo(() => buildMonthDays(mesAtual), [mesAtual])

  const ensaiosDoMes = useMemo(() => {
    return ensaios.filter((ensaio) => {
      const date = new Date(ensaio.dataEnsaio)
      return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === mesAtual.getFullYear() &&
        date.getMonth() === mesAtual.getMonth()
      )
    })
  }, [ensaios, mesAtual])

  const diasOcupadosNoMes = useMemo(() => {
    return new Set(ensaiosDoMes.map((ensaio) => toDateKey(ensaio.dataEnsaio))).size
  }, [ensaiosDoMes])

  const conflitosNoMes = useMemo(() => {
    return Object.entries(ensaiosPorDia).filter(([key, itens]) => {
      const [year, month] = key.split('-').map(Number)
      return (
        year === mesAtual.getFullYear() &&
        month === mesAtual.getMonth() + 1 &&
        itens.length > 1
      )
    }).length
  }, [ensaiosPorDia, mesAtual])

  const conflitosDetalhesNoMes = useMemo(() => {
    return Object.entries(ensaiosPorDia)
      .filter(([key, itens]) => {
        const [year, month] = key.split('-').map(Number)
        return (
          year === mesAtual.getFullYear() &&
          month === mesAtual.getMonth() + 1 &&
          itens.length > 1
        )
      })
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, itens]) => {
        const [year, month, day] = key.split('-').map(Number)
        const date = new Date(year, month - 1, day)

        return {
          key,
          label: CONFLICT_DATE_LABEL.format(date),
          ensaios: [...itens].sort(
            (a, b) => new Date(a.dataEnsaio).getTime() - new Date(b.dataEnsaio).getTime()
          ),
        }
      })
  }, [ensaiosPorDia, mesAtual])

  const ensaiosSelecionados = [...(ensaiosPorDia[diaSelecionado] || [])].sort(
    (a, b) => new Date(a.dataEnsaio).getTime() - new Date(b.dataEnsaio).getTime()
  )

  const selectedDate = (() => {
    const [year, month, day] = diaSelecionado.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return isValidDate(date) ? date : hoje
  })()

  const irParaMes = (delta) => {
    setMesAtual((prev) => {
      const proximoMes = new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
      const anoSeguro = clampYear(proximoMes.getFullYear())
      const dataSegura = new Date(anoSeguro, proximoMes.getMonth(), 1)
      setAnoDigitado(String(dataSegura.getFullYear()))
      return dataSegura
    })
  }

  const irParaHoje = () => {
    const now = new Date()
    setMesAtual(new Date(now.getFullYear(), now.getMonth(), 1))
    setAnoDigitado(String(now.getFullYear()))
    setDiaSelecionado(toInputDate(now))
  }

  const handleMesChange = (value) => {
    const mes = Number(value)

    if (Number.isNaN(mes) || mes < 0 || mes > 11) return

    setMesAtual((prev) => new Date(prev.getFullYear(), mes, 1))
  }

  const handleAnoChange = (value) => {
    const normalizado = value.replace(/\D/g, '').slice(0, 4)
    setAnoDigitado(normalizado)

    if (normalizado.length !== 4) return

    const ano = Number(normalizado)

    if (ano < MIN_YEAR || ano > MAX_YEAR) return

    setMesAtual((prev) => new Date(ano, prev.getMonth(), 1))
  }

  const handleAnoBlur = () => {
    const ano = Number(anoDigitado)

    if (anoDigitado.length !== 4 || Number.isNaN(ano) || ano < MIN_YEAR || ano > MAX_YEAR) {
      setAnoDigitado(String(mesAtual.getFullYear()))
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--gold-border)] bg-[#121212]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold)]">
            Calendário de ensaios
          </p>
          <h2 className="mt-1 font-serif text-2xl font-light capitalize text-white">
            {MONTH_LABEL.format(mesAtual)}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => irParaMes(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.10] text-lg text-white/55 transition hover:border-[var(--gold-border)] hover:text-[var(--gold)]"
            title="Mês anterior"
          >
            ‹
          </button>

          <div className="flex items-center gap-2 rounded-lg border border-white/[0.10] bg-[#181818] px-2 py-1.5">
            <select
              value={mesAtual.getMonth()}
              onChange={(event) => handleMesChange(event.target.value)}
              className="bg-transparent px-2 py-1 text-[12px] text-white/70 outline-none"
              title="Selecionar mês"
            >
              {MONTH_OPTIONS.map((mes, index) => (
                <option key={mes} value={index}>
                  {mes}
                </option>
              ))}
            </select>

            <input
              type="text"
              inputMode="numeric"
              value={anoDigitado}
              onChange={(event) => handleAnoChange(event.target.value)}
              onBlur={handleAnoBlur}
              maxLength={4}
              className="w-[74px] bg-transparent px-2 py-1 text-[12px] text-white/70 outline-none"
              title="Selecionar ano"
            />
          </div>

          <button
            type="button"
            onClick={irParaHoje}
            className="rounded-lg border border-white/[0.10] px-4 py-2 text-[12px] text-white/55 transition hover:border-[var(--gold-border)] hover:text-white"
          >
            Hoje
          </button>

          <button
            type="button"
            onClick={() => irParaMes(1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.10] text-lg text-white/55 transition hover:border-[var(--gold-border)] hover:text-[var(--gold)]"
            title="Próximo mês"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-0 max-lg:grid-cols-1">
        <div className="p-5">
          <div className="mb-4 grid grid-cols-3 gap-3 md:grid-cols-4">
            <ResumoCalendario label="Ensaios no mês" value={ensaiosDoMes.length} />
            <ResumoCalendario label="Dias ocupados" value={diasOcupadosNoMes} />
            <ResumoCalendario
              label="Possíveis conflitos"
              value={conflitosNoMes}
              danger={conflitosNoMes > 0}
              tooltipTitle="Dias com possíveis conflitos"
              tooltipItems={conflitosDetalhesNoMes}
            />
            <ResumoCalendario label="Dia selecionado" value={ensaiosSelecionados.length} />
          </div>

          <div className="grid grid-cols-7 rounded-xl border border-white/[0.08] bg-black/10">
            {WEEK_DAYS.map((dia) => (
              <div
                key={dia}
                className="border-b border-white/[0.08] px-2 py-3 text-center text-[10px] uppercase tracking-[0.14em] text-white/35"
              >
                {dia}
              </div>
            ))}

            {diasDoMes.map((date) => {
              const key = toInputDate(date)
              const eventos = ensaiosPorDia[key] || []
              const foraDoMes = date.getMonth() !== mesAtual.getMonth()
              const selecionado = key === diaSelecionado
              const hojeKey = key === toInputDate(hoje)
              const conflito = eventos.length > 1

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDiaSelecionado(key)}
                  className={`min-h-[118px] border-b border-r border-white/[0.06] p-2 text-left transition hover:bg-white/[0.035] ${
                    foraDoMes ? 'bg-black/20 text-white/20' : 'text-white/70'
                  } ${selecionado ? 'bg-[var(--gold-dim)] ring-1 ring-inset ring-[var(--gold-border)]' : ''}`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] ${
                        hojeKey
                          ? 'bg-[var(--gold)] text-[#1A1200]'
                          : selecionado
                            ? 'text-[var(--gold)]'
                            : ''
                      }`}
                    >
                      {date.getDate()}
                    </span>

                    {conflito && (
                      <span className="rounded-full border border-red-400/30 bg-red-400/10 px-2 py-0.5 text-[10px] text-red-300">
                        {eventos.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {eventos.slice(0, 3).map((ensaio) => {
                      const statusInfo = getStatusInfo(ensaio.status)
                      return (
                        <div
                          key={ensaio.id}
                          className="rounded-md border border-white/[0.08] bg-black/25 px-2 py-1"
                        >
                          <span className="flex items-center gap-1.5 text-[11px] text-white/75">
                            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[ensaio.status] || 'bg-white/40'}`} />
                            <span className="truncate">{formatTime(ensaio.dataEnsaio)} · {ensaio.clienteNome}</span>
                          </span>
                          <span className="mt-0.5 block truncate text-[10px] text-white/35">
                            {statusInfo.label}
                          </span>
                        </div>
                      )
                    })}

                    {eventos.length > 3 && (
                      <p className="text-[10px] text-[var(--gold)]">
                        +{eventos.length - 3} ensaio{eventos.length - 3 === 1 ? '' : 's'}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-white/40">
            {Object.entries(STATUS_DOT).map(([status, color]) => (
              <span key={status} className="inline-flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${color}`} />
                {getStatusInfo(status).label}
              </span>
            ))}
          </div>
        </div>

        <aside className="border-l border-white/[0.08] bg-black/10 p-5 max-lg:border-l-0 max-lg:border-t">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
            Dia selecionado
          </p>
          <h3 className="mt-1 font-serif text-2xl font-light capitalize text-white">
            {DAY_LABEL.format(selectedDate)}
          </h3>

          <button
            type="button"
            onClick={() => onCreateForDate(diaSelecionado)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--gold)] px-4 py-3 text-[12px] font-medium tracking-[0.08em] text-[#1A1200] transition hover:bg-[var(--gold-light)]"
          >
            <Icon name="plus" size={14} />
            Novo nessa data
          </button>

          {ensaiosSelecionados.length > 1 && (
            <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-[13px] leading-6 text-red-200">
              Há mais de um ensaio neste dia. Confira horários e deslocamento antes de confirmar novos agendamentos.
            </div>
          )}

          <div className="mt-5 space-y-3">
            {ensaiosSelecionados.length === 0 ? (
              <div className="rounded-xl border border-white/[0.08] bg-black/20 p-5 text-center">
                <p className="text-[13px] text-white/55">
                  Nenhum ensaio marcado para este dia.
                </p>
              </div>
            ) : (
              ensaiosSelecionados.map((ensaio) => (
                <article
                  key={ensaio.id}
                  className="rounded-xl border border-white/[0.08] bg-[#181818] p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] text-white">
                        {ensaio.clienteNome || 'Cliente sem nome'}
                      </p>
                      <p className="mt-1 text-[12px] text-white/40">
                        {formatTime(ensaio.dataEnsaio)} · {getTipoExibicao(ensaio)}
                      </p>
                    </div>
                    <StatusBadge status={ensaio.status} />
                  </div>

                  <div className="space-y-2 text-[12px] text-white/45">
                    <p className="flex items-center gap-2">
                      <Icon name="location" size={12} />
                      <span className="truncate">{ensaio.local || 'Local não informado'}</span>
                    </p>
                    <p className="text-[var(--gold)]">
                      {formatCurrency(ensaio.valorPacote)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onView(ensaio)}
                    className="mt-4 w-full rounded-lg border border-white/[0.10] px-3 py-2 text-[12px] text-white/55 transition hover:border-[var(--gold-border)] hover:text-[var(--gold)]"
                  >
                    Abrir detalhes
                  </button>
                </article>
              ))
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

function ResumoCalendario({ label, value, danger, tooltipTitle, tooltipItems = [] }) {
  const hasTooltip = tooltipItems.length > 0

  return (
    <div
      className={`group relative rounded-xl border px-4 py-3 outline-none ${
        danger
          ? 'border-red-400/30 bg-red-400/10'
          : 'border-white/[0.08] bg-black/20'
      }`}
      tabIndex={hasTooltip ? 0 : undefined}
      title={hasTooltip ? 'Passe o mouse para ver os dias com conflito' : undefined}
    >
      <p className={danger ? 'text-[18px] text-red-300' : 'text-[18px] text-white'}>
        {value}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>

      {hasTooltip && (
        <div className="pointer-events-none absolute left-0 top-[calc(100%+10px)] z-30 hidden w-[360px] rounded-xl border border-red-400/30 bg-[#171111] p-4 text-left shadow-[0_18px_40px_rgba(0,0,0,0.45)] group-hover:block group-focus:block max-sm:left-auto max-sm:right-0 max-sm:w-[min(82vw,360px)]">
          <p className="text-[11px] uppercase tracking-[0.16em] text-red-200/80">
            {tooltipTitle}
          </p>

          <div className="mt-3 space-y-3">
            {tooltipItems.slice(0, 4).map((item) => (
              <div key={item.key} className="border-t border-white/[0.08] pt-3 first:border-t-0 first:pt-0">
                <p className="text-[13px] font-medium capitalize text-white">
                  {item.label}
                </p>

                <div className="mt-2 space-y-1.5">
                  {item.ensaios.map((ensaio) => (
                    <p key={ensaio.id} className="flex items-center justify-between gap-3 text-[12px] text-white/60">
                      <span className="min-w-0 truncate">
                        {ensaio.clienteNome || 'Cliente sem nome'}
                      </span>
                      <span className="shrink-0 text-red-200">
                        {formatTime(ensaio.dataEnsaio)}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {tooltipItems.length > 4 && (
            <p className="mt-3 border-t border-white/[0.08] pt-3 text-[12px] text-red-200/75">
              +{tooltipItems.length - 4} dia{tooltipItems.length - 4 === 1 ? '' : 's'} com conflito neste mês.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
