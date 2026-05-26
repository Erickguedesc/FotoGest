export default function GalleryTabs({
  aba,
  onChangeAba,
  totalFotos,
  totalSelecionadas,
  limite,
  excedente,
}) {
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-[#ddd5c5] bg-[#f5f0e8]/90 px-4 backdrop-blur-xl md:px-8">
      <div className="flex">
        <button
          type="button"
          onClick={() => onChangeAba('galeria')}
          className={`flex items-center gap-2 border-b-2 px-4 py-4 text-xs uppercase tracking-[0.16em] transition md:px-6 ${
            aba === 'galeria'
              ? 'border-[#a8783a] text-[#a8783a]'
              : 'border-transparent text-[#998f83] hover:text-[#1a1610]'
          }`}
        >
          Galeria
          <span className="rounded-full border border-[#ddd5c5] bg-[#ede6d8] px-2 py-0.5 text-[11px] text-[#5c5248]">
            {totalFotos}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChangeAba('favoritas')}
          className={`flex items-center gap-2 border-b-2 px-4 py-4 text-xs uppercase tracking-[0.16em] transition md:px-6 ${
            aba === 'favoritas'
              ? 'border-[#a8783a] text-[#a8783a]'
              : 'border-transparent text-[#998f83] hover:text-[#1a1610]'
          }`}
        >
          Minhas favoritas
          <span className="rounded-full border border-[#ddd5c5] bg-[#ede6d8] px-2 py-0.5 text-[11px] text-[#5c5248]">
            {totalSelecionadas}
          </span>
        </button>
      </div>

      <div className="hidden text-xs uppercase tracking-[0.12em] text-[#998f83] md:block">
        {excedente > 0
          ? `+${excedente} excedente${excedente > 1 ? 's' : ''}`
          : `${totalSelecionadas} / ${limite} selecionadas`}
      </div>
    </nav>
  )
}
