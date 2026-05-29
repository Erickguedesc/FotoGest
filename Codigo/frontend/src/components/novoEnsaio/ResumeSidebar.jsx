import { useNavigate } from 'react-router-dom'

const STEP_LABELS = ['Cliente', 'Ensaio', 'Pacote', 'Pronto']
const STEP_HINTS = [
  'Preencha os dados do cliente e ensaio',
  'Preencha as informações do ensaio',
  'Defina o pacote e valor',
  'Formulário completo — pronto para salvar!',
]

const fmtDate = (d) => {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

const fmtMoney = (v) =>
  v ? `R$ ${String(v)}` : 'R$ —'

export default function ResumeSidebar({ form, loading }) {
  const navigate = useNavigate()

  // ── Progresso ──────────────────────────────────────────────────────────────
  // Step 0 → nenhum dado
  // Step 1 → cliente preenchido
  // Step 2 → ensaio preenchido
  // Step 3 → pacote preenchido (pronto)
  const clienteDone = form.cliente.trim().length >= 3
  const ensaioDone  = !!(form.tipo && form.data && form.hora && form.local)
  const pacoteDone  = !!(form.valor && form.fotos)

  const step = clienteDone && ensaioDone && pacoteDone ? 3
             : clienteDone && ensaioDone               ? 2
             : clienteDone                             ? 1
             : 0

  const tipoLabel = form.tipo === 'Outro' ? form.tipoCustom || '—' : form.tipo || '—'

  // ── Linhas do resumo ───────────────────────────────────────────────────────
  const clienteRows = [
    { key: 'Nome',     val: form.cliente   || '—' },
    { key: 'Telefone', val: form.telefone  || '—' },
    { key: 'E-mail',   val: form.email     || '—' },
    { key: 'Cidade',   val: form.cidade    || '—' },
  ]

  const ensaioRows = [
    { key: 'Tipo',    val: tipoLabel },
    { key: 'Data',    val: fmtDate(form.data) },
    { key: 'Horário', val: form.hora  || '—' },
    { key: 'Local',   val: form.local || '—' },
  ]

  return (
    <div className="sticky top-20 flex flex-col gap-4">

      {/* ── Stepper ─────────────────────────────────────────────────────────── */}
      <div className="theme-card overflow-hidden rounded-[14px] border">
        <div className="theme-divider border-b px-5 py-3.5">
          <span className="theme-muted text-[10.5px] uppercase tracking-[0.16em]">
            Progresso do formulário
          </span>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-start mb-3">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-2 h-2 rounded-full border-[1.5px] transition-all duration-300
                      ${i < step
                        ? 'bg-[#7EB89A] border-[#7EB89A]'
                        : i === step
                          ? 'bg-[var(--gold)] border-[var(--gold)] shadow-[0_0_0_3px_rgba(201,164,89,0.18)]'
                          : 'bg-transparent border-[var(--border)]'}
                    `}
                  />
                  <span
                    className={`
                      text-[9.5px] tracking-[0.06em] mt-1.5 text-center whitespace-nowrap
                      ${i === step ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'}
                    `}
                  >
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-px mx-0.5 mb-3.5 transition-colors duration-300
                      ${i < step ? 'bg-[rgba(126,184,154,0.4)]' : 'bg-[var(--border)]'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="theme-muted text-center text-[12px]">{STEP_HINTS[step]}</p>
        </div>
      </div>

      {/* ── Resumo do cliente ────────────────────────────────────────────────── */}
      <div className="theme-card overflow-hidden rounded-[14px] border">
        <div className="theme-divider flex items-center gap-2 border-b px-5 py-3.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span className="theme-muted text-[10.5px] uppercase tracking-[0.16em]">
            Cliente
          </span>
        </div>
        <div className="px-5 py-4 flex flex-col">
          {clienteRows.map(({ key, val }) => (
            <div key={key} className="theme-divider flex items-center justify-between border-b py-2 last:border-0">
              <span className="theme-muted flex-shrink-0 text-[12px]">{key}</span>
              <span className="theme-title max-w-[160px] truncate break-words text-right text-[13px]">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Resumo do ensaio ─────────────────────────────────────────────────── */}
      <div className="theme-card overflow-hidden rounded-[14px] border">
        <div className="theme-divider flex items-center gap-2 border-b px-5 py-3.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C9A459" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span className="theme-muted text-[10.5px] uppercase tracking-[0.16em]">
            Ensaio
          </span>
        </div>
        <div className="px-5 py-4 flex flex-col">
          {ensaioRows.map(({ key, val }) => (
            <div key={key} className="theme-divider flex items-center justify-between border-b py-2">
              <span className="theme-muted text-[12px]">{key}</span>
              <span className="theme-title max-w-[160px] break-words text-right text-[13px]">{val}</span>
            </div>
          ))}

          <div className="my-1 h-px bg-[var(--border)]" />

          <div className="theme-divider flex items-center justify-between border-b py-2">
            <span className="text-[12px] text-white/45">Fotos incluídas</span>
            <span className="text-[13px] text-white">{form.fotos || '—'}</span>
          </div>

          <div className="theme-divider flex items-center justify-between border-b py-2">
            <span className="text-[12px] text-white/45">Foto extra</span>
            <span className="text-[13px] text-white">
              {form.extraAtivo && form.extra
                ? `R$ ${form.extra} / foto`
                : '—'}
            </span>
          </div>

          <div className="my-1 h-px bg-[var(--border)]" />

          <div className="flex items-center justify-between py-2">
            <span className="text-[12px] text-white/45">Valor total</span>
            <span className="font-serif text-[18px] font-light text-[var(--gold)]">
              {fmtMoney(form.valor)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Botões ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => navigate('/ensaios')}
          className="
            flex-1 py-3.5 bg-transparent
            border border-[var(--border)] rounded-[9px]
            text-[12.5px] tracking-[0.08em] text-[var(--text-muted)]
            cursor-pointer transition-all duration-200
            hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--text)]
          "
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            flex-[2] py-3.5 flex items-center justify-center gap-2
            bg-[var(--gold)] border-none rounded-[9px]
            text-[12.5px] font-medium tracking-[0.12em] text-[#1A1200]
            cursor-pointer transition-all duration-200
            hover:bg-[var(--gold-light)] hover:-translate-y-px
            disabled:opacity-75 disabled:cursor-not-allowed disabled:translate-y-0
          "
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[rgba(26,18,0,0.3)] border-t-[#1A1200] animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Salvar ensaio
            </>
          )}
        </button>
      </div>

    </div>
  )
}
