package com.example.back;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;

class CadastroAdminTest {

    @Test
    void deveAceitarCamposPreenchidosCorretamente() {
        List<String> erros = CadastroAdmin.validar("Admin", "123.456.789-09", "admin@eventpro.com", "senha123");

        assertTrue(erros.isEmpty());
    }

    @Test
    void deveApontarCadaCampoVazio() {
        List<String> erros = CadastroAdmin.validar(" ", "", null, "");

        assertEquals(List.of("Informe o nome.", "Informe o CPF.", "Informe o e-mail.", "Informe a senha."), erros);
    }

    @Test
    void deveRecusarCpfSemOnzeDigitos() {
        List<String> erros = CadastroAdmin.validar("Admin", "123.456", "admin@eventpro.com", "senha123");

        assertEquals(List.of("O CPF precisa ter 11 dígitos."), erros);
    }

    @Test
    void deveRecusarEmailSemArroba() {
        List<String> erros = CadastroAdmin.validar("Admin", "12345678909", "admin.eventpro.com", "senha123");

        assertEquals(List.of("Informe um e-mail válido."), erros);
    }

    @Test
    void deveMontarJsonEscapandoAspasEBarras() {
        String json = CadastroAdmin.montarJson("Ana \"Admin\"", "12345678909", "ana@eventpro.com", "se\\nha", "chave");

        assertEquals("{\"nome\":\"Ana \\\"Admin\\\"\",\"email\":\"ana@eventpro.com\",\"senha\":\"se\\\\nha\","
                + "\"cpf\":\"12345678909\",\"secretKey\":\"chave\"}", json);
    }

    @Test
    void deveExplicarChaveDeAdminInvalida() {
        assertEquals("Chave de criação de admin inválida! Confira a secretKey da API.",
                CadastroAdmin.mensagemDeErro(403, "{\"status\":403,\"mensagem\":\"Chave de criacao de admin invalida!\"}"));
    }

    @Test
    void deveMostrarMensagemDaApiQuandoDadoInvalido() {
        assertEquals("CPF Invalido!",
                CadastroAdmin.mensagemDeErro(400, "{\"timestamp\":\"x\",\"status\":400,\"mensagem\":\"CPF Invalido!\",\"path\":\"/usuarios/admin\"}"));
    }

    @Test
    void deveTerMensagemPadraoQuandoApiNaoExplicaOErro() {
        assertEquals("Erro ao salvar usuário! (HTTP 500)", CadastroAdmin.mensagemDeErro(500, ""));
    }
}
