package com.example.eventpro.application.dto.inscricao;

// DTO de entrada do POST /eventos/{eventoId}/inscricoes. O evento vem pela URL, não pelo corpo.
public record CriarInscricaoRequest(String nomeParticipante, String emailParticipante) {
}
