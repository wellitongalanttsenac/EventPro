"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <header className="w-full bg-[#1D0B0B] border-b border-white/10 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#FF3B3B]/10 border border-[#FF3B3B]/30 flex items-center justify-center text-[#FF3B3B] font-bold text-sm">
            EP
          </div>
          <div className="flex flex-col">
            <span className="text-[#F5EDEC] font-medium text-sm">
              Organizador EventPro
            </span>
            <span className="text-white/40 text-xs">Painel Administrativo</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="px-4 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B]"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
