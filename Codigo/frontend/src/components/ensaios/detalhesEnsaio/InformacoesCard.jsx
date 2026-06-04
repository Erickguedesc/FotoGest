import {
  formatCurrency,
  getTipoExibicao,
} from '../listaEnsaios/ensaioHelpers'

import SectionTitle from './SectionTitle'
import InfoItem from './InfoItem'

const STATUS_VALORES_LABEL = {
  NAO_INFORMADO: 'Não informado',
  PENDENTE: 'Pendente',
  PAGO: 'Pago',
}

const getSafeValue = (value, fallback = '—') => {
  if (value === null || value === undefined || value === '') return fallback
  return value
}

export default function InformacoesCard({ ensaio, selecao, onEdit }) {
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

  const valorPacote = Number(ensaio?.valorPacote || 0)
  const valorExtras = Number(selecao?.valorExcedente || 0)
  const fotosExtras = Number(selecao?.excedente || 0)
  const valorPrevisto = valorPacote + valorExtras
  const valorFinalInformado =
    ensaio?.valorFinalEnsaio !== null &&
    ensaio?.valorFinalEnsaio !== undefined &&
    ensaio?.valorFinalEnsaio !== ''
  const valorConsiderado = valorFinalInformado
    ? Number(ensaio.valorFinalEnsaio)
    : valorPrevisto
  const statusValores =
    STATUS_VALORES_LABEL[ensaio?.statusValores] ||
    STATUS_VALORES_LABEL.NAO_INFORMADO

  return (
    <section className="rounded-2xl border border-[var(--gold-border)] bg-[#121212]">
      <SectionTitle
        title="Dados do ensaio"
        actionLabel="Editar"
        onAction={onEdit}
      />

      <div className="grid grid-cols-2 gap-x-12 gap-y-5 p-6 max-md:grid-cols-1">
        <InfoItem label="Local" value={getSafeValue(ensaio.local)} />
        <InfoItem label="Tipo" value={getTipoExibicao(ensaio)} />

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

        <div className="col-span-2 rounded-xl border border-[var(--gold-border)] bg-black/20 p-5 max-md:col-span-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold)]">
                Resumo de valores
              </p>
              <p className="mt-1 text-[12px] text-white/40">
                Controle interno, sem cobrança online.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/55">
              {statusValores}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <ValorItem label="Pacote" value={formatCurrency(valorPacote)} />
            <ValorItem
              label="Fotos extras"
              value={`${fotosExtras} · ${formatCurrency(valorExtras)}`}
            />
            <ValorItem
              label="Total previsto"
              value={formatCurrency(valorPrevisto)}
              highlight
            />
            <ValorItem
              label="Valor Final"
              value={formatCurrency(valorConsiderado)}
              highlight={valorFinalInformado}
            />
          </div>

          <p className="mt-3 text-[12px] leading-5 text-white/45">
            Valor final pode ser informado manualmente via botão editar caso o valor final tenha sido outro após acordos fora da plataforma. O total previsto permanece como referencia automatica.
          </p>

          {ensaio?.observacaoValores ? (
            <div className="mt-4 rounded-lg border border-white/[0.08] bg-[#141414] p-3">
              <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-white/35">
                Observação de valores
              </p>
              <p className="text-[13px] leading-6 text-white/65">
                {ensaio.observacaoValores}
              </p>
            </div>
          ) : null}
        </div>

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

function ValorItem({ label, value, highlight }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#121212] px-3 py-3">
      <p className={highlight ? 'text-[14px] text-[var(--gold)]' : 'text-[14px] text-white/80'}>
        {value}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
    </div>
  )
}