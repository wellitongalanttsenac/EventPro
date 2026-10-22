import axios, { isAxiosError } from "axios";
import { getToken, logout } from "./auth";
import { ErroResponse } from "../types/auth";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

export { isAxiosError };

// Interceptor de requisição: anexa o token JWT quando disponível
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta: em 401 fora do login a sessão é encerrada.
// O layout do sistema percebe a sessão vazia e leva o usuário para /login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const ehLogin = error?.config?.url?.startsWith("/auth/");
    if (error?.response?.status === 401 && !ehLogin) {
      logout();
    }
    return Promise.reject(error);
  }
);

export function statusDoErro(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined;
}

// Traduz qualquer falha da API em uma frase para o usuário.
// Prioridade: mensagem enviada pela API (ErroResponse) > texto padrão por status > texto padrão da tela.
export function mensagemDeErro(error: unknown, padrao: string): string {
  if (!isAxiosError(error)) return padrao;

  if (!error.response) {
    return "Não foi possível conectar à API em localhost:8080. Verifique se o back end está rodando.";
  }

  const corpo = error.response.data as Partial<ErroResponse> | string | undefined;
  if (corpo && typeof corpo === "object" && corpo.mensagem) {
    return corpo.mensagem;
  }
  if (typeof corpo === "string" && corpo.trim() && !corpo.trim().startsWith("<")) {
    return corpo.trim();
  }

  switch (error.response.status) {
    case 401:
      return "Sessão inválida. Entre novamente.";
    case 403:
      return "Você não tem permissão para esta ação.";
    case 404:
      return "Registro não encontrado.";
    default:
      return padrao;
  }
}
