import {
  getStatusInfo,
  getTipoLabel,
} from '../listaEnsaios/ensaioHelpers'

function formatarDataHora(valor) {
  if (!valor) return 'Data não informada'

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) return 'Data não informada'

  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }) + ', ' + data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="theme-muted">
      <path d="M8 2V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 2V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9H21" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="theme-muted">
      <path
        d="M12 21C12 21 18 15.6 18 10.2C18 6.78 15.31 4 12 4C8.69 4 6 6.78 6 10.2C6 15.6 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="theme-text">
      <path d="M12 20H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M16.5 3.5C17.3284 2.67157 18.6716 2.67157 19.5 3.5C20.3284 4.32843 20.3284 5.67157 19.5 6.5L8 18L3 19L4 14L16.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="theme-text">
      <path
        d="M19 12H5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 19L5 12L12 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="theme-text">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 13H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 17H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default function EnsaioHero({
  ensaio,
  fotos = [],
  onEdit,
  onPreContrato,
  onBack,
}) {
  const statusInfo = getStatusInfo(ensaio?.status)

  const fotoCapa =
    fotos.find((foto) => foto.ehCapa)?.urlWatermark ||
    fotos.find((foto) => foto.ehCapa)?.urlOriginal ||
    fotos[0]?.urlWatermark ||
    fotos[0]?.urlOriginal ||
    null

  return (
    <section className="theme-card overflow-hidden rounded-[24px] border border-[var(--gold-border)]">
      <div className="grid min-h-[300px] grid-cols-[260px_1fr] max-lg:grid-cols-1">
        <div className="theme-panel relative h-full min-h-[300px] max-lg:min-h-[240px]">
          {fotoCapa ? (
            <img
              src={fotoCapa}
              alt={`Capa do ensaio de ${ensaio?.clienteNome || 'cliente'}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(201,164,89,0.10),_transparent_58%),linear-gradient(180deg,#1a1a1a_0%,#101010_100%)]">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[20px] text-[var(--gold)]">
                  📷
                </div>
                <p className="theme-muted text-[12px] uppercase tracking-[0.16em]">
                  Sem capa
                </p>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10 max-lg:bg-gradient-to-t" />
        </div>

        <div className="flex items-center">
          <div className="w-full px-10 py-9 max-md:px-6 max-md:py-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="theme-text text-[11px] font-medium uppercase tracking-[0.24em]">
                {getTipoLabel(ensaio?.tipo)}
              </span>

              <span
                className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.12em] ${statusInfo.chipClass}`}
              >
                {statusInfo.label}
              </span>
            </div>

            <h1 className="theme-title mt-6 font-serif text-[56px] font-light leading-[1.05] tracking-[0.01em] max-lg:text-[44px] max-md:text-[34px]">
              {ensaio?.clienteNome || 'Cliente sem nome'}
            </h1>

            <div className="theme-text mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-[14px]">
              <span className="inline-flex items-center gap-2.5">
                <CalendarIcon />
                {formatarDataHora(ensaio?.dataEnsaio)}
              </span>

              <span className="inline-flex items-center gap-2.5">
                <LocationIcon />
                {ensaio?.local || 'Local não informado'}
              </span>
            </div>

           <div className="mt-7 flex flex-wrap gap-3">
  <button
    type="button"
    onClick={onPreContrato}
    className="inline-flex items-center gap-2 rounded-[12px] border border-[var(--border)] bg-transparent px-5 py-3 text-[13px] font-medium tracking-[0.06em] text-[var(--text)] transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--text)]"
  >
    <FileIcon />
    Pré-contrato
  </button>

  <button
    type="button"
    onClick={onEdit}
    className="inline-flex items-center gap-2 rounded-[12px] border border-[var(--border)] bg-transparent px-5 py-3 text-[13px] font-medium tracking-[0.06em] text-[var(--text)] transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--text)]"
  >
    <EditIcon />
    Editar
  </button>

  <button
    type="button"
    onClick={onBack}
    className="inline-flex items-center gap-2 rounded-[12px] border border-[var(--border)] bg-transparent px-5 py-3 text-[13px] font-medium tracking-[0.06em] text-[var(--text-muted)] transition hover:border-[var(--gold-border)] hover:bg-[var(--gold-dim)] hover:text-[var(--text)]"
  >
    <BackIcon />
    Voltar
  </button>
</div>
          </div>
        </div>
      </div>
    </section>
  )
}
