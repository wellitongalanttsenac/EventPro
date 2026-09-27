"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginResponse } from "@/app/types/auth";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString() ?? "";
    const senha = formData.get("senha")?.toString() ?? "";

    try {
      const resposta = await axios.post<LoginResponse>(
        "http://localhost:8080/auth/login",
        { email, senha }
      );

      if (resposta.status === 200) {
        if (resposta.data?.token) {
          localStorage.setItem("eventpro_token", resposta.data.token);
        }
        router.push("/home");
      } else {
        setErro("Usuário e/ou senha inválidos!");
      }
    } catch (err) {
      console.error(err);
      setErro("Falha no login. Verifique as credenciais ou a conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-24 relative overflow-hidden">
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
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-white/70">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
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
              id="password"
              name="senha"
              required
              placeholder="••••••••"
              className="w-full bg-[#150606] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full mt-2 inline-flex items-center justify-center px-6 py-3.5 bg-[#FF3B3B] text-[#150606] font-semibold rounded-full hover:bg-[#ff5c5c] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B] disabled:opacity-50"
          >
            {carregando ? "Entrando..." : "Entrar no Sistema"}
          </button>
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
  );
}
