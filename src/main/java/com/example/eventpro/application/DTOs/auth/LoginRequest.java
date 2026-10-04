package com.example.eventpro.application.DTOs.auth;

// Dados enviados pelo organizador para se autenticar
public record LoginRequest(String email, String senha) {
}
