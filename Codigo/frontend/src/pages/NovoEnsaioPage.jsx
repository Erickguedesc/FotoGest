import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import Header from '../components/layout/Header'
import Toast from '../components/ui/Toast'
import FormInfoSection from '../components/novoEnsaio/FormInfoSection'
import FormObsSection from '../components/novoEnsaio/FormObsSection'
import FormPacoteSection from '../components/novoEnsaio/FormPacoteSection'
import ResumeSidebar from '../components/novoEnsaio/ResumeSidebar'
import { ensaiosService } from '../services/ensaiosService'
import { clientesService } from '../services/clientesService'
import { configuracoesService } from '../services/configuracoesService'

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
  // dados do cliente
  cliente:   '',
  telefone:  '',
  email:     '',
  cpf:       '',
  cidade:    '',
  indicacao: '',
  // dados do ensaio
  tipo:      '',
  tipoCustom:'',
  data:      '',
  hora:      '',
  local:     '',
  obs:       '',
  fotos:     '',
  valor:     '',
  extraAtivo:false,
  extra:     '',
}

export default function NovoEnsaioPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm]       = useState(INITIAL_FORM)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast]     = useState(null)
  const clienteIdExistente = searchParams.get('clienteId')

  useEffect(() => {
  const dataUrl = searchParams.get('data')
  const dataValida = /^\d{4}-\d{2}-\d{2}$/.test(dataUrl || '')

  if (dataValida) {
    setForm((prev) => ({
      ...prev,
      data: prev.data || dataUrl,
    }))
  }

  async function carregarPreferencias() {
    try {
      const configuracoes = await configuracoesService.buscar()
      const preferencias = configuracoes?.preferencias

      if (!preferencias) return

      setForm((prev) => ({
        ...prev,
        data: dataValida ? dataUrl : prev.data,
        fotos: preferencias.qtdFotosPadrao ?? prev.fotos,
        extra:
          preferencias.valorFotoExtraPadrao !== null &&
          preferencias.valorFotoExtraPadrao !== undefined
            ? String(preferencias.valorFotoExtraPadrao)
            : prev.extra,
        local: prev.local || preferencias.cidadePadrao || '',
      }))
    } catch (error) {
      console.error('[NovoEnsaio] Erro ao carregar preferências:', error)
    }
  }

  carregarPreferencias()
}, [searchParams])

  useEffect(() => {
    if (!clienteIdExistente) return

    let cancelado = false

    async function carregarClienteExistente() {
      try {
        const response = await clientesService.buscarPorId(clienteIdExistente)
        const cliente = response.data

        if (cancelado || !cliente) return

        setForm((prev) => ({
          ...prev,
          cliente: prev.cliente || cliente.nome || '',
        }))
      } catch (error) {
        console.error('[NovoEnsaio] Erro ao carregar cliente existente:', error?.response?.data || error)
        setToast({ message: 'Nao foi possivel preencher a cliente selecionada.', type: 'error' })
      }
    }

    carregarClienteExistente()

    return () => {
      cancelado = true
    }
  }, [clienteIdExistente])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

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

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // ── Passo 1: criar o cliente ──────────────────────────────────────────
      let clienteId = clienteIdExistente

      if (!clienteId) {
        const clientePayload = {
          nome:      form.cliente.trim(),
          telefone:  form.telefone?.trim()           || null,
          email:     form.email?.trim()              || null,
          cpf:       form.cpf?.replace(/\D/g, '')    || null,
          cidade:    form.cidade?.trim()             || null,
          indicacao: form.indicacao                  || null,
        }

        console.log('[NovoEnsaio] Criando cliente:', clientePayload)
        const clienteRes = await clientesService.criar(clientePayload)
        clienteId = clienteRes.data.id
        console.log('[NovoEnsaio] Cliente criado, id:', clienteId)
      }

      // ── Passo 2: criar o ensaio ───────────────────────────────────────────
      const tipoEnum =
        form.tipo === 'Outro'
          ? 'OUTRO'
          : TIPO_ENUM_MAP[form.tipo] ?? form.tipo.toUpperCase()

      const ensaioPayload = {
        clienteId,
        clienteNome: form.cliente.trim(),
        clienteTelefone: form.telefone?.trim() || null,
        clienteEmail: form.email?.trim() || null,
        clienteCpf: form.cpf?.replace(/\D/g, '') || null,
        clienteCidade: form.cidade?.trim() || null,
        clienteIndicacao: form.indicacao || null,
        tipo:            tipoEnum,
        dataEnsaio: new Date(`${form.data}T${form.hora}:00`).toISOString(),
        local:           form.local.trim(),
        qtdFotosPacote:  parseInt(form.fotos),
        valorPacote:     parseFloat(form.valor),
        cobrarFotoExtra: form.extraAtivo,
        valorFotoExtra:  form.extraAtivo && form.extra ? parseFloat(form.extra) : null,
        observacoes:     form.obs?.trim() || null,
        status:          'AGENDADO',
      }

      console.log('[NovoEnsaio] Criando ensaio:', ensaioPayload)
      await ensaiosService.criar(ensaioPayload)

      setToast({ message: 'Ensaio cadastrado com sucesso!', type: 'success' })
      setTimeout(() => navigate('/ensaios'), 1500)

    } catch (err) {
      console.error('[NovoEnsaio] Erro:', err?.response?.data)

      const status = err?.response?.status
      const data   = err?.response?.data
      let msg = 'Erro ao salvar. Tente novamente.'

      if (status === 400)
        msg = data?.message || data?.error || 'Dados inválidos. Verifique o formulário.'
      else if (status === 401)
        msg = 'Sessão expirada. Faça login novamente.'
      else if (status === 403)
        msg = 'Sem permissão. Verifique se está logado.'
      else if (status === 409)
        msg = 'CPF ou e-mail já cadastrado para outro cliente.'

      setToast({ message: msg, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="pt-[88px] pb-16 px-8 max-w-[980px] mx-auto animate-[fadeUp_0.55s_cubic-bezier(0.22,1,0.36,1)_both]">

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

        <div className="mb-8">
          <h1 className="font-serif text-[32px] font-light tracking-[0.04em]">
            Novo Ensaio
          </h1>
          <p className="text-[13px] text-white/45 mt-1">
            Preencha os dados do cliente e do ensaio para registrar.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-[1fr_340px] gap-5 items-start">
            <div>
              <FormInfoSection   form={form} errors={errors} onChange={handleChange} />
              <FormObsSection    form={form} onChange={handleChange} />
              <FormPacoteSection form={form} errors={errors} onChange={handleChange} />
            </div>
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
