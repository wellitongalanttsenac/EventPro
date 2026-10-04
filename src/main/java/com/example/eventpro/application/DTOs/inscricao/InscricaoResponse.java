package com.example.eventpro.application.DTOs.inscricao;

import java.time.LocalDateTime;

import com.example.eventpro.domain.entities.EnumStatusInscricao;
import com.example.eventpro.domain.entities.Inscricao;

//Estrutura de Retorno inscricao, Data Transfer Object
public record InscricaoResponse(Long id, String nomeParticipante, String emailParticipante, LocalDateTime dataInscricao, EnumStatusInscricao status, String credencial, Long eventoId) {

    public InscricaoResponse(Inscricao entidadeInscricao){
        this(
            entidadeInscricao.getId(),
            entidadeInscricao.getNomeParticipante(),
            entidadeInscricao.getEmailParticipante(),
            entidadeInscricao.getDataInscricao(),
            entidadeInscricao.getStatus(),
            entidadeInscricao.getCredencial(),
            entidadeInscricao.getEvento() == null ? null : entidadeInscricao.getEvento().getId()
        );
    }
}
