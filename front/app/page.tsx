"use client";
import Link from "next/link";
import { useRouter } from "next/router";

import { useState } from "react";

function randomBlock(length: number) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function newCredentialCode() {
  return `EVP-${randomBlock(4)}-${randomBlock(4)}`;
}

export default function Home() {

  const router = useRouter();

  const [code, setCode] = useState("EVP-7F3A-91K2");
  const [animating, setAnimating] = useState(false);

  

  const handlerLogin = async () => {

    router.push("/login");

  }

  const handleGenerateCode = () => {
    setAnimating(false);
    setTimeout(() => {
      setCode(newCredentialCode());
      setAnimating(true);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#150606] text-[#F5EDEC] font-sans antialiased selection:bg-[#FF3B3B] selection:text-[#150606]">
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
        .credential-code {
          animation: ${animating ? "reveal 0.4s ease" : "none"};
        }
        @keyframes reveal {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .focus-ring:focus-visible {
          outline: 2px solid #FF3B3B;
          outline-offset: 3px;
        }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ===================== HEADER ===================== */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#150606]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 focus-ring rounded">
            <span className="text-[#FF3B3B] text-xl leading-none">✱</span>
            <span className="font-semibold text-lg tracking-tight">EventPro</span>
          </a>

          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#top" className="hover:text-white transition-colors focus-ring rounded">Início</a>
            <a href="#recursos" className="hover:text-white transition-colors focus-ring rounded">Recursos</a>
            <a href="#footer" className="hover:text-white transition-colors focus-ring rounded">Contato</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handlerLogin}
              type="button"
              aria-label="Entrar na sua conta EventPro"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors focus-ring rounded"
            >
              Entrar
            </button>
            <a
              href="#top"
              className="inline-flex px-4 py-2 text-sm font-medium bg-[#FF3B3B] text-[#150606] rounded-full hover:bg-[#ff5c5c] transition-colors focus-ring"
            >
              Registrar
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ===================== HERO ===================== */}
        <section className="relative overflow-hidden pt-40 pb-24 md:pt-48 md:pb-32">
          {/* glow de fundo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-[#FF3B3B]/20 blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#FF3B3B]/10 blur-[120px]"
          />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Coluna de texto */}
              <div>
                <p className="flex items-center gap-2 text-xs tracking-[0.2em] text-white/50 uppercase mb-6">
                  <span className="text-[#FF3B3B]">✱</span>
                  Gestão de workshops e palestras
                </p>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                  Cada evento.
                  <br />
                  Cada credencial.
                  <br />
                  <span className="text-[#FF3B3B]">Sob seu controle.</span>
                </h1>

                <p className="mt-8 text-lg text-white/60 leading-relaxed max-w-md">
                  O EventPro organiza inscrições e palestrantes dos eventos que você cria — e gera
                  automaticamente uma credencial única para cada inscrição confirmada.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href="#top"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#FF3B3B] text-[#150606] font-semibold rounded-full hover:bg-[#ff5c5c] transition-colors focus-ring"
                  >
                    Criar conta grátis
                  </a>
                  <button
                    onClick={handlerLogin}
                    type="button"
                    className="inline-flex items-center px-7 py-3.5 border border-white/20 text-white font-medium rounded-full hover:border-white/50 transition-colors focus-ring"
                  >
                    Entrar
                  </button>
                </div>

                <div className="mt-14 flex flex-wrap gap-2">
                  {["WORKSHOPS", "PALESTRAS", "CREDENCIAIS", "INSCRIÇÕES"].map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] tracking-wider text-white/50 border border-white/10 rounded-full px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Coluna visual: cartão de credencial + stats flutuantes */}
              <div className="relative">
                <div className="relative bg-[#1D0B0B] border border-white/10 rounded-3xl p-8 shadow-[0_30px_80px_-20px_rgba(255,59,59,0.25)]">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs text-white/50">Credencial de inscrição</span>
                    <span className="text-xs font-medium text-[#FF3B3B] bg-[#FF3B3B]/10 px-3 py-1 rounded-full">
                      Confirmada
                    </span>
                  </div>

                  <h3 className="font-semibold text-xl">Design de Interfaces — 2026</h3>
                  <p className="text-sm text-white/50 mt-1">Ana Beatriz Ferreira</p>

                  <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-xs text-white/50 mb-2">Código da credencial</p>
                    <p className="credential-code font-mono text-2xl tracking-wide text-white">{code}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    aria-live="polite"
                    className="mt-8 w-full text-sm font-medium text-[#FF3B3B] border border-[#FF3B3B]/30 rounded-full py-3 hover:bg-[#FF3B3B]/10 transition-colors focus-ring"
                  >
                    Gerar novo exemplo
                  </button>
                </div>

                {/* stat card flutuante */}
                <div className="hidden sm:block absolute -bottom-8 -left-8 bg-[#F5EDEC] text-[#150606] rounded-2xl p-5 w-44 shadow-2xl">
                  <p className="text-xs text-[#150606]/60">Isolamento entre organizadores</p>
                  <p className="text-3xl font-bold mt-1">100%</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer id="footer" className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <span className="text-[#FF3B3B] text-xl leading-none">✱</span>
            <span className="font-semibold text-lg">EventPro</span>
          </div>

          <nav aria-label="Links do rodapé" className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/50">
            <a href="#top" className="hover:text-white transition-colors focus-ring rounded">Início</a>
            <a href="#recursos" className="hover:text-white transition-colors focus-ring rounded">Recursos</a>
            <a href="#" className="hover:text-white transition-colors focus-ring rounded">Termos de uso</a>
            <a href="#" className="hover:text-white transition-colors focus-ring rounded">Privacidade</a>
          </nav>

          <p className="text-sm text-white/40">© 2026 EventPro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}