package com.example.eventpro.application.dto.evento;

import com.example.eventpro.domain.entities.EnumStatusEvento;

// DTO de entrada do PATCH /eventos/{id}/status: {"status": "CONCLUIDO"}.
public record AtualizarStatusEventoRequest(EnumStatusEvento status) {
}
