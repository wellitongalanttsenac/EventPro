package com.example.eventpro.application.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import com.auth0.jwt.JWT;
import com.example.eventpro.application.dto.auth.LoginRequest;
import com.example.eventpro.application.dto.auth.LoginResponse;
import com.example.eventpro.application.dto.auth.UsuarioLogado;
import com.example.eventpro.application.dto.usuario.EsqueciSenhaRequest;
import com.example.eventpro.application.dto.usuario.RedefinirSenhaRequest;
import com.example.eventpro.domain.entities.Token;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.exception.InvalidCredentialsException;
import com.example.eventpro.domain.repository.TokenRepository;
import com.example.eventpro.domain.repository.UsuarioRepository;
import com.example.eventpro.infra.configuration.BcryptPasswordEncoderAdapter;

class AuthServiceTest {

    private static final String EMAIL = "organizador@eventpro.com";

    private UsuarioRepository usuarioRepository;
    private TokenRepository tokenRepository;
    private BcryptPasswordEncoderAdapter passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void configurar() {
        usuarioRepository = mock(UsuarioRepository.class);
        tokenRepository = mock(TokenRepository.class);
        passwordEncoder = new BcryptPasswordEncoderAdapter();

        TokenService tokenService = new TokenService(tokenRepository);
        ReflectionTestUtils.setField(tokenService, "secret", "chave-de-teste");
        ReflectionTestUtils.setField(tokenService, "tempo", 5L);

        authService = new AuthService(tokenService, usuarioRepository, passwordEncoder);
    }

    @AfterEach
    void limparUsuarioLogado() {
        SecurityContextHolder.clearContext();
    }

    private Usuario usuarioComSenhaCriptografada(String senhaPura) {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail(EMAIL);
        usuario.setSenha(passwordEncoder.encode(senhaPura));
        return usuario;
    }

    @Test
    void deveGerarESalvarTokenQuandoSenhaConfereComOHashSalvo() {
        when(usuarioRepository.findByEmail(EMAIL)).thenReturn(Optional.of(usuarioComSenhaCriptografada("senha123")));

        LoginResponse resposta = authService.autenticarOrganizador(new LoginRequest(EMAIL, "senha123"));

        assertNotNull(resposta.token());
        assertEquals(EMAIL, JWT.decode(resposta.token()).getSubject());
        verify(tokenRepository).save(any(Token.class));
    }

    @Test
    void deveRecusarLoginComSenhaErrada() {
        when(usuarioRepository.findByEmail(EMAIL)).thenReturn(Optional.of(usuarioComSenhaCriptografada("senha123")));

        assertThrows(InvalidCredentialsException.class,
                () -> authService.autenticarOrganizador(new LoginRequest(EMAIL, "senhaErrada")));
    }

    @Test
    void deveRecusarLoginDeEmailInexistente() {
        when(usuarioRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class,
                () -> authService.autenticarOrganizador(new LoginRequest(EMAIL, "senha123")));
    }

    @Test
    void deveSalvarNovaSenhaCriptografadaAoRedefinir() {
        Usuario usuario = usuarioComSenhaCriptografada("senhaAntiga");
        when(usuarioRepository.findByEmail(EMAIL)).thenReturn(Optional.of(usuario));
        String tokenRecuperacao = authService.gerarTokenRecuperacaoDeSenha(new EsqueciSenhaRequest(EMAIL)).tokenRecuperacao();
        when(tokenRepository.findTokenByToken(tokenRecuperacao)).thenReturn(Optional.of(new Token(tokenRecuperacao, usuario)));

        authService.redefinirSenhaPorToken(new RedefinirSenhaRequest(tokenRecuperacao, "senhaNova"));

        ArgumentCaptor<Usuario> usuarioSalvo = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(usuarioSalvo.capture());
        assertTrue(passwordEncoder.verifyPassword("senhaNova", usuarioSalvo.getValue().getSenha()));
    }

    @Test
    void deveLerOUsuarioLogadoQueOJwtFilterColocouNoSecurityContext() {
        UsuarioLogado usuarioLogado = new UsuarioLogado(1L, EMAIL, List.of());
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(usuarioLogado, null, usuarioLogado.authorities()));

        assertSame(usuarioLogado, authService.getUsuarioLogado());
    }
}
