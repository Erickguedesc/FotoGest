export default function SelectionSentNotice({ visible }) {
  if (!visible) return null

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-3xl border border-[#E8E3DF] bg-[#FFFFFF] p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#5a9468]/10 text-2xl text-[#5a9468]">
          ✓
        </div>
        <h2 className="font-serif text-4xl font-light">
          Seleção enviada
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6F6D6B]">
          Suas fotos favoritas foram enviadas para o profissional. A seleção não
          pode mais ser alterada por aqui.
        </p>
      </div>
    </section>
  )
}
