"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import { Inscricao, AtualizarStatusInscricaoRequest } from "@/app/types/inscricao";
import { Evento } from "@/app/types/evento";

function DetalheInscricaoConteudo() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const codigo = Number(params.codigo);
  const queryEventoId = searchParams.get("eventoId");
  const eventoId = queryEventoId ? Number(queryEventoId) : null;

  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [copiado, setCopiado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    if (!eventoId) {
      alert("Acesso inválido: Nenhum evento especificado na URL para visualizar a inscrição.");
      router.push("/inscricoes");
      return;
    }

    if (codigo && eventoId) {
      carregarDados(eventoId, codigo);
    }
  }, [codigo, eventoId]);

  const carregarDados = async (evId: number, idInscricao: number) => {
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
          alert("Acesso negado: Você só pode visualizar inscrições dos seus próprios eventos.");
          router.push("/eventos");
          return;
        }
        setEvento(respEvento.data);
      } else {
        alert("Evento não encontrado.");
        router.push("/eventos");
        return;
      }

      // 2. Carregar dados da inscrição
      const respInscricao = await api.get<Inscricao>(
        `/eventos/${evId}/inscricoes/${idInscricao}`
      );

      if (respInscricao.status === 200 && respInscricao.data) {
        setInscricao(respInscricao.data);
      } else {
        alert("Inscrição não encontrada no servidor.");
        router.push(`/inscricoes?eventoId=${evId}`);
      }
    } catch (error: any) {
      console.error(error);
      alert("Não foi possível carregar os detalhes da inscrição.");
      router.push(`/inscricoes?eventoId=${evId}`);
    } finally {
      setCarregando(false);
    }
  };

  const handleCopiarCredencial = async () => {
    if (!inscricao?.credencial) return;

    try {
      await navigator.clipboard.writeText(inscricao.credencial);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch (err) {
      console.error("Falha ao copiar credencial:", err);
      alert(`Código da credencial: ${inscricao.credencial}`);
    }
  };

  const handleConfirmarInscricao = async () => {
    if (!eventoId || !inscricao?.id) return;
    const organizadorLogado = getOrganizadorLogado();
    if (!organizadorLogado?.id) return;

    try {
      setConfirmando(true);
      const payload: AtualizarStatusInscricaoRequest = {
        status: "CONFIRMADA",
      };

      const resp = await api.patch<Inscricao>(
        `/eventos/${eventoId}/inscricoes/${inscricao.id}/status?organizadorId=${organizadorLogado.id}`,
        payload
      );

      if (resp.status === 200 && resp.data) {
        setInscricao(resp.data);
        alert(
          `Inscrição confirmada com sucesso!\nCredencial gerada: ${resp.data.credencial}`
        );
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao confirmar inscrição.");
    } finally {
      setConfirmando(false);
    }
  };

  const voltarUrl = eventoId ? `/inscricoes?eventoId=${eventoId}` : "/inscricoes";

  if (carregando || !inscricao) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
        <p className="text-white/50 text-sm">Carregando dados da inscrição #{codigo}...</p>
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
              Inscrição #{codigo}
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Visualização detalhada da inscrição e emissão da credencial exclusiva
          </p>
        </div>

        <Link
          href={voltarUrl}
          className="inline-flex items-center justify-center text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors"
        >
          &larr; Voltar para Inscrições
        </Link>
      </div>

      {/* Cartão de Credencial em Destaque */}
      {inscricao.status === "CONFIRMADA" && inscricao.credencial ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#200B0B] via-[#1D0B0B] to-[#150606] border-2 border-[#FF3B3B]/40 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#FF3B3B]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#FF3B3B]/10 border border-[#FF3B3B]/30 px-3 py-1 rounded-full text-xs font-semibold text-[#FF3B3B]">
                <span>🛡️</span> CREDENCIAL OFICIAL EVENTPRO
              </div>

              <div>
                <span className="text-xs text-white/50 uppercase tracking-widest block font-medium">
                  Código da Credencial
                </span>
                <span className="text-3xl sm:text-4xl font-mono font-black text-white tracking-widest block mt-1">
                  {inscricao.credencial}
                </span>
              </div>

              <p className="text-xs text-white/60">
                Código hash criptográfico único gerado pelo backend garantindo a autenticidade da inscrição de{" "}
                <strong className="text-white">{inscricao.nomeParticipante}</strong>.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCopiarCredencial}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs bg-[#FF3B3B] hover:bg-[#ff5c5c] text-[#150606] shadow-lg hover:shadow-[#FF3B3B]/30 transition-all cursor-pointer active:scale-95"
              >
                <span>{copiado ? "✓" : "📋"}</span>
                <span>{copiado ? "Copiado para Área de Transferência!" : "Copiar Credencial"}</span>
              </button>
              <span className="text-[11px] text-white/40">
                Utilize este código para validação na entrada do evento.
              </span>
            </div>
          </div>
        </div>
      ) : inscricao.status === "PENDENTE" ? (
        <div className="bg-[#1D0B0B] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold text-amber-400">
              <span>⏳</span> INSCRIÇÃO PENDENTE
            </div>
            <h3 className="text-lg font-bold text-white">Credencial ainda não emitida</h3>
            <p className="text-xs text-white/60 max-w-lg leading-relaxed">
              O participante está registrado, porém a credencial única de acesso só é gerada quando o organizador confirma a inscrição.
            </p>
          </div>

          <button
            type="button"
            disabled={confirmando}
            onClick={handleConfirmarInscricao}
            className="inline-flex items-center justify-center text-xs font-semibold text-[#150606] bg-emerald-400 hover:bg-emerald-300 px-6 py-3 rounded-full transition-colors whitespace-nowrap shadow-lg disabled:opacity-50"
          >
            {confirmando ? "Gerando Credencial..." : "✓ Confirmar e Gerar Credencial"}
          </button>
        </div>
      ) : (
        <div className="bg-[#1D0B0B] border border-rose-500/30 rounded-3xl p-6 md:p-8 shadow-xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-semibold text-rose-400">
            <span>✕</span> INSCRIÇÃO CANCELADA
          </div>
          <h3 className="text-lg font-bold text-white">Inscrição Inativa</h3>
          <p className="text-xs text-white/60">
            Esta inscrição foi cancelada pelo organizador. A credencial não está ativa para check-in no evento.
          </p>
        </div>
      )}

      {/* Cartão de Informações Completas */}
      <div className="bg-[#1D0B0B] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <h2 className="text-base font-bold text-white pb-4 border-b border-white/10 flex items-center gap-2">
          <span>📋</span> Dados Cadastrais da Inscrição
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block">
              Nome do Participante
            </span>
            <span className="text-sm font-semibold text-white block">
              {inscricao.nomeParticipante}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block">
              E-mail de Contato
            </span>
            <span className="text-sm font-semibold text-white block">
              {inscricao.emailParticipante}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block">
              Status da Inscrição
            </span>
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  inscricao.status === "CONFIRMADA"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : inscricao.status === "PENDENTE"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {inscricao.status}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block">
              Data de Realização da Inscrição
            </span>
            <span className="text-sm text-white/80 block">
              {inscricao.dataInscricao
                ? new Date(inscricao.dataInscricao).toLocaleString("pt-BR")
                : "Não informada"}
            </span>
          </div>

          <div className="space-y-1 md:col-span-2 pt-4 border-t border-white/10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 block">
              Evento Associado
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
              <div>
                <span className="text-base font-bold text-white block">
                  {evento?.nome || "Evento Associado"}
                </span>
                <span className="text-xs text-white/50 block">
                  Local: {evento?.local || "—"} • Data:{" "}
                  {evento?.dataEvento
                    ? new Date(evento.dataEvento).toLocaleString("pt-BR")
                    : "—"}
                </span>
              </div>
              <Link
                href={`/eventos`}
                className="text-xs text-[#FF3B3B] hover:text-[#ff5c5c] underline whitespace-nowrap"
              >
                Ver todos os eventos &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetalheInscricaoPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
          <p className="text-white/50 text-sm">Carregando detalhes...</p>
        </div>
      }
    >
      <DetalheInscricaoConteudo />
    </Suspense>
  );
}
