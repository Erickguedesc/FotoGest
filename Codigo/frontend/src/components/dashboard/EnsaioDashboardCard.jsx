import { useState } from 'react'
import { CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import logoOlhari from '../../assets/logo.jpg'

const STATUS_CONFIG = {
  EM_EDICAO: {
    label: 'Em edição',
    color: 'border-blue-300/40 bg-black/75 text-blue-200 shadow-lg shadow-black/40',
  },

  EM_SELECAO: {
    label: 'Em seleção',
    color: 'border-amber-300/40 bg-black/75 text-amber-200 shadow-lg shadow-black/40',
  },

  REALIZADO: {
    label: 'Realizado',
    color: 'border-emerald-300/40 bg-black/75 text-emerald-200 shadow-lg shadow-black/40',
  },
}

export default function EnsaioDashboardCard({ ensaio }) {
  const [imageError, setImageError] = useState(false)

  const status = STATUS_CONFIG[ensaio.status] || {
    label: ensaio.status,
    color: 'border-white/10 bg-white/10 text-white/60',
  }

  const hasImage = ensaio.capaUrl && !imageError

  return (
    <Link
      to={`/ensaios/${ensaio.id}`}
      className="block overflow-hidden rounded-3xl border border-white/10 bg-[#171717] transition hover:-translate-y-1 hover:border-[#D4AF37]/40"
    >
      <div className="relative h-56 overflow-hidden bg-[#111111]">
        {hasImage ? (
          <img
            src={ensaio.capaUrl}
            alt={ensaio.clienteNome}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#111111] px-6 text-center">
            <img
              src={logoOlhari}
              alt="Olhari"
              className="mb-4 w-28 opacity-80"
            />

            <p className="text-sm tracking-wide text-white/45">
              Sem fotos publicadas no momento
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="absolute right-4 top-4">
          <span
            className={`rounded-full border px-4 py-2 text-sm font-medium ${status.color}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <h3 className="text-2xl font-medium text-white">
            {ensaio.clienteNome}
          </h3>

          <p className="mt-1 text-sm text-white/50">
            {ensaio.tipo}
          </p>
        </div>

        <div className="space-y-2 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} />

            {new Date(ensaio.dataEnsaio).toLocaleDateString('pt-BR')}
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {ensaio.local}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-white/50">
            <span>Progresso</span>
            <span>{ensaio.progresso || 0}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#D4AF37]"
              style={{
                width: `${ensaio.progresso || 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}