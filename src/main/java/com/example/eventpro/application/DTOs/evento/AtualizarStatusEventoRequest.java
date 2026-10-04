package com.example.eventpro.application.DTOs.evento;

import com.example.eventpro.domain.entities.EnumStatusEvento;

public record AtualizarStatusEventoRequest(EnumStatusEvento status) {
}
