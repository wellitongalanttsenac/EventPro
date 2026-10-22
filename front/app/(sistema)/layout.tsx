"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganizadorLogado } from "@/app/services/auth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const organizador = useOrganizadorLogado();
  const [menuAberto, setMenuAberto] = useState(false);

  // null = sem login (ou sessão encerrada por um 401)
  useEffect(() => {
    if (organizador === null) {
      router.replace("/login");
    }
  }, [organizador, router]);

  if (!organizador) {
    return (
      <div className="min-h-screen bg-[#150606] flex items-center justify-center text-white/50 text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full" />
          <span>Verificando autenticação do organizador...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#150606] text-[#F5EDEC]">
      <Sidebar aberto={menuAberto} aoFechar={() => setMenuAberto(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header organizador={organizador} aoAbrirMenu={() => setMenuAberto(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#150606]">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
