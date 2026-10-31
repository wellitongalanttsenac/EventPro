package com.example.eventpro.application.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.example.eventpro.application.dto.auth.UsuarioLogado;
import com.example.eventpro.domain.entities.Token;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.repository.TokenRepository;

// Igual a referencia: o token gerado no login fica salvo na tabela "token"
// e so e aceito se tiver assinatura valida E existir no banco
class TokenServiceTest {

    private static final String EMAIL = "organizador@eventpro.com";

    private TokenRepository tokenRepository;
    private TokenService tokenService;

    @BeforeEach
    void configurar() {
        tokenRepository = mock(TokenRepository.class);

        tokenService = new TokenService(tokenRepository);
        ReflectionTestUtils.setField(tokenService, "secret", "chave-de-teste");
        ReflectionTestUtils.setField(tokenService, "tempo", 5L);
    }

    private Usuario organizador() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail(EMAIL);
        return usuario;
    }

    @Test
    void deveSalvarOTokenGeradoParaOUsuario() {
        Usuario usuario = organizador();

        String token = tokenService.gerarToken(usuario);

        ArgumentCaptor<Token> tokenSalvo = ArgumentCaptor.forClass(Token.class);
        verify(tokenRepository).save(tokenSalvo.capture());
        assertEquals(token, tokenSalvo.getValue().getToken());
        assertEquals(usuario, tokenSalvo.getValue().getUsuario());
        assertEquals(EMAIL, JWT.decode(token).getSubject());
    }

    @Test
    void deveDevolverUsuarioLogadoQuandoTokenEstaNoBanco() {
        Usuario usuario = organizador();
        String token = tokenService.gerarToken(usuario);
        when(tokenRepository.findTokenByToken(token)).thenReturn(Optional.of(new Token(token, usuario)));

        UsuarioLogado usuarioLogado = tokenService.verificarToken(token);

        assertEquals(1L, usuarioLogado.id());
        assertEquals(EMAIL, usuarioLogado.email());
        assertEquals("ROLE_USER", usuarioLogado.authorities().iterator().next().getAuthority());
    }

    @Test
    void deveRecusarTokenQueNaoFoiSalvoNoBanco() {
        String token = tokenService.gerarToken(organizador());
        when(tokenRepository.findTokenByToken(token)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> tokenService.verificarToken(token));
    }

    @Test
    void deveRecusarTokenAssinadoComOutraChave() {
        String tokenFalso = JWT.create().withIssuer("EVENTPRO").withSubject(EMAIL).sign(Algorithm.HMAC256("outra-chave"));

        assertThrows(JWTVerificationException.class, () -> tokenService.verificarToken(tokenFalso));
    }
}
