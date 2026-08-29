import { useEffect, useState } from 'react'

import Header from '../components/layout/Header'
import Toast from '../components/ui/Toast'
import ConfiguracoesHeader from '../components/configuracoes/ConfiguracoesHeader'
import ConfiguracoesMenu from '../components/configuracoes/ConfiguracoesMenu'
import DadosUsuarioForm from '../components/configuracoes/DadosUsuarioForm'
import DadosEstudioForm from '../components/configuracoes/DadosEstudioForm'
import MarcaDaguaForm from '../components/configuracoes/MarcaDaguaForm'
import PreferenciasSistemaForm from '../components/configuracoes/PreferenciasSistemaForm'
import EmailConfigForm from '../components/configuracoes/EmailConfigForm'
import AlterarSenhaForm from '../components/configuracoes/AlterarSenhaForm'
import ModelosContratoForm from '../components/configuracoes/ModelosContratoForm'
import BackupDadosForm from '../components/configuracoes/BackupDadosForm'
import { configuracoesService } from '../services/configuracoesService'
import ConfirmActionModal from '../components/ui/ConfirmActionModal'
import { migrateOnboardingAccountKeys } from '../utils/onboarding'
import { invalidateOnboardingRouteCache } from '../utils/onboardingRouteCache'

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('usuario')
  const [configuracoes, setConfiguracoes] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [uploadFotoLoading, setUploadFotoLoading] = useState(false)
  const [uploadLogoLoading, setUploadLogoLoading] = useState(false)
  const [uploadMarcaLoading, setUploadMarcaLoading] = useState(false)
  const [reprocessLoading, setReprocessLoading] = useState(false)

  const [toast, setToast] = useState(null)
  const [alertModal, setAlertModal] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const notificarUsuarioAtualizado = (usuario) => {
    window.dispatchEvent(
      new CustomEvent('fotolhar:usuario-atualizado', {
        detail: usuario,
      }),
    )
  }

  const [gerarTextoLoading, setGerarTextoLoading] = useState(false)
  const [uploadCapaAlbumLoading, setUploadCapaAlbumLoading] = useState(false)
  const [backupLoading, setBackupLoading] = useState(false)
  const [emailTesteLoading, setEmailTesteLoading] = useState(false)

  async function carregarConfiguracoes() {
    try {
      setLoading(true)

      const data = await configuracoesService.buscar({ force: true })
      setConfiguracoes(data)
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao carregar:', error)
      showToast('Não foi possível carregar as configurações.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarConfiguracoes()
  }, [])


async function handleUploadCapaAlbumPadrao(arquivo) {
  if (!arquivo) return

  try {
    setUploadCapaAlbumLoading(true)

    const data = await configuracoesService.uploadCapaAlbumPadrao(arquivo)

    setConfiguracoes((current) => ({
      ...(current || {}),
      preferencias: data,
    }))

    showToast('Capa padrão do álbum atualizada com sucesso.')
  } catch (error) {
    console.error('[ConfiguracoesPage] Erro ao enviar capa padrão do álbum:', error)

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Não foi possível enviar a capa padrão do álbum.'

    showToast(message, 'error')
  } finally {
    setUploadCapaAlbumLoading(false)
  }
}


  async function handleSalvarUsuario(dados) {
    try {
      setSaving(true)

      const previousEmail = configuracoes?.usuario?.email || localStorage.getItem('usuarioEmail') || ''
      const data = await configuracoesService.atualizarUsuario(dados)
      const nextEmail = data?.email || dados.email || ''

      migrateOnboardingAccountKeys(previousEmail, nextEmail, {
        onboardingConcluido: data?.onboardingConcluido,
        onboardingConcluidoEm: data?.onboardingConcluidoEm,
      })

      if (data?.token) {
        localStorage.setItem('token', data.token)
        configuracoesService.invalidateAllUserCaches()
        invalidateOnboardingRouteCache()
      }

      if (data?.nome) localStorage.setItem('usuarioNome', data.nome)
      if (data?.email) localStorage.setItem('usuarioEmail', data.email)

      setConfiguracoes((current) => ({
        ...(current || {}),
        usuario: data,
      }))

      notificarUsuarioAtualizado(data)
      showToast('Dados atualizados com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao salvar:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível salvar os dados.'

      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleUploadFotoPerfil(arquivo) {
    if (!arquivo) return

    try {
      setUploadFotoLoading(true)

      const data = await configuracoesService.uploadFotoPerfil(arquivo)

      setConfiguracoes((current) => ({
        ...(current || {}),
        usuario: data,
      }))

      notificarUsuarioAtualizado(data)
      showToast('Foto de perfil atualizada com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao enviar foto de perfil:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível enviar a foto de perfil.'

      showToast(message, 'error')
    } finally {
      setUploadFotoLoading(false)
    }
  }

  async function handleSalvarEstudio(dados) {
    try {
      setSaving(true)

      const data = await configuracoesService.atualizarEstudio(dados)

      setConfiguracoes((current) => ({
        ...(current || {}),
        estudio: data,
      }))

      showToast('Dados do estúdio/empresa atualizados com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao salvar estúdio:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível salvar os dados do estúdio/empresa.'

      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleUploadLogoEstudio(arquivo) {
    if (!arquivo) return

    try {
      setUploadLogoLoading(true)

      const data = await configuracoesService.uploadLogoEstudio(arquivo)

      setConfiguracoes((current) => ({
        ...(current || {}),
        estudio: data,
      }))

      showToast('Logo do estúdio/empresa atualizada com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao enviar logo:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível enviar a logo do estúdio/empresa.'

      showToast(message, 'error')
    } finally {
      setUploadLogoLoading(false)
    }
  }

  async function handleSalvarMarcaDagua(dados) {
    try {
      setSaving(true)

      const data = await configuracoesService.atualizarMarcaDagua(dados)

      setConfiguracoes((current) => ({
        ...(current || {}),
        marcaDagua: data,
      }))

setAlertModal({
  type: 'success',
  title: 'Marca d’água salva!',
  description:
    'A configuração foi salva com sucesso. As próximas fotos enviadas já usarão essa marca d’água. Para atualizar fotos antigas, clique em “Reprocessar fotos já enviadas”.',
  confirmText: 'Entendi',
})    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao salvar marca d’água:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível salvar a marca d’água.'

      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleUploadMarcaDagua(arquivo) {
    if (!arquivo) return

    try {
      setUploadMarcaLoading(true)

      const data = await configuracoesService.uploadMarcaDagua(arquivo)

      setConfiguracoes((current) => ({
        ...(current || {}),
        marcaDagua: data,
      }))

      showToast('Marca d’água enviada com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao enviar marca d’água:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível enviar a marca d’água.'

      showToast(message, 'error')
    } finally {
      setUploadMarcaLoading(false)
    }
  }


  async function handleGerarMarcaDaguaTexto(dados) {
  try {
    setGerarTextoLoading(true)

    const data = await configuracoesService.gerarMarcaDaguaTexto(dados)

    setConfiguracoes((current) => ({
      ...(current || {}),
      marcaDagua: data,
    }))

    showToast('Marca d’água por texto gerada com sucesso.')
  } catch (error) {
    console.error('[ConfiguracoesPage] Erro ao gerar marca d’água por texto:', error)

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Não foi possível gerar a marca d’água por texto.'

    showToast(message, 'error')
  } finally {
    setGerarTextoLoading(false)
  }
}

  async function handleRemoverMarcaDagua() {
    try {
      setUploadMarcaLoading(true)

      const data = await configuracoesService.removerMarcaDagua()

      setConfiguracoes((current) => ({
        ...(current || {}),
        marcaDagua: data,
      }))

      showToast('Marca d’água removida com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao remover marca d’água:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível remover a marca d’água.'

      showToast(message, 'error')
    } finally {
      setUploadMarcaLoading(false)
    }
  }

  async function handleReprocessarMarcaDagua() {
    try {
      setReprocessLoading(true)

      const data = await configuracoesService.reprocessarMarcaDagua()

      showToast(data?.mensagem || 'Fotos reprocessadas com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao reprocessar fotos:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível reprocessar as fotos.'

      showToast(message, 'error')
    } finally {
      setReprocessLoading(false)
    }
  }

  async function handleSalvarPreferencias(dados) {
    try {
      setSaving(true)

      const data = await configuracoesService.atualizarPreferencias(dados)

      setConfiguracoes((current) => ({
        ...(current || {}),
        preferencias: data,
      }))

      showToast('Preferências atualizadas com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao salvar preferências:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível salvar as preferências.'

      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleSalvarEmail(dados) {
    try {
      setSaving(true)

      const data = await configuracoesService.atualizarEmail(dados)

      setConfiguracoes((current) => ({
        ...(current || {}),
        email: data,
      }))

      showToast('Configurações de e-mail atualizadas com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao salvar e-mail:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível salvar as configurações de e-mail.'

      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleEnviarEmailTeste() {
    try {
      setEmailTesteLoading(true)

      const data = await configuracoesService.enviarEmailTeste()

      setConfiguracoes((current) => ({
        ...(current || {}),
        email: data,
      }))

      showToast('E-mail de teste enviado com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao testar e-mail:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Nao foi possivel enviar o e-mail de teste.'

      showToast(message, 'error')
    } finally {
      setEmailTesteLoading(false)
    }
  }

  async function handleCriarModeloContrato(dados) {
    try {
      setSaving(true)

      const data = await configuracoesService.criarModeloContrato(dados)
      const modelos = await configuracoesService.listarModelosContrato()

      setConfiguracoes((current) => ({
        ...(current || {}),
        modelosContrato: modelos,
      }))

      showToast(`Modelo "${data.nome}" criado com sucesso.`)
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao criar modelo de contrato:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Nao foi possivel criar o modelo de contrato.'

      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleAtualizarModeloContrato(id, dados) {
    try {
      setSaving(true)

      await configuracoesService.atualizarModeloContrato(id, dados)
      const modelos = await configuracoesService.listarModelosContrato()

      setConfiguracoes((current) => ({
        ...(current || {}),
        modelosContrato: modelos,
      }))

      showToast('Modelo de contrato atualizado com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao atualizar modelo de contrato:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Nao foi possivel salvar o modelo de contrato.'

      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleRemoverModeloContrato(id) {
    try {
      setSaving(true)

      await configuracoesService.removerModeloContrato(id)
      const modelos = await configuracoesService.listarModelosContrato()

      setConfiguracoes((current) => ({
        ...(current || {}),
        modelosContrato: modelos,
      }))

      showToast('Modelo de contrato excluido com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao excluir modelo de contrato:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Nao foi possivel excluir o modelo de contrato.'

      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleGerarBackupMetadados() {
    try {
      setBackupLoading(true)

      const backup = await configuracoesService.gerarBackupMetadados()

      setConfiguracoes((current) => ({
        ...(current || {}),
        preferencias: {
          ...(current?.preferencias || {}),
          ultimoBackupMetadadosEm: backup?.geradoEm,
        },
      }))

      showToast('Backup de dados gerado com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao gerar backup:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Nao foi possivel gerar o backup de dados.'

      showToast(message, 'error')
    } finally {
      setBackupLoading(false)
    }
  }

  async function handleAlterarSenha(dados) {
    try {
      setSaving(true)

      await configuracoesService.alterarSenha(dados)

      showToast('Senha alterada com sucesso.')
    } catch (error) {
      console.error('[ConfiguracoesPage] Erro ao alterar senha:', error)

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível alterar a senha.'

      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Header />

      <main className="theme-page mx-auto max-w-[1200px] px-8 pb-16 pt-[96px] max-md:px-4">
        <ConfiguracoesHeader />

        <div className="grid gap-6 lg:grid-cols-[310px_1fr]">
          <ConfiguracoesMenu activeTab={activeTab} onChange={setActiveTab} />

          <section className="theme-card rounded-3xl border border-[var(--gold-border)] p-6">
            {loading ? (
              <div className="theme-panel rounded-2xl border p-6 text-sm">
                Carregando configurações...
              </div>
            ) : (
              <>
                {activeTab === 'usuario' && (
                  <DadosUsuarioForm
                    data={configuracoes?.usuario}
                    loading={saving}
                    uploadLoading={uploadFotoLoading}
                    onSubmit={handleSalvarUsuario}
                    onUploadFoto={handleUploadFotoPerfil}
                  />
                )}

                {activeTab === 'estudio' && (
                  <DadosEstudioForm
                    data={configuracoes?.estudio}
                    loading={saving}
                    uploadLoading={uploadLogoLoading}
                    onSubmit={handleSalvarEstudio}
                    onUploadLogo={handleUploadLogoEstudio}
                  />
                )}

                {activeTab === 'marcaDagua' && (
                  <MarcaDaguaForm
                    data={configuracoes?.marcaDagua}
                    loading={saving}
                    uploadLoading={uploadMarcaLoading}
                    reprocessLoading={reprocessLoading}
                    onSubmit={handleSalvarMarcaDagua}
                    onUploadImagem={handleUploadMarcaDagua}
                    onRemoverImagem={handleRemoverMarcaDagua}
                    onReprocessar={handleReprocessarMarcaDagua}
                    gerarTextoLoading={gerarTextoLoading}
                    onGerarTexto={handleGerarMarcaDaguaTexto}
                  />
                )}

                {activeTab === 'preferencias' && (
                  <PreferenciasSistemaForm
                    data={configuracoes?.preferencias}
                    loading={saving}
                      uploadCapaLoading={uploadCapaAlbumLoading}
                    onSubmit={handleSalvarPreferencias}
                      onUploadCapaAlbum={handleUploadCapaAlbumPadrao}

                  />
                )}

                {activeTab === 'senha' && (
                  <AlterarSenhaForm
                    loading={saving}
                    onSubmit={handleAlterarSenha}
                  />
                )}

                {activeTab === 'modelosContrato' && (
                  <ModelosContratoForm
                    data={configuracoes?.modelosContrato}
                    loading={saving}
                    onCreate={handleCriarModeloContrato}
                    onUpdate={handleAtualizarModeloContrato}
                    onDelete={handleRemoverModeloContrato}
                  />
                )}

                {activeTab === 'email' && (
                  <EmailConfigForm
                    data={configuracoes?.email}
                    loading={saving}
                    onSubmit={handleSalvarEmail}
                    testLoading={emailTesteLoading}
                    onTest={handleEnviarEmailTeste}
                  />
                )}

                {activeTab === 'backup' && (
                  <BackupDadosForm
                    ultimoBackup={configuracoes?.preferencias?.ultimoBackupMetadadosEm}
                    loading={backupLoading}
                    onGerarBackup={handleGerarBackupMetadados}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </main>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {alertModal && (
        <ConfirmActionModal
          open={Boolean(alertModal)}
          type={alertModal.type}
          title={alertModal.title}
          description={alertModal.description}
          confirmText={alertModal.confirmText}
          showCancel={false}
          onClose={() => setAlertModal(null)}
          onConfirm={() => setAlertModal(null)}
        />
      )}
    </>
  )
}
