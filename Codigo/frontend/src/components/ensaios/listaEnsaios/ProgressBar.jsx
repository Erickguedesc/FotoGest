import { getEnsaioProgress, getStatusInfo } from './ensaioHelpers'

export default function ProgressBar({ value, status, ensaio, compact = false }) {
  const safeValue = ensaio ? getEnsaioProgress(ensaio) : getEnsaioProgress({ status, progresso: value })
  const color = getStatusInfo(ensaio?.status || status).progressColor

  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
      <div className={`${compact ? 'w-[90px]' : 'w-full'} h-[3px] overflow-hidden rounded-full bg-[rgba(92,82,72,0.16)]`}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${safeValue}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[11px] text-[var(--text-muted)]">{safeValue}%</span>
    </div>
  )
}
