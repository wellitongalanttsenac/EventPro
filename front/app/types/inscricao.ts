import { Evento } from "./evento";

export type EnumStatusInscricao = "PENDENTE" | "CONFIRMADA" | "CANCELADA";

export interface Inscricao {
  id: number | null;
  nomeParticipante: string;
  emailParticipante: string;
  dataInscricao?: string;
  status: EnumStatusInscricao;
  credencial?: string | null;
  evento?: Evento;
}

export interface CriarInscricaoRequest {
  nomeParticipante: string;
  emailParticipante: string;
}

export interface AtualizarStatusInscricaoRequest {
  status: EnumStatusInscricao;
}

export interface InscricaoFormProps {
  eventoIdPredefinido?: number;
}
