package com.example.eventpro.presentation.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.eventpro.domain.exception.InvalidCredentialsException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice 
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErroResponse> credenciaisInvalidas(InvalidCredentialsException e, HttpServletRequest req){
        return construirResposta(HttpStatus.FORBIDDEN, e.getMessage(), req);
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
