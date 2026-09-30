"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLink {
  label: string;
  href: string;
  badge?: string;
}

export default function Sidebar() {
  const pathname = usePathname();

  const links: SidebarLink[] = [
    { label: "Home", href: "/home" },
    { label: "Usuários", href: "/usuarios" },
    { label: "Eventos", href: "/eventos" },
    { label: "Palestrantes", href: "/palestrantes" },
    { label: "Inscrições", href: "/inscricoes" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#1D0B0B] border-r border-white/10 flex flex-col p-6 shadow-xl shrink-0">
      <div className="text-xl font-bold text-[#F5EDEC] tracking-tight mb-8 px-2 flex items-center gap-2">
        <span className="text-[#FF3B3B] text-xl leading-none">✱</span>
        <span>EventPro</span>
      </div>

      <nav className="flex flex-col space-y-1.5 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#FF3B3B] text-[#150606] font-semibold shadow-md"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{link.label}</span>
              {link.badge && !isActive && (
                <span className="text-[10px] tracking-wide text-white/40 border border-white/10 rounded-full px-2 py-0.5">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-white/10 text-xs text-white/40 px-2">
        <p className="font-semibold text-white/60">EventPro 2026</p>
        <p className="mt-0.5 text-[11px] text-white/30">Gestão de Palestras & Workshops</p>
      </div>
    </aside>
  );
}
