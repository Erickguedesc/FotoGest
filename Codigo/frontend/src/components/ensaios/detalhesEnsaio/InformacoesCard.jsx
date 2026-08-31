import { ClipboardList } from 'lucide-react'

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
    <section className="rounded-[14px] border border-[var(--border)] bg-white/78 shadow-[0_14px_34px_rgba(78,56,35,0.07)]">
      <SectionTitle
        title="Dados do ensaio"
        icon={ClipboardList}
        actionLabel="Editar"
        onAction={onEdit}
      />

      <div className="grid grid-cols-[minmax(320px,1fr)_minmax(380px,440px)] items-start gap-8 p-7 max-xl:grid-cols-1 max-md:p-5">
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 max-md:grid-cols-1">
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
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.76),rgba(247,239,229,0.72))] p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--gold)]">
                Resumo de valores
              </p>
              <p className="mt-1 text-[12px] text-[var(--text-muted)]">
                Controle interno, sem cobrança online.
              </p>
            </div>

            <span className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1.5 text-[11px] text-[var(--text-muted)]">
              {statusValores}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <p className="mt-3 text-[12px] leading-5 text-[var(--text-muted)]">
            Valor final pode ser informado manualmente via botão editar caso o valor final tenha sido outro após acordos fora da plataforma. O total previsto permanece como referencia automatica.
          </p>

          {ensaio?.observacaoValores ? (
            <div className="mt-4 rounded-lg border border-[var(--border)] bg-white/55 p-3">
              <p className="mb-1 text-[11px] text-[var(--text-muted)]">
                Observação de valores
              </p>
              <p className="text-[13px] leading-6 text-[var(--text)]">
                {ensaio.observacaoValores}
              </p>
            </div>
          ) : null}
        </div>

        <div className="col-span-2 border-t border-[var(--border)] pt-5 max-xl:col-span-1">
          <p className="mb-2 text-[11px] text-[var(--text-muted)]">
            Observações
          </p>

          <p className="text-[13px] leading-6 text-[var(--text)]">
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
    <div className="min-w-0 rounded-[8px] border border-[var(--border)] bg-white/62 px-3.5 py-3">
      <p className={`whitespace-nowrap text-[15px] ${highlight ? 'text-[var(--gold)]' : 'text-[var(--text)]'}`}>
        {value}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-normal text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  )
}
