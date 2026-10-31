package com.example.eventpro.application.dto.palestrante;

import com.example.eventpro.domain.entities.Palestrante;

// DTO de SAÍDA do palestrante, com o id do evento ao qual ele pertence.
public record PalestranteResponse(Long id, String nome, String cpf, String email, Long eventoId) {

    // Converte a entidade em DTO.
    public PalestranteResponse(Palestrante entidadePalestrante) {
        this(
                entidadePalestrante.getId(),
                entidadePalestrante.getNome(),
                entidadePalestrante.getCpf(),
                entidadePalestrante.getEmail(),
                entidadePalestrante.getEvento() == null ? null : entidadePalestrante.getEvento().getId()
        );
    }
}
