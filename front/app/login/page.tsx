"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useDispatch } from "react-redux";
import BotaoEnviar from "../components/BotaoEnviar";
import AvisoErro from "../components/AvisoErro";
import LayoutPublico from "../components/LayoutPublico";
import { login, logout } from "../redux/slices/authSlice";
import api, { mensagemDeErro } from "../services/api";
import { buscarUsuarioLogado } from "../services/usuarioService";
import { LoginResponse } from "../types/auth";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [emailDigitado, setEmailDigitado] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (formData: FormData) => {
    const emailTela = formData.get("email")?.toString().trim() ?? "";
    const senhaTela = formData.get("senha")?.toString() ?? "";

    // O form limpa os campos ao terminar o envio; assim o e-mail continua lá se o login falhar
    setEmailDigitado(emailTela);
    setErro("");

    try {
      const loginResposta = await api.post<LoginResponse>("/auth/login", { email: emailTela, senha: senhaTela });

      Cookies.set("token", loginResposta.data.token, { secure: true, expires: 7 });

      const usuarioLogado = await buscarUsuarioLogado();

      if (usuarioLogado.status !== "ATIVO") {
        dispatch(logout());
        setErro("Este organizador está bloqueado ou excluído. Peça a um administrador para reativá-lo.");
        return;
      }

      // O cookie do usuário fica legível no navegador, por isso não guarda o CPF
      dispatch(
        login({
          token: loginResposta.data.token,
          usuario: { ...usuarioLogado, cpf: "", senha: "" },
        })
      );
      router.push("/home");
    } catch (error) {
      dispatch(logout());
      setErro(mensagemDeErro(error, "Não foi possível entrar. Tente novamente."));
    }
  };

  return (
    <LayoutPublico>
      <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-24 relative overflow-hidden">
        {/* Glow de fundo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-[#FF3B3B]/15 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#FF3B3B]/10 blur-[120px]"
        />

        <div className="relative w-full max-w-md bg-[#1D0B0B] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_30px_80px_-20px_rgba(255,59,59,0.25)]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-[#FF3B3B]">✱</span> Painel EventPro
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Entre com as credenciais do Organizador
            </p>
          </div>

          {erro && (
            <div className="mb-6 text-center">
              <AvisoErro mensagem={erro} />
            </div>
          )}

          <form action={handleLogin} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-white/70">
                E-mail
              </label>
              <input
                type="email"
                autoComplete="email"
                id="email"
                name="email"
                required
                defaultValue={emailDigitado}
                placeholder="organizador@eventpro.com"
                className="w-full bg-[#150606] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white/70"
              >
                Senha
              </label>
              <input
                type="password"
                autoComplete="current-password"
                id="password"
                name="senha"
                required
                placeholder="••••••••"
                className="w-full bg-[#150606] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
              />
            </div>

            <BotaoEnviar
              texto="Entrar no Sistema"
              textoEnviando="Entrando..."
              className="w-full mt-2 inline-flex items-center justify-center px-6 py-3.5 bg-[#FF3B3B] text-[#150606] font-semibold rounded-full hover:bg-[#ff5c5c] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B] disabled:opacity-50"
            />
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link
              href="/"
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              &larr; Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </LayoutPublico>
  );
}
