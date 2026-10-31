import { Palestrante } from "../types/palestrante";
import api from "./api";

export async function buscarListaPalestrantes(eventoId: number): Promise<Palestrante[]> {
  const dados = await api.get<Palestrante[]>("/eventos/" + eventoId + "/palestrantes");
  return dados.data;
}

export async function consultaPalestrantePorId(eventoId: number, id: number): Promise<Palestrante> {
  const valorPalestranteBack = await api.get<Palestrante>("/eventos/" + eventoId + "/palestrantes/" + id);
  return valorPalestranteBack.data;
}

export async function salvarPalestrante(eventoId: number, palestrante: Palestrante): Promise<Palestrante> {
  const dadosRetorno = await api.post<Palestrante>("/eventos/" + eventoId + "/palestrantes", palestrante);
  return dadosRetorno.data;
}

export async function atualizarPalestrante(eventoId: number, palestrante: Palestrante): Promise<Palestrante> {
  const dadosRetorno = await api.put<Palestrante>(
    "/eventos/" + eventoId + "/palestrantes/" + palestrante.id,
    palestrante
  );
  return dadosRetorno.data;
}

export async function deletarPalestrante(eventoId: number, id: number): Promise<number> {
  const dados = await api.delete("/eventos/" + eventoId + "/palestrantes/" + id + "/excluir");
  return dados.status;
}
