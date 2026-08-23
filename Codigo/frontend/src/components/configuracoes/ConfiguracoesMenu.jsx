import { Building2, Download, FileText, Image, LockKeyhole, Mail, SlidersHorizontal, User } from 'lucide-react'

const tabs = [
  {
    id: 'usuario',
    label: 'Seus Dados',
    description: 'Perfil, login e foto do painel',
    icon: User,
  },
  {
    id: 'estudio',
    label: 'Dados do estudio/empresa',
    description: 'Logo, contato e dados dos PDFs',
    icon: Building2,
  },
  {
    id: 'marcaDagua',
    label: "Marca d'agua",
    description: 'Protecao das fotos da galeria',
    icon: Image,
  },
  {
    id: 'modelosContrato',
    label: 'Modelos de contrato',
    description: 'Clausulas do pre-contrato',
    icon: FileText,
  },
  {
    id: 'senha',
    label: 'Alterar senha',
    description: 'Atualize sua senha de acesso',
    icon: LockKeyhole,
  },
  {
    id: 'preferencias',
    label: 'Preferencias do sistema',
    description: 'Padroes para ensaios e albuns',
    icon: SlidersHorizontal,
  },
  {
    id: 'email',
    label: 'E-mails',
    description: 'Notificacoes automaticas',
    icon: Mail,
  },
  {
    id: 'backup',
    label: 'Backup',
    description: 'Copia dos dados do sistema',
    icon: Download,
  },
]

export default function ConfiguracoesMenu({ activeTab, onChange }) {
  return (
    <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = activeTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`w-full rounded-2xl border p-4 text-left transition ${
              active
                ? 'border-[var(--gold-border)] bg-[var(--gold-dim)]'
                : 'theme-card hover:border-[var(--gold-border)]'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`rounded-xl border p-2 ${
                  active
                    ? 'border-[var(--gold-border)] text-[var(--gold)]'
                    : 'border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                <Icon size={18} />
              </span>

              <span>
                <span className="theme-title block text-sm font-medium">
                  {tab.label}
                </span>

                <span className="theme-muted mt-1 block text-xs">
                  {tab.description}
                </span>
              </span>
            </div>
          </button>
        )
      })}
    </aside>
  )
}
