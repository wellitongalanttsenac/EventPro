package com.example.eventpro.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inscricao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomeParticipante;
    private String emailParticipante;
    private LocalDateTime dataInscricao = LocalDateTime.now();
    @Enumerated(EnumType.STRING)
    private EnumStatusInscricao status;

    // Diferencial: código/hash único gerado somente quando a inscrição é confirmada.
    private String credencial;

    // Toda Inscrição pertence a um Evento. Quem gerencia (confirma/cancela) é o
    // Organizador dono do Evento.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "evento_id")
    private Evento evento;
}
