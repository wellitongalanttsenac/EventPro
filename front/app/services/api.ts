import axios from "axios";
import { logout } from "./auth";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

export { isAxiosError } from "axios";

// Interceptor de requisição: anexa o token JWT quando disponível
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("eventpro_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor de resposta: em caso de 401 (não autorizado), limpa sessão e redireciona
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        logout();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
