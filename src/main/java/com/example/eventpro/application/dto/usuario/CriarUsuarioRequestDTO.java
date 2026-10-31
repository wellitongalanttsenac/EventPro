package com.example.eventpro.application.dto.usuario;

// DTO de entrada do POST /usuarios (cadastro de organizador). Igual ao UsuarioRequest da referência.
// A senha chega pura aqui e o UsuarioService criptografa antes de salvar.
public record CriarUsuarioRequestDTO(String nome, String senha, String cpf, String email) {
}
