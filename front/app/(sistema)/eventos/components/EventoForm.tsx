"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AtualizarEventoRequest,
  CriarEventoRequest,
  EnumStatusEvento,
  EventoFormProps,
} from "@/app/types/evento";
import { api, mensagemDeErro } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import AvisoErro from "@/app/components/AvisoErro";
import { rotuloStatus } from "@/app/components/StatusBadge";
import { dataParaInput, inputParaIso } from "@/app/utils/formatacao";
import {
  CLASSE_BOTAO_PRIMARIO,
  CLASSE_BOTAO_SECUNDARIO,
  CLASSE_CAMPO,
  CLASSE_LABEL,
  CLASSE_RODAPE_FORM,
} from "@/app/utils/estilos";

const STATUS_EVENTO: EnumStatusEvento[] = ["ABERTO", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO"];

export default function EventoForm({ eventoExistente }: EventoFormProps) {
  const router = useRouter();

  // A tela de edição só renderiza o formulário depois de carregar o evento,
  // então o estado inicial já nasce com os dados certos
  const [nome, setNome] = useState(eventoExistente?.nome ?? "");
  const [descricao, setDescricao] = useState(eventoExistente?.descricao ?? "");
  const [dataEvento, setDataEvento] = useState(dataParaInput(eventoExistente?.dataEvento));
  const [local, setLocal] = useState(eventoExistente?.local ?? "");
  const [status, setStatus] = useState<EnumStatusEvento>(eventoExistente?.status ?? "ABERTO");

  const [erroApi, setErroApi] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErroApi(null);

    const organizador = getOrganizadorLogado();
    if (!organizador) {
      router.push("/login");
      return;
    }

    setSalvando(true);
    try {
      if (eventoExistente) {
        const payload: AtualizarEventoRequest = {
          nome: nome.trim(),
          descricao: descricao.trim(),
          dataEvento: inputParaIso(dataEvento),
          local: local.trim(),
          status,
        };
        await api.put(`/eventos/${eventoExistente.id}?organizadorId=${organizador.id}`, payload);
        alert("Evento atualizado com sucesso!");
      } else {
        const payload: CriarEventoRequest = {
          nome: nome.trim(),
          descricao: descricao.trim(),
          dataEvento: inputParaIso(dataEvento),
          local: local.trim(),
          organizadorId: organizador.id,
        };
        await api.post("/eventos", payload);
        alert("Evento criado com sucesso!");
      }
      router.push("/eventos");
    } catch (error) {
      setErroApi(mensagemDeErro(error, "Não foi possível salvar o evento."));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={handleSalvar} className="space-y-6">
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
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Proposta, público-alvo e cronograma do evento"
            className={`${CLASSE_CAMPO} resize-y`}
          />
          <p className="text-[11px] text-white/40 text-right">{descricao.length}/255</p>
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
            value={dataEvento}
            onChange={(e) => setDataEvento(e.target.value)}
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
            value={local}
            onChange={(e) => setLocal(e.target.value)}
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
              value={status}
              onChange={(e) => setStatus(e.target.value as EnumStatusEvento)}
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
        <button type="submit" disabled={salvando} className={CLASSE_BOTAO_PRIMARIO}>
          {salvando ? "Salvando..." : eventoExistente ? "Salvar alterações" : "Criar evento"}
        </button>
      </div>
    </form>
  );
}
