package com.example.eventpro.application.DTOs;

import com.example.eventpro.domain.entities.EnumStatus;
import com.example.eventpro.domain.entities.Usuario;

//Estrutura de Retorno usuario, Data Transfer Object
public record UsuarioResponse(Long id, String nome, String cpf, String email, EnumStatus status) {

    public UsuarioResponse(Usuario entidadeUsuario){
        this(
            entidadeUsuario.getId(),
            entidadeUsuario.getNome(),
            entidadeUsuario.getCpf(),
            entidadeUsuario.getEmail(),
            entidadeUsuario.getStatus()
        );
    }
}
