export type EnumStatusInscricao = "PENDENTE" | "CONFIRMADA" | "CANCELADA";

export class Inscricao {
  constructor(
    public id: number | null,
    public nomeParticipante: string,
    public emailParticipante: string,
    public dataInscricao: string | null,
    public status: EnumStatusInscricao,
    public credencial: string | null,
    public eventoId: number | null
  ) {}
}

export interface InscricaoFormProps {
  eventoIdPredefinido?: number;
}
