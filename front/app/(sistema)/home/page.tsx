import Link from "next/link";

export default function Home() {
  const rotas = [
    { nome: "Usuários", href: "/usuarios" },
    { nome: "Eventos", href: "/eventos" },
    { nome: "Palestrantes", href: "/palestrantes" },
    { nome: "Inscrições", href: "/inscricoes" },
    { nome: "Credenciais", href: "/credenciais" },
  ];

  return (
    <div className="min-h-screen bg-[#150606] text-[#F5EDEC] font-sans antialiased flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-10">
          <span className="text-[#FF3B3B]">✱</span> EventPro
        </h1>

        <nav className="flex flex-col gap-4">
          {rotas.map((rota) => (
            <Link
              key={rota.href}
              href={rota.href}
              className="flex items-center justify-between bg-[#1D0B0B] border border-white/10 rounded-2xl px-6 py-4 text-white/80 font-medium hover:border-[#FF3B3B]/50 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3B3B]"
            >
              {rota.nome}
              <span className="text-[#FF3B3B]">→</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}