import {
  Building2,
  ChevronRight,
  Download,
  Droplet,
  FileText,
  LockKeyhole,
  Mail,
  SlidersHorizontal,
  User,
} from 'lucide-react'

const tabs = [
  {
    id: 'usuario',
    label: 'Seus dados',
    description: 'Perfil, login e foto do painel',
    icon: User,
  },
  {
    id: 'estudio',
    label: 'Dados do estúdio/empresa',
    description: 'Logo, contato e dados dos PDFs',
    icon: Building2,
  },
  {
    id: 'marcaDagua',
    label: "Marca d'água",
    description: 'Proteção das fotos da galeria',
    icon: Droplet,
  },
  {
    id: 'modelosContrato',
    label: 'Modelos de contrato',
    description: 'Cláusulas do pré-contrato',
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
    label: 'Preferências do sistema',
    description: 'Padrões para ensaios e álbuns',
    icon: SlidersHorizontal,
  },
  {
    id: 'email',
    label: 'E-mails',
    description: 'Notificações automáticas',
    icon: Mail,
  },
  {
    id: 'backup',
    label: 'Backup',
    description: 'Cópia dos dados do sistema',
    icon: Download,
  },
]

export default function ConfiguracoesMenu({ activeTab, onChange }) {
  return (
    <aside className="theme-scrollbar flex gap-3 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = activeTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`group flex min-w-[240px] items-center gap-4 rounded-[16px] border bg-white px-4 py-4 text-left shadow-[0_12px_28px_rgba(31,31,33,0.04)] transition lg:w-full lg:min-w-0 ${
              active
                ? 'border-[#C84F32] bg-[#F8EDE8] shadow-[0_14px_30px_rgba(200,79,50,0.09)]'
                : 'border-[#E8E3DF] hover:border-[#E9A08B] hover:bg-[#F7F7F8]'
            }`}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border ${
                active
                  ? 'border-[#E9A08B] bg-[#F8EDE8] text-[#C84F32]'
                  : 'border-[#E8E3DF] bg-[#F5F3F1] text-[#6F6D6B] group-hover:text-[#C84F32]'
              }`}
            >
              <Icon size={18} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-[#1F1F21]">
                {tab.label}
              </span>

              <span className="mt-1 block truncate text-xs text-[#6F6D6B]">
                {tab.description}
              </span>
            </span>

            <ChevronRight
              size={17}
              className={`shrink-0 transition ${
                active ? 'text-[#C84F32]' : 'text-[#96928E] group-hover:text-[#C84F32]'
              }`}
            />
          </button>
        )
      })}
    </aside>
  )
}
