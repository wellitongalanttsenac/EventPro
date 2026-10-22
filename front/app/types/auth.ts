// POST /auth/login
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

// Corpo de erro padrao da API (GlobalExceptionHandler)
export interface ErroResponse {
  timestamp: string;
  status: number;
  mensagem: string;
  path: string;
}
