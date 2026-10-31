package com.example.eventpro.application.dto.usuario;

import com.example.eventpro.domain.entities.EnumStatus;

// DTO de entrada do PUT /usuarios/{id}. Não tem senha: a senha não é alterada por aqui
// (só pelo fluxo de esqueci/redefinir senha do AuthService).
public record AtualizarUsuarioRequestDTO(String nome, String cpf, String email, EnumStatus status) {
}
