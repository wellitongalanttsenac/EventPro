export type EnumStatusUsuario = "ATIVO" | "BLOQUEADO" | "EXCLUIDO";

// GET /usuarios e GET /usuarios/{id} (a API nunca devolve a senha)
export interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  status: EnumStatusUsuario;
}

// POST /usuarios
export interface CriarUsuarioRequest {
  nome: string;
  senha: string;
  cpf: string;
  email: string;
}

// PUT /usuarios/{id} (a senha nao e alterada por aqui)
export interface AtualizarUsuarioRequest {
  nome: string;
  cpf: string;
  email: string;
  status: EnumStatusUsuario;
}

export interface UsuarioFormProps {
  usuarioExistente?: Usuario;
}
