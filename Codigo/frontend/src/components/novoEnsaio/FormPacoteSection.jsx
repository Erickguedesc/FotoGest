import FormInput from '../ui/FormInput'

const inputClass = `
  theme-input w-full border
  px-3.5 py-[11px] text-[13.5px] font-light
  outline-none transition-all duration-200
  focus:border-[var(--gold-border)] focus:bg-[var(--gold-dim)]
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

export default function FormPacoteSection({ form, errors, onChange }) {
  const set = (field, value) => onChange(field, value)

  const stepFotos = (delta) =>
    set('fotos', Math.max(1, parseInt(form.fotos || 0) + delta))

  return (
    <div className="theme-card mb-4 overflow-hidden rounded-[14px] border">

      <div className="theme-divider flex items-center gap-2.5 border-b px-5 py-4">
        <div className="w-7 h-7 rounded-lg bg-[var(--gold-dim)] border border-[var(--gold-border)] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <span className="theme-text text-[11px] uppercase tracking-[0.16em]">
          Pacote
        </span>
      </div>

      <div className="p-5 flex flex-col gap-4">

        <div className="grid grid-cols-2 gap-3.5">

          {/* Nº de fotos */}
          <FormInput label="Nº de fotos incluídas" required error={errors.fotos}>
            <div className="theme-input flex h-[42px] items-center overflow-hidden rounded-[9px] border">
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
              <span className="theme-muted pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px]">
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
        </div>

        {/* Toggle foto extra */}
        <div className="theme-divider flex items-center justify-between border-b py-3">
          <span className="theme-text text-[13px]">Cobrar foto extra avulsa?</span>
          <button
            type="button"
            onClick={() => set('extraAtivo', !form.extraAtivo)}
            className={`
              relative w-[38px] h-5 rounded-full cursor-pointer
              border transition-all duration-300
              ${form.extraAtivo
                ? 'bg-[var(--gold-dim)] border-[var(--gold-border)]'
                : 'bg-[var(--input-bg)] border-[var(--input-border)]'}
            `}
          >
            <span
              className={`
                absolute top-[3px] w-3.5 h-3.5 rounded-full
                transition-all duration-300
                ${form.extraAtivo
                  ? 'left-[21px] bg-[var(--gold)]'
                  : 'left-[3px] bg-[var(--text-muted)]'}
              `}
            />
          </button>
        </div>

        {/* Campo valor extra (condicional) */}
        {form.extraAtivo && (
          <FormInput label="Valor por foto extra (R$)">
            <div className="relative">
              <span className="theme-muted pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px]">
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={form.extra}
                onChange={(e) => set('extra', formatCurrencyInput(e.target.value))}
                className={`${inputClass} pl-10 rounded-[9px]`}
              />
            </div>
          </FormInput>
        )}

      </div>
    </div>
  )
}
