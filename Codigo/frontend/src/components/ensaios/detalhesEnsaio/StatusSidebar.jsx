import {
  STATUS_OPTIONS,
  getStatusInfo,
} from '../listaEnsaios/ensaioHelpers'

import SectionTitle from './SectionTitle'

const STATUS_DOT_COLORS = {
  AGENDADO: 'bg-indigo-300',
  REALIZADO: 'bg-lime-300',
  EM_SELECAO: 'bg-amber-300',
  EM_EDICAO: 'bg-sky-300',
  FINALIZADO: 'bg-emerald-300',
  CANCELADO: 'bg-red-300',
}

const STATUS_TEXT_COLORS = {
  AGENDADO: 'text-indigo-200',
  REALIZADO: 'text-lime-200',
  EM_SELECAO: 'text-amber-200',
  EM_EDICAO: 'text-sky-200',
  FINALIZADO: 'text-emerald-200',
  CANCELADO: 'text-red-200',
}

const STATUS_ACTIVE_BG = {
  AGENDADO: 'bg-indigo-400/10 border-indigo-400/25',
  REALIZADO: 'bg-lime-400/10 border-lime-400/25',
  EM_SELECAO: 'bg-amber-400/10 border-amber-400/25',
  EM_EDICAO: 'bg-sky-400/10 border-sky-400/25',
  FINALIZADO: 'bg-emerald-400/10 border-emerald-400/25',
  CANCELADO: 'bg-red-400/10 border-red-400/25',
}

export default function StatusSidebar({ ensaio, loading, onStatusChange }) {
  const statusInfo = getStatusInfo(ensaio?.status)

  return (
    <section
      id="status-sidebar"
      className="rounded-2xl border border-[var(--gold-border)] bg-[#121212]"
    >
      <SectionTitle title="Status atual" />

      <div className="p-5">
        <span
          className={`mb-4 inline-flex rounded-full border px-3 py-1 text-[11px] ${statusInfo.chipClass}`}
        >
          {statusInfo.label}
        </span>

        <div className="space-y-2">
          {STATUS_OPTIONS.map((status) => {
            const active = ensaio.status === status.value
            const dotColor = STATUS_DOT_COLORS[status.value] || 'bg-white/40'
            const textColor = STATUS_TEXT_COLORS[status.value] || 'text-white/70'
            const activeBg = STATUS_ACTIVE_BG[status.value] || 'bg-white/[0.04] border-white/[0.10]'

            return (
              <button
                key={status.value}
                type="button"
                disabled={loading}
                onClick={() => onStatusChange(status.value)}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-[13px] transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  active
                    ? `${activeBg} ${textColor}`
                    : 'border-transparent text-white/65 hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
                  <span className={active ? textColor : 'text-white/70'}>
                    {status.label}
                  </span>
                </span>

                {active && (
                  <span className={textColor}>
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}