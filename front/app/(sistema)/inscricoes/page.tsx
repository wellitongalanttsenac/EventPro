"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, isAxiosError } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import { Inscricao, AtualizarStatusInscricaoRequest } from "@/app/types/inscricao";
import { Evento } from "@/app/types/evento";
import SeletorEvento from "@/app/components/SeletorEvento";

function InscricoesConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryEventoId = searchParams.get("eventoId");
  const eventoId = queryEventoId ? Number(queryEventoId) : null;

  const [eventoAtual, setEventoAtual] = useState<Evento | null>(null);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [validandoPosse, setValidandoPosse] = useState(false);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  useEffect(() => {
    if (eventoId) {
      validarPosseECarregar(eventoId);
    } else {
      setEventoAtual(null);
      setInscricoes([]);
    }
  }, [eventoId]);

  const validarPosseECarregar = async (id: number) => {
    try {
      setValidandoPosse(true);
      const organizadorLogado = getOrganizadorLogado();

      // 1. Validar posse do evento
      const respEvento = await api.get<Evento>(`/eventos/${id}`);
      if (respEvento.status === 200 && respEvento.data) {
        const ev = respEvento.data;

        if (organizadorLogado && ev.organizador?.id !== organizadorLogado.id) {
          alert("Acesso negado: Você só pode gerenciar inscrições de eventos criados por você.");
          router.push("/eventos");
          return;
        }

        setEventoAtual(ev);
        await carregarInscricoes(id, organizadorLogado?.id);
      } else {
        alert("Evento não encontrado.");
        router.push("/eventos");
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        alert("O evento informado na URL não foi encontrado.");
      } else if (isAxiosError(error) && error.response?.status === 403) {
        alert("Acesso negado para este evento.");
      } else {
        alert("Não foi possível carregar os dados do evento.");
      }
      router.push("/eventos");
    } finally {
      setValidandoPosse(false);
    }
  };

  const carregarInscricoes = async (id: number, orgId?: number | null) => {
    try {
      setCarregando(true);
      const organizadorLogado = orgId ? { id: orgId } : getOrganizadorLogado();
      if (!organizadorLogado?.id) return;

      // GET /eventos/{eventoId}/inscricoes?organizadorId=...
      const resposta = await api.get<Inscricao[]>(
        `/eventos/${id}/inscricoes?organizadorId=${organizadorLogado.id}`
      );

      if (resposta.status === 200 && Array.isArray(resposta.data)) {
        setInscricoes(resposta.data);
      } else {
        setInscricoes([]);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 403) {
        alert("Apenas o organizador dono do evento pode listar inscrições!");
        router.push("/eventos");
      }
      setInscricoes([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleConfirmar = async (inscricao: Inscricao) => {
    if (!eventoId || !inscricao.id) return;

    const organizadorLogado = getOrganizadorLogado();
    if (!organizadorLogado?.id) {
      alert("Sessão expirada. Faça login novamente.");
      router.push("/login");
      return;
    }

    try {
      setProcessandoId(inscricao.id);

      const payload: AtualizarStatusInscricaoRequest = {
        status: "CONFIRMADA",
      };

      // PATCH /eventos/{eventoId}/inscricoes/{id}/status?organizadorId=...
      const resposta = await api.patch<Inscricao>(
        `/eventos/${eventoId}/inscricoes/${inscricao.id}/status?organizadorId=${organizadorLogado.id}`,
        payload
      );

      if (resposta.status === 200 && resposta.data) {
        const inscricaoAtualizada = resposta.data;

        // Atualização reativa da linha sem recarregar tudo
        setInscricoes((anteriores) =>
          anteriores.map((item) =>
            item.id === inscricaoAtualizada.id ? inscricaoAtualizada : item
          )
        );

        alert(
          `Inscrição de "${inscricao.nomeParticipante}" confirmada com sucesso!\nCredencial gerada: ${
            inscricaoAtualizada.credencial || "Emitida"
          }`
        );
      } else {
        alert("Não foi possível confirmar a inscrição.");
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 403) {
        alert("Apenas o organizador dono do evento pode confirmar inscrições!");
      } else {
        alert("Falha na comunicação com o servidor ao confirmar inscrição.");
      }
    } finally {
      setProcessandoId(null);
    }
  };

  const handleCancelar = async (inscricao: Inscricao) => {
    if (!eventoId || !inscricao.id) return;

    const organizadorLogado = getOrganizadorLogado();
    if (!organizadorLogado?.id) {
      alert("Sessão expirada. Faça login novamente.");
      router.push("/login");
      return;
    }

    const confirmou = confirm(
      `Deseja realmente cancelar a inscrição de "${inscricao.nomeParticipante}"?\n\nO status da inscrição será alterado para CANCELADA.`
    );

    if (!confirmou) return;

    try {
      setProcessandoId(inscricao.id);

      // DELETE /eventos/{eventoId}/inscricoes/{id}/excluir?organizadorId=...
      const resposta = await api.delete(
        `/eventos/${eventoId}/inscricoes/${inscricao.id}/excluir?organizadorId=${organizadorLogado.id}`
      );

      if (resposta.status === 200 || resposta.status === 204) {
        alert("Inscrição cancelada com sucesso!");

        // Atualização local do status da linha
        setInscricoes((anteriores) =>
          anteriores.map((item) =>
            item.id === inscricao.id ? { ...item, status: "CANCELADA" } : item
          )
        );
      } else {
        alert("Não foi possível cancelar a inscrição.");
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 403) {
        alert("Apenas o organizador dono do evento pode cancelar inscrições!");
      } else {
        alert("Falha na comunicação com o servidor ao cancelar inscrição.");
      }
    } finally {
      setProcessandoId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1D0B0B] border border-white/10 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[#FF3B3B] text-xl leading-none">✱</span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Gestão de Inscrições & Credenciais
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Acompanhe participantes, confirme presenças e gerencie as credenciais exclusivas emitidas
          </p>
        </div>

        {eventoId && (
          <Link
            href={`/inscricoes/novo?eventoId=${eventoId}`}
            className="inline-flex items-center justify-center text-xs font-semibold text-[#150606] bg-[#FF3B3B] hover:bg-[#ff5c5c] px-5 py-2.5 rounded-full transition-colors shadow-lg hover:shadow-[#FF3B3B]/20"
          >
            ＋ Nova Inscrição
          </Link>
        )}
      </div>

      {/* Seletor de Evento Reutilizável */}
      <SeletorEvento
        eventoIdSelecionado={eventoId}
        rotaBase="/inscricoes"
        label="Evento Selecionado:"
      />

      {/* Tabela ou Mensagem Informativa */}
      {validandoPosse ? (
        <div className="bg-[#1D0B0B] border border-white/10 p-12 rounded-3xl text-center shadow-xl">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
          <p className="text-white/50 text-sm">Validando permissões e carregando inscrições...</p>
        </div>
      ) : eventoAtual ? (
        <div className="bg-[#1D0B0B] border border-white/10 p-6 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{eventoAtual.nome}</h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    eventoAtual.status === "ABERTO"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : eventoAtual.status === "EM_ANDAMENTO"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : eventoAtual.status === "CONCLUIDO"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {eventoAtual.status}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-1">
                Local: {eventoAtual.local || "Não especificado"} • Data:{" "}
                {eventoAtual.dataEvento
                  ? new Date(eventoAtual.dataEvento).toLocaleString("pt-BR")
                  : "Não definida"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/palestrantes?eventoId=${eventoAtual.id}`}
                className="text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <span>🎙️</span> Ver Palestrantes
              </Link>
              <Link
                href={`/eventos/${eventoAtual.id}/editar`}
                className="text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors"
              >
                Editar Evento
              </Link>
            </div>
          </div>

          {/* Tabela de Inscrições */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Participante</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Data Inscrição</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Credencial</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {carregando ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-white/40 text-sm">
                      <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
                      <p>Carregando inscrições do evento...</p>
                    </td>
                  </tr>
                ) : inscricoes.length > 0 ? (
                  inscricoes.map((inscricao) => {
                    const isProcessando = processandoId === inscricao.id;

                    return (
                      <tr key={inscricao.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-sm font-mono text-white/50">
                          #{inscricao.id}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-white">
                          {inscricao.nomeParticipante}
                        </td>
                        <td className="px-6 py-4 text-sm text-white/70">
                          {inscricao.emailParticipante}
                        </td>
                        <td className="px-6 py-4 text-sm text-white/60">
                          {inscricao.dataInscricao
                            ? new Date(inscricao.dataInscricao).toLocaleString("pt-BR")
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-sm">
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
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {inscricao.credencial ? (
                            <Link
                              href={`/inscricoes/${inscricao.id}?eventoId=${eventoId}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF3B3B]/10 hover:bg-[#FF3B3B]/20 text-[#FF3B3B] border border-[#FF3B3B]/30 font-mono text-xs font-bold tracking-wider transition-colors"
                              title="Clique para ver detalhes da credencial"
                            >
                              <span>🛡️</span>
                              <span>{inscricao.credencial}</span>
                            </Link>
                          ) : (
                            <span className="text-white/30 text-xs font-mono">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <div className="flex items-center justify-end flex-wrap gap-2">
                            {/* Botão Confirmar (apenas quando PENDENTE) */}
                            {inscricao.status === "PENDENTE" && (
                              <button
                                type="button"
                                disabled={isProcessando}
                                onClick={() => handleConfirmar(inscricao)}
                                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {isProcessando ? "Confirmando..." : "Confirmar"}
                              </button>
                            )}

                            {/* Botão Cancelar (apenas se não estiver CANCELADA) */}
                            {inscricao.status !== "CANCELADA" && (
                              <button
                                type="button"
                                disabled={isProcessando}
                                onClick={() => handleCancelar(inscricao)}
                                className="text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                              >
                                Cancelar
                              </button>
                            )}

                            {/* Link de Detalhes */}
                            <Link
                              href={`/inscricoes/${inscricao.id}?eventoId=${eventoId}`}
                              className="text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              Detalhes
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-white/40 text-sm">
                      Nenhuma inscrição registrada para este evento.
                      <div className="mt-3">
                        <Link
                          href={`/inscricoes/novo?eventoId=${eventoId}`}
                          className="text-xs text-[#FF3B3B] underline hover:text-[#ff5c5c]"
                        >
                          ＋ Cadastrar a primeira inscrição
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Estado sem evento selecionado */
        <div className="bg-[#1D0B0B] border border-white/10 p-12 rounded-3xl text-center shadow-xl space-y-3">
          <div className="text-4xl mb-2">🛡️</div>
          <h2 className="text-lg font-bold text-white">Nenhum evento selecionado</h2>
          <p className="text-xs text-white/50 max-w-md mx-auto">
            Selecione um dos seus eventos no seletor acima para visualizar a lista de participantes inscritos e as credenciais geradas.
          </p>
        </div>
      )}
    </div>
  );
}

export default function InscricoesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
          <p className="text-white/50 text-sm">Carregando módulo de inscrições...</p>
        </div>
      }
    >
      <InscricoesConteudo />
    </Suspense>
  );
}
