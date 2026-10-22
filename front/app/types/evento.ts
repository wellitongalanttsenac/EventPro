import { Usuario } from "./usuario";

export type EnumStatusEvento =
  | "ABERTO"
  | "EM_ANDAMENTO"
  | "CONCLUIDO"
  | "CANCELADO";

// GET /eventos e GET /eventos/{id}
export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  dataEvento: string;
  local: string;
  status: EnumStatusEvento;
  organizador: Usuario | null;
}

export interface EventoFormProps {
  eventoExistente?: Evento;
}

// POST /eventos
export interface CriarEventoRequest {
  nome: string;
  descricao: string;
  dataEvento: string;
  local: string;
  organizadorId: number;
}

// PUT /eventos/{id}?organizadorId=
export interface AtualizarEventoRequest {
  nome: string;
  descricao: string;
  dataEvento: string;
  local: string;
  status: EnumStatusEvento;
}

// PATCH /eventos/{id}/status?organizadorId=
export interface AtualizarStatusEventoRequest {
  status: EnumStatusEvento;
}
