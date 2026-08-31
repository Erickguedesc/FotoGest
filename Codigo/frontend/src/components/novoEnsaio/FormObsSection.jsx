export default function FormObsSection({ form, onChange, onSectionFocus }) {
  return (
    <div
      className="mb-4 overflow-hidden rounded-[14px] border border-[var(--border)] bg-white/78 shadow-[0_14px_34px_rgba(78,56,35,0.07)]"
      onPointerDownCapture={() => onSectionFocus?.('ensaio')}
      onFocusCapture={() => onSectionFocus?.('ensaio')}
    >

      <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <span className="text-[15px] font-medium text-[var(--text)]">
          Detalhes e instruções
        </span>
      </div>

      <div className="p-5">
        <label className="block text-[10.5px] tracking-[0.13em] uppercase text-[var(--text-muted)] mb-1.5">
          Observações / instruções
        </label>

        <textarea
          placeholder="Ex: Bebê de 12 dias. Usar props florais. Cliente prefere tons neutros..."
          maxLength={400}
          value={form.obs}
          onChange={(e) => onChange('obs', e.target.value)}
          className="
            w-full rounded-[9px] border border-[var(--border)] bg-white/64
            px-3.5 py-[11px] text-[13.5px] font-light
            text-[var(--text)] outline-none transition-all duration-200 resize-y min-h-[112px] leading-relaxed
            placeholder:text-[var(--text-muted)]
            focus:border-[var(--gold-border)] focus:bg-white
          "
        />

        <p className={`mt-1.5 text-right text-[11px] ${form.obs.length > 350 ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'}`}>
          {form.obs.length} / 400
        </p>
      </div>
    </div>
  )
}
