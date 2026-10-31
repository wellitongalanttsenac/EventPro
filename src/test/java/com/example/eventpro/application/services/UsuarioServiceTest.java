package com.example.eventpro.application.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.eventpro.application.dto.auth.UsuarioLogado;
import com.example.eventpro.application.dto.usuario.CriarAdminRequest;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.exception.ChaveAdminInvalidaException;
import com.example.eventpro.domain.repository.UsuarioRepository;
import com.example.eventpro.infra.configuration.BcryptPasswordEncoderAdapter;

class UsuarioServiceTest {

    private static final String CHAVE_ADMIN = "chave-admin-teste";

    private UsuarioRepository usuarioRepository;
    private BcryptPasswordEncoderAdapter passwordEncoder;
    private AuthService authService;
    private UsuarioService usuarioService;

    @BeforeEach
    void configurar() {
        usuarioRepository = mock(UsuarioRepository.class);
        passwordEncoder = new BcryptPasswordEncoderAdapter();

        authService = mock(AuthService.class);

        usuarioService = new UsuarioService(usuarioRepository, passwordEncoder, authService);
        ReflectionTestUtils.setField(usuarioService, "secret", CHAVE_ADMIN);
    }

    @Test
    void deveBuscarUsuarioLogadoPeloIdDoToken() {
        var usuarioBanco = mock(Usuario.class);
        when(usuarioBanco.getId()).thenReturn(7L);
        when(authService.getUsuarioLogado()).thenReturn(new UsuarioLogado(7L, "org@eventpro.com", List.of()));
        when(usuarioRepository.findById(7L)).thenReturn(Optional.of(usuarioBanco));

        assertEquals(7L, usuarioService.buscarUsuarioLogado().id());
    }

    @Test
    void deveSalvarAdminComSenhaCriptografada() {
        var request = new CriarAdminRequest("Admin", "admin@eventpro.com", "senha123", "12345678909", CHAVE_ADMIN);

        usuarioService.criarAdmin(request);

        ArgumentCaptor<Usuario> adminSalvo = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(adminSalvo.capture());
        assertEquals("ROLE_ADMIN", adminSalvo.getValue().getRole());
        assertTrue(passwordEncoder.verifyPassword("senha123", adminSalvo.getValue().getSenha()));
    }

    @Test
    void deveRecusarCriacaoDeAdminComChaveInvalida() {
        var request = new CriarAdminRequest("Admin", "admin@eventpro.com", "senha123", "12345678909", "chave-errada");

        assertThrows(ChaveAdminInvalidaException.class, () -> usuarioService.criarAdmin(request));
        verify(usuarioRepository, never()).save(any());
    }
}
