package com.example.eventpro.application.dto.palestrante;

// DTO de entrada do PUT /eventos/{eventoId}/palestrantes/{id}: todas as informações editáveis.
public record AtualizarPalestranteRequest(String nome, String cpf, String email) {
}
