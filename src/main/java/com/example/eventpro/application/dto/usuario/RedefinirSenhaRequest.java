package com.example.eventpro.application.dto.usuario;

// DTO de entrada do PATCH /auth/redefinir-senha: o token recebido no esqueci-senha + a senha nova.
public record RedefinirSenhaRequest(String token, String novaSenha) {
}
