"use client";

import AvisoErro from "@/app/components/AvisoErro";
import BotaoEnviar from "@/app/components/BotaoEnviar";
import { rotuloStatus } from "@/app/components/StatusBadge";
import { mensagemDeErro } from "@/app/services/api";
import { atualizarUsuario, salvarUsuario } from "@/app/services/usuarioService";
import { EnumStatusUsuario, Usuario, UsuarioFormProps } from "@/app/types/usuario";
import {
  CLASSE_BOTAO_PRIMARIO,
  CLASSE_BOTAO_SECUNDARIO,
  CLASSE_CAMPO,
  CLASSE_ERRO_CAMPO,
  CLASSE_LABEL,
  CLASSE_RODAPE_FORM,
} from "@/app/utils/estilos";
import { cpfValido, mascararCpf } from "@/app/utils/formatacao";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_USUARIO: EnumStatusUsuario[] = ["ATIVO", "BLOQUEADO", "EXCLUIDO"];

export default function UsuarioForm({ usuarioExistente }: UsuarioFormProps) {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario>(
    usuarioExistente
      ? new Usuario(
          usuarioExistente.id,
          usuarioExistente.nome,
          usuarioExistente.email,
          usuarioExistente.status,
          mascararCpf(usuarioExistente.cpf),
          ""
        )
      : new Usuario(null, "", "", "ATIVO", "", "")
  );
  const [erroCpf, setErroCpf] = useState<string | null>(null);
  const [erroApi, setErroApi] = useState<string | null>(null);

  const handlerChange = (campo: "nome" | "email" | "status" | "cpf" | "senha", valor: string) => {
    setUsuario(
      (valorAnterior) =>
        new Usuario(
          valorAnterior.id,
          campo === "nome" ? valor : valorAnterior.nome,
          campo === "email" ? valor : valorAnterior.email,
          campo === "status" ? (valor as EnumStatusUsuario) : valorAnterior.status,
          campo === "cpf" ? mascararCpf(valor) : valorAnterior.cpf,
          campo === "senha" ? valor : valorAnterior.senha
        )
    );
  };

  const handlerSalvar = async () => {
    setErroApi(null);

    if (!cpfValido(usuario.cpf)) {
      setErroCpf("CPF inválido. Confira os 11 dígitos.");
      return;
    }
    setErroCpf(null);

    const usuarioSalvar = new Usuario(
      usuario.id,
      usuario.nome.trim(),
      usuario.email.trim().toLowerCase(),
      usuario.status,
      usuario.cpf,
      usuario.senha
    );

    try {
      if (usuarioExistente) {
        // PUT /usuarios/{id}: a API não altera a senha por esta rota
        await atualizarUsuario(usuarioSalvar);
        alert("Organizador atualizado com sucesso!");
      } else {
        await salvarUsuario(usuarioSalvar);
        alert("Organizador cadastrado com sucesso!");
      }
      router.push("/usuarios");
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível salvar o organizador."));
    }
  };

  return (
    <form action={handlerSalvar} className="space-y-6">
      <AvisoErro mensagem={erroApi} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="usuario-nome" className={CLASSE_LABEL}>
            Nome completo *
          </label>
          <input
            id="usuario-nome"
            name="nome"
            type="text"
            required
            maxLength={255}
            autoComplete="name"
            value={usuario.nome}
            onChange={(e) => handlerChange("nome", e.target.value)}
            placeholder="Ex: Carlos Eduardo Silva"
            className={CLASSE_CAMPO}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="usuario-cpf" className={CLASSE_LABEL}>
            CPF *
          </label>
          <input
            id="usuario-cpf"
            name="cpf"
            type="text"
            inputMode="numeric"
            required
            value={usuario.cpf}
            onChange={(e) => {
              handlerChange("cpf", e.target.value);
              setErroCpf(null);
            }}
            placeholder="000.000.000-00"
            aria-invalid={Boolean(erroCpf)}
            aria-describedby={erroCpf ? "usuario-cpf-erro" : undefined}
            className={CLASSE_CAMPO}
          />
          {erroCpf && (
            <p id="usuario-cpf-erro" className={CLASSE_ERRO_CAMPO}>
              {erroCpf}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="usuario-email" className={CLASSE_LABEL}>
            E-mail *
          </label>
          <input
            id="usuario-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={usuario.email}
            onChange={(e) => handlerChange("email", e.target.value)}
            placeholder="organizador@eventpro.com"
            className={CLASSE_CAMPO}
          />
        </div>

        {usuarioExistente ? (
          <div className="space-y-2">
            <label htmlFor="usuario-status" className={CLASSE_LABEL}>
              Status *
            </label>
            <select
              id="usuario-status"
              name="status"
              value={usuario.status}
              onChange={(e) => handlerChange("status", e.target.value)}
              className={`${CLASSE_CAMPO} cursor-pointer`}
            >
              {STATUS_USUARIO.map((opcao) => (
                <option key={opcao} value={opcao} className="bg-[#150606]">
                  {rotuloStatus(opcao)}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="usuario-senha" className={CLASSE_LABEL}>
              Senha *
            </label>
            <input
              id="usuario-senha"
              name="senha"
              type="password"
              required
              autoComplete="new-password"
              value={usuario.senha}
              onChange={(e) => handlerChange("senha", e.target.value)}
              placeholder="••••••••"
              className={CLASSE_CAMPO}
            />
          </div>
        )}
      </div>

      {usuarioExistente && (
        <p className="text-xs text-white/40">
          A senha do organizador não é alterada nesta tela.
        </p>
      )}

      <div className={CLASSE_RODAPE_FORM}>
        <Link href="/usuarios" className={CLASSE_BOTAO_SECUNDARIO}>
          Cancelar
        </Link>
        <BotaoEnviar
          texto={usuarioExistente ? "Salvar alterações" : "Cadastrar organizador"}
          textoEnviando="Salvando..."
          className={CLASSE_BOTAO_PRIMARIO}
        />
      </div>
    </form>
  );
}
