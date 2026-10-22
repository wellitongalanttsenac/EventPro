"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, mensagemDeErro } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import { Palestrante } from "@/app/types/palestrante";
import SeletorEvento from "@/app/components/SeletorEvento";
import ResumoEvento from "@/app/components/ResumoEvento";
import AvisoErro from "@/app/components/AvisoErro";
import { useEventoDoOrganizador } from "@/app/hooks/useEventoDoOrganizador";

interface ListaCarregada {
  eventoId: number;
  palestrantes: Palestrante[];
  erro: string | null;
}

function PalestrantesConteudo() {
  const searchParams = useSearchParams();
  const queryEventoId = searchParams.get("eventoId");
  const eventoId = queryEventoId ? Number(queryEventoId) : null;

  const { evento, erro: erroEvento, carregando: validandoPosse } = useEventoDoOrganizador(
    eventoId,
    "gerenciar palestrantes"
  );

  const [lista, setLista] = useState<ListaCarregada | null>(null);
  const [versao, setVersao] = useState(0);

  // Só busca a lista depois que a posse do evento foi confirmada
  const eventoConfirmadoId = evento?.id ?? null;

  useEffect(() => {
    if (!eventoConfirmadoId) return;
    let ativo = true;
    api
      .get<Palestrante[]>(`/eventos/${eventoConfirmadoId}/palestrantes`)
      .then((resposta) => {
        if (ativo) setLista({ eventoId: eventoConfirmadoId, palestrantes: resposta.data, erro: null });
      })
      .catch((error) => {
        if (ativo) {
          setLista({
            eventoId: eventoConfirmadoId,
            palestrantes: [],
            erro: mensagemDeErro(error, "Não foi possível carregar os palestrantes."),
          });
        }
      });
    return () => {
      ativo = false;
    };
  }, [eventoConfirmadoId, versao]);

  const listaAtual = lista && lista.eventoId === eventoConfirmadoId ? lista : null;
  const palestrantes = listaAtual?.palestrantes ?? [];

  const handleExcluir = async (palestrante: Palestrante) => {
    const organizadorLogado = getOrganizadorLogado();
    if (!eventoId || !organizadorLogado) return;

    const confirmou = confirm(
      `Excluir o palestrante "${palestrante.nome}"?\n\nEsta ação não pode ser desfeita.`
    );
    if (!confirmou) return;

    try {
      await api.delete(
        `/eventos/${eventoId}/palestrantes/${palestrante.id}/excluir?organizadorId=${organizadorLogado.id}`
      );
      setVersao((v) => v + 1);
    } catch (error) {
      alert(mensagemDeErro(error, "Não foi possível excluir o palestrante."));
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
              Gestão de Palestrantes
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Palestrantes vinculados aos workshops e palestras dos seus eventos
          </p>
        </div>

        {evento && (
          <Link
            href={`/palestrantes/novo?eventoId=${evento.id}`}
            className="inline-flex items-center justify-center text-xs font-semibold text-[#150606] bg-[#FF3B3B] hover:bg-[#ff5c5c] px-5 py-2.5 rounded-full transition-colors shadow-lg hover:shadow-[#FF3B3B]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3B3B]"
          >
            ＋ Novo palestrante
          </Link>
        )}
      </div>

      <SeletorEvento eventoIdSelecionado={eventoId} rotaBase="/palestrantes" label="Evento selecionado" />

      {validandoPosse ? (
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
            atalho={{ href: `/inscricoes?eventoId=${evento.id}`, rotulo: "Ir para inscrições", icone: "🛡️" }}
          />

          <AvisoErro mensagem={listaAtual?.erro ?? null} />

          {/* Tabela de Palestrantes */}
          <div className="md:overflow-x-auto -mx-5 sm:-mx-6 md:mx-0">
            <table className="tabela-responsiva w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nome do palestrante</th>
                  <th className="px-6 py-4">CPF</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {!listaAtual ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/40 text-sm">
                      <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
                      <p>Carregando palestrantes do evento...</p>
                    </td>
                  </tr>
                ) : palestrantes.length > 0 ? (
                  palestrantes.map((palestrante) => (
                    <tr key={palestrante.id} className="hover:bg-white/[0.02] transition-colors">
                      <td data-label="ID" className="px-6 py-4 text-sm font-mono text-white/50">
                        #{palestrante.id}
                      </td>
                      <td className="celula-principal px-6 py-4 text-sm font-semibold text-white">
                        {palestrante.nome}
                      </td>
                      <td data-label="CPF" className="px-6 py-4 text-sm font-mono text-white/70 whitespace-nowrap">
                        {palestrante.cpf}
                      </td>
                      <td data-label="E-mail" className="px-6 py-4 text-sm text-white/70 break-all">
                        {palestrante.email}
                      </td>
                      <td className="celula-acoes px-6 py-4 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/palestrantes/${palestrante.id}/editar?eventoId=${evento.id}`}
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
                      Nenhum palestrante neste evento ainda.
                      <div className="mt-3">
                        <Link
                          href={`/palestrantes/novo?eventoId=${evento.id}`}
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
        <div className="bg-[#1D0B0B] border border-white/10 p-8 sm:p-12 rounded-3xl text-center shadow-xl space-y-3">
          <div className="text-4xl mb-2" aria-hidden="true">🎙️</div>
          <h2 className="text-lg font-bold text-white">Nenhum evento selecionado</h2>
          <p className="text-xs text-white/50 max-w-md mx-auto">
            Escolha um dos seus eventos no campo acima para ver e gerenciar os palestrantes.
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
          <p className="text-white/50 text-sm">Carregando palestrantes...</p>
        </div>
      }
    >
      <PalestrantesConteudo />
    </Suspense>
  );
}
