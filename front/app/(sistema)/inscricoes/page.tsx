"use client";

import AvisoErro from "@/app/components/AvisoErro";
import ResumoEvento from "@/app/components/ResumoEvento";
import SeletorEvento from "@/app/components/SeletorEvento";
import StatusBadge from "@/app/components/StatusBadge";
import { RootState } from "@/app/redux/store";
import { mensagemDeErro } from "@/app/services/api";
import { consultaEventoDoOrganizador } from "@/app/services/eventoService";
import { atualizarStatusInscricao, buscarListaInscricoes, cancelarInscricao } from "@/app/services/inscricaoService";
import { Evento } from "@/app/types/evento";
import { Inscricao } from "@/app/types/inscricao";
import { formatarDataHora } from "@/app/utils/formatacao";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ListaInscricoes({ eventoId }: { eventoId: number | null }) {
  const router = useRouter();
  const organizadorId = useSelector((state: RootState) => state.auth.usuario?.id ?? null);

  const [evento, setEvento] = useState<Evento | null>(null);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [validandoEvento, setValidandoEvento] = useState(Boolean(eventoId));
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [erroEvento, setErroEvento] = useState<string | null>(null);
  const [erroLista, setErroLista] = useState<string | null>(null);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  useEffect(() => {
    if (!eventoId) return;

    let ativo = true;

    const carregarInscricoes = async () => {
      try {
        const dados = await buscarListaInscricoes(eventoId);
        setInscricoes(dados);
      } catch (error) {
        setErroLista(mensagemDeErro(error, "Não foi possível carregar as inscrições."));
      } finally {
        setCarregandoLista(false);
      }
    };

    // Só busca a lista depois que a posse do evento foi confirmada
    const carregarDados = async () => {
      try {
        const valorEventoBack = await consultaEventoDoOrganizador(eventoId, organizadorId);
        if (!ativo) return;
        if (!valorEventoBack) {
          alert("Você só pode gerenciar inscrições em eventos organizados por você.");
          router.push("/eventos");
          return;
        }
        setEvento(valorEventoBack);
        setValidandoEvento(false);
        carregarInscricoes();
      } catch (error) {
        setErroEvento(mensagemDeErro(error, "Não foi possível carregar o evento."));
        setValidandoEvento(false);
      }
    };

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [eventoId, organizadorId, router]);

  // A API devolve a inscrição atualizada; troca só a linha alterada
  const substituirInscricao = (atualizada: Inscricao) => {
    setInscricoes((anteriores) => anteriores.map((item) => (item.id === atualizada.id ? atualizada : item)));
  };

  const handleConfirmarInscricao = async (inscricao: Inscricao) => {
    if (!eventoId) return;

    setProcessandoId(inscricao.id);
    try {
      substituirInscricao(await atualizarStatusInscricao(eventoId, inscricao.id || 0, "CONFIRMADA"));
    } catch (error) {
      alert(mensagemDeErro(error, "Não foi possível confirmar a inscrição."));
    } finally {
      setProcessandoId(null);
    }
  };

  const handleCancelarInscricao = async (inscricao: Inscricao) => {
    if (!eventoId) return;

    const confirmou = confirm(
      `Cancelar a inscrição de "${inscricao.nomeParticipante}"?\n\nA credencial deixa de valer para a entrada no evento.`
    );
    if (!confirmou) return;

    setProcessandoId(inscricao.id);
    try {
      await cancelarInscricao(eventoId, inscricao.id || 0);
      substituirInscricao({ ...inscricao, status: "CANCELADA" });
    } catch (error) {
      alert(mensagemDeErro(error, "Não foi possível cancelar a inscrição."));
    } finally {
      setProcessandoId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1D0B0B] border border-white/10 p-5 sm:p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[#FF3B3B] text-xl leading-none" aria-hidden="true">✱</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Gestão de Inscrições & Credenciais
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Confirme participantes e acompanhe as credenciais emitidas para cada evento
          </p>
        </div>

        {evento && (
          <Link
            href={`/inscricoes/novo?eventoId=${evento.id}`}
            className="inline-flex items-center justify-center text-xs font-semibold text-[#150606] bg-[#FF3B3B] hover:bg-[#ff5c5c] px-5 py-2.5 rounded-full transition-colors shadow-lg hover:shadow-[#FF3B3B]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3B3B]"
          >
            ＋ Nova inscrição
          </Link>
        )}
      </div>

      <SeletorEvento eventoIdSelecionado={eventoId} rotaBase="/inscricoes" label="Evento selecionado" />

      {validandoEvento ? (
        <div className="bg-[#1D0B0B] border border-white/10 p-12 rounded-3xl text-center shadow-xl">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
          <p className="text-white/50 text-sm">Validando o evento selecionado...</p>
        </div>
      ) : erroEvento ? (
        <AvisoErro mensagem={erroEvento} />
      ) : evento ? (
        <div className="bg-[#1D0B0B] border border-white/10 p-5 sm:p-6 rounded-3xl shadow-xl space-y-6">
          <ResumoEvento
            evento={evento}
            atalho={{ href: `/palestrantes?eventoId=${evento.id}`, rotulo: "Ver palestrantes", icone: "🎙️" }}
          />

          <AvisoErro mensagem={erroLista} />

          {/* Tabela de Inscrições */}
          <div className="md:overflow-x-auto -mx-5 sm:-mx-6 md:mx-0">
            <table className="tabela-responsiva w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Participante</th>
                  <th className="px-6 py-4">Data da inscrição</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Credencial</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {carregandoLista ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-white/40 text-sm">
                      <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
                      <p>Carregando inscrições do evento...</p>
                    </td>
                  </tr>
                ) : inscricoes.length > 0 ? (
                  inscricoes.map((inscricao) => {
                    const isProcessando = processandoId === inscricao.id;

                    return (
                      <tr key={inscricao.id} className="hover:bg-white/[0.02] transition-colors">
                        <td data-label="ID" className="px-6 py-4 text-sm font-mono text-white/50">
                          #{inscricao.id}
                        </td>
                        <td className="celula-principal px-6 py-4 text-sm">
                          <div className="font-semibold text-white">{inscricao.nomeParticipante}</div>
                          <div className="text-xs text-white/50 break-all mt-0.5">{inscricao.emailParticipante}</div>
                        </td>
                        <td data-label="Inscrito em" className="px-6 py-4 text-sm text-white/60 whitespace-nowrap">
                          {formatarDataHora(inscricao.dataInscricao)}
                        </td>
                        <td data-label="Status" className="px-6 py-4 text-sm">
                          <StatusBadge status={inscricao.status} />
                        </td>
                        <td data-label="Credencial" className="px-6 py-4 text-sm">
                          {inscricao.credencial ? (
                            <Link
                              href={`/inscricoes/${inscricao.id}?eventoId=${evento.id}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF3B3B]/10 hover:bg-[#FF3B3B]/20 text-[#FF3B3B] border border-[#FF3B3B]/30 font-mono text-xs font-bold tracking-wider transition-colors"
                              title="Ver detalhes da credencial"
                            >
                              <span aria-hidden="true">🛡️</span>
                              <span>{inscricao.credencial}</span>
                            </Link>
                          ) : (
                            <span className="text-white/30 text-xs font-mono">—</span>
                          )}
                        </td>
                        <td className="celula-acoes px-6 py-4 text-sm text-right">
                          <div className="flex items-center justify-end flex-wrap gap-2">
                            {inscricao.status === "PENDENTE" && (
                              <button
                                type="button"
                                disabled={isProcessando}
                                onClick={() => handleConfirmarInscricao(inscricao)}
                                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {isProcessando ? "Confirmando..." : "Confirmar"}
                              </button>
                            )}

                            {inscricao.status !== "CANCELADA" && (
                              <button
                                type="button"
                                disabled={isProcessando}
                                onClick={() => handleCancelarInscricao(inscricao)}
                                className="text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                              >
                                Cancelar
                              </button>
                            )}

                            <Link
                              href={`/inscricoes/${inscricao.id}?eventoId=${evento.id}`}
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
                    <td colSpan={6} className="px-6 py-12 text-center text-white/40 text-sm">
                      Nenhuma inscrição neste evento ainda.
                      <div className="mt-3">
                        <Link
                          href={`/inscricoes/novo?eventoId=${evento.id}`}
                          className="text-xs text-[#FF3B3B] underline hover:text-[#ff5c5c]"
                        >
                          ＋ Registrar a primeira inscrição
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
        <div className="bg-[#1D0B0B] border border-white/10 p-8 sm:p-12 rounded-3xl text-center shadow-xl space-y-3">
          <div className="text-4xl mb-2" aria-hidden="true">🛡️</div>
          <h2 className="text-lg font-bold text-white">Nenhum evento selecionado</h2>
          <p className="text-xs text-white/50 max-w-md mx-auto">
            Escolha um dos seus eventos no campo acima para ver os participantes e as credenciais.
          </p>
        </div>
      )}
    </div>
  );
}

function InscricoesConteudo() {
  const searchParams = useSearchParams();
  const queryEventoId = searchParams.get("eventoId");
  const eventoId = queryEventoId ? Number(queryEventoId) : null;

  // A key recria a tela ao trocar de evento, descartando os dados do evento anterior
  return <ListaInscricoes key={eventoId ?? "sem-evento"} eventoId={eventoId} />;
}

export default function Inscricoes() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
          <p className="text-white/50 text-sm">Carregando inscrições...</p>
        </div>
      }
    >
      <InscricoesConteudo />
    </Suspense>
  );
}
