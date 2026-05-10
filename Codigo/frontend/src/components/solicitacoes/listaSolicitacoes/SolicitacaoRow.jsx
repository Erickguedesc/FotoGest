import StatusBadge from './StatusBadge'
import SolicitacaoActions from './SolicitacaoActions'
import { formatDate, formatPhone, normalizeTipo } from './solicitacaoHelpers'

export default function SolicitacaoRow({ solicitacao, onWhatsApp, onStatusChange, onPreContrato, loading }) {
  return (
    <tr className="border-b border-white/10 transition hover:bg-white/[0.02] last:border-b-0">
      <td className="px-5 py-5 align-middle text-[13px] text-white/45">
        <div>{formatDate(solicitacao.recebidoEm)}</div>
        {solicitacao.dataDesejada && (
          <div className="mt-1 text-[11px] text-white/30">Desejada: {formatDate(solicitacao.dataDesejada)}</div>
        )}
      </td>

      <td className="px-5 py-5 align-middle">
        <div className="text-sm font-medium text-white">{solicitacao.nomeCliente}</div>
        <div className="mt-1 font-mono text-[11px] text-white/45">{formatPhone(solicitacao.whatsapp)}</div>
      </td>

      <td className="px-5 py-5 align-middle text-[13px] text-white/70">{normalizeTipo(solicitacao.tipoEnsaio)}</td>

      <td className="px-5 py-5 align-middle">
        <StatusBadge status={solicitacao.statusLead} />
      </td>

      <td className="px-5 py-5 align-middle">
        <SolicitacaoActions
          solicitacao={solicitacao}
          onWhatsApp={onWhatsApp}
          onStatusChange={onStatusChange}
          onPreContrato={onPreContrato}
          loading={loading}
        />
      </td>
    </tr>
  )
}
