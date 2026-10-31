package com.example.eventpro.application.dto.inscricao;

import java.time.LocalDateTime;

import com.example.eventpro.domain.entities.EnumStatusInscricao;
import com.example.eventpro.domain.entities.Inscricao;

// DTO de SAÍDA da inscrição. Devolve só o id do evento (e não o evento inteiro) para o JSON ficar enxuto.
public record InscricaoResponse(Long id, String nomeParticipante, String emailParticipante, LocalDateTime dataInscricao, EnumStatusInscricao status, String credencial, Long eventoId) {

    // Converte a entidade em DTO.
    public InscricaoResponse(Inscricao entidadeInscricao) {
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
