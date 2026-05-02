import FormInput from '../ui/FormInput'

const TIPOS = [
  'Newborn', 'Gestante', 'Família', 'Infantil',
  'Feminino', 'Casal', 'Book', 'Batizado', 'Externo', 'Outro',
]

const inputClass = `
  w-full bg-white/[0.025] border border-white/[0.11] rounded-[9px]
  px-3.5 py-[11px] text-[13.5px] font-light text-white
  outline-none transition-all duration-200
  focus:border-[var(--gold-border)] focus:bg-[var(--gold-dim)]
  placeholder:text-white/20
`

const errorInputClass = 'border-[rgba(201,123,123,0.5)] bg-[rgba(201,123,123,0.07)]'

export default function FormInfoSection({ form, errors, onChange }) {
  const set = (field, value) => onChange(field, value)

  return (
    <div className="bg-[#171717] border border-white/[0.07] rounded-[14px] overflow-hidden mb-4">

      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.07]">
        <div className="w-7 h-7 rounded-lg bg-[var(--gold-dim)] border border-[var(--gold-border)] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <span className="text-[11px] tracking-[0.16em] uppercase text-white/80">
          Informações do ensaio
        </span>
      </div>

      <div className="flex flex-col gap-4 p-5">

        <FormInput label="Nome do cliente" required error={errors.cliente}>
          <input
            type="text"
            placeholder="Ex: Ana Clara Mendes"
            value={form.cliente}
            onChange={(e) => set('cliente', e.target.value)}
            className={`${inputClass} ${errors.cliente ? errorInputClass : ''}`}
          />
        </FormInput>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10.5px] tracking-[0.13em] uppercase text-[var(--text-muted)]">
            Tipo de ensaio
            <span className="text-[var(--gold)] ml-0.5">*</span>
          </label>

          <div className="flex flex-wrap gap-2">
            {TIPOS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  set('tipo', t)
                  if (t !== 'Outro') set('tipoCustom', '')
                }}
                className={`
                  px-3.5 py-1.5 rounded-full text-[12px] tracking-[0.04em]
                  border transition-all duration-200 cursor-pointer font-light
                  ${form.tipo === t
                    ? 'bg-[var(--gold-dim)] border-[var(--gold-border)] text-[var(--gold)]'
                    : 'bg-transparent border-white/[0.11] text-white/70 hover:border-[var(--gold-border)] hover:text-white'}
                `}
              >
                {t}
              </button>
            ))}
          </div>

          {form.tipo === 'Outro' && (
            <input
              type="text"
              placeholder="Qual o tipo do ensaio?"
              value={form.tipoCustom}
              onChange={(e) => set('tipoCustom', e.target.value)}
              className={`${inputClass} mt-2`}
            />
          )}

          {errors.tipo && (
            <p className="text-[11.5px] text-[#C97B7B]">{errors.tipo}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <FormInput label="Data" required error={errors.data}>
            <input
              type="date"
              value={form.data}
              onChange={(e) => set('data', e.target.value)}
              className={`${inputClass} ${errors.data ? errorInputClass : ''}`}
            />
          </FormInput>

          <FormInput label="Horário" required error={errors.hora}>
            <input
              type="time"
              value={form.hora}
              onChange={(e) => set('hora', e.target.value)}
              className={`${inputClass} ${errors.hora ? errorInputClass : ''}`}
            />
          </FormInput>
        </div>

        <FormInput label="Local" required error={errors.local}>
          <div className="relative">
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.8"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-35 pointer-events-none text-white"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <input
              type="text"
              placeholder="Ex: Studio Olhari, BH"
              value={form.local}
              onChange={(e) => set('local', e.target.value)}
              className={`${inputClass} pl-10 ${errors.local ? errorInputClass : ''}`}
            />
          </div>
        </FormInput>

      </div>
    </div>
  )
}