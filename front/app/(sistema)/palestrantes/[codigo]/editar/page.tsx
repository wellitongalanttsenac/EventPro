"use client";

import { RootState } from "@/app/redux/store";
import { mensagemDeErro } from "@/app/services/api";
import { consultaEventoDoOrganizador } from "@/app/services/eventoService";
import { consultaPalestrantePorId } from "@/app/services/palestranteService";
import { Palestrante } from "@/app/types/palestrante";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PalestranteForm from "../../components/PalestranteForm";

function EditarPalestranteConteudo() {
  const parametro = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const codigo = Number(parametro.codigo);
  const queryEventoId = searchParams.get("eventoId");
  const eventoId = queryEventoId ? Number(queryEventoId) : null;
  const organizadorId = useSelector((state: RootState) => state.auth.usuario?.id ?? null);

  const [palestrante, setPalestrante] = useState<Palestrante | null>(null);
  const [erroDados, setErroDados] = useState<string | null>(null);

  useEffect(() => {
    if (!eventoId) return;

    let ativo = true;

    const buscarDados = async () => {
      try {
        const valorEventoBack = await consultaEventoDoOrganizador(eventoId, organizadorId);
        if (!ativo) return;
        if (!valorEventoBack) {
          alert("Você só pode editar palestrantes em eventos organizados por você.");
          router.push("/eventos");
          return;
        }
        setPalestrante(await consultaPalestrantePorId(eventoId, codigo));
      } catch (error) {
        setErroDados(mensagemDeErro(error, "Não foi possível carregar o palestrante."));
      }
    };

    buscarDados();

    return () => {
      ativo = false;
    };
  }, [eventoId, codigo, organizadorId, router]);

  const voltarUrl = eventoId ? `/palestrantes?eventoId=${eventoId}` : "/palestrantes";
  const erro = !eventoId ? "Abra a edição a partir da lista de palestrantes de um evento." : erroDados;

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

export default function EditarPalestrante() {
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
