"use client";

import Link from "next/link";
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

export default function LandingPage() {
  const [code, setCode] = useState("EVP-7F3A-91K2");
  const [animating, setAnimating] = useState(false);

  const handleGenerateCode = () => {
    setAnimating(false);
    setTimeout(() => {
      setCode(newCredentialCode());
      setAnimating(true);
    }, 50);
  };

  return (
    <div className="pt-20">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden pt-20 pb-20 md:pt-28 md:pb-28">
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
                O EventPro organiza inscrições e palestrantes dos eventos que você
                cria — com simulação automática de credencial única para cada
                inscrição confirmada.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#FF3B3B] text-[#150606] font-semibold rounded-full hover:bg-[#ff5c5c] transition-colors shadow-lg"
                >
                  Acessar Sistema
                </Link>
                <a
                  href="#recursos"
                  className="inline-flex items-center px-7 py-3.5 border border-white/20 text-white font-medium rounded-full hover:border-white/50 transition-colors"
                >
                  Conhecer Recursos
                </a>
              </div>

              <div className="mt-14 flex flex-wrap gap-2">
                {["WORKSHOPS", "PALESTRAS", "CREDENCIAIS", "INSCRIÇÕES"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-[11px] tracking-wider text-white/50 border border-white/10 rounded-full px-3 py-1"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Coluna visual: cartão de credencial + stats flutuantes */}
            <div className="relative">
              <div className="relative bg-[#1D0B0B] border border-white/10 rounded-3xl p-8 shadow-[0_30px_80px_-20px_rgba(255,59,59,0.25)]">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs text-white/50">
                    Credencial de inscrição
                  </span>
                  <span className="text-xs font-medium text-[#FF3B3B] bg-[#FF3B3B]/10 px-3 py-1 rounded-full border border-[#FF3B3B]/20">
                    Confirmada
                  </span>
                </div>

                <h3 className="font-semibold text-xl">
                  Design de Interfaces — 2026
                </h3>
                <p className="text-sm text-white/50 mt-1">Ana Beatriz Ferreira</p>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-xs text-white/50 mb-2">Código da credencial</p>
                  <p className="font-mono text-2xl tracking-wide text-white">
                    {code}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="mt-8 w-full text-sm font-medium text-[#FF3B3B] border border-[#FF3B3B]/30 rounded-full py-3 hover:bg-[#FF3B3B]/10 transition-colors"
                >
                  Simular Nova Credencial
                </button>
              </div>

              {/* stat card flutuante */}
              <div className="hidden sm:block absolute -bottom-8 -left-8 bg-[#F5EDEC] text-[#150606] rounded-2xl p-5 w-48 shadow-2xl">
                <p className="text-xs text-[#150606]/60">
                  Isolamento entre organizadores
                </p>
                <p className="text-3xl font-bold mt-1">100%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== RECURSOS ===================== */}
      <section id="recursos" className="py-20 border-t border-white/10 bg-[#120505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Recursos do Ecossistema EventPro
            </h2>
            <p className="mt-4 text-white/60">
              Desenvolvido sob medida para controle de eventos acadêmicos, garantindo total isolamento entre organizadores.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1D0B0B] border border-white/10 p-6 rounded-2xl">
              <span className="text-[#FF3B3B] text-2xl mb-3 block">✱</span>
              <h3 className="font-semibold text-lg mb-2">Gestão de Organizadores</h3>
              <p className="text-sm text-white/60">
                CRUD completo com controle de status ativo/bloqueado e dados cadastrais.
              </p>
            </div>

            <div className="bg-[#1D0B0B] border border-white/10 p-6 rounded-2xl">
              <span className="text-[#FF3B3B] text-2xl mb-3 block">🎟️</span>
              <h3 className="font-semibold text-lg mb-2">Workshops & Palestras</h3>
              <p className="text-sm text-white/60">
                Criação e acompanhamento de eventos com datas, locais e palestrantes dedicados.
              </p>
            </div>

            <div className="bg-[#1D0B0B] border border-white/10 p-6 rounded-2xl">
              <span className="text-[#FF3B3B] text-2xl mb-3 block">🛡️</span>
              <h3 className="font-semibold text-lg mb-2">Credenciamento Único</h3>
              <p className="text-sm text-white/60">
                Geração automática de hash identificador exclusivo para cada participante confirmado.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
