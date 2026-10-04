package com.example.eventpro.application.DTOs.usuario;

import com.example.eventpro.domain.entities.EnumStatus;

public record AtualizarStatusUsuarioRequest(EnumStatus status) {
}
