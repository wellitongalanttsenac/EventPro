package com.example.eventpro.application.dto.palestrante;

// DTO de entrada do POST /eventos/{eventoId}/palestrantes. O evento vem pela URL.
public record CriarPalestranteRequest(String nome, String cpf, String email) {
}
