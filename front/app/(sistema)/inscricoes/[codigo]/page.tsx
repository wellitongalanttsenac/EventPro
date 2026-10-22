"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, mensagemDeErro } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import { Inscricao, AtualizarStatusInscricaoRequest } from "@/app/types/inscricao";
import StatusBadge from "@/app/components/StatusBadge";
import AvisoErro from "@/app/components/AvisoErro";
import { useEventoDoOrganizador } from "@/app/hooks/useEventoDoOrganizador";
import { formatarDataHora } from "@/app/utils/formatacao";

function DetalheInscricaoConteudo() {
  const params = useParams();
  const searchParams = useSearchParams();

  const codigo = Number(params.codigo);
  const queryEventoId = searchParams.get("eventoId");
  const eventoId = queryEventoId ? Number(queryEventoId) : null;

  const { evento, erro: erroEvento } = useEventoDoOrganizador(eventoId, "ver inscrições");

  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [erroInscricao, setErroInscricao] = useState<string | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const eventoConfirmadoId = evento?.id ?? null;

  useEffect(() => {
    if (!eventoConfirmadoId) return;
    let ativo = true;
    api
      .get<Inscricao>(`/eventos/${eventoConfirmadoId}/inscricoes/${codigo}`)
      .then((resposta) => {
        if (ativo) setInscricao(resposta.data);
      })
      .catch((error) => {
        if (ativo) setErroInscricao(mensagemDeErro(error, "Não foi possível carregar a inscrição."));
      });
    return () => {
      ativo = false;
    };
  }, [eventoConfirmadoId, codigo]);

  const handleCopiarCredencial = async () => {
    if (!inscricao?.credencial) return;

    try {
      await navigator.clipboard.writeText(inscricao.credencial);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      alert(`Código da credencial: ${inscricao.credencial}`);
    }
  };

  const handleConfirmarInscricao = async () => {
    const organizadorLogado = getOrganizadorLogado();
    if (!eventoId || !inscricao || !organizadorLogado) return;

    setErroAcao(null);
    setConfirmando(true);
    try {
      const payload: AtualizarStatusInscricaoRequest = { status: "CONFIRMADA" };
      const resposta = await api.patch<Inscricao>(
        `/eventos/${eventoId}/inscricoes/${inscricao.id}/status?organizadorId=${organizadorLogado.id}`,
        payload
      );
      setInscricao(resposta.data);
    } catch (error) {
      setErroAcao(mensagemDeErro(error, "Não foi possível confirmar a inscrição."));
    } finally {
      setConfirmando(false);
    }
  };

  const voltarUrl = eventoId ? `/inscricoes?eventoId=${eventoId}` : "/inscricoes";
  const erro = !eventoId
    ? "Abra a inscrição a partir da lista de inscrições de um evento."
    : erroEvento || erroInscricao;

  if (erro) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
        <p className="text-rose-400 mb-4">{erro}</p>
        <Link href={voltarUrl} className="text-xs text-[#FF3B3B] underline hover:text-[#ff5c5c]">
          Voltar para inscrições
        </Link>
      </div>
    );
  }

  if (!inscricao) {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1D0B0B] border border-white/10 p-5 sm:p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[#FF3B3B] text-xl leading-none" aria-hidden="true">✱</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Inscrição #{codigo}
            </h1>
          </div>
          <p className="text-xs text-white/50">Dados da inscrição e credencial do participante</p>
        </div>

        <Link
          href={voltarUrl}
          className="inline-flex items-center justify-center text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors"
        >
          &larr; Voltar para inscrições
        </Link>
      </div>

      <AvisoErro mensagem={erroAcao} />

      {/* Cartão de Credencial em Destaque */}
      {inscricao.status === "CONFIRMADA" && inscricao.credencial ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#200B0B] via-[#1D0B0B] to-[#150606] border-2 border-[#FF3B3B]/40 rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#FF3B3B]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 min-w-0">
              <div className="inline-flex items-center gap-2 bg-[#FF3B3B]/10 border border-[#FF3B3B]/30 px-3 py-1 rounded-full text-xs font-semibold text-[#FF3B3B]">
                <span aria-hidden="true">🛡️</span> Credencial EventPro
              </div>

              <div>
                <span className="text-xs text-white/50 block font-medium">Código da credencial</span>
                <span className="text-2xl sm:text-4xl font-mono font-black text-white tracking-widest block mt-1 break-all">
                  {inscricao.credencial}
                </span>
              </div>

              <p className="text-xs text-white/60">
                Código único gerado pela API na confirmação da inscrição de{" "}
                <strong className="text-white">{inscricao.nomeParticipante}</strong>.
              </p>
            </div>

            <div className="flex flex-col items-stretch sm:items-start md:items-end gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCopiarCredencial}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-xs bg-[#FF3B3B] hover:bg-[#ff5c5c] text-[#150606] shadow-lg hover:shadow-[#FF3B3B]/30 transition-all cursor-pointer active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3B3B]"
              >
                <span aria-hidden="true">{copiado ? "✓" : "📋"}</span>
                <span aria-live="polite">{copiado ? "Credencial copiada" : "Copiar credencial"}</span>
              </button>
              <span className="text-[11px] text-white/40">Use este código na entrada do evento.</span>
            </div>
          </div>
        </div>
      ) : inscricao.status === "PENDENTE" ? (
        <div className="bg-[#1D0B0B] border border-amber-500/30 rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold text-amber-400">
              <span aria-hidden="true">⏳</span> Inscrição pendente
            </div>
            <h3 className="text-lg font-bold text-white">Credencial ainda não emitida</h3>
            <p className="text-xs text-white/60 max-w-lg leading-relaxed">
              A credencial é gerada quando você confirma a inscrição.
            </p>
          </div>

          <button
            type="button"
            disabled={confirmando}
            onClick={handleConfirmarInscricao}
            className="inline-flex items-center justify-center text-xs font-semibold text-[#150606] bg-emerald-400 hover:bg-emerald-300 px-6 py-3 rounded-full transition-colors whitespace-nowrap shadow-lg disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            {confirmando ? "Gerando credencial..." : "✓ Confirmar e gerar credencial"}
          </button>
        </div>
      ) : (
        <div className="bg-[#1D0B0B] border border-rose-500/30 rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-semibold text-rose-400">
            <span aria-hidden="true">✕</span> Inscrição cancelada
          </div>
          <h3 className="text-lg font-bold text-white">Credencial sem validade</h3>
          <p className="text-xs text-white/60">
            Esta inscrição foi cancelada pelo organizador e não vale para a entrada no evento.
          </p>
        </div>
      )}

      {/* Cartão de Informações Completas */}
      <div className="bg-[#1D0B0B] border border-white/10 rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl space-y-6">
        <h2 className="text-base font-bold text-white pb-4 border-b border-white/10 flex items-center gap-2">
          <span aria-hidden="true">📋</span> Dados da inscrição
        </h2>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Participante</dt>
            <dd className="text-sm font-semibold text-white">{inscricao.nomeParticipante}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/40">E-mail</dt>
            <dd className="text-sm font-semibold text-white break-all">{inscricao.emailParticipante}</dd>
          </div>

          <div className="space-y-1">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Status</dt>
            <dd>
              <StatusBadge status={inscricao.status} />
            </dd>
          </div>

          <div className="space-y-1">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Inscrito em</dt>
            <dd className="text-sm text-white/80">{formatarDataHora(inscricao.dataInscricao)}</dd>
          </div>

          <div className="space-y-1 md:col-span-2 pt-4 border-t border-white/10">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Evento</dt>
            <dd className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
              <div>
                <span className="text-base font-bold text-white block">{evento?.nome}</span>
                <span className="text-xs text-white/50 block">
                  Local: {evento?.local || "—"} • Data: {formatarDataHora(evento?.dataEvento)}
                </span>
              </div>
              <Link
                href={`/palestrantes?eventoId=${evento?.id}`}
                className="text-xs text-[#FF3B3B] hover:text-[#ff5c5c] underline whitespace-nowrap"
              >
                Ver palestrantes do evento
              </Link>
            </dd>
          </div>
        </dl>
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
