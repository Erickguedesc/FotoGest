import { Eye, LayoutDashboard, ShieldCheck, Sparkles, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'fotogest_admin_mode_notice_seen'

export default function AdminModeNoticeModal({ open, onClose }) {
  if (!open) {
    return null
  }

  const handleClose = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-md">
      <button
        type="button"
        aria-label="Fechar aviso"
        className="absolute inset-0 cursor-default"
        onClick={handleClose}
      />

      <section className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl shadow-black/60">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--gold)]" />

        <div className="relative px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]">
              <ShieldCheck size={24} aria-hidden="true" />
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Fechar"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/55 transition hover:border-[var(--gold-border)] hover:text-[var(--gold)]"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
            Modo administrador ativo
          </p>

          <h2 className="mt-3 font-serif text-3xl font-light leading-tight text-white sm:text-4xl">
            Você está visualizando a versão de edição.
          </h2>

          <p className="mt-4 text-sm leading-7 text-white/68">
            Por isso, esta tela exibe botões como editar, adicionar produtos e
            outros controles internos. Para clientes e usuários comuns, a
            experiência aparece limpa, sem ferramentas administrativas.
          </p>

          <div className="mt-6 border-y border-white/10">
            <div className="flex items-start gap-3 py-4">
              <Eye className="mt-0.5 text-[var(--gold)]" size={20} aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
                  Cliente
                </p>
                <p className="mt-1.5 text-xs leading-5 text-white/50">
                  Vê a página sem botões de edição.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-white/10 py-4">
              <Sparkles className="mt-0.5 text-[var(--gold)]" size={20} aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
                  Administrador
                </p>
                <p className="mt-1.5 text-xs leading-5 text-white/55">
                  Pode editar a home e acessar o sistema.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-white/12 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/65 transition hover:border-white/30 hover:text-white"
            >
              Continuar aqui
            </button>

            <Link
              to="/dashboard"
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#1A1200] transition hover:bg-[#E2C07A]"
            >
              <LayoutDashboard size={16} aria-hidden="true" />
              Acessar dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export { STORAGE_KEY as ADMIN_NOTICE_STORAGE_KEY }
