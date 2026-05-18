import SectionTitle from './SectionTitle'

const formatarDataHora = (valor) => {
  if (!valor) return null

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) return null

  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const albumEstaExpirado = (valor) => {
  if (!valor) return false

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) return false

  return data < new Date()
}

export default function PublicacaoCard({
  album,
  totalFotos = 0,
  loading,
  albumPublicado,
  onPublicar,
  onReabrir,
  onCopyLink,
  onWhatsApp,
}) {
  const temAlbum = Boolean(album?.urlAcesso)

  const expiraEm =
    album?.expiraEm ||
    album?.dataExpiracao ||
    album?.expira_em ||
    null

  const expiraEmFormatado = formatarDataHora(expiraEm)
  const expirado = albumEstaExpirado(expiraEm)

  const buttonLabel = loading
    ? 'Processando...'
    : albumPublicado
      ? 'Gerar nova senha'
      : temAlbum
        ? 'Publicar novamente'
        : 'Publicar álbum'

  return (
    <section className="rounded-2xl border border-[var(--gold-border)] bg-[#121212]">
      <SectionTitle title="Publicação" />

      <div className="p-5">
        <button
          type="button"
          disabled={loading}
          onClick={onPublicar}
          className="w-full rounded-lg bg-[var(--gold)] px-5 py-3 text-[13px] font-semibold tracking-[0.12em] text-[#1A1200] transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {buttonLabel}
        </button>

        {albumPublicado && (
          <button
            type="button"
            disabled={loading}
            onClick={onReabrir}
            className="mt-3 w-full rounded-lg border border-orange-400/35 bg-orange-400/10 px-5 py-3 text-[12px] font-medium tracking-[0.10em] text-orange-200 transition hover:bg-orange-400/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reabrir álbum para edição
          </button>
        )}

        {temAlbum && (
          <div className="mt-4 rounded-xl border border-white/[0.08] bg-black/10 p-4">
            <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-white/35">
              Link gerado
            </p>

            <p className="break-all text-[12px] text-white/70">
              {album.urlAcesso}
            </p>

      {expiraEmFormatado && (
  <div
    className={`mt-3 flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-[11px] ${
      expirado
        ? 'border-red-400/25 bg-red-400/10'
        : 'border-white/[0.08] bg-black/10'
    }`}
  >
    <span
      className={`uppercase tracking-[0.14em] ${
        expirado ? 'text-red-200/70' : 'text-white/35'
      }`}
    >
      {expirado ? 'Expirado em' : 'link válido até'}
    </span>

    <span
      className={`whitespace-nowrap font-medium ${
        expirado ? 'text-red-200' : 'text-[var(--gold)]'
      }`}
    >
      {expiraEmFormatado}
    </span>
  </div>
)}

            {album?.senhaAcesso && (
              <>
                <p className="mb-1 mt-4 text-[10px] uppercase tracking-[0.16em] text-white/35">
                  Senha
                </p>

                <p className="font-mono text-[18px] tracking-[0.18em] text-[var(--gold)]">
                  {album.senhaAcesso}
                </p>
              </>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onCopyLink}
                className="rounded-lg border border-[var(--gold-border)] px-3 py-2 text-[11px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
              >
                Copiar link
              </button>

              <button
                type="button"
                onClick={onWhatsApp}
                className="rounded-lg border border-[var(--gold-border)] px-3 py-2 text-[11px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
              >
                WhatsApp
              </button>
            </div>
          </div>
        )}

        {!albumPublicado && temAlbum && (
          <div className="mt-4 rounded-xl border border-orange-400/25 bg-orange-400/10 p-4 text-[12px] leading-5 text-orange-200">
            Álbum reaberto para edição. O acesso da cliente está pausado até a próxima publicação.
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="Fotos" value={totalFotos} />
          <Stat label="Views" value={album?.views ?? 0} />
          <Stat label="Seguro" value={albumPublicado ? 'Sim' : temAlbum ? 'Pausado' : 'Não'} />
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-black/10 px-2 py-3">
      <p className="text-[13px] text-white">{value}</p>

      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/30">
        {label}
      </p>
    </div>
  )
}
