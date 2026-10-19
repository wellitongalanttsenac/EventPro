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

@RestControllerAdvice 
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErroResponse> credenciaisInvalidas(InvalidCredentialsException e, HttpServletRequest req){
        return construirResposta(HttpStatus.UNAUTHORIZED, e.getMessage(), req);
    }

    @ExceptionHandler(ChaveAdminInvalidaException.class)
    public ResponseEntity<ErroResponse> chaveAdminInvalida(ChaveAdminInvalidaException e, HttpServletRequest req){
        return construirResposta(HttpStatus.FORBIDDEN, e.getMessage(), req);
    }

    // Os services lancam ResponseStatusException (404, 403...), aqui mantemos o status e padronizamos o corpo
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErroResponse> statusDefinidoPeloService(ResponseStatusException e, HttpServletRequest req){
        return construirResposta(HttpStatus.valueOf(e.getStatusCode().value()), e.getReason(), req);
    }

    // Validacoes de dominio (ex: CPF ou e-mail invalido) lancam IllegalArgumentException
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErroResponse> dadoInvalido(IllegalArgumentException e, HttpServletRequest req){
        return construirResposta(HttpStatus.BAD_REQUEST, e.getMessage(), req);
    }


    // Contruimos um metodo para evitar repetição de codigo em todas as exceptions
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
