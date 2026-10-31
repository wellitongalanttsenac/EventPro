import { EnumStatusInscricao, Inscricao } from "../types/inscricao";
import api from "./api";

export async function buscarListaInscricoes(eventoId: number): Promise<Inscricao[]> {
  const dados = await api.get<Inscricao[]>("/eventos/" + eventoId + "/inscricoes");
  return dados.data;
}

export async function consultaInscricaoPorId(eventoId: number, id: number): Promise<Inscricao> {
  const valorInscricaoBack = await api.get<Inscricao>("/eventos/" + eventoId + "/inscricoes/" + id);
  return valorInscricaoBack.data;
}

export async function salvarInscricao(eventoId: number, inscricao: Inscricao): Promise<Inscricao> {
  const dadosRetorno = await api.post<Inscricao>("/eventos/" + eventoId + "/inscricoes", inscricao);
  return dadosRetorno.data;
}

// A API devolve a inscrição atualizada, já com a credencial quando confirmada
export async function atualizarStatusInscricao(
  eventoId: number,
  id: number,
  status: EnumStatusInscricao
): Promise<Inscricao> {
  const dadosRetorno = await api.patch<Inscricao>("/eventos/" + eventoId + "/inscricoes/" + id + "/status", {
    status,
  });
  return dadosRetorno.data;
}

export async function cancelarInscricao(eventoId: number, id: number): Promise<number> {
  const dados = await api.delete("/eventos/" + eventoId + "/inscricoes/" + id + "/excluir");
  return dados.status;
}
