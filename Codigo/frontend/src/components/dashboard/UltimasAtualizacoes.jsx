import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import {
    CalendarCheck2,
    CheckCircle2,
    Clock3,
    Heart,
    Image,
    PencilLine,
    X,
} from 'lucide-react'

import {
    formatarTempoRelativo,
} from '../../utils/dashboardFormatters'

const STORAGE_KEY = 'fotolhar.dashboard.atualizacoesOcultas'

function getUpdateKey(ensaio) {
    return `${ensaio.id}:${ensaio.atualizadoEm || ensaio.dataEnsaio || ''}`
}

function getPrimeiroNome(nome = '') {
    return nome
        .trim()
        .split(' ')
        .filter(Boolean)[0] || 'Cliente'
}

function getActivityConfig(ensaio) {
    const cliente = getPrimeiroNome(ensaio?.clienteNome)
    const tipo = ensaio?.tipoExibicao || 'ensaio'
    const totalFotos = Number(ensaio?.totalFotos || 0)

    if (ensaio?.selecaoEnviada) {
        return {
            icon: Heart,
            title: `Seleção de fotos recebida`,
            detail: cliente,
            tone: 'rose',
        }
    }

    if (ensaio?.albumPublicado) {
        return {
            icon: Image,
            title: `Álbum de ${cliente} foi enviado`,
            detail: totalFotos > 0 ? `${totalFotos} fotos para seleção` : 'Link publicado para seleção',
            tone: 'gold',
        }
    }

    if (ensaio?.status === 'FINALIZADO') {
        return {
            icon: CheckCircle2,
            title: `Ensaio de ${cliente} foi finalizado`,
            detail: tipo,
            tone: 'emerald',
        }
    }

    if (ensaio?.status === 'EM_EDICAO') {
        return {
            icon: PencilLine,
            title: `Edição em andamento`,
            detail: `${cliente} - ${tipo}`,
            tone: 'blue',
        }
    }

    if (ensaio?.status === 'REALIZADO') {
        return {
            icon: CalendarCheck2,
            title: `Ensaio realizado`,
            detail: `${cliente} - aguardando seleção`,
            tone: 'green',
        }
    }

    if (ensaio?.status === 'EM_SELECAO') {
        return {
            icon: Image,
            title: `Galeria em seleção`,
            detail: `${cliente} está escolhendo as fotos`,
            tone: 'gold',
        }
    }

    return {
        icon: Clock3,
        title: `Ensaio de ${cliente} atualizado`,
        detail: tipo,
        tone: 'neutral',
    }
}

const toneClasses = {
    gold: 'border-[#C84F32]/20 bg-[#C84F32]/12 text-[#C84F32]',
    rose: 'border-[#bf5c68]/20 bg-[#bf5c68]/10 text-[#bf5c68]',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
    blue: 'border-sky-500/20 bg-sky-500/10 text-sky-500',
    green: 'border-lime-500/20 bg-lime-500/10 text-lime-600',
    neutral: 'border-[var(--border)] bg-[var(--card-hover)] text-[var(--gold)]',
}

export default function UltimasAtualizacoes({ ensaios }) {
    const [ocultas, setOcultas] = useState([])

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
            setOcultas(Array.isArray(saved) ? saved : [])
        } catch {
            setOcultas([])
        }
    }, [])

    const ensaiosVisiveis = useMemo(() => {
        return (ensaios || []).filter((ensaio) => !ocultas.includes(getUpdateKey(ensaio)))
    }, [ensaios, ocultas])

    function salvarOcultas(next) {
        setOcultas(next)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }

    function ocultarAtualizacao(event, ensaio) {
        event.preventDefault()
        event.stopPropagation()

        salvarOcultas([...new Set([...ocultas, getUpdateKey(ensaio)])])
    }

    function limparAtualizacoes() {
        const todas = (ensaios || []).map(getUpdateKey)
        salvarOcultas([...new Set([...ocultas, ...todas])])
    }

    if (!ensaiosVisiveis.length) {
        return null
    }

    return (
        <section className="theme-card overflow-hidden rounded-[18px] border">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]">
                        <Clock3 size={17} />
                    </span>

                    <h2 className="theme-title font-serif text-xl font-medium tracking-normal">
                        Atividades Recentes
                    </h2>
                </div>

                {ensaiosVisiveis.length > 1 && (
                    <button
                        type="button"
                        onClick={limparAtualizacoes}
                        className="theme-muted rounded-full border border-transparent px-3 py-1 text-xs transition hover:border-[var(--border)] hover:text-[var(--text)]"
                    >
                        Limpar
                    </button>
                )}
            </div>

            <div
                className="theme-scrollbar divide-y divide-[var(--border)] overflow-y-auto"
                style={{ maxHeight: '388px' }}
            >
                {ensaiosVisiveis.map((ensaio) => {
                    const activity = getActivityConfig(ensaio)
                    const Icon = activity.icon

                    return (
                        <Link
                            key={ensaio.id}
                            to={`/ensaios/${ensaio.id}`}
                            className="group flex min-h-[76px] items-center gap-4 px-5 py-4 transition hover:bg-[var(--card-hover)]"
                        >
                            <span
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${toneClasses[activity.tone] || toneClasses.neutral}`}
                            >
                                <Icon size={19} strokeWidth={1.9} />
                            </span>

                            <div className="min-w-0 flex-1">
                                <h3 className="theme-title truncate text-sm font-semibold">
                                    {activity.title}
                                </h3>

                                <p className="theme-muted mt-1 truncate text-xs font-medium">
                                    {activity.detail}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <span className="theme-muted whitespace-nowrap text-xs font-medium">
                                    {formatarTempoRelativo(ensaio.atualizadoEm || ensaio.dataEnsaio)}
                                </span>

                                <button
                                    type="button"
                                    title="Ocultar atualização"
                                    aria-label={`Ocultar atualização de ${ensaio.clienteNome}`}
                                    onClick={(event) => ocultarAtualizacao(event, ensaio)}
                                    className="theme-muted flex h-8 w-8 items-center justify-center rounded-full border border-transparent opacity-0 transition hover:border-[var(--border)] hover:bg-[var(--card-hover)] hover:opacity-100 group-hover:opacity-55"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
