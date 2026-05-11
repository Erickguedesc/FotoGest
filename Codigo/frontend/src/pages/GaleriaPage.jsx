import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { enviarSelecaoFotos } from "../services/albumAccessService"

const LIMITE_PADRAO = 30
const VALOR_EXTRA_PADRAO = 35

function getFotoUrl(foto) {
  return foto?.urlWatermark || foto?.url || foto?.src || ""
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatDate(value) {
  if (!value) return "Data não informada"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Data não informada"
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function HeartIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export default function GaleriaPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const album = useMemo(() => {
    const raw = sessionStorage.getItem(`olhari_album_${token}`)

    if (!raw) return null

    try {
      return JSON.parse(raw)
    } catch {
      sessionStorage.removeItem(`olhari_album_${token}`)
      return null
    }
  }, [token])

  const [aba, setAba] = useState("galeria")
  const [favoritas, setFavoritas] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [selecaoEnviada, setSelecaoEnviada] = useState(false)
  const [erroEnvio, setErroEnvio] = useState("")

  if (!album) {
    navigate(`/album/${token}`, { replace: true })
    return null
  }

  const fotos = Array.isArray(album.fotos) ? album.fotos : []

  const nomeCliente =
    album.nomeCliente ||
    album.clienteNome ||
    album.nome ||
    "Cliente"

  const tipoEnsaio =
    album.tipoEnsaio ||
    album.tipo ||
    "Ensaio fotográfico"

  const limite =
    album.qtdFotosPacote ||
    album.quantidadeFotos ||
    album.limiteFotos ||
    album.quantidadeFotosPacote ||
    LIMITE_PADRAO

  const dataEnsaio = album.dataEnsaio
  const dataFormatada = formatDate(dataEnsaio)

  const localEnsaio =
    album.local ||
    album.localEnsaio ||
    "Local não informado"

  const cobraFotoExtra = album.cobrarFotoExtra === true

  const valorFotoExtra = cobraFotoExtra
    ? Number(album.valorFotoExtra || VALOR_EXTRA_PADRAO)
    : 0

  const totalSelecionadas = favoritas.length
  const excedente = Math.max(0, totalSelecionadas - limite)
  const valorExcedente = cobraFotoExtra ? excedente * valorFotoExtra : 0
  const progresso = Math.min(100, Math.round((totalSelecionadas / limite) * 100))

  const fotosFavoritas = fotos.filter((foto) => favoritas.includes(foto.id))

  function toggleFavorita(fotoId) {
    if (selecaoEnviada) return

    setFavoritas((atual) => {
      if (atual.includes(fotoId)) {
        return atual.filter((id) => id !== fotoId)
      }

      return [...atual, fotoId]
    })
  }

  function abrirLightbox(index) {
    setLightboxIndex(index)
  }

  function fecharLightbox() {
    setLightboxIndex(null)
  }

  function moverLightbox(direcao) {
    setLightboxIndex((indexAtual) => {
      if (indexAtual === null) return null
      return (indexAtual + direcao + fotos.length) % fotos.length
    })
  }

  async function confirmarSelecao() {
    try {
      setEnviando(true)
      setErroEnvio("")

      await enviarSelecaoFotos(token, favoritas)

      setSelecaoEnviada(true)
      setModalAberto(false)
    } catch (error) {
      const status = error?.response?.status

      if (status === 400) {
        setErroEnvio("Esta seleção já foi enviada ou contém fotos inválidas.")
      } else if (status === 403) {
        setErroEnvio("Acesso não autorizado ao álbum.")
      } else {
        setErroEnvio("Não foi possível enviar sua seleção. Tente novamente.")
      }
    } finally {
      setEnviando(false)
    }
  }

  const fotoLightbox = lightboxIndex !== null ? fotos[lightboxIndex] : null

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-[#1a1610]">
      <section className="relative flex min-h-[76vh] items-center justify-center overflow-hidden px-6 py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#110e0b]">
          {getFotoUrl(fotos[0]) ? (
            <img
              src={getFotoUrl(fotos[0])}
              alt=""
              className="h-full w-full object-cover opacity-60 brightness-75 saturate-75"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/30 to-[#110e0b]/80" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <p className="mb-10 font-serif text-sm italic tracking-[0.28em] text-white/55">
            Olhari · Fotografia
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
              {fotos.length} fotografias
            </div>

            <div className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.12em] text-white/65 backdrop-blur">
              Até {limite} no pacote
            </div>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-[#ddd5c5] bg-[#f5f0e8]/90 px-4 backdrop-blur-xl md:px-8">
        <div className="flex">
          <button
            type="button"
            onClick={() => setAba("galeria")}
            className={`flex items-center gap-2 border-b-2 px-4 py-4 text-xs uppercase tracking-[0.16em] transition md:px-6 ${
              aba === "galeria"
                ? "border-[#a8783a] text-[#a8783a]"
                : "border-transparent text-[#998f83] hover:text-[#1a1610]"
            }`}
          >
            Galeria
            <span className="rounded-full border border-[#ddd5c5] bg-[#ede6d8] px-2 py-0.5 text-[11px] text-[#5c5248]">
              {fotos.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAba("favoritas")}
            className={`flex items-center gap-2 border-b-2 px-4 py-4 text-xs uppercase tracking-[0.16em] transition md:px-6 ${
              aba === "favoritas"
                ? "border-[#a8783a] text-[#a8783a]"
                : "border-transparent text-[#998f83] hover:text-[#1a1610]"
            }`}
          >
            Minhas favoritas
            <span className="rounded-full border border-[#ddd5c5] bg-[#ede6d8] px-2 py-0.5 text-[11px] text-[#5c5248]">
              {totalSelecionadas}
            </span>
          </button>
        </div>

        <div className="hidden text-xs uppercase tracking-[0.12em] text-[#998f83] md:block">
          {excedente > 0
            ? `+${excedente} excedente${excedente > 1 ? "s" : ""}`
            : `${totalSelecionadas} / ${limite} selecionadas`}
        </div>
      </nav>

      {selecaoEnviada ? (
        <section className="mx-auto max-w-4xl px-6 py-10">
          <div className="rounded-3xl border border-[#d7cbb9] bg-[#faf8f4] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#5a9468]/10 text-2xl text-[#5a9468]">
              ✓
            </div>
            <h2 className="font-serif text-4xl font-light">
              Seleção enviada
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#5c5248]">
              Suas fotos favoritas foram enviadas para a fotógrafa. A seleção não pode mais ser alterada por aqui.
            </p>
          </div>
        </section>
      ) : null}

      {aba === "galeria" ? (
        <section className="mx-auto max-w-[1280px] px-5 py-10 pb-28">
          {fotos.length === 0 ? (
            <div className="rounded-3xl border border-[#ddd5c5] bg-[#faf8f4] p-10 text-center">
              <h2 className="font-serif text-3xl font-light">
                Nenhuma foto disponível
              </h2>
              <p className="mt-2 text-sm text-[#5c5248]">
                Este álbum ainda não possui fotos publicadas.
              </p>
            </div>
          ) : (
            <div className="columns-2 gap-2 md:columns-3 lg:columns-4">
              {fotos.map((foto, index) => {
                const selecionada = favoritas.includes(foto.id)
                const url = getFotoUrl(foto)

                return (
                  <article
                    key={foto.id}
                    className={`group relative mb-2 break-inside-avoid overflow-hidden rounded-md bg-[#ede6d8] shadow-sm transition hover:shadow-2xl ${
                      selecionada
                        ? "outline outline-[3px] outline-[#bf5c68] outline-offset-[-3px]"
                        : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => abrirLightbox(index)}
                      className="block w-full cursor-zoom-in"
                    >
                      <img
                        src={url}
                        alt={`Foto ${index + 1}`}
                        loading="lazy"
                        className="h-auto w-full select-none object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-75"
                      />
                    </button>

                    <div className="pointer-events-none absolute inset-0 grid grid-cols-3 opacity-60">
                      {Array.from({ length: 12 }).map((_, item) => (
                        <span
                          key={item}
                          className="rotate-[-35deg] select-none self-center text-center font-serif text-[10px] italic tracking-[0.18em] text-white/20"
                        >
                          © olhari
                        </span>
                      ))}
                    </div>

                    <span className="absolute left-3 top-3 text-[10px] tracking-[0.12em] text-white/50 opacity-0 transition group-hover:opacity-100">
                      #{String(index + 1).padStart(3, "0")}
                    </span>

                    <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-b from-transparent to-black/45 p-3 opacity-0 transition group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleFavorita(foto.id)
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#faf8f4]/95 text-[#bf5c68] transition hover:scale-110"
                        title="Favoritar"
                      >
                        <HeartIcon filled={selecionada} />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      ) : null}

      {aba === "favoritas" ? (
        <section className="mx-auto max-w-[1300px] px-5 py-12 pb-28">
          <div className="mb-8">
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#a8783a]">
              Suas escolhas
            </p>
            <h2 className="font-serif text-5xl font-light">
              Fotos <em className="text-[#a8783a]">favoritas</em>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#5c5248]">
              Estas são as memórias que você escolheu guardar para sempre.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              {fotosFavoritas.length === 0 ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-[#ddd5c5] bg-[#faf8f4] p-10 text-center">
                  <div className="mb-3 text-5xl opacity-30">🤍</div>
                  <h3 className="font-serif text-3xl italic text-[#998f83]">
                    Nenhuma favorita ainda
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-[#998f83]">
                    Volte à galeria e toque no coração das fotos que mais tocaram você.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAba("galeria")}
                    className="mt-6 rounded-full border border-[#ddd5c5] px-7 py-3 text-xs uppercase tracking-[0.16em] text-[#998f83] transition hover:border-[#a8783a] hover:text-[#a8783a]"
                  >
                    Explorar galeria
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between border-b border-[#ddd5c5] pb-4">
                    <h3 className="text-lg font-medium">
                      {fotosFavoritas.length} foto
                      {fotosFavoritas.length > 1 ? "s" : ""} selecionada
                      {fotosFavoritas.length > 1 ? "s" : ""}
                    </h3>
                    <span className="rounded-full border border-[#a8783a]/20 bg-[#a8783a]/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.12em] text-[#a8783a]">
                      clique no x para remover
                    </span>
                  </div>

                  <div className="columns-2 gap-2 md:columns-3">
                    {fotosFavoritas.map((foto) => {
                      const index = fotos.findIndex((item) => item.id === foto.id)

                      return (
                        <article
                          key={foto.id}
                          className="group relative mb-2 break-inside-avoid overflow-hidden rounded-md border-2 border-[#bf5c68]/45 bg-[#ede6d8]"
                        >
                          <button
                            type="button"
                            onClick={() => abrirLightbox(index)}
                            className="block w-full"
                          >
                            <img
                              src={getFotoUrl(foto)}
                              alt="Foto favorita"
                              loading="lazy"
                              className="h-auto w-full object-cover transition group-hover:brightness-75"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleFavorita(foto.id)}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white/70 opacity-0 transition hover:bg-[#bf4f4f] hover:text-white group-hover:opacity-100"
                            title="Remover"
                          >
                            ×
                          </button>

                          <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#bf5c68]/40 bg-[#bf5c68]/15 text-[#bf5c68] backdrop-blur">
                            <HeartIcon filled />
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            <aside className="sticky top-24 overflow-hidden rounded-2xl border border-[#2a2420] bg-[#1a1612] text-[#e8dfd4]">
              <div className="flex items-center justify-between border-b border-[#2a2420] px-7 py-6">
                <h3 className="font-serif text-2xl font-light">
                  Resumo da seleção
                </h3>
                <span
                  className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.12em] ${
                    totalSelecionadas === 0
                      ? "border-white/10 bg-white/5 text-[#887e74]"
                      : excedente > 0
                        ? "border-[#df7070]/30 bg-[#df7070]/10 text-[#df7070]"
                        : "border-[#7db88a]/30 bg-[#7db88a]/10 text-[#7db88a]"
                  }`}
                >
                  {totalSelecionadas === 0
                    ? "Nenhuma foto"
                    : excedente > 0
                      ? `${excedente} extra`
                      : "Dentro do limite"}
                </span>
              </div>

              <div className="divide-y divide-[#2a2420]">
                <div className="flex items-center justify-between px-7 py-4">
                  <span className="text-xs uppercase tracking-[0.14em] text-[#887e74]">
                    Selecionadas
                  </span>
                  <strong className="font-serif text-3xl font-light text-[#c9a96e]">
                    {totalSelecionadas}
                  </strong>
                </div>

                <div className="flex items-center justify-between px-7 py-4">
                  <span className="text-xs uppercase tracking-[0.14em] text-[#887e74]">
                    Limite do pacote
                  </span>
                  <strong className="font-serif text-3xl font-light">
                    {limite}
                  </strong>
                </div>

                <div className="flex items-center justify-between px-7 py-4">
                  <span className="text-xs uppercase tracking-[0.14em] text-[#887e74]">
                    Excedente
                  </span>
                  <strong
                    className={`font-serif text-3xl font-light ${
                      excedente > 0 ? "text-[#df7070]" : ""
                    }`}
                  >
                    {excedente > 0 ? `+${excedente}` : "—"}
                  </strong>
                </div>
              </div>

              <div className="border-b border-[#2a2420] px-7 py-5">
                <div className="mb-3 flex justify-between text-[11px] uppercase tracking-[0.14em] text-[#887e74]">
                  <span>Progresso</span>
                  <span>{progresso}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#2a2420]">
                  <div
                    className={`h-full rounded-full transition-all ${
                      excedente > 0 ? "bg-[#df7070]" : "bg-[#c9a96e]"
                    }`}
                    style={{ width: `${progresso}%` }}
                  />
                </div>
              </div>

              {excedente > 0 ? (
                <div className="border-b border-[#bf4f4f]/20 bg-[#bf4f4f]/10 px-7 py-5">
                  <p className="text-sm leading-6 text-[#df7070]/80">
                    Você selecionou <strong>{excedente}</strong> foto(s) extras.{" "}
                    {cobraFotoExtra ? (
                      <>
                        Cada uma custa{" "}
                        <strong>{formatMoney(valorFotoExtra)}</strong>.
                      </>
                    ) : (
                      <>
                        O valor adicional será combinado diretamente com a fotógrafa.
                      </>
                    )}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[#df7070]/50">
                    Valor adicional
                  </p>
                  <strong className="font-serif text-4xl font-light text-[#df7070]">
                    {cobraFotoExtra ? formatMoney(valorExcedente) : "A combinar"}
                  </strong>
                </div>
              ) : totalSelecionadas > 0 ? (
                <div className="border-b border-[#5a9468]/20 px-7 py-4 text-sm text-[#7db88a]">
                  ✓ Dentro do pacote. Nenhum custo adicional.
                </div>
              ) : null}

              <div className="px-7 py-6">
                {erroEnvio ? (
                  <p className="mb-3 rounded-xl border border-[#df7070]/20 bg-[#df7070]/10 px-4 py-3 text-sm text-[#df7070]">
                    {erroEnvio}
                  </p>
                ) : null}

                <button
                  type="button"
                  disabled={totalSelecionadas === 0 || enviando}
                  onClick={() => setModalAberto(true)}
                  className="w-full rounded-full bg-[#a8783a] px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-white shadow-lg shadow-[#a8783a]/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Confirmar seleção
                </button>

                <p className="mt-3 text-center text-xs text-[#887e74]">
                  {totalSelecionadas === 0
                    ? "Selecione fotos para confirmar"
                    : excedente > 0
                      ? cobraFotoExtra
                        ? `Valor extra de ${formatMoney(valorExcedente)}`
                        : "Valor extra a combinar"
                      : "Tudo certo para enviar"}
                </p>
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {totalSelecionadas > 0 && aba === "galeria" && !selecaoEnviada ? (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-[#2a2420] bg-[#1a1612] px-4 py-3 text-[#e8dfd4] shadow-2xl">
          <div className="flex items-center gap-4">
            <span className="text-sm">
              <strong>{totalSelecionadas}</strong> selecionada
              {totalSelecionadas > 1 ? "s" : ""}
            </span>
            {excedente > 0 ? (
              <span className="rounded-full bg-[#bf4f4f]/15 px-3 py-1 text-xs text-[#df7070]">
                +{excedente} excedente
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => setAba("favoritas")}
              className="rounded-full bg-[#a8783a] px-5 py-2 text-xs uppercase tracking-[0.12em] text-white"
            >
              Ver seleção →
            </button>
          </div>
        </div>
      ) : null}

      {fotoLightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0806]/95 p-4"
          onClick={fecharLightbox}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              fecharLightbox()
            }}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/60 hover:text-white"
          >
            ×
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              moverLightbox(-1)
            }}
            className="absolute left-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/60 hover:text-white md:flex"
          >
            ‹
          </button>

          <div
            className="relative max-h-[82vh] max-w-[86vw] overflow-hidden rounded-lg shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={getFotoUrl(fotoLightbox)}
              alt="Foto ampliada"
              className="max-h-[82vh] max-w-[86vw] object-contain"
            />

            <div className="pointer-events-none absolute inset-0 grid grid-cols-4 opacity-70">
              {Array.from({ length: 16 }).map((_, item) => (
                <span
                  key={item}
                  className="rotate-[-35deg] select-none self-center text-center font-serif text-sm italic tracking-[0.18em] text-white/15"
                >
                  © olhari fotografia
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              moverLightbox(1)
            }}
            className="absolute right-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/60 hover:text-white md:flex"
          >
            ›
          </button>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                toggleFavorita(fotoLightbox.id)
              }}
              className={`flex items-center gap-2 rounded-full border px-6 py-3 text-xs uppercase tracking-[0.14em] ${
                favoritas.includes(fotoLightbox.id)
                  ? "border-[#bf5c68]/40 bg-[#bf5c68]/15 text-[#bf5c68]"
                  : "border-white/10 bg-white/10 text-white/70"
              }`}
            >
              <HeartIcon filled={favoritas.includes(fotoLightbox.id)} />
              {favoritas.includes(fotoLightbox.id) ? "Favoritada" : "Favoritar"}
            </button>

            <span className="text-xs uppercase tracking-[0.18em] text-white/30">
              {(lightboxIndex || 0) + 1} / {fotos.length}
            </span>
          </div>
        </div>
      ) : null}

      {modalAberto ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0806]/85 p-5 backdrop-blur">
          <div className="w-full max-w-md rounded-3xl border border-[#2a2420] bg-[#1a1612] p-8 text-center text-[#e8dfd4] shadow-2xl">
            <div className="mb-3 text-4xl">📋</div>
            <h2 className="font-serif text-3xl font-light">
              Deseja finalizar?
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#887e74]">
              Após confirmar, sua seleção será enviada à fotógrafa e não poderá ser alterada.
            </p>

            <div className="my-6 rounded-2xl border border-[#2a2420] bg-white/[0.03] p-4">
              <div className="flex justify-between border-b border-white/5 py-2 text-sm text-[#887e74]">
                <span>Fotos selecionadas</span>
                <strong className="text-[#e8dfd4]">{totalSelecionadas}</strong>
              </div>
              <div className="flex justify-between border-b border-white/5 py-2 text-sm text-[#887e74]">
                <span>Incluídas no pacote</span>
                <strong className="text-[#e8dfd4]">{limite}</strong>
              </div>
              <div className="flex justify-between py-2 text-sm text-[#887e74]">
                <span>Valor adicional</span>
                <strong className={excedente > 0 ? "text-[#df7070]" : "text-[#e8dfd4]"}>
                  {excedente > 0
                    ? cobraFotoExtra
                      ? formatMoney(valorExcedente)
                      : "A combinar"
                    : formatMoney(0)}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="rounded-full border border-[#2a2420] px-5 py-4 text-xs uppercase tracking-[0.12em] text-[#887e74] transition hover:bg-white/5 hover:text-[#e8dfd4]"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarSelecao}
                disabled={enviando}
                className="rounded-full bg-[#a8783a] px-5 py-4 text-xs font-medium uppercase tracking-[0.12em] text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {enviando ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}