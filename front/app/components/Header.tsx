"use client";

import { useRouter } from "next/navigation";
import { logout, OrganizadorLogado } from "../services/auth";

interface HeaderProps {
  organizador: OrganizadorLogado;
  aoAbrirMenu: () => void;
}

function getIniciais(nome?: string) {
  if (!nome) return "EP";
  const partes = nome.trim().split(" ");
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export default function Header({ organizador, aoAbrirMenu }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="w-full bg-[#1D0B0B] border-b border-white/10 shadow-lg sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={aoAbrirMenu}
            aria-label="Abrir menu"
            aria-controls="menu-lateral"
            className="lg:hidden w-9 h-9 shrink-0 inline-flex flex-col items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B]"
          >
            <span className="block w-4 h-0.5 bg-white/80 rounded" />
            <span className="block w-4 h-0.5 bg-white/80 rounded" />
            <span className="block w-4 h-0.5 bg-white/80 rounded" />
          </button>

          <div className="w-9 h-9 shrink-0 rounded-full bg-[#FF3B3B]/10 border border-[#FF3B3B]/30 flex items-center justify-center text-[#FF3B3B] font-bold text-xs tracking-wider">
            {getIniciais(organizador.nome)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[#F5EDEC] font-medium text-sm truncate">
              {organizador.nome}
            </span>
            <span className="text-white/40 text-xs truncate hidden sm:block">
              {organizador.email}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="shrink-0 px-4 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B]"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
