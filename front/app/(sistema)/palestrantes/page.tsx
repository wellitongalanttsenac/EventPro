"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, isAxiosError } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import { Palestrante } from "@/app/types/palestrante";
import { Evento } from "@/app/types/evento";
import SeletorEvento from "@/app/components/SeletorEvento";

function PalestrantesConteudo() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryEventoId = searchParams.get("eventoId");
  const eventoId = queryEventoId ? Number(queryEventoId) : null;

  const [eventoAtual, setEventoAtual] = useState<Evento | null>(null);
  const [palestrantes, setPalestrantes] = useState<Palestrante[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [validandoPosse, setValidandoPosse] = useState(false);

  useEffect(() => {
    if (eventoId) {
      validarPosseECarregar(eventoId);
    } else {
      setEventoAtual(null);
      setPalestrantes([]);
    }
  }, [eventoId]);

  const validarPosseECarregar = async (id: number) => {
    try {
      setValidandoPosse(true);
      const organizadorLogado = getOrganizadorLogado();

      // 1. Validar posse do evento no backend
      const respEvento = await api.get<Evento>(`/eventos/${id}`);
      if (respEvento.status === 200 && respEvento.data) {
        const ev = respEvento.data;

        // Regra de posse: o evento deve pertencer ao organizador logado
        if (organizadorLogado && ev.organizador?.id !== organizadorLogado.id) {
          alert("Acesso negado: Você só pode gerenciar palestrantes de eventos criados por você.");
          router.push("/eventos");
          return;
        }

        setEventoAtual(ev);
        await carregarPalestrantes(id);
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

  const carregarPalestrantes = async (id: number) => {
    try {
      setCarregando(true);
      const resposta = await api.get<Palestrante[]>(`/eventos/${id}/palestrantes`);
      if (resposta.status === 200 && Array.isArray(resposta.data)) {
        setPalestrantes(resposta.data);
      } else {
        setPalestrantes([]);
      }
    } catch {
      setPalestrantes([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluir = async (palestrante: Palestrante) => {
    if (!eventoId || !palestrante.id) return;

    const organizadorLogado = getOrganizadorLogado();
    if (!organizadorLogado?.id) {
      alert("Sessão expirada. Faça login novamente.");
      router.push("/login");
      return;
    }

    const confirmou = confirm(
      `Tem certeza que deseja excluir o palestrante "${palestrante.nome}"?\n\nEsta ação é irreversível e removerá permanentemente o palestrante do evento.`
    );

    if (!confirmou) return;

    try {
      // DELETE /eventos/{eventoId}/palestrantes/{id}/excluir?organizadorId=...
      const resposta = await api.delete(
        `/eventos/${eventoId}/palestrantes/${palestrante.id}/excluir?organizadorId=${organizadorLogado.id}`
      );

      if (resposta.status === 200 || resposta.status === 204) {
        alert("Palestrante excluído com sucesso!");
        carregarPalestrantes(eventoId);
      } else {
        alert("Não foi possível excluir o palestrante.");
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 403) {
        alert("Apenas o organizador dono do evento pode excluir palestrantes!");
      } else {
        alert("Falha na comunicação com o servidor ao excluir palestrante.");
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
              Gestão de Palestrantes
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Gerencie os palestrantes vinculados aos workshops e palestras dos seus eventos
          </p>
        </div>

        {eventoId && (
          <Link
            href={`/palestrantes/novo?eventoId=${eventoId}`}
            className="inline-flex items-center justify-center text-xs font-semibold text-[#150606] bg-[#FF3B3B] hover:bg-[#ff5c5c] px-5 py-2.5 rounded-full transition-colors shadow-lg hover:shadow-[#FF3B3B]/20"
          >
            ＋ Novo Palestrante
          </Link>
        )}
      </div>

      {/* Seletor de Evento Reutilizável */}
      <SeletorEvento
        eventoIdSelecionado={eventoId}
        rotaBase="/palestrantes"
        label="Evento Selecionado:"
      />

      {/* Detalhes do Evento Selecionado */}
      {validandoPosse ? (
        <div className="bg-[#1D0B0B] border border-white/10 p-12 rounded-3xl text-center shadow-xl">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
          <p className="text-white/50 text-sm">Validando permissões e dados do evento...</p>
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
                href={`/inscricoes?eventoId=${eventoAtual.id}`}
                className="text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <span>🛡️</span> Ir para Inscrições
              </Link>
              <Link
                href={`/eventos/${eventoAtual.id}/editar`}
                className="text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors"
              >
                Editar Evento
              </Link>
            </div>
          </div>

          {/* Tabela de Palestrantes */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nome do Palestrante</th>
                  <th className="px-6 py-4">CPF</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {carregando ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/40 text-sm">
                      <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
                      <p>Carregando palestrantes do evento...</p>
                    </td>
                  </tr>
                ) : palestrantes.length > 0 ? (
                  palestrantes.map((palestrante) => (
                    <tr key={palestrante.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-white/50">
                        #{palestrante.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {palestrante.nome}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-white/70">
                        {palestrante.cpf}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">
                        {palestrante.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/palestrantes/${palestrante.id}/editar?eventoId=${eventoId}`}
                            className="text-xs font-medium text-[#FF3B3B] hover:text-[#ff5c5c] bg-[#FF3B3B]/10 hover:bg-[#FF3B3B]/20 border border-[#FF3B3B]/30 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Editar
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleExcluir(palestrante)}
                            className="text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/40 text-sm">
                      Nenhum palestrante cadastrado para este evento.
                      <div className="mt-3">
                        <Link
                          href={`/palestrantes/novo?eventoId=${eventoId}`}
                          className="text-xs text-[#FF3B3B] underline hover:text-[#ff5c5c]"
                        >
                          ＋ Cadastrar o primeiro palestrante
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
          <div className="text-4xl mb-2">🎙️</div>
          <h2 className="text-lg font-bold text-white">Nenhum evento selecionado</h2>
          <p className="text-xs text-white/50 max-w-md mx-auto">
            Selecione um dos seus eventos no campo acima para carregar e gerenciar a lista de palestrantes correspondente.
          </p>
        </div>
      )}
    </div>
  );
}

export default function PalestrantesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
          <p className="text-white/50 text-sm">Carregando módulo de palestrantes...</p>
        </div>
      }
    >
      <PalestrantesConteudo />
    </Suspense>
  );
}
