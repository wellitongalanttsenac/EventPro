"use client";
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
    <div className="bg-[#FAFAF8] text-[#17151A] font-sans antialiased selection:bg-[#F7D9DD] selection:text-[#D7263D]">
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
          outline: 2px solid #D7263D;
          outline-offset: 3px;
        }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur border-b border-[#E7E4E2]">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="#top" className="flex items-center gap-2 focus-ring rounded">
            <span className="w-2.5 h-2.5 bg-[#D7263D] rounded-sm"></span>
            <span className="font-bold text-lg tracking-tight font-serif">EventPro</span>
          </a>

          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-8 text-sm text-[#6B6870]">
            <a href="#como-funciona" className="hover:text-[#17151A] transition-colors focus-ring rounded">Como funciona</a>
            <a href="#diferencial" className="hover:text-[#17151A] transition-colors focus-ring rounded">Credencial única</a>
            <a href="#historia" className="hover:text-[#17151A] transition-colors focus-ring rounded">Nossa história</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Entrar na sua conta EventPro"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-[#17151A] border border-[#E7E4E2] rounded-md hover:border-[#17151A] transition-colors focus-ring"
            >
              Entrar
            </button>
            <a
              href="#cta"
              className="inline-flex px-4 py-2 text-sm font-medium text-white bg-[#D7263D] rounded-md hover:bg-[#B01E32] transition-colors focus-ring"
            >
              Criar conta / Registrar
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ===================== HERO ===================== */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm text-[#D7263D] font-medium mb-4">Feito para quem organiza workshops e palestras</p>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-[#17151A] font-serif">
                Cada evento sob seu controle. Cada inscrição, com credencial própria.
              </h1>
              <p className="mt-6 text-lg text-[#6B6870] leading-relaxed max-w-lg">
                O EventPro organiza a gestão de palestrantes e inscrições dos eventos que você cria — e gera, automaticamente, uma credencial única para cada inscrição confirmada.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="#cta"
                  className="inline-flex justify-center px-6 py-3 bg-[#D7263D] text-white font-medium rounded-md hover:bg-[#B01E32] transition-colors focus-ring"
                >
                  Criar conta / Registrar
                </a>
                <a
                  href="#como-funciona"
                  className="inline-flex justify-center px-6 py-3 border border-[#E7E4E2] text-[#17151A] font-medium rounded-md hover:border-[#17151A] transition-colors focus-ring"
                >
                  Ver como funciona
                </a>
              </div>

              <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <dt className="text-2xl font-bold text-[#17151A] font-serif">100%</dt>
                  <dd className="text-sm text-[#6B6870] mt-1">isolamento por organizador</dd>
                </div>
                <div>
                  <dt className="text-2xl font-bold text-[#17151A] font-serif">1</dt>
                  <dd className="text-sm text-[#6B6870] mt-1">credencial por inscrição</dd>
                </div>
                <div>
                  <dt className="text-2xl font-bold text-[#17151A] font-serif">0</dt>
                  <dd className="text-sm text-[#6B6870] mt-1">planilhas paralelas</dd>
                </div>
              </dl>
            </div>

            {/* Mockup de credencial */}
            <div className="relative">
              <div className="bg-[#FFFFFF] border border-[#E7E4E2] rounded-2xl shadow-[0_8px_30px_-12px_rgba(23,21,26,0.15)] p-6 sm:p-8 max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-medium text-[#6B6870]">Credencial de inscrição</span>
                  <span className="text-xs font-medium text-[#D7263D] bg-[#F7D9DD] px-2 py-1 rounded">Confirmada</span>
                </div>

                <img
                  src="https://placehold.co/64x64/17151A/FAFAF8?text=WS"
                  alt="Ícone do workshop Design de Interfaces 2026"
                  className="w-14 h-14 rounded-lg mb-4"
                />

                <h3 className="font-semibold text-lg text-[#17151A] font-serif">Design de Interfaces — 2026</h3>
                <p className="text-sm text-[#6B6870] mt-1">Ana Beatriz Ferreira</p>

                <div className="mt-6 pt-6 border-t border-[#E7E4E2]">
                  <p className="text-xs text-[#6B6870] mb-2">Código da credencial</p>
                  <p className="credential-code font-mono text-lg text-[#17151A] tracking-wide">{code}</p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="mt-6 w-full text-sm font-medium text-[#D7263D] border border-[#D7263D]/30 rounded-md py-2 hover:bg-[#F7D9DD] transition-colors focus-ring"
                  aria-live="polite"
                >
                  Gerar novo exemplo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== COMO FUNCIONA ===================== --> */}
        <section id="como-funciona" className="bg-[#17151A] text-[#FAFAF8] py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-xl mb-14">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight font-serif">Do primeiro convite à credencial emitida</h2>
              <p className="mt-4 text-white/60 leading-relaxed">Quatro etapas, o suficiente para tirar um evento do papel.</p>
            </div>

            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <li>
                <span className="font-mono text-[#D7263D] text-sm">01</span>
                <h3 className="font-semibold text-lg mt-3 font-serif">Crie o evento</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">Defina nome, data, formato e vagas. O evento passa a existir só no seu painel.</p>
              </li>
              <li>
                <span className="font-mono text-[#D7263D] text-sm">02</span>
                <h3 className="font-semibold text-lg mt-3 font-serif">Adicione palestrantes</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">Cadastre quem vai apresentar. Cada palestrante fica vinculado apenas a esse evento.</p>
              </li>
              <li>
                <span className="font-mono text-[#D7263D] text-sm">03</span>
                <h3 className="font-semibold text-lg mt-3 font-serif">Abra as inscrições</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">Compartilhe o link. As inscrições chegam direto no seu painel de organizador.</p>
              </li>
              <li>
                <span className="font-mono text-[#D7263D] text-sm">04</span>
                <h3 className="font-semibold text-lg mt-3 font-serif">Credencial emitida</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">Cada inscrição confirmada recebe um código único, pronto para check-in.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ===================== REGRA DE NEGÓCIO: ISOLAMENTO ===================== */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-[#FFFFFF] border border-[#E7E4E2] rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_-12px_rgba(23,21,26,0.1)]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F7D9DD]/60">
                    <span className="w-8 h-8 rounded-full bg-[#D7263D] text-white flex items-center justify-center text-xs font-mono">VC</span>
                    <div>
                      <p className="text-sm font-medium text-[#17151A]">Design de Interfaces — 2026</p>
                      <p className="text-xs text-[#6B6870]">Seu evento · 84 inscrições</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F7D9DD]/60">
                    <span className="w-8 h-8 rounded-full bg-[#D7263D] text-white flex items-center justify-center text-xs font-mono">VC</span>
                    <div>
                      <p className="text-sm font-medium text-[#17151A]">Fundamentos de Dados — Turma B</p>
                      <p className="text-xs text-[#6B6870]">Seu evento · 41 inscrições</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#E7E4E2]/40 opacity-50">
                    <span className="w-8 h-8 rounded-full bg-[#6B6870] text-white flex items-center justify-center text-xs font-mono">—</span>
                    <div>
                      <p className="text-sm font-medium text-[#17151A]">Eventos de outros organizadores</p>
                      <p className="text-xs text-[#6B6870]">Fora do seu painel</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <p className="text-sm text-[#D7263D] font-medium mb-4">Regra central da plataforma</p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight font-serif">
                Você só gerencia o que você mesmo criou
              </h2>
              <p className="mt-6 text-[#6B6870] leading-relaxed">
                No EventPro, cada organizador enxerga e administra apenas as inscrições e os palestrantes dos eventos que ele próprio cadastrou. Não existe visão cruzada entre organizadores — o painel de cada um reflete exclusivamente o que é seu.
              </p>
              <p className="mt-4 text-[#6B6870] leading-relaxed">
                Isso mantém dados de participantes protegidos, evita conflitos de agenda entre equipes diferentes e simplifica a prestação de contas de cada evento.
              </p>
            </div>
          </div>
        </section>

        {/* ===================== DIFERENCIAL: CREDENCIAL ÚNICA ===================== */}
        <section id="diferencial" className="bg-[#F7D9DD]/40 py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="max-w-2xl">
              <p className="text-sm text-[#D7263D] font-medium mb-4">O diferencial do EventPro</p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight font-serif">
                Toda inscrição confirmada gera uma credencial exclusiva
              </h2>
              <p className="mt-6 text-[#6B6870] leading-relaxed">
                No momento em que uma inscrição é confirmada, o EventPro gera automaticamente um código único — um identificador que não se repete entre eventos nem entre participantes. Esse código é o que valida a entrada de cada pessoa no dia do evento, sem depender de listas impressas ou conferência manual.
              </p>
            </div>

            <div className="mt-14 grid sm:grid-cols-3 gap-6">
              <div className="bg-[#FFFFFF] border border-[#E7E4E2] rounded-xl p-6">
                <p className="font-mono text-[#D7263D] text-sm mb-3">Gerado no instante da confirmação</p>
                <p className="text-sm text-[#6B6870] leading-relaxed">Sem filas de processamento — o código nasce junto com a inscrição confirmada.</p>
              </div>
              <div className="bg-[#FFFFFF] border border-[#E7E4E2] rounded-xl p-6">
                <p className="font-mono text-[#D7263D] text-sm mb-3">Único por inscrição</p>
                <p className="text-sm text-[#6B6870] leading-relaxed">Cada credencial pertence a uma única pessoa, em um único evento.</p>
              </div>
              <div className="bg-[#FFFFFF] border border-[#E7E4E2] rounded-xl p-6">
                <p className="font-mono text-[#D7263D] text-sm mb-3">Pronto para check-in</p>
                <p className="text-sm text-[#6B6870] leading-relaxed">Basta conferir o código na entrada — sem planilha, sem improviso.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== NOSSA HISTÓRIA ===================== */}
        <section id="historia" className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight font-serif">Nossa história</h2>
            </div>
            <div className="md:col-span-2 space-y-5 text-[#6B6870] leading-relaxed max-w-2xl">
              <p>
                O EventPro nasceu da rotina de quem organiza workshops usando planilhas e formulários desconectados — e acaba perdendo o controle de quem realmente confirmou presença.
              </p>
              <p>
                Nossa missão é simples: devolver o controle ao organizador através de isolamento total de dados e automação inteligente, eliminando o caos administrativo de eventos.
              </p>
            </div>
          </div>
        </section>

        {/* ===================== CTA FINAL ===================== */}
        <section id="cta" className="bg-[#17151A] text-[#FAFAF8] py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight font-serif">Organize seu próximo evento com o EventPro</h2>
            <p className="mt-4 text-white/60 leading-relaxed max-w-xl mx-auto">
              Crie o evento, convide os palestrantes e deixe a emissão de credenciais com a gente.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                className="inline-flex justify-center px-6 py-3 bg-[#D7263D] text-white font-medium rounded-md hover:bg-[#B01E32] transition-colors focus-ring"
              >
                Criar conta gratuita / Registrar
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-6 py-3 border border-white/20 text-[#FAFAF8] font-medium rounded-md hover:border-white/50 transition-colors focus-ring"
              >
                Falar com o time
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-[#FAFAF8] border-t border-[#E7E4E2]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#D7263D] rounded-sm"></span>
                <span className="font-bold text-lg font-serif">EventPro</span>
              </div>
              <p className="text-sm text-[#6B6870] mt-3">Gestão de workshops e palestras, com credencial única por inscrição.</p>
            </div>

            <nav aria-label="Produto">
              <h3 className="text-sm font-medium text-[#17151A] mb-3">Produto</h3>
              <ul className="space-y-2 text-sm text-[#6B6870]">
                <li><a href="#como-funciona" className="hover:text-[#17151A] transition-colors focus-ring rounded">Como funciona</a></li>
                <li><a href="#diferencial" className="hover:text-[#17151A] transition-colors focus-ring rounded">Credencial única</a></li>
              </ul>
            </nav>

            <nav aria-label="Empresa">
              <h3 className="text-sm font-medium text-[#17151A] mb-3">Empresa</h3>
              <ul className="space-y-2 text-sm text-[#6B6870]">
                <li><a href="#historia" className="hover:text-[#17151A] transition-colors focus-ring rounded">Nossa história</a></li>
                <li><a href="#" className="hover:text-[#17151A] transition-colors focus-ring rounded">Contato</a></li>
              </ul>
            </nav>

            <nav aria-label="Legal">
              <h3 className="text-sm font-medium text-[#17151A] mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-[#6B6870]">
                <li><a href="#" className="hover:text-[#17151A] transition-colors focus-ring rounded">Termos de uso</a></li>
                <li><a href="#" className="hover:text-[#17151A] transition-colors focus-ring rounded">Privacidade</a></li>
              </ul>
            </nav>
          </div>

          <div className="mt-10 pt-6 border-t border-[#E7E4E2] text-sm text-[#6B6870]">
            © 2026 EventPro. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}