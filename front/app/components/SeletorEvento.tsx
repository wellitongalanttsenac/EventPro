"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import { Evento } from "@/app/types/evento";

interface SeletorEventoProps {
  eventoIdSelecionado?: number | null;
  onEventoChange?: (eventoId: number, evento: Evento) => void;
  rotaBase?: string;
  label?: string;
  desabilitado?: boolean;
  nomeEventoFallback?: string;
}

export default function SeletorEvento({
  eventoIdSelecionado,
  onEventoChange,
  rotaBase,
  label = "Selecione o Evento:",
  desabilitado = false,
  nomeEventoFallback,
}: SeletorEventoProps) {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarEventos();
  }, []);

  const carregarEventos = async () => {
    try {
      setCarregando(true);
      const organizadorLogado = getOrganizadorLogado();
      if (!organizadorLogado) return;

      const resposta = await api.get<Evento[]>("/eventos");
      if (resposta.status === 200 && Array.isArray(resposta.data)) {
        // Regra de negócio: apenas os eventos pertencentes ao organizador logado
        const meusEventos = resposta.data.filter(
          (ev) => ev.organizador?.id === organizadorLogado.id
        );
        setEventos(meusEventos);
      }
    } catch {
      // Ignora erro e finaliza carregamento
    } finally {
      setCarregando(false);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    if (!id) return;

    const evento = eventos.find((ev) => ev.id === id);
    if (evento && onEventoChange) {
      onEventoChange(id, evento);
    }

    if (rotaBase) {
      router.push(`${rotaBase}?eventoId=${id}`);
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center gap-3 bg-[#1D0B0B] border border-white/10 px-4 py-3 rounded-2xl animate-pulse">
        <div className="w-4 h-4 rounded-full border-2 border-[#FF3B3B] border-t-transparent animate-spin" />
        <span className="text-xs text-white/50">Carregando seus eventos...</span>
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#1D0B0B] border border-amber-500/20 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs">
          <span>⚠️</span>
          <span>Você ainda não possui nenhum evento cadastrado como organizador.</span>
        </div>
        <Link
          href="/eventos/novo"
          className="inline-flex items-center justify-center text-xs font-semibold text-[#150606] bg-[#FF3B3B] hover:bg-[#ff5c5c] px-4 py-2 rounded-full transition-colors whitespace-nowrap shadow-md"
        >
          ＋ Criar Primeiro Evento
        </Link>
      </div>
    );
  }

  if (desabilitado && eventoIdSelecionado) {
    const evSelecionado = eventos.find((ev) => ev.id === eventoIdSelecionado);
    const nomeExibicao =
      evSelecionado?.nome || nomeEventoFallback || `Evento #${eventoIdSelecionado}`;
    const statusExibicao = evSelecionado?.status;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#150606] border border-white/10 p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="text-[#FF3B3B] text-sm">❖</span>
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50 block">
              {label}
            </span>
            <span className="text-sm font-bold text-white flex items-center gap-2">
              {nomeExibicao}
              {statusExibicao && (
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/20 bg-white/5 text-white/70 font-normal">
                  {statusExibicao}
                </span>
              )}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center text-[10px] font-medium bg-white/5 text-white/50 border border-white/10 px-2.5 py-1 rounded-full w-fit">
          🔒 Somente Leitura (Fixo)
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#1D0B0B] border border-white/10 p-4 rounded-2xl shadow-lg">
      <label className="text-xs font-semibold uppercase tracking-wider text-white/70 whitespace-nowrap flex items-center gap-1.5">
        <span className="text-[#FF3B3B]">❖</span> {label}
      </label>

      <div className="flex-1 relative">
        <select
          value={eventoIdSelecionado ?? ""}
          onChange={handleSelect}
          disabled={desabilitado}
          className="w-full px-4 py-2.5 bg-[#150606] border border-white/10 rounded-xl text-sm text-white outline-none cursor-pointer transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="" disabled className="text-white/40">
            -- Selecione um evento para gerenciar --
          </option>
          {eventos.map((ev) => (
            <option key={ev.id ?? ""} value={ev.id ?? ""} className="bg-[#150606] text-white">
              {ev.nome} [{ev.status}] (ID #{ev.id})
            </option>
          ))}
        </select>
      </div>

      <span className="text-[11px] text-white/40 hidden md:inline-block">
        {eventos.length} evento{eventos.length > 1 ? "s" : ""} disponível{eventos.length > 1 ? "is" : ""}
      </span>
    </div>
  );
}
