// Camada DOMAIN: value objects.
package com.example.eventpro.domain.valueobject;

import jakarta.persistence.Embeddable;

/*
 * VALUE OBJECT CPF (igual à referência do professor)
 *
 * Conceito DDD: value object é um objeto que não tem identidade (não tem id),
 * vale apenas pelo seu conteúdo e é responsável por se manter válido.
 * Aqui: é impossível existir um CPF inválido dentro do domínio, porque o construtor recusa.
 *
 * Quem usa: Usuario (campo cpf) e UsuarioService (ao atualizar o CPF).
 *
 * @Embeddable: o JPA grava o campo "cpf" desta classe dentro da tabela usuario
 * (não cria tabela própria). Fica na coluna "cpf", então o banco atual continua compatível.
 */
@Embeddable
public class CPF {

    private String cpf;

    // Construtor vazio exigido pelo JPA para ler do banco.
    public CPF() {
        this.cpf = "";
    }

    // Construtor usado pelo sistema: valida antes de aceitar.
    public CPF(String cpf) {

        if (!isValidCpf(cpf)) {
            throw new IllegalArgumentException("CPF Invalido!"); // Vira 400 no GlobalExceptionHandler.
        }

        this.cpf = cpf;
    }

    // Algoritmo oficial de validação dos dois dígitos verificadores do CPF.
    // static: não depende de um objeto, pode ser chamado como CPF.isValidCpf("...").
    public static boolean isValidCpf(String cpf) {
        if (cpf == null) {
            return false;
        }

        // Remove tudo o que não for dígito
        cpf = cpf.replaceAll("\\D", "");

        // Verifica se tem 11 dígitos
        if (cpf.length() != 11) {
            return false;
        }

        // Descarta CPFs com todos os dígitos iguais (ex: 000.000.000-00)
        if (cpf.matches("(\\d)\\1{10}")) {
            return false;
        }

        try {
            // Cálculo do 1º dígito verificador: multiplica os 9 primeiros dígitos por 10, 9, 8... 2
            int soma = 0;
            for (int i = 0; i < 9; i++) {
                soma += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
            }
            int digito1 = 11 - (soma % 11);
            if (digito1 > 9) {
                digito1 = 0;
            }

            if (digito1 != Character.getNumericValue(cpf.charAt(9))) {
                return false;
            }

            // Cálculo do 2º dígito verificador: multiplica os 10 primeiros dígitos por 11, 10, 9... 2
            soma = 0;
            for (int i = 0; i < 10; i++) {
                soma += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
            }
            int digito2 = 11 - (soma % 11);
            if (digito2 > 9) {
                digito2 = 0;
            }

            return digito2 == Character.getNumericValue(cpf.charAt(10));

        } catch (NumberFormatException e) {
            return false;
        }
    }

    // Sempre devolve formatado: 123.456.789-09 (os DTOs de resposta usam este método).
    @Override
    public String toString() {
        return cpf.replaceAll("\\D", "")
                .replaceAll("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4");
    }

}
