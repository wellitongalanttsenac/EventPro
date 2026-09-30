"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, isAxiosError } from "@/app/services/api";
import { InscricaoFormProps, CriarInscricaoRequest } from "@/app/types/inscricao";
import SeletorEvento from "@/app/components/SeletorEvento";

export default function InscricaoForm({ eventoIdPredefinido }: InscricaoFormProps) {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);

  const [eventoId, setEventoId] = useState<number | null>(
    eventoIdPredefinido || null
  );
  const [nomeParticipante, setNomeParticipante] = useState("");
  const [emailParticipante, setEmailParticipante] = useState("");

  const handleSalvar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventoId) {
      alert("Por favor, selecione o evento no qual o participante será inscrito.");
      return;
    }

    setSalvando(true);

    const payload: CriarInscricaoRequest = {
      nomeParticipante: nomeParticipante.trim(),
      emailParticipante: emailParticipante.trim().toLowerCase(),
    };

    try {
      // POST /eventos/{eventoId}/inscricoes
      const resposta = await api.post(
        `/eventos/${eventoId}/inscricoes`,
        payload
      );

      if (resposta.status === 200 || resposta.status === 201) {
        alert(
          "Inscrição registrada com sucesso!\nStatus inicial: PENDENTE (a credencial será gerada após a confirmação)."
        );
        router.push(`/inscricoes?eventoId=${eventoId}`);
      } else {
        alert("Não foi possível cadastrar a inscrição.");
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        alert("Evento não encontrado no servidor.");
        router.push("/eventos");
      } else {
        alert("Erro de comunicação com o servidor ao registrar a inscrição.");
      }
    } finally {
      setSalvando(false);
    }
  };

  const voltarUrl = eventoId ? `/inscricoes?eventoId=${eventoId}` : "/inscricoes";

  return (
    <form onSubmit={handleSalvar} className="space-y-6">
      {/* Seletor de Evento do Organizador */}
      <div className="space-y-2">
        <SeletorEvento
          eventoIdSelecionado={eventoId}
          onEventoChange={(id) => setEventoId(id)}
          label="Evento Destino *"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            Nome do Participante *
          </label>
          <input
            type="text"
            required
            value={nomeParticipante}
            onChange={(e) => setNomeParticipante(e.target.value)}
            placeholder="Ex: Lucas Henrique Oliveira"
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            E-mail do Participante *
          </label>
          <input
            type="email"
            required
            value={emailParticipante}
            onChange={(e) => setEmailParticipante(e.target.value)}
            placeholder="participante@email.com"
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
          />
        </div>
      </div>

      {/* Nota informativa sobre o status inicial */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
        <span className="text-[#FF3B3B] text-base leading-none mt-0.5">ℹ️</span>
        <p className="text-xs text-white/60 leading-relaxed">
          Toda nova inscrição é registrada inicialmente como <strong className="text-amber-400">PENDENTE</strong>. O código único de credencial é gerado e emitido automaticamente pelo backend no momento da <strong className="text-emerald-400">confirmação</strong> da inscrição.
        </p>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
        <Link
          href={voltarUrl}
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-medium text-sm rounded-full transition-colors border border-white/10"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={salvando || !eventoId}
          className="px-7 py-2.5 bg-[#FF3B3B] hover:bg-[#ff5c5c] text-[#150606] font-semibold text-sm rounded-full shadow-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B] disabled:opacity-50"
        >
          {salvando ? "Registrando Inscrição..." : "Cadastrar Inscrição"}
        </button>
      </div>
    </form>
  );
}
