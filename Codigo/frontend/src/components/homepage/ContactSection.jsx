import { useState } from 'react'

import { solicitacoesService } from '../../services/solicitacoesService'
import EditableButton from './EditableButton'

export default function ContactSection({ config, onEdit }) {
  const whatsappNumber = config?.whatsappNumero || '553199646207'
  const contactTextLines = (config?.contatoTexto || '').split('\n')
  const [form, setForm] = useState({
    nome: '',
    whatsapp: '',
    tipoEnsaio: '',
    data: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFeedback(null)

    try {
      await solicitacoesService.criar({
        nomeCliente: form.nome,
        whatsapp: form.whatsapp,
        tipoEnsaio: form.tipoEnsaio,
        dataDesejada: form.data || null,
      })

      const dataFormatada = form.data ? form.data.split('-').reverse().join('/') : 'Não informada'

      const mensagem =
        `Olá! Gostaria de um orçamento:\n` +
        `*Nome:* ${form.nome}\n` +
        `*WhatsApp:* ${form.whatsapp}\n` +
        `*Tipo de Ensaio:* ${form.tipoEnsaio}\n` +
        `*Previsão de Data:* ${dataFormatada}`

      const encoded = encodeURIComponent(mensagem)
      window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank')
      setFeedback({
        type: 'success',
        message: 'Solicitação enviada com sucesso. Abrimos o WhatsApp para continuar o atendimento.',
      })
      setForm({ nome: '', whatsapp: '', tipoEnsaio: '', data: '' })
    } catch (error) {
      console.error('[Solicitação] Erro ao enviar:', error?.response?.data || error)
      setFeedback({ type: 'error', message: 'Não foi possível enviar sua solicitação. Tente novamente.' })
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full bg-white/[0.03] border border-white/10 rounded-[10px] px-4 py-[14px] text-white font-sans text-sm transition-all duration-200 outline-none focus:border-[var(--gold)] focus:bg-[rgba(201,164,89,0.05)] placeholder:text-[var(--text-muted)] disabled:opacity-60 disabled:cursor-not-allowed'

  return (
    <section
      id="contato"
      className="relative min-h-[80vh] px-[10%] py-28 flex items-center justify-center"
    >
      <EditableButton onClick={onEdit} className="absolute right-[10%] top-8 z-10" />

      <div className="w-full max-w-[500px] bg-[var(--card)] border border-white/10 rounded-3xl px-10 py-14 relative">
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
            {config?.contatoTitulo}
          </h2>
          <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
            {contactTextLines.map((line, index) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < contactTextLines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        {feedback && (
          <div
            className={`mb-5 rounded-xl border px-4 py-3 text-[13px] leading-relaxed ${
              feedback.type === 'success'
                ? 'border-[#34D399]/30 bg-[#34D399]/10 text-[#34D399]'
                : 'border-[#FB7185]/30 bg-[#FB7185]/10 text-[#FB7185]'
            }`}
          >
            {feedback.message}
          </div>
        )}

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
              disabled={submitting}
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
              disabled={submitting}
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
              disabled={submitting}
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
              disabled={submitting}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-4 bg-[var(--gold)] text-[#1A1200] border-none rounded-xl font-semibold text-[13px] uppercase tracking-[0.08em] cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 hover:bg-[#E2C07A] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? 'Enviando...' : 'Enviar Solicitação'}
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
          Ao enviar, salvamos sua solicitação e abrimos o WhatsApp com as informações preenchidas.
        </p>
      </div>
    </section>
  )
}
