"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { RootState } from "../redux/store";

const semInscricao = () => () => {};

export default function SistemaLayout({ children }: { children: React.ReactNode }) {
  const usuario = useSelector((state: RootState) => state.auth.usuario);
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  // O cookie só existe no navegador: até a hidratação terminar, o servidor e o navegador mostram o carregamento
  const montado = useSyncExternalStore(semInscricao, () => true, () => false);

  useEffect(() => {
    if (montado && usuario == null) {
      router.push("/login");
    }
  }, [montado, usuario, router]);

  if (!montado || !usuario) {
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
        <Header aoAbrirMenu={() => setMenuAberto(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#150606]">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
