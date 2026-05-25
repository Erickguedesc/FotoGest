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
            Valores separados por período.
          </p>
        </div>

        <Wallet className="text-[var(--gold)]" size={22} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.14em] text-white/40">
              <th className="py-3 pr-4">Período</th>
              <th className="py-3 pr-4">Início</th>
              <th className="py-3 pr-4">Fim</th>
              <th className="py-3 pr-4">Pacotes</th>
              <th className="py-3 pr-4">Extras</th>
              <th className="py-3 pr-4">Ajustes</th>
              <th className="py-3 pr-4">Total previsto</th>
              <th className="py-3 pr-4">Ensaios</th>
            </tr>
          </thead>

          <tbody>
            {periodos.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
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
                  <td className="py-4 pr-4 text-white">{item.label}</td>
                  <td className="py-4 pr-4">{formatDateBR(item.inicio)}</td>
                  <td className="py-4 pr-4">{formatDateBR(item.fim)}</td>
                  <td className="py-4 pr-4">
                    {formatMoney(item.faturamento)}
                  </td>
                  <td className="py-4 pr-4">
                    {formatMoney(item.excedentesCobrados)}
                  </td>
                  <td className="py-4 pr-4">
                    {formatMoney(item.ajustesManuais)}
                  </td>
                  <td className="py-4 pr-4 font-medium text-[var(--gold)]">
                    {formatMoney(item.totalLiquido)}
                  </td>
                  <td className="py-4 pr-4">
                    {item.quantidadeEnsaios || 0}
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
