package com.example.eventpro.domain.exception;

// Lancada quando a secretKey enviada para criar um admin nao confere com a chave configurada.
// O GlobalExceptionHandler transforma em HTTP 403 (proibido) e o desktop mostra a mensagem.
public class ChaveAdminInvalidaException extends DominioException {

    public ChaveAdminInvalidaException(String mensagem) {
        super(mensagem);
    }

}
