import { Usuario } from "./usuario";

export type EnumStatusEvento = "ABERTO" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO";

export class Evento {
  constructor(
    public id: number | null,
    public nome: string,
    public descricao: string,
    public dataEvento: string,
    public local: string,
    public status: EnumStatusEvento,
    public organizador: Usuario | null
  ) {}
}

export interface EventoFormProps {
  eventoExistente?: Evento;
}
