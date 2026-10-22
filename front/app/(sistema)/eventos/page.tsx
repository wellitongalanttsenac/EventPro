"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Evento, EnumStatusEvento } from "@/app/types/evento";
import { api, mensagemDeErro } from "@/app/services/api";
import { useOrganizadorLogado } from "@/app/services/auth";
import StatusBadge, { classesStatus, rotuloStatus } from "@/app/components/StatusBadge";
import AvisoErro from "@/app/components/AvisoErro";
import { formatarDataHora } from "@/app/utils/formatacao";

const CLASSE_TH = "px-6 py-4 text-xs font-semibold tracking-wider uppercase text-white/50";
const STATUS_EVENTO: EnumStatusEvento[] = ["ABERTO", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO"];

export default function EventosPage() {
  const organizadorLogado = useOrganizadorLogado();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;
    api
      .get<Evento[]>("/eventos")
      .then((resposta) => {
        if (!ativo) return;
        setEventos(resposta.data);
        setErro(null);
      })
      .catch((error) => {
        if (ativo) setErro(mensagemDeErro(error, "Não foi possível carregar os eventos."));
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [versao]);

  const recarregar = () => setVersao((v) => v + 1);

  const handleCancelarEvento = async (evento: Evento) => {
    if (!organizadorLogado) return;

    const confirmou = confirm(`Cancelar o evento "${evento.nome}"?\n\nO status passa para Cancelado.`);
    if (!confirmou) return;

    try {
      await api.delete(`/eventos/${evento.id}/excluir?organizadorId=${organizadorLogado.id}`);
      recarregar();
    } catch (error) {
      alert(mensagemDeErro(error, "Não foi possível cancelar o evento."));
    }
  };

  const handleAlterarStatus = async (evento: Evento, novoStatus: EnumStatusEvento) => {
    if (!organizadorLogado || evento.status === novoStatus) return;

    try {
      await api.patch(`/eventos/${evento.id}/status?organizadorId=${organizadorLogado.id}`, {
        status: novoStatus,
      });
      recarregar();
    } catch (error) {
      alert(mensagemDeErro(error, "Não foi possível alterar o status do evento."));
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
              Gestão de Eventos & Workshops
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Todos os eventos do sistema. Você só pode alterar os que você organiza.
          </p>
        </div>

        <Link
          href="/eventos/novo"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF3B3B] text-[#150606] font-semibold text-sm rounded-full hover:bg-[#ff5c5c] transition-colors shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3B3B]"
        >
          <span aria-hidden="true">+</span> Novo evento
        </Link>
      </div>

      <AvisoErro mensagem={erro} />

      {/* Tabela de Listagem */}
      <div className="bg-[#1D0B0B] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="md:overflow-x-auto w-full">
          <table className="tabela-responsiva w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className={CLASSE_TH}>ID</th>
                <th className={CLASSE_TH}>Evento / Workshop</th>
                <th className={CLASSE_TH}>Data & Local</th>
                <th className={CLASSE_TH}>Organizador</th>
                <th className={CLASSE_TH}>Status</th>
                <th className={`${CLASSE_TH} text-right`}>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {carregando ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/50 text-sm">
                    Carregando eventos...
                  </td>
                </tr>
              ) : eventos.length > 0 ? (
                eventos.map((evento) => {
                  const ehDono = Boolean(organizadorLogado) && evento.organizador?.id === organizadorLogado?.id;

                  return (
                    <tr key={evento.id} className="hover:bg-white/[0.03] transition-colors">
                      <td data-label="ID" className="px-6 py-4 text-sm font-medium text-white/70">
                        #{evento.id}
                      </td>
                      <td className="celula-principal px-6 py-4 text-sm font-medium text-white max-w-xs">
                        <div className="font-semibold text-white">{evento.nome}</div>
                        <div className="text-xs text-white/40 line-clamp-2 md:line-clamp-1 mt-0.5">
                          {evento.descricao}
                        </div>
                      </td>
                      <td data-label="Data e local" className="px-6 py-4 text-sm text-white/70">
                        <div>
                          <div className="text-xs font-medium text-white/90 whitespace-nowrap">
                            {formatarDataHora(evento.dataEvento)}
                          </div>
                          <div className="text-xs text-white/40 mt-0.5">📍 {evento.local}</div>
                        </div>
                      </td>
                      <td data-label="Organizador" className="px-6 py-4 text-sm text-white/80">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-white/90">
                            {evento.organizador?.nome || "Não informado"}
                          </span>
                          {ehDono && (
                            <span className="text-[10px] bg-[#FF3B3B]/10 text-[#FF3B3B] border border-[#FF3B3B]/30 rounded-full px-2 py-0.5">
                              Você
                            </span>
                          )}
                        </div>
                      </td>
                      <td data-label="Status" className="px-6 py-4 text-sm">
                        {ehDono ? (
                          <select
                            value={evento.status}
                            aria-label={`Status do evento ${evento.nome}`}
                            onChange={(e) => handleAlterarStatus(evento, e.target.value as EnumStatusEvento)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer bg-[#1D0B0B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B3B] ${classesStatus(evento.status)}`}
                          >
                            {STATUS_EVENTO.map((opcao) => (
                              <option key={opcao} value={opcao} className="bg-[#1D0B0B] text-white">
                                {rotuloStatus(opcao)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <StatusBadge status={evento.status} />
                        )}
                      </td>
                      <td className="celula-acoes px-6 py-4 text-sm text-right">
                        {ehDono ? (
                          <div className="flex items-center justify-end flex-wrap gap-2">
                            <Link
                              href={`/palestrantes?eventoId=${evento.id}`}
                              className="text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <span aria-hidden="true">🎙️</span> Palestrantes
                            </Link>

                            <Link
                              href={`/inscricoes?eventoId=${evento.id}`}
                              className="text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <span aria-hidden="true">🛡️</span> Inscrições
                            </Link>

                            <Link
                              href={`/eventos/${evento.id}/editar`}
                              className="text-xs font-medium text-[#FF3B3B] hover:text-[#ff5c5c] bg-[#FF3B3B]/10 hover:bg-[#FF3B3B]/20 border border-[#FF3B3B]/30 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Editar
                            </Link>

                            {evento.status !== "CANCELADO" && (
                              <button
                                type="button"
                                onClick={() => handleCancelarEvento(evento)}
                                className="text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-2.5 py-1.5 rounded-lg transition-colors"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-white/30 italic">Somente visualização</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40 text-sm">
                    Nenhum evento cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
