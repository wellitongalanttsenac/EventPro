// GET /eventos/{eventoId}/palestrantes e GET /eventos/{eventoId}/palestrantes/{id}
export interface Palestrante {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  eventoId: number | null;
}

// POST e PUT /eventos/{eventoId}/palestrantes...?organizadorId=
export interface PalestranteRequest {
  nome: string;
  cpf: string;
  email: string;
}

export interface PalestranteFormProps {
  palestranteExistente?: Palestrante;
  eventoIdPredefinido?: number;
}
