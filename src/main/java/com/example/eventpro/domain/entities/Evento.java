// Camada DOMAIN: entidades do negócio.
package com.example.eventpro.domain.entities;

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

import java.util.Date;

/*
 * ENTIDADE Evento: a festa / workshop / palestra que o organizador cria.
 * É a "raiz" do negócio do EventPro: Palestrante e Inscricao sempre pertencem a um Evento.
 *
 * Quem usa: EventoService (CRUD e regra do dono), PalestranteService e InscricaoService.
 */
@Entity             // Vira a tabela "evento".
@Data               // Lombok: getters e setters.
@NoArgsConstructor  // Construtor vazio para o JPA.
@AllArgsConstructor
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // id gerado pelo banco.
    private Long id;
    private String nome;
    private String descricao;
    private Date dataEvento;     // Data e hora do evento.
    private String local;        // Endereço ou plataforma online.
    @Enumerated(EnumType.STRING) // Grava "ABERTO", "CANCELADO"... como texto.
    private EnumStatusEvento status;

    // Regra de negócio central: todo Evento pertence a um Organizador (Usuario).
    // Somente esse Organizador pode gerenciar os Palestrantes e as Inscrições deste Evento.
    // @ManyToOne: muitos eventos para um organizador. EAGER: já carrega o organizador junto com o evento
    // (o EventoResponse sempre mostra o organizador). @JoinColumn cria a coluna "organizador_id".
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organizador_id")
    private Usuario organizador;
}
