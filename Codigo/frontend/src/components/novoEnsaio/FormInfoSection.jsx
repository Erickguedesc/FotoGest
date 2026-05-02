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

// ── Ícone de seção reutilizável ──────────────────────────────────────────────
function SectionHeader({ icon, label }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.07]">
      <div className="w-7 h-7 rounded-lg bg-[var(--gold-dim)] border border-[var(--gold-border)] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="text-[11px] tracking-[0.16em] uppercase text-white/80">
        {label}
      </span>
    </div>
  )
}

export default function FormInfoSection({ form, errors, onChange }) {
  const set = (field, value) => onChange(field, value)

  return (
    <>
      {/* ── CARD 1: Dados do cliente ───────────────────────────────────────── */}
      <div className="bg-[#171717] border border-white/[0.07] rounded-[14px] overflow-hidden mb-4">

        <SectionHeader
          label="Dados do cliente"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />

        <div className="flex flex-col gap-4 p-5">

          {/* Nome — obrigatório */}
          <FormInput label="Nome completo" required error={errors.cliente}>
            <input
              type="text"
              placeholder="Ex: Ana Clara Mendes"
              value={form.cliente}
              onChange={(e) => set('cliente', e.target.value)}
              className={`${inputClass} ${errors.cliente ? errorInputClass : ''}`}
            />
          </FormInput>

          {/* Telefone + Email */}
          <div className="grid grid-cols-2 gap-3.5">
            <FormInput label="Telefone" error={errors.telefone}>
              <input
                type="tel"
                placeholder="(31) 99999-0000"
                value={form.telefone}
                onChange={(e) => set('telefone', e.target.value)}
                className={`${inputClass} ${errors.telefone ? errorInputClass : ''}`}
              />
            </FormInput>

            <FormInput label="E-mail" error={errors.email}>
              <input
                type="email"
                placeholder="ana@email.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className={`${inputClass} ${errors.email ? errorInputClass : ''}`}
              />
            </FormInput>
          </div>

          {/* CPF + Cidade */}
          <div className="grid grid-cols-2 gap-3.5">
            <FormInput label="CPF" error={errors.cpf}>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={form.cpf}
                maxLength={14}
                onChange={(e) => {
                  // Máscara automática de CPF
                  const v = e.target.value
                    .replace(/\D/g, '')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                  set('cpf', v)
                }}
                className={`${inputClass} ${errors.cpf ? errorInputClass : ''}`}
              />
            </FormInput>

            <FormInput label="Cidade" error={errors.cidade}>
              <input
                type="text"
                placeholder="Belo Horizonte, MG"
                value={form.cidade}
                onChange={(e) => set('cidade', e.target.value)}
                className={`${inputClass} ${errors.cidade ? errorInputClass : ''}`}
              />
            </FormInput>
          </div>

          {/* Indicação */}
          <FormInput label="Como nos conheceu?">
            <div className="relative">
              <select
                value={form.indicacao}
                onChange={(e) => set('indicacao', e.target.value)}
                className={`${inputClass} appearance-none pr-9 cursor-pointer`}
              >
                <option value="">Selecionar (opcional)</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Google">Google</option>
                <option value="Indicação">Indicação de amigo/familiar</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Outro">Outro</option>
              </select>
              <svg
                width="11" height="11" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none text-white"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </FormInput>

        </div>
      </div>

      {/* ── CARD 2: Informações do ensaio ─────────────────────────────────── */}
      <div className="bg-[#171717] border border-white/[0.07] rounded-[14px] overflow-hidden mb-4">

        <SectionHeader
          label="Informações do ensaio"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          }
        />

        <div className="flex flex-col gap-4 p-5">

          {/* Tipo de ensaio */}
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
              <p className="text-[11.5px] text-[#C97B7B] mt-1">{errors.tipo}</p>
            )}
          </div>

          {/* Data + Horário */}
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

          {/* Local */}
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
    </>
  )
}