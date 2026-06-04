import { useEffect, useState } from 'react'

import Icon from './Icon'
import { TIPO_OPTIONS } from './ensaioHelpers'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function isValidDateFilter(value) {
  if (!value) return true
  if (!DATE_PATTERN.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  if (year < 1900 || year > 2100) return false

  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export default function EnsaiosToolbar({
  filters,
  resetKey = 0,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onClear,
}) {
  const [dateDrafts, setDateDrafts] = useState({
    dataInicio: filters.dataInicio || '',
    dataFim: filters.dataFim || '',
  })

  useEffect(() => {
    setDateDrafts({
      dataInicio: filters.dataInicio || '',
      dataFim: filters.dataFim || '',
    })
  }, [filters.dataInicio, filters.dataFim, resetKey])

  const handleDateChange = (field, value) => {
    setDateDrafts((current) => ({
      ...current,
      [field]: value,
    }))

    if (value === '' || isValidDateFilter(value)) {
      onFilterChange(field, value)
    }
  }

  const handleDateBlur = (field) => {
    const value = dateDrafts[field]

    if (value === '') {
      if (filters[field]) onFilterChange(field, '')
      return
    }

    if (isValidDateFilter(value)) {
      if (value !== filters[field]) onFilterChange(field, value)
      return
    }

    setDateDrafts((current) => ({
      ...current,
      [field]: filters[field] || '',
    }))
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1 max-w-[360px]">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35">
          <Icon name="search" size={15} />
        </span>
        <input
          value={filters.clienteNome}
          onChange={(event) => onFilterChange('clienteNome', event.target.value)}
          className="w-full rounded-lg border border-white/[0.10] bg-[#181818] py-2.5 pl-10 pr-3.5 text-[13px] font-light text-white outline-none transition placeholder:text-white/25 focus:border-[var(--gold-border)] focus:bg-[rgba(201,164,89,0.04)]"
          placeholder="Buscar cliente..."
        />
      </div>

      <select
        value={filters.tipo}
        onChange={(event) => onFilterChange('tipo', event.target.value)}
        className="rounded-lg border border-white/[0.10] bg-[#181818] px-3.5 py-2.5 text-[12px] text-white/70 outline-none transition focus:border-[var(--gold-border)]"
      >
        <option value="">Todos os tipos</option>
        {TIPO_OPTIONS.map((tipo) => <option key={tipo.value} value={tipo.value}>{tipo.label}</option>)}
      </select>

      <div className="flex items-center gap-2 rounded-lg border border-white/[0.10] bg-[#181818] px-3 py-2 text-white/55">
        <Icon name="calendar" size={13} />
        <input
          type="date"
          min="1900-01-01"
          max="2100-12-31"
          value={dateDrafts.dataInicio}
          onChange={(event) => handleDateChange('dataInicio', event.target.value)}
          onBlur={() => handleDateBlur('dataInicio')}
          className="w-[120px] bg-transparent text-[12px] text-white/70 outline-none"
          title="Data inicial"
        />
        <span className="text-white/25">—</span>
        <input
          type="date"
          min="1900-01-01"
          max="2100-12-31"
          value={dateDrafts.dataFim}
          onChange={(event) => handleDateChange('dataFim', event.target.value)}
          onBlur={() => handleDateBlur('dataFim')}
          className="w-[120px] bg-transparent text-[12px] text-white/70 outline-none"
          title="Data final"
        />
      </div>

      <button
        type="button"
        onClick={onClear}
        className="rounded-lg border border-white/[0.10] bg-[#181818] px-3.5 py-2.5 text-[12px] tracking-[0.06em] text-white/55 transition hover:border-[var(--gold-border)] hover:text-white"
      >
        Limpar
      </button>

      <div className="ml-auto flex gap-1 rounded-xl border border-white/[0.12] bg-[#181818] p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.24)] max-sm:w-full">
        <button
          type="button"
          onClick={() => onViewModeChange('table')}
          className={`flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-[11px] font-medium uppercase tracking-[0.1em] transition max-sm:flex-1 ${viewMode === 'table' ? 'border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]' : 'border border-transparent text-white/45 hover:bg-white/[0.04] hover:text-white/75'}`}
          title="Tabela"
        >
          <Icon name="table" size={14} />
          <span>Tabela</span>
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('grid')}
          className={`flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-[11px] font-medium uppercase tracking-[0.1em] transition max-sm:flex-1 ${viewMode === 'grid' ? 'border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]' : 'border border-transparent text-white/45 hover:bg-white/[0.04] hover:text-white/75'}`}
          title="Cards"
        >
          <Icon name="grid" size={14} />
          <span>Cards</span>
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('calendar')}
          className={`flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-[11px] font-medium uppercase tracking-[0.1em] transition max-sm:flex-1 ${viewMode === 'calendar' ? 'border border-[var(--gold-border)] bg-[var(--gold-dim)] text-[var(--gold)]' : 'border border-transparent text-white/45 hover:bg-white/[0.04] hover:text-white/75'}`}
          title="Calendário"
        >
          <Icon name="calendar" size={14} />
          <span>Calendário</span>
        </button>
      </div>
    </div>
  )
}
