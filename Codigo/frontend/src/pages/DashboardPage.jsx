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
    Grid2X2,
    Image as ImageIcon,
    List,
    MapPin,
    PackageCheck,
    PencilLine,
    Plus,
    Sparkles,
    Sun,
    Users,
    Workflow,
    X,
    Zap,
} from 'lucide-react'

import DashboardError from '../components/dashboard/DashboardError'
import lightPremiumBg from '../assets/light-premium-bg.png'
import {
    formatarHora,
    formatarMoeda,
    formatarStatusEnsaio,
    formatarTempoRelativo,
} from '../utils/dashboardFormatters'
import Header from '../components/layout/Header'
import AppTopControls from '../components/layout/AppTopControls'
import { dashboardService } from '../services/dashboardService'
import { ensaiosService } from '../services/ensaiosService'

const PIPELINE_ORDER = [
    { status: 'AGENDADO', icon: CalendarDays, color: '#818cf8', bg: 'bg-indigo-100', text: 'text-indigo-600' },
    { status: 'REALIZADO', icon: Camera, color: '#86c36b', bg: 'bg-lime-100', text: 'text-lime-700' },
    { status: 'EM_SELECAO', icon: ImageIcon, color: '#f5c56c', bg: 'bg-amber-100', text: 'text-amber-700' },
    { status: 'EM_EDICAO', icon: PencilLine, color: '#7dd3fc', bg: 'bg-sky-100', text: 'text-sky-700' },
    { status: 'FINALIZADO', icon: CheckCircle2, color: '#38b89f', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    { status: 'CANCELADO', icon: X, color: '#f5a3a3', bg: 'bg-red-100', text: 'text-red-600' },
]

const NOTICE_ROTATION_INTERVAL_MS = 10 * 60 * 1000
const DISMISSED_ACTIVITIES_STORAGE_KEY = 'fotolhar-dashboard-dismissed-activities'
const FORECAST_VALUE_VISIBILITY_STORAGE_KEY = 'fotolhar-dashboard-forecast-value-visible'
const IN_PROGRESS_VIEW_STORAGE_KEY = 'fotolhar-dashboard-in-progress-view'
const PIPELINE_VIEW_STORAGE_KEY = 'fotolhar-dashboard-pipeline-view'

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

function getActivityConfig(ensaio) {
    const cliente = getFirstName(ensaio?.clienteNome) || 'Cliente'
    const tipo = getTipoLabel(ensaio)
    const status = formatarStatusEnsaio(ensaio?.status)

    if (ensaio?.status === 'FINALIZADO') {
        return {
            icon: CheckCircle2,
            title: `Ensaio de ${cliente} atualizado`,
            detail: `${status} · ${tipo}`,
            tone: 'text-emerald-700 bg-emerald-50 border-emerald-100',
        }
    }

    if (ensaio?.status === 'EM_EDICAO') {
        return {
            icon: PencilLine,
            title: `Ensaio de ${cliente} atualizado`,
            detail: `${status} · ${tipo}`,
            tone: 'text-sky-700 bg-sky-50 border-sky-100',
        }
    }

    if (ensaio?.status === 'EM_SELECAO') {
        return {
            icon: ImageIcon,
            title: `Ensaio de ${cliente} atualizado`,
            detail: `${status} · ${tipo}`,
            tone: 'text-amber-700 bg-amber-50 border-amber-100',
        }
    }

    if (ensaio?.status === 'REALIZADO') {
        return {
            icon: Camera,
            title: `Ensaio de ${cliente} atualizado`,
            detail: `${status} · ${tipo}`,
            tone: 'text-lime-700 bg-lime-50 border-lime-100',
        }
    }

    return {
        icon: CalendarDays,
        title: `Ensaio de ${cliente} atualizado`,
        detail: `${status} · ${tipo}`,
        tone: 'text-indigo-700 bg-indigo-50 border-indigo-100',
    }
}

function getActivityDismissKey(ensaio) {
    return `${ensaio?.id || 'atividade'}:${ensaio?.atualizadoEm || ensaio?.dataEnsaio || ''}`
}

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState(null)
    const [ensaiosHojeOverride, setEnsaiosHojeOverride] = useState(null)
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState('')

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

    if (erro) return <DashboardError mensagem={erro} />

    return (
        <main
            className="min-h-screen bg-[#f5f0e8] text-[#1a1610] antialiased"
            style={{
                backgroundImage: `linear-gradient(180deg, rgba(255, 252, 247, 0.76), rgba(245, 240, 232, 0.88)), url(${lightPremiumBg})`,
                backgroundPosition: 'center top',
                backgroundSize: 'cover',
            }}
        >
            <Header />

            <section className="min-w-0 px-4 pb-6 pt-[84px] sm:px-7 lg:px-9 lg:py-6">
                {loading ? (
                    <DashboardSkeleton />
                ) : (
                    <DashboardContent dashboard={dashboard || {}} ensaiosHojeOverride={ensaiosHojeOverride} />
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
                    className="flex h-11 items-center gap-3 rounded-[12px] bg-[#b77a2f] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(183,122,47,0.28)] transition hover:bg-[#9f6828]"
                >
                    <Plus size={19} />
                    Novo ensaio
                </Link>
            </div>
    )
}

function DashboardContent({ dashboard, ensaiosHojeOverride }) {
    const hoje = useMemo(() => new Date(), [])
    const usuarioNome = localStorage.getItem('usuarioNome') || ''
    const primeiroNome = getFirstName(usuarioNome)
    const agenda = dashboard?.agendaProxima || []
    const ensaiosHoje = getEnsaiosHoje(dashboard, agenda, hoje, ensaiosHojeOverride)
    const proximosEnsaios = dashboard?.proximosEnsaios?.length
        ? dashboard.proximosEnsaios
        : agenda
    const pipeline = dashboard?.pipelineStatus || {}
    const totalEnsaiosEmAndamento = Math.max(
        Number(dashboard?.ensaiosEmAndamentoTotal || 0),
        Number(pipeline.REALIZADO || 0) + Number(pipeline.EM_SELECAO || 0) + Number(pipeline.EM_EDICAO || 0)
    )
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
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a66f29]">
                        {dataFormatada}
                    </p>

                    <h1 className="mt-2 font-serif text-[36px] font-light leading-tight text-[#15120f] sm:text-[44px]">
                        {primeiroNome ? `Bem-vindo, ${primeiroNome}!` : 'Bem-vindo!'}
                    </h1>

                    <p className="mt-2 text-sm text-[#756a61]">
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
                <AttentionSummaryCard dashboard={dashboard} />
            </div>

            <DashboardOverviewStrip dashboard={dashboard} />

            <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_540px]">
                <InProgressCard
                    ensaios={dashboard?.ensaiosEmAndamento || []}
                    total={totalEnsaiosEmAndamento}
                />
                <div className="space-y-5">
                    <PipelineCard pipeline={dashboard?.pipelineStatus || {}} />
                    <ActivityCard ensaios={dashboard?.ultimasAtualizacoes || []} />
                </div>
            </div>
        </div>
    )
}

function Card({ children, className = '' }) {
    return (
        <section className={`rounded-[14px] border border-[#e6d8c8] bg-white/78 shadow-[0_14px_34px_rgba(78,56,35,0.07)] ${className}`}>
            {children}
        </section>
    )
}

function getDashboardNotice(dashboard, agenda, hoje, ensaiosHoje, rotationSlot = 0) {
    const ensaiosAgendadosHoje = getEnsaiosAgendadosHoje(ensaiosHoje)
    const pendencias = dashboard?.atencaoNecessaria || []
    const pendenciasAgrupadasNoCard = pendencias.length > 0
    const encontrarPendencia = (tipo) => pendencias.find((item) => item?.tipo === tipo && item?.ensaioId)
    const contarPendencias = (tipo) => pendencias.filter((item) => item?.tipo === tipo).length
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
            to: '/ensaios?grupo=ativos',
        })
    }

    if (ensaiosEmEdicao > 0) {
        routineNotices.push({
            icon: PencilLine,
            title: ensaiosEmEdicao > 1 ? 'Edições em andamento' : 'Edição em andamento',
            text: ensaiosEmEdicao > 1
                ? `${ensaiosEmEdicao} ensaios estão em edição. Atualize o status quando a entrega estiver pronta.`
                : 'Há um ensaio em edição. Atualize o status quando a entrega estiver pronta.',
            to: '/ensaios?status=EM_EDICAO',
        })
    }

    if (ensaiosRealizados > 0 && !uploadPendente && !albumPendente) {
        routineNotices.push({
            icon: Camera,
            title: ensaiosRealizados > 1 ? 'Ensaios realizados' : 'Ensaio realizado',
            text: ensaiosRealizados > 1
                ? `${ensaiosRealizados} ensaios já foram realizados. Confira se fotos, álbum e próxima etapa estão em dia.`
                : 'Há um ensaio realizado. Confira se fotos, álbum e próxima etapa estão em dia.',
            to: '/ensaios?status=REALIZADO',
        })
    }

    if (ensaiosEmSelecao > 0 && !selecaoEnviada) {
        routineNotices.push({
            icon: ImageIcon,
            title: ensaiosEmSelecao > 1 ? 'Ensaios em seleção' : 'Ensaio em seleção',
            text: ensaiosEmSelecao > 1
                ? `${ensaiosEmSelecao} ensaios estão aguardando escolha de fotos pela cliente.`
                : 'Há um ensaio aguardando escolha de fotos pela cliente.',
            to: '/ensaios?status=EM_SELECAO',
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
            to: '/ensaios?status=AGENDADO',
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
        to: '/configuracoes',
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
            className="flex min-h-[82px] items-center gap-4 rounded-[14px] border border-[#e0d0bd] bg-white/72 px-5 py-4 shadow-[0_12px_30px_rgba(78,56,35,0.05)] transition hover:border-[#c99a5d] hover:bg-white/82"
        >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f1e8dd] text-[#b77a2f]">
                <NoticeIcon size={21} strokeWidth={1.6} />
            </span>

            <span className="min-w-0 flex-1">
                <strong className="block text-sm font-semibold text-[#9f6828]">
                    {notice.title}
                </strong>
                <span className="mt-1 block text-sm leading-5 text-[#4f453d]">
                    {notice.text}
                </span>
            </span>

            <ArrowRight size={20} className="shrink-0 text-[#a8783a]" />
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
        <Card className="flex min-h-[236px] flex-col justify-between p-4 xl:h-[348px]">
            <div className="flex items-start justify-between gap-4">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.015em] text-[#2a231f]">
                    Valor previsto
                </h2>

                <button
                    type="button"
                    onClick={toggleMostrarValor}
                    title={mostrarValor ? 'Ocultar valor previsto' : 'Mostrar valor previsto'}
                    aria-label={mostrarValor ? 'Ocultar valor previsto' : 'Mostrar valor previsto'}
                    aria-pressed={!mostrarValor}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e0d0bd] bg-white/72 text-[#a8783a] transition hover:border-[#b77a2f] hover:bg-[#f7efe5]"
                >
                    <ToggleIcon size={18} />
                </button>
            </div>

            <div className="py-1">
                <span className="mb-4 flex h-[50px] w-[50px] items-center justify-center rounded-[12px] bg-[#f3eadf] text-[#a8783a]">
                    <DollarSign size={24} strokeWidth={1.6} />
                </span>

                <strong className="block font-serif text-[38px] font-light leading-none text-[#a8783a] sm:text-[42px] xl:text-[38px] 2xl:text-[44px]">
                    {mostrarValor ? valorFormatado : 'R$ •••••'}
                </strong>

                <p className="mt-3 text-sm text-[#4f453d]">
                    pacotes e fotos extras do mês
                </p>
            </div>

            <Link
                to="/relatorios"
                className="flex h-10 w-full items-center justify-center gap-3 rounded-full border border-[#decab5] bg-white/58 px-5 text-sm font-semibold text-[#9f6828] transition hover:border-[#b77a2f] hover:bg-[#f7efe5]"
            >
                Ver detalhes
                <ArrowRight size={18} />
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
        <Card className="flex min-h-[236px] flex-col p-5 xl:h-[348px]">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3.5">
                    <CalendarDays size={21} className="shrink-0 text-[#a8783a]" />
                    <h2 className="truncate text-[13px] font-semibold uppercase tracking-[0.015em] text-[#2a231f]">
                        Agenda da semana
                    </h2>
                </div>

                <Link
                    to="/ensaios?view=calendar"
                    className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#2a231f] transition hover:text-[#a8783a]"
                >
                    Ver agenda
                    <CalendarDays size={15} className="text-[#a8783a]" />
                </Link>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1.5">
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
                            className={`group relative flex min-h-[62px] flex-col items-center justify-center rounded-[11px] border text-center outline-none transition hover:border-[#c8a26d] hover:bg-[#f1e8dd] focus-visible:border-[#c8a26d] focus-visible:bg-[#f1e8dd] focus-visible:ring-2 focus-visible:ring-[#c8a26d]/20 ${
                                active ? 'border-[#e1d3c3] bg-[#f5eee6] shadow-sm' : 'border-transparent'
                            }`}
                        >
                            <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-lg border border-[#c8a26d] bg-white px-3 py-2 text-center text-[11px] font-medium leading-4 text-[#1a1610] opacity-0 shadow-xl shadow-black/10 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                                {summary}
                            </span>

                            <span className="text-[10px] font-semibold uppercase tracking-[0.02em] text-[#62564c]">
                                {day.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                            </span>
                            <span className="mt-0.5 text-[23px] font-normal leading-none text-[#080706]">
                                {String(day.getDate()).padStart(2, '0')}
                            </span>
                            <span className={`mt-2 h-1.5 w-1.5 rounded-full ${ensaiosDia.length ? 'bg-[#a8783a]' : 'bg-transparent'}`} />
                        </button>
                    )
                })}
            </div>

            <div className="mt-3 border-t border-[#d8cbbf] pt-4">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#2a231f]">
                        Próximo ensaio
                    </h3>

                    <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[12px] font-semibold uppercase text-[#4f453d]">
                            {items.length ? currentIndex + 1 : 0} DE {items.length}
                        </span>
                        <button
                            type="button"
                            onClick={previous}
                            disabled={!canNavigate}
                            title="Ensaio anterior"
                            aria-label="Ensaio anterior"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e0d0bd] bg-white/65 text-[#a8783a] transition enabled:hover:border-[#b77a2f] enabled:hover:bg-[#f7efe5] disabled:opacity-40"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            disabled={!canNavigate}
                            title="Próximo ensaio"
                            aria-label="Próximo ensaio"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e0d0bd] bg-white/65 text-[#a8783a] transition enabled:hover:border-[#b77a2f] enabled:hover:bg-[#f7efe5] disabled:opacity-40"
                        >
                            ›
                        </button>
                    </div>
                </div>

                {ensaio ? (
                    <article className="mt-3 grid min-h-[100px] grid-cols-[90px_minmax(0,1fr)_34px] overflow-hidden rounded-[12px] border border-[#eadfd4] bg-white/54">
                        <div className="flex flex-col items-center justify-center border-r border-[#eadfd4] bg-[#f4eee7] px-3 text-center">
                            <span className="text-[11px] font-bold uppercase text-[#a8783a]">
                                {data ? data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '') : '--'}
                            </span>
                            <span className="mt-1 text-[24px] font-semibold leading-none text-[#a8783a]">
                                {data ? String(data.getDate()).padStart(2, '0') : '--'}
                            </span>
                            <span className="mt-1 text-[10px] font-semibold uppercase text-[#a8783a]">
                                {data ? data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '') : ''}
                            </span>
                        </div>

                        <div className="min-w-0 px-4 py-4">
                            <h4 className="truncate text-[17px] font-medium text-[#1f1a15]">
                                {getTipoLabel(ensaio)}
                            </h4>

                            <div className="mt-3 flex min-w-0 items-center gap-2.5 overflow-hidden text-sm text-[#4f453d]">
                                <span className="font-semibold text-[#9f6828]">{getDaysUntilLabel(ensaio.dataEnsaio)}</span>
                                <span className="shrink-0 text-[#c7b6a4]">|</span>
                                <span className="inline-flex shrink-0 items-center gap-1.5">
                                    <Clock3 size={15} className="text-[#a8783a]" />
                                    {data ? formatarHora(data) : '--:--'}
                                </span>
                                <span className="inline-flex min-w-0 shrink items-center gap-1.5">
                                    <Users size={15} className="shrink-0 text-[#a8783a]" />
                                    <span className="truncate">{getFirstName(ensaio.clienteNome) || 'Cliente'}</span>
                                </span>
                                <span className="inline-flex min-w-0 shrink items-center gap-1.5">
                                    <MapPin size={15} className="shrink-0 text-[#a8783a]" />
                                    <span className="truncate">{ensaio.local || 'Local não informado'}</span>
                                </span>
                            </div>
                        </div>

                        <Link
                            to={`/ensaios/${ensaio.id}`}
                            title="Abrir ensaio"
                            aria-label="Abrir ensaio"
                            className="flex items-center justify-center text-[#a8783a] transition hover:bg-[#f7efe5]"
                        >
                            <ArrowRight size={22} />
                        </Link>
                    </article>
                ) : (
                    <div className="mt-3 flex min-h-[100px] items-center justify-center rounded-[12px] border border-dashed border-[#e1d3c3] bg-white/45 px-4 text-center text-sm text-[#756a61]">
                        Nenhum ensaio próximo agendado.
                    </div>
                )}
            </div>

            <div className="mt-auto flex items-center gap-2 pt-3 text-sm text-[#4f453d]">
                <CalendarDays size={17} className="shrink-0 text-[#a8783a]" />
                <span className="truncate">{getResumoHoje(ensaiosHoje, hoje)}</span>
            </div>
        </Card>
    )
}

function AttentionSummaryCard({ dashboard }) {
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

    return (
        <>
            <Card className="flex min-h-[236px] flex-col p-4 xl:h-[348px]">
                <div className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e0d0bd] bg-[#f6efe7] text-[#a8783a]">
                        <Bell size={18} />
                    </span>

                    <h2 className="text-[13px] font-semibold uppercase tracking-[0.015em] text-[#2a231f]">
                        Atenção necessária
                    </h2>
                </div>

                {activeRows.length ? (
                    <div className="mt-3 flex min-h-0 flex-1 flex-col">
                        <div className="min-h-0 flex-1 divide-y divide-[#eadfd4] overflow-y-auto overscroll-contain border-y border-[#eadfd4] pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                            className="mt-3 flex h-10 shrink-0 items-center justify-center gap-3 rounded-full border border-[#decab5] bg-white/58 px-5 text-sm font-semibold text-[#9f6828] transition hover:border-[#b77a2f] hover:bg-[#f7efe5]"
                        >
                            Ver todas as pendências
                            <ArrowRight size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="mt-3 flex flex-1 flex-col items-center justify-center rounded-[12px] border border-dashed border-[#e1d3c3] bg-white/45 px-5 py-5 text-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <CheckCircle2 size={20} />
                        </span>

                        <strong className="mt-4 text-sm font-medium text-[#1f1a15]">
                            Nenhuma pendência encontrada
                        </strong>

                        <span className="mt-1 text-sm text-[#756a61]">
                            Todos os ensaios estão em dia.
                        </span>
                    </div>
                )}
            </Card>

            {modalTypes !== null && (
                <AttentionDetailsModal
                    itens={modalItems}
                    onClose={() => setModalTypes(null)}
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
            className="flex h-[48px] w-full items-center gap-3 text-left transition hover:bg-[#fbf5ed]"
        >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] ${tone}`}>
                <Icon size={16} strokeWidth={1.8} />
            </span>

            <span className="min-w-0 flex-1 truncate text-sm text-[#1a1610]">
                {label}
            </span>

            <strong className="text-base font-medium text-[#1f1a15]">
                {value}
            </strong>

            <ArrowRight size={18} className="shrink-0 text-[#a8783a]" />
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
        <div className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-[#1a1610]/35 px-4 py-6 backdrop-blur-sm">
            <section className="flex max-h-[min(760px,calc(100vh-48px))] w-full max-w-[560px] flex-col overflow-hidden rounded-[16px] border border-[#e6d8c8] bg-[#fffaf4] shadow-[0_24px_70px_rgba(45,32,20,0.24)]">
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#eadfd4] px-5 py-4">
                    <div>
                        <h2 className="text-[13px] font-semibold uppercase tracking-[0.05em] text-[#2a231f]">
                            Pendências
                        </h2>
                        <p className="mt-1 text-sm text-[#756a61]">
                            {itens.length} {itens.length === 1 ? 'item precisa' : 'itens precisam'} de atenção.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        title="Fechar pendências"
                        aria-label="Fechar pendências"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e0d0bd] bg-white/70 text-[#4f453d] transition hover:border-[#b77a2f] hover:text-[#a8783a]"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
                    <div className="divide-y divide-[#eadfd4]">
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
                <strong className="block truncate text-sm font-medium text-[#1f1a15]">
                    {config.label}
                </strong>
                <span className="mt-1 block truncate text-sm text-[#756a61]">
                    {item?.clienteNome || 'Cliente'} · {item?.descricao || item?.titulo || 'Abrir ensaio'}
                    {data ? ` · ${data.toLocaleDateString('pt-BR')}` : ''}
                </span>
            </span>

            <ArrowRight size={18} className="shrink-0 text-[#a8783a]" />
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
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#f1e8dd] text-[#a8783a]">
                    <Icon size={26} strokeWidth={1.7} />
                </span>

                <div className="min-w-0">
                <h2 className="text-[13px] font-semibold uppercase leading-4 tracking-[0.015em] text-[#2a231f]">
                        {title}
                    </h2>
                    <strong className="mt-2 block text-[36px] font-normal leading-none text-[#080706]">
                        {value}
                    </strong>
                    <p className="mt-2 text-sm leading-5 text-[#1f1a15]">
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

            <div className="mt-5 flex items-center justify-between gap-4 text-sm text-[#1f1a15]">
                <span className="inline-flex min-w-0 items-center gap-2">
                    {progress > 0 ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <CheckCircle2 size={12} />
                        </span>
                    ) : (
                        <span className="h-4 w-4 shrink-0 rounded-full border border-[#e0d0bd]" />
                    )}
                    <span className="truncate">{footer}</span>
                </span>

                {meta ? (
                    <span className="shrink-0 text-right text-[#1f1a15] group-hover:text-[#a66f29]">
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

function InProgressCard({ ensaios, total }) {
    const items = ensaios || []
    const [viewMode, setViewMode] = useState(() =>
        getStoredPreference(IN_PROGRESS_VIEW_STORAGE_KEY, 'grid', ['grid', 'list'])
    )
    const visibleItems = items.slice(0, 8)
    const totalItems = Math.max(Number(total || 0), items.length)
    const hiddenItems = Math.max(totalItems - visibleItems.length, 0)
    function changeViewMode(nextMode) {
        setViewMode(nextMode)
        setStoredPreference(IN_PROGRESS_VIEW_STORAGE_KEY, nextMode)
    }

    return (
        <Card className="p-5">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-[17px] font-semibold uppercase tracking-[0.015em] text-[#2a231f]">
                    Ensaios em andamento
                </h2>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => changeViewMode('grid')}
                        title="Ver em cards"
                        aria-label="Ver ensaios em cards"
                        className={`flex h-9 w-9 items-center justify-center rounded-[7px] border transition ${
                            viewMode === 'grid'
                                ? 'border-[#e0d0bd] bg-white text-[#b77a2f] shadow-sm'
                                : 'border-[#e0d0bd] bg-white/50 text-[#a8783a] hover:bg-white/80'
                        }`}
                    >
                        <Grid2X2 size={17} />
                    </button>
                    <button
                        type="button"
                        onClick={() => changeViewMode('list')}
                        title="Ver em lista"
                        aria-label="Ver ensaios em lista"
                        className={`flex h-9 w-9 items-center justify-center rounded-[7px] border transition ${
                            viewMode === 'list'
                                ? 'border-[#e0d0bd] bg-white text-[#b77a2f] shadow-sm'
                                : 'border-[#e0d0bd] bg-white/50 text-[#a8783a] hover:bg-white/80'
                        }`}
                    >
                        <List size={17} />
                    </button>
                </div>
            </div>

            {items.length ? (
                <div className="mt-4">
                    {viewMode === 'grid' ? (
                        <div className="grid max-w-[920px] gap-3.5 md:grid-cols-2 xl:grid-cols-4">
                            {visibleItems.map((ensaio) => (
                                <ActiveEssayCard key={ensaio.id} ensaio={ensaio} />
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y divide-[#eadfd4] overflow-hidden rounded-[12px] border border-[#eadfd4] bg-white/45">
                            {visibleItems.map((ensaio) => (
                                <ActiveEssayListItem key={ensaio.id} ensaio={ensaio} />
                            ))}
                        </div>
                    )}

                    {hiddenItems > 0 && (
                        <Link
                            to="/ensaios?grupo=ativos"
                            className="mt-5 flex h-12 items-center justify-center gap-3 rounded-[10px] border border-[#eadfd4] bg-white/48 text-sm font-medium text-[#a66f29] transition hover:border-[#b77a2f] hover:bg-[#f7efe5]"
                        >
                            Ver mais
                            <span className="text-xs text-[#756a61]">
                                +{hiddenItems}
                            </span>
                            <ArrowRight size={18} />
                        </Link>
                    )}
                </div>
            ) : (
                <div className="mt-4 flex min-h-[220px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#e5d8ca] bg-white/42 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1e8dd] text-[#b77a2f]">
                        <Camera size={27} strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 text-lg font-medium text-[#1f1a15]">
                        Nenhum ensaio em andamento.
                    </h3>
                    <p className="mt-1 text-sm text-[#756a61]">
                        Os ensaios ativos aparecerão aqui.
                    </p>
                </div>
            )}
        </Card>
    )
}

function ActiveEssayCard({ ensaio }) {
    const progress = Math.min(Math.max(Number(ensaio?.progresso || 0), 0), 100)
    const hasImage = Boolean(ensaio?.capaUrl)
    const progressText = getEnsaioStageDescription(ensaio)
    const statusConfig = getPipelineConfig(ensaio?.status)
    const StatusIcon = statusConfig.icon

    return (
        <Link
            to={`/ensaios/${ensaio.id}`}
            className="group overflow-hidden rounded-[8px] border border-[#eadfd4] bg-white/62 transition hover:border-[#c99a5d] hover:shadow-[0_12px_28px_rgba(78,56,35,0.08)]"
        >
            <div className="relative h-[108px] overflow-hidden bg-[#efe4d8]">
                {hasImage ? (
                    <img
                        src={ensaio.capaUrl}
                        alt={ensaio.clienteNome}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#b77a2f]">
                        <Camera size={28} strokeWidth={1.5} />
                    </div>
                )}

                <span className={`absolute left-2.5 top-2.5 inline-flex max-w-[calc(100%-20px)] items-center gap-1.5 truncate rounded-full border border-white/70 bg-white/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.02em] shadow-sm ${statusConfig.text}`}>
                    <StatusIcon size={13} />
                    {formatarStatusEnsaio(ensaio.status)}
                </span>
            </div>

            <div className="p-2.5">
                <h3 className="truncate text-sm font-medium text-[#1f1a15]">
                    {ensaio.clienteNome || 'Cliente sem nome'}
                </h3>

                <p className="mt-1 truncate text-xs text-[#756a61]">
                    {getTipoLabel(ensaio)}
                </p>

                <div className="mt-2 grid gap-1.5 text-[11px] text-[#62564c]">
                    <span className="flex items-center gap-2">
                        <CalendarDays size={13} className="text-[#a8783a]" />
                        {getDate(ensaio.dataEnsaio)?.toLocaleDateString('pt-BR') || 'Sem data'}
                    </span>

                    <span className="flex min-w-0 items-center gap-2">
                        <MapPin size={13} className="shrink-0 text-[#a8783a]" />
                        <span className="truncate">{ensaio.local || 'Local não informado'}</span>
                    </span>
                </div>

                <div className="mt-2">
                    <div className="mb-1.5 flex items-end justify-between gap-3 text-[11px]">
                        <span className="font-medium text-[#756a61]">
                            Progresso
                        </span>
                        <span className="font-serif text-[17px] font-light leading-none text-[#a8783a]">
                            {progress}%
                        </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[#e8ded2]">
                        <span className="block h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: statusConfig.color }} />
                    </div>

                    <p className="mt-1.5 min-h-[16px] truncate text-[11px] leading-4 text-[#756a61]">
                        {progressText}
                    </p>
                </div>
            </div>
        </Link>
    )
}

function ActiveEssayListItem({ ensaio }) {
    const progress = Math.min(Math.max(Number(ensaio?.progresso || 0), 0), 100)
    const statusConfig = getPipelineConfig(ensaio?.status)
    const StatusIcon = statusConfig.icon
    const hasImage = Boolean(ensaio?.capaUrl)

    return (
        <Link
            to={`/ensaios/${ensaio.id}`}
            className="grid min-h-[86px] grid-cols-[minmax(0,1.45fr)_minmax(150px,0.8fr)_minmax(150px,0.8fr)_112px_28px] items-center gap-4 px-4 py-3 transition hover:bg-[#fbf5ed] max-lg:grid-cols-[minmax(0,1fr)_28px]"
        >
            <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-14 w-14 shrink-0 overflow-hidden rounded-[8px] bg-[#efe4d8] text-[#b77a2f]">
                    {hasImage ? (
                        <img
                            src={ensaio.capaUrl}
                            alt={ensaio.clienteNome || 'Capa do ensaio'}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center">
                            <Camera size={20} strokeWidth={1.5} />
                        </span>
                    )}
                </span>

                <span className="min-w-0">
                    <strong className="block truncate text-sm font-medium text-[#1f1a15]">
                        {ensaio.clienteNome || 'Cliente sem nome'}
                    </strong>
                    <span className="mt-1 block truncate text-xs text-[#756a61]">
                        {getTipoLabel(ensaio)}
                    </span>
                </span>
            </span>

            <span className="flex min-w-0 items-center gap-2 text-xs text-[#62564c] max-lg:hidden">
                <CalendarDays size={14} className="shrink-0 text-[#a8783a]" />
                <span className="truncate">{getDate(ensaio.dataEnsaio)?.toLocaleDateString('pt-BR') || 'Sem data'}</span>
            </span>

            <span className="flex min-w-0 items-center gap-2 text-xs text-[#62564c] max-lg:hidden">
                <MapPin size={14} className="shrink-0 text-[#a8783a]" />
                <span className="truncate">{ensaio.local || 'Local não informado'}</span>
            </span>

            <span className="max-lg:hidden">
                <span className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${statusConfig.bg} ${statusConfig.text}`}>
                    <StatusIcon size={12} />
                    {formatarStatusEnsaio(ensaio.status)}
                </span>
                <span className="mb-1.5 flex items-center justify-between gap-3 text-[11px] text-[#756a61]">
                    <span>Progresso</span>
                    <span className="font-serif text-base font-light text-[#a8783a]">{progress}%</span>
                </span>
                <span className="block h-1.5 overflow-hidden rounded-full bg-[#e8ded2]">
                    <span className="block h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: statusConfig.color }} />
                </span>
            </span>

            <ArrowRight size={18} className="justify-self-end text-[#a8783a]" />
        </Link>
    )
}

function getPipelineConfig(status) {
    return PIPELINE_ORDER.find((item) => item.status === status) || PIPELINE_ORDER[0]
}

function getEnsaioStageDescription(ensaio) {
    if (!ensaio?.status) return 'Aguardando próximos passos'

    if (ensaio.status === 'AGENDADO') return 'Aguardando realização'
    if (ensaio.status === 'REALIZADO') {
        return Number(ensaio?.totalFotos || 0) > 0
            ? 'Fotos enviadas'
            : 'Aguardando envio das fotos'
    }
    if (ensaio.status === 'EM_SELECAO') {
        return ensaio?.selecaoEnviada
            ? 'Seleção recebida'
            : 'Aguardando seleção'
    }
    if (ensaio.status === 'EM_EDICAO') return 'Editando fotos'
    if (ensaio.status === 'FINALIZADO') return 'Pronto para entrega'

    return 'Aguardando próximos passos'
}

function PipelineCard({ pipeline }) {
    const [viewMode, setViewMode] = useState(() =>
        getStoredPreference(PIPELINE_VIEW_STORAGE_KEY, 'pipeline', ['pipeline', 'list'])
    )
    const entries = PIPELINE_ORDER.map((item) => ({
        ...item,
        value: Number(pipeline?.[item.status] || 0),
    }))
    const total = entries.reduce((sum, entry) => sum + entry.value, 0)
    function changeViewMode(nextMode) {
        setViewMode(nextMode)
        setStoredPreference(PIPELINE_VIEW_STORAGE_KEY, nextMode)
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-[17px] font-semibold uppercase tracking-[0.015em] text-[#2a231f]">
                    Pipeline dos ensaios
                </h2>

                <div className="flex items-center gap-2">
                    <Link to="/ensaios?grupo=todos" className="text-sm font-medium text-[#a66f29] transition hover:text-[#7d5527]">
                        Ver todos
                    </Link>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => changeViewMode('pipeline')}
                            title="Ver pipeline"
                            aria-label="Ver pipeline"
                            className={`flex h-9 w-9 items-center justify-center rounded-[9px] transition ${
                                viewMode === 'pipeline'
                                    ? 'text-[#b77a2f]'
                                    : 'text-[#a8783a] hover:text-[#7d5527]'
                            }`}
                        >
                            <Workflow size={17} />
                        </button>
                        <button
                            type="button"
                            onClick={() => changeViewMode('list')}
                            title="Ver lista"
                            aria-label="Ver lista"
                            className={`flex h-9 w-9 items-center justify-center rounded-[9px] transition ${
                                viewMode === 'list'
                                    ? 'text-[#b77a2f]'
                                    : 'text-[#a8783a] hover:text-[#7d5527]'
                            }`}
                        >
                            <List size={17} />
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'pipeline' ? (
                <div className="mt-6 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="min-w-[500px]">
                        <div className="grid grid-cols-6 items-start gap-1">
                            {entries.map((entry, index) => {
                                const Icon = entry.icon

                                return (
                                    <Link key={entry.status} to={`/ensaios?status=${entry.status}`} className="group relative flex min-h-[126px] flex-col items-center text-center">
                                        <span className={`flex h-12 w-12 items-center justify-center rounded-full ${entry.bg} ${entry.text}`}>
                                            <Icon size={24} strokeWidth={1.8} />
                                        </span>

                                        {index < entries.length - 1 && (
                                            <ArrowRight
                                                size={16}
                                                strokeWidth={2}
                                                className="pointer-events-none absolute left-[calc(100%-10px)] top-[18px] text-[#c9b9a7]"
                                            />
                                        )}

                                        <span className="mt-4 max-w-[78px] text-[12px] font-medium leading-4 text-[#1f1a15]">
                                            {formatarStatusEnsaio(entry.status)}
                                        </span>
                                        <strong className="mt-3 text-[24px] font-semibold leading-none text-[#080706]">{entry.value}</strong>
                                    </Link>
                                )
                            })}
                        </div>

                        <div className="mt-2 grid grid-cols-6">
                            {entries.map((entry) => (
                                <span key={entry.status} className="relative h-6">
                                    <span
                                        className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span
                                        className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white ring-2"
                                        style={{ backgroundColor: entry.color, '--tw-ring-color': entry.color }}
                                    />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-5 divide-y divide-[#eadfd4] overflow-hidden rounded-[12px] border border-[#eadfd4] bg-white/45">
                    {entries.map((entry) => {
                        const Icon = entry.icon
                        const percent = total > 0 ? Math.round((entry.value / total) * 100) : 0

                        return (
                            <Link
                                key={entry.status}
                                to={`/ensaios?status=${entry.status}`}
                                className="grid min-h-[64px] grid-cols-[32px_minmax(0,1fr)_44px] items-center gap-3 px-4 py-3 transition hover:bg-[#fbf5ed]"
                            >
                                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${entry.bg} ${entry.text}`}>
                                    <Icon size={16} />
                                </span>
                                <span className="min-w-0">
                                    <span className="flex items-center justify-between gap-3">
                                        <span className="truncate text-sm text-[#1f1a15]">
                                            {formatarStatusEnsaio(entry.status)}
                                        </span>
                                        <span className="shrink-0 text-[11px] text-[#756a61]">
                                            {percent}%
                                        </span>
                                    </span>
                                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#e8ded2]">
                                        <span
                                            className="block h-full rounded-full"
                                            style={{ width: `${percent}%`, backgroundColor: entry.color }}
                                        />
                                    </span>
                                </span>
                                <strong className="justify-self-end text-sm font-medium text-[#1f1a15]">
                                    {entry.value}
                                </strong>
                            </Link>
                        )
                    })}
                </div>
            )}
        </Card>
    )
}

function ActivityCard({ ensaios }) {
    const items = ensaios || []
    const [dismissedKeys, setDismissedKeys] = useState(() => {
        try {
            const stored = window.localStorage.getItem(DISMISSED_ACTIVITIES_STORAGE_KEY)
            const parsed = stored ? JSON.parse(stored) : []

            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    })
    const visibleItems = useMemo(
        () => items.filter((ensaio) => !dismissedKeys.includes(getActivityDismissKey(ensaio))),
        [items, dismissedKeys]
    )

    function updateDismissedKeys(nextKeys) {
        setDismissedKeys(nextKeys)

        try {
            window.localStorage.setItem(DISMISSED_ACTIVITIES_STORAGE_KEY, JSON.stringify(nextKeys))
        } catch {
            // Ignora falhas de armazenamento local; a limpeza ainda funciona na sessão atual.
        }
    }

    function dismissActivity(ensaio) {
        const key = getActivityDismissKey(ensaio)
        updateDismissedKeys([...new Set([...dismissedKeys, key])])
    }

    function clearVisibleActivities() {
        const nextKeys = [
            ...dismissedKeys,
            ...visibleItems.map(getActivityDismissKey),
        ]

        updateDismissedKeys([...new Set(nextKeys)])
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-[17px] font-semibold uppercase tracking-[0.015em] text-[#2a231f]">
                    Atividades Recentes 
                </h2>

                {visibleItems.length > 0 && (
                    <button
                        type="button"
                        onClick={clearVisibleActivities}
                        className="rounded-md px-1.5 py-1 text-xs font-medium text-[#a66f29] transition hover:bg-[#f7efe5] hover:text-[#7d5527]"
                    >
                        Limpar
                    </button>
                )}
            </div>

            <div className="mt-5 max-h-[392px] overflow-y-auto pr-2">
                <div className="divide-y divide-[#eadfd4]">
                {visibleItems.length ? visibleItems.map((ensaio) => {
                    const activity = getActivityConfig(ensaio)
                    const Icon = activity.icon

                    return (
                        <div key={getActivityDismissKey(ensaio)} className="flex min-h-[64px] items-center gap-2 rounded-[10px] py-1">
                            <Link
                                to={`/ensaios/${ensaio.id}`}
                                className="flex min-w-0 flex-1 items-center gap-4 rounded-[10px] px-2 py-3 transition hover:bg-[#fbf5ed]"
                            >
                                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${activity.tone}`}>
                                    <Icon size={20} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <strong className="block truncate text-sm font-medium text-[#1f1a15]">{activity.title}</strong>
                                    <span className="mt-1 block truncate text-xs text-[#756a61]">{activity.detail}</span>
                                </span>
                                <span className="shrink-0 text-xs text-[#756a61]">
                                    {formatarTempoRelativo(ensaio.atualizadoEm || ensaio.dataEnsaio)}
                                </span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => dismissActivity(ensaio)}
                                title="Ocultar atividade"
                                aria-label="Ocultar atividade"
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#a89a8d] transition hover:bg-[#f7efe5] hover:text-[#a66f29]"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )
                }) : (
                    <div className="py-10 text-center text-sm text-[#756a61]">
                        Nenhuma atividade recente.
                    </div>
                )}
                </div>
            </div>
        </Card>
    )
}

function DashboardSkeleton() {
    return (
        <div className="mx-auto max-w-[1480px] animate-pulse">
            <div className="h-3 w-64 rounded-full bg-[#eadfd4]" />
            <div className="mt-5 h-14 w-96 max-w-full rounded-full bg-[#eadfd4]" />
            <div className="mt-4 h-5 w-80 max-w-full rounded-full bg-[#eadfd4]" />
            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <div className="h-64 rounded-[14px] bg-white/78" />
                <div className="h-64 rounded-[14px] bg-white/78" />
            </div>
            <div className="mt-6 h-36 rounded-[14px] bg-white/78" />
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_470px]">
                <div className="h-96 rounded-[14px] bg-white/78" />
                <div className="h-96 rounded-[14px] bg-white/78" />
            </div>
        </div>
    )
}
