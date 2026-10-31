import { Usuario } from "./usuario";

export interface LoginResponse {
  token: string;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string;
}

// Corpo de erro padrao da API (GlobalExceptionHandler)
export interface ErroResponse {
  timestamp: string;
  status: number;
  mensagem: string;
  path: string;
}
