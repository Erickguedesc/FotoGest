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
    <section className="rounded-2xl border border-[var(--gold-border)] bg-[#121212]">
      <SectionTitle title="Linha do tempo" />

      {isCancelado ? (
        <div className="flex min-h-[130px] items-center justify-center px-6 py-8 text-center">
          <div>
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-red-400/40 bg-red-400/10 text-red-300">
              !
            </div>

            <p className="text-[14px] text-red-300">
              Ensaio cancelado
            </p>

            <p className="mt-1 text-[12px] text-white/35">
              A linha do tempo foi interrompida porque o ensaio foi cancelado.
            </p>
          </div>
        </div>
      ) : (
        <div className="px-8 py-8 max-md:px-5">
          <div className="grid grid-cols-5 gap-6 max-md:grid-cols-1">
            {timelineSteps.map((step, index) => {
              const isCurrent = step.value === statusAtual
              const isDone = currentIndex >= 0 && index < currentIndex
              const isActive = isCurrent || isDone
              const isLast = index === timelineSteps.length - 1

              const dataStatus = formatDate(historicoPorStatus[step.value])

              return (
                <div
                  key={step.value}
                  className="relative flex flex-col items-center text-center max-md:flex-row max-md:items-center max-md:gap-4 max-md:text-left"
                >
                  {!isLast && (
                    <div
                      className={`absolute left-[calc(50%+24px)] top-[18px] h-[2px] w-[calc(100%-48px)] max-md:hidden ${
                        isDone
                          ? 'bg-emerald-400/70'
                          : isCurrent
                            ? 'bg-[var(--gold)]'
                            : 'bg-white/[0.14]'
                      }`}
                    />
                  )}

                  <span
                    className={`relative z-[1] flex h-9 w-9 items-center justify-center rounded-full border text-[12px] ${
                      isDone
                        ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300'
                        : isCurrent
                          ? 'border-[var(--gold-border)] bg-[rgba(201,164,89,0.12)] text-[var(--gold)]'
                          : 'border-white/[0.14] bg-white/[0.03] text-white/35'
                    }`}
                  >
                    {isDone ? '✓' : index + 1}
                  </span>

                  <div className="mt-4 max-md:mt-0">
                    <p
                      className={`text-[12px] ${
                        isDone
                          ? 'text-emerald-300'
                          : isCurrent
                            ? 'text-[var(--gold)]'
                            : 'text-white/55'
                      }`}
                    >
                      {step.label}
                    </p>

                    {isActive && dataStatus ? (
                      <p className="mt-1 text-[10px] text-white/35">
                        {dataStatus}
                      </p>
                    ) : (
                      <p className="mt-1 text-[10px] text-white/20">
                        Aguardando
                      </p>
                    )}
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