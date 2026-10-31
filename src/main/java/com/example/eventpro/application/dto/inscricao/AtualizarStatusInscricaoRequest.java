package com.example.eventpro.application.dto.inscricao;

import com.example.eventpro.domain.entities.EnumStatusInscricao;

// DTO de entrada do PATCH /eventos/{eventoId}/inscricoes/{id}/status: {"status": "CONFIRMADA"}.
public record AtualizarStatusInscricaoRequest(EnumStatusInscricao status) {
}
