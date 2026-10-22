"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import InscricaoForm from "../components/InscricaoForm";
import AvisoErro from "@/app/components/AvisoErro";
import { useEventoDoOrganizador } from "@/app/hooks/useEventoDoOrganizador";

function NovaInscricaoConteudo() {
  const searchParams = useSearchParams();
  const queryEventoId = searchParams.get("eventoId");
  const eventoId = queryEventoId ? Number(queryEventoId) : null;

  // Sem eventoId na URL o organizador escolhe o evento no próprio formulário
  const { erro, carregando } = useEventoDoOrganizador(eventoId, "registrar inscrições");

  const voltarUrl = eventoId ? `/inscricoes?eventoId=${eventoId}` : "/inscricoes";

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
              Nova inscrição
            </h1>
          </div>
          <p className="text-xs text-white/50">Registre um participante em um dos seus eventos</p>
        </div>

        <Link
          href={voltarUrl}
          className="inline-flex items-center justify-center text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors"
        >
          &larr; Voltar para inscrições
        </Link>
      </div>

      {erro ? (
        <AvisoErro mensagem={erro} />
      ) : (
        <div className="bg-[#1D0B0B] border border-white/10 rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl">
          <InscricaoForm eventoIdPredefinido={eventoId ?? undefined} />
        </div>
      )}
    </div>
  );
}

export default function NovaInscricaoPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
          <p className="text-white/50 text-sm">Carregando formulário...</p>
        </div>
      }
    >
      <NovaInscricaoConteudo />
    </Suspense>
  );
}
