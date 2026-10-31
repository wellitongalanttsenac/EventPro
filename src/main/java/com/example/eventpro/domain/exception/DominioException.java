// Camada DOMAIN: exceções que representam quebras de regra de negócio.
package com.example.eventpro.domain.exception;

/*
 * Classe MÃE de todas as exceções de domínio.
 *  - abstract: não dá para lançar uma "DominioException" genérica, só as filhas (específicas).
 *  - extends RuntimeException: exceção não checada, não obriga "throws" em todo método.
 *
 * Quem trata: o GlobalExceptionHandler (camada presentation) traduz cada filha em um status HTTP.
 * Assim o domínio não conhece HTTP (Clean Architecture: as dependências apontam para dentro).
 */
public abstract class DominioException extends RuntimeException {
    // protected: só as classes filhas chamam este construtor.
    protected DominioException(String mensagem) {
        super(mensagem); // Guarda a mensagem no RuntimeException (getMessage()).
    }
}
