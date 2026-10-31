"use client";

import axios, { isAxiosError } from "axios";
import Cookies from "js-cookie";
import { logout } from "../redux/slices/authSlice";
import { store } from "../redux/store";
import { ErroResponse } from "../types/auth";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Em 401 fora do login a sessão é encerrada e o layout do sistema leva para /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const ehLogin = error?.config?.url?.startsWith("/auth/");
    if (error?.response?.status === 401 && !ehLogin) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

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

export default api;
