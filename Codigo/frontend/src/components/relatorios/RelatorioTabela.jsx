import { useRef } from 'react'
import { ChevronDown, ChevronUp, Wallet } from 'lucide-react'
import { formatDateBR, formatMoney } from '../../utils/relatoriosUtils'

export default function RelatorioTabela({ periodos = [] }) {
  const scrollRef = useRef(null)
  const mostrarControlesRolagem = periodos.length > 6

  const scrollMeses = (direcao) => {
    scrollRef.current?.scrollBy({
      behavior: 'smooth',
      top: direcao * 420,
    })
  }

  return (
    <section className="rounded-[18px] border border-[#e7ded3] bg-white p-5 shadow-[0_16px_46px_rgba(82,58,35,0.06)] md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-light leading-tight text-[#211b17]">
            Detalhamento
          </h2>

          <p className="mt-1 text-sm text-[#756a61]">
            Valores separados por período.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {mostrarControlesRolagem ? (
            <div className="flex rounded-full border border-[#e6ddd2] bg-[#fbfaf8] p-1">
              <button
                type="button"
                aria-label="Rolar meses para cima"
                onClick={() => scrollMeses(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#7a6d62] transition hover:bg-white hover:text-[#bd7920] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bd7920]"
              >
                <ChevronUp size={16} />
              </button>

              <button
                type="button"
                aria-label="Rolar meses para baixo"
                onClick={() => scrollMeses(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#7a6d62] transition hover:bg-white hover:text-[#bd7920] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bd7920]"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          ) : null}

          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f0d7ad] bg-[#fff4df] text-[#bd7920]">
            <Wallet size={18} />
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="theme-scrollbar max-h-[470px] overflow-auto"
      >
        <table className="w-full min-w-[980px] border-collapse text-[12px]">
          <thead className="sticky top-0 z-10">
            <tr className="border-y border-[#ece4da] bg-[#fbfaf8] text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[#81756a]">
              <th className="py-3 pl-4 pr-3">Período</th>
              <th className="py-3 pr-3">Intervalo</th>
              <th className="py-3 pr-3 text-right">Pacotes</th>
              <th className="py-3 pr-3 text-right">Extras</th>
              <th className="py-3 pr-3 text-right">Ajustes</th>
              <th className="py-3 pr-3 text-right">Previsto</th>
              <th className="py-3 pr-3 text-right">Recebido</th>
              <th className="py-3 pr-3 text-right">Ens.</th>
              <th className="py-3 pr-4 text-right">Clientes</th>
            </tr>
          </thead>

          <tbody>
            {periodos.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="py-10 text-center text-sm text-[#756a61]"
                >
                  Nenhum dado encontrado para exibir na tabela.
                </td>
              </tr>
            ) : (
              periodos.map((item) => (
                <tr
                  key={`${item.label}-${item.inicio}-${item.fim}`}
                  className="border-b border-[#eee7df] text-sm text-[#4c423a] transition hover:bg-[#fbfaf8]"
                >
                  <td className="py-3.5 pl-4 pr-3 font-semibold text-[#2b2520]">
                    {item.label}
                  </td>
                  <td className="py-3.5 pr-3 text-[#756a61]">
                    <span className="block">{formatDateBR(item.inicio)}</span>
                    <span className="block">{formatDateBR(item.fim)}</span>
                  </td>
                  <td className="py-3.5 pr-3 text-right">
                    {formatMoney(item.faturamento)}
                  </td>
                  <td className="py-3.5 pr-3 text-right">
                    <span className="block">{formatMoney(item.excedentesCobrados)}</span>
                    <span className="block text-[11px] text-[#9b9187]">
                      {item.fotosExtrasVendidas || 0} foto{item.fotosExtrasVendidas === 1 ? '' : 's'}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 text-right">
                    {formatMoney(item.ajustesManuais)}
                  </td>
                  <td className="py-3.5 pr-3 text-right font-semibold text-[#a96718]">
                    {formatMoney(item.totalLiquido)}
                  </td>
                  <td className="py-3.5 pr-3 text-right font-semibold text-green-700">
                    {formatMoney(item.valorRecebido)}
                  </td>
                  <td className="py-3.5 pr-3 text-right">
                    {item.quantidadeEnsaios || 0}
                  </td>
                  <td className="py-3.5 pr-4 text-right">
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
