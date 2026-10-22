import { EnumStatusEvento } from "../types/evento";
import { EnumStatusInscricao } from "../types/inscricao";
import { EnumStatusUsuario } from "../types/usuario";

type Status = EnumStatusEvento | EnumStatusInscricao | EnumStatusUsuario;

// Mesmas cores que as telas já usavam, agora em um único lugar
const ESTILO: Record<Status, { rotulo: string; classes: string }> = {
  ABERTO: { rotulo: "Aberto", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  EM_ANDAMENTO: { rotulo: "Em andamento", classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  CONCLUIDO: { rotulo: "Concluído", classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  CANCELADO: { rotulo: "Cancelado", classes: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  PENDENTE: { rotulo: "Pendente", classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  CONFIRMADA: { rotulo: "Confirmada", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  CANCELADA: { rotulo: "Cancelada", classes: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  ATIVO: { rotulo: "Ativo", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  BLOQUEADO: { rotulo: "Bloqueado", classes: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  EXCLUIDO: { rotulo: "Excluído", classes: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

export function rotuloStatus(status: Status): string {
  return ESTILO[status]?.rotulo ?? status;
}

export function classesStatus(status: Status): string {
  return ESTILO[status]?.classes ?? "bg-white/5 text-white/70 border-white/20";
}

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${classesStatus(status)}`}
    >
      {rotuloStatus(status)}
    </span>
  );
}
