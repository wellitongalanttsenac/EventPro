export default function Footer() {
  const anoAtual = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#1D0B0B] border-t border-white/10 py-5 px-6 text-white/40 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          &copy; {anoAtual} <span className="text-[#FF3B3B] font-semibold">EventPro</span>. Todos os direitos reservados.
        </p>
        <p className="text-white/30 text-[11px]">
          Projeto Acadêmico — Graduação Senac
        </p>
      </div>
    </footer>
  );
}
