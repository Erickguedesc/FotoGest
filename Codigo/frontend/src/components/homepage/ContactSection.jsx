import { useState } from 'react'

const WHATSAPP_NUMBER = '553199646207' // ← Número real

export default function ContactSection() {
  const [form, setForm] = useState({
    nome: '',
    whatsapp: '',
    tipoEnsaio: '',
    data: '',
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const dataFormatada = form.data.split('-').reverse().join('/')

    const mensagem =
      `Olá! Gostaria de um orçamento:\n` +
      `*Nome:* ${form.nome}\n` +
      `*WhatsApp:* ${form.whatsapp}\n` +
      `*Tipo de Ensaio:* ${form.tipoEnsaio}\n` +
      `*Previsão de Data:* ${dataFormatada}`

    const encoded = encodeURIComponent(mensagem)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
  }

  const inputClass =
    'w-full bg-white/[0.03] border border-white/10 rounded-[10px] px-4 py-[14px] text-white font-sans text-sm transition-all duration-200 outline-none focus:border-[var(--gold)] focus:bg-[rgba(201,164,89,0.05)] placeholder:text-[var(--text-muted)]'

  return (
    <section
      id="contato"
      className="min-h-[80vh] px-[10%] py-28 flex items-center justify-center"
    >
      <div className="w-full max-w-[500px] bg-[var(--card)] border border-white/10 rounded-3xl px-10 py-14 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 border"
            style={{
              background: 'var(--gold-dim)',
              borderColor: 'rgba(201,164,89,0.3)',
              color: 'var(--gold)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>

          <h2 className="font-serif text-[32px] font-light tracking-[0.02em] mb-2">
            Solicite um orçamento
          </h2>
          <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
            Dê o primeiro passo para eternizar seus momentos.
            <br />
            Retornaremos no WhatsApp em até 24h.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.12em] text-[var(--gold)] mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Como podemos te chamar?"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.12em] text-[var(--gold)] mb-2">
              WhatsApp para contato
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.12em] text-[var(--gold)] mb-2">
              Tipo de Ensaio
            </label>
            <select
              name="tipoEnsaio"
              value={form.tipoEnsaio}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="" disabled>
                Selecione uma opção
              </option>
              <option>Newborn (Recém-nascido)</option>
              <option>Gestante</option>
              <option>Família</option>
              <option>Corporativo / Retrato</option>
              <option>Casal</option>
              <option>Feminino</option>
              <option>Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.12em] text-[var(--gold)] mb-2">
              Data Desejada (Previsão)
            </label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-4 bg-[var(--gold)] text-[#1A1200] border-none rounded-xl font-semibold text-[13px] uppercase tracking-[0.08em] cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 hover:bg-[#E2C07A] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
          >
            Enviar Solicitação
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>

        <p className="text-center mt-6 text-[11px] text-[var(--text-muted)]">
          Ao enviar, o WhatsApp será aberto com as informações preenchidas.
        </p>
      </div>
    </section>
  )
}