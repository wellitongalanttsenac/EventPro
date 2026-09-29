"use client";

import { Usuario, UsuarioFormProps } from "@/app/types/usuario";
import { api } from "@/app/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UsuarioForm({ usuarioExistente }: UsuarioFormProps) {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);

  const [usuario, setUsuario] = useState<Usuario>(
    usuarioExistente || new Usuario(null, "", "", "ATIVO", "", "")
  );

  const handleChange = (
    campo: "nome" | "email" | "cpf" | "senha",
    valor: string
  ) => {
    setUsuario(
      (anterior) =>
        new Usuario(
          anterior.id,
          campo === "nome" ? valor : anterior.nome,
          campo === "email" ? valor : anterior.email,
          anterior.status,
          campo === "cpf" ? valor : anterior.cpf,
          campo === "senha" ? valor : anterior.senha
        )
    );
  };

  const handleSalvar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSalvando(true);

    try {
      if (usuarioExistente && usuario.id) {
        // Modo Edição: Verbo HTTP PUT
        const resposta = await api.put(
          `/usuarios/${usuario.id}`,
          usuario
        );

        if (resposta.status === 200 || resposta.status === 204) {
          alert("Usuário atualizado com sucesso!");
          router.push("/usuarios");
        } else {
          alert("Não foi possível atualizar o usuário.");
        }
      } else {
        // Modo Criação: Verbo HTTP POST
        const resposta = await api.post(
          "/usuarios",
          usuario
        );

        if (resposta.status === 200 || resposta.status === 201) {
          alert("Usuário cadastrado com sucesso!");
          router.push("/usuarios");
        } else {
          alert("Não foi possível cadastrar o usuário.");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Erro de comunicação com o servidor ao salvar o usuário.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={handleSalvar} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            Nome Completo *
          </label>
          <input
            name="nome"
            type="text"
            required
            value={usuario.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            placeholder="Ex: Carlos Eduardo Silva"
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            CPF *
          </label>
          <input
            name="cpf"
            type="text"
            required
            value={usuario.cpf}
            onChange={(e) => handleChange("cpf", e.target.value)}
            placeholder="000.000.000-00"
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            E-mail *
          </label>
          <input
            name="email"
            type="email"
            required
            value={usuario.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="organizador@eventpro.com"
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            Senha *
          </label>
          <input
            name="senha"
            type="password"
            required
            value={usuario.senha}
            onChange={(e) => handleChange("senha", e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
        <Link
          href="/usuarios"
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-medium text-sm rounded-full transition-colors border border-white/10"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={salvando}
          className="px-7 py-2.5 bg-[#FF3B3B] hover:bg-[#ff5c5c] text-[#150606] font-semibold text-sm rounded-full shadow-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B] disabled:opacity-50"
        >
          {salvando ? "Salvando..." : usuarioExistente ? "Atualizar Usuário" : "Salvar Usuário"}
        </button>
      </div>
    </form>
  );
}
