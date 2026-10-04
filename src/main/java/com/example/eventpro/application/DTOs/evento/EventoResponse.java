package com.example.eventpro.application.DTOs.evento;

import java.util.Date;

import com.example.eventpro.application.DTOs.usuario.UsuarioResponse;
import com.example.eventpro.domain.entities.EnumStatusEvento;
import com.example.eventpro.domain.entities.Evento;

//Estrutura de Retorno evento, Data Transfer Object
// O organizador e devolvido como UsuarioResponse para nunca expor a senha
public record EventoResponse(Long id, String nome, String descricao, Date dataEvento, String local, EnumStatusEvento status, UsuarioResponse organizador) {

    public EventoResponse(Evento entidadeEvento){
        this(
            entidadeEvento.getId(),
            entidadeEvento.getNome(),
            entidadeEvento.getDescricao(),
            entidadeEvento.getDataEvento(),
            entidadeEvento.getLocal(),
            entidadeEvento.getStatus(),
            entidadeEvento.getOrganizador() == null ? null : new UsuarioResponse(entidadeEvento.getOrganizador())
        );
    }
}
