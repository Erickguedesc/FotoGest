export default function SectionTitle({ title, actionLabel, rightText, onAction }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--gold-border)] px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[11px] text-[var(--gold)]">
          ○
        </span>

        <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
          {title}
        </h2>
      </div>

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-md border border-white/[0.10] px-3 py-1.5 text-[11px] text-white/50 transition hover:border-[var(--gold-border)] hover:text-[var(--gold)]"
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