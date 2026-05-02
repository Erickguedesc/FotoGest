import FormInput from '../ui/FormInput'

const inputClass = `
  w-full bg-white/[0.025] border border-white/[0.11]
  px-3.5 py-[11px] text-[13.5px] font-light text-white
  outline-none transition-all duration-200
  focus:border-[var(--gold-border)] focus:bg-[var(--gold-dim)]
  placeholder:text-white/20
`

const errorInputClass = 'border-[rgba(201,123,123,0.5)] bg-[rgba(201,123,123,0.07)]'

export default function FormPacoteSection({ form, errors, onChange }) {
  const set = (field, value) => onChange(field, value)

  const stepFotos = (delta) =>
    set('fotos', Math.max(1, parseInt(form.fotos || 0) + delta))

  return (
    <div className="bg-[#171717] border border-white/[0.07] rounded-[14px] overflow-hidden mb-4">

      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.07]">
        <div className="w-7 h-7 rounded-lg bg-[var(--gold-dim)] border border-[var(--gold-border)] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <span className="text-[11px] tracking-[0.16em] uppercase text-white/80">
          Pacote
        </span>
      </div>

      <div className="p-5 flex flex-col gap-4">

        <div className="grid grid-cols-2 gap-3.5">

          {/* Nº de fotos */}
          <FormInput label="Nº de fotos incluídas" required error={errors.fotos}>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => stepFotos(-5)}
                className="
                  w-9 h-[42px] flex items-center justify-center flex-shrink-0
                  bg-white/[0.025] border border-white/[0.11] text-white/45
                  rounded-l-[9px] border-r-0 text-lg cursor-pointer
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
                className={`${inputClass} rounded-none border-l-0 border-r-0 text-center`}
              />
              <button
                type="button"
                onClick={() => stepFotos(5)}
                className="
                  w-9 h-[42px] flex items-center justify-center flex-shrink-0
                  bg-white/[0.025] border border-white/[0.11] text-white/45
                  rounded-r-[9px] border-l-0 text-lg cursor-pointer
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
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-white/35 pointer-events-none">
                R$
              </span>
              <input
                type="number"
                placeholder="0"
                min={0}
                step={50}
                value={form.valor}
                onChange={(e) => set('valor', e.target.value)}
                className={`${inputClass} pl-10 rounded-[9px] ${errors.valor ? errorInputClass : ''}`}
              />
            </div>
          </FormInput>
        </div>

        {/* Toggle foto extra */}
        <div className="flex items-center justify-between py-3 border-b border-white/[0.07]">
          <span className="text-[13px] text-white/80">Cobrar foto extra avulsa?</span>
          <button
            type="button"
            onClick={() => set('extraAtivo', !form.extraAtivo)}
            className={`
              relative w-[38px] h-5 rounded-full cursor-pointer
              border transition-all duration-300
              ${form.extraAtivo
                ? 'bg-[var(--gold-dim)] border-[var(--gold-border)]'
                : 'bg-white/[0.08] border-white/[0.11]'}
            `}
          >
            <span
              className={`
                absolute top-[3px] w-3.5 h-3.5 rounded-full
                transition-all duration-300
                ${form.extraAtivo
                  ? 'left-[21px] bg-[var(--gold)]'
                  : 'left-[3px] bg-white/45'}
              `}
            />
          </button>
        </div>

        {/* Campo valor extra (condicional) */}
        {form.extraAtivo && (
          <FormInput label="Valor por foto extra (R$)">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-white/35 pointer-events-none">
                R$
              </span>
              <input
                type="number"
                placeholder="0"
                min={0}
                step={10}
                value={form.extra}
                onChange={(e) => set('extra', e.target.value)}
                className={`${inputClass} pl-10 rounded-[9px]`}
              />
            </div>
          </FormInput>
        )}

      </div>
    </div>
  )
}