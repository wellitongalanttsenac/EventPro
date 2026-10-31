package com.example.eventpro.application.dto.usuario;

import com.example.eventpro.domain.entities.EnumStatus;
import com.example.eventpro.domain.entities.Usuario;

// DTO de SAÍDA do organizador (igual ao UsuarioResponse da referência).
// Repare que NÃO tem senha: o DTO garante que ela nunca sai da API.
public record UsuarioResponse(Long id, String nome, String cpf, String email, EnumStatus status) {

    // Converte a entidade em DTO. O CPF sai formatado pelo toString() do value object.
    public UsuarioResponse(Usuario entidadeUsuario) {
        this(
                entidadeUsuario.getId(),
                entidadeUsuario.getNome(),
                entidadeUsuario.getCpf() == null ? null : entidadeUsuario.getCpf().toString(),
                entidadeUsuario.getEmail(),
                entidadeUsuario.getStatus()
        );
    }
}
