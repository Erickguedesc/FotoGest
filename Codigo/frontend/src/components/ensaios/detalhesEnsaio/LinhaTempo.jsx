import { TimerReset } from 'lucide-react'

import { STATUS_OPTIONS } from '../listaEnsaios/ensaioHelpers'

import SectionTitle from './SectionTitle'

const formatDate = (value) => {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleDateString('pt-BR')
}

export default function LinhaTempo({ ensaio, historicoStatus = [] }) {
  const statusAtual = ensaio?.status

  const timelineSteps = STATUS_OPTIONS.filter(
    (status) => status.value !== 'CANCELADO'
  )

  const historicoPorStatus = historicoStatus.reduce((acc, item) => {
    acc[item.status] = item.alteradoEm || item.alterado_em
    return acc
  }, {})

  const currentIndex = timelineSteps.findIndex(
    (item) => item.value === statusAtual
  )

  const isCancelado = statusAtual === 'CANCELADO'

  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-white/78 shadow-[0_14px_34px_rgba(78,56,35,0.07)]">
      <SectionTitle title="Linha do tempo" icon={TimerReset} />

      {isCancelado ? (
        <div className="flex min-h-[130px] items-center justify-center px-6 py-8 text-center">
          <div>
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600">
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
        <div className="px-8 py-8 max-md:px-5">
          <div className="grid grid-cols-5 gap-6 max-md:grid-cols-1">
            {timelineSteps.map((step, index) => {
              const isCurrent = step.value === statusAtual
              const isFinalCurrent = isCurrent && index === timelineSteps.length - 1
              const isDone = currentIndex >= 0 && (index < currentIndex || isFinalCurrent)
              const isActive = isCurrent || isDone
              const isLast = index === timelineSteps.length - 1
              const isFuture = currentIndex >= 0 && index > currentIndex

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
                      className={`absolute left-[calc(50%+24px)] top-[18px] h-[2px] w-[calc(100%-48px)] max-md:hidden ${
                        isDone
                          ? 'bg-emerald-500/70'
                          : isCurrent
                            ? 'bg-[var(--gold)]'
                            : 'bg-[var(--border)]'
                      }`}
                    />
                  )}

                  <span
                    className={`relative z-[1] flex h-9 w-9 items-center justify-center rounded-full border text-[12px] ${
                      isDone
                        ? 'border-emerald-500 bg-white text-emerald-600'
                        : isCurrent
                          ? 'border-[var(--gold)] bg-white text-[var(--gold)] shadow-[0_0_0_5px_var(--gold-dim),0_10px_24px_rgba(78,56,35,0.10)] ring-1 ring-[var(--gold)]'
                          : 'border-[var(--border)] bg-[var(--card-hover)] text-[var(--text-muted)]'
                    }`}
                  >
                    {isDone ? '✓' : index + 1}
                  </span>

                  <div className="mt-4 max-md:mt-0">
                    <p
                      className={`text-[12px] ${
                        isDone
                          ? 'text-emerald-600'
                          : isCurrent
                            ? 'text-[var(--gold)]'
                            : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {step.label}
                    </p>

                    <p className={`mt-1 text-[10px] ${isActive ? 'text-[var(--text-muted)]' : 'text-[var(--text-muted)]/70'}`}>
                      {statusSubtexto}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
