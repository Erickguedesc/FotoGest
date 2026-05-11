export default function InfoItem({ label, value, highlight }) {
  return (
    <div className="border-b border-[var(--gold-border)] pb-4">
      <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p
        className={
          highlight
            ? 'text-[14px] text-[var(--gold)]'
            : 'text-[14px] text-white/80'
        }
      >
        {value}
      </p>
    </div>
  )
}