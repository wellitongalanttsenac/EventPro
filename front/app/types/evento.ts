import { OrganizadorLogado } from "../services/auth";

export type EnumStatusEvento =
  | "ABERTO"
  | "EM_ANDAMENTO"
  | "CONCLUIDO"
  | "CANCELADO";

export interface Evento {
  id: number | null;
  nome: string;
  descricao: string;
  dataEvento: string;
  local: string;
  status: EnumStatusEvento;
  organizador?: OrganizadorLogado;
}

export interface EventoFormProps {
  eventoExistente?: Evento;
}

export interface CriarEventoRequest {
  nome: string;
  descricao: string;
  dataEvento: string;
  local: string;
  organizadorId: number;
}

export interface AtualizarStatusEventoRequest {
  status: EnumStatusEvento;
}
