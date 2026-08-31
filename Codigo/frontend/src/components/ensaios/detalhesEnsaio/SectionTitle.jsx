export default function SectionTitle({
  title,
  actionLabel,
  rightText,
  icon: Icon,
  onAction,
}) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[11px] text-[var(--gold)]">
          {Icon ? <Icon size={15} strokeWidth={1.8} /> : '○'}
        </span>

        <h2 className="text-[15px] font-semibold text-[var(--text)]">
          {title}
        </h2>
      </div>

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-[8px] border border-[var(--border)] bg-white/55 px-4 py-2 text-[12px] font-medium text-[var(--text)] transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]"
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
