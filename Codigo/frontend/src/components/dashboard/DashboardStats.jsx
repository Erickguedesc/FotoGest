import {
    Activity,
    CalendarDays,
    CheckCircle2,
    Wallet,
} from 'lucide-react'

import StatCard from './StatCard'
import { formatarMoeda } from '../../utils/dashboardFormatters'

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

export default function DashboardStats({ dashboard }) {
    const receitaEstimada = Number(dashboard?.receitaEstimada || 0)
    const mesAtualParams = getMesAtualParams()

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
                titulo="Ensaios no mês"
                valor={dashboard?.ensaiosEsteMes || 0}
                descricao="agendados e realizados"
                icon={CalendarDays}
                to={`/ensaios?${mesAtualParams}`}
            />

            <StatCard
                titulo="Em andamento"
                valor={dashboard?.ensaiosEmAndamentoTotal || 0}
                descricao="realizados, seleção e edição"
                icon={Activity}
                to="/ensaios?grupo=ativos"
            />

            <StatCard
                titulo="Seleções recebidas"
                valor={dashboard?.selecoesEnviadas || 0}
                descricao="aguardando revisão"
                icon={CheckCircle2}
                to="/ensaios?status=EM_SELECAO"
            />

            <StatCard
                titulo="Valor previsto"
                valor={receitaEstimada > 0 ? formatarMoeda(receitaEstimada) : 'Sem previsão'}
                descricao={receitaEstimada > 0 ? 'pacotes e fotos extras do mês' : 'sem valores previstos no mês'}
                icon={Wallet}
                destaque={receitaEstimada > 0}
            />
        </section>
    )
}
