package com.example.eventpro.application.DTOs.usuario;

import com.example.eventpro.domain.entities.Usuario;

public record CriarUsuarioRequestDTO(String nome, String senha, String cpf, String email) {

    public CriarUsuarioRequestDTO(Usuario entidadeUsuario){

        this(
            entidadeUsuario.getNome(),
            entidadeUsuario.getSenha(),
            entidadeUsuario.getCpf(),
            entidadeUsuario.getEmail()
        );
    }
}
