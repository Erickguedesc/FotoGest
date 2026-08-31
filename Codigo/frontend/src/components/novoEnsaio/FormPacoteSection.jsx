import FormInput from '../ui/FormInput'

const inputClass = `
  w-full border border-[var(--border)] bg-white/64
  px-3.5 py-[11px] text-[13.5px] font-light
  text-[var(--text)] outline-none transition-all duration-200
  placeholder:text-[var(--text-muted)]
  focus:border-[var(--gold-border)] focus:bg-white
`

const errorInputClass = 'border-[rgba(201,123,123,0.5)] bg-[rgba(201,123,123,0.07)]'

function formatCurrencyInput(value) {
  const cleaned = String(value || '').replace(/[^\d,]/g, '')
  const [inteiro, decimal = ''] = cleaned.split(',')
  const inteiroFormatado = inteiro ? Number(inteiro).toLocaleString('pt-BR') : ''

  if (cleaned.includes(',')) {
    return `${inteiroFormatado},${decimal.slice(0, 2)}`
  }

  return inteiroFormatado
}

export default function FormPacoteSection({ form, errors, onChange, onSectionFocus }) {
  const set = (field, value) => onChange(field, value)

  const stepFotos = (delta) =>
    set('fotos', Math.max(1, parseInt(form.fotos || 0) + delta))

  return (
    <div
      className="mb-4 overflow-hidden rounded-[14px] border border-[var(--border)] bg-white/78 shadow-[0_14px_34px_rgba(78,56,35,0.07)]"
      onPointerDownCapture={() => onSectionFocus?.('pacote')}
      onFocusCapture={() => onSectionFocus?.('pacote')}
    >

      <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <span className="text-[15px] font-medium text-[var(--text)]">
          Pacote
        </span>
      </div>

      <div className="p-5 flex flex-col gap-4">

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px] items-end gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">

          {/* Nº de fotos */}
          <FormInput label="Nº de fotos incluídas" required error={errors.fotos}>
            <div className="flex h-[42px] items-center overflow-hidden rounded-[9px] border border-[var(--border)] bg-white/64">
              <button
                type="button"
                onClick={() => stepFotos(-5)}
                className="
                  h-full w-9 flex-shrink-0 cursor-pointer
                  flex items-center justify-center text-lg text-[var(--text-muted)]
                  hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]
                  transition-all duration-200
                "
              >
                −
              </button>
              <input
                type="number"
                value={form.fotos}
                min={1}
                onChange={(e) => set('fotos', e.target.value)}
                className="h-full min-w-0 flex-1 border-0 bg-transparent px-3.5 text-center text-[13.5px] font-light text-[var(--text)] outline-none"
              />
              <button
                type="button"
                onClick={() => stepFotos(5)}
                className="
                  h-full w-9 flex-shrink-0 cursor-pointer
                  flex items-center justify-center text-lg text-[var(--text-muted)]
                  hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]
                  transition-all duration-200
                "
              >
                +
              </button>
            </div>
          </FormInput>

          {/* Valor do pacote */}
          <FormInput label="Valor do pacote (R$)" required error={errors.valor}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[var(--text-muted)]">
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={form.valor}
                onChange={(e) => set('valor', formatCurrencyInput(e.target.value))}
                className={`${inputClass} pl-10 rounded-[9px] ${errors.valor ? errorInputClass : ''}`}
              />
            </div>
          </FormInput>

          {/* Toggle foto extra */}
          <div className="rounded-[10px] border border-[var(--border)] bg-white/50 px-3.5 py-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] text-[var(--text)]">Cobrar foto extra?</span>
              <button
                type="button"
                aria-pressed={form.extraAtivo}
                onClick={() => set('extraAtivo', !form.extraAtivo)}
                className={`
                  relative h-6 w-11 rounded-full cursor-pointer
                  border transition-all duration-300
                  ${form.extraAtivo
                    ? 'bg-[var(--gold)] border-[var(--gold-border)]'
                    : 'bg-[#ddd4c7] border-[var(--border)]'}
                `}
              >
                <span
                  className={`
                    absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm
                    transition-all duration-300
                    ${form.extraAtivo ? 'left-[23px]' : 'left-[3px]'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Campo valor extra (condicional) */}
        {form.extraAtivo && (
          <div className="max-w-[360px]">
            <FormInput label="Valor por foto extra (R$)" error={errors.extra}>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[var(--text-muted)]">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={form.extra}
                  onChange={(e) => set('extra', formatCurrencyInput(e.target.value))}
                  className={`${inputClass} pl-10 rounded-[9px] ${errors.extra ? errorInputClass : ''}`}
                />
              </div>
            </FormInput>
          </div>
        )}

      </div>
    </div>
  )
}
