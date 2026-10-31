import { EnumStatusEvento, Evento } from "../types/evento";
import api from "./api";

export async function buscarListaEventos(): Promise<Evento[]> {
  const dados = await api.get<Evento[]>("/eventos");
  return dados.data;
}

// Regra de negócio: apenas os eventos pertencentes ao organizador logado
export async function buscarEventosDoOrganizador(organizadorId: number | null): Promise<Evento[]> {
  const eventos = await buscarListaEventos();
  return eventos.filter((evento) => evento.organizador?.id === organizadorId);
}

export async function consultaEventoPorId(id: number): Promise<Evento> {
  const valorEventoBack = await api.get<Evento>("/eventos/" + id);
  return valorEventoBack.data;
}

// Regra de posse: devolve null quando o evento é de outro organizador
export async function consultaEventoDoOrganizador(id: number, organizadorId: number | null): Promise<Evento | null> {
  const evento = await consultaEventoPorId(id);
  return evento.organizador?.id === organizadorId ? evento : null;
}

export async function salvarEvento(evento: Evento): Promise<Evento> {
  const dadosRetorno = await api.post<Evento>("/eventos", evento);
  return dadosRetorno.data;
}

export async function atualizarEvento(evento: Evento): Promise<Evento> {
  const dadosRetorno = await api.put<Evento>("/eventos/" + evento.id, evento);
  return dadosRetorno.data;
}

export async function atualizarStatusEvento(id: number, status: EnumStatusEvento): Promise<void> {
  await api.patch("/eventos/" + id + "/status", { status });
}

export async function cancelarEvento(id: number): Promise<number> {
  const dados = await api.delete("/eventos/" + id + "/excluir");
  return dados.status;
}
