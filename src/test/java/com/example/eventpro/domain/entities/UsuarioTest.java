package com.example.eventpro.domain.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import com.example.eventpro.application.DTOs.usuario.CriarAdminRequest;
import com.example.eventpro.application.DTOs.usuario.CriarUsuarioRequestDTO;

class UsuarioTest {

    @Test
    void deveRecusarEmailSemArroba() {
        Usuario usuario = new Usuario();

        assertThrows(IllegalArgumentException.class, () -> usuario.setEmail("email-invalido"));
    }

    @Test
    void deveCriarOrganizadorAPartirDoRequest() {
        var request = new CriarUsuarioRequestDTO("Ana", "senha123", "12345678909", "ana@eventpro.com");

        Usuario usuario = new Usuario(request, "hash-da-senha");

        assertEquals("Ana", usuario.getNome());
        assertEquals("123.456.789-09", usuario.getCpf().toString());
        assertEquals("ana@eventpro.com", usuario.getEmail());
        assertEquals("hash-da-senha", usuario.getSenha());
        assertEquals("ROLE_USER", usuario.getRole());
        assertEquals(EnumStatus.ATIVO, usuario.getStatus());
    }

    @Test
    void deveCriarAdminAPartirDoRequest() {
        var request = new CriarAdminRequest("Admin", "admin@eventpro.com", "senha123", "12345678909", "chave");

        Usuario admin = new Usuario(request, "hash-da-senha");

        assertEquals("ROLE_ADMIN", admin.getRole());
        assertEquals("hash-da-senha", admin.getSenha());
        assertEquals(EnumStatus.ATIVO, admin.getStatus());
    }

    @Test
    void deveRecusarCriacaoComCpfInvalido() {
        var request = new CriarUsuarioRequestDTO("Ana", "senha123", "12345678900", "ana@eventpro.com");

        assertThrows(IllegalArgumentException.class, () -> new Usuario(request, "hash-da-senha"));
    }
}
