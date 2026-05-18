import { Save, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { FormField } from './FormField'
import InfoBox from './InfoBox'

const emptyForm = {
  nome: '',
  email: '',
  telefone: '',
  cidade: '',
  fotoPerfilUrl: '',
}

export default function DadosFotografaForm({
  data,
  loading,
  uploadLoading,
  onSubmit,
  onUploadFoto,
}) {
  const [form, setForm] = useState(emptyForm)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setForm({
      nome: data?.nome || '',
      email: data?.email || '',
      telefone: data?.telefone || '',
      cidade: data?.cidade || '',
      fotoPerfilUrl: data?.fotoPerfilUrl || '',
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

    onUploadFoto?.(arquivo)

    event.target.value = ''
  }

  const initials = form.nome
    ? form.nome
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'FT'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] font-serif text-2xl text-[var(--gold)]">
          {form.fotoPerfilUrl ? (
            <img
              src={form.fotoPerfilUrl}
              alt="Foto da fotógrafa"
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-medium text-white">
            Foto ou iniciais do perfil
          </h3>

          <p className="mt-1 text-sm text-white/40">
            Usado no canto superior direito do painel administrativo.
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
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-[var(--gold-border)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload size={15} />
          {uploadLoading ? 'Enviando...' : 'Alterar foto'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Nome da fotógrafa" name="nome" value={form.nome} onChange={handleChange} />
        <FormField label="E-mail de login" name="email" value={form.email} onChange={handleChange} />
        <FormField label="Telefone / WhatsApp" name="telefone" value={form.telefone} onChange={handleChange} />
        <FormField label="Cidade" name="cidade" value={form.cidade} onChange={handleChange} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={16} />
        {loading ? 'Salvando...' : 'Salvar dados da fotógrafa'}
      </button>

      <InfoBox
  title="Sobre os dados da fotógrafa"
  description="Use esta área para alterar os dados da sua conta administrativa."
  items={[
    'A foto aparece no canto superior direito do painel administrativo.',
    'O e-mail é usado para login no sistema.',
    'Nome, telefone e cidade ajudam a identificar a fotógrafa dentro do painel.',
  ]}
/>
    </form>
  )
}