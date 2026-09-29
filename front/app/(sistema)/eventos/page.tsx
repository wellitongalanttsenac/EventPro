"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Evento, EnumStatusEvento } from "@/app/types/evento";
import { api } from "@/app/services/api";
import { getOrganizadorLogado, OrganizadorLogado } from "@/app/services/auth";

function formatarDataHora(dataIso?: string) {
  if (!dataIso) return "-";
  const d = new Date(dataIso);
  if (isNaN(d.getTime())) return dataIso;
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [organizadorLogado, setOrganizadorLogado] =
    useState<OrganizadorLogado | null>(null);

  useEffect(() => {
    const org = getOrganizadorLogado();
    setOrganizadorLogado(org);
    carregarEventos();
  }, []);

  const carregarEventos = async () => {
    setCarregando(true);
    try {
      const resposta = await api.get<Evento[]>("/eventos");
      setEventos(resposta.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar lista de eventos! Verifique se o backend está em execução.");
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelarEvento = async (evento: Evento) => {
    if (!evento.id || !organizadorLogado?.id) return;

    const confirmou = confirm(
      `Deseja realmente cancelar o evento "${evento.nome}"?`
    );
    if (!confirmou) return;

    try {
      const resposta = await api.delete(
        `/eventos/${evento.id}/excluir?organizadorId=${organizadorLogado.id}`
      );

      if (resposta.status === 200) {
        alert("Evento cancelado com sucesso!");
        carregarEventos();
      } else {
        alert("Erro ao cancelar evento!");
      }
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 403) {
        alert("Apenas o organizador que criou o evento pode cancelá-lo!");
      } else {
        alert("Falha na comunicação com o servidor ao cancelar evento.");
      }
    }
  };

  const handleAlterarStatus = async (
    evento: Evento,
    novoStatus: EnumStatusEvento
  ) => {
    if (!evento.id || !organizadorLogado?.id || evento.status === novoStatus)
      return;

    try {
      const resposta = await api.patch(
        `/eventos/${evento.id}/status?organizadorId=${organizadorLogado.id}`,
        { status: novoStatus }
      );

      if (resposta.status === 200) {
        alert(`Status alterado para ${novoStatus} com sucesso!`);
        carregarEventos();
      } else {
        alert("Erro ao atualizar status do evento!");
      }
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 403) {
        alert("Apenas o organizador que criou o evento pode alterar seu status!");
      } else {
        alert("Falha na comunicação com o servidor ao alterar status.");
      }
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
              Gestão de Eventos & Workshops
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Listagem geral com controle de posse — ações liberadas para os eventos criados por você ({organizadorLogado?.nome || "Organizador"})
          </p>
        </div>

        <Link
          href="/eventos/novo"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF3B3B] text-[#150606] font-semibold text-sm rounded-full hover:bg-[#ff5c5c] transition-colors shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B]"
        >
          <span>+</span> Novo Evento
        </Link>
      </div>

      {/* Tabela de Listagem */}
      <div className="bg-[#1D0B0B] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-white/50">
                  ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-white/50">
                  Evento / Workshop
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-white/50">
                  Data & Local
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-white/50">
                  Organizador
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-white/50">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-white/50 text-right">
                  Ações & Atalhos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {carregando ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/50 text-sm">
                    Carregando dados dos eventos...
                  </td>
                </tr>
              ) : eventos.length > 0 ? (
                eventos.map((evento) => {
                  const ehDono =
                    organizadorLogado &&
                    evento.organizador?.id === organizadorLogado.id;

                  return (
                    <tr
                      key={evento.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-white/70">
                        #{evento.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white max-w-xs">
                        <div className="font-semibold text-white">
                          {evento.nome}
                        </div>
                        <div className="text-xs text-white/40 line-clamp-1 mt-0.5">
                          {evento.descricao}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        <div className="text-xs font-medium text-white/90">
                          {formatarDataHora(evento.dataEvento)}
                        </div>
                        <div className="text-xs text-white/40 mt-0.5">
                          📍 {evento.local}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-white/90">
                            {evento.organizador?.nome || "Não informado"}
                          </span>
                          {ehDono && (
                            <span className="text-[10px] bg-[#FF3B3B]/10 text-[#FF3B3B] border border-[#FF3B3B]/30 rounded-full px-2 py-0.2">
                              Você
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {ehDono ? (
                          <select
                            value={evento.status}
                            onChange={(e) =>
                              handleAlterarStatus(
                                evento,
                                e.target.value as EnumStatusEvento
                              )
                            }
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer bg-[#1D0B0B] transition-colors focus:outline-none focus:ring-1 focus:ring-[#FF3B3B] ${
                              evento.status === "ABERTO"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-400"
                                : evento.status === "EM_ANDAMENTO"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:border-amber-400"
                                : evento.status === "CONCLUIDO"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:border-blue-400"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:border-rose-400"
                            }`}
                            title="Clique para alterar o status do evento"
                          >
                            <option value="ABERTO" className="bg-[#1D0B0B] text-emerald-400">
                              ABERTO
                            </option>
                            <option value="EM_ANDAMENTO" className="bg-[#1D0B0B] text-amber-400">
                              EM_ANDAMENTO
                            </option>
                            <option value="CONCLUIDO" className="bg-[#1D0B0B] text-blue-400">
                              CONCLUIDO
                            </option>
                            <option value="CANCELADO" className="bg-[#1D0B0B] text-rose-400">
                              CANCELADO
                            </option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              evento.status === "ABERTO"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : evento.status === "EM_ANDAMENTO"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : evento.status === "CONCLUIDO"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}
                          >
                            {evento.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        {ehDono ? (
                          <div className="flex items-center justify-end flex-wrap gap-2">
                            {/* Atalhos para Palestrantes e Inscrições */}
                            <Link
                              href={`/palestrantes?eventoId=${evento.id}`}
                              className="text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                              title="Gerenciar palestrantes deste evento"
                            >
                              <span>🎙️</span> Palestrantes
                            </Link>

                            <Link
                              href={`/inscricoes?eventoId=${evento.id}`}
                              className="text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                              title="Gerenciar inscrições e credenciais"
                            >
                              <span>🛡️</span> Inscrições
                            </Link>

                            <Link
                              href={`/eventos/${evento.id}/editar`}
                              className="text-xs font-medium text-[#FF3B3B] hover:text-[#ff5c5c] bg-[#FF3B3B]/10 hover:bg-[#FF3B3B]/20 border border-[#FF3B3B]/30 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Editar
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleCancelarEvento(evento)}
                              className="text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-white/30 italic">
                            Apenas visualização
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40 text-sm">
                    Nenhum evento encontrado no sistema.
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
