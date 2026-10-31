package com.example.eventpro.infra.configuration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.eventpro.application.dto.auth.UsuarioLogado;
import com.example.eventpro.application.services.TokenService;

class JwtFilterTest {

    private TokenService tokenService;
    private JwtFilter jwtFilter;
    private MockHttpServletResponse response;
    private MockFilterChain filterChain;

    @BeforeEach
    void configurar() {
        tokenService = mock(TokenService.class);
        jwtFilter = new JwtFilter();
        ReflectionTestUtils.setField(jwtFilter, "tokenService", tokenService);

        response = new MockHttpServletResponse();
        filterChain = new MockFilterChain();
    }

    @AfterEach
    void limparUsuarioLogado() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void deveResponder401QuandoRotaProtegidaChegaSemToken() throws Exception {
        jwtFilter.doFilter(new MockHttpServletRequest("GET", "/eventos"), response, filterChain);

        assertEquals(401, response.getStatus());
        assertNull(filterChain.getRequest());
    }

    @Test
    void deveResponder401QuandoTokenEInvalido() throws Exception {
        var request = new MockHttpServletRequest("GET", "/eventos");
        request.addHeader("Authorization", "Bearer token-invalido");
        when(tokenService.verificarToken("token-invalido")).thenThrow(new IllegalArgumentException("Token Invalido!"));

        jwtFilter.doFilter(request, response, filterChain);

        assertEquals(401, response.getStatus());
        assertNull(filterChain.getRequest());
    }

    @Test
    void deveLiberarRotaPublicaSemToken() throws Exception {
        // O desktop cria o admin sem estar logado, quem protege essa rota e a secretKey
        jwtFilter.doFilter(new MockHttpServletRequest("POST", "/usuarios/admin"), response, filterChain);

        assertEquals(200, response.getStatus());
        assertNotNull(filterChain.getRequest());
    }

    @Test
    void deveColocarOUsuarioLogadoNoSecurityContextQuandoTokenEValido() throws Exception {
        var request = new MockHttpServletRequest("GET", "/eventos");
        request.addHeader("Authorization", "Bearer token-valido");
        var usuarioLogado = new UsuarioLogado(1L, "organizador@eventpro.com", List.of(new SimpleGrantedAuthority("ROLE_USER")));
        when(tokenService.verificarToken("token-valido")).thenReturn(usuarioLogado);

        jwtFilter.doFilter(request, response, filterChain);

        assertNotNull(filterChain.getRequest());
        assertSame(usuarioLogado, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
    }
}
