package com.example.eventpro.application.dto.usuario;

// DTO de entrada do POST /auth/esqueci-senha: só o e-mail da conta.
public record EsqueciSenhaRequest(String email) {
}
