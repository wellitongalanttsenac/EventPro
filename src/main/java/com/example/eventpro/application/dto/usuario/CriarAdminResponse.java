package com.example.eventpro.application.dto.usuario;

// DTO de saída do POST /usuarios/admin: id gerado e mensagem para o desktop. Igual à referência.
public record CriarAdminResponse(Long id, String mensagem) {
}
