import { Clock3 } from 'lucide-react'
import { formatarDataExpiracao } from '../../../services/galeriaUtils'

export default function GalleryHero({
  coverUrl,
  nomeCliente,
  tipoEnsaio,
  dataFormatada,
  limite,
  expiraEm,
  tempoRestante,
}) {
  return (
    <section className="relative flex min-h-[76vh] items-center justify-center overflow-hidden px-6 py-20 text-center text-white">
      <div className="absolute inset-0 bg-[#110e0b]">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover opacity-60 brightness-75 saturate-75"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/30 to-[#110e0b]/80" />
      </div>

      <div className="relative z-10 max-w-5xl">
        <p className="mx-auto mb-5 inline-flex rounded-full border border-white/20 px-5 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white/55">
          Álbum exclusivo
        </p>

        <p className="mt-8 font-serif text-lg italic text-white/60">
          Bem-vindo(a)
        </p>

        <h1 className="mx-auto mt-3 max-w-4xl break-words font-serif text-5xl font-light leading-tight tracking-normal">
          {nomeCliente}
        </h1>

        <p className="mt-5 font-serif text-2xl italic text-white/65">
          {tipoEnsaio}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <div className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.12em] text-white/65 backdrop-blur">
            Ensaio em {dataFormatada}
          </div>

          <div className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.12em] text-white/65 backdrop-blur">
            {limite} fotos no pacote
          </div>
        </div>

        {expiraEm && tempoRestante ? (
          <div
            className={`mx-auto mt-8 inline-flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border px-4 py-2 text-[12px] backdrop-blur-xl ${
              tempoRestante.dias <= 3
                ? 'border-red-300/35 bg-red-500/10 text-red-50'
                : 'border-white/15 bg-white/10 text-white/70'
            }`}
          >
            <Clock3 size={14} strokeWidth={1.8} />

            <span className="font-medium">
              Álbum expira em {formatarDataExpiracao(expiraEm)}
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-current opacity-45 sm:block" />

            <span className="text-white/50">
              {tempoRestante.dias > 0
                ? `${tempoRestante.dias} dias restantes`
                : `${String(tempoRestante.horas).padStart(2, '0')}h ${String(tempoRestante.minutos).padStart(2, '0')}min restantes`}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  )
}
