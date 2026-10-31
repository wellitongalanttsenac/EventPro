export class Palestrante {
  constructor(
    public id: number | null,
    public nome: string,
    public cpf: string,
    public email: string,
    public eventoId: number | null
  ) {}
}

export interface PalestranteFormProps {
  palestranteExistente?: Palestrante;
  eventoIdPredefinido?: number;
}
