package com.example.eventpro.presentation.exception;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventpro.application.service.AuthService;
import com.example.eventpro.application.service.UsuarioService;
import com.example.eventpro.domain.exception.ChaveAdminInvalidaException;
import com.example.eventpro.domain.exception.InvalidCredentialsException;
import com.example.eventpro.presentation.AuthController;
import com.example.eventpro.presentation.UsuarioController;

class GlobalExceptionHandlerTest {

    private AuthService authService;
    private UsuarioService usuarioService;
    private MockMvc mockMvc;

    @BeforeEach
    void configurar() {
        authService = mock(AuthService.class);
        usuarioService = mock(UsuarioService.class);

        var authController = new AuthController();
        ReflectionTestUtils.setField(authController, "authService", authService);

        var usuarioController = new UsuarioController();
        ReflectionTestUtils.setField(usuarioController, "usuarioService", usuarioService);

        mockMvc = MockMvcBuilders.standaloneSetup(authController, usuarioController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void deveResponder401QuandoCredenciaisInvalidas() throws Exception {
        when(authService.autenticarOrganizador(any())).thenThrow(new InvalidCredentialsException("Usuario ou senha invalidos!"));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"a@a.com\",\"senha\":\"x\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensagem").value("Usuario ou senha invalidos!"));
    }

    @Test
    void deveResponder403QuandoChaveDeAdminInvalida() throws Exception {
        when(usuarioService.criarAdmin(any())).thenThrow(new ChaveAdminInvalidaException("Chave de criacao de admin invalida!"));

        mockMvc.perform(post("/usuarios/admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Admin\",\"secretKey\":\"errada\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.mensagem").value("Chave de criacao de admin invalida!"));
    }

    @Test
    void deveManterStatusEMensagemDaResponseStatusException() throws Exception {
        when(usuarioService.buscarUsuarioPorId(99L)).thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado na base"));

        mockMvc.perform(get("/usuarios/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensagem").value("Usuario nao encontrado na base"))
                .andExpect(jsonPath("$.path").value("/usuarios/99"));
    }

    @Test
    void deveResponder400QuandoDadoInvalido() throws Exception {
        when(usuarioService.buscarUsuarioPorId(1L)).thenThrow(new IllegalArgumentException("CPF Invalido!"));

        mockMvc.perform(get("/usuarios/1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem").value("CPF Invalido!"));
    }
}
