import { Building2, Image, LockKeyhole, SlidersHorizontal, User } from 'lucide-react'

const tabs = [
  {
    id: 'fotografa',
    label: 'Dados da fotógrafa',
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
  label: 'Marca d’água',
  description: 'Proteção das fotos da galeria',
  icon: Image,
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
                : 'border-white/10 bg-[#141414] hover:border-white/20 hover:bg-white/[0.03]'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`rounded-xl border p-2 ${
                  active
                    ? 'border-[var(--gold-border)] text-[var(--gold)]'
                    : 'border-white/10 text-white/45'
                }`}
              >
                <Icon size={18} />
              </span>

              <span>
                <span className="block text-sm font-medium text-white">
                  {tab.label}
                </span>

                <span className="mt-1 block text-xs text-white/35">
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