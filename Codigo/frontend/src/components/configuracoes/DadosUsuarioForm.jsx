import { Mail, MapPin, Phone, Save, Upload, User } from 'lucide-react'
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

export default function DadosUsuarioForm({
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <section className="rounded-[20px] border border-[#e7ded3] bg-white p-5 shadow-[0_16px_42px_rgba(82,58,35,0.06)] sm:p-6">
        <div className="flex flex-col gap-5 rounded-[18px] border border-[#eee5db] bg-[#fdfbf8] p-4 sm:p-5 md:flex-row md:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e6d1b1] bg-[#fff4df] font-serif text-2xl text-[#bd7920]">
            {form.fotoPerfilUrl ? (
              <img
                src={form.fotoPerfilUrl}
                alt="Foto do usuário"
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-medium text-[#211b17]">
              Perfil da conta
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#756a61]">
              A foto é exibida no painel administrativo.
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
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] border border-[#d8b47a] bg-white px-4 text-sm font-medium text-[#a96516] transition hover:bg-[#fff6e8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload size={15} />
            {uploadLoading ? 'Enviando...' : 'Alterar foto'}
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <FormField
            label="Seu nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            icon={<User size={17} />}
          />
          <FormField
            label="E-mail de login"
            name="email"
            value={form.email}
            onChange={handleChange}
            icon={<Mail size={17} />}
          />
          <FormField
            label="Telefone / WhatsApp"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            icon={<Phone size={17} />}
          />
          <FormField
            label="Cidade"
            name="cidade"
            value={form.cidade}
            onChange={handleChange}
            placeholder="Digite sua cidade"
            icon={<MapPin size={17} />}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-[#bd7920] px-5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(189,121,32,0.18)] transition hover:bg-[#a96718] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} />
          {loading ? 'Salvando...' : 'Salvar dados'}
        </button>
      </section>

      <InfoBox
        title="Sobre seus dados"
        description="Use esta área para alterar os dados da sua conta administrativa."
        items={[
          'A foto aparece no painel administrativo.',
          'O e-mail é usado para login no sistema.',
          'Nome, telefone e cidade ajudam a identificar você dentro do painel.',
        ]}
      />
    </form>
  )
}
