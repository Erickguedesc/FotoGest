import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

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

const INITIAL_FILTERS = {
  clienteNome: '',
  tipo: '',
  status: '',
  dataInicio: '',
  dataFim: '',
  grupo: 'ativos',
}

const STATUS_EM_ANDAMENTO = ['REALIZADO', 'EM_SELECAO', 'EM_EDICAO']
const STATUS_ATIVOS = ['AGENDADO', 'REALIZADO', 'EM_SELECAO', 'EM_EDICAO']

const GRUPO_STATUS = {
  ativos: STATUS_ATIVOS,
}

const VIEW_MODE_STORAGE_KEY = 'fotogest:ensaios:viewMode'
const VIEW_MODES = ['table', 'grid', 'calendar']
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const getInitialViewMode = () => {
  try {
    const saved = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY)
    return VIEW_MODES.includes(saved) ? saved : 'table'
  } catch {
    return 'table'
  }
}

const normalizeDateParam = (value) => {
  if (!value || !DATE_PATTERN.test(value)) return ''

  const [year, month, day] = value.split('-').map(Number)
  if (year < 1900 || year > 2100) return ''

  const date = new Date(year, month - 1, day)
  const valid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day

  return valid ? value : ''
}

const getInitialFilters = (searchParams) => ({
  ...INITIAL_FILTERS,
  status: searchParams.get('status') || '',
  dataInicio: normalizeDateParam(searchParams.get('dataInicio')),
  dataFim: normalizeDateParam(searchParams.get('dataFim')),
  grupo: searchParams.get('status') ? '' : searchParams.get('grupo') || 'ativos',
})

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

const buildStatusCounts = (ensaios) => {
  return ensaios.reduce(
    (acc, ensaio) => {
      acc.total += 1
      acc[ensaio.status] = (acc[ensaio.status] || 0) + 1

      return acc
    },
    { total: 0 }
  )
}

const filtrarPorGrupo = (ensaios, grupo) => {
  const statusPermitidos = GRUPO_STATUS[grupo]

  if (!statusPermitidos) return ensaios

  return ensaios.filter((ensaio) => statusPermitidos.includes(ensaio.status))
}

export default function ListaEnsaios() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [ensaios, setEnsaios] = useState([])
  const [statusCounts, setStatusCounts] = useState({ total: 0 })
  const [filters, setFilters] = useState(() => getInitialFilters(searchParams))
  const [filtersResetKey, setFiltersResetKey] = useState(0)
  const [viewMode, setViewMode] = useState(getInitialViewMode)
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
      const [response, statusResponse] = await Promise.all([
        ensaiosService.listar(buildParams(filters)),
        ensaiosService.listar(buildParams({
          ...filters,
          status: '',
          grupo: '',
        })),
      ])

      const data = Array.isArray(response.data) ? response.data : []
      const statusData = Array.isArray(statusResponse.data) ? statusResponse.data : []
      const ensaiosFiltrados = filters.status
        ? data
        : filters.grupo === 'andamento'
          ? data.filter((ensaio) => STATUS_EM_ANDAMENTO.includes(ensaio.status))
          : filtrarPorGrupo(data, filters.grupo)

      setEnsaios(ensaiosFiltrados)
      setStatusCounts(buildStatusCounts(statusData))
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

  useEffect(() => {
    setFilters(getInitialFilters(searchParams))
    setFiltersResetKey((current) => current + 1)
    setPage(1)
  }, [searchParams])

  useEffect(() => {
    if (viewMode !== 'calendar' || filters.status || filters.grupo === 'todos') {
      return
    }

    setFilters((prev) => {
      if (prev.status || prev.grupo === 'todos') return prev

      const next = {
        ...prev,
        grupo: 'todos',
      }

      updateUrlFilters(next)

      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, filters.status, filters.grupo])

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

  const updateUrlFilters = (nextFilters) => {
    const params = {}

    if (nextFilters.status) params.status = nextFilters.status
    if (nextFilters.dataInicio) params.dataInicio = nextFilters.dataInicio
    if (nextFilters.dataFim) params.dataFim = nextFilters.dataFim
    if (nextFilters.grupo && nextFilters.grupo !== 'ativos') params.grupo = nextFilters.grupo

    setSearchParams(params, { replace: true })
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => {
      const next = {
        ...prev,
        [field]: value,
        grupo: field === 'status' ? '' : prev.grupo,
      }

      if (['status', 'dataInicio', 'dataFim', 'grupo'].includes(field)) {
        updateUrlFilters(next)
      }

      return next
    })
  }

  const handleClearFilters = () => {
    setFilters({ ...INITIAL_FILTERS })
    setFiltersResetKey((current) => current + 1)
    setPage(1)
    setSearchParams({}, { replace: true })
  }

  const handleFiltroPrincipalChange = (value) => {
    const isStatus = [
      'AGENDADO',
      'REALIZADO',
      'EM_SELECAO',
      'EM_EDICAO',
      'FINALIZADO',
      'CANCELADO',
    ].includes(value)

    setFilters((prev) => {
      const next = {
        ...prev,
        status: isStatus ? value : '',
        grupo: isStatus ? '' : value,
      }

      updateUrlFilters(next)

      return next
    })
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

  const handleViewModeChange = (mode) => {
    if (!VIEW_MODES.includes(mode)) return

    setViewMode(mode)

    try {
      window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode)
    } catch {
      // Preferencia visual local; se o navegador bloquear, a tela continua funcionando.
    }

    if (mode === 'calendar') {
      setFilters((prev) => {
        const next = {
          ...prev,
          status: '',
          grupo: 'todos',
        }

        updateUrlFilters(next)

        return next
      })
    }
  }

  const grupoCounts = {
    ativos: STATUS_ATIVOS.reduce((sum, status) => sum + Number(statusCounts[status] || 0), 0),
    AGENDADO: Number(statusCounts.AGENDADO || 0),
    REALIZADO: Number(statusCounts.REALIZADO || 0),
    EM_SELECAO: Number(statusCounts.EM_SELECAO || 0),
    EM_EDICAO: Number(statusCounts.EM_EDICAO || 0),
    FINALIZADO: Number(statusCounts.FINALIZADO || 0),
    CANCELADO: Number(statusCounts.CANCELADO || 0),
    todos: Number(statusCounts.total || 0),
  }
  const activeFiltroPrincipal = filters.status || filters.grupo || 'ativos'

  const totalEnsaios = Number(statusCounts.total || 0)
  const hasDisplayFilter =
    filters.status ||
    filters.grupo !== 'todos' ||
    filters.clienteNome ||
    filters.tipo ||
    filters.dataInicio ||
    filters.dataFim

  const countLabel = hasDisplayFilter
    ? `${ensaios.length} ensaio${ensaios.length === 1 ? '' : 's'} exibido${
        ensaios.length === 1 ? '' : 's'
      } · ${totalEnsaios} no total`
    : `${totalEnsaios} ensaio${totalEnsaios === 1 ? '' : 's'} cadastrado${
        totalEnsaios === 1 ? '' : 's'
      }`

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
          onViewModeChange={handleViewModeChange}
          onClear={handleClearFilters}
        />

        <GrupoEnsaiosTabs
          activeGrupo={activeFiltroPrincipal}
          counts={grupoCounts}
          onChange={handleFiltroPrincipalChange}
        />

        {loading ? (
          <LoadingState />
        ) : sortedEnsaios.length === 0 ? (
          <EmptyState
            filters={filters}
            onCreate={() => navigate('/novo-ensaio')}
          />
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

function GrupoEnsaiosTabs({ activeGrupo, counts, onChange }) {
  const grupos = [
    { value: 'ativos', label: 'Ativos' },
    { value: 'AGENDADO', label: 'Agendado' },
    { value: 'REALIZADO', label: 'Realizado' },
    { value: 'EM_SELECAO', label: 'Em seleção' },
    { value: 'EM_EDICAO', label: 'Em edição' },
    { value: 'FINALIZADO', label: 'Entregue' },
    { value: 'CANCELADO', label: 'Cancelado' },
    { value: 'todos', label: 'Todos' },
  ]

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {grupos.map((grupo) => {
        const active = activeGrupo === grupo.value

        return (
          <button
            key={grupo.value}
            type="button"
            onClick={() => onChange(grupo.value)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] tracking-[0.08em] transition ${
              active
                ? 'border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]'
                : 'border-transparent bg-[var(--card)] text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            <span>{grupo.label}</span>
            <span
              className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-medium leading-none ${
                active
                  ? 'bg-[var(--gold-dim)] text-[var(--gold)]'
                  : 'bg-[var(--card-hover)] text-[var(--text-muted)]'
              }`}
            >
              {counts[grupo.value] || 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}
