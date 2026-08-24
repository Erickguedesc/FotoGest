import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertCircle,
  CircleCheck,
  Eye,
  EyeOff,
  Folder,
  Image as ImageIcon,
  Loader2,
  Mail,
} from 'lucide-react'
import api from '../services/api'
import loginBrand from '../assets/login-brand.png'
import loginScene from '../assets/login-scene.png'

const LOGIN_DISPLAY_NAME_KEY = 'fotolhar-login-display-name'

function getLoginDisplayNameKey(email = '') {
  const normalizedEmail = email.trim().toLowerCase()
  return normalizedEmail ? `${LOGIN_DISPLAY_NAME_KEY}:${normalizedEmail}` : LOGIN_DISPLAY_NAME_KEY
}

const benefitCards = [
  {
    icon: Folder,
    title: 'Organize seus trabalhos',
    text: 'Centralize clientes, contratos, ensaios, arquivos e tarefas em um só lugar.',
  },
  {
    icon: CircleCheck,
    title: 'Status e aprovações',
    text: 'Acompanhe e gerencie status, seleções, feedbacks e notificações com mais agilidade.',
  },
  {
    icon: ImageIcon,
    title: 'Galerias e relatórios',
    text: 'Entregue galerias privadas para seus clientes selecionarem as melhores fotos, consulte seus relatórios e muito mais!',
  },
]

function GoogleIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.63 6.63 0 0 1 5.49 12c0-.73.13-1.43.35-2.1V7.06H2.18A10.99 10.99 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A10.99 10.99 0 0 0 2.18 7.06L5.84 9.9c.87-2.6 3.3-4.52 6.16-4.52Z"
      />
    </svg>
  )
}

function isGenericDisplayName(name = '') {
  const normalized = name.trim().toLowerCase()
  return [
    'seu estudio',
    'seu estúdio',
    'seu estudio fotografico',
    'seu estúdio fotográfico',
  ].includes(normalized)
}

function getStoredDisplayName(email = '') {
  const storedName = localStorage.getItem(getLoginDisplayNameKey(email)) || ''
  return isGenericDisplayName(storedName) ? '' : storedName
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [displayName, setDisplayName] = useState('')
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(
    searchParams.get('motivo') === 'sessao-expirada'
      ? 'Sua sessão expirou ou ficou inválida. Faça login novamente.'
      : '',
  )

  useEffect(() => {
    document.documentElement.classList.add('login-scrollbar-hidden')

    return () => {
      document.documentElement.classList.remove('login-scrollbar-hidden')
    }
  }, [])

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    if (apiError) setApiError('')
  }

  useEffect(() => {
    setDisplayName(getStoredDisplayName(form.email))
  }, [form.email])

  function validate() {
    const e = {}
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Insira um e-mail válido'
    }
    if (!form.senha || form.senha.length < 6) {
      e.senha = 'A senha deve ter pelo menos 6 caracteres'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setApiError('')

    try {
      const res = await api.post('/auth/login', {
        email: form.email,
        senha: form.senha,
      })

      const { token, nome, email, nomeExibicao, nomeEstudio, nomeComercial, onboardingConcluido } = res.data
      const loginDisplayName = [nomeExibicao, nomeComercial, nomeEstudio, nome]
        .find((value) => value && !isGenericDisplayName(value))

      localStorage.removeItem('fotolhar-usuario-perfil')
      localStorage.setItem('token', token)
      localStorage.setItem('usuarioNome', nome)
      localStorage.setItem('usuarioEmail', email)
      const onboardingPrefix = `fotolhar:onboarding:${email.trim().toLowerCase()}`
      if (onboardingConcluido) {
        localStorage.setItem(`${onboardingPrefix}:complete`, 'true')
      } else {
        localStorage.removeItem(`${onboardingPrefix}:complete`)
        localStorage.removeItem(`${onboardingPrefix}:completedAt`)
      }
      if (loginDisplayName) {
        localStorage.setItem(getLoginDisplayNameKey(email), loginDisplayName)
        setDisplayName(loginDisplayName)
      }

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

  const loginCardSurface =
    'rounded-[8px] border border-white/80 bg-white/[0.96] shadow-[0_18px_50px_rgba(48,38,29,0.14)]'

  const inputBase = `
    w-full rounded-[8px] border border-[#d8d2cc] bg-white/[0.72] px-4 py-[14px]
    text-[15px] text-[#1f2a32] outline-none transition-all duration-200
    placeholder:text-[#8c969d] hover:border-[#c8b8aa]
    focus:border-[#bf4b25] focus:bg-white focus:shadow-[0_0_0_3px_rgba(191,75,37,0.11)]
  `
  const inputError = 'border-[#d05757] bg-[#fff8f8] focus:border-[#d05757]'
  const validDisplayName = displayName && !isGenericDisplayName(displayName) ? displayName.trim() : ''

  return (
    <main className="theme-static min-h-screen overflow-x-hidden bg-[#f4ece4] text-[#1f2a32]">
<section className="relative min-h-[880px] overflow-hidden pb-10 sm:min-h-[900px] lg:min-h-[930px]">        <img
          src={loginScene}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-left-top opacity-[0.18] md:inset-y-0 md:left-0 md:w-[60%] md:opacity-100"
        />
        <div className="pointer-events-none absolute inset-y-0 left-[42%] hidden w-[28%] bg-[linear-gradient(90deg,rgba(244,236,228,0)_0%,#f4ece4_78%)] md:block" />

        <div className="relative z-10 mx-auto grid w-full max-w-[1244px] items-start gap-7 px-5 pt-8 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(520px,568px)] md:pt-12 lg:px-0 lg:pt-14">
          <div className="hidden md:block" aria-hidden="true" />

          <div>
           <div className="mx-auto mb-5 h-[110px] w-full max-w-[480px] overflow-visible">
  <img
    src={loginBrand}
    alt="Fotolhar - Seu olhar cria. O Fotolhar organiza."
    className="h-full w-full object-cover object-center scale-[1.10]"
  />
</div>

            <form onSubmit={handleSubmit} noValidate className={`${loginCardSurface} w-full px-6 py-7 sm:px-10 sm:py-9`}>
              <p className="mb-3 text-[13px] font-bold uppercase tracking-normal text-[#bf4b25]">
                Login do usuário
              </p>
              <h1 className="font-serif text-[2.15rem] font-normal leading-tight text-[#1f2a32] sm:text-[2.75rem]">
                {validDisplayName ? `Olá, ${validDisplayName}` : 'Bem-vindo(a)!'}
              </h1>
              <p className="mt-3 max-w-[390px] text-[16px] leading-7 text-[#68737b]">
                {validDisplayName
                  ? 'Acesse sua conta para continuar organizando seus clientes, ensaios e galerias.'
                  : 'Entre para gerenciar seus clientes, ensaios, galerias e muito mais!'}
              </p>

              {apiError && (
                <div className="mt-6 flex items-start gap-3 rounded-[8px] border border-[#dfb5ac] bg-[#fff4f1] px-4 py-3 text-[#a13a21]">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span className="text-[13.5px]">{apiError}</span>
                </div>
              )}

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-[14px] font-bold text-[#1f2a32]" htmlFor="email">
                    E-mail
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      className={`${inputBase} pr-12 ${errors.email ? inputError : ''}`}
                    />
                    <Mail
                      size={20}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7e8990]"
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-[12.5px] text-[#c04435]">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-bold text-[#1f2a32]" htmlFor="senha">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="senha"
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={form.senha}
                      onChange={(e) => set('senha', e.target.value)}
                      className={`${inputBase} pr-12 ${errors.senha ? inputError : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[8px] text-[#7e8990] transition hover:bg-[#f0e6db] hover:text-[#bf4b25]"
                      aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                      title={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.senha && <p className="mt-1.5 text-[12.5px] text-[#c04435]">{errors.senha}</p>}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-[13.5px] text-[#68737b]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-[#c7bdb4] accent-[#bf4b25]"
                  />
                  Manter conectado
                </label>
                <button
                  type="button"
                  className="text-[13.5px] font-medium text-[#bf4b25] transition hover:text-[#923315]"
                  onClick={() => alert('Entre em contato com o suporte.')}
                >
                  Esqueci minha senha
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#bf4b25] px-5 py-4 text-[13px] font-bold uppercase tracking-normal text-white shadow-[0_10px_24px_rgba(191,75,37,0.24)] transition hover:-translate-y-px hover:bg-[#a83f1f] disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar na conta'
                )}
              </button>

              <div className="my-6 flex items-center gap-4 text-[13px] text-[#68737b]">
                <span className="h-px flex-1 bg-[#d8d2cc]" />
                ou
                <span className="h-px flex-1 bg-[#d8d2cc]" />
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-4 rounded-[8px] border border-[#d8d2cc] bg-white/[0.65] px-5 py-3.5 text-[15px] font-medium text-[#38454d] transition hover:border-[#c8b8aa] hover:bg-white"
                onClick={() => alert('Login com Google ainda não está configurado.')}
              >
                <GoogleIcon />
                Entrar com Google
              </button>

              <p className="mt-5 text-center text-[13.5px] text-[#68737b]">
                Ainda não tem uma conta?{' '}
                <button
                  type="button"
                  className="font-medium text-[#bf4b25] transition hover:text-[#923315]"
                  onClick={() => alert('Entre em contato com nossa equipe.')}
                >
                  Fale com nossa equipe
                </button>
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e2dbd3] bg-white/[0.78]">
        <div className="mx-auto grid w-full max-w-[1244px] gap-0 px-5 py-7 sm:px-8 md:grid-cols-3 lg:px-0">
          {benefitCards.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="flex min-h-[112px] items-center gap-5 border-[#ddd4ca] px-6 py-4 md:border-r md:last:border-r-0 lg:px-8"
            >
              <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-full bg-[#f5efe8] text-[#a8783a]">
                <Icon size={31} strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-[17px] font-bold leading-tight text-[#1f2a32]">{title}</h2>
                <p className="mt-2 text-[13.5px] leading-5 text-[#68737b]">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
