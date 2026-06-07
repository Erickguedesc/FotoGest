import { useState } from 'react'
import { CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import logoFotoGest from '../../assets/logofotogest.png'

const STATUS_CONFIG = {
  EM_EDICAO: {
    label: 'Em edição',
    description: 'Edição em andamento',
    color: 'border-[#7dd3fc]/55 bg-black/80 text-[#7dd3fc] shadow-lg shadow-black/45',
  },

  EM_SELECAO: {
    label: 'Em seleção',
    description: 'Seleção enviada',
    color: 'border-[#fbbf24]/60 bg-black/80 text-[#fbbf24] shadow-lg shadow-black/45',
  },

  REALIZADO: {
    label: 'Realizado',
    description: 'Aguardando próximos passos',
    color: 'border-[#34d399]/60 bg-black/80 text-[#34d399] shadow-lg shadow-black/45',
  },

  FINALIZADO: {
    label: 'Finalizado',
    description: 'Entrega finalizada',
    color: 'border-[#d4af37]/60 bg-black/80 text-[#d4af37] shadow-lg shadow-black/45',
  },
}

export default function EnsaioDashboardCard({ ensaio }) {
  const [imageError, setImageError] = useState(false)

  const status = STATUS_CONFIG[ensaio.status] || {
    label: ensaio.status,
    description: 'Em acompanhamento',
    color: 'border-white/10 bg-white/10 text-white/60',
  }

  const hasImage = ensaio.capaUrl && !imageError
  const isCapaPadrao = Number(ensaio.totalFotos || 0) === 0
  const progressDescription = isCapaPadrao
    ? 'Aguardando envio das fotos'
    : status.description

  return (
    <Link
      to={`/ensaios/${ensaio.id}`}
      className="theme-card block overflow-hidden rounded-2xl border transition hover:-translate-y-0.5 hover:border-[var(--gold-border)]"
    >
      <div className="theme-panel relative h-32 overflow-hidden">
        {hasImage ? (
          <img
            src={ensaio.capaUrl}
            alt={ensaio.clienteNome}
            onError={() => setImageError(true)}
            className={`h-full w-full transition duration-500 hover:scale-[1.02] ${
              isCapaPadrao
                ? 'object-contain bg-[#0b0b0b] p-4'
                : 'object-cover hover:scale-105'
            }`}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#111111] px-4 text-center">
            <img
              src={logoFotoGest}
              alt="FotoGest"
              className="mb-2 w-20 opacity-80"
            />

            <p className="text-[11px] tracking-wide text-white/45">
              Sem fotos publicadas no momento
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="absolute right-4 top-4">
          <span
            className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${status.color}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-3.5">
        <div>
          <h3 className="theme-title line-clamp-1 text-[15px] font-medium leading-tight">
            {ensaio.clienteNome}
          </h3>

          <p className="theme-muted mt-1 truncate text-[12px]">
            {ensaio.tipoExibicao || ensaio.tipo}
          </p>
        </div>

        <div className="theme-text space-y-1.5 text-[12px]">
          <div className="flex items-center gap-2">
            <CalendarDays size={13} />

            {new Date(ensaio.dataEnsaio).toLocaleDateString('pt-BR')}
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{ensaio.local}</span>
          </div>
        </div>

        <div>
          <div className="theme-muted mb-1.5 flex items-center justify-between text-[11px]">
            <span>Progresso</span>
            <span>{ensaio.progresso || 0}%</span>
          </div>

          <div className="theme-soft h-1.5 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-[var(--gold)]"
              style={{
                width: `${ensaio.progresso || 0}%`,
              }}
            />
          </div>

          <p className="mt-2 min-h-[32px] text-[12px] font-medium leading-4 text-[var(--text-muted)]">
            {progressDescription}
          </p>
        </div>
      </div>
    </Link>
  )
}
