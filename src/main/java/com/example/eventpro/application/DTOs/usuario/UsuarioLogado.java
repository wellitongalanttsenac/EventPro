package com.example.eventpro.application.DTOs.usuario;

import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.valueobject.CPF;

public record UsuarioLogado(Long id, String email, CPF cpf,
                            java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities) {

    public UsuarioLogado(Usuario usuario){
        this(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getCpf(),
                usuario.getAuthorities()
        );
    }
}
