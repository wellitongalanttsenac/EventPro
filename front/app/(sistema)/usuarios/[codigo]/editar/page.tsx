"use client";

import { Usuario } from "@/app/types/usuario";
import { api, mensagemDeErro } from "@/app/services/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import UsuarioForm from "../../components/UsuarioForm";

export default function EditarUsuarioPage() {
  const parametro = useParams();
  const codigo = Number(parametro.codigo);

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    api
      .get<Usuario>(`/usuarios/${codigo}`)
      .then((resposta) => {
        if (ativo) setUsuario(resposta.data);
      })
      .catch((error) => {
        if (ativo) setErro(mensagemDeErro(error, "Não foi possível carregar o organizador."));
      });
    return () => {
      ativo = false;
    };
  }, [codigo]);

  if (erro) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
        <p className="text-rose-400 mb-4">{erro}</p>
        <Link href="/usuarios" className="text-xs text-[#FF3B3B] underline hover:text-[#ff5c5c]">
          Voltar para a listagem
        </Link>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-[#1D0B0B] border border-white/10 rounded-3xl">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#FF3B3B] border-t-transparent rounded-full mb-3" />
        <p className="text-white/50 text-sm">Carregando dados do organizador #{codigo}...</p>
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
              Editar organizador #{codigo}
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Atualize as informações cadastrais do organizador selecionado
          </p>
        </div>

        <Link
          href="/usuarios"
          className="inline-flex items-center justify-center text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors"
        >
          &larr; Voltar para a listagem
        </Link>
      </div>

      {/* Cartão do Formulário */}
      <div className="bg-[#1D0B0B] border border-white/10 rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl">
        <UsuarioForm usuarioExistente={usuario} />
      </div>
    </div>
  );
}
