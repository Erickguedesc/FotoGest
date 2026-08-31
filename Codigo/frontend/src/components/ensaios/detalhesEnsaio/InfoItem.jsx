export default function InfoItem({ label, value, highlight }) {
  return (
    <div className="border-b border-[var(--border)] pb-4">
      <p className="mb-2 text-[11px] text-[var(--text-muted)]">
        {label}
      </p>

      <p
        className={
          highlight
            ? 'text-[14px] text-[var(--gold)]'
            : 'text-[14px] text-[var(--text)]'
        }
      >
        {value}
      </p>
    </div>
  )
}
