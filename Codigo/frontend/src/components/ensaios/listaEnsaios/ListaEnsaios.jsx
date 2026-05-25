import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Toast from '../../ui/Toast'
import { ensaiosService } from '../../../services/ensaiosService'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import EditEnsaioModal from './EditEnsaioModal'
import EmptyState from './EmptyState'
import CalendarioEnsaios from './CalendarioEnsaios'
import EnsaiosGrid from './EnsaiosGrid'
import EnsaiosTable from './EnsaiosTable'
import EnsaiosToolbar from './EnsaiosToolbar'
import Icon from './Icon'
import LoadingState from './LoadingState'
import Pagination from './Pagination'
import StatusModal from './StatusModal'
import StatusTabs from './StatusTabs'

const INITIAL_FILTERS = {
  clienteNome: '',
  tipo: '',
  status: '',
  dataInicio: '',
  dataFim: '',
}

const buildParams = (filters) => {
  const params = {}

  if (filters.clienteNome.trim()) {
    params.clienteNome = filters.clienteNome.trim()
  }

  if (filters.tipo) {
    params.tipo = filters.tipo
  }

  if (filters.status) {
    params.status = filters.status
  }

  if (filters.dataInicio) {
    params.dataInicio = new Date(`${filters.dataInicio}T00:00:00`).toISOString()
  }

  if (filters.dataFim) {
    params.dataFim = new Date(`${filters.dataFim}T23:59:59`).toISOString()
  }

  return params
}

const sortValue = (ensaio, key) => {
  if (key === 'dataEnsaio') {
    return ensaio.dataEnsaio ? new Date(ensaio.dataEnsaio).getTime() : 0
  }

  if (key === 'valorPacote' || key === 'progresso') {
    return Number(ensaio[key] || 0)
  }

  return String(ensaio[key] || '').toLowerCase()
}

export default function ListaEnsaios() {
  const navigate = useNavigate()

  const [ensaios, setEnsaios] = useState([])
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [filtersResetKey, setFiltersResetKey] = useState(0)
  const [viewMode, setViewMode] = useState('table')
  const [sort, setSort] = useState({ key: 'dataEnsaio', direction: 'desc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const loadEnsaios = async () => {
    setLoading(true)

    try {
      const response = await ensaiosService.listar(buildParams(filters))
      setEnsaios(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('[Ensaios] Erro ao listar:', error?.response?.data || error)
      showToast('Não foi possível carregar os ensaios.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1)
      loadEnsaios()
    }, 250)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const sortedEnsaios = useMemo(() => {
    return [...ensaios].sort((a, b) => {
      const aValue = sortValue(a, sort.key)
      const bValue = sortValue(b, sort.key)

      if (aValue === bValue) return 0

      const result = aValue > bValue ? 1 : -1
      return sort.direction === 'asc' ? result : -result
    })
  }, [ensaios, sort])

  const totalPages = Math.max(1, Math.ceil(sortedEnsaios.length / pageSize))

  const paginatedEnsaios = sortedEnsaios.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleClearFilters = () => {
    setFilters({ ...INITIAL_FILTERS })
    setFiltersResetKey((current) => current + 1)
    setPage(1)
  }

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleOpenDetails = (ensaio) => {
    navigate(`/ensaios/${ensaio.id}`)
  }

  const openModal = (type, ensaio) => {
    setSelected(ensaio)
    setModal(type)
  }

  const closeModal = () => {
    if (actionLoading) return

    setModal(null)
    setSelected(null)
  }

  const handleDelete = async () => {
    if (!selected) return

    setActionLoading(true)

    try {
      await ensaiosService.excluir(selected.id)
      showToast('Ensaio excluído com sucesso.')
      closeModal()
      loadEnsaios()
    } catch (error) {
      const msg =
        error?.response?.data?.erro ||
        error?.response?.data?.message ||
        'Não foi possível excluir este ensaio.'

      showToast(msg, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleStatus = async (status) => {
    if (!selected || selected.status === status) {
      closeModal()
      return
    }

    setActionLoading(true)

    try {
      await ensaiosService.atualizarStatus(selected.id, status)
      showToast('Status atualizado com sucesso.')
      closeModal()
      loadEnsaios()
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        'Não foi possível atualizar o status.'

      showToast(msg, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = async (payload) => {
    if (!selected) return

    setActionLoading(true)

    try {
      await ensaiosService.atualizar(selected.id, payload)
      showToast('Ensaio atualizado com sucesso.')
      closeModal()
      loadEnsaios()
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível salvar as alterações.'

      showToast(msg, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handlePreContrato = (ensaio) => {
    navigate(`/ensaios/${ensaio.id}/pre-contrato`)
  }

  const handleCreateForDate = (date) => {
    navigate(`/novo-ensaio?data=${date}`)
  }

  const countLabel = `${ensaios.length} ensaio${
    ensaios.length === 1 ? '' : 's'
  } cadastrado${ensaios.length === 1 ? '' : 's'}`

  return (
    <>
      <main className="relative z-[1] mx-auto max-w-[1200px] px-8 pb-16 pt-[88px] animate-[fadeUp_0.55s_cubic-bezier(0.22,1,0.36,1)_both] max-md:px-4">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1 text-[10.5px] uppercase tracking-[0.2em] text-white/30">
              Gestão
            </div>

            <h1 className="font-serif text-[32px] font-light tracking-[0.04em] text-white">
              Ensaios
            </h1>

            <p className="mt-0.5 text-[12px] text-white/35">
              {countLabel}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadEnsaios}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.10] bg-[#181818] px-4 py-2.5 text-[12px] tracking-[0.08em] text-white/60 transition hover:border-[var(--gold-border)] hover:text-white"
            >
              <Icon name="refresh" size={13} />
              Atualizar
            </button>

            <button
              type="button"
              onClick={() => navigate('/novo-ensaio')}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--gold)] px-5 py-2.5 text-[12px] font-medium tracking-[0.1em] text-[#1A1200] transition hover:-translate-y-0.5 hover:bg-[var(--gold-light)]"
            >
              <Icon name="plus" size={14} />
              Novo Ensaio
            </button>
          </div>
        </div>

        <EnsaiosToolbar
          filters={filters}
          resetKey={filtersResetKey}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onClear={handleClearFilters}
        />

        <StatusTabs
          activeStatus={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        {loading ? (
          <LoadingState />
        ) : sortedEnsaios.length === 0 ? (
          <EmptyState onCreate={() => navigate('/novo-ensaio')} />
        ) : (
          <>
            {viewMode === 'calendar' ? (
              <CalendarioEnsaios
                ensaios={sortedEnsaios}
                onView={handleOpenDetails}
                onCreateForDate={handleCreateForDate}
              />
            ) : viewMode === 'table' ? (
              <EnsaiosTable
                ensaios={paginatedEnsaios}
                sort={sort}
                onSort={handleSort}
                onView={handleOpenDetails}
                onEdit={(ensaio) => openModal('edit', ensaio)}
                onStatus={(ensaio) => openModal('status', ensaio)}
                onDelete={(ensaio) => openModal('delete', ensaio)}
                onPreContrato={handlePreContrato}
              />
            ) : (
              <EnsaiosGrid
                ensaios={paginatedEnsaios}
                onView={handleOpenDetails}
                onEdit={(ensaio) => openModal('edit', ensaio)}
                onStatus={(ensaio) => openModal('status', ensaio)}
                onDelete={(ensaio) => openModal('delete', ensaio)}
                onPreContrato={handlePreContrato}
              />
            )}

            {viewMode !== 'calendar' && (
              <Pagination
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                total={sortedEnsaios.length}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size)
                  setPage(1)
                }}
              />
            )}
          </>
        )}
      </main>

      <EditEnsaioModal
        open={modal === 'edit'}
        ensaio={selected}
        loading={actionLoading}
        onClose={closeModal}
        onSave={handleEdit}
      />

      <StatusModal
        open={modal === 'status'}
        ensaio={selected}
        loading={actionLoading}
        onClose={closeModal}
        onConfirm={handleStatus}
      />

      <ConfirmDeleteModal
        open={modal === 'delete'}
        ensaio={selected}
        loading={actionLoading}
        onClose={closeModal}
        onConfirm={handleDelete}
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
