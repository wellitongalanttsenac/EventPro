package com.example.eventpro.presentation.exception;

import java.time.LocalDateTime;

// Corpo PADRÃO de erro da API. Toda falha tratada sai neste formato, por exemplo:
// {"timestamp": "...", "status": 404, "mensagem": "Evento nao encontrado na base", "path": "/eventos/9"}
// O front (services/api.ts) e o desktop (CadastroAdmin) leem o campo "mensagem" para mostrar ao usuário.
public record ErroResponse(
        LocalDateTime timestamp, // Quando o erro aconteceu.
        int status,              // Código HTTP.
        String mensagem,         // Explicação para o usuário.
        String path) {           // Rota que foi chamada.
}
