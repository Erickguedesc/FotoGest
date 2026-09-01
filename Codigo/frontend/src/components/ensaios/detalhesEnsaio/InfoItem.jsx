export default function InfoItem({ label, value, highlight, compact = false }) {
  return (
    <div className={`border-b border-[var(--border)] ${compact ? 'pb-2.5' : 'pb-4'}`}>
      <p className={`${compact ? 'mb-1 text-[10.5px]' : 'mb-2 text-[11px]'} text-[var(--text-muted)]`}>
        {label}
      </p>

      <p
        className={
          highlight
            ? `${compact ? 'text-[13px]' : 'text-[14px]'} text-[var(--gold)]`
            : `${compact ? 'text-[13px]' : 'text-[14px]'} text-[var(--text)]`
        }
      >
        {value}
      </p>
    </div>
  )
}
