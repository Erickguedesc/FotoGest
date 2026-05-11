import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Header from '../components/layout/Header'
import Toast from '../components/ui/Toast'

import { ensaiosService } from '../services/ensaiosService'
import { fotosService } from '../services/fotosService'
import { albumService } from '../services/albumService'

import EditEnsaioModal from '../components/ensaios/listaEnsaios/EditEnsaioModal'
import ConfirmDeleteModal from '../components/ensaios/listaEnsaios/ConfirmDeleteModal'

import EnsaioHero from '../components/ensaios/detalhesEnsaio/EnsaioHero'
import LinhaTempo from '../components/ensaios/detalhesEnsaio/LinhaTempo'
import InformacoesCard from '../components/ensaios/detalhesEnsaio/InformacoesCard'
import AlbumUpload from '../components/ensaios/detalhesEnsaio/AlbumUpload'
import AlbumFotoGrid from '../components/ensaios/detalhesEnsaio/AlbumFotoGrid'
import AlbumPublicadoResumo from '../components/ensaios/detalhesEnsaio/AlbumPublicadoResumo'
import SelecaoClienteCard from '../components/ensaios/detalhesEnsaio/SelecaoClienteCard'
import StatusSidebar from '../components/ensaios/detalhesEnsaio/StatusSidebar'
import PublicacaoCard from '../components/ensaios/detalhesEnsaio/PublicacaoCard'
import AcoesGerais from '../components/ensaios/detalhesEnsaio/AcoesGerais'

const extrairTokenDoLink = (url) => {
  if (!url) return ''

  const partes = url.split('/')
  return partes[partes.length - 1] || ''
}

export default function DetalhesEnsaio() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [ensaio, setEnsaio] = useState(null)
  const [fotos, setFotos] = useState([])
  const [album, setAlbum] = useState(null)
  const [selecao, setSelecao] = useState(null)

  const [loading, setLoading] = useState(true)
  const [fotosLoading, setFotosLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [publicando, setPublicando] = useState(false)
  const [buscandoSelecao, setBuscandoSelecao] = useState(false)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [toast, setToast] = useState(null)
  const [historicoStatus, setHistoricoStatus] = useState([])

  const albumToken = useMemo(() => {
    if (album?.tokenUrl) return album.tokenUrl
    return extrairTokenDoLink(album?.urlAcesso)
  }, [album])

  const albumPublicado = Boolean(
    album?.urlAcesso &&
    album?.ativo !== false &&
    album?.acessoLiberado !== false
  )

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }
const loadEnsaio = async () => {
  try {
    const response = await ensaiosService.buscarPorId(id)
    setEnsaio(response.data)
    return response.data
  } catch (error) {
    console.error('[DetalhesEnsaio] Erro ao carregar ensaio:', error?.response?.data || error)
    showToast('Não foi possível carregar os detalhes do ensaio.', 'error')
    return null
  }
}

  const loadFotos = async () => {
    setFotosLoading(true)

    try {
      const response = await fotosService.listarPorEnsaio(id)
      const data = Array.isArray(response.data) ? response.data : []

      setFotos(data)
      return data
    } catch (error) {
      console.error('[DetalhesEnsaio] Erro ao carregar fotos:', error?.response?.data || error)
      showToast('Não foi possível carregar as fotos do ensaio.', 'error')
      return []
    } finally {
      setFotosLoading(false)
    }
  }

  const loadHistoricoStatus = async () => {
  try {
    const response = await ensaiosService.buscarHistoricoStatus(id)
    setHistoricoStatus(Array.isArray(response.data) ? response.data : [])
  } catch (error) {
    console.error('[DetalhesEnsaio] Erro ao carregar histórico de status:', error?.response?.data || error)
    setHistoricoStatus([])
  }
}
  const loadAlbum = async () => {
    try {
      const response = await albumService.buscarPorEnsaio(id)
      setAlbum(response.data)
      return response.data
    } catch (error) {
      if (error?.response?.status !== 404) {
        console.error('[DetalhesEnsaio] Erro ao carregar álbum:', error?.response?.data || error)
      }

      setAlbum(null)
      return null
    }
  }
const loadInitialData = async () => {
  setLoading(true)

  try {
    await Promise.all([
      loadEnsaio(),
      loadFotos(),
      loadAlbum(),
      loadHistoricoStatus(),
    ])
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    loadInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleEdit = async (payload) => {
    if (!ensaio) return

    setEditLoading(true)

    try {
      await ensaiosService.atualizar(ensaio.id, payload)
      showToast('Ensaio atualizado com sucesso.')
      setEditModalOpen(false)
      await loadEnsaio()
      await loadHistoricoStatus()
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível salvar as alterações.'

      showToast(msg, 'error')
    } finally {
      setEditLoading(false)
    }
  }

  const handleStatusChange = async (status) => {
  if (!ensaio || ensaio.status === status) return

  setActionLoading(true)

  try {
    await ensaiosService.atualizarStatus(ensaio.id, status)
    showToast('Status atualizado com sucesso.')
    await loadEnsaio()
    await loadHistoricoStatus()
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      'Não foi possível atualizar o status.'

    showToast(msg, 'error')
  } finally {
    setActionLoading(false)
  }
}

  const handleUploadFotos = async (arquivos) => {
    if (albumPublicado) {
      showToast(
        'O álbum já foi publicado. Para evitar alterar a galeria enviada, o upload foi bloqueado.',
        'error'
      )
      return
    }

    if (!arquivos?.length) return

    setUploadLoading(true)

    try {
      await fotosService.upload(id, arquivos)
      showToast('Fotos enviadas com sucesso.')
      await loadFotos()
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        'Não foi possível enviar as fotos.'

      showToast(msg, 'error')
    } finally {
      setUploadLoading(false)
    }
  }

  const handleDefinirCapa = async (fotoId) => {
    if (albumPublicado) {
      showToast('O álbum já foi publicado. A capa não pode ser alterada agora.', 'error')
      return
    }

    try {
      await fotosService.definirCapa(fotoId)
      showToast('Capa atualizada com sucesso.')
      await loadFotos()
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        'Não foi possível definir a capa.'

      showToast(msg, 'error')
    }
  }

  const handleRemoverFoto = async (fotoId) => {
    if (albumPublicado) {
      showToast('O álbum já foi publicado. Não é possível remover fotos agora.', 'error')
      return
    }

    const confirmar = window.confirm('Tem certeza que deseja remover esta foto?')

    if (!confirmar) return

    try {
      await fotosService.remover(fotoId)
      showToast('Foto removida com sucesso.')
      await loadFotos()
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        'Não foi possível remover a foto.'

      showToast(msg, 'error')
    }
  }
const handlePublicar = async () => {
  if (!fotos.length) {
    showToast('Envie fotos antes de publicar o álbum.', 'error')
    return
  }

  if (albumPublicado) {
    const confirmar = window.confirm(
      'Gerar uma nova senha vai invalidar a senha anterior. A cliente precisará receber a nova senha para acessar o álbum. Deseja continuar?'
    )

    if (!confirmar) return
  }

  if (album?.urlAcesso && !albumPublicado) {
    const confirmar = window.confirm(
      'Publicar novamente vai liberar o álbum para a cliente e gerar uma nova senha de acesso. Deseja continuar?'
    )

    if (!confirmar) return
  }

  setPublicando(true)

  try {
    const publicarResponse = await albumService.gerar(id)

    let adminAlbum = null

    try {
      const adminResponse = await albumService.buscarPorEnsaio(id)
      adminAlbum = adminResponse.data
    } catch (error) {
      console.error(
        '[DetalhesEnsaio] Álbum publicado, mas não foi possível recarregar admin:',
        error?.response?.data || error
      )
    }

    setAlbum({
      ...(adminAlbum || {}),
      urlAcesso: publicarResponse.data?.urlAcesso || adminAlbum?.urlAcesso,
      senhaAcesso: publicarResponse.data?.senhaAcesso,
      ativo: adminAlbum?.ativo ?? true,
      acessoLiberado: adminAlbum?.acessoLiberado ?? true,
    })

    showToast(
      album?.urlAcesso
        ? 'Nova senha gerada com sucesso. Envie a senha atualizada para a cliente.'
        : 'Álbum publicado com sucesso. As fotos foram bloqueadas para preservar a galeria enviada.'
    )
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      'Não foi possível publicar o álbum.'

    showToast(msg, 'error')
  } finally {
    setPublicando(false)
  }
}

  const handleReabrirAlbum = async () => {
    const confirmar = window.confirm(
      'Reabrir o álbum vai pausar o acesso da cliente e liberar a Edição do álbum para você. Depois será necessário publicar novamente e enviar uma nova senha e link. Deseja continuar?'
    )

    if (!confirmar) return

    setPublicando(true)

    try {
      const response = await albumService.reabrir(id)
      setAlbum(response.data)
      setSelecao(null)

      showToast('Álbum reaberto para edição. O acesso da cliente foi pausado.')
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        'Não foi possível reabrir o álbum.'

      showToast(msg, 'error')
    } finally {
      setPublicando(false)
    }
  }

  const handleBuscarSelecao = async () => {
    if (!albumToken) {
      showToast('Publique o álbum primeiro para consultar a seleção.', 'error')
      return
    }

    if (!albumPublicado) {
      showToast('O álbum está pausado. Publique novamente antes de consultar a seleção.', 'error')
      return
    }

    setBuscandoSelecao(true)

    try {
      const response = await albumService.buscarSelecao(albumToken)
      setSelecao(response.data)
      showToast('Seleção consultada com sucesso.')
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        'Ainda não existe seleção enviada pela cliente.'

      showToast(msg, 'error')
    } finally {
      setBuscandoSelecao(false)
    }
  }

  const handleCopyLink = async () => {
    if (!album?.urlAcesso) {
      showToast('O álbum ainda precisa ser publicado.', 'error')
      return
    }

    try {
      await navigator.clipboard.writeText(album.urlAcesso)
      showToast('Link copiado com sucesso.')
    } catch {
      showToast('Não foi possível copiar o link.', 'error')
    }
  }

const limparTelefone = (valor) => {
  const apenasNumeros = String(valor || '').replace(/\D/g, '')

  if (!apenasNumeros) return ''

  if (apenasNumeros.startsWith('55')) {
    return apenasNumeros
  }

  return `55${apenasNumeros}`
}

const handleWhatsApp = () => {
  const telefoneBruto =
    ensaio?.clienteWhatsapp ||
    ensaio?.whatsapp ||
    ensaio?.clienteTelefone ||
    ensaio?.telefoneCliente ||
    ensaio?.telefone ||
    ensaio?.cliente?.telefone ||
    ensaio?.cliente?.whatsapp

  const telefone = limparTelefone(telefoneBruto)

  if (!telefone) {
    showToast('Este ensaio não possui WhatsApp cadastrado.', 'error')
    return
  }

  if (album?.urlAcesso && !albumPublicado) {
    showToast('O álbum está pausado. Publique novamente antes de enviar para a cliente.', 'error')
    return
  }

  const texto =
    album?.urlAcesso && albumPublicado
      ? album?.senhaAcesso
        ? `Olá! Seu álbum já está disponível:\n\nLink: ${album.urlAcesso}\nSenha: ${album.senhaAcesso}`
        : `Olá! Seu álbum já está disponível:\n\nLink: ${album.urlAcesso}`
      : 'Olá! Estou entrando em contato sobre seu ensaio.'

  window.open(
    `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`,
    '_blank'
  )
}

  const handleExportPdf = () => {
    showToast('Exportação de PDF será ligada depois.', 'error')
  }

  const handleDelete = () => {
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!ensaio) return

    setDeleteLoading(true)

    try {
      await ensaiosService.excluir(ensaio.id)
      showToast('Ensaio excluído com sucesso.')
      setDeleteModalOpen(false)

      setTimeout(() => {
        navigate('/ensaios')
      }, 600)
    } catch (error) {
      const msg =
        error?.response?.data?.erro ||
        error?.response?.data?.message ||
        'Não foi possível excluir este ensaio.'

      showToast(msg, 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />

        <main className="mx-auto max-w-[1200px] px-8 pt-[110px] text-white max-md:px-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-8 text-white/50">
            Carregando detalhes do ensaio...
          </div>
        </main>
      </>
    )
  }

  if (!ensaio) {
    return (
      <>
        <Header />

        <main className="mx-auto max-w-[1200px] px-8 pt-[110px] text-white max-md:px-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#141414] p-8">
            <h1 className="font-serif text-2xl text-white">
              Ensaio não encontrado
            </h1>

            <p className="mt-2 text-sm text-white/45">
              Não foi possível encontrar os dados deste ensaio.
            </p>

            <button
              type="button"
              onClick={() => navigate('/ensaios')}
              className="mt-5 rounded-lg border border-[var(--gold-border)] px-4 py-2 text-sm text-[var(--gold)] transition hover:bg-[var(--gold-dim)]"
            >
              Voltar para ensaios
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-[1200px] px-8 pb-16 pt-[92px] text-white max-md:px-4">
        <div className="mb-5 text-[11px] text-white/40">
          <button
            type="button"
            onClick={() => navigate('/ensaios')}
            className="transition hover:text-[var(--gold)]"
          >
            Ensaios
          </button>

          <span className="mx-2 text-white/20">›</span>
          <span className="text-white/70">{ensaio.clienteNome}</span>
        </div>

        <EnsaioHero
          ensaio={ensaio}
          fotos={fotos}
          onEdit={() => setEditModalOpen(true)}
          onPreContrato={() => navigate(`/ensaios/${ensaio.id}/pre-contrato`)}
          onBack={() => navigate('/ensaios')}
        />

        <div className="mt-5 grid grid-cols-[1fr_360px] gap-5 max-lg:grid-cols-1">
          <div className="space-y-5">
<LinhaTempo
  ensaio={ensaio}
  historicoStatus={historicoStatus}
/>
            <InformacoesCard
              ensaio={ensaio}
              onEdit={() => setEditModalOpen(true)}
            />

            {albumPublicado ? (
              <AlbumPublicadoResumo fotos={fotos} />
            ) : (
              <>
                <AlbumUpload
                  totalFotos={fotos.length}
                  loading={uploadLoading}
                  disabled={albumPublicado}
                  onUpload={handleUploadFotos}
                />

                <AlbumFotoGrid
                  fotos={fotos}
                  loading={fotosLoading}
                  disabled={albumPublicado}
                  onDefinirCapa={handleDefinirCapa}
                  onRemoverFoto={handleRemoverFoto}
                />
              </>
            )}

            <SelecaoClienteCard
              fotos={fotos}
              selecao={selecao}
              loading={buscandoSelecao}
              onBuscarSelecao={handleBuscarSelecao}
            />
          </div>

          <aside className="space-y-5">
            <StatusSidebar
              ensaio={ensaio}
              loading={actionLoading}
              onStatusChange={handleStatusChange}
            />

            <PublicacaoCard
              album={album}
              totalFotos={fotos.length}
              loading={publicando}
              albumPublicado={albumPublicado}
              onPublicar={handlePublicar}
              onReabrir={handleReabrirAlbum}
              onCopyLink={handleCopyLink}
              onWhatsApp={handleWhatsApp}
            />

            <AcoesGerais
              onWhatsApp={handleWhatsApp}
              onCopyLink={handleCopyLink}
              onExportPdf={handleExportPdf}
              onDelete={handleDelete}
            />
          </aside>
        </div>
      </main>

      <EditEnsaioModal
        open={editModalOpen}
        ensaio={ensaio}
        loading={editLoading}
        onClose={() => {
          if (!editLoading) setEditModalOpen(false)
        }}
        onSave={handleEdit}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        ensaio={ensaio}
        loading={deleteLoading}
        onClose={() => {
          if (!deleteLoading) setDeleteModalOpen(false)
        }}
        onConfirm={handleConfirmDelete}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}