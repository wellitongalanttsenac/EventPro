package com.example.eventpro.application.dto.usuario;

import com.example.eventpro.domain.entities.EnumStatus;

// DTO de entrada do PATCH /usuarios/{id}/status: {"status": "BLOQUEADO"}. Igual ao AtualizarStatusRequest da referência.
public record AtualizarStatusUsuarioRequest(EnumStatus status) {
}
