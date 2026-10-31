"use client";

import AvisoErro from "@/app/components/AvisoErro";
import StatusBadge from "@/app/components/StatusBadge";
import { RootState } from "@/app/redux/store";
import { mensagemDeErro } from "@/app/services/api";
import { atualizarStatusUsuario, buscarListaUsuarios, deletarUsuario } from "@/app/services/usuarioService";
import { Usuario } from "@/app/types/usuario";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CLASSE_TH = "px-6 py-4 text-xs font-semibold tracking-wider uppercase text-white/50";

export default function Usuarios() {
  const usuarioLogado = useSelector((state: RootState) => state.auth.usuario);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await buscarListaUsuarios();
        setUsuarios(dados);
        setErro(null);
      } catch (error) {
        setErro(mensagemDeErro(error, "Não foi possível carregar os organizadores."));
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [versao]);

  const recarregarDados = () => setVersao((valorAnterior) => valorAnterior + 1);

  const handleDeletarUsuario = async (usuario: Usuario) => {
    const confirmou = confirm(
      `Excluir o organizador "${usuario.nome}"?\n\nO cadastro fica com status Excluído e pode ser reativado depois.`
    );
    if (!confirmou) return;

    try {
      await deletarUsuario(usuario.id || 0);
      recarregarDados();
    } catch (error) {
      alert(mensagemDeErro(error, "Não foi possível excluir o organizador."));
    }
  };

  const handleAlterarStatusUsuario = async (usuario: Usuario) => {
    try {
      await atualizarStatusUsuario(usuario);
      recarregarDados();
    } catch (error) {
      alert(mensagemDeErro(error, "Não foi possível alterar o status."));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1D0B0B] border border-white/10 p-5 sm:p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[#FF3B3B] text-xl leading-none" aria-hidden="true">✱</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Gestão de Organizadores
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Usuários com permissão para gerenciar workshops e palestras
          </p>
        </div>

        <Link
          href="/usuarios/novo"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF3B3B] text-[#150606] font-semibold text-sm rounded-full hover:bg-[#ff5c5c] transition-colors shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3B3B]"
        >
          <span aria-hidden="true">+</span> Novo organizador
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
                <th className={CLASSE_TH}>Nome</th>
                <th className={CLASSE_TH}>CPF</th>
                <th className={CLASSE_TH}>E-mail</th>
                <th className={CLASSE_TH}>Status</th>
                <th className={`${CLASSE_TH} text-right`}>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {carregando ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/50 text-sm">
                    Carregando organizadores...
                  </td>
                </tr>
              ) : usuarios.length > 0 ? (
                usuarios.map((usuario) => {
                  const ehVoce = usuarioLogado?.id === usuario.id;

                  return (
                    <tr key={usuario.id} className="hover:bg-white/[0.03] transition-colors">
                      <td data-label="ID" className="px-6 py-4 text-sm font-medium text-white/70">
                        #{usuario.id}
                      </td>
                      <td className="celula-principal px-6 py-4 text-sm font-medium text-white">
                        <span className="inline-flex flex-wrap items-center gap-2">
                          {usuario.nome}
                          {ehVoce && (
                            <span className="text-[10px] bg-[#FF3B3B]/10 text-[#FF3B3B] border border-[#FF3B3B]/30 rounded-full px-2 py-0.5">
                              Você
                            </span>
                          )}
                        </span>
                      </td>
                      <td data-label="CPF" className="px-6 py-4 text-sm text-white/70 font-mono whitespace-nowrap">
                        {usuario.cpf}
                      </td>
                      <td data-label="E-mail" className="px-6 py-4 text-sm text-white/70 break-all">
                        {usuario.email}
                      </td>
                      <td data-label="Status" className="px-6 py-4 text-sm">
                        <StatusBadge status={usuario.status} />
                      </td>
                      <td className="celula-acoes px-6 py-4 text-sm text-right">
                        <div className="flex items-center justify-end flex-wrap gap-2">
                          <Link
                            href={`/usuarios/${usuario.id}/editar`}
                            className="text-xs font-medium text-[#FF3B3B] hover:text-[#ff5c5c] bg-[#FF3B3B]/10 hover:bg-[#FF3B3B]/20 border border-[#FF3B3B]/30 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Editar
                          </Link>

                          {!ehVoce && (
                            <button
                              type="button"
                              onClick={() => handleAlterarStatusUsuario(usuario)}
                              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                                usuario.status === "ATIVO"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              }`}
                            >
                              {usuario.status === "ATIVO" ? "Bloquear" : "Reativar"}
                            </button>
                          )}

                          {!ehVoce && usuario.status !== "EXCLUIDO" && (
                            <button
                              type="button"
                              onClick={() => handleDeletarUsuario(usuario)}
                              className="text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Excluir
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40 text-sm">
                    Nenhum organizador cadastrado ainda.
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
