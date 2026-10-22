"use client";

import {
  AtualizarUsuarioRequest,
  CriarUsuarioRequest,
  EnumStatusUsuario,
  UsuarioFormProps,
} from "@/app/types/usuario";
import { api, mensagemDeErro } from "@/app/services/api";
import AvisoErro from "@/app/components/AvisoErro";
import { rotuloStatus } from "@/app/components/StatusBadge";
import { cpfValido, mascararCpf } from "@/app/utils/formatacao";
import {
  CLASSE_BOTAO_PRIMARIO,
  CLASSE_BOTAO_SECUNDARIO,
  CLASSE_CAMPO,
  CLASSE_ERRO_CAMPO,
  CLASSE_LABEL,
  CLASSE_RODAPE_FORM,
} from "@/app/utils/estilos";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_USUARIO: EnumStatusUsuario[] = ["ATIVO", "BLOQUEADO", "EXCLUIDO"];

export default function UsuarioForm({ usuarioExistente }: UsuarioFormProps) {
  const router = useRouter();
  const editando = Boolean(usuarioExistente);

  const [nome, setNome] = useState(usuarioExistente?.nome ?? "");
  const [cpf, setCpf] = useState(mascararCpf(usuarioExistente?.cpf ?? ""));
  const [email, setEmail] = useState(usuarioExistente?.email ?? "");
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState<EnumStatusUsuario>(usuarioExistente?.status ?? "ATIVO");

  const [erroCpf, setErroCpf] = useState<string | null>(null);
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErroApi(null);

    if (!cpfValido(cpf)) {
      setErroCpf("CPF inválido. Confira os 11 dígitos.");
      return;
    }
    setErroCpf(null);
    setSalvando(true);

    try {
      if (usuarioExistente) {
        // PUT /usuarios/{id}: a API não altera a senha por esta rota
        const payload: AtualizarUsuarioRequest = {
          nome: nome.trim(),
          cpf,
          email: email.trim().toLowerCase(),
          status,
        };
        await api.put(`/usuarios/${usuarioExistente.id}`, payload);
        alert("Organizador atualizado com sucesso!");
      } else {
        const payload: CriarUsuarioRequest = {
          nome: nome.trim(),
          senha,
          cpf,
          email: email.trim().toLowerCase(),
        };
        await api.post("/usuarios", payload);
        alert("Organizador cadastrado com sucesso!");
      }
      router.push("/usuarios");
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível salvar o organizador."));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={handleSalvar} className="space-y-6">
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
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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
            value={cpf}
            onChange={(e) => {
              setCpf(mascararCpf(e.target.value));
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="organizador@eventpro.com"
            className={CLASSE_CAMPO}
          />
        </div>

        {editando ? (
          <div className="space-y-2">
            <label htmlFor="usuario-status" className={CLASSE_LABEL}>
              Status *
            </label>
            <select
              id="usuario-status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as EnumStatusUsuario)}
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
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className={CLASSE_CAMPO}
            />
          </div>
        )}
      </div>

      {editando && (
        <p className="text-xs text-white/40">
          A senha do organizador não é alterada nesta tela.
        </p>
      )}

      <div className={CLASSE_RODAPE_FORM}>
        <Link href="/usuarios" className={CLASSE_BOTAO_SECUNDARIO}>
          Cancelar
        </Link>
        <button type="submit" disabled={salvando} className={CLASSE_BOTAO_PRIMARIO}>
          {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar organizador"}
        </button>
      </div>
    </form>
  );
}
