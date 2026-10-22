import Link from "next/link";
import { Evento } from "../types/evento";
import { formatarDataHora } from "../utils/formatacao";
import StatusBadge from "./StatusBadge";

interface ResumoEventoProps {
  evento: Evento;
  atalho: { href: string; rotulo: string; icone: string };
}

// Cabeçalho do evento selecionado nas telas de palestrantes e inscrições
export default function ResumoEvento({ evento, atalho }: ResumoEventoProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-white break-words">{evento.nome}</h2>
          <StatusBadge status={evento.status} />
        </div>
        <p className="text-xs text-white/50 mt-1">
          Local: {evento.local || "Não especificado"} • Data: {formatarDataHora(evento.dataEvento)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={atalho.href}
          className="text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
        >
          <span aria-hidden="true">{atalho.icone}</span> {atalho.rotulo}
        </Link>
        <Link
          href={`/eventos/${evento.id}/editar`}
          className="text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors"
        >
          Editar evento
        </Link>
      </div>
    </div>
  );
}
