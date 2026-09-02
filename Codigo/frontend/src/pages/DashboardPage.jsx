import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    AlertTriangle,
    ArrowRight,
    Bell,
    CalendarDays,
    Camera,
    CheckCircle2,
    Clock3,
    DollarSign,
    Eye,
    EyeOff,
    Image as ImageIcon,
    MapPin,
    PackageCheck,
    PencilLine,
    Plus,
    Sparkles,
    Users,
    X,
    Zap,
} from 'lucide-react'

import DashboardError from '../components/dashboard/DashboardError'
import {
    formatarHora,
    formatarMoeda,
} from '../utils/dashboardFormatters'
import Header from '../components/layout/Header'
import AppTopControls from '../components/layout/AppTopControls'
import { dashboardService } from '../services/dashboardService'
import { ensaiosService } from '../services/ensaiosService'

const NOTICE_ROTATION_INTERVAL_MS = 10 * 60 * 1000
const FORECAST_VALUE_VISIBILITY_STORAGE_KEY = 'fotolhar-dashboard-forecast-value-visible'
const REGION_VISIBLE_LIMIT = 5
const REVENUE_VISIBLE_LIMIT = 5
const DEFAULT_REVENUE_PERIOD = 'ESTE_MES'
const REVENUE_PERIOD_OPTIONS = [
    { value: 'ESTE_MES', label: 'Este mês' },
    { value: 'MES_PASSADO', label: 'Mês passado' },
    { value: 'ULTIMOS_3_MESES', label: 'Últimos 3 meses' },
    { value: 'ESTE_SEMESTRE', label: 'Este semestre' },
    { value: 'ESTE_ANO', label: 'Este ano' },
]

function getStoredPreference(key, fallback, allowedValues) {
    try {
        const value = window.localStorage.getItem(key)

        if (!value) return fallback
        if (allowedValues && !allowedValues.includes(value)) return fallback

        return value
    } catch {
        return fallback
    }
}

function setStoredPreference(key, value) {
    try {
        window.localStorage.setItem(key, value)
    } catch {
        // Preferências visuais continuam funcionando na sessão mesmo sem localStorage.
    }
}

function getFirstName(name = '') {
    return name.trim().split(' ').filter(Boolean)[0] || ''
}

function getDate(value) {
    if (!value) return null

    const date = new Date(value)

    return Number.isNaN(date.getTime()) ? null : date
}

function isSameLocalDay(left, right) {
    return (
        left.getFullYear() === right.getFullYear() &&
        left.getMonth() === right.getMonth() &&
        left.getDate() === right.getDate()
    )
}

function getWeekDays(today) {
    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today)
        date.setDate(today.getDate() + index)
        return date
    })
}

function getMesAtualParams() {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = hoje.getMonth()
    const inicio = new Date(ano, mes, 1)
    const fim = new Date(ano, mes + 1, 0)
    const format = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`
    }

    return `dataInicio=${format(inicio)}&dataFim=${format(fim)}`
}

function getEnsaiosDoDia(ensaios = [], date) {
    return ensaios.filter((ensaio) => {
        const ensaioDate = getDate(ensaio?.dataEnsaio)
        return ensaio?.status !== 'CANCELADO' && ensaioDate && isSameLocalDay(ensaioDate, date)
    })
}

function getHojeParams(today = new Date()) {
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0)
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)

    return {
        dataInicio: start.toISOString(),
        dataFim: end.toISOString(),
    }
}

function sortEnsaiosPorHorario(ensaios = []) {
    return ensaios
        .slice()
        .sort((left, right) => (getDate(left?.dataEnsaio) || 0) - (getDate(right?.dataEnsaio) || 0))
}

function getEnsaiosHoje(dashboard, agenda, today, ensaiosHojeOverride) {
    if (Array.isArray(ensaiosHojeOverride)) {
        return sortEnsaiosPorHorario(getEnsaiosDoDia(ensaiosHojeOverride, today))
    }

    const ensaiosDoDia = Array.isArray(dashboard?.ensaiosDoDia) ? dashboard.ensaiosDoDia : []
    const fallback = getEnsaiosDoDia(agenda, today)

    return sortEnsaiosPorHorario(getEnsaiosDoDia(ensaiosDoDia.length ? ensaiosDoDia : fallback, today))
}

function getEnsaiosAgendadosHoje(ensaiosHoje = []) {
    return sortEnsaiosPorHorario(ensaiosHoje.filter((ensaio) => ensaio?.status === 'AGENDADO'))
}

function formatarDetalheEnsaioHoje(ensaio) {
    const horario = formatarHora(ensaio?.dataEnsaio)
    const cliente = getFirstName(ensaio?.clienteNome) || 'cliente'
    const tipo = getTipoLabel(ensaio)
    const local = ensaio?.local || 'local não informado'

    return `${horario} · ${cliente} · ${tipo} · ${local}`
}

function formatarResumoEnsaiosHoje(ensaiosHoje = [], limit = Infinity) {
    const ensaios = sortEnsaiosPorHorario(ensaiosHoje)

    if (!ensaios.length) return ''

    const itens = ensaios.slice(0, limit).map((ensaio) => {
        const horario = formatarHora(ensaio.dataEnsaio)
        const cliente = getFirstName(ensaio.clienteNome) || 'cliente'

        return `${horario} ${cliente}`
    })
    const restantes = Number.isFinite(limit) ? ensaios.length - itens.length : 0

    return `${itens.join(', ')}${restantes > 0 ? ` e mais ${restantes}` : ''}`
}

function getResumoHoje(ensaios = [], today) {
    const ensaiosHoje = sortEnsaiosPorHorario(getEnsaiosDoDia(ensaios, today))

    if (!ensaiosHoje.length) return 'Hoje: nenhum ensaio'

    const label = ensaiosHoje.length === 1 ? 'ensaio' : 'ensaios'

    return `Hoje: ${ensaiosHoje.length} ${label} · ${formatarResumoEnsaiosHoje(ensaiosHoje)}`
}

function getAgendaDaySummary(ensaiosDia = [], date) {
    const data = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
    })
    const dataLabel = data.charAt(0).toUpperCase() + data.slice(1)

    if (!ensaiosDia.length) return `${dataLabel}: nenhum ensaio`

    const label = ensaiosDia.length === 1 ? 'ensaio' : 'ensaios'
    const horarios = ensaiosDia
        .map((ensaio) => getDate(ensaio.dataEnsaio))
        .filter(Boolean)
        .sort((left, right) => left - right)
        .map(formatarHora)
        .join(', ')

    return `${dataLabel}: ${ensaiosDia.length} ${label}${horarios ? ` às ${horarios}` : ''}`
}

function getDaysUntilLabel(value) {
    const date = getDate(value)
    if (!date) return 'Sem data'

    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diffDays = Math.round((startOfDate - startOfToday) / 86400000)

    if (diffDays < 0) return 'Data passou'
    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Amanhã'

    return `Faltam ${diffDays} dias`
}

function getTipoLabel(ensaio) {
    return ensaio?.tipoExibicao || ensaio?.tipoPersonalizado || ensaio?.tipo || 'Ensaio'
}

export default function DashboardPage() {
    const location = useLocation()
    const [dashboard, setDashboard] = useState(null)
    const [ensaiosHojeOverride, setEnsaiosHojeOverride] = useState(null)
    const [receitaPeriodo, setReceitaPeriodo] = useState(DEFAULT_REVENUE_PERIOD)
    const [receitaPorTipo, setReceitaPorTipo] = useState([])
    const [receitaLoading, setReceitaLoading] = useState(false)
    const [receitaErro, setReceitaErro] = useState('')
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState('')
    const receitaRequestRef = useRef(0)
    const abrirTodasPendencias = new URLSearchParams(location.search).get('pendencias') === '1'

    useEffect(() => {
        let active = true

        async function carregarDashboard() {
            try {
                setLoading(true)
                setErro('')

                const resultado = await dashboardService.buscarResumo()
                const nextDashboard = resultado?.data ?? resultado

                if (!active) return

                setDashboard(nextDashboard)
                setReceitaPorTipo(Array.isArray(nextDashboard?.receitaPorTipoEnsaio)
                    ? nextDashboard.receitaPorTipoEnsaio
                    : [])
                setReceitaErro('')
                setEnsaiosHojeOverride(null)

                const totalHoje = Number(nextDashboard?.ensaiosHoje || 0)
                const totalDetalhado = Array.isArray(nextDashboard?.ensaiosDoDia)
                    ? nextDashboard.ensaiosDoDia.length
                    : 0

                if (totalHoje > totalDetalhado) {
                    try {
                        const response = await ensaiosService.listar(getHojeParams())
                        const ensaiosHoje = Array.isArray(response.data) ? response.data : []

                        if (active) {
                            setEnsaiosHojeOverride(ensaiosHoje)
                        }
                    } catch (error) {
                        console.error('[Dashboard] Erro ao completar ensaios de hoje:', error?.response?.data || error)
                    }
                }
            } catch (error) {
                console.error(error)
                if (active) setErro('Não foi possível carregar a dashboard.')
            } finally {
                if (active) setLoading(false)
            }
        }

        carregarDashboard()

        return () => {
            active = false
        }
    }, [])

    useEffect(() => {
        if (!dashboard) return

        if (receitaPeriodo === DEFAULT_REVENUE_PERIOD) {
            receitaRequestRef.current += 1
            setReceitaLoading(false)
            setReceitaPorTipo(Array.isArray(dashboard?.receitaPorTipoEnsaio)
                ? dashboard.receitaPorTipoEnsaio
                : [])
            setReceitaErro('')
            return
        }

        let active = true
        const requestId = receitaRequestRef.current + 1
        receitaRequestRef.current = requestId

        async function carregarReceitaPorTipo() {
            try {
                setReceitaLoading(true)
                setReceitaErro('')

                const resultado = await dashboardService.buscarReceitaPorTipo(receitaPeriodo)
                const nextTipos = Array.isArray(resultado?.data) ? resultado.data : resultado

                if (active && receitaRequestRef.current === requestId) {
                    setReceitaPorTipo(Array.isArray(nextTipos) ? nextTipos : [])
                }
            } catch (error) {
                console.error('[Dashboard] Erro ao carregar receita por tipo:', error?.response?.data || error)
                if (active && receitaRequestRef.current === requestId) {
                    setReceitaErro('Não foi possível atualizar este card.')
                }
            } finally {
                if (active && receitaRequestRef.current === requestId) {
                    setReceitaLoading(false)
                }
            }
        }

        carregarReceitaPorTipo()

        return () => {
            active = false
        }
    }, [dashboard, receitaPeriodo])

    if (erro) return <DashboardError mensagem={erro} />

    return (
        <main className="min-h-screen bg-[#FCFCFD] text-[#1F1F21] antialiased">
            <Header />

            <section className="min-w-0 px-4 pb-6 pt-[84px] sm:px-7 lg:px-9 lg:py-6">
                {loading ? (
                    <DashboardSkeleton />
                ) : (
                    <DashboardContent
                        dashboard={dashboard || {}}
                        receitaPorTipo={receitaPorTipo}
                        receitaPeriodo={receitaPeriodo}
                        receitaLoading={receitaLoading}
                        receitaErro={receitaErro}
                        onReceitaPeriodoChange={setReceitaPeriodo}
                        ensaiosHojeOverride={ensaiosHojeOverride}
                        abrirTodasPendencias={abrirTodasPendencias}
                    />
                )}
            </section>
        </main>
    )
}

function DashboardActions() {
    return (
            <div className="flex shrink-0 items-center gap-3">
                <div className="hidden lg:block">
                    <AppTopControls />
                </div>

                <Link
                    to="/novo-ensaio"
                    className="flex h-11 items-center gap-3 rounded-[12px] bg-[#C84F32] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(200,79,50,0.20)] transition hover:bg-[#AE3F28]"
                >
                    <Plus size={19} />
                    Novo ensaio
                </Link>
            </div>
    )
}

function DashboardContent({
    dashboard,
    receitaPorTipo,
    receitaPeriodo,
    receitaLoading,
    receitaErro,
    onReceitaPeriodoChange,
    ensaiosHojeOverride,
    abrirTodasPendencias = false,
}) {
    const hoje = useMemo(() => new Date(), [])
    const usuarioNome = localStorage.getItem('usuarioNome') || ''
    const primeiroNome = getFirstName(usuarioNome)
    const agenda = dashboard?.agendaProxima || []
    const ensaiosHoje = getEnsaiosHoje(dashboard, agenda, hoje, ensaiosHojeOverride)
    const proximosEnsaios = dashboard?.proximosEnsaios?.length
        ? dashboard.proximosEnsaios
        : agenda
    const dataFormatada = hoje.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="mx-auto max-w-[1500px]">
            <div className="mb-5 flex items-start justify-between gap-6">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C84F32]">
                        {dataFormatada}
                    </p>

                    <h1 className="mt-2 font-serif text-[36px] font-light leading-tight text-[#15120f] sm:text-[44px]">
                        {primeiroNome ? `Bem-vindo, ${primeiroNome}!` : 'Bem-vindo!'}
                    </h1>

                    <p className="mt-2 text-sm text-[#6F6D6B]">
                        Aqui está o resumo do que acontece no seu estúdio hoje.
                    </p>
                </div>

                <DashboardActions />
            </div>

            <DashboardTodayNotice
                dashboard={dashboard}
                agenda={agenda}
                hoje={hoje}
                ensaiosHoje={ensaiosHoje}
            />

            <div className="mt-5 grid items-start gap-4 xl:grid-cols-[25fr_45fr_30fr]">
                <ForecastValueCard dashboard={dashboard} />
                <WeekAgendaCard
                    agenda={agenda}
                    hoje={hoje}
                    proximosEnsaios={proximosEnsaios}
                    ensaiosHoje={ensaiosHoje}
                />
                <AttentionSummaryCard dashboard={dashboard} abrirTodasPendencias={abrirTodasPendencias} />
            </div>

            <DashboardOverviewStrip dashboard={dashboard} />

            <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,1fr)]">
                <RevenueByTypeDashboardCard
                    tipos={receitaPorTipo}
                    periodo={receitaPeriodo}
                    loading={receitaLoading}
                    erro={receitaErro}
                    onPeriodoChange={onReceitaPeriodoChange}
                />

                <div className="min-w-0 space-y-5">
                    <DemandRegionCard regioes={dashboard?.regioesDemanda || []} />
                    <FlowPerformanceCard etapas={dashboard?.desempenhoFluxo || []} />
                </div>
            </div>
        </div>
    )
}

function Card({ children, className = '' }) {
    return (
        <section className={`rounded-[14px] border border-[#e6d8c8] bg-white/78 shadow-[0_14px_34px_rgba(31,31,33,0.055)] ${className}`}>
            {children}
        </section>
    )
}

function getDashboardNotice(dashboard, agenda, hoje, ensaiosHoje, rotationSlot = 0) {
    const ensaiosAgendadosHoje = getEnsaiosAgendadosHoje(ensaiosHoje)
    const pendencias = dashboard?.atencaoNecessaria || []
    const ensaiosEmAndamento = Array.isArray(dashboard?.ensaiosEmAndamento)
        ? dashboard.ensaiosEmAndamento
        : []
    const pendenciasAgrupadasNoCard = pendencias.length > 0
    const encontrarPendencia = (tipo) => pendencias.find((item) => item?.tipo === tipo && item?.ensaioId)
    const contarPendencias = (tipo) => pendencias.filter((item) => item?.tipo === tipo).length
    const encontrarEnsaioPorStatus = (status) =>
        ensaiosEmAndamento.find((ensaio) => ensaio?.status === status && ensaio?.id)
    const destinoStatus = (status, total) => {
        const ensaio = total === 1 ? encontrarEnsaioPorStatus(status) : null
        return ensaio?.id ? `/ensaios/${ensaio.id}` : `/ensaios?status=${status}`
    }
    const ensaioAtrasado = encontrarPendencia('ENSAIO_ATRASADO')
    const selecaoEnviada = encontrarPendencia('SELECAO_ENVIADA')
    const uploadPendente = encontrarPendencia('UPLOAD_PENDENTE')
    const albumPendente = encontrarPendencia('ALBUM_PENDENTE')
    const pipeline = dashboard?.pipelineStatus || {}
    const ensaiosAgendados = Number(pipeline.AGENDADO || 0)
    const ensaiosRealizados = Number(pipeline.REALIZADO || 0)
    const ensaiosEmSelecao = Number(pipeline.EM_SELECAO || 0)
    const ensaiosEmEdicao = Number(pipeline.EM_EDICAO || 0)
    const ensaiosFinalizados = Number(pipeline.FINALIZADO || 0)
    const totalEnsaiosAgendadosHoje = ensaiosAgendadosHoje.length
    const proximoEnsaio = dashboard?.proximoEnsaio || dashboard?.proximosEnsaios?.[0]
    const proximaData = getDate(proximoEnsaio?.dataEnsaio)
    const hojeInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
    const proximaDataInicio = proximaData
        ? new Date(proximaData.getFullYear(), proximaData.getMonth(), proximaData.getDate())
        : null
    const diasAteProximo = proximaDataInicio
        ? Math.round((proximaDataInicio - hojeInicio) / 86400000)
        : null
    const totalSemana = Number(dashboard?.ensaiosProximosSeteDias || agenda.length || 0)
    const receitaEstimada = Number(dashboard?.receitaEstimada || 0)
    const ensaiosEsteMes = Number(dashboard?.ensaiosEsteMes || 0)
    const finalizadosMes = Number(dashboard?.ensaiosFinalizadosMes || 0)
    const criticalNotices = []
    const routineNotices = []

    if (totalEnsaiosAgendadosHoje > 0) {
        const title = totalEnsaiosAgendadosHoje === 1
            ? '1 ensaio hoje'
            : `${totalEnsaiosAgendadosHoje} ensaios hoje`
        const resumoEnsaiosHoje = formatarResumoEnsaiosHoje(ensaiosAgendadosHoje, 4)

        criticalNotices.push({
            icon: CalendarDays,
            title,
            text: totalEnsaiosAgendadosHoje === 1
                ? formatarDetalheEnsaioHoje(ensaiosAgendadosHoje[0])
                : `${title}: ${resumoEnsaiosHoje}.`,
            to: totalEnsaiosAgendadosHoje === 1 && ensaiosAgendadosHoje[0]?.id
                ? `/ensaios/${ensaiosAgendadosHoje[0].id}`
                : '/ensaios?view=calendar',
        })
    }

    if (!pendenciasAgrupadasNoCard && ensaioAtrasado) {
        const total = contarPendencias('ENSAIO_ATRASADO')
        criticalNotices.push({
            icon: AlertTriangle,
            title: total > 1 ? 'Ensaios com data passada' : 'Ensaio com data passada',
            text: total > 1
                ? `${total} ensaios passaram da data e ainda precisam de atualização de status.`
                : `O ensaio de ${getFirstName(ensaioAtrasado.clienteNome) || 'cliente'} passou da data e ainda está agendado.`,
            to: total === 1 ? `/ensaios/${ensaioAtrasado.ensaioId}` : '/ensaios?status=AGENDADO',
        })
    }

    if (!pendenciasAgrupadasNoCard && selecaoEnviada) {
        const total = contarPendencias('SELECAO_ENVIADA')
        criticalNotices.push({
            icon: ImageIcon,
            title: 'Seleções recebidas',
            text: total > 1
                ? `${total} clientes enviaram seleção. Revise as fotos escolhidas para liberar a edição.`
                : `${getFirstName(selecaoEnviada.clienteNome) || 'Cliente'} enviou a seleção. Revise as fotos escolhidas e avance para edição.`,
            to: total === 1 ? `/ensaios/${selecaoEnviada.ensaioId}` : '/ensaios?status=EM_SELECAO',
        })
    }

    if (!pendenciasAgrupadasNoCard && uploadPendente) {
        const total = contarPendencias('UPLOAD_PENDENTE')
        criticalNotices.push({
            icon: Camera,
            title: total > 1 ? 'Fotos pendentes' : 'Fotos ainda não enviadas',
            text: total > 1
                ? `${total} ensaios realizados ainda aguardam upload das fotos.`
                : `O ensaio de ${getFirstName(uploadPendente.clienteNome) || 'cliente'} já foi realizado, mas ainda não tem fotos enviadas.`,
            to: total === 1 ? `/ensaios/${uploadPendente.ensaioId}` : '/ensaios?status=REALIZADO',
        })
    }

    if (!pendenciasAgrupadasNoCard && albumPendente) {
        const total = contarPendencias('ALBUM_PENDENTE')
        criticalNotices.push({
            icon: PackageCheck,
            title: total > 1 ? 'Álbuns aguardando publicação' : 'Álbum aguardando publicação',
            text: total > 1
                ? `${total} ensaios já têm fotos e aguardam publicação do álbum.`
                : `As fotos de ${getFirstName(albumPendente.clienteNome) || 'cliente'} já foram enviadas. Publique o álbum para liberar a seleção.`,
            to: total === 1 ? `/ensaios/${albumPendente.ensaioId}` : '/ensaios?status=REALIZADO',
        })
    }

    if (proximoEnsaio && diasAteProximo === 1) {
        criticalNotices.push({
            icon: CalendarDays,
            title: 'Ensaio amanhã',
            text: `${getTipoLabel(proximoEnsaio)} com ${getFirstName(proximoEnsaio.clienteNome) || 'cliente'} está marcado para ${formatarHora(proximoEnsaio.dataEnsaio)}. Confira local e detalhes antes do ensaio.`,
            to: `/ensaios/${proximoEnsaio.id}`,
        })
    }

    if (criticalNotices.length) {
        return criticalNotices[rotationSlot % criticalNotices.length]
    }

    if (pendenciasAgrupadasNoCard) {
        routineNotices.push({
            icon: Bell,
            title: 'Pendências centralizadas',
            text: `${pendencias.length} ${pendencias.length === 1 ? 'item está' : 'itens estão'} no card Atenção Necessária. Abra a lista para tratar cada ensaio clicável.`,
            to: '/dashboard?pendencias=1',
        })
    }

    if (ensaiosEmEdicao > 0) {
        routineNotices.push({
            icon: PencilLine,
            title: ensaiosEmEdicao > 1 ? 'Edições em andamento' : 'Edição em andamento',
            text: ensaiosEmEdicao > 1
                ? `${ensaiosEmEdicao} ensaios estão em edição. Atualize o status quando a entrega estiver pronta.`
                : 'Há um ensaio em edição. Atualize o status quando a entrega estiver pronta.',
            to: destinoStatus('EM_EDICAO', ensaiosEmEdicao),
        })
    }

    if (ensaiosRealizados > 0 && !uploadPendente && !albumPendente) {
        routineNotices.push({
            icon: Camera,
            title: ensaiosRealizados > 1 ? 'Ensaios realizados' : 'Ensaio realizado',
            text: ensaiosRealizados > 1
                ? `${ensaiosRealizados} ensaios já foram realizados. Confira se fotos, álbum e próxima etapa estão em dia.`
                : 'Há um ensaio realizado. Confira se fotos, álbum e próxima etapa estão em dia.',
            to: destinoStatus('REALIZADO', ensaiosRealizados),
        })
    }

    if (ensaiosEmSelecao > 0 && !selecaoEnviada) {
        routineNotices.push({
            icon: ImageIcon,
            title: ensaiosEmSelecao > 1 ? 'Ensaios em seleção' : 'Ensaio em seleção',
            text: ensaiosEmSelecao > 1
                ? `${ensaiosEmSelecao} ensaios estão aguardando escolha de fotos pela cliente.`
                : 'Há um ensaio aguardando escolha de fotos pela cliente.',
            to: destinoStatus('EM_SELECAO', ensaiosEmSelecao),
        })
    }

    if (Number(dashboard?.ensaiosEmAndamentoTotal || 0) > 0) {
        routineNotices.push({
            icon: Zap,
            title: 'Ensaios em andamento',
            text: 'Acompanhe os ensaios em andamento e atualize etapas quando houver avanço.',
            to: '/ensaios?grupo=ativos',
        })
    }

    if (totalSemana > 0 && (diasAteProximo === null || diasAteProximo <= 7)) {
        routineNotices.push({
            icon: CalendarDays,
            title: 'Agenda da semana',
            text: proximoEnsaio && proximaData
                ? `Próximo ensaio em ${getDaysUntilLabel(proximoEnsaio.dataEnsaio).toLowerCase()}: ${getTipoLabel(proximoEnsaio)} com ${getFirstName(proximoEnsaio.clienteNome) || 'cliente'}.`
                : 'Revise os próximos ensaios e confirme detalhes de horário, local e contrato.',
            to: '/ensaios?view=calendar',
        })
    }

    if (ensaiosAgendados > 0) {
        routineNotices.push({
            icon: CalendarDays,
            title: diasAteProximo !== null && diasAteProximo > 7 ? 'Próximo ensaio no radar' : ensaiosAgendados > 1 ? 'Próximos ensaios' : 'Próximo ensaio',
            text: proximoEnsaio && diasAteProximo !== null && diasAteProximo > 7
                ? `${getTipoLabel(proximoEnsaio)} com ${getFirstName(proximoEnsaio.clienteNome) || 'cliente'} está previsto para ${getDaysUntilLabel(proximoEnsaio.dataEnsaio).toLowerCase()}.`
                : ensaiosAgendados > 1
                ? `${ensaiosAgendados} ensaios estão agendados. Revise datas e confirme os detalhes com antecedência.`
                : 'Há um ensaio agendado. Revise data, horário, local e contrato.',
            to: ensaiosAgendados === 1 && proximoEnsaio?.id
                ? `/ensaios/${proximoEnsaio.id}`
                : '/ensaios?status=AGENDADO',
        })
    }

    if (finalizadosMes > 0) {
        routineNotices.push({
            icon: CheckCircle2,
            title: finalizadosMes > 1 ? 'Entregas do mês' : 'Entrega do mês',
            text: finalizadosMes > 1
                ? `${finalizadosMes} entregas já foram finalizadas neste mês. Confira os ensaios concluídos.`
                : 'Uma entrega foi finalizada neste mês. Confira os detalhes do ensaio concluído.',
            to: '/ensaios?status=FINALIZADO',
        })
    }

    if (receitaEstimada > 0) {
        routineNotices.push({
            icon: DollarSign,
            title: 'Valor previsto',
            text: 'Confira o valor previsto do mês e acompanhe pacotes e fotos extras nos relatórios.',
            to: '/relatorios',
        })
    }

    if (ensaiosFinalizados > 0) {
        routineNotices.push({
            icon: PackageCheck,
            title: 'Histórico organizado',
            text: 'Seus ensaios finalizados estão em dia. Vale revisar entregas antigas e manter o portfólio atualizado.',
            to: '/ensaios?status=FINALIZADO',
        })
    }

    if (ensaiosEsteMes === 0) {
        routineNotices.push({
            icon: Sparkles,
            title: 'Agenda livre',
            text: 'Nenhum ensaio previsto para este mês. Bom momento para revisar pacotes, contratos e canais de atendimento.',
            to: '/configuracoes',
        })
    }

    if (!ensaiosAgendados && !Number(dashboard?.totalEnsaios || 0)) {
        routineNotices.push({
            icon: Plus,
            title: 'Nenhum ensaio cadastrado',
            text: 'Cadastre um atendimento para começar a preencher agenda, pipeline e relatórios.',
            to: '/novo-ensaio',
        })
    }

    routineNotices.push({
        icon: CheckCircle2,
        title: 'Tudo organizado',
        text: 'Sua agenda está tranquila e não há alertas importantes neste momento.',
        to: '/dashboard',
    })

    return routineNotices[rotationSlot % routineNotices.length]
}

function DashboardTodayNotice({ dashboard, agenda, hoje, ensaiosHoje }) {
    const [rotationSlot, setRotationSlot] = useState(() => Math.floor(Date.now() / NOTICE_ROTATION_INTERVAL_MS))
    const notice = getDashboardNotice(dashboard, agenda, hoje, ensaiosHoje, rotationSlot)
    const NoticeIcon = notice.icon || Sparkles

    useEffect(() => {
        const interval = window.setInterval(() => {
            setRotationSlot(Math.floor(Date.now() / NOTICE_ROTATION_INTERVAL_MS))
        }, 60000)

        return () => window.clearInterval(interval)
    }, [])

    return (
        <Link
            to={notice.to}
            title={notice.text}
            className="flex min-h-[82px] items-center gap-4 rounded-[14px] border border-[#E8E3DF] bg-white/72 px-5 py-4 shadow-[0_12px_30px_rgba(31,31,33,0.04)] transition hover:border-[#c99a5d] hover:bg-white/82"
        >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5F3F1] text-[#C84F32]">
                <NoticeIcon size={21} strokeWidth={1.6} />
            </span>

            <span className="min-w-0 flex-1">
                <strong className="block text-sm font-semibold text-[#C84F32]">
                    {notice.title}
                </strong>
                <span className="mt-1 block text-sm leading-5 text-[#6F6D6B]">
                    {notice.text}
                </span>
            </span>

            <ArrowRight size={20} className="shrink-0 text-[#C84F32]" />
        </Link>
    )
}

function ForecastValueCard({ dashboard }) {
    const receitaEstimada = Number(dashboard?.receitaEstimada || 0)
    const [mostrarValor, setMostrarValor] = useState(() =>
        getStoredPreference(FORECAST_VALUE_VISIBILITY_STORAGE_KEY, 'true', ['true', 'false']) === 'true'
    )
    const valorFormatado = receitaEstimada > 0 ? formatarMoeda(receitaEstimada) : 'R$ 0,00'
    const ToggleIcon = mostrarValor ? Eye : EyeOff
    function toggleMostrarValor() {
        setMostrarValor((current) => {
            const next = !current
            setStoredPreference(FORECAST_VALUE_VISIBILITY_STORAGE_KEY, String(next))

            return next
        })
    }

    return (
        <Card className="flex min-h-[220px] flex-col justify-between p-4 xl:h-[300px]">
            <div className="flex items-start justify-between gap-4">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.015em] text-[#1F1F21]">
                    Valor previsto
                </h2>

                <button
                    type="button"
                    onClick={toggleMostrarValor}
                    title={mostrarValor ? 'Ocultar valor previsto' : 'Mostrar valor previsto'}
                    aria-label={mostrarValor ? 'Ocultar valor previsto' : 'Mostrar valor previsto'}
                    aria-pressed={!mostrarValor}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E3DF] bg-white/72 text-[#C84F32] transition hover:border-[#C84F32] hover:bg-[#F8EDE8]"
                >
                    <ToggleIcon size={17} />
                </button>
            </div>

            <div className="py-1">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-[11px] bg-[#F8EDE8] text-[#C84F32]">
                    <DollarSign size={22} strokeWidth={1.6} />
                </span>

                <strong className="block font-serif text-[34px] font-light leading-none text-[#C84F32] sm:text-[38px] xl:text-[34px] 2xl:text-[40px]">
                    {mostrarValor ? valorFormatado : 'R$ •••••'}
                </strong>

                <p className="mt-2 text-sm text-[#6F6D6B]">
                    pacotes e fotos extras do mês
                </p>
            </div>

            <Link
                to="/relatorios"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-full border border-[#E8E3DF] bg-white/58 px-5 text-sm font-semibold text-[#C84F32] transition hover:border-[#C84F32] hover:bg-[#F8EDE8]"
            >
                Ver detalhes
                <ArrowRight size={17} />
            </Link>
        </Card>
    )
}

function WeekAgendaCard({ agenda, hoje, proximosEnsaios, ensaiosHoje }) {
    const days = getWeekDays(hoje)
    const items = (proximosEnsaios || []).slice(0, 3)
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (currentIndex > items.length - 1) {
            setCurrentIndex(0)
        }
    }, [currentIndex, items.length])

    const ensaio = items[currentIndex]
    const data = getDate(ensaio?.dataEnsaio)
    const canNavigate = items.length > 1

    function previous() {
        if (!canNavigate) return
        setCurrentIndex((current) => (current === 0 ? items.length - 1 : current - 1))
    }

    function next() {
        if (!canNavigate) return
        setCurrentIndex((current) => (current === items.length - 1 ? 0 : current + 1))
    }

    return (
        <Card className="flex min-h-[220px] flex-col p-4 xl:h-[300px]">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3.5">
                    <CalendarDays size={21} className="shrink-0 text-[#C84F32]" />
                    <h2 className="truncate text-[13px] font-semibold uppercase tracking-[0.015em] text-[#1F1F21]">
                        Agenda da semana
                    </h2>
                </div>

                <Link
                    to="/ensaios?view=calendar"
                    className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#1F1F21] transition hover:text-[#C84F32]"
                >
                    Ver agenda
                    <CalendarDays size={15} className="text-[#C84F32]" />
                </Link>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1.5">
                {days.map((day, index) => {
                    const ensaiosDia = index === 0 ? ensaiosHoje : getEnsaiosDoDia(agenda, day)
                    const active = index === 0
                    const summary = getAgendaDaySummary(ensaiosDia, day)

                    return (
                        <button
                            key={day.toISOString()}
                            type="button"
                            title={summary}
                            aria-label={summary}
                            className={`group relative flex min-h-[54px] flex-col items-center justify-center rounded-[10px] border text-center outline-none transition hover:border-[#C84F32] hover:bg-[#F5F3F1] focus-visible:border-[#C84F32] focus-visible:bg-[#F5F3F1] focus-visible:ring-2 focus-visible:ring-[#C84F32]/20 ${
                                active ? 'border-[#e1d3c3] bg-[#f5eee6] shadow-sm' : 'border-transparent'
                            }`}
                        >
                            <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-lg border border-[#C84F32] bg-white px-3 py-2 text-center text-[11px] font-medium leading-4 text-[#1F1F21] opacity-0 shadow-xl shadow-black/10 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                                {summary}
                            </span>

                            <span className="text-[10px] font-semibold uppercase tracking-[0.02em] text-[#62564c]">
                                {day.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                            </span>
                            <span className="mt-0.5 text-[21px] font-normal leading-none text-[#080706]">
                                {String(day.getDate()).padStart(2, '0')}
                            </span>
                            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${ensaiosDia.length ? 'bg-[#C84F32]' : 'bg-transparent'}`} />
                        </button>
                    )
                })}
            </div>

            <div className="mt-3 border-t border-[#d8cbbf] pt-3">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#1F1F21]">
                        Próximo ensaio
                    </h3>

                    <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[12px] font-semibold uppercase text-[#6F6D6B]">
                            {items.length ? currentIndex + 1 : 0} DE {items.length}
                        </span>
                        <button
                            type="button"
                            onClick={previous}
                            disabled={!canNavigate}
                            title="Ensaio anterior"
                            aria-label="Ensaio anterior"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E8E3DF] bg-white/65 text-[#C84F32] transition enabled:hover:border-[#C84F32] enabled:hover:bg-[#F8EDE8] disabled:opacity-40"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            disabled={!canNavigate}
                            title="Próximo ensaio"
                            aria-label="Próximo ensaio"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E8E3DF] bg-white/65 text-[#C84F32] transition enabled:hover:border-[#C84F32] enabled:hover:bg-[#F8EDE8] disabled:opacity-40"
                        >
                            ›
                        </button>
                    </div>
                </div>

                {ensaio ? (
                    <article className="mt-3 grid min-h-[86px] grid-cols-[78px_minmax(0,1fr)_32px] overflow-hidden rounded-[12px] border border-[#EEEAE7] bg-white/54">
                        <div className="flex flex-col items-center justify-center border-r border-[#EEEAE7] bg-[#F8EDE8] px-2 text-center">
                            <span className="text-[11px] font-bold uppercase text-[#C84F32]">
                                {data ? data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '') : '--'}
                            </span>
                            <span className="mt-1 text-[22px] font-semibold leading-none text-[#C84F32]">
                                {data ? String(data.getDate()).padStart(2, '0') : '--'}
                            </span>
                            <span className="mt-1 text-[10px] font-semibold uppercase text-[#C84F32]">
                                {data ? data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '') : ''}
                            </span>
                        </div>

                        <div className="min-w-0 px-4 py-3">
                            <h4 className="truncate text-[16px] font-medium text-[#1F1F21]">
                                {getTipoLabel(ensaio)}
                            </h4>

                            <div className="mt-2 flex min-w-0 items-center gap-2.5 overflow-hidden text-sm text-[#6F6D6B]">
                                <span className="font-semibold text-[#C84F32]">{getDaysUntilLabel(ensaio.dataEnsaio)}</span>
                                <span className="shrink-0 text-[#c7b6a4]">|</span>
                                <span className="inline-flex shrink-0 items-center gap-1.5">
                                    <Clock3 size={15} className="text-[#C84F32]" />
                                    {data ? formatarHora(data) : '--:--'}
                                </span>
                                <span className="inline-flex min-w-0 shrink items-center gap-1.5">
                                    <Users size={15} className="shrink-0 text-[#C84F32]" />
                                    <span className="truncate">{getFirstName(ensaio.clienteNome) || 'Cliente'}</span>
                                </span>
                                <span className="inline-flex min-w-0 shrink items-center gap-1.5">
                                    <MapPin size={15} className="shrink-0 text-[#C84F32]" />
                                    <span className="truncate">{ensaio.local || 'Local não informado'}</span>
                                </span>
                            </div>
                        </div>

                        <Link
                            to={`/ensaios/${ensaio.id}`}
                            title="Abrir ensaio"
                            aria-label="Abrir ensaio"
                            className="flex items-center justify-center text-[#C84F32] transition hover:bg-[#F8EDE8]"
                        >
                            <ArrowRight size={21} />
                        </Link>
                    </article>
                ) : (
                    <div className="mt-3 flex min-h-[86px] items-center justify-center rounded-[12px] border border-dashed border-[#e1d3c3] bg-white/45 px-4 text-center text-sm text-[#6F6D6B]">
                        Nenhum ensaio próximo agendado.
                    </div>
                )}
            </div>

            <div className="mt-auto flex items-center gap-2 pt-2 text-sm text-[#6F6D6B]">
                <CalendarDays size={17} className="shrink-0 text-[#C84F32]" />
                <span className="truncate">{getResumoHoje(ensaiosHoje, hoje)}</span>
            </div>
        </Card>
    )
}

function AttentionSummaryCard({ dashboard, abrirTodasPendencias = false }) {
    const location = useLocation()
    const navigate = useNavigate()
    const itens = dashboard?.atencaoNecessaria || []
    const [modalTypes, setModalTypes] = useState(null)
    const countByType = (types) => itens.filter((item) => types.includes(item?.tipo)).length

    const rows = [
        {
            label: 'Ensaios com data passada',
            value: countByType(['ENSAIO_ATRASADO']),
            types: ['ENSAIO_ATRASADO'],
            icon: AlertTriangle,
            tone: 'bg-[#fff0e8] text-[#ff6b2a]',
        },
        {
            label: 'Fotos ainda não enviadas',
            value: countByType(['UPLOAD_PENDENTE']),
            types: ['UPLOAD_PENDENTE'],
            icon: PencilLine,
            tone: 'bg-[#ececff] text-[#635bff]',
        },
        {
            label: 'Álbuns aguardando publicação',
            value: countByType(['ALBUM_PENDENTE']),
            types: ['ALBUM_PENDENTE'],
            icon: PackageCheck,
            tone: 'bg-[#e8f8ef] text-[#19a66a]',
        },
        {
            label: 'Seleções recebidas',
            value: countByType(['SELECAO_ENVIADA']),
            types: ['SELECAO_ENVIADA'],
            icon: CheckCircle2,
            tone: 'bg-[#ececff] text-[#5757ff]',
        },
        {
            label: 'Edições atrasadas',
            value: countByType(['ENTREGA_ATRASADA']),
            types: ['ENTREGA_ATRASADA'],
            icon: Clock3,
            tone: 'bg-[#fff0f0] text-[#dc2626]',
        },
        {
            label: 'Pagamentos pendentes',
            value: countByType(['PAGAMENTO_PENDENTE']),
            types: ['PAGAMENTO_PENDENTE'],
            icon: DollarSign,
            tone: 'bg-[#fff7e8] text-[#b7791f]',
        },
    ]
    const activeRows = rows.filter((row) => row.value > 0)
    const modalItems = modalTypes?.length
        ? itens.filter((item) => modalTypes.includes(item?.tipo))
        : itens

    useEffect(() => {
        if (abrirTodasPendencias) {
            setModalTypes([])
        }
    }, [abrirTodasPendencias])

    function handleCloseModal() {
        setModalTypes(null)

        const searchParams = new URLSearchParams(location.search)
        if (searchParams.get('pendencias') !== '1') return

        searchParams.delete('pendencias')
        const nextSearch = searchParams.toString()
        navigate(
            {
                pathname: location.pathname,
                search: nextSearch ? `?${nextSearch}` : '',
            },
            { replace: true }
        )
    }

    return (
        <>
            <Card className="flex min-h-[220px] flex-col p-4 xl:h-[300px]">
                <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E8E3DF] bg-[#F8EDE8] text-[#C84F32]">
                        <Bell size={16} />
                    </span>

                    <h2 className="pt-[2px] text-[13px] font-semibold uppercase tracking-[0.015em] text-[#1F1F21]">
                        Atenção necessária
                    </h2>
                </div>

                {activeRows.length ? (
                    <div className="mt-2 flex min-h-0 flex-1 flex-col">
                        <div className="min-h-0 flex-1 divide-y divide-[#EEEAE7] overflow-y-auto overscroll-contain border-y border-[#EEEAE7] pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {activeRows.map((row) => (
                                <AttentionSummaryRow
                                    key={row.label}
                                    {...row}
                                    onOpen={() => setModalTypes(row.types)}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => setModalTypes([])}
                            className="mt-3 flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-[#E8E3DF] bg-white/58 px-5 text-sm font-semibold text-[#C84F32] transition hover:border-[#C84F32] hover:bg-[#F8EDE8]"
                        >
                            Ver todas as pendências
                            <ArrowRight size={17} />
                        </button>
                    </div>
                ) : (
                    <div className="mt-3 flex flex-1 flex-col items-center justify-center rounded-[12px] border border-dashed border-[#e1d3c3] bg-white/45 px-5 py-5 text-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <CheckCircle2 size={20} />
                        </span>

                        <strong className="mt-4 text-sm font-medium text-[#1F1F21]">
                            Nenhuma pendência encontrada
                        </strong>

                        <span className="mt-1 text-sm text-[#6F6D6B]">
                            Todos os ensaios estão em dia.
                        </span>
                    </div>
                )}
            </Card>

            {modalTypes !== null && (
                <AttentionDetailsModal
                    itens={modalItems}
                    onClose={handleCloseModal}
                />
            )}
        </>
    )
}

function AttentionSummaryRow({ icon: Icon, label, value, tone, onOpen }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className="flex h-[42px] w-full items-center gap-3 text-left transition hover:bg-[#fbf5ed]"
        >
            <span className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] ${tone}`}>
                <Icon size={15} strokeWidth={1.8} />
            </span>

            <span className="min-w-0 flex-1 truncate text-sm text-[#1F1F21]">
                {label}
            </span>

            <strong className="text-[15px] font-medium text-[#1F1F21]">
                {value}
            </strong>

            <ArrowRight size={17} className="shrink-0 text-[#C84F32]" />
        </button>
    )
}

function AttentionDetailsModal({ itens, onClose }) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [])

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-[#1F1F21]/35 px-4 py-6 backdrop-blur-sm">
            <section className="flex max-h-[min(760px,calc(100vh-48px))] w-full max-w-[560px] flex-col overflow-hidden rounded-[16px] border border-[#e6d8c8] bg-[#fffaf4] shadow-[0_24px_70px_rgba(45,32,20,0.24)]">
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#EEEAE7] px-5 py-4">
                    <div>
                        <h2 className="text-[13px] font-semibold uppercase tracking-[0.05em] text-[#1F1F21]">
                            Pendências
                        </h2>
                        <p className="mt-1 text-sm text-[#6F6D6B]">
                            {itens.length} {itens.length === 1 ? 'item precisa' : 'itens precisam'} de atenção.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        title="Fechar pendências"
                        aria-label="Fechar pendências"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E3DF] bg-white/70 text-[#6F6D6B] transition hover:border-[#C84F32] hover:text-[#C84F32]"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
                    <div className="divide-y divide-[#EEEAE7]">
                        {itens.map((item, index) => (
                            <AttentionDetailItem key={`${item.tipo}-${item.ensaioId || index}-${index}`} item={item} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

function AttentionDetailItem({ item }) {
    const config = getAttentionTypeConfig(item?.tipo)
    const Icon = config.icon
    const data = getDate(item?.dataReferencia)
    const to = item?.ensaioId ? `/ensaios/${item.ensaioId}` : '/ensaios?grupo=ativos'

    return (
        <Link
            to={to}
            className="flex min-h-[74px] items-center gap-4 rounded-[10px] px-3 py-3 transition hover:bg-[#fbf5ed]"
        >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${config.tone}`}>
                <Icon size={19} strokeWidth={1.8} />
            </span>

            <span className="min-w-0 flex-1">
                <strong className="block truncate text-sm font-medium text-[#1F1F21]">
                    {config.label}
                </strong>
                <span className="mt-1 block truncate text-sm text-[#6F6D6B]">
                    {item?.clienteNome || 'Cliente'} · {item?.descricao || item?.titulo || 'Abrir ensaio'}
                    {data ? ` · ${data.toLocaleDateString('pt-BR')}` : ''}
                </span>
            </span>

            <ArrowRight size={18} className="shrink-0 text-[#C84F32]" />
        </Link>
    )
}

function getAttentionTypeConfig(tipo) {
    const config = {
        ENSAIO_ATRASADO: {
            label: 'Ensaio com data passada',
            icon: AlertTriangle,
            tone: 'bg-[#fff0e8] text-[#ff6b2a]',
        },
        UPLOAD_PENDENTE: {
            label: 'Fotos ainda não enviadas',
            icon: PencilLine,
            tone: 'bg-[#ececff] text-[#635bff]',
        },
        ALBUM_PENDENTE: {
            label: 'Álbum aguardando publicação',
            icon: PackageCheck,
            tone: 'bg-[#e8f8ef] text-[#19a66a]',
        },
        SELECAO_ENVIADA: {
            label: 'Seleção recebida',
            icon: CheckCircle2,
            tone: 'bg-[#ececff] text-[#5757ff]',
        },
        ENTREGA_ATRASADA: {
            label: 'Edição atrasada',
            icon: Clock3,
            tone: 'bg-[#fff0f0] text-[#dc2626]',
        },
        PAGAMENTO_PENDENTE: {
            label: 'Pagamento pendente',
            icon: DollarSign,
            tone: 'bg-[#fff7e8] text-[#b7791f]',
        },
    }

    return config[tipo] || {
        label: 'Pendência do ensaio',
        icon: AlertTriangle,
        tone: 'bg-[#fff0e8] text-[#ff6b2a]',
    }
}

function DashboardOverviewStrip({ dashboard }) {
    const ensaiosEsteMes = Number(dashboard?.ensaiosEsteMes || 0)
    const totalEnsaios = Number(dashboard?.totalEnsaios || 0)
    const andamentoTotal = Number(dashboard?.ensaiosEmAndamentoTotal || 0)
    const selecoes = Number(dashboard?.selecoesEnviadas || 0)
    const entregas = Number(dashboard?.ensaiosFinalizadosMes || dashboard?.pipelineStatus?.FINALIZADO || 0)
    const mesAtualParams = getMesAtualParams()
    const percentEnsaiosMes = totalEnsaios > 0
        ? Math.min(100, Math.round((ensaiosEsteMes / totalEnsaios) * 100))
        : 0
    const entregaLabel = `${entregas} ${entregas === 1 ? 'entrega finalizada' : 'entregas finalizadas'}`

    const metrics = [
        {
            title: 'Ensaios no mês',
            value: ensaiosEsteMes,
            description: 'agendados e realizados',
            icon: CalendarDays,
            progress: percentEnsaiosMes,
            footer: `${percentEnsaiosMes}% dos ensaios ativos`,
            meta: `${totalEnsaios} no total`,
            to: `/ensaios?${mesAtualParams}`,
        },
        {
            title: 'Em andamento',
            value: andamentoTotal,
            description: 'realizados, seleção e edição',
            icon: Zap,
            progress: andamentoTotal > 0 ? 100 : 0,
            footer: andamentoTotal > 0
                ? `${andamentoTotal} em fluxo ativo`
                : 'Nenhum ensaio ativo',
            meta: andamentoTotal > 0 ? 'Acompanhar' : '',
            to: '/ensaios?grupo=ativos',
        },
        {
            title: 'Seleções recebidas',
            value: selecoes,
            description: 'aguardando revisão',
            icon: CheckCircle2,
            progress: selecoes > 0 ? 100 : 0,
            footer: selecoes > 0
                ? `${selecoes} aguardando revisão`
                : 'Sem alterações',
            meta: selecoes > 0 ? 'Revisar' : '',
            to: '/ensaios?status=EM_SELECAO',
        },
        {
            title: 'Entregas do mês',
            value: entregas,
            description: 'finalizados no mês',
            icon: PackageCheck,
            progress: entregas > 0 ? 100 : 0,
            footer: entregaLabel,
            meta: entregas > 0 ? 'Ver finalizados' : '',
            to: '/ensaios?status=FINALIZADO',
        },
    ]

    return (
        <Card className="mt-5 rounded-[18px] px-6 py-6">
            <div className="grid gap-8 lg:grid-cols-2 2xl:grid-cols-4">
                {metrics.map((metric) => (
                    <OverviewMetric key={metric.title} {...metric} />
                ))}
            </div>
        </Card>
    )
}

function OverviewMetric({
    title,
    value,
    description,
    icon: Icon,
    progress,
    footer,
    meta,
    to,
}) {
    const content = (
        <div className="min-w-0">
            <div className="flex items-start gap-5">
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#F5F3F1] text-[#C84F32]">
                    <Icon size={26} strokeWidth={1.7} />
                </span>

                <div className="min-w-0">
                <h2 className="text-[13px] font-semibold uppercase leading-4 tracking-[0.015em] text-[#1F1F21]">
                        {title}
                    </h2>
                    <strong className="mt-2 block text-[36px] font-normal leading-none text-[#080706]">
                        {value}
                    </strong>
                    <p className="mt-2 text-sm leading-5 text-[#1F1F21]">
                        {description}
                    </p>
                </div>
            </div>

            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#e5ddd4]">
                <span
                    className="block h-full rounded-full bg-[#b8731b]"
                    style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                />
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 text-sm text-[#1F1F21]">
                <span className="inline-flex min-w-0 items-center gap-2">
                    {progress > 0 ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <CheckCircle2 size={12} />
                        </span>
                    ) : (
                        <span className="h-4 w-4 shrink-0 rounded-full border border-[#E8E3DF]" />
                    )}
                    <span className="truncate">{footer}</span>
                </span>

                {meta ? (
                    <span className="shrink-0 text-right text-[#1F1F21] group-hover:text-[#C84F32]">
                        {meta}
                    </span>
                ) : null}
            </div>
        </div>
    )

    if (!to) return content

    return (
        <Link
            to={to}
            title={`Abrir ${title.toLowerCase()}`}
            aria-label={`Abrir ${title.toLowerCase()}`}
            className="group block rounded-[12px] transition hover:-translate-y-0.5 hover:bg-white/45 focus:outline-none focus:ring-2 focus:ring-[#d3ad79]/40"
        >
            {content}
        </Link>
    )
}

function FlowPerformanceCard({ etapas }) {
    const items = Array.isArray(etapas) ? etapas : []
    const hasData = items.some((item) => Number(item?.quantidadeAmostras || 0) > 0 && item?.mediaDias !== null)

    return (
        <Card className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-[16px] font-semibold uppercase tracking-[0.015em] text-[#1F1F21]">
                        Desempenho do fluxo
                    </h2>

                    <p className="mt-1 text-[13px] leading-5 text-[#6F6D6B]">
                        Quanto tempo o estúdio leva em cada etapa
                    </p>
                </div>

                <span
                    title="Média calculada com os dados recentes disponíveis"
                    aria-label="Média calculada com os dados recentes disponíveis"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#E8E3DF] text-xs text-[#96928E]"
                >
                    i
                </span>
            </div>

            {hasData ? (
                <div className="mt-4">
                    <div className="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
                        {items.map((item, index) => (
                            <FlowMetricFragment
                                key={item?.chave || item?.titulo || index}
                                item={item}
                                index={index}
                                showArrow={index < items.length - 1}
                            />
                        ))}
                    </div>

                    <div className="mt-4 border-t border-[#EEEAE7] pt-3 text-xs text-[#8a8580]">
                        Baseado no histórico recente
                    </div>
                </div>
            ) : (
                <div className="mt-5 flex min-h-[128px] items-center justify-center rounded-[12px] border border-dashed border-[#e5d8ca] bg-white/42 px-5 text-center text-sm text-[#6F6D6B]">
                    Ainda não há histórico suficiente para calcular este indicador.
                </div>
            )}
        </Card>
    )
}

function FlowMetricFragment({ item, index, showArrow }) {
    const config = getFlowMetricConfig(item?.chave, index)
    const Icon = config.icon

    return (
        <>
            <div className="grid min-w-0 grid-cols-[36px_minmax(0,1fr)] items-center gap-2">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.tone}`}>
                    <Icon size={18} strokeWidth={1.9} />
                </span>

                <div className="min-w-0">
                    <p className="text-[11px] font-semibold leading-4 text-[#2b2520]">
                        {item?.titulo || config.title}
                    </p>

                    <p className="mt-1 whitespace-nowrap text-[20px] font-semibold leading-5 text-[#1F1F21]">
                        {formatarDiasFluxo(item?.mediaDias)}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-[#8a8580]">
                        {Number(item?.quantidadeAmostras || 0)} amostra{Number(item?.quantidadeAmostras || 0) === 1 ? '' : 's'}
                    </p>
                </div>
            </div>

            {showArrow ? (
                <ArrowRight size={16} className="justify-self-center text-[#c9b9a7] max-lg:hidden" />
            ) : null}
        </>
    )
}

function DemandRegionCard({ regioes }) {
    const ranking = Array.isArray(regioes) ? regioes : []
    const [modalOpen, setModalOpen] = useState(false)
    const visibleRanking = ranking.slice(0, REGION_VISIBLE_LIMIT)
    const hasMoreRegions = ranking.length > REGION_VISIBLE_LIMIT

    return (
        <>
            <Card className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <MetricCardHeader
                        icon={MapPin}
                        title="Clientes por região"
                        subtitle="De onde vêm seus clientes"
                        compact
                    />

                    {hasMoreRegions ? (
                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="shrink-0 rounded-full border border-[#E8E3DF] bg-white px-3 py-1.5 text-xs font-semibold text-[#C84F32] transition hover:border-[#C84F32] hover:bg-[#F8EDE8]"
                        >
                            Ver todas
                        </button>
                    ) : null}
                </div>

                {ranking.length ? (
                    <>
                        <div className="mt-4 divide-y divide-[#EEEAE7]">
                            {visibleRanking.map((item, index) => {
                                const quantidade = Number(item?.quantidadeClientes || 0)

                                return (
                                    <RankingListItem
                                        key={item?.regiao || index}
                                        index={index}
                                        title={item?.regiao || 'Região'}
                                        middleText={`${quantidade} cliente${quantidade === 1 ? '' : 's'}`}
                                        percent={Number(item?.percentual || 0)}
                                        compact
                                    />
                                )
                            })}
                        </div>

                        <div className="mt-4 flex items-center gap-2 border-t border-[#EEEAE7] pt-3 text-xs text-[#8a8580]">
                            <span className="h-2 w-2 rounded-full bg-[#f2997a]" />
                            Com base nos clientes cadastrados com cidade informada.
                        </div>
                    </>
                ) : (
                    <EmptyDashboardMetric compact>
                        Ainda não há clientes com localização suficiente para gerar este ranking.
                    </EmptyDashboardMetric>
                )}
            </Card>

            {modalOpen ? (
                <RegionRankingModal
                    regioes={ranking}
                    onClose={() => setModalOpen(false)}
                />
            ) : null}
        </>
    )
}

function RegionRankingModal({ regioes, onClose }) {
    const ranking = Array.isArray(regioes) ? regioes : []

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#1F1F21]/38 px-4 py-6 backdrop-blur-[2px]">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="region-ranking-title"
                className="w-full max-w-[620px] overflow-hidden rounded-[16px] border border-[#E5D8CA] bg-white shadow-[0_24px_70px_rgba(17,19,21,0.22)]"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#EEEAE7] px-5 py-4">
                    <MetricCardHeader
                        icon={MapPin}
                        title="Clientes por região"
                        subtitle="Ranking completo"
                        compact
                    />

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[#8A8580] transition hover:bg-[#F4F1EE] hover:text-[#1F1F21]"
                        aria-label="Fechar"
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>
                </div>

                <div className="max-h-[65vh] overflow-y-auto px-5 py-3">
                    <div className="divide-y divide-[#EEEAE7]">
                        {ranking.map((item, index) => {
                            const quantidade = Number(item?.quantidadeClientes || 0)

                            return (
                                <RankingListItem
                                    key={item?.regiao || index}
                                    index={index}
                                    title={item?.regiao || 'Região'}
                                    middleText={`${quantidade} cliente${quantidade === 1 ? '' : 's'}`}
                                    percent={Number(item?.percentual || 0)}
                                    compact
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

function RevenueByTypeDashboardCard({
    tipos,
    periodo = DEFAULT_REVENUE_PERIOD,
    loading = false,
    erro = '',
    onPeriodoChange,
}) {
    const [visualizacao, setVisualizacao] = useState('lista')
    const [modalOpen, setModalOpen] = useState(false)
    const ranking = Array.isArray(tipos) ? tipos : []
    const visibleRanking = ranking.slice(0, REVENUE_VISIBLE_LIMIT)
    const hasMoreTypes = ranking.length > REVENUE_VISIBLE_LIMIT
    const leader = visibleRanking[0] || ranking[0]
    const periodoLabel = getRevenuePeriodLabel(periodo)

    return (
        <>
            <Card className={`p-5 sm:p-6 ${ranking.length && visualizacao === 'donut' ? 'xl:min-h-[462px]' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                    <MetricCardHeader
                        icon={DollarSign}
                        title="Receita por tipo de ensaio"
                        subtitle="Onde o faturamento está concentrado"
                        compact
                    />

                    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                        <RevenuePeriodSelect
                            value={periodo}
                            onChange={onPeriodoChange}
                            disabled={loading}
                        />

                        {hasMoreTypes ? (
                            <button
                                type="button"
                                onClick={() => setModalOpen(true)}
                                className="rounded-full border border-[#E8E3DF] bg-white px-3 py-1.5 text-xs font-semibold text-[#C84F32] transition hover:border-[#C84F32] hover:bg-[#F8EDE8]"
                            >
                                Ver todos
                            </button>
                        ) : null}

                        {ranking.length ? (
                            <div className="inline-flex rounded-full border border-[#E8E3DF] bg-transparent p-0.5">
                            <DashboardToggleButton
                                active={visualizacao === 'lista'}
                                onClick={() => setVisualizacao('lista')}
                            >
                                Lista
                            </DashboardToggleButton>

                            <DashboardToggleButton
                                active={visualizacao === 'donut'}
                                onClick={() => setVisualizacao('donut')}
                            >
                                Donut
                            </DashboardToggleButton>
                            </div>
                        ) : null}
                    </div>
                </div>

                {erro ? (
                    <p className="mt-4 rounded-[10px] border border-[#F1D7D0] bg-[#FFF8F6] px-3 py-2 text-xs font-medium text-[#C84F32]">
                        {erro}
                    </p>
                ) : null}

                {ranking.length && visualizacao === 'lista' ? (
                    <div className={`mt-6 divide-y divide-[#EEEAE7] ${loading ? 'opacity-60' : ''}`}>
                        {visibleRanking.map((item, index) => {
                            const quantidade = Number(item?.quantidadeEnsaios || 0)
                            const percentual = Number(item?.percentualReceita || 0)

                            return (
                                <RankingListItem
                                    key={item?.tipoExibicao || item?.tipo || index}
                                    index={index}
                                    title={item?.tipoExibicao || getTipoLabel(item)}
                                    description={`${quantidade} ensaio${quantidade === 1 ? '' : 's'} · ticket médio ${formatarMoeda(item?.ticketMedio)}`}
                                    percent={percentual}
                                    value={formatarMoeda(item?.faturamento)}
                                />
                            )
                        })}
                    </div>
                ) : ranking.length ? (
                    <div className={`mt-6 flex min-h-[228px] items-center justify-center xl:min-h-[318px] ${loading ? 'opacity-60' : ''}`}>
                        <div className="relative h-72 w-72">
                            <DashboardDonutChart ranking={ranking} />

                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a7e73]">
                                    Líder
                                </p>
                                <p className="mt-2 max-w-[150px] truncate text-base font-semibold text-[#2b2520]">
                                    {leader?.tipoExibicao || getTipoLabel(leader)}
                                </p>
                                <p className="text-4xl font-semibold text-[#C84F32]">
                                    {formatarPercentual(leader?.percentualReceita)}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyDashboardMetric>
                        Ainda não há faturamento suficiente no período.
                    </EmptyDashboardMetric>
                )}

                <div className="mt-4 flex items-center gap-2 border-t border-[#EEEAE7] pt-3 text-xs text-[#8A8580]">
                    <span className="h-2 w-2 rounded-full bg-[#F29B7D]" />
                    <span>
                        Período: {periodoLabel}. Considera ensaios finalizados.
                    </span>
                    {loading ? (
                        <span className="ml-auto font-semibold text-[#C84F32]">
                            Atualizando...
                        </span>
                    ) : null}
                </div>
            </Card>

            {modalOpen ? (
                <RevenueRankingModal
                    tipos={ranking}
                    onClose={() => setModalOpen(false)}
                />
            ) : null}
        </>
    )
}

function RevenueRankingModal({ tipos, onClose }) {
    const ranking = Array.isArray(tipos) ? tipos : []

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#1F1F21]/38 px-4 py-6 backdrop-blur-[2px]">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="revenue-ranking-title"
                className="w-full max-w-[720px] overflow-hidden rounded-[16px] border border-[#E5D8CA] bg-white shadow-[0_24px_70px_rgba(17,19,21,0.22)]"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#EEEAE7] px-5 py-4">
                    <MetricCardHeader
                        icon={DollarSign}
                        title="Receita por tipo de ensaio"
                        subtitle="Ranking completo"
                        compact
                    />

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[#8A8580] transition hover:bg-[#F4F1EE] hover:text-[#1F1F21]"
                        aria-label="Fechar"
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>
                </div>

                <div className="max-h-[65vh] overflow-y-auto px-5 py-3">
                    <div className="divide-y divide-[#EEEAE7]">
                        {ranking.map((item, index) => {
                            const quantidade = Number(item?.quantidadeEnsaios || 0)

                            return (
                                <RankingListItem
                                    key={item?.tipoExibicao || item?.tipo || index}
                                    index={index}
                                    title={item?.tipoExibicao || getTipoLabel(item)}
                                    description={`${quantidade} ensaio${quantidade === 1 ? '' : 's'} · ticket médio ${formatarMoeda(item?.ticketMedio)}`}
                                    percent={Number(item?.percentualReceita || 0)}
                                    value={formatarMoeda(item?.faturamento)}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

function RevenuePeriodSelect({ value, onChange, disabled = false }) {
    return (
        <label className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-[#E8E3DF] bg-white px-3 text-xs font-semibold text-[#5F5B57] shadow-[0_6px_16px_rgba(31,31,33,0.04)]">
            <CalendarDays size={14} strokeWidth={1.8} className="text-[#C84F32]" />
            <select
                value={value}
                disabled={disabled}
                onChange={(event) => onChange?.(event.target.value)}
                className="max-w-[138px] cursor-pointer bg-transparent text-xs font-semibold text-[#5F5B57] outline-none disabled:cursor-wait disabled:opacity-70"
                aria-label="Período da receita por tipo de ensaio"
            >
                {REVENUE_PERIOD_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    )
}

function MetricCardHeader({ icon: Icon, title, subtitle, compact = false }) {
    return (
        <div className={`flex min-w-0 items-start ${compact ? 'gap-3' : 'gap-4'}`}>
            <span className={`flex shrink-0 items-center justify-center rounded-[10px] bg-[#fff0e8] text-[#C84F32] ${compact ? 'h-11 w-11' : 'h-14 w-14'}`}>
                <Icon size={compact ? 21 : 25} strokeWidth={1.8} />
            </span>

            <div className="min-w-0">
                <h2 className={`${compact ? 'text-[16px] leading-5' : 'text-[17px] leading-6'} font-semibold uppercase tracking-[0.015em] text-[#1F1F21]`}>
                    {title}
                </h2>

                <p className={`${compact ? 'mt-0.5 text-[13px]' : 'mt-1 text-sm'} leading-5 text-[#6F6D6B]`}>
                    {subtitle}
                </p>
            </div>
        </div>
    )
}

function getRevenuePeriodLabel(value) {
    return REVENUE_PERIOD_OPTIONS.find((option) => option.value === value)?.label
        || REVENUE_PERIOD_OPTIONS[0].label
}

function DashboardToggleButton({ active, children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active
                    ? 'bg-[#C84F32] text-white shadow-[0_6px_14px_rgba(200,79,50,0.14)]'
                    : 'text-[#6F6D6B] hover:bg-[#fff8f4] hover:text-[#C84F32]'
            }`}
        >
            {children}
        </button>
    )
}

function RankingListItem({
    index,
    title,
    description,
    middleText,
    percent,
    value,
    compact = false,
}) {
    const tone = getRankingTone(index)
    const normalizedPercent = Math.min(100, Math.max(0, percent || 0))
    const articleClass = compact
        ? 'grid min-h-[54px] items-center gap-3 py-2 sm:grid-cols-[minmax(0,1fr)_110px_58px]'
        : 'grid min-h-[72px] items-center gap-4 py-3 sm:grid-cols-[minmax(0,1fr)_156px_88px]'
    const badgeClass = compact
        ? 'h-9 w-9 rounded-[8px] text-base'
        : 'h-11 w-11 rounded-[9px] text-lg'
    const percentClass = compact
        ? 'text-[18px]'
        : 'text-[18px]'

    return (
        <article className={articleClass}>
            <div className="flex min-w-0 items-center gap-3">
                <span className={`flex shrink-0 items-center justify-center font-semibold ${badgeClass} ${tone}`}>
                    {index + 1}
                </span>

                <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-semibold text-[#1F1F21]">
                        {title}
                    </h3>

                    {description ? (
                        <p className="mt-0.5 truncate text-sm text-[#6F6D6B]">
                            {description}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className={`${compact ? 'text-[13px]' : 'text-sm'} text-left text-[#6F6D6B] max-sm:hidden`}>
                {middleText || ''}
            </div>

            <div className="text-left sm:text-right">
                <p className={`font-semibold leading-none text-[#C84F32] ${percentClass}`}>
                    {formatarPercentual(normalizedPercent)}
                </p>

                {value ? (
                    <p className="mt-1 text-sm font-medium text-[#6F6D6B]">
                        {value}
                    </p>
                ) : null}
            </div>
        </article>
    )
}

function DashboardDonutChart({ ranking }) {
    let offset = 0

    return (
        <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
            <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke="#eee7df"
                strokeWidth="5"
            />

            {ranking.map((item, index) => {
                const percentual = Math.max(0, Number(item?.percentualReceita || 0))
                const quantidade = Number(item?.quantidadeEnsaios || 0)
                const nome = item?.tipoExibicao || getTipoLabel(item)
                const dashOffset = -offset
                offset += percentual

                return (
                    <circle
                        key={item?.tipoExibicao || item?.tipo || index}
                        className="cursor-pointer opacity-90 transition duration-200 hover:opacity-100 hover:[filter:saturate(1.28)_brightness(1.08)]"
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="transparent"
                        stroke={getDashboardDonutColor(index)}
                        strokeWidth="5"
                        strokeDasharray={`${percentual} ${100 - percentual}`}
                        strokeDashoffset={dashOffset}
                    >
                        <title>
                            {`${nome} · ${formatarPercentual(percentual)} · ${formatarMoeda(item?.faturamento)} · ${quantidade} ensaio${quantidade === 1 ? '' : 's'}`}
                        </title>
                    </circle>
                )
            })}
        </svg>
    )
}

function getDashboardDonutColor(index) {
    const colors = ['#C84F32', '#c9872b', '#20B8A6', '#7167E8', '#F29A2E']

    return colors[index % colors.length]
}

function EmptyDashboardMetric({ children, compact = false }) {
    return (
        <div className={`mt-5 flex items-center justify-center rounded-[12px] border border-dashed border-[#e5d8ca] bg-white/42 px-5 text-center text-sm text-[#6F6D6B] ${compact ? 'min-h-[130px]' : 'min-h-[190px]'}`}>
            {children}
        </div>
    )
}

function getFlowMetricConfig(chave, index = 0) {
    const configs = {
        ENSAIO_ALBUM: {
            icon: Camera,
            title: 'Ensaio → álbum',
            tone: 'bg-[#eaf8e9] text-[#62A83E]',
        },
        ALBUM_SELECAO: {
            icon: PencilLine,
            title: 'Álbum → seleção',
            tone: 'bg-[#f0edff] text-[#7167E8]',
        },
        SELECAO_FINALIZACAO: {
            icon: CheckCircle2,
            title: 'Seleção → finalização',
            tone: 'bg-[#fff0e4] text-[#F27A2E]',
        },
    }

    return configs[chave] || Object.values(configs)[index] || configs.ENSAIO_ALBUM
}

function getRankingTone(index) {
    const tones = [
        'bg-[#fff0f0] text-[#ef5350]',
        'bg-[#e7f7fb] text-[#1597ad]',
        'bg-[#f2ecff] text-[#8b5cf6]',
        'bg-[#e8f8ef] text-[#20a66a]',
    ]

    return tones[index] || tones[0]
}

function formatarDiasFluxo(valor) {
    if (valor === null || valor === undefined) {
        return 'Sem dados'
    }

    const numero = Number(valor)

    if (Number.isNaN(numero)) {
        return 'Sem dados'
    }

    return `${numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    })} dias`
}

function formatarPercentual(valor) {
    return `${Number(valor || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    })}%`
}

function DashboardSkeleton() {
    return (
        <div className="mx-auto max-w-[1480px] animate-pulse">
            <div className="h-3 w-64 rounded-full bg-[#EEEAE7]" />
            <div className="mt-5 h-14 w-96 max-w-full rounded-full bg-[#EEEAE7]" />
            <div className="mt-4 h-5 w-80 max-w-full rounded-full bg-[#EEEAE7]" />
            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <div className="h-64 rounded-[14px] bg-white/78" />
                <div className="h-64 rounded-[14px] bg-white/78" />
            </div>
            <div className="mt-6 h-36 rounded-[14px] bg-white/78" />
            <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,1fr)]">
                <div className="h-[430px] rounded-[14px] bg-white/78" />
                <div className="space-y-6">
                    <div className="h-44 rounded-[14px] bg-white/78" />
                    <div className="h-64 rounded-[14px] bg-white/78" />
                </div>
            </div>
        </div>
    )
}
