import SectionTitle from './SectionTitle'

export default function AcoesGerais({
  onWhatsApp,
  onCopyLink,
  onExportPdf,
  onDelete,
}) {
  return (
    <section className="rounded-2xl border border-[var(--gold-border)] bg-[#121212]">
      <SectionTitle title="Ações gerais" />

      <div className="space-y-3 p-5">
        <ActionButton
          title="Enviar link pelo WhatsApp"
          description="Compartilhar álbum com a cliente"
          onClick={onWhatsApp}
        />

        <ActionButton
          title="Copiar link do álbum"
          description="Para compartilhar em outro canal"
          onClick={onCopyLink}
        />

        <ActionButton
          title="Exportar PDF do ensaio"
          description="Resumo com todas informações"
          onClick={onExportPdf}
        />

        <ActionButton
          danger
          title="Excluir ensaio"
          description="Ação irreversível"
          onClick={onDelete}
        />
      </div>
    </section>
  )
}

function ActionButton({ title, description, danger, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
        danger
          ? 'border-red-400/30 bg-red-400/5 text-red-300 hover:bg-red-400/10'
          : 'border-[var(--gold-border)] text-white/70 hover:bg-[var(--gold-dim)] hover:text-[var(--gold)]'
      }`}
    >
      <span>
        <span className="block text-[13px]">{title}</span>
        <span className="mt-0.5 block text-[11px] opacity-55">
          {description}
        </span>
      </span>

      <span className="text-white/30">›</span>
    </button>
  )
}