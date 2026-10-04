package com.example.eventpro.application.DTOs.usuario;

import com.example.eventpro.domain.entities.EnumStatus;
import com.example.eventpro.domain.entities.Usuario;

// Dto para request de Atualizar os dados do usuario com todas as informações
public record AtualizarUsuarioRequestDTO(String nome, String senha, String cpf, String email, EnumStatus status) {

    public AtualizarUsuarioRequestDTO(Usuario entidadeUsuario){
        this(
            entidadeUsuario.getNome(),
            entidadeUsuario.getSenha(),
            entidadeUsuario.getCpf(),
            entidadeUsuario.getEmail(),
            entidadeUsuario.getStatus()
        );

    }

}
