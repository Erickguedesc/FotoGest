import { formatarDataExpiracao } from '../../../services/galeriaUtils'

export default function GalleryHero({
  coverUrl,
  nomeCliente,
  tipoEnsaio,
  dataFormatada,
  localEnsaio,
  totalFotos,
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

      <div className="relative z-10 max-w-4xl">
        <p className="mb-10 font-serif text-sm italic tracking-[0.28em] text-white/55">
          FotoGest · Fotografia
        </p>

        <p className="mx-auto mb-5 inline-flex rounded-full border border-white/20 px-5 py-1.5 text-[11px] uppercase tracking-[0.24em] text-white/55">
          Álbum exclusivo
        </p>

        <h1 className="font-serif text-6xl font-light leading-none tracking-tight md:text-8xl">
          {nomeCliente}
        </h1>

        <p className="mt-5 font-serif text-2xl italic tracking-[0.08em] text-white/65">
          {tipoEnsaio}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <div className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.12em] text-white/65 backdrop-blur">
            {dataFormatada}
          </div>

          <div className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.12em] text-white/65 backdrop-blur">
            {localEnsaio}
          </div>

          <div className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.12em] text-white/65 backdrop-blur">
            {totalFotos} fotografias
          </div>

          <div className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.12em] text-white/65 backdrop-blur">
            Até {limite} no pacote
          </div>
        </div>

        {expiraEm && tempoRestante ? (
          <div
            className={`mx-auto mt-8 max-w-xl rounded-2xl border px-6 py-5 backdrop-blur-xl ${
              tempoRestante.dias <= 3
                ? 'border-red-400/40 bg-red-500/10'
                : 'border-white/15 bg-white/10'
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">
              Álbum disponível por tempo limitado
            </p>

            <h3 className="mt-2 font-serif text-3xl font-light text-white">
              Expira em {tempoRestante.dias} dias,{' '}
              {String(tempoRestante.horas).padStart(2, '0')}h e{' '}
              {String(tempoRestante.minutos).padStart(2, '0')}min
            </h3>

            <p className="mt-2 text-sm text-white/60">
              Disponível até {formatarDataExpiracao(expiraEm)}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
