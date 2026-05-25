import { useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import {
  acessarAlbumComSenha,
  enviarSelecaoFotos,
  validarAlbumPorToken,
} from "../services/albumAccessService"


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

function formatarDataExpiracao(value) {
  if (!value) return ""

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
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

  const [album, setAlbum] = useState(() => {
    const raw = sessionStorage.getItem(`olhari_album_${token}`)

    if (!raw) return null

    try {
      return JSON.parse(raw)
    } catch {
      sessionStorage.removeItem(`olhari_album_${token}`)
      return null
    }
  })

  const [aba, setAba] = useState("galeria")

  const [favoritas, setFavoritas] = useState(
    Array.isArray(album?.fotosSelecionadas) ? album.fotosSelecionadas : []
  )

  const [observacoesPorFoto, setObservacoesPorFoto] = useState(
    album?.observacoesPorFoto && typeof album.observacoesPorFoto === "object"
      ? album.observacoesPorFoto
      : {}
  )

  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [lightboxOrigem, setLightboxOrigem] = useState("galeria")

  const [modalAberto, setModalAberto] = useState(false)
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const [selecaoEnviada, setSelecaoEnviada] = useState(
    Boolean(album?.selecaoEnviada || album?.selecaoFinalizada)
  )

  const [tempoRestante, setTempoRestante] = useState(null)
  const [albumExpirado, setAlbumExpirado] = useState(false)

  const [erroEnvio, setErroEnvio] = useState("")
  useEffect(() => {
    async function atualizarFotosDaGaleria() {
      const senhaTemporaria = album?.senhaAcessoTemporaria

      if (!senhaTemporaria) return

      try {
        const fotosAtualizadas = await acessarAlbumComSenha(token, senhaTemporaria)
        const dadosPublicos = await validarAlbumPorToken(token)

        const albumAtualizado = {
          ...album,
          ...dadosPublicos,
          fotos: fotosAtualizadas,
        }

        setAlbum(albumAtualizado)

        sessionStorage.setItem(
          `olhari_album_${token}`,
          JSON.stringify(albumAtualizado)
        )
      } catch (error) {
        console.error("Erro ao atualizar fotos da galeria:", error)
      }
    }

    atualizarFotosDaGaleria()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!album) {
    return <Navigate to={`/album/${token}`} replace />
  }

  useEffect(() => {
    if (!album?.expiraEm) return

    const atualizarContador = () => {
      const agora = new Date()
      const expiracao = new Date(
        album.expiraEm.replace(" ", "T")
      )

      const diferenca =
        expiracao.getTime() - agora.getTime()

      if (diferenca <= 0) {
        setAlbumExpirado(true)
        setTempoRestante(null)
        return
      }

      const dias = Math.floor(
        diferenca / (1000 * 60 * 60 * 24)
      )

      const horas = Math.floor(
        (diferenca % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
      )

      const minutos = Math.floor(
        (diferenca % (1000 * 60 * 60)) /
        (1000 * 60)
      )

      setTempoRestante({
        dias,
        horas,
        minutos,
      })
    }

    atualizarContador()

    const interval = setInterval(atualizarContador, 1000)

    return () => clearInterval(interval)

  }, [album])

  const fotos = Array.isArray(album.fotos) ? album.fotos : []
  const capaAlbumUrl = getFotoUrl(fotos[0]) || album?.capaAlbumPadraoUrl || ''


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
  const progresso = limite > 0
    ? Math.min(100, Math.round((totalSelecionadas / limite) * 100))
    : 0
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

  function handleObservacaoChange(fotoId, observacao) {
    if (selecaoEnviada) return

    setObservacoesPorFoto((atual) => ({
      ...atual,
      [fotoId]: observacao.slice(0, 500),
    }))
  }

  function abrirLightbox(index, origem = "galeria") {
    setLightboxOrigem(origem)
    setLightboxIndex(index)
  }

  function fecharLightbox() {
    setLightboxIndex(null)
  }

  function moverLightbox(direcao) {
    setLightboxIndex((indexAtual) => {
      if (indexAtual === null || fotosLightbox.length === 0) return null

      return (
        (indexAtual + direcao + fotosLightbox.length) %
        fotosLightbox.length
      )
    })
  }

  async function confirmarSelecao() {
    if (selecaoEnviada) {
      setModalAberto(false)
      setErroEnvio("Esta seleção já foi finalizada e não pode ser alterada.")
      return
    }

    try {
      setEnviando(true)
      setErroEnvio("")

      const observacoesSelecionadas = favoritas.reduce((acc, fotoId) => {
        const observacao = observacoesPorFoto[fotoId]?.trim()

        if (observacao) {
          acc[fotoId] = observacao
        }

        return acc
      }, {})

      await enviarSelecaoFotos(token, favoritas, observacoesSelecionadas)

      setSelecaoEnviada(true)
      setModalAberto(false)
      setModalSucessoAberto(true)

      sessionStorage.setItem(
        `olhari_album_${token}`,
        JSON.stringify({
          ...album,
          selecaoEnviada: true,
          fotosSelecionadas: favoritas,
          observacoesPorFoto: observacoesSelecionadas,
        })
      )
    } catch (error) {
      const status = error?.response?.status

      setModalAberto(false)

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

  const fotosLightbox = lightboxOrigem === "favoritas" ? fotosFavoritas : fotos
  const fotoLightbox = lightboxIndex !== null ? fotosLightbox[lightboxIndex] : null
  const fotoLightboxSelecionada = fotoLightbox
    ? favoritas.includes(fotoLightbox.id)
    : false

  if (albumExpirado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#110e0b] px-6 text-white">
        <div className="max-w-xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-red-300/70">
            Álbum expirado
          </p>

          <h1 className="font-serif text-5xl font-light">
            Este álbum não está mais disponível
          </h1>

          <p className="mt-6 text-sm leading-8 text-white/60">
            O prazo de acesso deste álbum foi encerrado.
            Entre em contato com a fotógrafa para solicitar
            uma nova liberação.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="theme-static min-h-screen bg-[#f5f0e8] text-[#1a1610]">
      <section className="relative flex min-h-[76vh] items-center justify-center overflow-hidden px-6 py-20 text-center text-white">
        <div className="absolute inset-0 bg-[#110e0b]">
          {capaAlbumUrl ? (
            <img
              src={capaAlbumUrl}
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

          {album?.expiraEm && !albumExpirado && (
            <div
              className={`mt-8 mx-auto max-w-xl rounded-2xl border px-6 py-5 backdrop-blur-xl ${tempoRestante?.dias <= 3
                ? "border-red-400/40 bg-red-500/10"
                : "border-white/15 bg-white/10"
                }`}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">
                Álbum disponível por tempo limitado
              </p>

              <h3 className="mt-2 font-serif text-3xl font-light text-white">
                Expira em {tempoRestante?.dias} dias,{" "}
                {String(tempoRestante?.horas).padStart(2, "0")}h e{" "}
                {String(tempoRestante?.minutos).padStart(2, "0")}min
              </h3>

              <p className="mt-2 text-sm text-white/60">
                Disponível até{" "}
                {formatarDataExpiracao(album.expiraEm)}
              </p>
            </div>
          )}
        </div>
      </section>

      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-[#ddd5c5] bg-[#f5f0e8]/90 px-4 backdrop-blur-xl md:px-8">
        <div className="flex">
          <button
            type="button"
            onClick={() => setAba("galeria")}
            className={`flex items-center gap-2 border-b-2 px-4 py-4 text-xs uppercase tracking-[0.16em] transition md:px-6 ${aba === "galeria"
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
            className={`flex items-center gap-2 border-b-2 px-4 py-4 text-xs uppercase tracking-[0.16em] transition md:px-6 ${aba === "favoritas"
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

      {modalSucessoAberto ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0806]/85 p-5 backdrop-blur">
          <div className="w-full max-w-md rounded-3xl border border-[#2a2420] bg-[#1a1612] p-8 text-center text-[#e8dfd4] shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#5a9468]/15 text-3xl text-[#7db88a]">
              ✓
            </div>

            <h2 className="font-serif text-3xl font-light">
              Seleção confirmada!
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#887e74]">
              Suas fotos favoritas foram enviadas para a fotógrafa. A seleção não poderá mais ser alterada por aqui.
            </p>

            <button
              type="button"
              onClick={() => setModalSucessoAberto(false)}
              className="mt-7 w-full rounded-full bg-[#a8783a] px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:opacity-90"
            >
              Entendi
            </button>
          </div>
        </div>
      ) : null}

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
                    className={`group relative mb-2 break-inside-avoid overflow-hidden rounded-md bg-[#ede6d8] shadow-sm transition hover:shadow-2xl ${selecionada
                      ? "outline outline-[3px] outline-[#bf5c68] outline-offset-[-3px]"
                      : ""
                      }`}
                  >
                    <button
                      type="button"
                      onClick={() => abrirLightbox(index, "galeria")}
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
                    <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-b from-transparent to-black/45 p-3 opacity-0 transition group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleFavorita(foto.id)
                        }}
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#faf8f4]/95 text-[#bf5c68] transition hover:scale-110"
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
                    {fotosFavoritas.map((foto, index) => {
                      return (
                        <article
                          key={foto.id}
                          className="group relative mb-2 break-inside-avoid overflow-hidden rounded-md border-2 border-[#bf5c68]/45 bg-[#ede6d8]"
                        >
                          <button
                            type="button"
                            onClick={() => abrirLightbox(index, "favoritas")} className="block w-full"
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

                          <div className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#bf5c68]/40 bg-[#bf5c68]/15 text-[#bf5c68] backdrop-blur">
                            <HeartIcon filled />
                          </div>

                          <div className="border-t border-[#d7cbb9] bg-[#faf8f4] p-3">
                            <label
                              htmlFor={`observacao-${foto.id}`}
                              className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-[#a8783a]"
                            >
                              Observação
                            </label>

                            <textarea
                              id={`observacao-${foto.id}`}
                              value={observacoesPorFoto[foto.id] || ""}
                              onChange={(event) =>
                                handleObservacaoChange(foto.id, event.target.value)
                              }
                              maxLength={500}
                              rows={3}
                              placeholder="Ex.: gostei da expressão, ajustar cabelo, preferir em PB..."
                              className="min-h-[84px] w-full resize-none rounded-xl border border-[#ddd5c5] bg-white/70 px-3 py-2 text-sm leading-5 text-[#1a1610] outline-none transition placeholder:text-[#998f83] focus:border-[#a8783a]"
                            />

                            <p className="mt-1 text-right text-[10px] text-[#998f83]">
                              {(observacoesPorFoto[foto.id] || "").length} / 500
                            </p>
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
                  className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.12em] ${totalSelecionadas === 0
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
                    className={`font-serif text-3xl font-light ${excedente > 0 ? "text-[#df7070]" : ""
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
                    className={`h-full rounded-full transition-all ${excedente > 0 ? "bg-[#df7070]" : "bg-[#c9a96e]"
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
                  disabled={totalSelecionadas === 0 || enviando || selecaoEnviada}
                  onClick={() => {
                    setErroEnvio("")

                    setModalAberto(true)
                  }}
                  className="w-full rounded-full bg-[#a8783a] px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-white shadow-lg shadow-[#a8783a]/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {selecaoEnviada ? "Seleção já enviada" : "Confirmar seleção"}
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
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0a0806]/95 p-4 pt-16 xl:items-center xl:overflow-hidden"
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
            className="absolute left-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/70 text-3xl leading-none text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition hover:border-white/70 hover:bg-black/85 md:flex"
          >
            ‹
          </button>

          <div
            className="relative max-h-[52vh] max-w-[92vw] overflow-hidden rounded-lg shadow-2xl xl:max-h-[82vh] xl:max-w-[calc(86vw-380px)]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={getFotoUrl(fotoLightbox)}
              alt="Foto ampliada"
              className="max-h-[52vh] max-w-[92vw] object-contain xl:max-h-[82vh] xl:max-w-[calc(86vw-380px)]"
            />

            <div className="pointer-events-none absolute inset-0 grid grid-cols-4 opacity-70">
              {Array.from({ length: 16 }).map((_, item) => (
                <span
                  key={item}
                  className="rotate-[-35deg] select-none self-center text-center font-serif text-sm italic tracking-[0.18em] text-black/15"
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
            className="absolute right-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/70 text-3xl leading-none text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition hover:border-white/70 hover:bg-black/85 xl:right-[370px] md:flex"
          >
            ›
          </button>

          <aside
            className="absolute left-4 right-4 top-[calc(52vh+5rem)] max-h-[36vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#15110d] p-5 text-[#e8dfd4] shadow-2xl xl:bottom-6 xl:left-auto xl:right-6 xl:top-20 xl:w-[340px] xl:max-h-none"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#887e74]">
              Foto {(lightboxIndex || 0) + 1} / {fotosLightbox.length}
            </p>

            <h2 className="mt-2 font-serif text-2xl font-light">
              Observação da foto
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#887e74]">
              Se desejar, use este espaço para indicar ajustes, preferências ou detalhes importantes para a fotógrafa.
            </p>

            <button
              type="button"
              onClick={() => toggleFavorita(fotoLightbox.id)}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3 text-xs uppercase tracking-[0.14em] transition ${fotoLightboxSelecionada
                ? "border-[#bf5c68]/40 bg-[#bf5c68]/15 text-[#df8b96]"
                : "border-white/10 bg-white/10 text-white/70 hover:text-white"
                }`}
            >
              <HeartIcon filled={fotoLightboxSelecionada} />
              {fotoLightboxSelecionada ? "Favoritada" : "Favoritar foto"}
            </button>

            <label
              htmlFor={`lightbox-observacao-${fotoLightbox.id}`}
              className="mt-5 block text-[10px] uppercase tracking-[0.16em] text-[#c9a96e]"
            >
              Observação
            </label>

            <textarea
              id={`lightbox-observacao-${fotoLightbox.id}`}
              value={observacoesPorFoto[fotoLightbox.id] || ""}
              onChange={(event) =>
                handleObservacaoChange(fotoLightbox.id, event.target.value)
              }
              disabled={!fotoLightboxSelecionada || selecaoEnviada}
              maxLength={500}
              rows={7}
              placeholder={
                fotoLightboxSelecionada
                  ? "Ex.: gostei da expressão, ajustar cabelo, preferir em PB..."
                  : "Favorite esta foto para adicionar uma observação."
              }
              className="mt-2 min-h-[150px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-6 text-[#e8dfd4] outline-none transition placeholder:text-[#887e74] focus:border-[#c9a96e] disabled:cursor-not-allowed disabled:opacity-55"
            />

            <p className="mt-2 text-right text-[10px] text-[#887e74]">
              {(observacoesPorFoto[fotoLightbox.id] || "").length} / 500
            </p>

            {selecaoEnviada ? (
              <p className="mt-4 rounded-xl border border-[#5a9468]/20 bg-[#5a9468]/10 px-4 py-3 text-sm leading-6 text-[#7db88a]">
                Seleção já enviada. As observações não podem mais ser alteradas.
              </p>
            ) : null}
          </aside>
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
