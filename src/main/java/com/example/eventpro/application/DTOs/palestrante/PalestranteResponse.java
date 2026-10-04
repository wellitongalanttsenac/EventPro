package com.example.eventpro.application.DTOs.palestrante;

import com.example.eventpro.domain.entities.Palestrante;

//Estrutura de Retorno palestrante, Data Transfer Object
public record PalestranteResponse(Long id, String nome, String cpf, String email, Long eventoId) {

    public PalestranteResponse(Palestrante entidadePalestrante){
        this(
            entidadePalestrante.getId(),
            entidadePalestrante.getNome(),
            entidadePalestrante.getCpf(),
            entidadePalestrante.getEmail(),
            entidadePalestrante.getEvento() == null ? null : entidadePalestrante.getEvento().getId()
        );
    }
}
