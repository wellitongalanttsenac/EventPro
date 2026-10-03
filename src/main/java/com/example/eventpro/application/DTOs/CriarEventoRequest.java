package com.example.eventpro.DTOs;

import java.util.Date;

// organizadorId identifica o Usuario (Organizador) que esta criando o Evento.
public record CriarEventoRequest(String nome, String descricao, Date dataEvento, String local, Long organizadorId) {
}
