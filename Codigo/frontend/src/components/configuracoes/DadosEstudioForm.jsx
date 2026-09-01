import { Save, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { FormField } from './FormField'
import InfoBox from './InfoBox'

const emptyForm = {
  nomeEstudio: '',
  nomeComercial: '',
  email: '',
  telefone: '',
  instagram: '',
  cidade: '',
  endereco: '',
  cnpj: '',
  logoUrl: '',
}

export default function DadosEstudioForm({
  data,
  loading,
  uploadLoading,
  onSubmit,
  onUploadLogo,
}) {
  const [form, setForm] = useState(emptyForm)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setForm({
      nomeEstudio: data?.nomeEstudio || '',
      nomeComercial: data?.nomeComercial || '',
      email: data?.email || '',
      telefone: data?.telefone || '',
      instagram: data?.instagram || '',
      cidade: data?.cidade || '',
      endereco: data?.endereco || '',
      cnpj: data?.cnpj || '',
      logoUrl: data?.logoUrl || '',
    })
  }, [data])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(form)
  }

  function handleSelectFile(event) {
    const arquivo = event.target.files?.[0]

    if (!arquivo) return

    onUploadLogo?.(arquivo)

    event.target.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--card-hover)] p-5 md:flex-row md:items-center">
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--gold-border)] bg-[var(--gold-dim)] font-serif text-sm tracking-[0.18em] text-[var(--gold)]">
          {form.logoUrl ? (
            <img
              src={form.logoUrl}
              alt="Logo do estúdio"
              className="h-full w-full object-contain p-2"
            />
          ) : (
            'LOGO'
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-medium text-[var(--text)]">
            Logo do estúdio/empresa
          </h3>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Usada em PDFs, documentos e materiais gerados pelo sistema.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleSelectFile}
          className="hidden"
        />

        <button
          type="button"
          disabled={uploadLoading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload size={15} />
          {uploadLoading ? 'Enviando...' : 'Alterar logo'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
    <FormField label="Nome do estúdio/empresa" name="nomeEstudio" value={form.nomeEstudio} onChange={handleChange} />
<FormField label="Nome comercial ou marca" name="nomeComercial" value={form.nomeComercial} onChange={handleChange} />
<FormField label="E-mail profissional" name="email" value={form.email} onChange={handleChange} />
<FormField label="Telefone profissional" name="telefone" value={form.telefone} onChange={handleChange} />
<FormField label="Instagram" name="instagram" value={form.instagram} onChange={handleChange} />
<FormField label="Cidade de atendimento" name="cidade" value={form.cidade} onChange={handleChange} />
<FormField label="CNPJ, se houver" name="cnpj" value={form.cnpj} onChange={handleChange} />
      </div>

<FormField label="Endereço profissional ou local de atendimento" name="endereco" value={form.endereco} onChange={handleChange} />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={16} />
        {loading ? 'Salvando...' : 'Salvar dados'}
      </button>

      <InfoBox
  title="Sobre os dados do Estúdio/Empresa"
  description="Use esta área para configurar a identidade do Estúdio/Empresa."
  items={[
    'A logo é usada nos PDFs, documentos e materiais gerados pelo sistema.',
    'Nome, e-mail, telefone, Instagram, endereço e CNPJ aparecem em documentos do estúdio/empresa.',
    'Essas informações representam a sua identidade profissional.',
  ]}
/>
    </form>
  )
}
