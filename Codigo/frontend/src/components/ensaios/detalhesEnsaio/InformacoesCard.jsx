import {
  formatCurrency,
  getTipoLabel,
} from '../listaEnsaios/ensaioHelpers'

import SectionTitle from './SectionTitle'
import InfoItem from './InfoItem'

const getSafeValue = (value, fallback = '—') => {
  if (value === null || value === undefined || value === '') return fallback
  return value
}

export default function InformacoesCard({ ensaio, onEdit }) {
  const fotosIncluidas =
    ensaio?.fotosIncluidas ??
    ensaio?.quantidadeFotos ??
    ensaio?.qtdFotos ??
    ensaio?.qtdFotosPacote ??
    0

  const valorFotoExtra =
    ensaio?.valorFotoExtra ??
    ensaio?.valorPorFotoExtra ??
    0

  return (
    <section className="rounded-2xl border border-[var(--gold-border)] bg-[#121212]">
      <SectionTitle
        title="Informações adicionais"
        actionLabel="Editar"
        onAction={onEdit}
      />

      <div className="grid grid-cols-2 gap-x-12 gap-y-5 p-6 max-md:grid-cols-1">
        <InfoItem label="Local" value={getSafeValue(ensaio.local)} />
        <InfoItem label="Tipo" value={getTipoLabel(ensaio.tipo)} />

        <InfoItem
          label="Fotos incluídas"
          value={`${fotosIncluidas} fotos`}
        />

        <InfoItem
          label="Valor por foto extra"
          value={formatCurrency(valorFotoExtra)}
        />

        <InfoItem
          label="Valor do pacote"
          value={formatCurrency(ensaio.valorPacote)}
          highlight
        />

        <InfoItem
          label="Pagamento"
          value={getSafeValue(
            ensaio.statusPagamento || ensaio.pagamento,
            'Não informado'
          )}
        />

        <div className="col-span-2 border-t border-[var(--gold-border)] pt-5 max-md:col-span-1">
          <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-white/35">
            Observações
          </p>

          <p className="text-[13px] leading-6 text-white/70">
            {getSafeValue(
              ensaio.observacoes,
              'Nenhuma observação cadastrada.'
            )}
          </p>
        </div>
      </div>
    </section>
  )
}