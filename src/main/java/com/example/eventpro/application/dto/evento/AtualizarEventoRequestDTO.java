package com.example.eventpro.application.dto.evento;

import java.util.Date;

import com.example.eventpro.domain.entities.EnumStatusEvento;

// DTO de entrada do PUT /eventos/{id}: todas as informações editáveis do evento.
// O Jackson (biblioteca de JSON do Spring) converte o texto do status ("ABERTO") direto para o enum.
public record AtualizarEventoRequestDTO(String nome, String descricao, Date dataEvento, String local, EnumStatusEvento status) {
}
