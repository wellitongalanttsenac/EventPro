package com.example.eventpro.domain.exception;

public abstract class DominioException extends RuntimeException {
    protected DominioException(String mensagem) {
        super(mensagem);
    }
}
