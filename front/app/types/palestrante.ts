import { Evento } from "./evento";

export interface Palestrante {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  evento?: Evento;
}

export interface PalestranteFormProps {
  palestranteExistente?: Palestrante;
  eventoIdPredefinido?: number;
}
