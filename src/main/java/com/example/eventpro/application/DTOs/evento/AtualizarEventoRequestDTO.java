package com.example.eventpro.application.DTOs.evento;

import java.util.Date;

import com.example.eventpro.domain.entities.EnumStatusEvento;

// Dto para request de Atualizar os dados do evento com todas as informacoes editaveis
public record AtualizarEventoRequestDTO(String nome, String descricao, Date dataEvento, String local, EnumStatusEvento status) {
}
