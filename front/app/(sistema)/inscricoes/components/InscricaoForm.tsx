"use client";

import AvisoErro from "@/app/components/AvisoErro";
import BotaoEnviar from "@/app/components/BotaoEnviar";
import SeletorEvento from "@/app/components/SeletorEvento";
import { mensagemDeErro } from "@/app/services/api";
import { salvarInscricao } from "@/app/services/inscricaoService";
import { Inscricao, InscricaoFormProps } from "@/app/types/inscricao";
import {
  CLASSE_BOTAO_PRIMARIO,
  CLASSE_BOTAO_SECUNDARIO,
  CLASSE_CAMPO,
  CLASSE_LABEL,
  CLASSE_RODAPE_FORM,
} from "@/app/utils/estilos";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InscricaoForm({ eventoIdPredefinido }: InscricaoFormProps) {
  const router = useRouter();

  const [inscricao, setInscricao] = useState<Inscricao>(
    new Inscricao(null, "", "", null, "PENDENTE", null, eventoIdPredefinido ?? null)
  );
  const [erroApi, setErroApi] = useState<string | null>(null);

  const eventoId = inscricao.eventoId;

  const handlerChange = (campo: "nomeParticipante" | "emailParticipante", valor: string) => {
    setInscricao(
      (valorAnterior) =>
        new Inscricao(
          valorAnterior.id,
          campo === "nomeParticipante" ? valor : valorAnterior.nomeParticipante,
          campo === "emailParticipante" ? valor : valorAnterior.emailParticipante,
          valorAnterior.dataInscricao,
          valorAnterior.status,
          valorAnterior.credencial,
          valorAnterior.eventoId
        )
    );
  };

  const handlerChangeEvento = (id: number) => {
    setInscricao(
      (valorAnterior) =>
        new Inscricao(
          valorAnterior.id,
          valorAnterior.nomeParticipante,
          valorAnterior.emailParticipante,
          valorAnterior.dataInscricao,
          valorAnterior.status,
          valorAnterior.credencial,
          id
        )
    );
  };

  const handlerSalvar = async () => {
    setErroApi(null);

    if (!eventoId) {
      setErroApi("Selecione o evento no qual o participante será inscrito.");
      return;
    }

    const inscricaoSalvar = new Inscricao(
      inscricao.id,
      inscricao.nomeParticipante.trim(),
      inscricao.emailParticipante.trim().toLowerCase(),
      inscricao.dataInscricao,
      inscricao.status,
      inscricao.credencial,
      eventoId
    );

    try {
      await salvarInscricao(eventoId, inscricaoSalvar);
      alert("Inscrição registrada! Ela fica pendente até você confirmar e gerar a credencial.");
      router.push(`/inscricoes?eventoId=${eventoId}`);
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível registrar a inscrição."));
    }
  };

  const voltarUrl = eventoId ? `/inscricoes?eventoId=${eventoId}` : "/inscricoes";

  return (
    <form action={handlerSalvar} className="space-y-6">
      <AvisoErro mensagem={erroApi} />

      <SeletorEvento
        eventoIdSelecionado={eventoId}
        onEventoChange={(id) => handlerChangeEvento(id)}
        label="Evento *"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="inscricao-nome" className={CLASSE_LABEL}>
            Nome do participante *
          </label>
          <input
            id="inscricao-nome"
            name="nomeParticipante"
            type="text"
            required
            maxLength={255}
            value={inscricao.nomeParticipante}
            onChange={(e) => handlerChange("nomeParticipante", e.target.value)}
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
            name="emailParticipante"
            type="email"
            required
            maxLength={255}
            value={inscricao.emailParticipante}
            onChange={(e) => handlerChange("emailParticipante", e.target.value)}
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
        <BotaoEnviar
          texto="Registrar inscrição"
          textoEnviando="Registrando..."
          desabilitado={!eventoId}
          className={CLASSE_BOTAO_PRIMARIO}
        />
      </div>
    </form>
  );
}
