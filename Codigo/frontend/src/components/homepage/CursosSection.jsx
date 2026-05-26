import { useEffect, useMemo, useState } from 'react'

import { homepageConfigService } from '../../services/homepageConfigService'
import { homepageCursosService } from '../../services/homepageCursosService'

const emptyForm = {
  titulo: '',
  descricao: '',
  imagemUrl: '',
  imagemPublicId: null,
  precoTexto: '',
  linkExterno: '',
  textoBotao: 'Conhecer produto',
  ativo: true,
  ordem: 1,
}

function hasAuthToken() {
  return Boolean(localStorage.getItem('token'))
}

function CursoCard({ curso, isAdmin, onEdit, onHide, onActivate, onDelete }) {

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border bg-[var(--card)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,164,89,0.55)] hover:shadow-[0_24px_70px_rgba(0,0,0,0.35)] ${
        curso.ativo === false ? 'border-white/10 opacity-60' : 'border-white/10'
      }`}
    >
      <div className="relative h-60 overflow-hidden bg-[#1a1a1a]">
        <img
          src={curso.imagemUrl}
          alt={curso.titulo}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {curso.ativo === false && (
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
            Oculto
          </span>
        )}

        {curso.precoTexto && (
          <span className="absolute bottom-4 left-4 rounded-full border border-[rgba(201,164,89,0.35)] bg-black/70 px-4 py-2 text-xs font-semibold text-[var(--gold)] backdrop-blur">
            {curso.precoTexto}
          </span>
        )}
      </div>

      <div className="flex min-h-[270px] flex-col p-6">
        <div className="mb-4 h-px w-14 bg-[var(--gold)]/70" />
        <h3 className="font-serif text-2xl font-light leading-tight text-white">
          {curso.titulo}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
          {curso.descricao}
        </p>

        <a
          href={curso.linkExterno || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--gold)] px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1A1200] no-underline transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E2C07A]"
        >
          {curso.textoBotao || 'Conhecer produto'}
        </a>

{isAdmin && (
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => onEdit(curso)}
              className="rounded-full border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-white/70 transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => (curso.ativo ? onHide(curso.id) : onActivate(curso.id))}
              className="rounded-full border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-white/70 transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              {curso.ativo ? 'Ocultar' : 'Ativar'}
            </button>
            <button
              type="button"
              onClick={() => onDelete(curso.id)}
              className="rounded-full border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-white/70 transition hover:border-red-400/70 hover:text-red-300"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

function CursoModal({
  form,
  editingCurso,
  saving,
  imageUploading,
  imageUploadError,
  onChange,
  onImageUpload,
  onClose,
  onSubmit,
}) {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (file) {
      onImageUpload(file)
    }
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111] p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.35em] text-[var(--gold)]">
              Área da fotógrafa
            </p>
            <h3 className="font-serif text-3xl font-light text-white">
              {editingCurso ? 'Editar produto' : 'Adicionar produto'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="md:col-span-1">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-[var(--gold)]">
              Título
            </span>
            <input
              name="titulo"
              value={form.titulo}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          <label className="md:col-span-1">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-[var(--gold)]">
              Preço em texto
            </span>
            <input
              name="precoTexto"
              value={form.precoTexto}
              onChange={onChange}
              placeholder="Ex.: R$ 197 ou Sob consulta"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-[var(--gold)]">
              Descrição curta
            </span>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={onChange}
              required
              rows="3"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          <div className="md:col-span-2">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-[var(--gold)]">
              URL da imagem
            </span>
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                name="imagemUrl"
                value={form.imagemUrl}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--gold)]"
              />

              <label
                className={`inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75 transition hover:border-[var(--gold)] hover:text-[var(--gold)] ${
                  imageUploading ? 'pointer-events-none opacity-60' : ''
                }`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={imageUploading}
                  onChange={handleFileChange}
                />
                {imageUploading ? 'Enviando...' : 'Enviar imagem'}
              </label>
            </div>

            {imageUploadError ? (
              <p className="mt-2 text-xs leading-5 text-[#FB7185]">{imageUploadError}</p>
            ) : null}
          </div>

          <label className="md:col-span-1">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-[var(--gold)]">
              Link externo
            </span>
            <input
              name="linkExterno"
              value={form.linkExterno}
              onChange={onChange}
              required
              placeholder="Hotmart, Kiwify, WhatsApp, Instagram..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          <label className="md:col-span-1">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-[var(--gold)]">
              Texto do botão
            </span>
            <input
              name="textoBotao"
              value={form.textoBotao}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          <label>
            <span className="mb-2 block text-[10px] uppercase tracking-[0.14em] text-[var(--gold)]">
              Ordem
            </span>
            <input
              type="number"
              name="ordem"
              value={form.ordem}
              onChange={onChange}
              min="0"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80">
            <input
              type="checkbox"
              name="ativo"
              checked={form.ativo}
              onChange={onChange}
              className="h-4 w-4 accent-[var(--gold)]"
            />
            Produto ativo na Homepage
          </label>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-5 md:col-span-2 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || imageUploading}
              className="rounded-full bg-[var(--gold)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1A1200] transition hover:bg-[#E2C07A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {imageUploading ? 'Enviando imagem...' : saving ? 'Salvando...' : 'Salvar produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CursosSection() {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCurso, setEditingCurso] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploadError, setImageUploadError] = useState('')

  const isAdmin = useMemo(() => hasAuthToken(), [])

  const carregarCursos = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = isAdmin
        ? await homepageCursosService.listarTodos()
        : await homepageCursosService.listarAtivos()
      setCursos(data)
    } catch (err) {
  console.error('[CursosSection] Erro ao buscar cursos:', err)

  setCursos([])

  if (isAdmin) {
    setFeedback({
      type: 'error',
      message:
        'Não foi possível carregar os produtos. Verifique se o backend de cursos está disponível.',
    })
  } else {
    setError('Não foi possível carregar os produtos no momento.')
  }
}finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarCursos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreateModal = () => {
    setEditingCurso(null)
    setForm({ ...emptyForm, ordem: (cursos?.length || 0) + 1 })
    setImageUploadError('')
    setModalOpen(true)
  }

  const openEditModal = (curso) => {
    setEditingCurso(curso)
    setForm({ ...emptyForm, ...curso })
    setImageUploadError('')
    setModalOpen(true)
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'imagemUrl' ? { imagemPublicId: null } : {}),
    }))
  }

  const handleImageUpload = async (file) => {
    setImageUploading(true)
    setImageUploadError('')

    try {
      const uploaded = await homepageConfigService.uploadImagem(file)
      setForm((prev) => ({
        ...prev,
        imagemUrl: uploaded.url,
        imagemPublicId: uploaded.publicId,
      }))
    } catch (err) {
      console.error('[CursosSection] Erro ao enviar imagem:', err?.response?.data || err)
      setImageUploadError('Nao foi possivel enviar. Use uma imagem JPG, PNG ou WEBP.')
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (imageUploading) return

    setSaving(true)
    setFeedback(null)

    try {
      if (editingCurso) {
        await homepageCursosService.atualizar(editingCurso.id, form)
        setFeedback({ type: 'success', message: 'Produto atualizado com sucesso.' })
      } else {
        await homepageCursosService.criar(form)
        setFeedback({ type: 'success', message: 'Produto adicionado com sucesso.' })
      }
      setModalOpen(false)
      await carregarCursos()
    } catch (err) {
      console.error('[CursosSection] Erro ao salvar produto:', err)
      setFeedback({
        type: 'error',
        message: 'Não foi possível salvar. Verifique se o backend de cursos está disponível.',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleHide = async (id) => {
    try {
      await homepageCursosService.ocultar(id)
      setFeedback({ type: 'success', message: 'Produto ocultado da Homepage.' })
      await carregarCursos()
    } catch (err) {
      console.error('[CursosSection] Erro ao ocultar produto:', err)
      setFeedback({ type: 'error', message: 'Não foi possível ocultar o produto.' })
    }
  }

  const handleActivate = async (id) => {
    try {
      await homepageCursosService.ativar(id)
      setFeedback({ type: 'success', message: 'Produto ativado na Homepage.' })
      await carregarCursos()
    } catch (err) {
      console.error('[CursosSection] Erro ao ativar produto:', err)
      setFeedback({ type: 'error', message: 'Não foi possível ativar o produto.' })
    }
  }

  const handleDelete = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este produto?')
    if (!confirmar) return

    try {
      await homepageCursosService.excluir(id)
      setFeedback({ type: 'success', message: 'Produto excluído com sucesso.' })
      await carregarCursos()
    } catch (err) {
      console.error('[CursosSection] Erro ao excluir produto:', err)
      setFeedback({ type: 'error', message: 'Não foi possível excluir o produto.' })
    }
  }

  const cursosVisiveis = isAdmin ? cursos : cursos.filter((curso) => curso.ativo !== false)

  return (
    <section id="produtos" className="px-[10%] py-28 bg-[#0b0b0b]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-[var(--gold)]">
              Meus Produtos
            </p>
            <h2
              className="font-serif font-light leading-[1.1]"
              style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
            >
              Cursos, presets e <span className="italic text-[var(--gold)]">mentorias</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
              Uma vitrine de conteúdos digitais para aprender fotografia, evoluir na edição
              e acessar materiais profissionais em plataformas externas seguras.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={openCreateModal}
              className="self-center rounded-full border border-[rgba(201,164,89,0.45)] bg-[rgba(201,164,89,0.08)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)] transition hover:-translate-y-0.5 hover:bg-[rgba(201,164,89,0.16)] md:self-auto"
            >
              Adicionar produto
            </button>
          )}
        </div>

        <div className="mb-10 rounded-3xl border border-[rgba(201,164,89,0.22)] bg-[linear-gradient(135deg,rgba(201,164,89,0.12),rgba(255,255,255,0.03))] p-6 text-sm leading-relaxed text-[var(--text-muted)] md:p-8">
          <strong className="text-[var(--gold)]">Importante:</strong> o OLHARI apenas
          apresenta os produtos. A compra, o pagamento e o acesso ao conteúdo acontecem em
          links externos, como Hotmart, Kiwify, WhatsApp, Instagram ou outra plataforma definida
          pela fotógrafa.
        </div>

        {feedback && (
          <div
            className={`mb-8 rounded-2xl border px-5 py-4 text-sm ${
              feedback.type === 'success'
                ? 'border-[#34D399]/30 bg-[#34D399]/10 text-[#86EFAC]'
                : feedback.type === 'warning'
                  ? 'border-[var(--gold)]/30 bg-[var(--gold-dim)] text-[var(--gold)]'
                  : 'border-[#FB7185]/30 bg-[#FB7185]/10 text-[#FDA4AF]'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-[520px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-[#FB7185]/30 bg-[#FB7185]/10 px-6 py-10 text-center text-[#FDA4AF]">
            {error}
          </div>
        )}

        {!loading && !error && cursosVisiveis.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
            <h3 className="font-serif text-2xl font-light text-white">Nenhum produto ativo</h3>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Assim que houver cursos, presets ou mentorias ativos, eles aparecerão aqui.
            </p>
          </div>
        )}

        {!loading && !error && cursosVisiveis.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cursosVisiveis.map((curso) => (
              <CursoCard
                key={curso.id}
                curso={curso}
                isAdmin={isAdmin}
                onEdit={openEditModal}
                onHide={handleHide}
                onActivate={handleActivate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <CursoModal
          form={form}
          editingCurso={editingCurso}
          saving={saving}
          imageUploading={imageUploading}
          imageUploadError={imageUploadError}
          onChange={handleChange}
          onImageUpload={handleImageUpload}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}
