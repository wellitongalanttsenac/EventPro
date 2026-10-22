"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface SidebarProps {
  aberto: boolean;
  aoFechar: () => void;
}

const LINKS = [
  { label: "Home", href: "/home" },
  { label: "Usuários", href: "/usuarios" },
  { label: "Eventos", href: "/eventos" },
  { label: "Palestrantes", href: "/palestrantes" },
  { label: "Inscrições", href: "/inscricoes" },
];

// Desktop (lg+): coluna fixa como antes. Celular/tablet: gaveta aberta pelo botão do Header.
export default function Sidebar({ aberto, aoFechar }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!aberto) return;
    const fecharComEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", fecharComEsc);
    return () => window.removeEventListener("keydown", fecharComEsc);
  }, [aberto, aoFechar]);

  return (
    <>
      {aberto && (
        <div
          aria-hidden="true"
          onClick={aoFechar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        id="menu-lateral"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1D0B0B] border-r border-white/10 flex flex-col p-6 shadow-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shrink-0 ${
          aberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 px-2 flex items-center justify-between">
          <div className="text-xl font-bold text-[#F5EDEC] tracking-tight flex items-center gap-2">
            <span className="text-[#FF3B3B] text-xl leading-none">✱</span>
            <span>EventPro</span>
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar menu"
            className="lg:hidden w-8 h-8 inline-flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B]"
          >
            ✕
          </button>
        </div>

        <nav aria-label="Menu do sistema" className="flex flex-col space-y-1.5 flex-1">
          {LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={aoFechar}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B] ${
                  isActive
                    ? "bg-[#FF3B3B] text-[#150606] font-semibold shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/10 text-xs text-white/40 px-2">
          <p className="font-semibold text-white/60">EventPro 2026</p>
          <p className="mt-0.5 text-[11px] text-white/30">Gestão de Palestras & Workshops</p>
        </div>
      </aside>
    </>
  );
}
