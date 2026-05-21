import { useEffect, useState } from 'react'
import BaseModal from './BaseModal'
import { formatDateTimeLocal, TIPO_OPTIONS, toApiDateTime } from './ensaioHelpers'

const inputClass = 'w-full rounded-lg border border-white/[0.10] bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-white outline-none transition placeholder:text-white/25 focus:border-[var(--gold-border)] focus:bg-[rgba(201,164,89,0.03)]'
const labelClass = 'mb-1.5 block text-[10.5px] uppercase tracking-[0.13em] text-white/35'
const sectionTitleClass = 'border-b border-white/[0.08] pb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--gold)]'

const STATUS_VALORES_OPTIONS = [
  { value: 'NAO_INFORMADO', label: 'Não informado' },
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PAGO', label: 'Pago' },
]

export default function EditEnsaioModal({ ensaio, open, loading, onClose, onSave }) {
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (!ensaio) return

    setForm({
      clienteNome: ensaio.clienteNome || '',
      clienteEmail: ensaio.clienteEmail || '',
      clienteTelefone: ensaio.clienteTelefone || '',
      clienteCpf: ensaio.clienteCpf || '',
      clienteCidade: ensaio.clienteCidade || '',
      clienteIndicacao: ensaio.clienteIndicacao || '',

      tipo: ensaio.tipo || 'NEWBORN',
      dataEnsaio: formatDateTimeLocal(ensaio.dataEnsaio),
      local: ensaio.local || '',
      qtdFotosPacote: ensaio.qtdFotosPacote || 1,
      valorPacote: ensaio.valorPacote || '',
      cobrarFotoExtra: Boolean(ensaio.cobrarFotoExtra),
      valorFotoExtra: ensaio.valorFotoExtra ?? '',
      valorFinalEnsaio: ensaio.valorFinalEnsaio ?? '',
      statusValores: ensaio.statusValores || 'NAO_INFORMADO',
      observacaoValores: ensaio.observacaoValores || '',
      observacoes: ensaio.observacoes || '',
    })
  }, [ensaio])

  const change = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const submit = (event) => {
    event.preventDefault()

    if (!form || !ensaio) return

    onSave({
      clienteId: ensaio.clienteId,

      clienteNome: form.clienteNome.trim(),
      clienteEmail: form.clienteEmail.trim() || null,
      clienteTelefone: form.clienteTelefone.trim() || null,
      clienteCpf: form.clienteCpf.trim() || null,
      clienteCidade: form.clienteCidade.trim() || null,
      clienteIndicacao: form.clienteIndicacao.trim() || null,

      tipo: form.tipo,
      dataEnsaio: toApiDateTime(form.dataEnsaio),
      local: form.local.trim(),
      qtdFotosPacote: Number(form.qtdFotosPacote),
      valorPacote: Number(form.valorPacote),
      cobrarFotoExtra: Boolean(form.cobrarFotoExtra),
      valorFotoExtra: form.cobrarFotoExtra ? Number(form.valorFotoExtra || 0) : null,
      valorFinalEnsaio: form.valorFinalEnsaio ? Number(form.valorFinalEnsaio) : null,
      statusValores: form.statusValores || 'NAO_INFORMADO',
      observacaoValores: form.observacaoValores?.trim() || null,
      observacoes: form.observacoes?.trim() || null,
    })
  }

  return (
    <BaseModal
      open={open}
      title="Editar ensaio"
      onClose={onClose}
      footer={(
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-white/[0.10] px-4 py-2.5 text-[12px] tracking-[0.08em] text-white/60 transition hover:text-white disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="edit-ensaio-form"
            disabled={loading}
            className="rounded-lg bg-[var(--gold)] px-5 py-2.5 text-[12px] font-medium tracking-[0.1em] text-[#1A1200] transition hover:bg-[var(--gold-light)] disabled:opacity-60"
          >
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </>
      )}
    >
      {form && (
        <form id="edit-ensaio-form" onSubmit={submit} className="space-y-5">
          <div className="space-y-4">
            <p className={sectionTitleClass}>Dados da cliente</p>

            <label className="block">
              <span className={labelClass}>Nome da cliente</span>
              <input
                required
                value={form.clienteNome}
                onChange={(event) => change('clienteNome', event.target.value)}
                className={inputClass}
                placeholder="Nome completo"
              />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label>
                <span className={labelClass}>E-mail</span>
                <input
                  type="email"
                  value={form.clienteEmail}
                  onChange={(event) => change('clienteEmail', event.target.value)}
                  className={inputClass}
                  placeholder="cliente@email.com"
                />
              </label>

              <label>
                <span className={labelClass}>Telefone / WhatsApp</span>
                <input
                  value={form.clienteTelefone}
                  onChange={(event) => change('clienteTelefone', event.target.value)}
                  className={inputClass}
                  placeholder="(31) 99999-9999"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label>
                <span className={labelClass}>CPF</span>
                <input
                  value={form.clienteCpf}
                  onChange={(event) => change('clienteCpf', event.target.value)}
                  className={inputClass}
                  placeholder="000.000.000-00"
                />
              </label>

              <label>
                <span className={labelClass}>Cidade</span>
                <input
                  value={form.clienteCidade}
                  onChange={(event) => change('clienteCidade', event.target.value)}
                  className={inputClass}
                  placeholder="Belo Horizonte, MG"
                />
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>Indicação</span>
              <input
                value={form.clienteIndicacao}
                onChange={(event) => change('clienteIndicacao', event.target.value)}
                className={inputClass}
                placeholder="Instagram, indicação, Google..."
              />
            </label>
          </div>

          <div className="space-y-4">
            <p className={sectionTitleClass}>Dados do ensaio</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label>
                <span className={labelClass}>Tipo</span>
                <select
                  value={form.tipo}
                  onChange={(event) => change('tipo', event.target.value)}
                  className={inputClass}
                >
                  {TIPO_OPTIONS.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className={labelClass}>Data e horário</span>
                <input
                  required
                  type="datetime-local"
                  value={form.dataEnsaio}
                  onChange={(event) => change('dataEnsaio', event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>Local</span>
              <input
                required
                value={form.local}
                onChange={(event) => change('local', event.target.value)}
                className={inputClass}
                placeholder="Ex: Studio Olhari, BH"
              />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label>
                <span className={labelClass}>Qtd. fotos</span>
                <input
                  required
                  min="1"
                  type="number"
                  value={form.qtdFotosPacote}
                  onChange={(event) => change('qtdFotosPacote', event.target.value)}
                  className={inputClass}
                />
              </label>

              <label>
                <span className={labelClass}>Valor pacote</span>
                <input
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  value={form.valorPacote}
                  onChange={(event) => change('valorPacote', event.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            <label className="flex items-center gap-2 text-[13px] text-white/65">
              <input
                type="checkbox"
                checked={form.cobrarFotoExtra}
                onChange={(event) => change('cobrarFotoExtra', event.target.checked)}
              />
              Cobrar foto extra
            </label>

            {form.cobrarFotoExtra && (
              <label className="block">
                <span className={labelClass}>Valor foto extra</span>
                <input
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  value={form.valorFotoExtra}
                  onChange={(event) => change('valorFotoExtra', event.target.value)}
                  className={inputClass}
                />
              </label>
            )}

            <div className="space-y-4 rounded-xl border border-white/[0.08] bg-black/20 p-4">
              <p className={sectionTitleClass}>Resumo de valores</p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label>
                  <span className={labelClass}>Valor final do ensaio</span>
                  <input
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.valorFinalEnsaio}
                    onChange={(event) => change('valorFinalEnsaio', event.target.value)}
                    className={inputClass}
                    placeholder="Opcional"
                  />
                </label>

                <label>
                  <span className={labelClass}>Status dos valores</span>
                  <select
                    value={form.statusValores}
                    onChange={(event) => change('statusValores', event.target.value)}
                    className={inputClass}
                  >
                    {STATUS_VALORES_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className={labelClass}>Observação de valores</span>
                <textarea
                  maxLength="500"
                  rows="3"
                  value={form.observacaoValores}
                  onChange={(event) => change('observacaoValores', event.target.value)}
                  className={`${inputClass} resize-y`}
                  placeholder="Ex: desconto combinado, cortesia de extras, ajuste manual..."
                />
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>Observações</span>
              <textarea
                maxLength="400"
                rows="4"
                value={form.observacoes}
                onChange={(event) => change('observacoes', event.target.value)}
                className={`${inputClass} resize-y`}
              />
            </label>
          </div>
        </form>
      )}
    </BaseModal>
  )
}
