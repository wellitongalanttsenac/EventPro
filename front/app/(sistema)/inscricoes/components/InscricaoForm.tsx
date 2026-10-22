"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, mensagemDeErro } from "@/app/services/api";
import { InscricaoFormProps, CriarInscricaoRequest } from "@/app/types/inscricao";
import SeletorEvento from "@/app/components/SeletorEvento";
import AvisoErro from "@/app/components/AvisoErro";
import {
  CLASSE_BOTAO_PRIMARIO,
  CLASSE_BOTAO_SECUNDARIO,
  CLASSE_CAMPO,
  CLASSE_LABEL,
  CLASSE_RODAPE_FORM,
} from "@/app/utils/estilos";

export default function InscricaoForm({ eventoIdPredefinido }: InscricaoFormProps) {
  const router = useRouter();

  const [eventoId, setEventoId] = useState<number | null>(eventoIdPredefinido ?? null);
  const [nomeParticipante, setNomeParticipante] = useState("");
  const [emailParticipante, setEmailParticipante] = useState("");

  const [erroApi, setErroApi] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErroApi(null);

    if (!eventoId) {
      setErroApi("Selecione o evento no qual o participante será inscrito.");
      return;
    }

    setSalvando(true);
    const payload: CriarInscricaoRequest = {
      nomeParticipante: nomeParticipante.trim(),
      emailParticipante: emailParticipante.trim().toLowerCase(),
    };

    try {
      await api.post(`/eventos/${eventoId}/inscricoes`, payload);
      alert("Inscrição registrada! Ela fica pendente até você confirmar e gerar a credencial.");
      router.push(`/inscricoes?eventoId=${eventoId}`);
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível registrar a inscrição."));
    } finally {
      setSalvando(false);
    }
  };

  const voltarUrl = eventoId ? `/inscricoes?eventoId=${eventoId}` : "/inscricoes";

  return (
    <form onSubmit={handleSalvar} className="space-y-6">
      <AvisoErro mensagem={erroApi} />

      <SeletorEvento
        eventoIdSelecionado={eventoId}
        onEventoChange={(id) => setEventoId(id)}
        label="Evento *"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="inscricao-nome" className={CLASSE_LABEL}>
            Nome do participante *
          </label>
          <input
            id="inscricao-nome"
            type="text"
            required
            maxLength={255}
            value={nomeParticipante}
            onChange={(e) => setNomeParticipante(e.target.value)}
            placeholder="Ex: Lucas Henrique Oliveira"
            className={CLASSE_CAMPO}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="inscricao-email" className={CLASSE_LABEL}>
            E-mail do participante *
          </label>
          <input
            id="inscricao-email"
            type="email"
            required
            maxLength={255}
            value={emailParticipante}
            onChange={(e) => setEmailParticipante(e.target.value)}
            placeholder="participante@email.com"
            className={CLASSE_CAMPO}
          />
        </div>
      </div>

      {/* Nota informativa sobre o status inicial */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
        <span className="text-[#FF3B3B] text-base leading-none mt-0.5" aria-hidden="true">ℹ️</span>
        <p className="text-xs text-white/60 leading-relaxed">
          Toda inscrição começa como <strong className="text-amber-400">pendente</strong>. A credencial única é gerada pela API quando você <strong className="text-emerald-400">confirma</strong> a inscrição.
        </p>
      </div>

      <div className={CLASSE_RODAPE_FORM}>
        <Link href={voltarUrl} className={CLASSE_BOTAO_SECUNDARIO}>
          Cancelar
        </Link>
        <button type="submit" disabled={salvando || !eventoId} className={CLASSE_BOTAO_PRIMARIO}>
          {salvando ? "Registrando..." : "Registrar inscrição"}
        </button>
      </div>
    </form>
  );
}
