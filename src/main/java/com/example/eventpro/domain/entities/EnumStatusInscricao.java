package com.example.eventpro.domain.entities;

// Situação da inscrição de um participante em um evento.
public enum EnumStatusInscricao {
    PENDENTE,    // Toda inscrição nasce assim.
    CONFIRMADA,  // O organizador confirmou; neste momento a credencial é gerada.
    CANCELADA,   // Exclusão lógica da inscrição.
}
