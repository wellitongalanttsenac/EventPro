"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import { Evento } from "@/app/types/evento";
import InscricaoForm from "../components/InscricaoForm";

function NovaInscricaoConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryEventoId = searchParams.get("eventoId");
  const eventoId = queryEventoId ? Number(queryEventoId) : undefined;

  const [validando, setValidando] = useState(Boolean(eventoId));

  useEffect(() => {
    if (eventoId) {
      validarPosseEvento(eventoId);
    }
  }, [eventoId]);

  const validarPosseEvento = async (id: number) => {
    try {
      setValidando(true);
      const organizadorLogado = getOrganizadorLogado();

      const resposta = await api.get<Evento>(`/eventos/${id}`);
      if (resposta.status === 200 && resposta.data) {
        if (
          organizadorLogado &&
          resposta.data.organizador?.id !== organizadorLogado.id
        ) {
          alert("Acesso negado: Você só pode cadastrar inscrições em eventos criados por você.");
          router.push("/eventos");
          return;
        }
      } else {
        alert("Evento especificado não foi encontrado.");
        router.push("/eventos");
      }
    } catch (error: any) {
      console.error(error);
      alert("Acesso negado ou evento inexistente.");
      router.push("/eventos");
    } finally {
      setValidando(false);
    }
  };

  const voltarUrl = eventoId ? `/inscricoes?eventoId=${eventoId}` : "/inscricoes";

  if (validando) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
        <p className="text-white/50 text-sm">Validando dados do evento #{eventoId}...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1D0B0B] border border-white/10 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[#FF3B3B] text-xl leading-none">✱</span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Nova Inscrição
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Cadastre um participante em um dos seus eventos organizados
          </p>
        </div>

        <Link
          href={voltarUrl}
          className="inline-flex items-center justify-center text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors"
        >
          &larr; Voltar para Inscrições
        </Link>
      </div>

      {/* Cartão do Formulário */}
      <div className="bg-[#1D0B0B] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
        <InscricaoForm eventoIdPredefinido={eventoId} />
      </div>
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
