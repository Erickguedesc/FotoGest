import { Settings } from 'lucide-react'

export default function ConfiguracoesHeader() {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--gold)]">
          <Settings size={15} />
          Configurações
        </div>

        <h1 className="font-serif text-4xl font-light text-white">
          Minha conta
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-white/45">
          Gerencie os dados da fotógrafa, informações do estúdio, segurança da
          conta e preferências usadas no sistema.
        </p>
      </div>
    </div>
  )
}