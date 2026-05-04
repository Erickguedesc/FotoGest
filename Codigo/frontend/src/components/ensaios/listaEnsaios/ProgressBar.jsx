export default function ProgressBar({ value = 0, compact = false }) {
  const safeValue = Math.max(0, Math.min(100, Number(value || 0)))
  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
      <div className={`${compact ? 'w-[90px]' : 'w-full'} h-[3px] overflow-hidden rounded-full bg-white/[0.06]`}>
        <div className="h-full rounded-full bg-[var(--gold)] transition-all" style={{ width: `${safeValue}%` }} />
      </div>
      <span className="text-[11px] text-white/35">{safeValue}%</span>
    </div>
  )
}
