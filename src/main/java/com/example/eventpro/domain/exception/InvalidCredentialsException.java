package com.example.eventpro.domain.exception;

// Lançada pelo AuthService quando e-mail ou senha não conferem.
// O GlobalExceptionHandler transforma em HTTP 401 (não autorizado).
public class InvalidCredentialsException extends DominioException {

    public InvalidCredentialsException(String mensagem) {
        super(mensagem);
    }

}
