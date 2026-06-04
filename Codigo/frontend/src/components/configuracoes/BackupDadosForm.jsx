import { Clock, Download, ShieldCheck } from 'lucide-react'

function formatarDataBackup(valor) {
  if (!valor) return 'Nenhum backup gerado ainda'

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) return 'Data nao disponivel'

  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function BackupDadosForm({
  ultimoBackup,
  loading,
  onGerarBackup,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="theme-title font-serif text-2xl font-light">
          Backup de dados
        </h3>
        <p className="theme-muted mt-1 text-sm">
          Baixe um pacote com PDF para leitura e JSON tecnico para recuperacao futura.
        </p>
      </div>

      <section className="theme-panel rounded-2xl border p-5">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] px-3 py-1 text-[11px] font-medium text-[var(--gold)]">
              <ShieldCheck size={14} />
              Metadados do banco
            </div>

            <h4 className="theme-title mt-4 text-lg font-semibold">
              Clientes, ensaios, status, valores e referencias das fotos
            </h4>

            <p className="theme-muted mt-2 max-w-2xl text-sm leading-6">
              As fotos continuam armazenadas. Este backup guarda os dados do FotoGest:
              clientes, ensaios, albuns, selecoes, valores, observacoes, notas internas,
              modelos de contrato e configuracoes principais. O ZIP inclui um PDF legivel
              e um JSON tecnico.
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onGerarBackup}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={16} />
            {loading ? 'Gerando...' : 'Baixar backup completo'}
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--gold)]">
              <Clock size={17} />
            </span>

            <div>
              <p className="theme-muted text-[10px] uppercase tracking-[0.14em]">
                Ultimo backup
              </p>
              <p className="theme-title mt-1 text-sm font-medium">
                {formatarDataBackup(ultimoBackup)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--gold-border)] bg-[var(--gold-dim)] p-4">
        <p className="text-sm leading-6 text-[var(--text)]">
          Guarde o arquivo baixado em um local externo, como Google Drive, OneDrive ou HD externo.
          O PDF serve para conferencia caso o sistema perca todos os seus dados e o JSON tecnico serve para restauracao/importacao futura.
          Sempre que possivel, faca um novo backup.
        </p>
      </section>
    </div>
  )
}
