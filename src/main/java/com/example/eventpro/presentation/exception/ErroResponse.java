package com.example.eventpro.presentation.exception;

import java.time.LocalDateTime;

public record ErroResponse(
        LocalDateTime timestamp,
        int status,
        String mensagem,
        String path) {
}
