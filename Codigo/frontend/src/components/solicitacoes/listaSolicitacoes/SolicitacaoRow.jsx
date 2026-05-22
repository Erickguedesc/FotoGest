import StatusBadge from './StatusBadge'
import SolicitacaoActions from './SolicitacaoActions'
import { formatDate, formatPhone, normalizeTipo } from './solicitacaoHelpers'

export default function SolicitacaoRow({
  solicitacao,
  onWhatsApp,
  onStatusChange,
 // onPreContrato,
  onDelete,
  loading
}) {
  return (
    <tr className="theme-divider border-b transition hover:bg-[var(--card-hover)] last:border-b-0">
      <td className="theme-muted px-5 py-5 align-middle text-[13px]">
        <div>{formatDate(solicitacao.recebidoEm)}</div>

        {solicitacao.dataDesejada && (
          <div className="theme-faint mt-1 text-[11px]">
            Desejada: {formatDate(solicitacao.dataDesejada)}
          </div>
        )}
      </td>

      <td className="px-5 py-5 align-middle">
        <div className="theme-title text-sm font-medium">
          {solicitacao.nomeCliente}
        </div>

        <div className="theme-muted mt-1 font-mono text-[11px]">
          {formatPhone(solicitacao.whatsapp)}
        </div>
      </td>

      <td className="theme-text px-5 py-5 align-middle text-[13px]">
        {normalizeTipo(solicitacao.tipoEnsaio)}
      </td>

      <td className="px-5 py-5 align-middle">
        <StatusBadge status={solicitacao.statusLead} />
      </td>

      <td className="px-5 py-5 align-middle">
        <SolicitacaoActions
          solicitacao={solicitacao}
          onWhatsApp={onWhatsApp}
          onStatusChange={onStatusChange}
         // onPreContrato={onPreContrato}
          onDelete={onDelete}
          loading={loading}
        />
      </td>
    </tr>
  )
}
