export default function FormObsSection({ form, onChange, onSectionFocus }) {
  return (
    <div
      className="theme-card mb-4 overflow-hidden rounded-[14px] border"
      onPointerDownCapture={() => onSectionFocus?.('ensaio')}
      onFocusCapture={() => onSectionFocus?.('ensaio')}
    >

      <div className="theme-divider flex items-center gap-2.5 border-b px-5 py-4">
        <div className="w-7 h-7 rounded-lg bg-[var(--gold-dim)] border border-[var(--gold-border)] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <span className="theme-text text-[11px] uppercase tracking-[0.16em]">
          Observações
        </span>
      </div>

      <div className="p-5">
        <label className="block text-[10.5px] tracking-[0.13em] uppercase text-[var(--text-muted)] mb-1.5">
          Detalhes e instruções
        </label>

        <textarea
          placeholder="Ex: Bebê de 12 dias. Usar props florais. Cliente prefere tons neutros..."
          maxLength={400}
          value={form.obs}
          onChange={(e) => onChange('obs', e.target.value)}
          className="
            theme-input w-full rounded-[9px] border
            px-3.5 py-[11px] text-[13.5px] font-light
            outline-none transition-all duration-200 resize-y min-h-[108px] leading-relaxed
            focus:border-[var(--gold-border)] focus:bg-[var(--gold-dim)]
          "
        />

        <p className={`mt-1.5 text-right text-[11px] ${form.obs.length > 350 ? 'text-[var(--gold)]' : 'theme-muted'}`}>
          {form.obs.length} / 400
        </p>
      </div>
    </div>
  )
}
