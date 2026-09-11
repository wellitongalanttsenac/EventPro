'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { LoginResponse } from "../types/auth";



export default function Login() {

  const router = useRouter();


  const handlerLogin = async (formData: FormData) => {

    try {
      debugger;
      const emailTela = formData.get("email")?.toString() ?? "";
      const senhaTela = formData.get("senha")?.toString() ?? "";

      var loginResposta = await axios.post<LoginResponse>("http://localhost:8080/auth/login", { email: emailTela, senha: senhaTela });
      
        console.log(loginResposta.status)
        router.push("/home")
      
    } catch (e) {
      console.log(e)
      alert("Usuário e/ou senha inválidos!")

    }

  }

  return (
    <>
      <div className="relative min-h-screen bg-[#150606] text-[#F5EDEC] font-sans antialiased flex items-center justify-center px-6 overflow-hidden">
        {/* glow de fundo, igual ao da hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-[#FF3B3B]/20 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#FF3B3B]/10 blur-[120px]"
        />

        <div className="relative w-full max-w-md bg-[#1D0B0B] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_30px_80px_-20px_rgba(255,59,59,0.25)]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-[#FF3B3B]">✱</span> Login
            </h1>
            <p className="mt-2 text-sm text-white/50">Entre com sua conta EventPro</p>
          </div>

          <form action={handlerLogin} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-white/70">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Digite seu email"
                className="w-full bg-[#150606] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-2 focus-visible:ring-[#FF3B3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D0B0B]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-white/70">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="senha"
                placeholder="Digite sua senha"
                className="w-full bg-[#150606] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-2 focus-visible:ring-[#FF3B3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D0B0B]"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center px-6 py-3.5 bg-[#FF3B3B] text-[#150606] font-semibold rounded-full hover:bg-[#ff5c5c] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3B3B]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}