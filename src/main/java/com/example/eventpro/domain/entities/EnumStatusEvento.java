package com.example.eventpro.domain.entities;

// Ciclo de vida de um Evento (festa, workshop, palestra...).
public enum EnumStatusEvento {
    ABERTO,        // Recém criado, aceitando inscrições.
    EM_ANDAMENTO,  // O evento está acontecendo.
    CONCLUIDO,     // Já terminou.
    CANCELADO,     // Exclusão lógica do evento (DELETE /eventos/{id}/excluir).
}
