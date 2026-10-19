package com.example.eventpro.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.eventpro.application.DTOs.auth.LoginRequest;
import com.example.eventpro.application.DTOs.auth.LoginResponse;
import com.example.eventpro.application.DTOs.usuario.RedefinirSenhaRequest;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.exception.InvalidCredentialsException;
import com.example.eventpro.domain.repository.UsuarioRepository;
import com.example.eventpro.infra.configuration.BcryptPasswordEncoderAdapter;

class AuthServiceTest {

    private static final String EMAIL = "organizador@eventpro.com";

    private UsuarioRepository usuarioRepository;
    private BcryptPasswordEncoderAdapter passwordEncoder;
    private TokenService tokenService;
    private AuthService authService;

    @BeforeEach
    void configurar() {
        usuarioRepository = mock(UsuarioRepository.class);
        passwordEncoder = new BcryptPasswordEncoderAdapter();

        tokenService = new TokenService();
        ReflectionTestUtils.setField(tokenService, "secret", "chave-de-teste");
        ReflectionTestUtils.setField(tokenService, "tempo", 5L);

        authService = new AuthService(tokenService, usuarioRepository, passwordEncoder);
    }

    private Usuario usuarioComSenhaCriptografada(String senhaPura) {
        Usuario usuario = new Usuario();
        usuario.setEmail(EMAIL);
        usuario.setSenha(passwordEncoder.encode(senhaPura));
        return usuario;
    }

    @Test
    void deveGerarTokenQuandoSenhaConfereComOHashSalvo() {
        when(usuarioRepository.findByEmail(EMAIL)).thenReturn(Optional.of(usuarioComSenhaCriptografada("senha123")));

        LoginResponse resposta = authService.autenticarOrganizador(new LoginRequest(EMAIL, "senha123"));

        assertNotNull(resposta.token());
        assertEquals(EMAIL, tokenService.verificadorToken(resposta.token()).getSubject());
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
        when(usuarioRepository.findByEmail(EMAIL)).thenReturn(Optional.of(usuarioComSenhaCriptografada("senhaAntiga")));
        String tokenRecuperacao = tokenService.geraToken(EMAIL);

        authService.redefinirSenhaPorToken(new RedefinirSenhaRequest(tokenRecuperacao, "senhaNova"));

        ArgumentCaptor<Usuario> usuarioSalvo = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(usuarioSalvo.capture());
        assertTrue(passwordEncoder.verifyPassword("senhaNova", usuarioSalvo.getValue().getSenha()));
    }
}
