import { useState } from 'react'
import SectionTitle from './SectionTitle'

const LIMITE_PREVIA = 6

const getNomeFoto = (foto) => {
  if (!foto) return 'foto-nao-encontrada.jpg'

  if (foto.nomeOriginal) {
    return foto.nomeOriginal
  }

  if (foto.cloudinaryId) {
    const partes = foto.cloudinaryId.split('/')
    return partes[partes.length - 1]
  }

  return `${foto.id}.jpg`
}

export default function SelecaoClienteCard({
  fotos = [],
  selecao,
  loading,
  onBuscarSelecao,
}) {
  const [jaConsultouSelecao, setJaConsultouSelecao] = useState(false)
  const [erroConsulta, setErroConsulta] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)

  const fotosSelecionadas = selecao?.fotosIds
    ? fotos.filter((foto) => selecao.fotosIds.includes(foto.id))
    : []

  const fotosPrevias = fotosSelecionadas.slice(0, LIMITE_PREVIA)
  const temMaisFotos = fotosSelecionadas.length > LIMITE_PREVIA

  const getObservacao = (fotoId) =>
    selecao?.observacoesPorFoto?.[fotoId]?.trim() || ''

  const semSelecao =
    !selecao || !selecao.totalSelecionadas || selecao.totalSelecionadas === 0

  const handleBuscarSelecao = async () => {
    try {
      setErroConsulta(null)
      await onBuscarSelecao()
      setJaConsultouSelecao(true)
    } catch (error) {
      console.error('[Seleção] Erro ao consultar seleção:', error)
      setErroConsulta('Não foi possível consultar a seleção no momento.')
      setJaConsultouSelecao(true)
    }
  }

  const baixarLista = () => {
    const conteudo = fotosSelecionadas
      .map((foto) => `"${getNomeFoto(foto)}"`)
      .join(' OR ')

    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'Filtro-fotos-selecionadas.txt'
    link.click()

    URL.revokeObjectURL(url)
  }

  const renderFotoSelecionada = (foto) => {
    const observacao = getObservacao(foto.id)

    return (
      <article
        key={foto.id}
        className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/20"
      >
        <img
          src={foto.urlWatermark || foto.urlOriginal}
          alt={getNomeFoto(foto)}
          className="h-36 w-full object-cover"
        />

        <div className="p-3">
          <p className="truncate text-[12px] text-white/70">
            {getNomeFoto(foto)}
          </p>

          {observacao ? (
            <div className="mt-3 rounded-lg border border-[var(--gold-border)] bg-[var(--gold-dim)] p-3">
              <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-[var(--gold)]">
                Observação da cliente
              </p>
              <p className="text-[12px] leading-5 text-white/75">
                {observacao}
              </p>
            </div>
          ) : null}
        </div>
      </article>
    )
  }

  return (
    <section className="rounded-2xl border border-[var(--gold-border)] bg-[#121212]">
      <SectionTitle title="Fotos selecionadas pela cliente" />

      {semSelecao ? (
        <div className="flex min-h-[190px] flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]">
            ⏱
          </div>

          {erroConsulta ? (
            <>
              <p className="text-[14px] text-red-300">
                {erroConsulta}
              </p>

              <p className="mt-1 text-[12px] text-white/40">
                Tente consultar novamente em alguns instantes.
              </p>
            </>
          ) : jaConsultouSelecao ? (
            <>
              <p className="text-[14px] text-white/75">
                Seleção ainda não feita pela cliente.
              </p>

              <p className="mt-1 text-[12px] text-white/40">
                Quando a cliente finalizar a escolha, as fotos selecionadas aparecerão aqui.
              </p>
            </>
          ) : (
            <>
              <p className="text-[14px] text-white/75">
                Aguardando seleção da cliente.
              </p>

              <p className="mt-1 text-[12px] text-white/40">
                Quando a cliente finalizar a escolha, a seleção aparecerá aqui.
              </p>
            </>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleBuscarSelecao}
            className="mt-5 rounded-lg border border-[var(--gold-border)] px-4 py-2 text-[12px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Consultando...' : 'Consultar seleção'}
          </button>
        </div>
      ) : (
        <div className="p-5">
          <div className="mb-5 grid grid-cols-4 gap-3 max-md:grid-cols-2">
            <Resumo label="Selecionadas" value={selecao.totalSelecionadas} />
            <Resumo label="Limite" value={selecao.limitePlano} />
            <Resumo
              label="Excedente"
              value={selecao.excedente}
              danger={selecao.excedente > 0}
            />
            <Resumo
              label="Valor extra"
              value={Number(selecao.valorExcedente || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
              danger={selecao.excedente > 0}
            />
          </div>

          {selecao.excedente > 0 && (
            <div className="mb-5 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-[13px] text-red-200">
              A cliente selecionou fotos acima do limite do pacote.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {fotosPrevias.map(renderFotoSelecionada)}
          </div>

          {temMaisFotos && (
            <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-4 max-sm:flex-col max-sm:items-start">
              <p className="text-[13px] text-white/45">
                Exibindo {LIMITE_PREVIA} de {fotosSelecionadas.length} fotos selecionadas.
              </p>

              <button
                type="button"
                onClick={() => setModalAberto(true)}
                className="rounded-lg border border-[var(--gold-border)] px-4 py-2 text-[12px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
              >
                Ver seleção completa
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={baixarLista}
            className="mt-5 rounded-lg border border-[var(--gold-border)] px-4 py-2 text-[12px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
          >
            Baixar lista para filtro
          </button>

          {modalAberto && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-8 backdrop-blur max-sm:p-4">
              <div className="flex max-h-[84vh] w-full max-w-5xl flex-col rounded-2xl border border-[var(--gold-border)] bg-[#121212] shadow-2xl">
                <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-7 py-6 max-sm:px-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--gold)]">
                      Seleção da cliente
                    </p>
                    <h3 className="mt-1 font-serif text-2xl font-light text-white">
                      Todas as fotos selecionadas
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalAberto(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xl text-white/55 transition hover:border-white/25 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="overflow-y-auto px-7 py-6 max-sm:px-5">
                  <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                    {fotosSelecionadas.map(renderFotoSelecionada)}
                  </div>

                  <button
                    type="button"
                    onClick={baixarLista}
                    className="mt-5 rounded-lg border border-[var(--gold-border)] px-4 py-2 text-[12px] text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
                  >
                    Baixar lista para filtro
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function Resumo({ label, value, danger }) {
  return (
    <div
      className={`rounded-xl border px-3 py-4 text-center ${
        danger
          ? 'border-red-400/30 bg-red-400/10'
          : 'border-white/[0.08] bg-black/10'
      }`}
    >
      <p className={danger ? 'text-[15px] text-red-300' : 'text-[15px] text-white'}>
        {value}
      </p>

      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
    </div>
  )
}
