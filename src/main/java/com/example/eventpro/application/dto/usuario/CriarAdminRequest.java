package com.example.eventpro.application.dto.usuario;

// DTO de entrada do POST /usuarios/admin (enviado pelo desktop JavaFX). Igual à referência.
// secretKey: precisa ser igual à spring.secretkey do application.properties, senão o admin não é criado.
public record CriarAdminRequest(String nome, String email, String senha, String cpf, String secretKey) {
}
