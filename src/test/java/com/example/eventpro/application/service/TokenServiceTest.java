package com.example.eventpro.application.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

// Mesmas propriedades da referencia: uma unica chave (spring.secretkey) e spring.tempo_expiracao
class TokenServiceTest {

    private final ApplicationContextRunner contexto = new ApplicationContextRunner()
            .withBean(TokenService.class)
            .withPropertyValues("spring.secretkey=chave-de-teste", "spring.tempo_expiracao=5");

    @Test
    void deveGerarEValidarTokenComAsPropriedadesDaReferencia() {
        contexto.run(ctx -> {
            assertThat(ctx).hasNotFailed();

            TokenService tokenService = ctx.getBean(TokenService.class);
            String token = tokenService.geraToken("organizador@eventpro.com");

            assertThat(tokenService.verificadorToken(token).getSubject()).isEqualTo("organizador@eventpro.com");
        });
    }
}
