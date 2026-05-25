import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import ConfirmSelectionModal from '../components/album/galeria/ConfirmSelectionModal'
import FavoritesView from '../components/album/galeria/FavoritesView'
import FloatingSelectionBar from '../components/album/galeria/FloatingSelectionBar'
import GalleryGrid from '../components/album/galeria/GalleryGrid'
import GalleryHero from '../components/album/galeria/GalleryHero'
import GalleryLightbox from '../components/album/galeria/GalleryLightbox'
import GalleryTabs from '../components/album/galeria/GalleryTabs'
import SelectionSentNotice from '../components/album/galeria/SelectionSentNotice'
import SelectionSuccessModal from '../components/album/galeria/SelectionSuccessModal'
import {
  LIMITE_PADRAO,
  VALOR_EXTRA_PADRAO,
  formatDate,
  getFotoUrl,
} from '../services/galeriaUtils'
import { enviarSelecaoFotos } from '../services/albumAccessService'

export default function GaleriaPage() {
  const { token } = useParams()

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

  const [aba, setAba] = useState('galeria')
  const [favoritas, setFavoritas] = useState(
    Array.isArray(album?.fotosSelecionadas) ? album.fotosSelecionadas : [],
  )
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [lightboxOrigem, setLightboxOrigem] = useState('galeria')
  const [modalAberto, setModalAberto] = useState(false)
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [selecaoEnviada, setSelecaoEnviada] = useState(
    Boolean(album?.selecaoEnviada || album?.selecaoFinalizada),
  )
  const [erroEnvio, setErroEnvio] = useState('')

  if (!album) {
    return <Navigate to={`/album/${token}`} replace />
  }

  const fotos = Array.isArray(album.fotos) ? album.fotos : []
  const fotosFavoritas = fotos.filter((foto) => favoritas.includes(foto.id))
  const fotosLightbox = lightboxOrigem === 'favoritas' ? fotosFavoritas : fotos
  const fotoLightbox = lightboxIndex !== null ? fotosLightbox[lightboxIndex] : null

  const nomeCliente = album.nomeCliente || album.clienteNome || album.nome || 'Cliente'
  const tipoEnsaio = album.tipoEnsaio || album.tipo || 'Ensaio fotográfico'
  const limite =
    album.qtdFotosPacote ||
    album.quantidadeFotos ||
    album.limiteFotos ||
    album.quantidadeFotosPacote ||
    LIMITE_PADRAO
  const localEnsaio = album.local || album.localEnsaio || 'Local não informado'
  const dataFormatada = formatDate(album.dataEnsaio)
  const cobraFotoExtra = album.cobrarFotoExtra === true
  const valorFotoExtra = cobraFotoExtra ? Number(album.valorFotoExtra || VALOR_EXTRA_PADRAO) : 0

  const totalSelecionadas = favoritas.length
  const excedente = Math.max(0, totalSelecionadas - limite)
  const valorExcedente = cobraFotoExtra ? excedente * valorFotoExtra : 0
  const progresso =
    limite > 0 ? Math.min(100, Math.round((totalSelecionadas / limite) * 100)) : 0

  function toggleFavorita(fotoId) {
    if (selecaoEnviada) return

    setFavoritas((atual) => {
      if (atual.includes(fotoId)) {
        return atual.filter((id) => id !== fotoId)
      }

      return [...atual, fotoId]
    })
  }

  function abrirLightbox(index, origem = 'galeria') {
    setLightboxOrigem(origem)
    setLightboxIndex(index)
  }

  function fecharLightbox() {
    setLightboxIndex(null)
  }

  function moverLightbox(direcao) {
    setLightboxIndex((indexAtual) => {
      if (indexAtual === null || fotosLightbox.length === 0) return null

      return (indexAtual + direcao + fotosLightbox.length) % fotosLightbox.length
    })
  }

  function abrirModalConfirmacao() {
    setErroEnvio('')
    setModalAberto(true)
  }

  async function confirmarSelecao() {
    if (selecaoEnviada) {
      setModalAberto(false)
      setErroEnvio('Esta seleção já foi finalizada e não pode ser alterada.')
      return
    }

    try {
      setEnviando(true)
      setErroEnvio('')

      await enviarSelecaoFotos(token, favoritas)

      setSelecaoEnviada(true)
      setModalAberto(false)
      setModalSucessoAberto(true)

      sessionStorage.setItem(
        `olhari_album_${token}`,
        JSON.stringify({
          ...album,
          selecaoEnviada: true,
          fotosSelecionadas: favoritas,
        }),
      )
    } catch (error) {
      const status = error?.response?.status

      setModalAberto(false)

      if (status === 400) {
        setErroEnvio('Esta seleção já foi enviada ou contém fotos inválidas.')
      } else if (status === 403) {
        setErroEnvio('Acesso não autorizado ao álbum.')
      } else {
        setErroEnvio('Não foi possível enviar sua seleção. Tente novamente.')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-[#1a1610]">
      <GalleryHero
        coverUrl={getFotoUrl(fotos[0])}
        nomeCliente={nomeCliente}
        tipoEnsaio={tipoEnsaio}
        dataFormatada={dataFormatada}
        localEnsaio={localEnsaio}
        totalFotos={fotos.length}
        limite={limite}
      />

      <GalleryTabs
        aba={aba}
        onChangeAba={setAba}
        totalFotos={fotos.length}
        totalSelecionadas={totalSelecionadas}
        limite={limite}
        excedente={excedente}
      />

      <SelectionSuccessModal
        open={modalSucessoAberto}
        onClose={() => setModalSucessoAberto(false)}
      />

      <SelectionSentNotice visible={selecaoEnviada} />

      {aba === 'galeria' ? (
        <GalleryGrid
          fotos={fotos}
          favoritas={favoritas}
          onOpenLightbox={abrirLightbox}
          onToggleFavorita={toggleFavorita}
        />
      ) : null}

      {aba === 'favoritas' ? (
        <FavoritesView
          fotosFavoritas={fotosFavoritas}
          totalSelecionadas={totalSelecionadas}
          limite={limite}
          excedente={excedente}
          cobraFotoExtra={cobraFotoExtra}
          valorFotoExtra={valorFotoExtra}
          valorExcedente={valorExcedente}
          progresso={progresso}
          erroEnvio={erroEnvio}
          enviando={enviando}
          selecaoEnviada={selecaoEnviada}
          onExploreGallery={() => setAba('galeria')}
          onOpenLightbox={abrirLightbox}
          onToggleFavorita={toggleFavorita}
          onOpenConfirm={abrirModalConfirmacao}
        />
      ) : null}

      <FloatingSelectionBar
        visible={totalSelecionadas > 0 && aba === 'galeria' && !selecaoEnviada}
        totalSelecionadas={totalSelecionadas}
        excedente={excedente}
        onViewSelection={() => setAba('favoritas')}
      />

      <GalleryLightbox
        foto={fotoLightbox}
        fotos={fotosLightbox}
        index={lightboxIndex}
        favoritas={favoritas}
        onClose={fecharLightbox}
        onMove={moverLightbox}
        onToggleFavorita={toggleFavorita}
      />

      <ConfirmSelectionModal
        open={modalAberto}
        totalSelecionadas={totalSelecionadas}
        limite={limite}
        excedente={excedente}
        cobraFotoExtra={cobraFotoExtra}
        valorExcedente={valorExcedente}
        enviando={enviando}
        onCancel={() => setModalAberto(false)}
        onConfirm={confirmarSelecao}
      />
    </main>
  )
}
