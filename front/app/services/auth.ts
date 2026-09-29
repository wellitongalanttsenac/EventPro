export interface OrganizadorLogado {
  id: number;
  nome: string;
  email: string;
}

export function getOrganizadorLogado(): OrganizadorLogado | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("eventpro_organizador");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<OrganizadorLogado>;
    if (parsed && typeof parsed.id === "number" && parsed.nome && parsed.email) {
      return {
        id: parsed.id,
        nome: parsed.nome,
        email: parsed.email,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function setOrganizadorLogado(organizador: OrganizadorLogado, token: string): void {
  if (typeof window === "undefined") return;
  // Salva apenas dados públicos estritamente necessários (sem senha, cpf ou entidade bruta)
  const sanitizado: OrganizadorLogado = {
    id: organizador.id,
    nome: organizador.nome,
    email: organizador.email,
  };
  localStorage.setItem("eventpro_organizador", JSON.stringify(sanitizado));
  localStorage.setItem("eventpro_token", token);
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("eventpro_organizador");
  localStorage.removeItem("eventpro_token");
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
