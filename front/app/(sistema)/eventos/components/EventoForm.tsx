"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Evento, EventoFormProps } from "@/app/types/evento";
import { api, isAxiosError } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";

function formatDateForInput(dateStr?: string): string {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatInputForBackend(inputValue: string): string {
  if (!inputValue) return new Date().toISOString();
  const d = new Date(inputValue);
  if (isNaN(d.getTime())) {
    return inputValue.length === 16 ? `${inputValue}:00` : inputValue;
  }
  return d.toISOString();
}

export default function EventoForm({ eventoExistente }: EventoFormProps) {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState(eventoExistente?.nome || "");
  const [descricao, setDescricao] = useState(eventoExistente?.descricao || "");
  const [dataEvento, setDataEvento] = useState(
    formatDateForInput(eventoExistente?.dataEvento)
  );
  const [local, setLocal] = useState(eventoExistente?.local || "");

  useEffect(() => {
    if (eventoExistente) {
      setNome(eventoExistente.nome || "");
      setDescricao(eventoExistente.descricao || "");
      setDataEvento(formatDateForInput(eventoExistente.dataEvento));
      setLocal(eventoExistente.local || "");
    }
  }, [eventoExistente]);

  const handleSalvar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSalvando(true);

    const organizador = getOrganizadorLogado();
    if (!organizador || !organizador.id) {
      alert("Sessão expirada. Faça login novamente.");
      router.push("/login");
      return;
    }

    try {
      const dataIso = formatInputForBackend(dataEvento);

      if (eventoExistente && eventoExistente.id) {
        // Modo Edição: Verbo HTTP PUT
        // Envia apenas os campos editáveis mantendo o status atual e sem sobrescrever organizador
        const payloadAtualizacao = {
          nome,
          descricao,
          dataEvento: dataIso,
          local,
          status: eventoExistente.status || "ABERTO",
        };

        const resposta = await api.put(
          `/eventos/${eventoExistente.id}?organizadorId=${organizador.id}`,
          payloadAtualizacao
        );

        if (resposta.status === 200 || resposta.status === 204) {
          alert("Evento atualizado com sucesso!");
          router.push("/eventos");
        } else {
          alert("Não foi possível atualizar o evento.");
        }
      } else {
        // Modo Criação: Verbo HTTP POST
        const payloadCriacao = {
          nome,
          descricao,
          dataEvento: dataIso,
          local,
          organizadorId: organizador.id,
        };

        const resposta = await api.post("/eventos", payloadCriacao);

        if (resposta.status === 200 || resposta.status === 201) {
          alert("Evento criado com sucesso!");
          router.push("/eventos");
        } else {
          alert("Não foi possível criar o evento.");
        }
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 403) {
        alert("Apenas o organizador que criou o evento pode gerenciá-lo!");
      } else if (isAxiosError(error) && error.response?.status === 404) {
        alert("Evento não encontrado no sistema.");
      } else if (isAxiosError(error) && typeof error.response?.data === "string") {
        alert(error.response.data);
      } else {
        alert("Erro de comunicação com o servidor ao salvar o evento.");
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={handleSalvar} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            Nome do Evento / Workshop *
          </label>
          <input
            name="nome"
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Workshop de Arquitetura de Software 2026"
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            Descrição do Evento *
          </label>
          <textarea
            name="descricao"
            rows={3}
            required
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Breve resumo sobre a proposta, público-alvo e cronograma do evento..."
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            Data e Horário *
          </label>
          <input
            name="dataEvento"
            type="datetime-local"
            required
            value={dataEvento}
            onChange={(e) => setDataEvento(e.target.value)}
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B] [color-scheme:dark]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
            Local / Plataforma *
          </label>
          <input
            name="local"
            type="text"
            required
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Ex: Auditório Central Senac ou Online via Teams"
            className="w-full px-4 py-3 bg-[#150606] border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
        <Link
          href="/eventos"
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-medium text-sm rounded-full transition-colors border border-white/10"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={salvando}
          className="px-7 py-2.5 bg-[#FF3B3B] hover:bg-[#ff5c5c] text-[#150606] font-semibold text-sm rounded-full shadow-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B] disabled:opacity-50"
        >
          {salvando
            ? "Salvando..."
            : eventoExistente
            ? "Atualizar Evento"
            : "Salvar Evento"}
        </button>
      </div>
    </form>
  );
}
