"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, mensagemDeErro } from "@/app/services/api";
import { Palestrante } from "@/app/types/palestrante";
import PalestranteForm from "@/app/(sistema)/palestrantes/components/PalestranteForm";
import { useEventoDoOrganizador } from "@/app/hooks/useEventoDoOrganizador";

function EditarPalestranteConteudo() {
  const params = useParams();
  const searchParams = useSearchParams();

  const codigo = Number(params.codigo);
  const queryEventoId = searchParams.get("eventoId");
  const eventoId = queryEventoId ? Number(queryEventoId) : null;

  const { evento, erro: erroEvento } = useEventoDoOrganizador(eventoId, "editar palestrantes");

  const [palestrante, setPalestrante] = useState<Palestrante | null>(null);
  const [erroPalestrante, setErroPalestrante] = useState<string | null>(null);

  const eventoConfirmadoId = evento?.id ?? null;

  useEffect(() => {
    if (!eventoConfirmadoId) return;
    let ativo = true;
    api
      .get<Palestrante>(`/eventos/${eventoConfirmadoId}/palestrantes/${codigo}`)
      .then((resposta) => {
        if (ativo) setPalestrante(resposta.data);
      })
      .catch((error) => {
        if (ativo) setErroPalestrante(mensagemDeErro(error, "Não foi possível carregar o palestrante."));
      });
    return () => {
      ativo = false;
    };
  }, [eventoConfirmadoId, codigo]);

  const voltarUrl = eventoId ? `/palestrantes?eventoId=${eventoId}` : "/palestrantes";
  const erro = !eventoId
    ? "Abra a edição a partir da lista de palestrantes de um evento."
    : erroEvento || erroPalestrante;

  if (erro) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
        <p className="text-rose-400 mb-4">{erro}</p>
        <Link href={voltarUrl} className="text-xs text-[#FF3B3B] underline hover:text-[#ff5c5c]">
          Voltar para palestrantes
        </Link>
      </div>
    );
  }

  if (!palestrante) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
        <p className="text-white/50 text-sm">Carregando dados do palestrante #{codigo}...</p>
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
              Editar palestrante #{codigo}
            </h1>
          </div>
          <p className="text-xs text-white/50">Atualize as informações do palestrante vinculado ao evento</p>
        </div>

        <Link
          href={voltarUrl}
          className="inline-flex items-center justify-center text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors"
        >
          &larr; Voltar para palestrantes
        </Link>
      </div>

      {/* Cartão do Formulário */}
      <div className="bg-[#1D0B0B] border border-white/10 rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl">
        <PalestranteForm palestranteExistente={palestrante} eventoIdPredefinido={eventoId ?? undefined} />
      </div>
    </div>
  );
}

export default function EditarPalestrantePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
          <p className="text-white/50 text-sm">Carregando dados para edição...</p>
        </div>
      }
    >
      <EditarPalestranteConteudo />
    </Suspense>
  );
}
