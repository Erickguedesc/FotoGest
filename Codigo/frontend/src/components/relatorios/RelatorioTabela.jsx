import { Wallet } from 'lucide-react'
import { formatDateBR, formatMoney } from '../../utils/relatoriosUtils'

export default function RelatorioTabela({ periodos = [] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#111111] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-light text-white">
            Detalhamento
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Valores separados por periodo.
          </p>
        </div>

        <Wallet className="text-[var(--gold)]" size={22} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-white/10 text-left text-[10px] uppercase tracking-[0.1em] text-white/40">
              <th className="w-[10%] py-3 pr-3">Periodo</th>
              <th className="w-[16%] py-3 pr-3">Intervalo</th>
              <th className="w-[12%] py-3 pr-3">Pacotes</th>
              <th className="w-[14%] py-3 pr-3">Extras</th>
              <th className="w-[11%] py-3 pr-3">Ajustes</th>
              <th className="w-[13%] py-3 pr-3">Previsto</th>
              <th className="w-[13%] py-3 pr-3">Recebido</th>
              <th className="w-[5.5%] py-3 pr-3">Ens.</th>
              <th className="w-[5.5%] py-3 pr-3">Clientes</th>
            </tr>
          </thead>

          <tbody>
            {periodos.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="py-8 text-center text-sm text-white/40"
                >
                  Nenhum dado encontrado para exibir na tabela.
                </td>
              </tr>
            ) : (
              periodos.map((item) => (
                <tr
                  key={`${item.label}-${item.inicio}-${item.fim}`}
                  className="border-b border-white/5 text-sm text-white/70"
                >
                  <td className="py-4 pr-3 text-white">{item.label}</td>
                  <td className="py-4 pr-3 text-white/55">
                    <span className="block">{formatDateBR(item.inicio)}</span>
                    <span className="block">{formatDateBR(item.fim)}</span>
                  </td>
                  <td className="py-4 pr-3">
                    {formatMoney(item.faturamento)}
                  </td>
                  <td className="py-4 pr-3">
                    <span className="block">{formatMoney(item.excedentesCobrados)}</span>
                    <span className="block text-[11px] text-white/35">
                      {item.fotosExtrasVendidas || 0} foto{item.fotosExtrasVendidas === 1 ? '' : 's'}
                    </span>
                  </td>
                  <td className="py-4 pr-3">
                    {formatMoney(item.ajustesManuais)}
                  </td>
                  <td className="py-4 pr-3 font-medium text-[var(--gold)]">
                    {formatMoney(item.totalLiquido)}
                  </td>
                  <td className="py-4 pr-3 text-green-300">
                    {formatMoney(item.valorRecebido)}
                  </td>
                  <td className="py-4 pr-3">
                    {item.quantidadeEnsaios || 0}
                  </td>
                  <td className="py-4 pr-3">
                    {item.clientesNovos || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
