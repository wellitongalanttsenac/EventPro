// Camada PRESENTATION: tradução de exceções em respostas HTTP.
package com.example.eventpro.presentation.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventpro.domain.exception.ChaveAdminInvalidaException;
import com.example.eventpro.domain.exception.InvalidCredentialsException;

import jakarta.servlet.http.HttpServletRequest;

/*
 * TRATAMENTO GLOBAL DE ERROS.
 *
 * @RestControllerAdvice: "escuta" as exceções lançadas por QUALQUER controller.
 * Cada @ExceptionHandler diz: "quando estourar a exceção X, responda com o status Y".
 *
 * Por que existe: na referência cada controller faz try/catch e escolhe o status na mão.
 * Centralizando aqui, os controllers ficam limpos e todo erro sai no mesmo formato (ErroResponse).
 * Clean Architecture: o domínio lança exceções de negócio sem saber de HTTP; esta camada traduz.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Login inválido -> 401 Unauthorized.
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErroResponse> credenciaisInvalidas(InvalidCredentialsException e, HttpServletRequest req) {
        return construirResposta(HttpStatus.UNAUTHORIZED, e.getMessage(), req);
    }

    // secretKey errada na criação de admin -> 403 Forbidden.
    @ExceptionHandler(ChaveAdminInvalidaException.class)
    public ResponseEntity<ErroResponse> chaveAdminInvalida(ChaveAdminInvalidaException e, HttpServletRequest req) {
        return construirResposta(HttpStatus.FORBIDDEN, e.getMessage(), req);
    }

    // Os services lancam ResponseStatusException (404, 403...), aqui mantemos o status e padronizamos o corpo
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErroResponse> statusDefinidoPeloService(ResponseStatusException e, HttpServletRequest req) {
        return construirResposta(HttpStatus.valueOf(e.getStatusCode().value()), e.getReason(), req);
    }

    // Validacoes de dominio (ex: CPF ou e-mail invalido) lancam IllegalArgumentException -> 400 Bad Request
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErroResponse> dadoInvalido(IllegalArgumentException e, HttpServletRequest req) {
        return construirResposta(HttpStatus.BAD_REQUEST, e.getMessage(), req);
    }

    // Construimos um metodo para evitar repetição de codigo em todas as exceptions (DRY)
    private ResponseEntity<ErroResponse> construirResposta(HttpStatus status, String mensagem, HttpServletRequest request) {
        ErroResponse corpoDaResposta = new ErroResponse(
                LocalDateTime.now(),
                status.value(),
                mensagem,
                request.getRequestURI()
        );

        return ResponseEntity.status(status).body(corpoDaResposta);
    }
}
