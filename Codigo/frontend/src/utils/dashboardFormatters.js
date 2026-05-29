export function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor || 0)
}

const STATUS_LABELS = {
    AGENDADO: 'Agendado',
    REALIZADO: 'Realizado',
    EM_SELECAO: 'Em seleção',
    EM_EDICAO: 'Em edição',
    FINALIZADO: 'Finalizado',
    CANCELADO: 'Cancelado',
}

export function formatarStatusEnsaio(status) {
    return STATUS_LABELS[status] || status || 'Sem status'
}

export function formatarDataCurta(valor) {
    if (!valor) return 'Sem data'

    const data = new Date(valor)

    if (Number.isNaN(data.getTime())) return 'Sem data'

    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
    })
}

export function formatarHora(valor) {
    if (!valor) return 'Horário não definido'

    const data = new Date(valor)

    if (Number.isNaN(data.getTime())) return 'Horário não definido'

    return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function formatarTempoRelativo(valor) {
    if (!valor) return 'Sem data'

    const data = new Date(valor)

    if (Number.isNaN(data.getTime())) return 'Sem data'

    const diffMs = Date.now() - data.getTime()
    const diffMinutos = Math.floor(diffMs / 60000)
    const diffHoras = Math.floor(diffMinutos / 60)
    const diffDias = Math.floor(diffHoras / 24)

    if (diffMinutos < 1) return 'Agora'
    if (diffMinutos < 60) return `Há ${diffMinutos} min`
    if (diffHoras < 24) return `Há ${diffHoras} h`
    if (diffDias === 1) return 'Ontem'
    if (diffDias < 7) return `Há ${diffDias} dias`

    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
    })
}
