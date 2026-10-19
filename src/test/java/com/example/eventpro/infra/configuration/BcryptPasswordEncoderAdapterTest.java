package com.example.eventpro.infra.configuration;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class BcryptPasswordEncoderAdapterTest {

    private final BcryptPasswordEncoderAdapter passwordEncoder = new BcryptPasswordEncoderAdapter();

    @Test
    void deveAceitarSenhaCorretaContraOHashGerado() {
        String senhaCriptografada = passwordEncoder.encode("senha123");

        assertTrue(passwordEncoder.verifyPassword("senha123", senhaCriptografada));
    }

    @Test
    void deveRecusarSenhaErradaContraOHashGerado() {
        String senhaCriptografada = passwordEncoder.encode("senha123");

        assertFalse(passwordEncoder.verifyPassword("outraSenha", senhaCriptografada));
    }
}
