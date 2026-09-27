import Link from "next/link";

export default function PublicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#150606] text-[#F5EDEC] font-sans antialiased selection:bg-[#FF3B3B] selection:text-[#150606] flex flex-col justify-between">
      {/* ===================== HEADER PÚBLICO ===================== */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#150606]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B]"
          >
            <span className="text-[#FF3B3B] text-xl leading-none">✱</span>
            <span className="font-semibold text-lg tracking-tight">EventPro</span>
          </Link>

          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-8 text-sm text-white/60"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Início
            </Link>
            <a href="#recursos" className="hover:text-white transition-colors">
              Recursos
            </a>
            <a href="#footer" className="hover:text-white transition-colors">
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="inline-flex px-4 py-2 text-sm font-semibold bg-[#FF3B3B] text-[#150606] rounded-full hover:bg-[#ff5c5c] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B]"
            >
              Acessar Painel
            </Link>
          </div>
        </div>
      </header>

      {/* ===================== CONTEÚDO ===================== */}
      <main className="flex-1">{children}</main>

      {/* ===================== FOOTER PÚBLICO ===================== */}
      <footer id="footer" className="border-t border-white/10 bg-[#150606]">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[#FF3B3B] text-xl leading-none">✱</span>
            <span className="font-semibold text-lg">EventPro</span>
          </div>

          <nav
            aria-label="Links do rodapé"
            className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/50"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Início
            </Link>
            <a href="#recursos" className="hover:text-white transition-colors">
              Recursos
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Termos de uso
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacidade
            </a>
          </nav>

          <p className="text-sm text-white/40">
            &copy; 2026 EventPro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
