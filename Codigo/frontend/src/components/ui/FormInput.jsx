export default function FormInput({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10.5px] tracking-[0.13em] uppercase text-[var(--text-muted)]">
        {label}
        {required && <span className="text-[var(--gold)] ml-0.5">*</span>}
      </label>

      {children}

      {error && (
        <p className="flex items-center gap-1.5 text-[11.5px] text-[#C97B7B]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}