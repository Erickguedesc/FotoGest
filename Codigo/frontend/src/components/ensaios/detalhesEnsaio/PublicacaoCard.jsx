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
    <section className="theme-card rounded-2xl border border-[var(--gold-border)]">
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
            className="mt-3 w-full rounded-lg border border-orange-400/40 bg-orange-400/10 px-5 py-3 text-[12px] font-semibold tracking-[0.10em] text-orange-300 transition hover:bg-orange-400/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reabrir álbum para edição
          </button>
        )}

        {temAlbum && (
          <div className="theme-panel mt-4 rounded-xl border p-4">
            <p className="theme-muted mb-1 text-[10px] uppercase tracking-[0.16em]">
              Link gerado
            </p>

            <p className="theme-text break-all text-[12px]">
              {album.urlAcesso}
            </p>

      {expiraEmFormatado && (
  <div
    className={`mt-3 flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-[11px] ${
      expirado
        ? 'border-red-400/25 bg-red-400/10'
        : 'border-[var(--border)] bg-[var(--card)]'
    }`}
  >
    <span
      className={`uppercase tracking-[0.14em] ${
        expirado ? 'text-red-300' : 'text-[var(--text-muted)]'
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
                <p className="theme-muted mb-1 mt-4 text-[10px] uppercase tracking-[0.16em]">
                  Senha
                </p>

                <p className="font-mono text-[18px] tracking-[0.18em] text-[var(--gold)]">
                  {album.senhaAcesso}
                </p>
              </>
            )}

          </div>
        )}

        {!albumPublicado && temAlbum && (
          <div className="mt-4 rounded-xl border border-orange-400/35 bg-orange-400/10 p-4 text-[12px] font-medium leading-5 text-orange-300">
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
    <div className="theme-panel rounded-lg border px-2 py-3">
      <p className="theme-title text-[13px]">{value}</p>

      <p className="theme-muted mt-1 text-[10px] uppercase tracking-[0.14em]">
        {label}
      </p>
    </div>
  )
}
