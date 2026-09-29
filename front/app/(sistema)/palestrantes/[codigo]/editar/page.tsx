"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import { Palestrante } from "@/app/types/palestrante";
import { Evento } from "@/app/types/evento";
import PalestranteForm from "@/app/(sistema)/palestrantes/components/PalestranteForm";

function EditarPalestranteConteudo() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const codigo = Number(params.codigo);
  const queryEventoId = searchParams.get("eventoId");
  const eventoId = queryEventoId ? Number(queryEventoId) : null;

  const [palestrante, setPalestrante] = useState<Palestrante | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!eventoId) {
      alert("Acesso inválido: Nenhum evento especificado na URL para edição do palestrante.");
      router.push("/palestrantes");
      return;
    }

    if (codigo && eventoId) {
      carregarDados(eventoId, codigo);
    }
  }, [codigo, eventoId]);

  const carregarDados = async (evId: number, palestranteId: number) => {
    try {
      setCarregando(true);
      const organizadorLogado = getOrganizadorLogado();

      // 1. Validar posse do evento
      const respEvento = await api.get<Evento>(`/eventos/${evId}`);
      if (respEvento.status === 200 && respEvento.data) {
        if (
          organizadorLogado &&
          respEvento.data.organizador?.id !== organizadorLogado.id
        ) {
          alert("Acesso negado: Você só pode editar palestrantes de eventos criados por você.");
          router.push("/eventos");
          return;
        }
      } else {
        alert("Evento não encontrado.");
        router.push("/eventos");
        return;
      }

      // 2. Carregar dados do palestrante
      const respPalestrante = await api.get<Palestrante>(
        `/eventos/${evId}/palestrantes/${palestranteId}`
      );

      if (respPalestrante.status === 200 && respPalestrante.data) {
        setPalestrante(respPalestrante.data);
      } else {
        setErro(`Palestrante #${palestranteId} não encontrado neste evento.`);
      }
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 403) {
        alert("Acesso negado ao gerenciar este palestrante.");
        router.push("/eventos");
      } else if (error?.response?.status === 404) {
        alert("Palestrante ou evento não encontrado no servidor.");
        router.push(`/palestrantes?eventoId=${evId}`);
      } else {
        alert("Erro ao buscar dados do palestrante para edição.");
        router.push(`/palestrantes?eventoId=${evId}`);
      }
    } finally {
      setCarregando(false);
    }
  };

  const voltarUrl = eventoId ? `/palestrantes?eventoId=${eventoId}` : "/palestrantes";

  if (erro) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
        <p className="text-rose-400 mb-4">{erro}</p>
        <Link
          href={voltarUrl}
          className="text-xs text-[#FF3B3B] underline hover:text-[#ff5c5c]"
        >
          Voltar para Palestrantes
        </Link>
      </div>
    );
  }

  if (carregando || !palestrante) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
        <p className="text-white/50 text-sm">
          Carregando dados do palestrante #{codigo}...
        </p>
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
              Editar Palestrante #{codigo}
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Atualize as informações do palestrante vinculado ao evento
          </p>
        </div>

        <Link
          href={voltarUrl}
          className="inline-flex items-center justify-center text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors"
        >
          &larr; Voltar para Palestrantes
        </Link>
      </div>

      {/* Cartão do Formulário */}
      <div className="bg-[#1D0B0B] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
        <PalestranteForm
          palestranteExistente={palestrante}
          eventoIdPredefinido={eventoId || undefined}
        />
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
