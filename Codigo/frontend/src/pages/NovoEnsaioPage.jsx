import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Header from '../components/layout/Header'
import Toast from '../components/ui/Toast'
import FormInfoSection from '../components/novoEnsaio/FormInfoSection'
import FormObsSection from '../components/novoEnsaio/FormObsSection'
import FormPacoteSection from '../components/novoEnsaio/FormPacoteSection'
import ResumeSidebar from '../components/novoEnsaio/ResumeSidebar'
import { ensaiosService } from '../services/ensaiosService'

// ── Mapa: valor do chip → enum esperado pelo backend ──
const TIPO_ENUM_MAP = {
  Newborn:  'NEWBORN',
  Gestante: 'GESTANTE',
  Família:  'FAMILIA',
  Infantil: 'INFANTIL',
  Feminino: 'FEMININO',
  Casal:    'CASAL',
  Book:     'BOOK',
  Batizado: 'BATIZADO',
  Externo:  'EXTERNO',
  Outro:    'OUTRO',
}

const INITIAL_FORM = {
  cliente: '',
  tipo: '',
  tipoCustom: '',
  data: '',
  hora: '',
  local: '',
  obs: '',
  fotos: 30,
  valor: '',
  extraAtivo: false,
  extra: '',
}

export default function NovoEnsaioPage() {
  const navigate = useNavigate()
  const [form, setForm]     = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast]   = useState(null)

  // ── Handler genérico de campos ──
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // ── Validação ──
  function validate() {
    const e = {}
    if (!form.cliente.trim())
      e.cliente = 'Nome do cliente é obrigatório'
    if (!form.tipo)
      e.tipo = 'Selecione o tipo de ensaio'
    if (form.tipo === 'Outro' && !form.tipoCustom?.trim())
      e.tipo = 'Descreva o tipo de ensaio'
    if (!form.data)
      e.data = 'Informe a data'
    if (!form.hora)
      e.hora = 'Informe o horário'
    if (!form.local.trim())
      e.local = 'Informe o local'
    if (!form.valor || parseFloat(form.valor) <= 0)
      e.valor = 'Informe o valor do pacote'
    if (!form.fotos || parseInt(form.fotos) <= 0)
      e.fotos = 'Informe o nº de fotos'
    if (form.extraAtivo && (!form.extra || parseFloat(form.extra) <= 0))
      e.extra = 'Informe o valor por foto extra'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Monta o payload correto para o backend ──
  function buildPayload() {
    // 1. Tipo: converte para o enum do backend
    const tipoEnum =
      form.tipo === 'Outro'
        ? 'OUTRO'
        : TIPO_ENUM_MAP[form.tipo] ?? form.tipo.toUpperCase()

    // 2. Data + hora → ISO 8601 (ex: "2025-04-12T09:00:00")
    //    O backend espera LocalDateTime, então concatenamos
    const dataEnsaio =
      form.data && form.hora
        ? `${form.data}T${form.hora}:00`
        : form.data

    // 3. clienteId vem do localStorage (salvo no login)
    //    Se não existir, usamos null e o backend vai retornar 400
    const clienteIdRaw = localStorage.getItem('clienteId')
    const clienteId = clienteIdRaw ? clienteIdRaw : undefined

    return {
      // O backend espera apenas o ID para fazer a associação
      // Forma 1 (mais comum em Spring): campo direto
      clienteId: clienteId,

      tipo: tipoEnum,
      dataEnsaio,
      local: form.local.trim(),
      qtdFotosPacote: parseInt(form.fotos),
      valorPacote: parseFloat(form.valor),
      cobrarFotoExtra: form.extraAtivo,
      valorFotoExtra: form.extraAtivo && form.extra
        ? parseFloat(form.extra)
        : null,
      observacoes: form.obs?.trim() || null,
      status: 'AGENDADO',
    }
  }

  // ── Submit ──
  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) {
      // Rola até o primeiro campo com erro
      const firstErr = document.querySelector('[data-error="true"]')
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setLoading(true)
    try {
      const payload = buildPayload()

      // Debug: mostra o payload no console antes de enviar
      console.log('[NovoEnsaio] Payload enviado:', JSON.stringify(payload, null, 2))

      await ensaiosService.criar(payload)

      setToast({ message: 'Ensaio cadastrado com sucesso!', type: 'success' })
      setTimeout(() => navigate('/ensaios'), 1500)

    } catch (err) {
      // Log completo do erro para facilitar debug
      console.error('[NovoEnsaio] Erro ao salvar:', err)
      console.error('[NovoEnsaio] Response data:', err?.response?.data)
      console.error('[NovoEnsaio] Status:', err?.response?.status)

      // Mensagem amigável baseada no status HTTP
      const status = err?.response?.status
      let msg = 'Erro ao salvar. Tente novamente.'

      if (status === 400) {
        // Backend retornou erro de validação — mostra a mensagem dele
        const data = err?.response?.data
        msg = data?.message
          || data?.error
          || (typeof data === 'string' ? data : 'Dados inválidos. Verifique o formulário.')
      } else if (status === 401) {
        msg = 'Sessão expirada. Faça login novamente.'
      } else if (status === 403) {
        msg = 'Sem permissão para realizar esta ação.'
      } else if (status === 409) {
        msg = 'Já existe um ensaio com esses dados.'
      } else if (!navigator.onLine) {
        msg = 'Sem conexão com a internet.'
      }

      setToast({ message: msg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="pt-[88px] pb-16 px-8 max-w-[980px] mx-auto animate-[fadeUp_0.55s_cubic-bezier(0.22,1,0.36,1)_both]">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate('/ensaios')}
            className="text-[12px] text-white/45 cursor-pointer hover:text-[var(--gold)] transition-colors"
          >
            Ensaios
          </button>
          <span className="text-[11px] text-white/20">›</span>
          <span className="text-[12px] text-white/80">Novo ensaio</span>
        </div>

        {/* Título */}
        <div className="mb-8">
          <p className="text-[10.5px] tracking-[0.2em] uppercase text-white/45 mb-1">
            RF03 — Cadastro
          </p>
          <h1 className="font-serif text-[32px] font-light tracking-[0.04em]">
            Novo Ensaio
          </h1>
          <p className="text-[13px] text-white/45 mt-1">
            Preencha os dados para registrar um novo ensaio fotográfico.
          </p>
        </div>

        {/* Grid principal */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-[1fr_340px] gap-5 items-start">

            {/* Coluna esquerda */}
            <div>
              <FormInfoSection   form={form} errors={errors} onChange={handleChange} />
              <FormObsSection    form={form} onChange={handleChange} />
              <FormPacoteSection form={form} errors={errors} onChange={handleChange} />
            </div>

            {/* Sidebar */}
            <ResumeSidebar form={form} loading={loading} />

          </div>
        </form>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}