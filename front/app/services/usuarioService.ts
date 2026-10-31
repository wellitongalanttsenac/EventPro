import { Usuario } from "../types/usuario";
import api from "./api";

export async function buscarListaUsuarios(): Promise<Usuario[]> {
  const dados = await api.get<Usuario[]>("/usuarios");
  return dados.data;
}

export async function deletarUsuario(id: number): Promise<number> {
  const dados = await api.delete("/usuarios/" + id + "/excluir");
  return dados.status;
}

export async function atualizarStatusUsuario(usuario: Usuario): Promise<void> {
  const novoStatus = usuario.status === "ATIVO" ? { status: "BLOQUEADO" } : { status: "ATIVO" };
  await api.patch("/usuarios/" + usuario.id + "/status", novoStatus);
}

export async function consultaUsuarioPorId(id: number): Promise<Usuario> {
  const valorUsuarioBack = await api.get<Usuario>("/usuarios/" + id);
  return valorUsuarioBack.data;
}

export async function atualizarUsuario(usuario: Usuario): Promise<Usuario> {
  const dadosRetorno = await api.put<Usuario>("/usuarios/" + usuario.id, usuario);
  return dadosRetorno.data;
}

export async function salvarUsuario(usuario: Usuario): Promise<Usuario> {
  const dadosRetorno = await api.post<Usuario>("/usuarios", usuario);
  return dadosRetorno.data;
}

export async function buscarUsuarioLogado(): Promise<Usuario> {
  return (await api.get<Usuario>("/usuarios/buscarusuariologado")).data;
}
