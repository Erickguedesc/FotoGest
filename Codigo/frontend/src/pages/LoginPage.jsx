import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'
// tela de login da fotografa //
export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm]         = useState({ email: '', senha: '' })
  const [errors, setErrors]     = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [apiError, setApiError] = useState(
    searchParams.get('motivo') === 'sessao-expirada'
      ? 'Sua sessão expirou ou ficou inválida. Faça login novamente.'
      : '',
  )

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    if (apiError) setApiError('')
  }

  function validate() {
    const e = {}
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Insira um e-mail válido'
    if (!form.senha || form.senha.length < 6)
      e.senha = 'A senha deve ter pelo menos 6 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setApiError('')
    localStorage.removeItem('token')
    localStorage.removeItem('fotografaNome')
    localStorage.removeItem('fotografaEmail')

    try {
      const res = await api.post('/auth/login', {
        email: form.email,
        senha: form.senha,
      })

      const { token, nome, email } = res.data

      // Salva no localStorage para uso em todas as requisições
      localStorage.setItem('token', token)
      localStorage.setItem('fotografaNome', nome)
      localStorage.setItem('fotografaEmail', email)

      // Redireciona para o dashboard
      navigate('/dashboard', { replace: true })

    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        setApiError('E-mail ou senha incorretos.')
      } else if (status === 400) {
        setApiError('Dados inválidos. Verifique o formulário.')
      } else {
        setApiError('Erro ao conectar. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputBase = `
    w-full bg-white/[0.03] border border-white/[0.12] rounded-[8px]
    px-4 py-[13px] font-light text-[14.5px] text-white
    outline-none transition-all duration-200
    hover:border-white/[0.22]
    focus:border-[rgba(226,185,107,0.5)] focus:bg-[rgba(201,164,89,0.04)]
    placeholder:text-white/20
  `
  const inputError = 'border-[rgba(226,92,92,0.5)] bg-[rgba(255,107,107,0.05)]'

  return (
    <div
      className="theme-static flex min-h-screen items-center justify-center px-6"
      style={{ background: '#0A0A0A' }}
    >
      {/* Grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.032]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glow */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,164,89,0.04) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }}
      />

      <div
        className="relative z-10 w-full max-w-[420px]"
        style={{ animation: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3.5">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
              <circle cx="21" cy="21" r="13" stroke="#C9A459" strokeWidth="1"/>
              <circle cx="21" cy="21" r="7" stroke="#C9A459" strokeWidth="0.75" opacity="0.5"/>
              <circle cx="21" cy="21" r="2.5" fill="#C9A459"/>
              <line x1="21" y1="4" x2="21" y2="8" stroke="#C9A459" strokeWidth="1" strokeLinecap="round"/>
              <line x1="21" y1="34" x2="21" y2="38" stroke="#C9A459" strokeWidth="1" strokeLinecap="round"/>
              <line x1="4" y1="21" x2="8" y2="21" stroke="#C9A459" strokeWidth="1" strokeLinecap="round"/>
              <line x1="34" y1="21" x2="38" y2="21" stroke="#C9A459" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </div>
          <div
            className="text-[38px] font-light tracking-[0.28em] text-white leading-none mb-1.5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            OLHARI
          </div>
          <div className="text-[10.5px] tracking-[0.22em] uppercase text-white/40">
            Fotografia Profissional
          </div>
        </div>

        {/* Card */}
        <div
          className="relative rounded-[16px] overflow-hidden"
          style={{
            background: '#252525',
            border: '0.5px solid rgba(226,185,107,0.15)',
          }}
        >
          {/* Linha dourada topo */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,164,89,0.3), transparent)' }}
          />

          <form onSubmit={handleSubmit} noValidate className="px-9 py-10">

            {/* Erro geral da API */}
            {apiError && (
              <div className="mb-5 px-4 py-3 rounded-[8px] bg-[rgba(226,92,92,0.1)] border border-[rgba(226,92,92,0.3)] flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E25C5C" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span className="text-[13px] text-[#E25C5C]">{apiError}</span>
              </div>
            )}

            {/* E-mail */}
            <div className="mb-5">
              <label className="block text-[11px] tracking-[0.12em] uppercase text-white/45 mb-2">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className={`${inputBase} ${errors.email ? inputError : ''}`}
              />
              {errors.email && (
                <p className="mt-1.5 text-[12px] text-[#E25C5C]">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div className="mb-6">
              <label className="block text-[11px] tracking-[0.12em] uppercase text-white/45 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={form.senha}
                  onChange={(e) => set('senha', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className={`${inputBase} pr-12 ${errors.senha ? inputError : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-white/35 hover:text-white/70 transition-colors"
                >
                  {showPass ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="mt-1.5 text-[12px] text-[#E25C5C]">{errors.senha}</p>
              )}
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3.5 rounded-[8px]
                bg-[#E2B96B] text-[#1A1200]
                text-[12px] font-medium tracking-[0.2em] uppercase
                transition-all duration-200
                hover:bg-[#F0CC84] hover:-translate-y-px
                disabled:opacity-75 disabled:cursor-not-allowed disabled:translate-y-0
                flex items-center justify-center gap-2.5
              "
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[rgba(26,18,0,0.3)] border-t-[#1A1200] animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>

            {/* Divider */}
            <div className="my-6 h-px bg-white/[0.08]" />

            {/* Esqueci senha */}
            <button
              type="button"
              className="w-full text-center text-[12.5px] text-white/35 hover:text-[#E2B96B] transition-colors"
              onClick={() => alert('Entre em contato com o suporte.')}
            >
              Esqueci minha senha
            </button>

          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
