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
            className={`group flex min-w-[240px] items-center gap-4 rounded-[16px] border bg-white px-4 py-4 text-left shadow-[0_12px_28px_rgba(82,58,35,0.045)] transition lg:w-full lg:min-w-0 ${
              active
                ? 'border-[#bf812b] bg-[#fffaf2] shadow-[0_14px_30px_rgba(168,120,58,0.09)]'
                : 'border-[#e8dfd5] hover:border-[#d7b079] hover:bg-[#fffdf9]'
            }`}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border ${
                active
                  ? 'border-[#e8cfa7] bg-[#fff4df] text-[#b97018]'
                  : 'border-[#ebe3da] bg-[#fbfaf8] text-[#6f6257] group-hover:text-[#b97018]'
              }`}
            >
              <Icon size={18} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-[#211b17]">
                {tab.label}
              </span>

              <span className="mt-1 block truncate text-xs text-[#756a61]">
                {tab.description}
              </span>
            </span>

            <ChevronRight
              size={17}
              className={`shrink-0 transition ${
                active ? 'text-[#b97018]' : 'text-[#9a9087] group-hover:text-[#b97018]'
              }`}
            />
          </button>
        )
      })}
    </aside>
  )
}
