export default function SectionTitle({
  title,
  actionLabel,
  rightText,
  icon: Icon,
  onAction,
  compact = false,
}) {
  return (
    <div className={`flex items-center justify-between border-b border-[var(--border)] ${compact ? 'px-4 py-3' : 'px-5 py-4'}`}>
      <div className="flex items-center gap-3">
        <span className={`flex items-center justify-center rounded-[8px] border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[11px] text-[var(--gold)] ${compact ? 'h-6 w-6' : 'h-7 w-7'}`}>
          {Icon ? <Icon size={compact ? 13 : 15} strokeWidth={1.8} /> : '○'}
        </span>

        <h2 className={`${compact ? 'text-[14px]' : 'text-[15px]'} font-semibold text-[var(--text)]`}>
          {title}
        </h2>
      </div>

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className={`rounded-[8px] border border-[var(--border)] bg-white/55 text-[12px] font-medium text-[var(--text)] transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)] ${compact ? 'px-3 py-1.5' : 'px-4 py-2'}`}
        >
          {actionLabel}
        </button>
      )}

      {rightText && (
        <span className="text-[11px] text-[var(--gold)]">
          {rightText}
        </span>
      )}
    </div>
  )
}
