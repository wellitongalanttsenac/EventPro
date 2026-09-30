"use client";

import { Usuario } from "@/app/types/usuario";
import { api } from "@/app/services/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const resposta = await api.get<Usuario[]>("/usuarios");
      setUsuarios(resposta.data);
    } catch {
      alert("Erro ao carregar lista de usuários! Verifique se o backend está em execução.");
    } finally {
      setCarregando(false);
    }
  };

  const handleDeletarUsuario = async (usuario: Usuario) => {
    if (!usuario.id) return;

    const confirmou = confirm(`Tem certeza que deseja inativar o usuário "${usuario.nome}"?`);
    if (!confirmou) return;

    try {
      const resposta = await api.delete(`/usuarios/${usuario.id}/excluir`);

      if (resposta.status === 200) {
        alert("Usuário inativado com sucesso!");
        carregarDados();
      } else {
        alert("Erro ao inativar usuário!");
      }
    } catch {
      alert("Falha na comunicação com o servidor ao excluir.");
    }
  };

  const handleAlterarStatusUsuario = async (usuario: Usuario) => {
    if (!usuario.id) return;

    const novoStatus = usuario.status === "ATIVO" ? "BLOQUEADO" : "ATIVO";

    try {
      const resposta = await api.patch(
        `/usuarios/${usuario.id}/status`,
        { status: novoStatus }
      );

      if (resposta.status === 200) {
        alert(`Status alterado para ${novoStatus} com sucesso!`);
        carregarDados();
      } else {
        alert("Erro ao atualizar status!");
      }
    } catch {
      alert("Falha na comunicação com o servidor ao alterar status.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1D0B0B] border border-white/10 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[#FF3B3B] text-xl leading-none">✱</span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Gestão de Organizadores
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Controle de usuários com permissão para gerenciar workshops e palestras
          </p>
        </div>

        <Link
          href="/usuarios/novo"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF3B3B] text-[#150606] font-semibold text-sm rounded-full hover:bg-[#ff5c5c] transition-colors shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B]"
        >
          <span>+</span> Novo Usuário
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
                  Nome
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-white/50">
                  CPF
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-white/50">
                  E-mail
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-white/50">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-white/50 text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {carregando ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/50 text-sm">
                    Carregando dados dos organizadores...
                  </td>
                </tr>
              ) : usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white/70">
                      #{usuario.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {usuario.nome}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70 font-mono">
                      {usuario.cpf}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">
                      {usuario.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          usuario.status === "ATIVO"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : usuario.status === "BLOQUEADO"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {usuario.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/usuarios/${usuario.id}/editar`}
                          className="text-xs font-medium text-[#FF3B3B] hover:text-[#ff5c5c] bg-[#FF3B3B]/10 hover:bg-[#FF3B3B]/20 border border-[#FF3B3B]/30 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Editar
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleAlterarStatusUsuario(usuario)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                            usuario.status === "ATIVO"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                          }`}
                        >
                          {usuario.status === "ATIVO" ? "Bloquear" : "Ativar"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletarUsuario(usuario)}
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
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40 text-sm">
                    Nenhum organizador encontrado no banco de dados.
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