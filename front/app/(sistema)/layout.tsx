"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrganizadorLogado } from "@/app/services/auth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const organizador = getOrganizadorLogado();
    if (!organizador || !organizador.id) {
      router.push("/login");
    } else {
      setAutenticado(true);
    }
  }, [router]);

  if (!autenticado) {
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
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#150606]">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
