import {
    CalendarDays,
    CheckCircle2,
    Image,
    Wallet,
} from 'lucide-react'

import StatCard from './StatCard'
import { formatarMoeda } from '../../utils/dashboardFormatters'

export default function DashboardStats({ dashboard }) {
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
                titulo="Ensaios este mês"
                valor={dashboard?.ensaiosEsteMes || 0}
                descricao="ensaios agendados"
                icon={CalendarDays}
            />

            <StatCard
                titulo="Seleções enviadas"
                valor={dashboard?.selecoesEnviadas || 0}
                descricao="clientes aguardando Edição"
                icon={CheckCircle2}
            />

            <StatCard
                titulo="Sem fotos enviadas"
                valor={dashboard?.ensaiosSemFotosEnviadas || 0}
                descricao="upload pendente"
                icon={Image}
            />

            <StatCard
                titulo="Valor previsto"
                valor={formatarMoeda(dashboard?.receitaEstimada || 0)}
                descricao="referência do mês"
                icon={Wallet}
                destaque
            />
        </section>
    )
}
