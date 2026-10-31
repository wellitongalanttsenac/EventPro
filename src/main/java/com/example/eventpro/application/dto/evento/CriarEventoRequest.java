package com.example.eventpro.application.dto.evento;

import java.util.Date;

// DTO de entrada do POST /eventos (o JSON que o front envia vira este record).
// Não tem organizadorId: o dono do evento é sempre o organizador logado (vem do token),
// assim ninguém consegue criar evento em nome de outra pessoa.
public record CriarEventoRequest(String nome, String descricao, Date dataEvento, String local) {
}
