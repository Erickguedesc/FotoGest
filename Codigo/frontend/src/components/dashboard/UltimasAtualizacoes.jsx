import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Clock3, X } from 'lucide-react'

import {
    formatarStatusEnsaio,
    formatarTempoRelativo,
} from '../../utils/dashboardFormatters'

const STORAGE_KEY = 'fotogest.dashboard.atualizacoesOcultas'

function getUpdateKey(ensaio) {
    return `${ensaio.id}:${ensaio.atualizadoEm || ensaio.dataEnsaio || ''}`
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
        <section className="space-y-5">
            <div className="theme-divider flex items-center justify-between gap-4 border-b pb-4">
                <h2 className="theme-muted text-xs uppercase tracking-[0.25em]">
                    Últimas atualizações
                </h2>

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

            <div className="theme-card overflow-hidden rounded-3xl border">
                <div
                    className="theme-scrollbar divide-y divide-[var(--border)] overflow-y-auto"
                    style={{ maxHeight: '388px' }}
                >
                    {ensaiosVisiveis.map((ensaio) => (
                        <Link
                            key={ensaio.id}
                            to={`/ensaios/${ensaio.id}`}
                            className="group flex h-24 items-center justify-between gap-4 px-5 transition hover:bg-[var(--card-hover)]"
                        >
                            <div className="min-w-0">
                                <h3 className="theme-title truncate text-base font-medium">
                                    {ensaio.clienteNome}
                                </h3>

                                <div className="theme-muted mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                    <span>{formatarStatusEnsaio(ensaio.status)}</span>

                                    <span className="inline-flex items-center gap-1">
                                        <Clock3 size={12} />
                                        {formatarTempoRelativo(ensaio.atualizadoEm || ensaio.dataEnsaio)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-shrink-0 items-center gap-2">
                                <button
                                    type="button"
                                    title="Ocultar atualização"
                                    aria-label={`Ocultar atualização de ${ensaio.clienteNome}`}
                                    onClick={(event) => ocultarAtualizacao(event, ensaio)}
                                    className="theme-muted flex h-8 w-8 items-center justify-center rounded-full border border-transparent opacity-45 transition hover:border-[var(--border)] hover:bg-[var(--card-hover)] hover:opacity-100"
                                >
                                    <X size={14} />
                                </button>

                                <ArrowRight
                                    size={16}
                                    className="theme-muted transition group-hover:translate-x-1 group-hover:text-[var(--gold)]"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
