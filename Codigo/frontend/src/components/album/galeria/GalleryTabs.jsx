export default function GalleryTabs({
  aba,
  onChangeAba,
  totalSelecionadas,
  limite,
  excedente,
}) {
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-[#E8E3DF] bg-[#F7F7F8]/90 px-4 backdrop-blur-xl md:px-8">
      <div className="flex">
        <button
          type="button"
          onClick={() => onChangeAba('galeria')}
          className={`flex items-center gap-2 border-b-2 px-4 py-4 text-xs uppercase tracking-[0.16em] transition md:px-6 ${
            aba === 'galeria'
              ? 'border-[#C84F32] text-[#C84F32]'
              : 'border-transparent text-[#96928E] hover:text-[#1F1F21]'
          }`}
        >
          Galeria
        </button>

        <button
          type="button"
          onClick={() => onChangeAba('favoritas')}
          className={`flex items-center gap-2 border-b-2 px-4 py-4 text-xs uppercase tracking-[0.16em] transition md:px-6 ${
            aba === 'favoritas'
              ? 'border-[#C84F32] text-[#C84F32]'
              : 'border-transparent text-[#96928E] hover:text-[#1F1F21]'
          }`}
        >
          Minhas favoritas
          <span className="rounded-full border border-[#E8E3DF] bg-[#F5F3F1] px-2 py-0.5 text-[11px] text-[#6F6D6B]">
            {totalSelecionadas}
          </span>
        </button>
      </div>

      <div className="hidden text-xs uppercase tracking-[0.12em] text-[#96928E] md:block">
        {excedente > 0
          ? `+${excedente} excedente${excedente > 1 ? 's' : ''}`
          : `${totalSelecionadas} / ${limite} selecionadas`}
      </div>
    </nav>
  )
}
