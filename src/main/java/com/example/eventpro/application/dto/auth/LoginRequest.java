package com.example.eventpro.application.dto.auth;

// DTO de ENTRADA do POST /auth/login. O JSON {"email": "...", "senha": "..."} vira este record.
// Quem recebe: AuthController -> AuthService.autenticarOrganizador.
public record LoginRequest(String email, String senha) {
}
