package com.example.eventpro.domain.valueobject;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class CPFTest {

    @Test
    void deveAceitarCpfValidoEFormatarNoToString() {
        CPF cpf = new CPF("12345678909");

        assertEquals("123.456.789-09", cpf.toString());
    }

    @Test
    void deveAceitarCpfValidoJaFormatado() {
        CPF cpf = new CPF("123.456.789-09");

        assertEquals("123.456.789-09", cpf.toString());
    }

    @Test
    void deveRecusarCpfComDigitoVerificadorErrado() {
        assertThrows(IllegalArgumentException.class, () -> new CPF("12345678900"));
    }

    @Test
    void deveRecusarCpfComTodosOsDigitosIguais() {
        assertThrows(IllegalArgumentException.class, () -> new CPF("11111111111"));
    }

    @Test
    void deveRecusarCpfNulo() {
        assertThrows(IllegalArgumentException.class, () -> new CPF(null));
    }
}
