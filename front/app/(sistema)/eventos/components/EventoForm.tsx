"use client";

import AvisoErro from "@/app/components/AvisoErro";
import BotaoEnviar from "@/app/components/BotaoEnviar";
import { rotuloStatus } from "@/app/components/StatusBadge";
import { mensagemDeErro } from "@/app/services/api";
import { atualizarEvento, salvarEvento } from "@/app/services/eventoService";
import { EnumStatusEvento, Evento, EventoFormProps } from "@/app/types/evento";
import {
  CLASSE_BOTAO_PRIMARIO,
  CLASSE_BOTAO_SECUNDARIO,
  CLASSE_CAMPO,
  CLASSE_LABEL,
  CLASSE_RODAPE_FORM,
} from "@/app/utils/estilos";
import { dataParaInput, inputParaIso } from "@/app/utils/formatacao";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_EVENTO: EnumStatusEvento[] = ["ABERTO", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO"];

export default function EventoForm({ eventoExistente }: EventoFormProps) {
  const router = useRouter();

  const [evento, setEvento] = useState<Evento>(
    eventoExistente
      ? new Evento(
          eventoExistente.id,
          eventoExistente.nome,
          eventoExistente.descricao,
          dataParaInput(eventoExistente.dataEvento),
          eventoExistente.local,
          eventoExistente.status,
          eventoExistente.organizador
        )
      : new Evento(null, "", "", "", "", "ABERTO", null)
  );
  const [erroApi, setErroApi] = useState<string | null>(null);

  const handlerChange = (campo: "nome" | "descricao" | "dataEvento" | "local" | "status", valor: string) => {
    setEvento(
      (valorAnterior) =>
        new Evento(
          valorAnterior.id,
          campo === "nome" ? valor : valorAnterior.nome,
          campo === "descricao" ? valor : valorAnterior.descricao,
          campo === "dataEvento" ? valor : valorAnterior.dataEvento,
          campo === "local" ? valor : valorAnterior.local,
          campo === "status" ? (valor as EnumStatusEvento) : valorAnterior.status,
          valorAnterior.organizador
        )
    );
  };

  const handlerSalvar = async () => {
    setErroApi(null);

    const eventoSalvar = new Evento(
      evento.id,
      evento.nome.trim(),
      evento.descricao.trim(),
      inputParaIso(evento.dataEvento),
      evento.local.trim(),
      evento.status,
      evento.organizador
    );

    try {
      if (eventoExistente) {
        await atualizarEvento(eventoSalvar);
        alert("Evento atualizado com sucesso!");
      } else {
        await salvarEvento(eventoSalvar);
        alert("Evento criado com sucesso!");
      }
      router.push("/eventos");
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível salvar o evento."));
    }
  };

  return (
    <form action={handlerSalvar} className="space-y-6">
      <AvisoErro mensagem={erroApi} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="evento-nome" className={CLASSE_LABEL}>
            Nome do evento / workshop *
          </label>
          <input
            id="evento-nome"
            name="nome"
            type="text"
            required
            maxLength={255}
            value={evento.nome}
            onChange={(e) => handlerChange("nome", e.target.value)}
            placeholder="Ex: Workshop de Arquitetura de Software 2026"
            className={CLASSE_CAMPO}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="evento-descricao" className={CLASSE_LABEL}>
            Descrição *
          </label>
          <textarea
            id="evento-descricao"
            name="descricao"
            rows={3}
            required
            maxLength={255}
            value={evento.descricao}
            onChange={(e) => handlerChange("descricao", e.target.value)}
            placeholder="Proposta, público-alvo e cronograma do evento"
            className={`${CLASSE_CAMPO} resize-y`}
          />
          <p className="text-[11px] text-white/40 text-right">{evento.descricao.length}/255</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="evento-data" className={CLASSE_LABEL}>
            Data e horário *
          </label>
          <input
            id="evento-data"
            name="dataEvento"
            type="datetime-local"
            required
            value={evento.dataEvento}
            onChange={(e) => handlerChange("dataEvento", e.target.value)}
            className={`${CLASSE_CAMPO} [color-scheme:dark]`}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="evento-local" className={CLASSE_LABEL}>
            Local / plataforma *
          </label>
          <input
            id="evento-local"
            name="local"
            type="text"
            required
            maxLength={255}
            value={evento.local}
            onChange={(e) => handlerChange("local", e.target.value)}
            placeholder="Ex: Auditório Central Senac ou online via Teams"
            className={CLASSE_CAMPO}
          />
        </div>

        {eventoExistente && (
          <div className="space-y-2">
            <label htmlFor="evento-status" className={CLASSE_LABEL}>
              Status *
            </label>
            <select
              id="evento-status"
              name="status"
              value={evento.status}
              onChange={(e) => handlerChange("status", e.target.value)}
              className={`${CLASSE_CAMPO} cursor-pointer`}
            >
              {STATUS_EVENTO.map((opcao) => (
                <option key={opcao} value={opcao} className="bg-[#150606]">
                  {rotuloStatus(opcao)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={CLASSE_RODAPE_FORM}>
        <Link href="/eventos" className={CLASSE_BOTAO_SECUNDARIO}>
          Cancelar
        </Link>
        <BotaoEnviar
          texto={eventoExistente ? "Salvar alterações" : "Criar evento"}
          textoEnviando="Salvando..."
          className={CLASSE_BOTAO_PRIMARIO}
        />
      </div>
    </form>
  );
}
