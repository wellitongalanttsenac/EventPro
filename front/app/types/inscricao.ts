export type EnumStatusInscricao = "PENDENTE" | "CONFIRMADA" | "CANCELADA";

// GET /eventos/{eventoId}/inscricoes e GET /eventos/{eventoId}/inscricoes/{id}
export interface Inscricao {
  id: number;
  nomeParticipante: string;
  emailParticipante: string;
  dataInscricao: string | null;
  status: EnumStatusInscricao;
  credencial: string | null;
  eventoId: number | null;
}

// POST /eventos/{eventoId}/inscricoes
export interface CriarInscricaoRequest {
  nomeParticipante: string;
  emailParticipante: string;
}

// PATCH /eventos/{eventoId}/inscricoes/{id}/status?organizadorId=
export interface AtualizarStatusInscricaoRequest {
  status: EnumStatusInscricao;
}

export interface InscricaoFormProps {
  eventoIdPredefinido?: number;
}
