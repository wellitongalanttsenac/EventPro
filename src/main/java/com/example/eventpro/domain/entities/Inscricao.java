// Camada DOMAIN: entidades do negócio.
package com.example.eventpro.domain.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*
 * ENTIDADE Inscricao: um participante inscrito em um evento.
 * É o equivalente à "matrícula" (Usuario x Curso) da referência, só que aqui o participante
 * não é um usuário do sistema: guardamos apenas nome e e-mail dele.
 *
 * Quem usa: InscricaoService.
 */
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
    // Valor padrão: o momento em que o objeto foi criado.
    private LocalDateTime dataInscricao = LocalDateTime.now();
    @Enumerated(EnumType.STRING)
    private EnumStatusInscricao status;

    // Diferencial: código/hash único gerado somente quando a inscrição é confirmada (CredencialService).
    private String credencial;

    // Toda Inscrição pertence a um Evento. Quem gerencia (confirma/cancela) é o
    // Organizador dono do Evento.
    // @ManyToOne(fetch = FetchType.EAGER) EAGER faz com que a entidade seja carregada inteira antes de ser acessada, por padrao ja é EAGER
    // @ManyToOne(fetch = FetchType.LAZY) Faz com que a entidade so seja chamada quando necesario.
    @ManyToOne()
    @JoinColumn(name = "evento_id") // Chave estrangeira para evento.id.
    private Evento evento;
}
