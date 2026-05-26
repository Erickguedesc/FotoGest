import { useEffect, useMemo, useState } from 'react'

import { normalizeHomepageConfig } from '../../hooks/useHomepageConfig'
import { homepageConfigService } from '../../services/homepageConfigService'

const sectionLabels = {
  hero: 'HeroSection',
  about: 'Sobre mim',
  portfolio: 'Portfólio',
  contact: 'Contato',
  footer: 'Footer',
}

function Field({ label, name, value, onChange, multiline = false, type = 'text' }) {
  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--gold)] placeholder:text-white/30'

  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
        {label}
      </span>
      {multiline ? (
        <textarea
          name={name}
          value={value || ''}
          onChange={onChange}
          rows={4}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          className={inputClass}
        />
      )}
    </label>
  )
}

function ImageField({
  label,
  name,
  value,
  onChange,
  onUpload,
  uploading = false,
  error = '',
}) {
  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--gold)] placeholder:text-white/30'

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (file) {
      onUpload(file)
    }
  }

  return (
    <div className="block">
      <label htmlFor={name}>
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
          {label}
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          id={name}
          type="url"
          name={name}
          value={value || ''}
          onChange={onChange}
          className={inputClass}
        />

        <label
          className={`inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75 transition hover:border-[var(--gold)] hover:text-[var(--gold)] ${
            uploading ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploading}
            onChange={handleFileChange}
          />
          {uploading ? 'Enviando...' : 'Enviar imagem'}
        </label>
      </div>

      {error ? (
        <p className="mt-2 text-xs leading-5 text-[#FB7185]">{error}</p>
      ) : null}
    </div>
  )
}

export default function HomepageEditModal({ open, section, config, onClose, onSave }) {
  const [form, setForm] = useState(() => normalizeHomepageConfig(config))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState('')
  const [uploadErrors, setUploadErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(normalizeHomepageConfig(config))
      setError('')
      setUploadingImage('')
      setUploadErrors({})
    }
  }, [config, open, section])

  const title = useMemo(() => sectionLabels[section] || 'Homepage', [section])

  if (!open) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (fieldName, index, key, value) => {
    setForm((prev) => {
      const items = [...(prev[fieldName] || [])]
      items[index] = { ...items[index], [key]: value }
      return { ...prev, [fieldName]: items }
    })
  }

  const handleImageUrlChange = (name, publicIdName, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      [publicIdName]: null,
    }))
  }

  const handlePortfolioImageUrlChange = (index, value) => {
    setForm((prev) => {
      const fotos = [...(prev.portfolioFotos || [])]
      fotos[index] = {
        ...fotos[index],
        src: value,
        publicId: null,
      }

      return { ...prev, portfolioFotos: fotos }
    })
  }

  const uploadHomepageImage = async (key, file, applyUpload) => {
    setUploadingImage(key)
    setUploadErrors((prev) => ({ ...prev, [key]: '' }))

    try {
      const uploaded = await homepageConfigService.uploadImagem(file)
      setForm((prev) => applyUpload(prev, uploaded))
    } catch (uploadError) {
      console.error('[Homepage] Erro ao enviar imagem:', uploadError?.response?.data || uploadError)
      setUploadErrors((prev) => ({
        ...prev,
        [key]: 'Nao foi possivel enviar. Use uma imagem JPG, PNG ou WEBP.',
      }))
    } finally {
      setUploadingImage('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (uploadingImage) return

    setSaving(true)
    setError('')

    try {
      await onSave(form)
      onClose()
    } catch (saveError) {
      console.error('[Homepage] Erro ao salvar configuração:', saveError?.response?.data || saveError)
      setError('Não foi possível salvar as alterações. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const renderHeroFields = () => (
    <>
      <Field label="Selo" name="heroSelo" value={form.heroSelo} onChange={handleChange} />
      <Field label="Título" name="heroTitulo" value={form.heroTitulo} onChange={handleChange} />
      <Field
        label="Título em destaque"
        name="heroTituloDestaque"
        value={form.heroTituloDestaque}
        onChange={handleChange}
      />
      <Field
        label="Subtítulo"
        name="heroSubtitulo"
        value={form.heroSubtitulo}
        onChange={handleChange}
      />
      <Field
        label="Texto do botão"
        name="heroBotaoTexto"
        value={form.heroBotaoTexto}
        onChange={handleChange}
      />
      <Field
        label="Link do botão"
        name="heroBotaoLink"
        value={form.heroBotaoLink}
        onChange={handleChange}
      />
    </>
  )

  const renderAboutFields = () => (
    <>
      <ImageField
        label="Imagem"
        name="sobreImagemUrl"
        value={form.sobreImagemUrl}
        onChange={(event) =>
          handleImageUrlChange('sobreImagemUrl', 'sobreImagemPublicId', event.target.value)
        }
        onUpload={(file) =>
          uploadHomepageImage('sobreImagemUrl', file, (prev, uploaded) => ({
            ...prev,
            sobreImagemUrl: uploaded.url,
            sobreImagemPublicId: uploaded.publicId,
          }))
        }
        uploading={uploadingImage === 'sobreImagemUrl'}
        error={uploadErrors.sobreImagemUrl}
      />
      <Field
        label="Texto alternativo"
        name="sobreImagemAlt"
        value={form.sobreImagemAlt}
        onChange={handleChange}
      />
      <Field label="Título" name="sobreTitulo" value={form.sobreTitulo} onChange={handleChange} />
      <Field
        label="Título em destaque"
        name="sobreTituloDestaque"
        value={form.sobreTituloDestaque}
        onChange={handleChange}
      />
      <Field
        label="Texto principal"
        name="sobreTexto1"
        value={form.sobreTexto1}
        onChange={handleChange}
        multiline
      />
      <Field
        label="Texto complementar"
        name="sobreTexto2"
        value={form.sobreTexto2}
        onChange={handleChange}
        multiline
      />

      <div className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
          Indicadores
        </p>
        {(form.sobreEstatisticas || []).map((stat, index) => (
          <div key={`stat-${index}`} className="grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-[90px_1fr]">
            <input
              value={stat.value || ''}
              onChange={(event) =>
                handleArrayChange('sobreEstatisticas', index, 'value', event.target.value)
              }
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-[var(--gold)]"
              aria-label={`Valor do indicador ${index + 1}`}
            />
            <input
              value={stat.label || ''}
              onChange={(event) =>
                handleArrayChange('sobreEstatisticas', index, 'label', event.target.value)
              }
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-[var(--gold)]"
              aria-label={`Descrição do indicador ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </>
  )

  const renderPortfolioFields = () => (
    <>
      <Field label="Selo" name="portfolioSelo" value={form.portfolioSelo} onChange={handleChange} />
      <Field
        label="Título"
        name="portfolioTitulo"
        value={form.portfolioTitulo}
        onChange={handleChange}
      />
      <Field
        label="Título em destaque"
        name="portfolioTituloDestaque"
        value={form.portfolioTituloDestaque}
        onChange={handleChange}
      />

      <div className="space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
          Fotos
        </p>
        {(form.portfolioFotos || []).map((photo, index) => (
          <div key={photo.id || index} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <ImageField
              label={`Imagem ${index + 1}`}
              name={`portfolioFotoUrl-${index}`}
              value={photo.src}
              onChange={(event) =>
                handlePortfolioImageUrlChange(index, event.target.value)
              }
              onUpload={(file) =>
                uploadHomepageImage(`portfolioFotoUrl-${index}`, file, (prev, uploaded) => {
                  const fotos = [...(prev.portfolioFotos || [])]
                  fotos[index] = {
                    ...fotos[index],
                    src: uploaded.url,
                    publicId: uploaded.publicId,
                  }

                  return { ...prev, portfolioFotos: fotos }
                })
              }
              uploading={uploadingImage === `portfolioFotoUrl-${index}`}
              error={uploadErrors[`portfolioFotoUrl-${index}`]}
            />
            <Field
              label="Legenda"
              name={`portfolioFotoLabel-${index}`}
              value={photo.label}
              onChange={(event) =>
                handleArrayChange('portfolioFotos', index, 'label', event.target.value)
              }
            />
            <Field
              label="Texto alternativo"
              name={`portfolioFotoAlt-${index}`}
              value={photo.alt}
              onChange={(event) =>
                handleArrayChange('portfolioFotos', index, 'alt', event.target.value)
              }
            />
          </div>
        ))}
      </div>
    </>
  )

  const renderContactFields = () => (
    <>
      <Field
        label="Título"
        name="contatoTitulo"
        value={form.contatoTitulo}
        onChange={handleChange}
      />
      <Field
        label="Texto"
        name="contatoTexto"
        value={form.contatoTexto}
        onChange={handleChange}
        multiline
      />
      <Field
        label="Número do WhatsApp"
        name="whatsappNumero"
        value={form.whatsappNumero}
        onChange={handleChange}
      />
    </>
  )

  const renderFooterFields = () => (
    <>
      <Field
        label="Nome do estúdio/fotógrafa"
        name="footerEstudioNome"
        value={form.footerEstudioNome}
        onChange={handleChange}
      />
      <Field
        label="Texto curto ou slogan"
        name="footerSlogan"
        value={form.footerSlogan}
        onChange={handleChange}
        multiline
      />
      <Field
        label="E-mail de contato"
        name="footerEmail"
        value={form.footerEmail}
        onChange={handleChange}
        type="email"
      />
      <Field
        label="WhatsApp/telefone"
        name="footerWhatsapp"
        value={form.footerWhatsapp}
        onChange={handleChange}
      />
      <Field
        label="Instagram"
        name="footerInstagram"
        value={form.footerInstagram}
        onChange={handleChange}
      />
      <Field
        label="Cidade/estado"
        name="footerCidade"
        value={form.footerCidade}
        onChange={handleChange}
      />
      <Field label="Texto" name="footerTexto" value={form.footerTexto} onChange={handleChange} />
      <Field
        label="Texto da área administrativa"
        name="footerAdminTexto"
        value={form.footerAdminTexto}
        onChange={handleChange}
      />
      <Field
        label="Link da área administrativa"
        name="footerAdminLink"
        value={form.footerAdminLink}
        onChange={handleChange}
      />
    </>
  )

  const renderFields = () => {
    switch (section) {
      case 'hero':
        return renderHeroFields()
      case 'about':
        return renderAboutFields()
      case 'portfolio':
        return renderPortfolioFields()
      case 'contact':
        return renderContactFields()
      case 'footer':
        return renderFooterFields()
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-stretch justify-end bg-black/65 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Fechar edição"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-[#101010] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Editar homepage
            </p>
            <h2 className="mt-2 font-serif text-3xl font-light text-white">{title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-white/70 transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            aria-label="Fechar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">{renderFields()}</div>

        {error && (
          <div className="mx-6 mb-4 rounded-xl border border-[#FB7185]/30 bg-[#FB7185]/10 px-4 py-3 text-sm text-[#FB7185]">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || Boolean(uploadingImage)}
            className="rounded-full bg-[var(--gold)] px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#1A1200] transition hover:bg-[#E2C07A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploadingImage ? 'Enviando imagem...' : saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
