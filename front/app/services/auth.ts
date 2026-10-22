import { useSyncExternalStore } from "react";

export interface OrganizadorLogado {
  id: number;
  nome: string;
  email: string;
}

const CHAVE_ORGANIZADOR = "eventpro_organizador";
const CHAVE_TOKEN = "eventpro_token";
const EVENTO_SESSAO = "eventpro:sessao";

// Cache do ultimo valor lido: useSyncExternalStore exige o mesmo objeto enquanto nada mudar
let rawEmCache: string | null = null;
let organizadorEmCache: OrganizadorLogado | null = null;

function lerOrganizador(raw: string | null): OrganizadorLogado | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<OrganizadorLogado>;
    if (parsed && typeof parsed.id === "number" && parsed.nome && parsed.email) {
      return { id: parsed.id, nome: parsed.nome, email: parsed.email };
    }
    return null;
  } catch {
    return null;
  }
}

export function getOrganizadorLogado(): OrganizadorLogado | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CHAVE_ORGANIZADOR);
  if (raw !== rawEmCache) {
    rawEmCache = raw;
    organizadorEmCache = lerOrganizador(raw);
  }
  return organizadorEmCache;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CHAVE_TOKEN);
}

function avisarMudancaDeSessao(): void {
  window.dispatchEvent(new Event(EVENTO_SESSAO));
}

export function setOrganizadorLogado(organizador: OrganizadorLogado, token: string): void {
  if (typeof window === "undefined") return;
  // Salva apenas dados públicos estritamente necessários (sem senha, cpf ou entidade bruta)
  const sanitizado: OrganizadorLogado = {
    id: organizador.id,
    nome: organizador.nome,
    email: organizador.email,
  };
  localStorage.setItem(CHAVE_ORGANIZADOR, JSON.stringify(sanitizado));
  localStorage.setItem(CHAVE_TOKEN, token);
  avisarMudancaDeSessao();
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHAVE_ORGANIZADOR);
  localStorage.removeItem(CHAVE_TOKEN);
  avisarMudancaDeSessao();
}

function inscrever(aoMudar: () => void): () => void {
  // "storage" cobre outras abas; EVENTO_SESSAO cobre login/logout nesta aba
  window.addEventListener("storage", aoMudar);
  window.addEventListener(EVENTO_SESSAO, aoMudar);
  return () => {
    window.removeEventListener("storage", aoMudar);
    window.removeEventListener(EVENTO_SESSAO, aoMudar);
  };
}

const SEM_SESSAO_NO_SERVIDOR = () => undefined;

// undefined = ainda no servidor/hidratação; null = sem login; objeto = organizador logado
export function useOrganizadorLogado(): OrganizadorLogado | null | undefined {
  return useSyncExternalStore(inscrever, getOrganizadorLogado, SEM_SESSAO_NO_SERVIDOR);
}

export function parseJwtPayload(token: string): { sub?: string; [key: string]: unknown } | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
