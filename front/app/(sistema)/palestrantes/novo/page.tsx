"use client";

import AvisoErro from "@/app/components/AvisoErro";
import { RootState } from "@/app/redux/store";
import { mensagemDeErro } from "@/app/services/api";
import { consultaEventoDoOrganizador } from "@/app/services/eventoService";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PalestranteForm from "../components/PalestranteForm";

function CadastroPalestranteConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryEventoId = searchParams.get("eventoId");
  const eventoId = queryEventoId ? Number(queryEventoId) : null;
  const organizadorId = useSelector((state: RootState) => state.auth.usuario?.id ?? null);

  // Sem eventoId na URL o organizador escolhe o evento no próprio formulário
  const [carregando, setCarregando] = useState(Boolean(eventoId));
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!eventoId) return;

    let ativo = true;

    const buscarDados = async () => {
      try {
        const valorEventoBack = await consultaEventoDoOrganizador(eventoId, organizadorId);
        if (!ativo) return;
        if (!valorEventoBack) {
          alert("Você só pode cadastrar palestrantes em eventos organizados por você.");
          router.push("/eventos");
          return;
        }
        setCarregando(false);
      } catch (error) {
        setErro(mensagemDeErro(error, "Não foi possível carregar o evento."));
        setCarregando(false);
      }
    };

    buscarDados();

    return () => {
      ativo = false;
    };
  }, [eventoId, organizadorId, router]);

  const voltarUrl = eventoId ? `/palestrantes?eventoId=${eventoId}` : "/palestrantes";

  if (carregando) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
        <p className="text-white/50 text-sm">Validando o evento #{eventoId}...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1D0B0B] border border-white/10 p-5 sm:p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[#FF3B3B] text-xl leading-none" aria-hidden="true">✱</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Novo palestrante
            </h1>
          </div>
          <p className="text-xs text-white/50">Vincule um novo palestrante a um dos seus eventos</p>
        </div>

        <Link
          href={voltarUrl}
          className="inline-flex items-center justify-center text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors"
        >
          &larr; Voltar para palestrantes
        </Link>
      </div>

      {erro ? (
        <AvisoErro mensagem={erro} />
      ) : (
        <div className="bg-[#1D0B0B] border border-white/10 rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl">
          <PalestranteForm eventoIdPredefinido={eventoId ?? undefined} />
        </div>
      )}
    </div>
  );
}

export default function CadastroPalestrante() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
          <p className="text-white/50 text-sm">Carregando formulário...</p>
        </div>
      }
    >
      <CadastroPalestranteConteudo />
    </Suspense>
  );
}
