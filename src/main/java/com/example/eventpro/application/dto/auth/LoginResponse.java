package com.example.eventpro.application.dto.auth;

// DTO de SAÍDA do login: {"token": "eyJ..."}.
// O front guarda esse token e manda em todas as requisições no header "Authorization: Bearer <token>".
public record LoginResponse(String token) {
}
