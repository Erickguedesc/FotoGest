import { useNavigate } from 'react-router-dom'

const STEP_LABELS = ['Dados', 'Obs.', 'Pacote', 'Pronto']
const STEP_HINTS = [
  'Preencha as informações do ensaio',
  'Adicione observações se necessário',
  'Defina o pacote e valor',
  'Formulário completo — pronto para salvar!',
]

const fmtDate = (d) => {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

const fmtMoney = (v) =>
  v ? `R$ ${parseInt(v).toLocaleString('pt-BR')}` : 'R$ —'

export default function ResumeSidebar({ form, loading }) {
  const navigate = useNavigate()

  const s1Done = !!(form.cliente && form.tipo && form.data && form.hora && form.local)
  const s3Done = !!(form.valor && form.fotos)
  const step = s1Done && s3Done ? 3 : s1Done ? 2 : 0

  const tipoLabel = form.tipo === 'Outro' ? form.tipoCustom || '—' : form.tipo || '—'

  const resumeRows = [
    { key: 'Cliente', val: form.cliente || '—' },
    { key: 'Tipo',    val: tipoLabel },
    { key: 'Data',    val: fmtDate(form.data) },
    { key: 'Horário', val: form.hora || '—' },
    { key: 'Local',   val: form.local || '—' },
  ]

  return (
    <div className="flex flex-col gap-4 sticky top-20">

      {/* Stepper */}
      <div className="bg-[#171717] border border-white/[0.07] rounded-[14px] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.07]">
          <span className="text-[10.5px] tracking-[0.16em] uppercase text-white/45">
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
                          : 'bg-transparent border-white/[0.12]'}
                    `}
                  />
                  <span
                    className={`
                      text-[9.5px] tracking-[0.06em] mt-1.5 text-center whitespace-nowrap
                      ${i === step ? 'text-[var(--gold)]' : 'text-white/35'}
                    `}
                  >
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-px mx-0.5 mb-3.5 transition-colors duration-300
                      ${i < step ? 'bg-[rgba(126,184,154,0.4)]' : 'bg-white/[0.07]'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-[12px] text-white/35 text-center">{STEP_HINTS[step]}</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-[#171717] border border-white/[0.07] rounded-[14px] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.07]">
          <span className="text-[10.5px] tracking-[0.16em] uppercase text-white/45">
            Resumo
          </span>
        </div>
        <div className="px-5 py-4 flex flex-col">
          {resumeRows.map(({ key, val }) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-white/[0.07]">
              <span className="text-[12px] text-white/45">{key}</span>
              <span className="text-[13px] text-white text-right max-w-[160px] break-words">{val}</span>
            </div>
          ))}

          <div className="h-px bg-white/[0.07] my-1" />

          <div className="flex justify-between items-center py-2 border-b border-white/[0.07]">
            <span className="text-[12px] text-white/45">Fotos incluídas</span>
            <span className="text-[13px] text-white">{form.fotos || '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/[0.07]">
            <span className="text-[12px] text-white/45">Foto extra</span>
            <span className="text-[13px] text-white">
              {form.extraAtivo && form.extra
                ? `R$ ${parseInt(form.extra).toLocaleString('pt-BR')} / foto`
                : '—'}
            </span>
          </div>

          <div className="h-px bg-white/[0.07] my-1" />

          <div className="flex justify-between items-center py-2">
            <span className="text-[12px] text-white/45">Valor total</span>
            <span className="font-serif text-[18px] font-light text-[var(--gold)]">
              {fmtMoney(form.valor)}
            </span>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => navigate('/ensaios')}
          className="
            flex-1 py-3.5 bg-transparent
            border border-white/[0.11] rounded-[9px]
            text-[12.5px] tracking-[0.08em] text-white/80
            cursor-pointer transition-all duration-200
            hover:border-white/25 hover:text-white
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