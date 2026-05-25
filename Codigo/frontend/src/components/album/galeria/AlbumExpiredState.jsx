export default function AlbumExpiredState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#110e0b] px-6 text-white">
      <div className="max-w-xl text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-red-300/70">
          Álbum expirado
        </p>

        <h1 className="font-serif text-5xl font-light">
          Este álbum não está mais disponível
        </h1>

        <p className="mt-6 text-sm leading-8 text-white/60">
          O prazo de acesso deste álbum foi encerrado. Entre em contato com a
          fotógrafa para solicitar uma nova liberação.
        </p>
      </div>
    </main>
  )
}
