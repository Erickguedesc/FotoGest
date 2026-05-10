import SolicitacaoRow from './SolicitacaoRow'

export default function SolicitacoesTable({
  solicitacoes,
  onWhatsApp,
  onStatusChange,
  // onPreContrato,
  onDelete,
  actionId
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1C1C1E] shadow-[0_4px_20px_rgba(0,0,0,0.20)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="px-5 py-5 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--gold)]">
                Data
              </th>

              <th className="px-5 py-5 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--gold)]">
                Cliente
              </th>

              <th className="px-5 py-5 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--gold)]">
                Tipo de Ensaio
              </th>

              <th className="px-5 py-5 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--gold)]">
                Status do Lead
              </th>

              <th className="px-5 py-5 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--gold)]">
                Ações Administrativas
              </th>
            </tr>
          </thead>

          <tbody>
            {solicitacoes.map((solicitacao) => (
              <SolicitacaoRow
                key={solicitacao.id}
                solicitacao={solicitacao}
                onWhatsApp={onWhatsApp}
                onStatusChange={onStatusChange}
               // onPreContrato={onPreContrato}
                onDelete={onDelete}
                loading={actionId === solicitacao.id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}