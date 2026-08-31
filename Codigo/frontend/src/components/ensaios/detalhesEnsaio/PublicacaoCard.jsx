import { Eye, ImageIcon, Send, Shield } from 'lucide-react'

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
    <section className="rounded-[14px] border border-[var(--border)] bg-white/78 p-4 shadow-[0_14px_34px_rgba(78,56,35,0.07)]">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--gold-dim)] text-[var(--gold)]">
          <Send size={16} strokeWidth={1.8} />
        </span>

        <h2 className="text-[16px] font-semibold text-[var(--text)]">
          Publicação
        </h2>
      </div>

      <div>
        <button
          type="button"
          disabled={loading}
          onClick={onPublicar}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#b97804] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(166,95,0,0.18)] transition hover:bg-[#a65f00] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={15} strokeWidth={1.9} />
          {buttonLabel}
        </button>

        {albumPublicado && (
          <button
            type="button"
            disabled={loading}
            onClick={onReabrir}
            className="mt-3 w-full rounded-[10px] border border-orange-200 bg-orange-50 px-5 py-3 text-[12px] font-semibold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reabrir álbum para edição
          </button>
        )}

        {temAlbum && (
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-white/55 p-4">
            <p className="mb-1 text-[11px] text-[var(--text-muted)]">
              Link gerado
            </p>

            <p className="break-all text-[12px] text-[var(--text)]">
              {album.urlAcesso}
            </p>

      {expiraEmFormatado && (
  <div
    className={`mt-3 flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-[11px] ${
      expirado
        ? 'border-red-400/25 bg-red-400/10'
        : 'border-[var(--border)] bg-white/65'
    }`}
  >
    <span
      className={`uppercase tracking-[0.14em] ${
        expirado ? 'text-red-700' : 'text-[var(--text-muted)]'
      }`}
    >
      {expirado ? 'Expirado em' : 'link válido até'}
    </span>

    <span
      className={`whitespace-nowrap font-medium ${
        expirado ? 'text-red-700' : 'text-[var(--gold)]'
      }`}
    >
      {expiraEmFormatado}
    </span>
  </div>
)}

            {album?.senhaAcesso && (
              <>
                <p className="mb-1 mt-4 text-[11px] text-[var(--text-muted)]">
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
          <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4 text-[12px] font-medium leading-5 text-orange-700">
            Álbum reaberto para edição. O acesso da cliente está pausado até a próxima publicação.
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Stat icon={ImageIcon} label="Fotos" value={totalFotos} />
          <Stat icon={Eye} label="Views" value={album?.views ?? 0} />
          <Stat icon={Shield} label="Seguro" value={albumPublicado ? 'Sim' : temAlbum ? 'Pausado' : 'Não'} />
        </div>
      </div>
    </section>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[8px] border border-[var(--border)] bg-white/55 px-2 py-3">
      <Icon className="mx-auto mb-2 text-[var(--gold)]" size={15} strokeWidth={1.8} />

      <p className="text-[13px] font-semibold uppercase text-[var(--text)]">{value}</p>

      <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  )
}
