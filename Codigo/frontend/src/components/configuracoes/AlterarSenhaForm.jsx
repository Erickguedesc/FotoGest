import { Save } from 'lucide-react'
import { useState } from 'react'
import { PasswordField } from './FormField'
import InfoBox from './InfoBox'

const emptyForm = {
  senhaAtual: '',
  novaSenha: '',
  confirmarNovaSenha: '',
}

export default function AlterarSenhaForm({ loading, onSubmit }) {
  const [form, setForm] = useState(emptyForm)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await onSubmit(form)
    setForm(emptyForm)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PasswordField label="Senha atual" name="senhaAtual" value={form.senhaAtual} onChange={handleChange} />
      <PasswordField label="Nova senha" name="novaSenha" value={form.novaSenha} onChange={handleChange} />
      <PasswordField label="Confirmar nova senha" name="confirmarNovaSenha" value={form.confirmarNovaSenha} onChange={handleChange} />

      <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm text-yellow-100/80">
        Depois de alterar a senha, use a nova senha no próximo login.
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={16} />
        {loading ? 'Alterando...' : 'Alterar senha'}
      </button>

      <InfoBox
  title="Sobre a alteração de senha"
  description="Use esta área para trocar a senha de acesso ao painel administrativo."
  items={[
    'Informe a senha atual para confirmar sua identidade.',
    'Depois de alterar a senha, pode ser necessário fazer login novamente.',
    'Use uma senha com pelo menos 6 caracteres.',
  ]}
/>
    </form>
  )
}
