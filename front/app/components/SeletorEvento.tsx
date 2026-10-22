"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, mensagemDeErro } from "@/app/services/api";
import { getOrganizadorLogado } from "@/app/services/auth";
import { Evento } from "@/app/types/evento";
import StatusBadge, { rotuloStatus } from "./StatusBadge";

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
  label = "Selecione o evento",
  desabilitado = false,
  nomeEventoFallback,
}: SeletorEventoProps) {
  const router = useRouter();
  const idCampo = useId();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    const carregarEventos = async () => {
      try {
        const resposta = await api.get<Evento[]>("/eventos");
        const organizadorLogado = getOrganizadorLogado();
        // Regra de negócio: apenas os eventos pertencentes ao organizador logado
        const meusEventos = resposta.data.filter(
          (ev) => ev.organizador?.id === organizadorLogado?.id
        );
        if (ativo) setEventos(meusEventos);
      } catch (error) {
        if (ativo) setErro(mensagemDeErro(error, "Não foi possível carregar seus eventos."));
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    carregarEventos();
    return () => {
      ativo = false;
    };
  }, []);

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

  if (erro) {
    return (
      <div role="alert" className="bg-[#1D0B0B] border border-rose-500/20 p-4 rounded-2xl text-xs text-rose-300">
        {erro}
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#1D0B0B] border border-amber-500/20 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs">
          <span aria-hidden="true">⚠️</span>
          <span>Você ainda não organiza nenhum evento. Crie um para gerenciar palestrantes e inscrições.</span>
        </div>
        <Link
          href="/eventos/novo"
          className="inline-flex items-center justify-center text-xs font-semibold text-[#150606] bg-[#FF3B3B] hover:bg-[#ff5c5c] px-4 py-2 rounded-full transition-colors whitespace-nowrap shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF3B3B]"
        >
          ＋ Criar primeiro evento
        </Link>
      </div>
    );
  }

  if (desabilitado && eventoIdSelecionado) {
    const evSelecionado = eventos.find((ev) => ev.id === eventoIdSelecionado);
    const nomeExibicao =
      evSelecionado?.nome || nomeEventoFallback || `Evento #${eventoIdSelecionado}`;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#150606] border border-white/10 p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[#FF3B3B] text-sm" aria-hidden="true">❖</span>
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50 block">
              {label}
            </span>
            <span className="text-sm font-bold text-white flex flex-wrap items-center gap-2">
              <span className="break-words">{nomeExibicao}</span>
              {evSelecionado && <StatusBadge status={evSelecionado.status} />}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center text-[10px] font-medium bg-white/5 text-white/50 border border-white/10 px-2.5 py-1 rounded-full w-fit">
          🔒 Não pode ser alterado
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#1D0B0B] border border-white/10 p-4 rounded-2xl shadow-lg">
      <label
        htmlFor={idCampo}
        className="text-xs font-semibold uppercase tracking-wider text-white/70 whitespace-nowrap flex items-center gap-1.5"
      >
        <span className="text-[#FF3B3B]" aria-hidden="true">❖</span> {label}
      </label>

      <div className="flex-1 min-w-0">
        <select
          id={idCampo}
          value={eventoIdSelecionado ?? ""}
          onChange={handleSelect}
          disabled={desabilitado}
          className="w-full px-4 py-2.5 bg-[#150606] border border-white/10 rounded-xl text-sm text-white outline-none cursor-pointer transition-colors focus:border-[#FF3B3B] focus-visible:ring-1 focus-visible:ring-[#FF3B3B] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="" disabled className="text-white/40">
            Selecione um evento para gerenciar
          </option>
          {eventos.map((ev) => (
            <option key={ev.id} value={ev.id} className="bg-[#150606] text-white">
              {ev.nome} ({rotuloStatus(ev.status)})
            </option>
          ))}
        </select>
      </div>

      <span className="text-[11px] text-white/40 hidden md:inline-block whitespace-nowrap">
        {eventos.length} evento{eventos.length > 1 ? "s" : ""} disponíve{eventos.length > 1 ? "is" : "l"}
      </span>
    </div>
  );
}
