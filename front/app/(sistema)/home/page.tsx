import Link from "next/link";

export default function HomePage() {
  const modulos = [
    {
      nome: "Organizadores (Usuários)",
      descricao: "Gerencie contas, credenciais de acesso e status de organizadores.",
      href: "/usuarios",
      icone: "👥",
      ativo: true,
    },
    {
      nome: "Eventos & Workshops",
      descricao: "Cadastro de eventos, locais, datas e controle de lotes.",
      href: "/eventos",
      icone: "🎟️",
      ativo: false,
    },
    {
      nome: "Palestrantes",
      descricao: "Vínculo de palestrantes e especialistas às atividades do evento.",
      href: "/palestrantes",
      icone: "🎙️",
      ativo: false,
    },
    {
      nome: "Inscrições & Credenciamento",
      descricao: "Controle de participantes e geração de credenciais únicas.",
      href: "/inscricoes",
      icone: "🛡️",
      ativo: false,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Banner de Boas-vindas */}
      <div className="relative overflow-hidden bg-[#1D0B0B] border border-white/10 p-8 rounded-3xl shadow-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#FF3B3B]/10 blur-3xl"
        />
        <div className="relative z-10 max-w-2xl space-y-3">
          <p className="text-xs font-semibold tracking-widest text-[#FF3B3B] uppercase">
            Visão Geral do Sistema
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Bem-vindo ao Painel EventPro
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            Plataforma de gestão de workshops, palestras e emissão de credenciais com isolamento completo por organizador.
          </p>
        </div>
      </div>

      {/* Grid de Módulos */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-white/90">
          Módulos do Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {modulos.map((modulo) => (
            <Link
              key={modulo.nome}
              href={modulo.ativo ? modulo.href : "#"}
              className={`group p-6 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                modulo.ativo
                  ? "bg-[#1D0B0B] border-white/10 hover:border-[#FF3B3B]/50 hover:bg-[#250F0F]"
                  : "bg-[#180808] border-white/5 opacity-70 cursor-not-allowed"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                {modulo.icone}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-base text-white group-hover:text-[#FF3B3B] transition-colors">
                    {modulo.nome}
                  </h3>
                  {modulo.ativo ? (
                    <span className="text-xs text-[#FF3B3B] font-medium flex items-center gap-1">
                      Acessar &rarr;
                    </span>
                  ) : (
                    <span className="text-[10px] text-white/40 border border-white/10 rounded-full px-2 py-0.5">
                      Em breve
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  {modulo.descricao}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}