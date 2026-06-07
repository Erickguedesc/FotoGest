import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Grid2X2, List } from 'lucide-react'

import EnsaioDashboardCard from './EnsaioDashboardCard'
import {
    formatarDataCurta,
    formatarStatusEnsaio,
} from '../../utils/dashboardFormatters'

const CARD_MAX_HEIGHT = 620
const LIST_MAX_HEIGHT = 438

export default function EnsaiosEmAndamento({
    ensaios,
}) {
    const [viewMode, setViewMode] = useState('cards')

    if (!ensaios?.length) {
        return (
            <section className="space-y-5">
                <SectionHeader viewMode={viewMode} onViewModeChange={setViewMode} />

                <div className="theme-card rounded-3xl border border-dashed py-14 text-center">
                    <h3 className="theme-title text-lg font-medium">
                        Nenhum ensaio em andamento
                    </h3>

                    <p className="theme-muted mt-2 text-sm">
                        Os ensaios ativos aparecerão aqui.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="space-y-5">
            <SectionHeader viewMode={viewMode} onViewModeChange={setViewMode} />

            {viewMode === 'cards' ? (
                <div
                    className="theme-scrollbar overflow-y-auto pr-1"
                    style={{ maxHeight: `${CARD_MAX_HEIGHT}px` }}
                >
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                        {ensaios.map((ensaio) => (
                            <EnsaioDashboardCard
                                key={ensaio.id}
                                ensaio={ensaio}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="theme-card overflow-hidden rounded-3xl border">
                    <div
                        className="theme-scrollbar divide-y divide-[var(--border)] overflow-y-auto"
                        style={{ maxHeight: `${LIST_MAX_HEIGHT}px` }}
                    >
                        {ensaios.map((ensaio) => (
                            <EnsaioRow key={ensaio.id} ensaio={ensaio} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}

function SectionHeader({ viewMode, onViewModeChange }) {
    return (
        <div className="theme-divider flex items-center justify-between gap-4 border-b pb-4">
            <h2 className="theme-muted text-xs uppercase tracking-[0.25em]">
                Ensaios em andamento
            </h2>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    title="Ver em cards"
                    aria-label="Ver ensaios em andamento em cards"
                    onClick={() => onViewModeChange('cards')}
                    className={`theme-icon-button flex h-9 w-9 items-center justify-center rounded-full border transition ${
                        viewMode === 'cards' ? 'border-[var(--gold-border)] text-[var(--gold)]' : ''
                    }`}
                >
                    <Grid2X2 size={16} />
                </button>

                <button
                    type="button"
                    title="Ver em lista"
                    aria-label="Ver ensaios em andamento em lista"
                    onClick={() => onViewModeChange('list')}
                    className={`theme-icon-button flex h-9 w-9 items-center justify-center rounded-full border transition ${
                        viewMode === 'list' ? 'border-[var(--gold-border)] text-[var(--gold)]' : ''
                    }`}
                >
                    <List size={17} />
                </button>
            </div>
        </div>
    )
}

function EnsaioRow({ ensaio }) {
    return (
        <Link
            to={`/ensaios/${ensaio.id}`}
            className="group grid min-h-[73px] grid-cols-[minmax(0,1fr)_120px_72px_24px] items-center gap-4 px-5 py-3 transition hover:bg-[var(--card-hover)] max-md:grid-cols-[minmax(0,1fr)_24px]"
        >
            <div className="min-w-0">
                <h3 className="theme-title truncate text-base font-medium">
                    {ensaio.clienteNome}
                </h3>

                <p className="theme-muted mt-1 truncate text-xs">
                    {(ensaio.tipoExibicao || ensaio.tipo) ?? 'Não informado'} · {formatarDataCurta(ensaio.dataEnsaio)}
                </p>
            </div>

            <span className="theme-muted text-sm max-md:hidden">
                {formatarStatusEnsaio(ensaio.status)}
            </span>

            <div className="max-md:hidden">
                <div className="theme-muted mb-1 text-right text-xs">
                    {ensaio.progresso || 0}%
                </div>

                <div className="theme-soft h-1.5 overflow-hidden rounded-full">
                    <div
                        className="h-full rounded-full bg-[var(--gold)]"
                        style={{ width: `${ensaio.progresso || 0}%` }}
                    />
                </div>
            </div>

            <ArrowRight
                size={16}
                className="theme-muted justify-self-end transition group-hover:translate-x-1 group-hover:text-[var(--gold)]"
            />
        </Link>
    )
}
