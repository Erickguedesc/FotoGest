import { TimerReset } from 'lucide-react'

import { STATUS_OPTIONS } from '../listaEnsaios/ensaioHelpers'

import SectionTitle from './SectionTitle'

const STATUS_TIMELINE_TONES = {
  AGENDADO: {
    active: 'border-[var(--status-scheduled)] bg-white text-[var(--status-scheduled)]',
    done: 'border-[var(--status-scheduled)] bg-white text-[var(--status-scheduled)]',
    text: 'text-[var(--status-scheduled)]',
    line: 'bg-[var(--status-scheduled)]/55',
  },
  REALIZADO: {
    active: 'border-[var(--status-completed)] bg-white text-[var(--status-completed)]',
    done: 'border-[var(--status-completed)] bg-white text-[var(--status-completed)]',
    text: 'text-[var(--status-completed)]',
    line: 'bg-[var(--status-completed)]/55',
  },
  EM_SELECAO: {
    active: 'border-[var(--status-selection)] bg-white text-[var(--status-selection)]',
    done: 'border-[var(--status-selection)] bg-white text-[var(--status-selection)]',
    text: 'text-[var(--status-selection)]',
    line: 'bg-[var(--status-selection)]/55',
  },
  EM_EDICAO: {
    active: 'border-[var(--status-editing)] bg-white text-[var(--status-editing)]',
    done: 'border-[var(--status-editing)] bg-white text-[var(--status-editing)]',
    text: 'text-[var(--status-editing)]',
    line: 'bg-[var(--status-editing)]/55',
  },
  FINALIZADO: {
    active: 'border-[var(--status-delivered)] bg-white text-[var(--status-delivered)]',
    done: 'border-[var(--status-delivered)] bg-white text-[var(--status-delivered)]',
    text: 'text-[var(--status-delivered)]',
    line: 'bg-[var(--status-delivered)]/55',
  },
}

const formatDate = (value) => {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleDateString('pt-BR')
}

const formatDateTime = (value) => {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function LinhaTempo({ ensaio, historicoStatus = [] }) {
  const statusAtual = ensaio?.status

  const timelineSteps = STATUS_OPTIONS.filter(
    (status) => status.value !== 'CANCELADO'
  )

  const historicoOrdenado = historicoStatus
    .map((item) => ({
      ...item,
      alteradoEmNormalizado: item.alteradoEm || item.alterado_em,
    }))
    .filter((item) => item.status && item.alteradoEmNormalizado)
    .sort((a, b) => new Date(a.alteradoEmNormalizado) - new Date(b.alteradoEmNormalizado))

  const historicoPorStatus = historicoOrdenado.reduce((acc, item) => {
    acc[item.status] = item.alteradoEmNormalizado
    return acc
  }, {})

  const totalPorStatus = historicoOrdenado.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {})

  const possuiRetornoDeStatus = Object.values(totalPorStatus).some((total) => total > 1)

  const labelPorStatus = STATUS_OPTIONS.reduce((acc, item) => {
    acc[item.value] = item.label
    return acc
  }, {})

  const currentIndex = timelineSteps.findIndex(
    (item) => item.value === statusAtual
  )

  const isCancelado = statusAtual === 'CANCELADO'

  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-white/78 shadow-[0_14px_34px_rgba(31,31,33,0.055)]">
      <SectionTitle title="Linha do tempo" icon={TimerReset} compact />

      {isCancelado ? (
        <div className="flex min-h-[112px] items-center justify-center px-5 py-6 text-center">
          <div>
            <div className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600">
              !
            </div>

            <p className="text-[14px] text-red-700">
              Ensaio cancelado
            </p>

              <p className="mt-1 text-[12px] text-[var(--text-muted)]">
              A linha do tempo foi interrompida porque o ensaio foi cancelado.
            </p>
          </div>
        </div>
      ) : (
        <div className="px-6 py-5 max-md:px-5">
          <div className="grid grid-cols-5 gap-4 max-md:grid-cols-1 max-md:gap-3">
            {timelineSteps.map((step, index) => {
              const isCurrent = step.value === statusAtual
              const isFinalCurrent = isCurrent && index === timelineSteps.length - 1
              const isDone = currentIndex >= 0 && (index < currentIndex || isFinalCurrent)
              const isActive = isCurrent || isDone
              const isLast = index === timelineSteps.length - 1
              const isFuture = currentIndex >= 0 && index > currentIndex
              const tone = STATUS_TIMELINE_TONES[step.value] || STATUS_TIMELINE_TONES.AGENDADO

              const dataStatus = isFuture ? null : formatDate(historicoPorStatus[step.value])
              const statusSubtexto = isFuture
                ? 'Aguardando'
                : dataStatus
                ? dataStatus
                : isDone
                  ? 'Etapa pulada'
                  : isCurrent
                    ? 'Status atual'
                    : 'Aguardando'

              return (
                <div
                  key={step.value}
                  className="relative flex flex-col items-center text-center max-md:flex-row max-md:items-center max-md:gap-4 max-md:text-left"
                >
                  {!isLast && (
                    <div
                      className={`absolute left-[calc(50%+21px)] top-[16px] h-[2px] w-[calc(100%-42px)] max-md:hidden ${
                        isDone
                          ? tone.line
                          : isCurrent
                            ? tone.line
                            : 'bg-[var(--border)]'
                      }`}
                    />
                  )}

                  <span
                    className={`relative z-[1] flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-semibold ${
                      isDone
                        ? tone.done
                        : isCurrent
                          ? `${tone.active} shadow-[0_0_0_5px_var(--gold-dim),0_10px_24px_rgba(31,31,33,0.07)] ring-1 ring-current`
                          : 'border-[var(--border)] bg-[var(--card-hover)] text-[var(--text-muted)]'
                    }`}
                  >
                    {isDone ? '✓' : index + 1}
                  </span>

                  <div className="mt-2.5 max-md:mt-0">
                    <p
                      className={`text-[11px] font-medium ${
                        isDone
                          ? tone.text
                          : isCurrent
                            ? tone.text
                            : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {step.label}
                    </p>

                    <p className={`mt-0.5 text-[10px] ${isActive ? 'text-[var(--text-muted)]' : 'text-[var(--text-muted)]/70'}`}>
                      {statusSubtexto}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {possuiRetornoDeStatus && (
            <div className="mt-5 rounded-[10px] border border-[var(--border)] bg-white/70 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                Histórico completo
              </p>

              <div className="mt-3 space-y-2">
                {historicoOrdenado.map((item, index) => {
                  const dataEvento = formatDateTime(item.alteradoEmNormalizado)
                  const statusLabel = labelPorStatus[item.status] || item.status
                  const tone = STATUS_TIMELINE_TONES[item.status] || STATUS_TIMELINE_TONES.AGENDADO

                  return (
                    <div
                      key={item.id || `${item.status}-${item.alteradoEmNormalizado}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-[8px] bg-[var(--card-hover)] px-3 py-2 max-sm:flex-col max-sm:items-start"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${tone.line}`} />
                        <span className="text-[12px] font-medium text-[var(--text)]">
                          {statusLabel}
                        </span>
                      </div>

                      <span className="text-[11px] text-[var(--text-muted)]">
                        {dataEvento}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
